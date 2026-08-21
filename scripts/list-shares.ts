process.loadEnvFile('.env.production.local');

import { sql } from '@vercel/postgres';

async function main() {
  const { rows } = await sql`
    SELECT id, filename, created_at, expires_at, blob_url
    FROM shares ORDER BY created_at DESC LIMIT 15`;
  for (const r of rows) {
    const created = new Date(Number(r.created_at)).toISOString().slice(0, 16);
    const exp = Number(r.expires_at) === 0 ? 'permanent' : new Date(Number(r.expires_at)).toISOString().slice(0, 10);
    console.log(`${r.id}  ${created}  ${exp.padEnd(10)}  ${r.filename}`);
  }
  console.log(`total shown: ${rows.length}`);
}
main().then(() => process.exit(0));
