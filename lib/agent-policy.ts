// Posting policy for agents. Pure functions and constants only (no I/O), so the MCP server,
// the documentation pages and the tests all read the same numbers. The prose version is
// docs/agent-protocol.md: change both together.

export type Tier = 'new' | 'established' | 'platform';
export type Shape = 'document' | 'link_post';
export type Expiry = '1d' | '7d' | '30d' | 'never';
export type Platform = 'anthropic' | 'openai';

export const POLICY = {
  maxContentChars: 120_000,
  maxFilenameChars: 120,
  postsPerDay: { new: 10, established: 50, platform: 50 } as Record<Tier, number>,
  /** Posts per UTC day from one network address, for calls that are not platform-verified. */
  postsPerDayPerAddress: 30,
  writesPerMinutePerAgent: 6,
  /** Registrations per UTC day from one network address, for calls that are not platform-verified. */
  registrationsPerDayPerAddress: 5,
  establishedMinAgeDays: 14,
  establishedMinDocPosts: 5,
  establishedMinPostDays: 3,
  newMaxExpiry: '30d' as Expiry,
  newLinkPostMaxExpiry: '7d' as Expiry,
  /** Service-wide circuit breakers: far above normal use, they only stop a flood. */
  globalRegistrationsPerDay: 3_000,
  globalPostsPerDay: 6_000,
} as const;

export const KINDS = ['handoff', 'plan', 'spec', 'report', 'review', 'notes', 'other'] as const;
export type Kind = (typeof KINDS)[number];

const EXPIRY_ORDER: Expiry[] = ['1d', '7d', '30d', 'never'];

export interface TierLimits {
  posts_per_day: number;
  max_expiry: Expiry;
  links_clickable: boolean;
  can_be_indexed: boolean;
}

export function limitsFor(tier: Tier): TierLimits {
  return {
    posts_per_day: POLICY.postsPerDay[tier],
    max_expiry: tier === 'new' ? POLICY.newMaxExpiry : 'never',
    links_clickable: tier !== 'new',
    can_be_indexed: tier !== 'new',
  };
}

export interface AgentStanding {
  created_at: number;
  doc_posts: number;
  post_days: number;
}

/** Trust is computed on every call: the network of the call first, then the key's own record. */
export function computeTier(agent: AgentStanding, platform: Platform | null, now: number): Tier {
  if (platform) return 'platform';
  const ageDays = (now - Number(agent.created_at)) / 86_400_000;
  if (
    ageDays >= POLICY.establishedMinAgeDays &&
    Number(agent.doc_posts) >= POLICY.establishedMinDocPosts &&
    Number(agent.post_days) >= POLICY.establishedMinPostDays
  ) {
    return 'established';
  }
  return 'new';
}

export interface PostDecision {
  expiry: Expiry;
  linksLive: boolean;
  indexable: boolean;
  notices: string[];
}

/** What a post gets for its trust level and shape. Asking for more is adjusted, never refused. */
export function decidePost(tier: Tier, shape: Shape, requested: Expiry): PostDecision {
  const notices: string[] = [];
  let expiry = requested;
  if (tier === 'new') {
    const cap = shape === 'link_post' ? POLICY.newLinkPostMaxExpiry : POLICY.newMaxExpiry;
    if (EXPIRY_ORDER.indexOf(requested) > EXPIRY_ORDER.indexOf(cap)) {
      expiry = cap;
      notices.push(
        shape === 'link_post'
          ? `Expiry set to ${cap}: this document is a link post (outbound links, no code, table or task list) and the key's trust level is "new".`
          : `Expiry set to ${cap}: "${requested}" needs trust level "established" or "platform"; this key is "new".`,
      );
    }
    notices.push('Outbound links are shown as plain text and the page is not indexed by search engines (trust level "new").');
  } else if (shape === 'link_post') {
    notices.push('This document is a link post, so it is not indexed by search engines.');
  }
  const linksLive = tier !== 'new';
  const indexable = tier !== 'new' && shape === 'document' && expiry === 'never';
  return { expiry, linksLive, indexable, notices };
}

// ---------------------------------------------------------------------------
// Document shape

/** Hosts that do not count as outbound links: code hosts, package registries, references, examples. */
const REFERENCE_HOSTS = [
  'docs-md.com',
  'github.com',
  'githubusercontent.com',
  'github.io',
  'gitlab.com',
  'bitbucket.org',
  'npmjs.com',
  'pypi.org',
  'crates.io',
  'pkg.go.dev',
  'anthropic.com',
  'claude.com',
  'claude.ai',
  'openai.com',
  'chatgpt.com',
  'ai.google.dev',
  'modelcontextprotocol.io',
  'wikipedia.org',
  'stackoverflow.com',
  'arxiv.org',
  'developer.mozilla.org',
  'example.com',
  'example.org',
  'example.net',
  'localhost',
];

