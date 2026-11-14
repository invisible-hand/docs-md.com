import { sql as vercelSql } from '@vercel/postgres';

type SqlTag = typeof vercelSql;
let sql: SqlTag = vercelSql;

/** Tests point the data layer at a local Postgres (test/agents-db.test.ts). Never called in production. */
export function __setSqlForTests(tag: unknown): void {
  sql = tag as SqlTag;
}

export interface Share {
  id: string;
  filename: string;
  /** Vercel Blob URL of the markdown for shares created before 2026-11-13; null once the content lives in `content`. */
  blob_url: string | null;
  created_at: number;
  // 0 means the share never expires
  expires_at: number;
  /** Plaintext edit token of a legacy share, until scripts/migrate-agents.ts replaces it with the hash. */
  edit_token: string | null;
  /** SHA-256 of the legacy edit token. */
  edit_token_hash?: string | null;
  /** Markdown stored with the row (every share written since 2026-11-13). */
  content?: string | null;
  /** Owner agent; null for legacy shares (those are changed with their edit token). */
  agent_id?: string | null;
  /** Trust level of the call that last wrote the share; null for legacy shares. */
  tier?: string | null;
  /** Outbound links render as <a>. False for legacy shares and for trust level "new". */
  links_live?: boolean;
  /** May be indexed by search engines. False for legacy shares. */
  indexable?: boolean;
  shape?: string | null;
  kind?: string | null;
  audience?: string | null;
  content_hash?: string | null;
  updated_at?: number | null;
  // Which channel created the share (web, tool:<name>, api, mcp, cli, github-action, …) and from where
  client?: string | null;
  ref?: string | null;
  ua?: string | null;
}

export interface ShareOrigin {
  client: string;
  ref?: string | null;
  ua?: string | null;
}

export type ExpiryOption = '1d' | '7d' | '30d' | 'never';

const DAY_MS = 24 * 60 * 60 * 1000;

export const EXPIRY_DURATIONS: Record<ExpiryOption, number> = {
  '1d': DAY_MS,
  '7d': 7 * DAY_MS,
  '30d': 30 * DAY_MS,
  never: 0,
};

export function resolveExpiresAt(expiry: ExpiryOption, now: number): number {
  const duration = EXPIRY_DURATIONS[expiry];
  return duration === 0 ? 0 : now + duration;
}

export function isExpired(share: Pick<Share, 'expires_at'>, now: number): boolean {
  const expiresAt = Number(share.expires_at);
  return expiresAt > 0 && expiresAt < now;
}

// Initialize database schema (run this once)
export async function initDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS shares (
        id TEXT PRIMARY KEY,
        filename TEXT,
        blob_url TEXT NOT NULL,
        created_at BIGINT NOT NULL,
        expires_at BIGINT NOT NULL,
        edit_token TEXT
      );
    `;
    await sql`
      ALTER TABLE shares ADD COLUMN IF NOT EXISTS edit_token TEXT;
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_expires_at ON shares(expires_at);
    `;
    await createQuotaAndReportTables();
    await addShareOriginColumns();
    await createAgentSchema();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Per-day creation counters (keyed by a salted IP hash, never the raw IP) and abuse reports.
export async function createQuotaAndReportTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS share_quota (
      key_hash TEXT NOT NULL,
      day DATE NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (key_hash, day)
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS share_reports (
      id SERIAL PRIMARY KEY,
      share_id TEXT,
      reason TEXT NOT NULL,
      details TEXT,
      contact TEXT,
      created_at BIGINT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open'
    );
  `;
  // Set when the report went out in the daily digest email (app/api/report-digest).
  await sql`ALTER TABLE share_reports ADD COLUMN IF NOT EXISTS notified_at BIGINT;`;
}

// Share channel stats: who created each share, and daily human views of share pages.
export async function addShareOriginColumns() {
  await sql`ALTER TABLE shares ADD COLUMN IF NOT EXISTS client TEXT;`;
  await sql`ALTER TABLE shares ADD COLUMN IF NOT EXISTS ref TEXT;`;
  await sql`ALTER TABLE shares ADD COLUMN IF NOT EXISTS ua TEXT;`;
  await sql`
    CREATE TABLE IF NOT EXISTS share_views_daily (
      day DATE PRIMARY KEY,
      views INTEGER NOT NULL DEFAULT 0
    );
  `;
}

export interface Agent {
  id: string;
  name: string;
  description: string | null;
  client: string | null;
  key_hash: string;
  created_at: number;
  last_seen_at: number | null;
  /** Platform network the agent registered from, if any (informational; trust is computed per call). */
  platform: string | null;
  banned_at: number | null;
  ban_reason: string | null;
  ip_hash: string | null;
  /** Document-shaped posts ever made, and the number of distinct UTC days with one (for "established"). */
  doc_posts: number;
  link_posts: number;
  post_days: number;
}

