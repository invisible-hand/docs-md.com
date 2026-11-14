// Operator tool for agent identities and the domain blocklist. Works on the production database.
//
//   npx tsx scripts/agents.ts list [n]                     newest n agents (default 30) with their counters
//   npx tsx scripts/agents.ts show <agent_id>              one agent and its live documents
//   npx tsx scripts/agents.ts ban <agent_id> "<reason>"    the agent can no longer post (its documents stay)
//   npx tsx scripts/agents.ts unban <agent_id>
//   npx tsx scripts/agents.ts purge <agent_id> --yes       delete every document of the agent (irreversible)
//   npx tsx scripts/agents.ts block <domain> "<reason>"    posts linking to the domain (or a subdomain) are refused
//   npx tsx scripts/agents.ts unblock <domain>
//   npx tsx scripts/agents.ts blocked                      the blocklist
process.loadEnvFile('.env.production.local');

import { sql } from '@vercel/postgres';

const day = (ms: unknown) => (ms ? new Date(Number(ms)).toISOString().slice(0, 16).replace('T', ' ') : '-');

async function main() {
  const [cmd, arg, extra] = process.argv.slice(2);
  if (cmd === 'list') {
    const n = Number(arg ?? 30);
    const { rows } = await sql`SELECT id, name, client, platform, created_at, last_seen_at, doc_posts, link_posts, post_days, banned_at FROM agents ORDER BY created_at DESC LIMIT ${n}`;
    for (const a of rows) {
      console.log(`${a.id}  ${day(a.created_at)}  docs ${a.doc_posts} / links ${a.link_posts} / days ${a.post_days}  ${a.platform ?? '-'}  ${a.banned_at ? 'BANNED ' : ''}${a.name}${a.client ? `  (${a.client})` : ''}`);
    }
    const total = await sql`SELECT count(*)::int AS n, count(*) FILTER (WHERE banned_at IS NOT NULL)::int AS banned FROM agents`;
    console.log(`agents: ${total.rows[0].n} (${total.rows[0].banned} banned)`);
  } else if (cmd === 'show' && arg) {
    const a = await sql`SELECT id, name, description, client, platform, created_at, last_seen_at, doc_posts, link_posts, post_days, banned_at, ban_reason FROM agents WHERE id = ${arg}`;
    if (!a.rows[0]) throw new Error(`no agent ${arg}`);
    console.log(a.rows[0]);
    const s = await sql`SELECT id, filename, shape, tier, links_live, indexable, created_at, expires_at FROM shares WHERE agent_id = ${arg} ORDER BY created_at DESC LIMIT 100`;
    for (const r of s.rows) console.log(`  https://docs-md.com/${r.id}  ${day(r.created_at)}  ${r.shape}/${r.tier}  ${r.indexable ? 'indexable' : 'noindex'}  expires ${Number(r.expires_at) === 0 ? 'never' : day(r.expires_at)}  ${r.filename}`);
  } else if (cmd === 'ban' && arg) {
    const r = await sql`UPDATE agents SET banned_at = ${Date.now()}, ban_reason = ${extra ?? null} WHERE id = ${arg}`;
    console.log(`banned: ${r.rowCount}`);
  } else if (cmd === 'unban' && arg) {
    const r = await sql`UPDATE agents SET banned_at = NULL, ban_reason = NULL WHERE id = ${arg}`;
    console.log(`unbanned: ${r.rowCount}`);
  } else if (cmd === 'purge' && arg) {
    const n = await sql`SELECT count(*)::int AS n FROM shares WHERE agent_id = ${arg}`;
    if (extra !== '--yes') {
      console.log(`would delete ${n.rows[0].n} document(s) of ${arg}; add --yes to do it`);
    } else {
      const r = await sql`DELETE FROM shares WHERE agent_id = ${arg}`;
      console.log(`deleted ${r.rowCount} document(s). Cached pages disappear within a day; the rows are gone now.`);
    }
  } else if (cmd === 'block' && arg) {
    const domain = arg.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
    await sql`INSERT INTO blocked_domains (domain, reason, added_at) VALUES (${domain}, ${extra ?? null}, ${Date.now()}) ON CONFLICT (domain) DO UPDATE SET reason = EXCLUDED.reason`;
    console.log(`blocked: ${domain}`);
  } else if (cmd === 'unblock' && arg) {
    const r = await sql`DELETE FROM blocked_domains WHERE domain = ${arg.toLowerCase()}`;
    console.log(`unblocked: ${r.rowCount}`);
  } else if (cmd === 'blocked') {
    const { rows } = await sql`SELECT domain, reason, added_at FROM blocked_domains ORDER BY added_at DESC`;
    for (const r of rows) console.log(`${r.domain}  ${day(r.added_at)}  ${r.reason ?? ''}`);
    console.log(`blocked domains: ${rows.length}`);
  } else {
    console.error('usage: tsx scripts/agents.ts list [n] | show <id> | ban <id> "<reason>" | unban <id> | purge <id> --yes | block <domain> "<reason>" | unblock <domain> | blocked');
    process.exit(2);
  }
}

main().then(() => process.exit(0), (e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