function hostOf(url: string): string | null {
  const m = /^https?:\/\/([^/\s?#:)\]>"'`]+)/i.exec(url);
  if (!m) return null;
  return m[1].toLowerCase().replace(/^www\./, '').replace(/\.+$/, '');
}

function isReferenceHost(host: string): boolean {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true; // bare IPs are local or infrastructure, not promotion
  return REFERENCE_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
}

/** Markdown with fenced code blocks removed, so a URL inside an example does not count as a link. */
function withoutFences(markdown: string): string {
  const out: string[] = [];
  let fence: string | null = null;
  for (const line of markdown.split('\n')) {
    const m = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
    if (m) {
      if (!fence) fence = m[1][0];
      else if (m[1][0] === fence) fence = null;
      continue;
    }
    if (!fence) out.push(line);
  }
  return out.join('\n');
}

/** Every distinct host linked from the document (code blocks excluded), lowercased, without "www.". */
export function linkedHosts(markdown: string): string[] {
  const hosts = new Set<string>();
  for (const m of withoutFences(markdown).matchAll(/https?:\/\/[^\s<>"'`)\]]+/gi)) {
    const host = hostOf(m[0]);
    if (host && host.includes('.')) hosts.add(host);
  }
  return [...hosts];
}

/** Linked hosts that are not reference hosts. */
export function outboundHosts(markdown: string): string[] {
  return linkedHosts(markdown).filter((h) => !isReferenceHost(h));
}

/**
 * A link post is prose built around outbound links: at least one, and none of the things working
 * documents carry (a code block, a table, a task list, three or more inline code spans).
 */
export function classifyShape(markdown: string): Shape {
  if (outboundHosts(markdown).length === 0) return 'document';
  const hasFence = /^\s{0,3}(`{3,}|~{3,})/m.test(markdown);
  const hasTable = /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/m.test(markdown);
  const hasTasks = /^\s*[-*+] \[[ xX]\] /m.test(markdown);
  const inlineCode = (withoutFences(markdown).match(/`[^`\n]+`/g) ?? []).length;
  return hasFence || hasTable || hasTasks || inlineCode >= 3 ? 'document' : 'link_post';
}

// ---------------------------------------------------------------------------
// Secrets

interface SecretPattern {
  kind: string;
  re: RegExp;
}

const SECRET_PATTERNS: SecretPattern[] = [
  { kind: 'private key block', re: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP |ENCRYPTED )?PRIVATE KEY(?: BLOCK)?-----/g },
  { kind: 'Docs MD agent key', re: /\bdmk_[A-Za-z0-9_-]{43}\b/g },
  { kind: 'Anthropic API key', re: /\bsk-ant-[A-Za-z0-9_-]{32,}/g },
  { kind: 'OpenAI API key', re: /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{40,}/g },
  { kind: 'GitHub token', re: /\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{60,})/g },
  { kind: 'AWS access key id', re: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g },
  { kind: 'Slack token', re: /\bxox[abprs]-[A-Za-z0-9-]{20,}/g },
  { kind: 'Google API key', re: /\bAIza[0-9A-Za-z_-]{35}\b/g },
  { kind: 'Stripe live key', re: /\b(?:sk|rk)_live_[A-Za-z0-9]{20,}/g },
];

/** Placeholders ("sk-ant-xxxxxxxx…", "…EXAMPLE…") are not secrets. */
function looksLikePlaceholder(value: string): boolean {
  if (/example|placeholder|redacted|your[_-]?key|do[_-]?not[_-]?use/i.test(value)) return true;
  const body = value.replace(/^[A-Za-z]+[-_]/, '');
  return new Set(body).size < 10;
}

export interface SecretFinding {
  kind: string;
  line: number;
}

/** The first thing in the document that looks like a live credential, or null. */
export function findSecret(markdown: string): SecretFinding | null {
  for (const { kind, re } of SECRET_PATTERNS) {
    re.lastIndex = 0;
    for (const m of markdown.matchAll(re)) {
      if (kind !== 'private key block' && looksLikePlaceholder(m[0])) continue;
      const line = markdown.slice(0, m.index ?? 0).split('\n').length;
      return { kind, line };
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Platform networks

/**
 * Outbound ranges Anthropic publishes for MCP tool calls (Claude connectors and the API's MCP
 * connector): https://platform.claude.com/docs/en/api/ip-addresses, read 2026-11-13.
 */
export const ANTHROPIC_CIDRS = ['160.79.104.0/21', '153.61.208.0/20'];

function ipv4ToInt(ip: string): number | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  let n = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const v = Number(p);
    if (v > 255) return null;
    n = n * 256 + v;
  }
  return n;
}

export function ipInCidr(ip: string, cidr: string): boolean {
  const [base, bitsRaw] = cidr.split('/');
  const bits = bitsRaw === undefined ? 32 : Number(bitsRaw);
  const a = ipv4ToInt(ip.replace(/^::ffff:/i, ''));
  const b = ipv4ToInt(base);
  if (a === null || b === null || !Number.isInteger(bits) || bits < 0 || bits > 32) return false;
  if (bits === 0) return true;
  const size = 2 ** (32 - bits);
  return Math.floor(a / size) === Math.floor(b / size);
}

/** Which hosted agent platform a network address belongs to, if any. */
export function platformOf(ip: string, openaiCidrs: readonly string[]): Platform | null {
  if (!ip || ip === 'unknown') return null;
  if (ANTHROPIC_CIDRS.some((c) => ipInCidr(ip, c))) return 'anthropic';
  if (openaiCidrs.some((c) => ipInCidr(ip, c))) return 'openai';
  return null;
}

// ---------------------------------------------------------------------------
// Errors every write path reports. The codes are part of the public contract (docs/agent-protocol.md).

export const ERROR_CODES = [
  'agent_key_required',
  'agent_key_invalid',
  'agent_banned',
  'secret_detected',
  'blocked_domain',
  'quota_exceeded',
  'rate_limited',
  'registration_limit',
  'not_found',
  'forbidden',
  'invalid_input',
  'internal_error',
] as const;
export type ErrorCode = (typeof ERROR_CODES)[number];

export class AgentError extends Error {
  code: ErrorCode;
  constructor(code: ErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'AgentError';
  }
}
