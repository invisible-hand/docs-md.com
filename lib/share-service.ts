import { createHash, randomBytes } from 'crypto';
import { customAlphabet } from 'nanoid';
import {
  AgentError,
  classifyShape,
  computeTier,
  decidePost,
  findSecret,
  linkedHosts,
  limitsFor,
  POLICY,
  type Expiry,
  type Kind,
  type Platform,
  type Shape,
  type Tier,
  type TierLimits,
} from '@/lib/agent-policy';
import { dbOperations, isExpired, resolveExpiresAt, type Agent, type Share, type ShareListItem } from '@/lib/db';
import { quotaKey } from '@/lib/quota';
import { isValidEditToken, normalizeFilename } from '@/lib/security';
import { invalidateShare } from '@/lib/share-cache';
import { generateSlug } from '@/lib/slug-generator';
import { storageOperations } from '@/lib/storage';

// Everything that changes a share goes through this module. Since 2026-11-13 the only caller is
// the MCP server (lib/mcp/server.ts); the contract is docs/agent-protocol.md.

export const BASE_URL =
  process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production'
    ? 'https://docs-md.com'
    : 'http://localhost:3000';

/** Kept for the legacy REST DELETE route, which maps `status` to the HTTP status. */
export class ShareServiceError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ShareServiceError';
  }
}

/** Who is calling: the network address as the platform saw it, and what that address belongs to. */
export interface Caller {
  ip: string;
  platform: Platform | null;
  ua: string | null;
}

const AGENT_ID_ALPHABET = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const newAgentId = customAlphabet(AGENT_ID_ALPHABET, 16);

export const AGENT_KEY_RE = /^dmk_[A-Za-z0-9_-]{43}$/;

