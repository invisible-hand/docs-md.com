// Weekly share-channel stats for /seo-week. Run: npx tsx scripts/share-stats.ts [weeks=8]
// Channels come from shares.client (recorded since 2026-10-20; older rows show as "unrecorded").
// Views are human page views of share pages (share_views_daily, crawlers and scripts excluded).
process.loadEnvFile('.env.production.local');

import { sql } from '@vercel/postgres';

const weeks = Number(process.argv[2] ?? 8);

function channel(client: string | null): string {
  if (!client) return 'unrecorded';
  if (client === 'web') return 'web';
  if (client.startsWith('tool:')) return 'tools';
  if (client === 'mcp') return 'mcp';
  if (client === 'cli') return 'cli';
  if (client === 'github-action') return 'action';
  if (client === 'api') return 'api';
  return 'named-api'; // a client= the caller chose (agents, skills, scripts)
}

async function main() {
  const since = Date.now() - weeks * 7 * 86_400_000;
  const { rows } = await sql`
    SELECT to_char(date_trunc('week', to_timestamp(created_at / 1000.0) AT TIME ZONE 'UTC'), 'YYYY-MM-DD') AS week,
           client, ref, ua, (expires_at = 0) AS permanent, count(*)::int AS n
    FROM shares WHERE created_at >= ${since}
    GROUP BY 1, 2, 3, 4, 5 ORDER BY 1`;
  const views = await sql`
    SELECT to_char(date_trunc('week', day), 'YYYY-MM-DD') AS week, sum(views)::int AS views
    FROM share_views_daily WHERE day >= CURRENT_DATE - ${weeks * 7}::int GROUP BY 1`;
  const viewsByWeek = new Map(views.rows.map((r) => [r.week as string, Number(r.views)]));

  const cols = ['web', 'tools', 'mcp', 'cli', 'action', 'api', 'named-api', 'unrecorded'];
  const byWeek = new Map<string, Record<string, number>>();
  const named = new Map<string, number>();
  const uaFamilies = new Map<string, number>();
  for (const r of rows) {
    const w = byWeek.get(r.week) ?? Object.fromEntries([...cols, 'total', 'permanent', 'fromShares'].map((c) => [c, 0]));
    const ch = channel(r.client);
    w[ch] += r.n;
    w.total += r.n;
    if (r.permanent) w.permanent += r.n;
    if (r.ref === 'share-banner' || r.ref === 'share-nav' || r.ref === 'duplicate') w.fromShares += r.n;
    byWeek.set(r.week, w);
    if (ch === 'named-api') named.set(r.client, (named.get(r.client) ?? 0) + r.n);
    if ((ch === 'api' || ch === 'mcp') && r.ua) uaFamilies.set(`${ch}:${r.ua}`, (uaFamilies.get(`${ch}:${r.ua}`) ?? 0) + r.n);
  }

  console.log(`Share stats, last ${weeks} weeks (week starts Monday, UTC)\n`);
  console.log(['week', ...cols, 'total', 'perm%', 'views', 'from-shares', 'conv%'].map((h) => h.padStart(11)).join(''));
  for (const [week, w] of [...byWeek].sort()) {
    const v = viewsByWeek.get(week) ?? 0;
    const conv = v ? ((w.fromShares / v) * 100).toFixed(1) : '-';
    console.log(
      [week, ...cols.map((c) => w[c]), w.total, Math.round((w.permanent / w.total) * 100), v || '-', w.fromShares, conv]
        .map((x) => String(x).padStart(11))
        .join('')
    );
  }
  const top = (m: Map<string, number>) => [...m].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, n]) => `${k} ${n}`).join(', ');
  console.log(`\nNamed clients: ${top(named) || 'none yet'}`);
  console.log(`API/MCP user agents: ${top(uaFamilies) || 'none yet'}`);
  console.log('\nfrom-shares = new shares whose author arrived from a share page (banner, nav link, Duplicate & edit); conv% = from-shares / views.');
}

main().then(() => process.exit(0));
