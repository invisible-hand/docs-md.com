// Validates every content/guides/<slug>.md frontmatter (title and description lengths, date,
// related paths). Runs before `next build`; any problem fails the build. The rules live in
// lib/guides.ts (validateGuide) so the site and this check cannot drift.
import { require as tsxRequire } from 'tsx/cjs/api';

const { listGuides, validateGuide } = tsxRequire('../lib/guides.ts', import.meta.url);

const guides = listGuides();
let failed = 0;
for (const guide of guides) {
  const errors = validateGuide(guide);
  if (errors.length) {
    failed++;
    console.error(`✗ content/guides/${guide.slug}.md`);
    for (const e of errors) console.error(`    - ${e}`);
  }
}
if (failed) {
  console.error(`\ncheck:guides: ${failed} of ${guides.length} guide(s) failed.`);
  process.exit(1);
}
console.log(`check:guides: ${guides.length} guide(s) OK`);