export function hashSecret(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function contentHashOf(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

const shareUrl = (id: string) => `${BASE_URL}/${id}`;
const rawUrl = (id: string) => `${BASE_URL}/raw/${id}`;
const isoOrNull = (ms: number) => (ms === 0 ? null : new Date(ms).toISOString());

async function consumeDaily(scope: string, value: string): Promise<number> {
  return dbOperations.incrementDailyCount(quotaKey(scope, value));
}

// ---------------------------------------------------------------------------
// Agents

export interface RegisteredAgent {
  agent_id: string;
  agent_key: string;
  name: string;
  trust: Tier;
  created_at: string;
  limits: TierLimits;
}

export async function registerAgent(
  input: { name: string; description?: string; client?: string },
  caller: Caller,
): Promise<RegisteredAgent> {
  // Hosted platforms send every user's calls from the same addresses, so the per-address cap
  // would let one user lock out the rest; they are bounded by the service-wide cap instead.
  if (!caller.platform) {
    const perAddress = await consumeDaily('register', caller.ip);
    if (perAddress > POLICY.registrationsPerDayPerAddress) {
      throw new AgentError(
        'registration_limit',
        `This network address already registered ${POLICY.registrationsPerDayPerAddress} agents today. Reuse a key you already have; the limit resets at 00:00 UTC.`,
      );
    }
  }
  if ((await consumeDaily('register-all', 'global')) > POLICY.globalRegistrationsPerDay) {
    throw new AgentError('registration_limit', 'Registration is paused for today (service-wide safety limit). Try again after 00:00 UTC.');
  }

  const now = Date.now();
  const id = `agt_${newAgentId()}`;
  const key = `dmk_${randomBytes(32).toString('base64url')}`;
  await dbOperations.createAgent({
    id,
    name: input.name,
    description: input.description?.trim() || null,
    client: input.client?.trim() || null,
    keyHash: hashSecret(key),
    platform: caller.platform,
    ipHash: quotaKey('agent-origin', caller.ip),
    now,
  });
  const trust = computeTier({ created_at: now, doc_posts: 0, post_days: 0 }, caller.platform, now);
  return { agent_id: id, agent_key: key, name: input.name, trust, created_at: new Date(now).toISOString(), limits: limitsFor(trust) };
}

/** The agent behind a key. Throws the documented error codes for a missing, malformed, unknown or banned key. */
export async function authenticateAgent(agentKey: string | undefined): Promise<Agent> {
  const key = agentKey?.trim();
  if (!key) {
    throw new AgentError('agent_key_required', 'This tool needs agent_key. Call register_agent once, keep the key it returns, and pass it as agent_key.');
  }
  if (!AGENT_KEY_RE.test(key)) {
    throw new AgentError('agent_key_invalid', 'agent_key is malformed. It is the value register_agent returned: "dmk_" followed by 43 characters.');
  }
  const agent = await dbOperations.getAgentByKeyHash(hashSecret(key));
  if (!agent) {
    throw new AgentError('agent_key_invalid', 'Unknown agent_key. Check the stored key; if it is lost, call register_agent again.');
  }
  if (agent.banned_at) {
    throw new AgentError('agent_banned', `This agent was blocked for abuse${agent.ban_reason ? `: ${agent.ban_reason}` : ''}. It cannot post.`);
  }
  return agent;
}

export interface AgentProfile {
  agent_id: string;
  name: string;
  trust: Tier;
  created_at: string;
  posts_today: number;
  live_shares: number;
  limits: TierLimits;
}

export async function describeAgent(agent: Agent, caller: Caller): Promise<AgentProfile> {
  const now = Date.now();
  const trust = computeTier(agent, caller.platform, now);
  const [postsToday, liveShares] = await Promise.all([
    dbOperations.getDailyCount(quotaKey('post-agent', agent.id)),
    dbOperations.countAgentLiveShares(agent.id, now),
  ]);
  return {
    agent_id: agent.id,
    name: agent.name,
    trust,
    created_at: new Date(agent.created_at).toISOString(),
    posts_today: postsToday,
    live_shares: liveShares,
    limits: limitsFor(trust),
  };
}

// ---------------------------------------------------------------------------
// Content checks shared by publish and update

function parentDomains(host: string): string[] {
  const parts = host.split('.');
  const out: string[] = [];
  for (let i = 0; i < parts.length - 1; i++) out.push(parts.slice(i).join('.'));
  return out;
}

async function checkContent(content: string): Promise<Shape> {
  const secret = findSecret(content);
  if (secret) {
    throw new AgentError(
      'secret_detected',
      `Line ${secret.line} looks like a ${secret.kind}. Documents here are public: replace the value with a placeholder (for example the name of the environment variable) and send it again.`,
    );
  }
  const hosts = linkedHosts(content);
  if (hosts.length > 0) {
    const candidates = [...new Set(hosts.flatMap(parentDomains))];
    const blocked = await dbOperations.findBlockedDomains(candidates);
    if (blocked.length > 0) {
      throw new AgentError('blocked_domain', `The document links to ${blocked[0]}, which is on the abuse blocklist. Remove the link and send it again.`);
    }
  }
  return classifyShape(content);
}

async function checkWriteRate(agent: Agent): Promise<void> {
  const windowStart = Math.floor(Date.now() / 60_000) * 60_000;
  const count = await dbOperations.incrementWindowCount(quotaKey('write-agent', agent.id), windowStart);
  if (count > POLICY.writesPerMinutePerAgent) {
    throw new AgentError('rate_limited', `More than ${POLICY.writesPerMinutePerAgent} writes in one minute. Wait a minute and retry.`);
  }
}

// ---------------------------------------------------------------------------
// Publish

export interface PublishedShare {
  id: string;
  url: string;
  raw_url: string;
  expires_at: string | null;
  expiry: Expiry;
  trust: Tier;
  shape: Shape;
  links_clickable: boolean;
  indexable: boolean;
  duplicate: boolean;
  notices: string[];
}

function expiryOf(share: Pick<Share, 'created_at' | 'expires_at'>): Expiry {
  const expiresAt = Number(share.expires_at);
  if (expiresAt === 0) return 'never';
  const days = Math.round((expiresAt - Number(share.created_at)) / 86_400_000);
  return days <= 1 ? '1d' : days <= 7 ? '7d' : '30d';
}

export async function publishAsAgent(
  agent: Agent,
  input: { content: string; filename?: string; expiry: Expiry; kind?: Kind; audience?: string },
  caller: Caller,
): Promise<PublishedShare> {
  const now = Date.now();
  const tier = computeTier(agent, caller.platform, now);
  const shape = await checkContent(input.content);
  const contentHash = contentHashOf(input.content);

  // The same agent sending the same content again (a retry, a loop) gets its existing document back.
  const existing = await dbOperations.findLiveShareByHash(agent.id, contentHash, now);
  if (existing) {
    return {
      id: existing.id,
      url: shareUrl(existing.id),
      raw_url: rawUrl(existing.id),
      expires_at: isoOrNull(Number(existing.expires_at)),
      expiry: expiryOf(existing),
      trust: tier,
      shape: (existing.shape as Shape) ?? shape,
      links_clickable: Boolean(existing.links_live),
      indexable: Boolean(existing.indexable),
      duplicate: true,
      notices: ['You already have a live document with exactly this content; it is returned here and nothing new was created.'],
    };
  }

  await checkWriteRate(agent);
  const limit = POLICY.postsPerDay[tier];
  if ((await consumeDaily('post-agent', agent.id)) > limit) {
    throw new AgentError('quota_exceeded', `This agent reached its ${limit} posts for today (trust level "${tier}"). The limit resets at 00:00 UTC.`);
  }
  if (!caller.platform && (await consumeDaily('post-address', caller.ip)) > POLICY.postsPerDayPerAddress) {
    throw new AgentError('quota_exceeded', `This network address reached ${POLICY.postsPerDayPerAddress} posts for today. The limit resets at 00:00 UTC.`);
  }
  if ((await consumeDaily('post-all', 'global')) > POLICY.globalPostsPerDay) {
    throw new AgentError('quota_exceeded', 'Posting is paused for today (service-wide safety limit). Try again after 00:00 UTC.');
  }

  const decision = decidePost(tier, shape, input.expiry);
  let id = generateSlug();
  for (let attempts = 0; attempts < 5 && (await dbOperations.getShare(id)); attempts++) id = generateSlug();

  const expiresAt = resolveExpiresAt(decision.expiry, now);
  await dbOperations.createAgentShare({
    id,
    filename: normalizeFilename(input.filename),
    content: input.content,
    contentHash,
    expiresAt,
    agentId: agent.id,
    tier,
    linksLive: decision.linksLive,
    indexable: decision.indexable,
    shape,
    kind: input.kind ?? null,
    audience: input.audience?.trim() || null,
    ua: caller.ua,
    now,
  });
  // Clears a cached "not found" in the unlikely case this id was requested before it existed.
  invalidateShare(id);

  return {
    id,
    url: shareUrl(id),
    raw_url: rawUrl(id),
    expires_at: isoOrNull(expiresAt),
    expiry: decision.expiry,
    trust: tier,
    shape,
    links_clickable: decision.linksLive,
    indexable: decision.indexable,
    duplicate: false,
    notices: decision.notices,
  };
}

// ---------------------------------------------------------------------------
// Read, update, delete

// Returns the live (non-expired) share or throws; expired shares are lazily deleted.
export async function getLiveShare(id: string): Promise<Share> {
  const share = await dbOperations.getShare(id);
  if (!share) {
    throw new AgentError('not_found', 'No such document. It may have expired or been deleted.');
  }
  if (isExpired(share, Date.now())) {
    if (share.blob_url) await storageOperations.deleteMarkdown(share.blob_url);
    await dbOperations.deleteShare(id);
    invalidateShare(id);
    throw new AgentError('not_found', 'No such document. It may have expired or been deleted.');
  }
  return share;
}

function legacyTokenMatches(share: Share, editToken: string): boolean {
  if (share.edit_token_hash) return isValidEditToken(hashSecret(editToken), share.edit_token_hash);
  return isValidEditToken(editToken, share.edit_token);
}

/** Who may change a share: its owner agent, or the holder of the edit token of a share created before agents existed. */
export type Credential = { agent: Agent } | { editToken: string };

async function getOwnedShare(id: string, credential: Credential): Promise<Share> {
  const share = await getLiveShare(id);
  if ('agent' in credential) {
    if (!share.agent_id) {
      throw new AgentError('forbidden', 'This document was created before agent keys existed. Pass its edit_token instead of agent_key.');
    }
    if (share.agent_id !== credential.agent.id) {
      throw new AgentError('forbidden', 'This document belongs to another agent. Only its owner can change it.');
    }
    return share;
  }
  if (share.agent_id) {
    throw new AgentError('forbidden', 'This document belongs to an agent. Pass that agent\'s agent_key.');
  }
  if (!legacyTokenMatches(share, credential.editToken)) {
    throw new AgentError('forbidden', 'Invalid edit token.');
  }
  return share;
}

export interface UpdatedShare {
  id: string;
  url: string;
  updated_at: string;
  shape: Shape;
  links_clickable: boolean;
  indexable: boolean;
  notices: string[];
}

export async function updateOwnedShare(
  id: string,
  credential: Credential,
  input: { content: string; filename?: string },
  caller: Caller,
): Promise<UpdatedShare> {
  const share = await getOwnedShare(id, credential);
  const shape = await checkContent(input.content);
  const now = Date.now();

  // An agent's document follows the trust level of this call; a legacy document stays at "new"-level treatment.
  let tier: Tier | null = null;
  let linksLive = false;
  let indexable = false;
  let expiresAt = Number(share.expires_at);
  const notices: string[] = [];
  if ('agent' in credential) {
    await checkWriteRate(credential.agent);
    tier = computeTier(credential.agent, caller.platform, now);
    const decision = decidePost(tier, shape, expiryOf(share));
    linksLive = decision.linksLive;
    indexable = decision.indexable && expiresAt === 0;
    notices.push(...decision.notices.filter((n) => !n.startsWith('Expiry set')));
    // An update never extends or shortens a document, with one exception: a new key cannot turn a
    // 30-day document into a link post and keep the 30 days.
    const linkPostCap = now + 7 * 86_400_000;
    if (tier === 'new' && shape === 'link_post' && (expiresAt === 0 || expiresAt > linkPostCap)) {
      expiresAt = linkPostCap;
      notices.push('Expiry set to 7 days from now: the document is now a link post and the key\'s trust level is "new".');
    }
  } else {
    notices.push('This document predates agent keys: its links are shown as plain text and it is not indexed.');
  }

  await dbOperations.rewriteShare(id, {
    filename: input.filename ? normalizeFilename(input.filename) : share.filename,
    content: input.content,
    contentHash: contentHashOf(input.content),
    shape,
    linksLive,
    indexable,
    tier,
    expiresAt,
    now,
  });
  invalidateShare(id);
  if (share.blob_url) await storageOperations.deleteMarkdown(share.blob_url);

  return { id, url: shareUrl(id), updated_at: new Date(now).toISOString(), shape, links_clickable: linksLive, indexable, notices };
}

export async function deleteOwnedShare(id: string, credential: Credential): Promise<void> {
  const share = await getOwnedShare(id, credential);
  if ('agent' in credential) await checkWriteRate(credential.agent);
  await dbOperations.deleteShare(id);
  invalidateShare(id);
  if (share.blob_url) await storageOperations.deleteMarkdown(share.blob_url);
}

/** Legacy REST DELETE (x-edit-token): the one write the HTTP API still accepts, so old documents can be withdrawn. */
export async function deleteShare(id: string, editToken: string): Promise<void> {
  try {
    await deleteOwnedShare(id, { editToken });
  } catch (error) {
    if (error instanceof AgentError) {
      throw new ShareServiceError(error.message, error.code === 'not_found' ? 404 : 403);
    }
    throw error;
  }
}

export interface ListedShare {
  id: string;
  url: string;
  filename: string;
  kind: string | null;
  created_at: string;
  expires_at: string | null;
}

export async function listOwnShares(agent: Agent, limit: number): Promise<ListedShare[]> {
  const rows: ShareListItem[] = await dbOperations.listAgentShares(agent.id, limit, Date.now());
  return rows.map((r) => ({
    id: r.id,
    url: shareUrl(r.id),
    filename: r.filename,
    kind: r.kind,
    created_at: new Date(r.created_at).toISOString(),
    expires_at: isoOrNull(r.expires_at),
  }));
}
