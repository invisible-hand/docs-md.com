import { sql } from '@vercel/postgres';

export interface Share {
  id: string;
  filename: string;
  blob_url: string;
  created_at: number;
  // 0 means the share never expires
  expires_at: number;
  edit_token: string | null;
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
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

export const dbOperations = {
  createShare: async (
    id: string,
    filename: string,
    blobUrl: string,
    expiry: ExpiryOption = '30d',
    editToken: string | null = null
  ): Promise<Share> => {
    const now = Date.now();
    const expiresAt = resolveExpiresAt(expiry, now);

    await sql`
      INSERT INTO shares (id, filename, blob_url, created_at, expires_at, edit_token)
      VALUES (${id}, ${filename}, ${blobUrl}, ${now}, ${expiresAt}, ${editToken})
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
};
