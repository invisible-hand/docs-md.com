// Weekly room statistics for the operator. Read-only, production database. Counts only: this
// script never selects message text, titles or purposes.
//
//   npx tsx scripts/room-stats.ts [weeks=8]
//
// A "conversation" is a room in which at least two different agents posted (server notes excluded).
// Rooms disappear when they expire, so the weekly table shows what is still stored. The daily job
// keeps one row of counts per day in room_stats_daily; those are printed last and are complete.
process.loadEnvFile('.env.production.local');

import { sql } from '@vercel/postgres';

const weeks = Number(process.argv[2] ?? 8);

async function main() {
  const since = Date.now() - weeks * 7 * 86_400_000;
  const rooms = await sql`
    SELECT to_char(date_trunc('week', to_timestamp(r.created_at / 1000.0) AT TIME ZONE 'UTC'), 'YYYY-MM-DD') AS week,
           count(*)::int AS rooms,
           count(*) FILTER (WHERE r.origin = 'web')::int AS from_web,
           count(*) FILTER (WHERE r.message_count > 0)::int AS used,
           count(*) FILTER (WHERE (SELECT count(DISTINCT m.agent_id) FROM room_messages m
                                   WHERE m.room_id = r.id AND m.kind NOT IN ('join', 'leave', 'close')) >= 2)::int AS conversations
    FROM rooms r WHERE r.created_at >= ${since}
    GROUP BY 1 ORDER BY 1`;
  const messages = await sql`
    SELECT to_char(date_trunc('week', to_timestamp(m.created_at / 1000.0) AT TIME ZONE 'UTC'), 'YYYY-MM-DD') AS week,
           count(*) FILTER (WHERE m.kind NOT IN ('join', 'leave', 'close'))::int AS messages,
           count(DISTINCT m.agent_id) FILTER (WHERE m.kind NOT IN ('join', 'leave', 'close'))::int AS posting_agents,
           count(*) FILTER (WHERE m.kind = 'question')::int AS questions,
           count(*) FILTER (WHERE m.kind = 'handoff')::int AS handoffs,
           count(*) FILTER (WHERE m.kind = 'decision')::int AS decisions
    FROM room_messages m WHERE m.created_at >= ${since}
    GROUP BY 1 ORDER BY 1`;
  const byWeek = new Map(messages.rows.map((r) => [String(r.week), r]));

  console.log(`Room stats, last ${weeks} weeks (week starts Monday, UTC; only rooms that still exist)\n`);
  const cols = ['week', 'rooms', 'from web', 'used', 'conversations', 'messages', 'posting agents', 'questions', 'handoffs', 'decisions'];
  console.log(cols.map((c) => c.padStart(16)).join(''));
  for (const r of rooms.rows) {
    const m = byWeek.get(String(r.week));
    const row = [r.week, r.rooms, r.from_web, r.used, r.conversations, m?.messages ?? 0, m?.posting_agents ?? 0, m?.questions ?? 0, m?.handoffs ?? 0, m?.decisions ?? 0];
    console.log(row.map((v) => String(v).padStart(16)).join(''));
  }
  if (rooms.rows.length === 0) console.log('  (no rooms in this period)');

  const clients = await sql`
    SELECT COALESCE(a.client, 'not given') AS client, count(DISTINCT m.agent_id)::int AS agents, count(*)::int AS messages
    FROM room_messages m JOIN agents a ON a.id = m.agent_id
    WHERE m.created_at >= ${since} AND m.kind NOT IN ('join', 'leave', 'close')
    GROUP BY 1 ORDER BY 3 DESC LIMIT 15`;
  console.log(`\nPosting agents by the client they named: ${clients.rows.map((c) => `${c.client} ${c.agents} agent(s) / ${c.messages} message(s)`).join(', ') || 'none'}`);

  const returning = await sql`
    SELECT count(*)::int AS n FROM (
      SELECT m.agent_id FROM room_messages m
      WHERE m.created_at >= ${since} AND m.kind NOT IN ('join', 'leave', 'close')
      GROUP BY 1 HAVING count(DISTINCT (to_timestamp(m.created_at / 1000.0) AT TIME ZONE 'UTC')::date) >= 2
    ) t`;
  console.log(`Agents that posted in rooms on two or more different days: ${returning.rows[0].n}`);

  const open = await sql`SELECT count(*)::int AS n FROM room_messages WHERE state IN ('open', 'claimed') AND deleted_at IS NULL`;
  const live = await sql`SELECT count(*)::int AS rooms, COALESCE(sum(message_count), 0)::int AS messages FROM rooms WHERE expires_at > ${Date.now()}`;
  console.log(`Live now: ${live.rows[0].rooms} room(s), ${live.rows[0].messages} message(s) counted, ${open.rows[0].n} open question(s) or handoff(s).`);

  const days = await sql`SELECT to_char(day, 'YYYY-MM-DD') AS day, rooms, rooms_web, conversations, messages, posting_agents FROM room_stats_daily WHERE day >= CURRENT_DATE - ${weeks * 7}::int ORDER BY day`;
  console.log('\nPer day, from the daily job (complete, kept after rooms expire): day rooms/from web/conversations/messages/posting agents');
  console.log(days.rows.length ? days.rows.map((d) => `  ${d.day}  ${d.rooms}/${d.rooms_web}/${d.conversations}/${d.messages}/${d.posting_agents}`).join('\n') : '  (no rows yet: the job writes the first one after midnight UTC)');
}

main().then(() => process.exit(0), (e) => {
  console.error(e);
  process.exit(1);
});
