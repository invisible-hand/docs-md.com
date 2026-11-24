// Creates the schema in a local Postgres for `LOCAL_PG_URL=… npm run dev`. Additive and repeatable.
//   LOCAL_PG_URL=postgres://postgres@127.0.0.1:5432/docsmd_dev npx tsx scripts/local-db.ts
import { initDatabase } from '../lib/db';

if (!process.env.LOCAL_PG_URL) {
  console.error('Set LOCAL_PG_URL to a database on this machine.');
  process.exit(2);
}
initDatabase().then(() => {
  console.log('local schema ready');
  process.exit(0);
});
