// Validates every Discord topic page (lib/discord-guides/<topic>.ts) against the contract in
// docs/discord-guides.md. Runs before `next build`; any problem fails the build.
import { require as tsxRequire } from 'tsx/cjs/api';

const { DISCORD_GUIDES, validateDiscordGuide } = tsxRequire('../lib/discord-guides/index.ts', import.meta.url);

// `--file lib/discord-guides/<slug>.ts` checks one file that is not registered yet (writers use this).
const fileArg = process.argv.indexOf('--file');
if (fileArg > 0) {
  const { resolve } = await import('node:path');
  const one = tsxRequire(resolve(process.argv[fileArg + 1]), import.meta.url).GUIDE;
  const errors = validateDiscordGuide(one, [...DISCORD_GUIDES.filter((x) => x.slug !== one.slug), one]);
  for (const e of errors) console.error(`    - ${e}`);
  console.log(errors.length ? `✗ ${one.slug}: ${errors.length} problem(s)` : `✓ ${one.slug} OK`);
  process.exit(errors.length ? 1 : 0);
}

let failed = 0;
for (const g of DISCORD_GUIDES) {
  const errors = validateDiscordGuide(g, DISCORD_GUIDES);
  if (errors.length) {
    failed++;
    console.error(`✗ lib/discord-guides/${g.slug}.ts`);
    for (const e of errors) console.error(`    - ${e}`);
  }
}
if (failed) {
  console.error(`\ncheck:discord-guides: ${failed} of ${DISCORD_GUIDES.length} topic(s) failed. See docs/discord-guides.md.`);
  process.exit(1);
}
console.log(`check:discord-guides: ${DISCORD_GUIDES.length} topic(s) OK`);
