// Registry and validator for the Discord formatting topic pages (/discord-markdown/<slug>).
// One file per topic in this folder; add its import below. Contract: docs/discord-guides.md.
// The validator runs before `next build` (scripts/check-discord-guides.mjs) and fails the build.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { DiscordGuide } from './types';
import { GUIDE as STRIKETHROUGH } from './strikethrough';
import { GUIDE as SMALL_TEXT } from './small-text';
import { GUIDE as CODE_BLOCK } from './code-block';
import { GUIDE as SPOILER } from './spoiler';
import { GUIDE as BOLD_ITALICS_UNDERLINE } from './bold-italics-underline';
import { GUIDE as HYPERLINK } from './hyperlink';
import { GUIDE as BULLET_POINTS } from './bullet-points';
import { GUIDE as HEADERS } from './headers';
import { GUIDE as BLOCK_QUOTE } from './block-quote';
import { GUIDE as BIG_TEXT } from './big-text';
import { GUIDE as COLORED_TEXT } from './colored-text';
import { GUIDE as TIMESTAMPS } from './timestamps';
import { GUIDE as ESCAPE_CHARACTERS } from './escape-characters';

export type { DiscordGuide } from './types';

/** Hub order: the most-searched formats first. */
export const DISCORD_GUIDES: DiscordGuide[] = [
  STRIKETHROUGH,
  SMALL_TEXT,
  BIG_TEXT,
  CODE_BLOCK,
  COLORED_TEXT,
  SPOILER,
  BOLD_ITALICS_UNDERLINE,
  HYPERLINK,
  BULLET_POINTS,
  HEADERS,
  TIMESTAMPS,
  BLOCK_QUOTE,
  ESCAPE_CHARACTERS,
];

export function getDiscordGuide(slug: string): DiscordGuide | undefined {
  return DISCORD_GUIDES.find((g) => g.slug === slug);
}

export const DISCORD_GUIDE_ROUTES = DISCORD_GUIDES.map((g) => `/discord-markdown/${g.slug}`);

const ROOT = process.cwd();
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

function words(s: string): number {
  return s.replace(LINK, '$1').replace(/`[^`]*`/g, ' x ').split(/\s+/).filter(Boolean).length;
}

/** True when an internal path is a page in this app (a static route dir, a guide, or a Discord topic). */
function pathExists(path: string, all: DiscordGuide[]): boolean {
  const clean = path.replace(/[#?].*$/, '').replace(/\/+$/, '');
  if (clean === '') return true;
  const m = /^\/discord-markdown\/([^/]+)$/.exec(clean);
  if (m) return all.some((g) => g.slug === m[1]);
  const g = /^\/guides\/([^/]+)$/.exec(clean);
  if (g) return existsSync(join(ROOT, 'content', 'guides', `${g[1]}.md`));
  const dir = join(ROOT, 'app', '(en)', ...clean.split('/').filter(Boolean));
  return ['page.tsx', 'page.ts', 'route.ts', 'route.tsx'].some((f) => existsSync(join(dir, f)));
}

/** Problems with one guide; empty when it meets the contract. */
export function validateDiscordGuide(g: DiscordGuide, all: DiscordGuide[]): string[] {
  const e: string[] = [];
  if (!SLUG.test(g.slug)) e.push('slug is not lowercase kebab-case');
  if (all.filter((x) => x.slug === g.slug).length > 1) e.push('duplicate slug');
  if (!g.title || g.title.length > 50) e.push(`title must be 1–50 chars before the site suffix (${g.title.length})`);
  if (g.description.length < 80 || g.description.length > 155) e.push(`description must be 80–155 chars (${g.description.length})`);
  if (!g.h1) e.push('h1 missing');
  if (all.filter((x) => x.h1.toLowerCase() === g.h1.toLowerCase()).length > 1) e.push('h1 duplicates another topic');
  if (!g.label) e.push('label missing');
  if (!DATE.test(g.updated) || g.updated > new Date().toISOString().slice(0, 10)) e.push('updated must be YYYY-MM-DD, not in the future');
  const firstSentence = g.answer.split(/(?<=[.!?])\s/)[0] ?? '';
  if (words(g.answer) > 60) e.push(`answer must be ≤ 60 words (${words(g.answer)})`);
  if (LINK.test(firstSentence)) e.push('no link in the first sentence of the answer');
  LINK.lastIndex = 0;
  if (!g.anatomy?.parts?.length) e.push('anatomy missing');
  if (g.examples.length < 2 || g.examples.length > 6) e.push(`2–6 examples (${g.examples.length})`);
  for (const ex of g.examples) if (!ex.label || !ex.source.trim()) e.push('an example lacks a label or source');
  if (g.sections.length < 3) e.push(`≥ 3 sections (${g.sections.length})`);
  for (const s of g.sections) {
    if (!s.h2) e.push('a section lacks an h2');
    if (!s.paragraphs.length && !s.table) e.push(`section "${s.h2}" is empty`);
    if (s.table) for (const r of s.table.rows) if (r.length !== s.table.head.length) e.push(`table in "${s.h2}" has a row of the wrong width`);
  }
  if (g.faq.length < 4) e.push(`≥ 4 FAQ (${g.faq.length})`);
  for (const f of g.faq) {
    if (!f.q.endsWith('?')) e.push(`FAQ question must end with "?": ${f.q}`);
    const n = words(f.a);
    if (n < 30 || n > 120) e.push(`FAQ answer must be 30–120 words (${n}): ${f.q}`);
  }
  if (!g.sources.length) e.push('≥ 1 source');
  for (const s of g.sources) if (!/^https:\/\//.test(s.url)) e.push(`source is not https: ${s.url}`);
  if (g.related.length < 2 || g.related.length > 6) e.push(`2–6 related paths (${g.related.length})`);
  const body = [g.answer, ...g.sections.flatMap((s) => [...s.paragraphs, ...(s.table?.rows.flat() ?? [])]), ...g.faq.map((f) => f.a)].join(' ');
  if (words(body) < 600) e.push(`body must be ≥ 600 words excluding examples (${words(body)})`);
  const internal = [...body.matchAll(LINK)].map((m) => m[2]).filter((h) => h.startsWith('/'));
  for (const h of [...internal, ...g.related]) if (!pathExists(h, all)) e.push(`internal link ${h} does not resolve`);
  for (const h of [...body.matchAll(LINK)].map((m) => m[2])) if (!h.startsWith('/') && !/^https:\/\//.test(h)) e.push(`link must be an internal path or https: ${h}`);
  return e;
}
