import { sql } from '@vercel/postgres';

export interface Share {
  id: string;
  filename: string;
  blob_url: string;
  created_at: number;
  // 0 means the share never expires
  expires_at: number;
  edit_token: string | null;
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
