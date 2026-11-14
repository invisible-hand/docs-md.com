// One-time migration for the agent-only posting model (2026-11-13). Run against production
// BEFORE deploying the code that needs it, then run the second step AFTER the deploy is live.
//
//   npx tsx scripts/migrate-agents.ts schema      additive: tables, columns, defaults. Safe to repeat.
//                                                  Also fills edit_token_hash for legacy shares.
//   npx tsx scripts/migrate-agents.ts seal        after deploy: removes plaintext edit tokens
//                                                  (the new code compares hashes).
//   npx tsx scripts/migrate-agents.ts status      read-only: what state the database is in.
//
// Every statement is idempotent. Nothing is deleted except, in `seal`, the plaintext copy of a
// token whose hash is already stored.
process.loadEnvFile('.env.production.local');

import { sql } from '@vercel/postgres';
import { createAgentSchema } from '../lib/db';

async function status() {
  const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'shares' ORDER BY ordinal_position`;
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`;
  console.log('tables:', tables.rows.map((r) => r.table_name).join(', '));
  console.log('shares columns:', cols.rows.map((r) => r.column_name).join(', '));
  const has = (c: string) => cols.rows.some((r) => r.column_name === c);
  const total = await sql`SELECT count(*)::int AS n FROM shares`;
  console.log('shares:', total.rows[0].n);
  if (has('edit_token_hash')) {
    const t = await sql`
      SELECT count(*) FILTER (WHERE edit_token IS NOT NULL)::int AS plaintext,
             count(*) FILTER (WHERE edit_token_hash IS NOT NULL)::int AS hashed,
             count(*) FILTER (WHERE agent_id IS NOT NULL)::int AS owned,
             count(*) FILTER (WHERE links_live)::int AS links_live,
             count(*) FILTER (WHERE indexable)::int AS indexable,
             count(*) FILTER (WHERE content IS NOT NULL)::int AS in_row
      FROM shares`;
    console.log('tokens and flags:', t.rows[0]);
    const a = await sql`SELECT count(*)::int AS n FROM agents`;
    console.log('agents:', a.rows[0].n);
  }
}

async function main() {
  const step = process.argv[2];
  if (step === 'schema') {
    await createAgentSchema();
    const hashed = await sql`
      UPDATE shares SET edit_token_hash = encode(sha256(convert_to(edit_token, 'UTF8')), 'hex')
      WHERE edit_token IS NOT NULL AND edit_token_hash IS NULL
    `;
    console.log(`schema applied; edit tokens hashed for ${hashed.rowCount} share(s)`);
  } else if (step === 'seal') {
    const sealed = await sql`UPDATE shares SET edit_token = NULL WHERE edit_token IS NOT NULL AND edit_token_hash IS NOT NULL`;
    console.log(`plaintext edit tokens removed from ${sealed.rowCount} share(s)`);
  } else if (step !== 'status') {
    console.error('usage: tsx scripts/migrate-agents.ts schema | seal | status');
    process.exit(2);
  }
  await status();
}

main().then(() => process.exit(0), (e) => {
  console.error(e);
  process.exit(1);
});
