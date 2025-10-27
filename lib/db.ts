import { sql } from '@vercel/postgres';

export interface Share {
  id: string;
  filename: string;
  blob_url: string;
  created_at: number;
  expires_at: number;
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
        expires_at BIGINT NOT NULL
      );
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_expires_at ON shares(expires_at);
    `;
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

export const dbOperations = {
  createShare: async (id: string, filename: string, blobUrl: string): Promise<Share> => {
    const now = Date.now();
    const expiresAt = now + 30 * 24 * 60 * 60 * 1000; // 30 days from now
    
    await sql`
      INSERT INTO shares (id, filename, blob_url, created_at, expires_at) 
      VALUES (${id}, ${filename}, ${blobUrl}, ${now}, ${expiresAt})
    `;
    
    return {
      id,
      filename,
      blob_url: blobUrl,
      created_at: now,
      expires_at: expiresAt,
    };
  },

  getShare: async (id: string): Promise<Share | undefined> => {
    const result = await sql`
      SELECT * FROM shares WHERE id = ${id}
    `;
    return result.rows[0] as Share | undefined;
  },

  deleteShare: async (id: string): Promise<void> => {
    await sql`
      DELETE FROM shares WHERE id = ${id}
    `;
  },

  getExpiredShares: async (): Promise<Share[]> => {
    const now = Date.now();
    const result = await sql`
      SELECT * FROM shares WHERE expires_at < ${now}
    `;
    return result.rows as Share[];
  },

  deleteExpiredShares: async (): Promise<number> => {
    const now = Date.now();
    const result = await sql`
      DELETE FROM shares WHERE expires_at < ${now}
    `;
    return result.rowCount || 0;
  },
};
