// Schema for rooms (2026-11-24): four new tables (rooms, room_messages, room_members, room_stats_daily) and their indexes. Run against production
// BEFORE deploying the code that needs them.
//
//   npx tsx scripts/migrate-rooms.ts schema    additive: CREATE TABLE / INDEX IF NOT EXISTS. Safe to repeat.
//   npx tsx scripts/migrate-rooms.ts status    read-only: which room tables exist and how many rows they hold.
//
// Nothing that exists is altered and nothing is deleted.
process.loadEnvFile('.env.production.local');

import { sql } from '@vercel/postgres';
import { createRoomSchema } from '../lib/room-db';

async function status() {
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('rooms', 'room_messages', 'room_members', 'room_stats_daily') ORDER BY table_name`;
  const names = tables.rows.map((r) => String(r.table_name));
  console.log('room tables:', names.length ? names.join(', ') : 'none');
  if (names.length === 4) {
    const r = await sql`SELECT (SELECT count(*)::int FROM rooms) AS rooms, (SELECT count(*)::int FROM room_messages) AS messages, (SELECT count(*)::int FROM room_members) AS members, (SELECT count(*)::int FROM room_stats_daily) AS stat_days`;
    console.log('rows:', r.rows[0]);
  }
}

async function main() {
  const step = process.argv[2];
  if (step === 'schema') {
    await createRoomSchema();
    console.log('room schema applied');
  } else if (step !== 'status') {
    console.error('usage: tsx scripts/migrate-rooms.ts schema | status');
    process.exit(2);
  }
  await status();
}

main().then(() => process.exit(0), (e) => {
  console.error(e);
  process.exit(1);
});
