import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDir, 'shares.db');

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS shares (
    id TEXT PRIMARY KEY,
    filename TEXT,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_expires_at ON shares(expires_at);
`);

export interface Share {
  id: string;
  filename: string;
  created_at: number;
  expires_at: number;
}

export const dbOperations = {
  createShare: (id: string, filename: string): Share => {
    const now = Date.now();
    const expiresAt = now + 30 * 24 * 60 * 60 * 1000; // 30 days from now
    
    const stmt = db.prepare(
      'INSERT INTO shares (id, filename, created_at, expires_at) VALUES (?, ?, ?, ?)'
    );
    stmt.run(id, filename, now, expiresAt);
    
    return {
      id,
      filename,
      created_at: now,
      expires_at: expiresAt,
    };
  },

  getShare: (id: string): Share | undefined => {
    const stmt = db.prepare('SELECT * FROM shares WHERE id = ?');
    return stmt.get(id) as Share | undefined;
  },

  deleteShare: (id: string): void => {
    const stmt = db.prepare('DELETE FROM shares WHERE id = ?');
    stmt.run(id);
  },

  getExpiredShares: (): Share[] => {
    const now = Date.now();
    const stmt = db.prepare('SELECT * FROM shares WHERE expires_at < ?');
    return stmt.all(now) as Share[];
  },

  deleteExpiredShares: (): number => {
    const now = Date.now();
    const stmt = db.prepare('DELETE FROM shares WHERE expires_at < ?');
    const result = stmt.run(now);
    return result.changes;
  },
};

export default db;

