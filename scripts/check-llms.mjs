// Every indexable page must be listed in /llms.txt, so a model that reads the index can find it.
// Compares the sitemap (lib/sitemap-entries.ts) with the links llms.txt prints. The guides for
// agents are linked there in their markdown form (/agents/<slug>.md), which counts as listed.
// Runs before `next build`; a missing page fails the build.
import { require as tsxRequire } from 'tsx/cjs/api';

const { sitemapEntries } = tsxRequire('../lib/sitemap-entries.ts', import.meta.url);
const { GET } = tsxRequire('../app/llms.txt/route.ts', import.meta.url);

const text = await GET().text();
const listed = new Set([...text.matchAll(/\]\(https:\/\/docs-md\.com([^)\s]*)\)/g)].map((m) => m[1].replace(/\.md$/, '').replace(/\/$/, '')));
const missing = sitemapEntries()
  .map((e) => e.path)
  .filter((path) => !listed.has(path) && !(path === '' && listed.has('')));
if (missing.length) {
  console.error(`check:llms: ${missing.length} sitemap page(s) are not listed in llms.txt:`);
  for (const m of missing) console.error(`    - ${m || '/'}`);
  process.exit(1);
}
console.log(`check:llms: all ${sitemapEntries().length} sitemap pages are listed in llms.txt (${text.length} bytes)`);
