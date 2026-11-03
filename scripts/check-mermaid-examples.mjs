// Validates every "Mermaid <chart> examples" page (lib/mermaid-examples/<slug>.ts) against
// docs/mermaid-examples.md. Runs before `next build`; any problem fails the build.
import { require as tsxRequire } from 'tsx/cjs/api';

const { MERMAID_PAGES, validateMermaidPage } = tsxRequire('../lib/mermaid-examples/index.ts', import.meta.url);

// `--file lib/mermaid-examples/<slug>.ts` checks one file that is not registered yet (writers use this).
const fileArg = process.argv.indexOf('--file');
if (fileArg > 0) {
  const { resolve } = await import('node:path');
  const one = tsxRequire(resolve(process.argv[fileArg + 1]), import.meta.url).PAGE;
  const errors = validateMermaidPage(one, [...MERMAID_PAGES.filter((x) => x.slug !== one.slug), one]);
  for (const e of errors) console.error(`    - ${e}`);
  console.log(errors.length ? `✗ ${one.slug}: ${errors.length} problem(s)` : `✓ ${one.slug} OK`);
  process.exit(errors.length ? 1 : 0);
}

let failed = 0;
for (const p of MERMAID_PAGES) {
  const errors = validateMermaidPage(p, MERMAID_PAGES);
  if (errors.length) {
    failed++;
    console.error(`✗ lib/mermaid-examples/${p.slug}.ts`);
    for (const e of errors) console.error(`    - ${e}`);
  }
}
if (failed) {
  console.error(`\ncheck:mermaid-examples: ${failed} of ${MERMAID_PAGES.length} page(s) failed. See docs/mermaid-examples.md.`);
  process.exit(1);
}
console.log(`check:mermaid-examples: ${MERMAID_PAGES.length} page(s) OK`);
