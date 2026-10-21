// Validates content/i18n/<locale>/<page>.json (see lib/i18n.ts) before `next build`:
// slugs match LOCALIZED_SLUGS, length limits, required fields, internal links resolve,
// and translated cheat sheets keep the English section ids and snippet counts.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { require as tsxRequire } from 'tsx/cjs/api';

const { LOCALES, LOCALIZED_SLUGS } = tsxRequire('../lib/i18n.ts', import.meta.url);
const { CHEAT_SHEET_SECTIONS, CHEAT_SHEET_GLANCE } = tsxRequire('../lib/cheat-sheet.ts', import.meta.url);

const errors = [];
const pages = [];
for (const locale of LOCALES) {
  const dir = join('content/i18n', locale);
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const where = `${dir}/${file}`;
    let c;
    try {
      c = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    } catch (e) {
      errors.push(`${where}: invalid JSON (${e.message})`);
      continue;
    }
    const page = file.replace(/\.json$/, '');
    const err = (m) => errors.push(`${where}: ${m}`);
    if (c.locale !== locale) err(`locale "${c.locale}" must be "${locale}"`);
    if (c.page !== page) err(`page "${c.page}" must be "${page}"`);
    if (!LOCALIZED_SLUGS[page]) err(`unknown page "${page}"`);
    else if (c.slug !== LOCALIZED_SLUGS[page][locale]) err(`slug "${c.slug}" must be "${LOCALIZED_SLUGS[page][locale]}"`);
    for (const k of ['title', 'description', 'h1', 'intro', 'updated']) if (!c[k]) err(`"${k}" is missing`);
    if (c.title?.length > 60) err(`title is ${c.title.length} chars (max 60)`);
    if (c.description?.length > 155) err(`description is ${c.description.length} chars (max 155)`);
    if (!Array.isArray(c.faq) || c.faq.length < 4) err('needs at least 4 FAQ entries');
    for (const k of ['updated', 'faqTitle', 'otherLanguages', 'copy', 'copied']) if (!c.chrome?.[k]) err(`chrome.${k} is missing`);
    if (page === 'markdown-viewer') {
      if (!c.starter) err('"starter" is missing');
      if (!Array.isArray(c.sections) || c.sections.length < 4) err('needs at least 4 sections');
    }
    if (page === 'markdown-cheat-sheet') {
      if (c.glance?.length !== CHEAT_SHEET_GLANCE.length) err(`glance has ${c.glance?.length} rows (English: ${CHEAT_SHEET_GLANCE.length})`);
      const ids = (c.sections ?? []).map((s) => s.id).join(',');
      if (ids !== CHEAT_SHEET_SECTIONS.map((s) => s.id).join(',')) err('section ids/order differ from the English cheat sheet');
      (c.sections ?? []).forEach((s, i) => {
        const en = CHEAT_SHEET_SECTIONS[i];
        if (en && s.snippets?.length !== en.snippets.length) err(`section ${s.id}: ${s.snippets?.length} snippets (English: ${en.snippets.length})`);
      });
      for (const k of ['glanceTitle', 'glanceElement', 'glanceSyntax', 'glanceNote']) if (!c.chrome?.[k]) err(`chrome.${k} is missing`);
    }
    pages.push({ path: `/${locale}/${c.slug}`, text: JSON.stringify(c), err });
  }
}

// Internal links ](/path) must resolve to an app route, a tool guide or a translated page.
const known = new Set(pages.map((p) => p.path));
const exists = (path) => {
  const clean = path.replace(/[#?].*$/, '').replace(/\/+$/, '');
  if (clean === '' || known.has(clean)) return true;
  const parts = clean.split('/').filter(Boolean);
  if (parts.length === 2 && existsSync(join('content/tool-guides', parts[0], `${parts[1]}.md`))) return true;
  if (parts[0] === 'guides' && parts.length === 2) return existsSync(join('content/guides', `${parts[1]}.md`));
  const dir = join('app', ...parts);
  return existsSync(dir) && statSync(dir).isDirectory() && ['page.tsx', 'route.ts'].some((f) => existsSync(join(dir, f)));
};
for (const p of pages) {
  for (const m of p.text.matchAll(/\]\((\/[^)\s"\\]*)/g)) if (!exists(m[1])) p.err(`internal link ${m[1]} does not resolve`);
}

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join('\n'));
  console.error(`\ncheck:i18n: ${errors.length} problem(s).`);
  process.exit(1);
}
console.log(`check:i18n: ${pages.length} translated page(s) OK`);