/**
 * Agent identities, per-agent ownership and policy flags on shares, short rate windows and the
 * abuse blocklist (2026-11-13). Every statement is idempotent and additive: existing rows keep
 * working, and legacy shares get links_live = false / indexable = false from the column defaults.
 */
export async function createAgentSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      client TEXT,
      key_hash TEXT NOT NULL UNIQUE,
      created_at BIGINT NOT NULL,
      last_seen_at BIGINT,
      platform TEXT,
      banned_at BIGINT,
      ban_reason TEXT,
      ip_hash TEXT,
      doc_posts INTEGER NOT NULL DEFAULT 0,
      link_posts INTEGER NOT NULL DEFAULT 0,
      post_days INTEGER NOT NULL DEFAULT 0,
      last_post_day DATE
    );
  `;
  await sql`ALTER TABLE shares ADD COLUMN IF NOT EXISTS agent_id TEXT;`;
  await sql`ALTER TABLE shares ADD COLUMN IF NOT EXISTS content TEXT;`;
  await sql`ALTER TABLE shares ADD COLUMN IF NOT EXISTS tier TEXT;`;
  await sql`ALTER TABLE shares ADD COLUMN IF NOT EXISTS links_live BOOLEAN NOT NULL DEFAULT false;`;
  await sql`ALTER TABLE shares ADD COLUMN IF NOT EXISTS indexable BOOLEAN NOT NULL DEFAULT false;`;
  await sql`ALTER TABLE shares ADD COLUMN IF NOT EXISTS shape TEXT;`;
  await sql`ALTER TABLE shares ADD COLUMN IF NOT EXISTS kind TEXT;`;
  await sql`ALTER TABLE shares ADD COLUMN IF NOT EXISTS audience TEXT;`;
  await sql`ALTER TABLE shares ADD COLUMN IF NOT EXISTS content_hash TEXT;`;
  await sql`ALTER TABLE shares ADD COLUMN IF NOT EXISTS updated_at BIGINT;`;
  await sql`ALTER TABLE shares ADD COLUMN IF NOT EXISTS edit_token_hash TEXT;`;
  await sql`ALTER TABLE shares ALTER COLUMN blob_url DROP NOT NULL;`;
  await sql`CREATE INDEX IF NOT EXISTS idx_shares_agent ON shares(agent_id, created_at DESC) WHERE agent_id IS NOT NULL;`;
  await sql`
    CREATE TABLE IF NOT EXISTS rate_windows (
      key_hash TEXT NOT NULL,
      window_start BIGINT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (key_hash, window_start)
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS blocked_domains (
      domain TEXT PRIMARY KEY,
      reason TEXT,
      added_at BIGINT NOT NULL
    );
  `;
}

export interface NewAgentShare {
  id: string;
  filename: string;
  content: string;
  contentHash: string;
  expiresAt: number;
  agentId: string;
  tier: string;
  linksLive: boolean;
  indexable: boolean;
  shape: string;
  kind: string | null;
  audience: string | null;
  ua: string | null;
  now: number;
}

export interface ShareListItem {
  id: string;
  filename: string;
  kind: string | null;
  created_at: number;
  expires_at: number;
}

export interface ShareReport {
  id: number;
  share_id: string | null;
  reason: string;
  details: string | null;
  contact: string | null;
  created_at: number;
  status: string;
  notified_at: number | null;
}

function normalizeAgent(row: Record<string, unknown> | undefined): Agent | undefined {
  if (!row) return undefined;
  return {
    ...(row as unknown as Agent),
    created_at: Number(row.created_at),
    last_seen_at: row.last_seen_at === null ? null : Number(row.last_seen_at),
    banned_at: row.banned_at === null ? null : Number(row.banned_at),
    doc_posts: Number(row.doc_posts),
    link_posts: Number(row.link_posts),
    post_days: Number(row.post_days),
  };
}

export const dbOperations = {
  createShare: async (
    id: string,
    filename: string,
    blobUrl: string,
    expiry: ExpiryOption = '30d',
    editToken: string | null = null,
    origin: ShareOrigin | null = null
  ): Promise<Share> => {
    const now = Date.now();
    const expiresAt = resolveExpiresAt(expiry, now);

    await sql`
      INSERT INTO shares (id, filename, blob_url, created_at, expires_at, edit_token, client, ref, ua)
      VALUES (${id}, ${filename}, ${blobUrl}, ${now}, ${expiresAt}, ${editToken},
              ${origin?.client ?? null}, ${origin?.ref ?? null}, ${origin?.ua ?? null})
    `;

    return {
      id,
      filename,
      blob_url: blobUrl,
      created_at: now,
      expires_at: expiresAt,
      edit_token: editToken,
    };
  },

  // --- agents -------------------------------------------------------------

  createAgent: async (a: {
    id: string;
    name: string;
    description: string | null;
    client: string | null;
    keyHash: string;
    platform: string | null;
    ipHash: string | null;
    now: number;
  }): Promise<void> => {
    await sql`
      INSERT INTO agents (id, name, description, client, key_hash, created_at, last_seen_at, platform, ip_hash)
      VALUES (${a.id}, ${a.name}, ${a.description}, ${a.client}, ${a.keyHash}, ${a.now}, ${a.now}, ${a.platform}, ${a.ipHash})
    `;
  },

  getAgentByKeyHash: async (keyHash: string): Promise<Agent | undefined> => {
    const result = await sql`SELECT * FROM agents WHERE key_hash = ${keyHash}`;
    return normalizeAgent(result.rows[0]);
  },

  getAgentById: async (id: string): Promise<Agent | undefined> => {
    const result = await sql`SELECT * FROM agents WHERE id = ${id}`;
    return normalizeAgent(result.rows[0]);
  },

  /**
   * Inserts the share and updates its agent's counters in ONE statement, so a share never exists
   * without its bookkeeping (and the other way round). post_days counts distinct UTC days.
   */
  createAgentShare: async (s: NewAgentShare): Promise<void> => {
    const doc = s.shape === 'document' ? 1 : 0;
    await sql`
      WITH ins AS (
        INSERT INTO shares (id, filename, blob_url, content, content_hash, created_at, updated_at, expires_at, edit_token,
                            client, ref, ua, agent_id, tier, links_live, indexable, shape, kind, audience)
        VALUES (${s.id}, ${s.filename}, NULL, ${s.content}, ${s.contentHash}, ${s.now}, ${s.now}, ${s.expiresAt}, NULL,
                'mcp', NULL, ${s.ua}, ${s.agentId}, ${s.tier}, ${s.linksLive}, ${s.indexable}, ${s.shape}, ${s.kind}, ${s.audience})
        RETURNING id
      )
      UPDATE agents SET
        doc_posts = doc_posts + ${doc},
        link_posts = link_posts + ${1 - doc},
        post_days = post_days + CASE WHEN ${doc} = 1 AND last_post_day IS DISTINCT FROM CURRENT_DATE THEN 1 ELSE 0 END,
        last_post_day = CASE WHEN ${doc} = 1 THEN CURRENT_DATE ELSE last_post_day END,
        last_seen_at = ${s.now}
      WHERE id = ${s.agentId} AND EXISTS (SELECT 1 FROM ins)
    `;
  },

  /** The agent's live share with exactly this content, if any (makes retries idempotent). */
  findLiveShareByHash: async (agentId: string, contentHash: string, now: number): Promise<Share | undefined> => {
    const result = await sql`
      SELECT * FROM shares
      WHERE agent_id = ${agentId} AND content_hash = ${contentHash} AND (expires_at = 0 OR expires_at > ${now})
      ORDER BY created_at DESC LIMIT 1
    `;
    return result.rows[0] as Share | undefined;
  },

  listAgentShares: async (agentId: string, limit: number, now: number): Promise<ShareListItem[]> => {
    const result = await sql`
      SELECT id, filename, kind, created_at, expires_at FROM shares
      WHERE agent_id = ${agentId} AND (expires_at = 0 OR expires_at > ${now})
      ORDER BY created_at DESC LIMIT ${limit}
    `;
    return result.rows.map((r) => ({ ...r, created_at: Number(r.created_at), expires_at: Number(r.expires_at) })) as ShareListItem[];
  },

  countAgentLiveShares: async (agentId: string, now: number): Promise<number> => {
    const result = await sql`
      SELECT count(*)::int AS n FROM shares WHERE agent_id = ${agentId} AND (expires_at = 0 OR expires_at > ${now})
    `;
    return Number(result.rows[0]?.n ?? 0);
  },

  /** Replaces a share's content and policy flags. The markdown moves into the row; the caller deletes the old blob. */
  rewriteShare: async (
    id: string,
    u: { filename: string; content: string; contentHash: string; shape: string; linksLive: boolean; indexable: boolean; tier: string | null; expiresAt: number; now: number },
  ): Promise<void> => {
    await sql`
      UPDATE shares SET filename = ${u.filename}, content = ${u.content}, content_hash = ${u.contentHash}, blob_url = NULL,
        shape = ${u.shape}, links_live = ${u.linksLive}, indexable = ${u.indexable}, tier = ${u.tier}, expires_at = ${u.expiresAt}, updated_at = ${u.now}
      WHERE id = ${id}
    `;
  },

  /** Today's value of a daily counter without changing it. */
  getDailyCount: async (keyHash: string): Promise<number> => {
    const result = await sql`SELECT count FROM share_quota WHERE key_hash = ${keyHash} AND day = CURRENT_DATE`;
    return Number(result.rows[0]?.count ?? 0);
  },

  /** Adds one to a short fixed window (e.g. one minute) and returns the new total. */
  incrementWindowCount: async (keyHash: string, windowStart: number): Promise<number> => {
    const result = await sql`
      INSERT INTO rate_windows (key_hash, window_start, count) VALUES (${keyHash}, ${windowStart}, 1)
      ON CONFLICT (key_hash, window_start) DO UPDATE SET count = rate_windows.count + 1
      RETURNING count
    `;
    return Number(result.rows[0]?.count ?? 0);
  },

  pruneRateWindows: async (before: number): Promise<number> => {
    const result = await sql`DELETE FROM rate_windows WHERE window_start < ${before}`;
    return result.rowCount || 0;
  },

  /** Which of these domains (or their parent domains) are on the abuse blocklist. */
  findBlockedDomains: async (domains: string[]): Promise<string[]> => {
    if (domains.length === 0) return [];
    const result = await sql.query('SELECT domain FROM blocked_domains WHERE domain = ANY($1)', [domains]);
    return result.rows.map((r) => String(r.domain));
  },

  // --- shares -------------------------------------------------------------

  getShare: async (id: string): Promise<Share | undefined> => {
    const result = await sql`
      SELECT * FROM shares WHERE id = ${id}
    `;
    return result.rows[0] as Share | undefined;
  },

  updateShare: async (id: string, filename: string, blobUrl: string): Promise<void> => {
    await sql`
      UPDATE shares SET filename = ${filename}, blob_url = ${blobUrl} WHERE id = ${id}
    `;
  },

  deleteShare: async (id: string): Promise<void> => {
    await sql`
      DELETE FROM shares WHERE id = ${id}
    `;
  },

  getExpiredShares: async (): Promise<Share[]> => {
    const now = Date.now();
    const result = await sql`
      SELECT * FROM shares WHERE expires_at > 0 AND expires_at < ${now}
    `;
    return result.rows as Share[];
  },

  deleteExpiredShares: async (): Promise<number> => {
    const now = Date.now();
    const result = await sql`
      DELETE FROM shares WHERE expires_at > 0 AND expires_at < ${now}
    `;
    return result.rowCount || 0;
  },

  deleteSharesByIds: async (ids: string[]): Promise<number> => {
    if (ids.length === 0) return 0;
    const result = await sql.query('DELETE FROM shares WHERE id = ANY($1)', [ids]);
    return result.rowCount || 0;
  },

  /** Adds one to today's counter for this key and returns the new total. */
  incrementDailyCount: async (keyHash: string): Promise<number> => {
    const result = await sql`
      INSERT INTO share_quota (key_hash, day, count)
      VALUES (${keyHash}, CURRENT_DATE, 1)
      ON CONFLICT (key_hash, day) DO UPDATE SET count = share_quota.count + 1
      RETURNING count
    `;
    return Number(result.rows[0]?.count ?? 0);
  },

  recordShareView: async (): Promise<void> => {
    await sql`
      INSERT INTO share_views_daily (day, views) VALUES (CURRENT_DATE, 1)
      ON CONFLICT (day) DO UPDATE SET views = share_views_daily.views + 1
    `;
  },

  pruneDailyCounts: async (): Promise<number> => {
    const result = await sql`
      DELETE FROM share_quota WHERE day < CURRENT_DATE - 1
    `;
    return result.rowCount || 0;
  },

  getUnnotifiedReports: async (): Promise<ShareReport[]> => {
    const result = await sql`
      SELECT * FROM share_reports WHERE notified_at IS NULL ORDER BY created_at
    `;
    return result.rows as ShareReport[];
  },

  markReportsNotified: async (ids: number[]): Promise<void> => {
    if (ids.length === 0) return;
    await sql.query('UPDATE share_reports SET notified_at = $1 WHERE id = ANY($2)', [Date.now(), ids]);
  },

  createReport: async (
    shareId: string | null,
    reason: string,
    details: string | null,
    contact: string | null
  ): Promise<number> => {
    const result = await sql`
      INSERT INTO share_reports (share_id, reason, details, contact, created_at)
      VALUES (${shareId}, ${reason}, ${details}, ${contact}, ${Date.now()})
      RETURNING id
    `;
    return Number(result.rows[0]?.id);
  },
};
