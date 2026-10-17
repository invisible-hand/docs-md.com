// Validates every content/tool-guides/<tool>/<q>.md against the writer contract
// (docs/tool-guides.md). Runs before `next build`; any problem fails the build.
// The rules live in lib/tool-guides.ts (validateToolGuide) so the site and this
// check cannot drift; tsx loads the TypeScript directly.
import { require as tsxRequire } from 'tsx/cjs/api';

const { listToolGuides, validateToolGuide } = tsxRequire('../lib/tool-guides.ts', import.meta.url);

const guides = listToolGuides();
let failed = 0;
for (const guide of guides) {
  const errors = validateToolGuide(guide, guides);
  if (errors.length) {
    failed++;
    console.error(`✗ content/tool-guides/${guide.tool}/${guide.slug}.md`);
    for (const e of errors) console.error(`    - ${e}`);
  }
}
if (failed) {
  console.error(`\ncheck:tool-guides: ${failed} of ${guides.length} tool guide(s) failed. See docs/tool-guides.md.`);
  process.exit(1);
}
console.log(`check:tool-guides: ${guides.length} tool guide(s) OK`);
