// Validates the /agents/<slug> pages: frontmatter limits, at least three question H2s, links and
// `related` that resolve, one group per page (lib/agent-pages.ts validateAgentPage). Runs before
// `next build`; any problem fails the build.
import { require as tsxRequire } from 'tsx/cjs/api';

const { listAgentPages, validateAgentPage, AGENT_PAGE_GROUPS } = tsxRequire('../lib/agent-pages.ts', import.meta.url);

const pages = listAgentPages();
const slugs = pages.map((p) => p.slug);
let failed = 0;
for (const page of pages) {
  const errors = validateAgentPage(page, slugs);
  if (errors.length) {
    failed++;
    console.error(`✗ agents/${page.slug}`);
    for (const e of errors) console.error(`    - ${e}`);
  }
}
for (const slug of AGENT_PAGE_GROUPS.flatMap((g) => g.slugs)) {
  if (!slugs.includes(slug)) {
    failed++;
    console.error(`✗ AGENT_PAGE_GROUPS lists "${slug}", which has no page`);
  }
}
if (failed) {
  console.error(`\ncheck:agent-pages: ${failed} problem(s) in ${pages.length} page(s).`);
  process.exit(1);
}
console.log(`check:agent-pages: ${pages.length} page(s) OK`);
