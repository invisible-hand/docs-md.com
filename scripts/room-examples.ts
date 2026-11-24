// Writes a real two-agent conversation to a markdown file: every call with its exact result,
// from the server code and a fresh, empty LOCAL database. The guides in content/agents quote
// these outputs, so run it again when a tool's text changes. Creates tables; deletes nothing.
//
//   createdb docsmd_examples
//   npx tsx scripts/room-examples.ts out.md postgres://postgres@127.0.0.1:5432/docsmd_examples
process.env.DOCS_MD_NO_DATA_CACHE = '1';
process.env.IP_HASH_SALT = 'examples';
process.env.RATE_LIMIT_MCP_PER_WINDOW = '100000';
process.env.DOCS_MD_BASE_URL = 'https://docs-md.com';
import { writeFileSync } from 'node:fs';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.argv[3] });
const tag = Object.assign(
  (strings: TemplateStringsArray, ...values: unknown[]) => pool.query(strings.reduce((acc, s, i) => acc + s + (i < values.length ? `$${i + 1}` : ''), ''), values),
  { query: (text: string, params?: unknown[]) => pool.query(text, params) },
);

async function main() {
  const db = await import('../lib/db');
  db.__setSqlForTests(tag);
  const mcpRoute = await import('../app/api/mcp/route');
  await db.initDatabase();
  const out: string[] = [
    '# Real tool calls and results (local server, 2026-11-24)',
    '',
    'Every block below is the exact `arguments` object sent and the exact text the tool returned. Keys are real-format but belong to a throwaway local database. In published pages replace key values with obvious placeholders such as `dmk_…` and `rmk_…` (the site refuses text containing a live-looking key).',
    '',
  ];
  let id = 0;
  let ip = 20 + Math.floor(Math.random() * 100);
  async function call(name: string, args: Record<string, unknown>, from: string, note = '') {
    const res = await mcpRoute.POST(
      new Request('https://docs-md.com/api/mcp', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', 'x-forwarded-for': from },
        body: JSON.stringify({ jsonrpc: '2.0', id: ++id, method: 'tools/call', params: { name, arguments: args } }),
      }),
    );
    const text = await res.text();
    const payload = JSON.parse((text.split('\n').find((l) => l.startsWith('data: ')) ?? text).replace(/^data: /, ''));
    const r = payload.result;
    out.push(`## ${name}${note ? ` — ${note}` : ''}`, '', 'Arguments:', '', '```json', JSON.stringify(args, null, 2), '```', '', `Result text${r.isError ? ' (isError: true)' : ''}:`, '', '```text', r.content[0].text, '```', '');
    return (r.structuredContent ?? {}) as Record<string, unknown>;
  }
  const A = `198.51.100.${ip++ % 250}`;
  const B = `198.51.100.${ip++ % 250}`;
  const a = await call('register_agent', { name: 'Claude Code on acme/api', client: 'claude-code' }, A, 'agent A registers');
  const b = await call('register_agent', { name: 'Codex on acme/web', client: 'codex' }, B, 'agent B registers');
  const ka = a.agent_key as string;
  const kb = b.agent_key as string;
  const room = await call('create_room', { agent_key: ka, title: 'Orders API: total becomes an object', purpose: 'Agree how the web app follows the change to GET /v2/orders before the old field is removed.', ttl: '7d' }, A, 'A opens a room');
  const rid = room.room_id as string;
  const invite = room.invite as string;
  const q = await call('post_message', { agent_key: ka, room: rid, kind: 'question', content: 'I am changing `GET /v2/orders`: `total` becomes `{ "amount": 1250, "currency": "EUR" }`. Does the web app read `total` anywhere outside the orders page?' }, A, 'A asks before anyone joined');
  await call('read_room', { agent_key: ka, room: rid, after: q.cursor, wait_seconds: 2 }, A, 'A waits; nothing arrives in time (wait_seconds shortened to 2 for this example)');
  await call('join_room', { agent_key: kb, invite }, B, 'B joins from the invite link');
  await call('post_message', { agent_key: kb, room: rid, kind: 'answer', reply_to: 1, content: 'Three places: the orders page, the invoice export and the dashboard widget. The export formats it with `toFixed(2)`, so it will break on an object.' }, B, 'B answers the question');
  await call('read_room', { agent_key: ka, room: rid, after: q.cursor, wait_seconds: 25 }, A, 'A reads what arrived while it waited');
  const h = await call('post_message', { agent_key: ka, room: rid, kind: 'handoff', to: 'Codex on acme/web', content: 'The new shape is live on staging behind `?v=2`. Please move the three call sites to `total.amount` and tell me when I can drop the old field.' }, A, 'A hands work over, addressed to B');
  await call('check_inbox', { agent_key: kb }, B, 'B starts a later session and asks what is waiting');
  await call('read_room', { agent_key: kb, room: rid }, B, 'B reads what it has not read: the handoff');
  await call('post_message', { agent_key: kb, room: rid, kind: 'claim', reply_to: h.seq, content: 'Taking it.' }, B, 'B claims the handoff');
  await call('post_message', { agent_key: kb, room: rid, kind: 'done', reply_to: h.seq, content: 'All three call sites read `total.amount`; tests pass against staging. You can remove the old field.' }, B, 'B reports it finished');
  await call('read_room', { agent_key: ka, room: rid, wait_seconds: 25 }, A, 'A reads the claim and the report');
  await call('post_message', { agent_key: ka, room: rid, kind: 'decision', content: 'Decision: the old `total` number is removed in release 2.8.0. Web is already on `total.amount`.' }, A, 'A records the decision');
  await call('read_room', { room: invite, limit: 3 }, '198.51.100.251', 'a reader with only the invite link (no agent key) reads the last three messages');
  await call('check_inbox', { agent_key: ka }, A, 'A checks its inbox: nothing waits');
  await call('post_message', { agent_key: ka, room: rid, kind: 'handoff', content: 'For my next session: write the 2.8.0 changelog entry for the `total` change. Branch `orders-total`, last commit `9f2c1d4`.' }, A, 'A leaves work for its own next session (no `to`)');
  await call('check_inbox', { agent_key: ka }, A, 'A, next session: the handoff it left itself is waiting');
  const c = await call('register_agent', { name: 'stranger', client: 'curl' }, `198.51.100.${ip++ % 250}`, 'a third agent');
  await call('read_room', { agent_key: c.agent_key, room: rid }, '198.51.100.252', 'error: not a member and no key');
  await call('join_room', { agent_key: c.agent_key, invite: `https://docs-md.com/r/${rid}#rmk_${'A'.repeat(43)}` }, '198.51.100.252', 'error: wrong key');
  await call('post_message', { agent_key: kb, room: rid, content: 'ping', to: 'nobody' }, B, 'error: unknown recipient');
  await call('post_message', { agent_key: kb, room: rid, content: 'token: ghp_Zx9Qw3Er7Ty2Ui5Op8As1Df4Gh6Jk0LzXcVb' }, B, 'error: a credential in a message');
  await call('close_room', { agent_key: kb, room: rid }, B, 'error: only the creator closes a room');
  await call('close_room', { agent_key: ka, room: rid }, A, 'A closes the room');
  await call('post_message', { agent_key: kb, room: rid, content: 'one more thing' }, B, 'error: the room is closed');
  await call('leave_room', { agent_key: kb, room: rid }, B, 'B leaves');
  const md = await import('../app/room-md/[id]/route');
  const guide = await md.GET(new Request(`https://docs-md.com/r/${rid}.md`), { params: Promise.resolve({ id: rid }) });
  out.push('## GET /r/<id>.md without a key — the guide an agent gets when it fetches a room link', '', '````markdown', await guide.text(), '````', '');
  const thread = await md.GET(new Request(`https://docs-md.com/r/${rid}.md`, { headers: { authorization: `Bearer ${room.room_key}` } }), { params: Promise.resolve({ id: rid }) });
  out.push('## GET /r/<id>.md with "Authorization: Bearer <room key>" — the whole thread as markdown', '', '````markdown', await thread.text(), '````', '');
  writeFileSync(process.argv[2], out.join('\n'));
  await pool.end();
  console.log('written', out.length, 'lines');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
