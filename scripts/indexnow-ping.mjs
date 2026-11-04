// Post-build on production deploys: tell IndexNow which URLs changed in this deploy.
//
// The sitemap that is live while this runs is still the previous deploy's, so diffing the
// just-built URL list (lib/sitemap-entries.ts, the same source app/sitemap.ts renders) against
// it yields exactly the URLs that are new or whose <lastmod> moved. Only those are pinged.
// If the live sitemap cannot be read, every URL is pinged once with a warning. Never fails
// the build. `--dry-run` prints the diff against the live sitemap without pinging (any env).
import { readFileSync } from 'node:fs';
import { require as tsxRequire } from 'tsx/cjs/api';

const DRY_RUN = process.argv.includes('--dry-run');
if (!DRY_RUN && process.env.VERCEL_ENV !== 'production') process.exit(0);

const HOST = 'docs-md.com';
const MAX_URLS = 10_000; // IndexNow's per-request cap
const key = readFileSync('lib/indexnow.ts', 'utf8').match(/INDEXNOW_KEY = '([0-9a-f]+)'/)[1];

const { SITE_URL, sitemapEntries } = tsxRequire('../lib/sitemap-entries.ts', import.meta.url);
const built = sitemapEntries().map((e) => ({ url: `${SITE_URL}${e.path}`, updated: e.updated }));

/** url -> lastmod (YYYY-MM-DD) from the live sitemap, or null when it could not be read. */
async function liveSitemap() {
  try {
    const res = await fetch(`${SITE_URL}/sitemap.xml`, { signal: AbortSignal.timeout(10_000), headers: { 'User-Agent': 'docs-md-indexnow-diff' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const map = new Map();
    for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const loc = m[1].match(/<loc>\s*([^<\s]+)\s*<\/loc>/)?.[1];
      const lastmod = m[1].match(/<lastmod>\s*([^<\s]+)\s*<\/lastmod>/)?.[1] ?? '';
      if (loc) map.set(loc.replace(/\/$/, ''), lastmod.slice(0, 10));
    }
    if (!map.size) throw new Error('no <url> entries');
    return map;
  } catch (e) {
    console.warn(`IndexNow: could not read the live sitemap (${e.message}); pinging every URL once`);
    return null;
  }
}

const live = await liveSitemap();
const changed = live
  ? built.filter(({ url, updated }) => {
      const before = live.get(url.replace(/\/$/, ''));
      return before === undefined || updated > before;
    })
  : built;
const urlList = changed.map((e) => e.url).slice(0, MAX_URLS);
console.log(`IndexNow: ${urlList.length} changed of ${built.length}`);

if (DRY_RUN) {
  for (const e of changed.slice(0, MAX_URLS)) console.log(`  ${e.url}  ${live?.get(e.url) ?? '(new)'} -> ${e.updated}`);
  process.exit(0);
}
if (!urlList.length) process.exit(0);

const body = { host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList };
try {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  });
  console.log(`IndexNow: ${res.status} for ${urlList.length} URLs`);
} catch (e) {
  console.log('IndexNow ping skipped:', e.message);
}
