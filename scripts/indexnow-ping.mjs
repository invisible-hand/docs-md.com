// Post-build: ping IndexNow with every static sitemap URL on production deploys.
import { readFileSync } from 'node:fs';
if (process.env.VERCEL_ENV !== 'production') process.exit(0);
const key = readFileSync('lib/indexnow.ts', 'utf8').match(/INDEXNOW_KEY = '([0-9a-f]+)'/)[1];
const routes = [...readFileSync('app/sitemap.ts', 'utf8').matchAll(/^\s+'([^']*)',$/gm)].map((m) => m[1]);
const host = 'docs-md.com';
const body = { host, key, keyLocation: `https://${host}/${key}.txt`, urlList: routes.map((r) => `https://${host}${r}`) };
try {
  const res = await fetch('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(body), signal: AbortSignal.timeout(5000) });
  console.log(`IndexNow: ${res.status} for ${body.urlList.length} URLs`);
} catch (e) { console.log('IndexNow ping skipped:', e.message); }
