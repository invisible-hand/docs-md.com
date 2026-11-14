// Operator tool: permanently delete a reviewed list of shares (rows and, for legacy shares, blobs).
//
//   npx tsx scripts/delete-shares.ts <file.json>          dry run: how many of the ids exist
//   npx tsx scripts/delete-shares.ts <file.json> --yes    delete them
//
// The file is either a JSON array of ids, or an object whose values have an `ids` array
// (the cluster format of a deletion proposal). Take a backup first; deletion cannot be undone.
// Cached pages of deleted shares disappear within a day, or at once after
// `vercel cache purge --type data`.
process.loadEnvFile('.env.production.local');

import { readFileSync } from 'node:fs';
import { del } from '@vercel/blob';
import { sql } from '@vercel/postgres';

async function main() {
  const [file, flag] = process.argv.slice(2);
  if (!file) throw new Error('usage: tsx scripts/delete-shares.ts <file.json> [--yes]');
  const parsed = JSON.parse(readFileSync(file, 'utf8')) as unknown;
  const ids = [...new Set(Array.isArray(parsed) ? (parsed as string[]) : Object.values(parsed as Record<string, { ids: string[] }>).flatMap((c) => c.ids))];
  const found = await sql.query('SELECT id, blob_url FROM shares WHERE id = ANY($1)', [ids]);
  console.log(`ids in file: ${ids.length}; still in the database: ${found.rows.length}`);
  if (flag !== '--yes') {
    console.log('dry run. Add --yes to delete.');
    return;
  }
  const blobs = found.rows.map((r) => r.blob_url as string | null).filter((u): u is string => Boolean(u));
  for (let i = 0; i < blobs.length; i += 100) await del(blobs.slice(i, i + 100));
  const gone = await sql.query('DELETE FROM shares WHERE id = ANY($1)', [found.rows.map((r) => r.id)]);
  console.log(`deleted ${gone.rowCount} share(s) and ${blobs.length} blob(s)`);
}

main().then(() => process.exit(0), (e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
