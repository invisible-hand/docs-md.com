// Registry and validator for the "Mermaid <chart> examples" pages. One data file per page in this
// folder plus a five-line app/<slug>/page.tsx. Contract: docs/mermaid-examples.md.
// The validator runs before `next build` (scripts/check-mermaid-examples.mjs).
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { MermaidExamplesPage } from './types';
import { PAGE as PIE } from './mermaid-pie-chart-examples';
import { PAGE as GANTT } from './mermaid-gantt-chart-examples';
import { PAGE as MINDMAP } from './mermaid-mindmap-examples';
import { PAGE as GITGRAPH } from './mermaid-gitgraph-examples';
import { PAGE as IN_MARKDOWN } from './mermaid-in-markdown';
import { PAGE as BAR } from './mermaid-bar-chart-examples';
import { PAGE as QUADRANT } from './mermaid-quadrant-chart-examples';
import { PAGE as SANKEY } from './mermaid-sankey-diagram-examples';
import { PAGE as KANBAN } from './mermaid-kanban-examples';
import { PAGE as RADAR } from './mermaid-radar-chart-examples';
import { PAGE as JOURNEY } from './mermaid-user-journey-examples';
import { PAGE as WHAT_IS } from './what-is-a-mermaid-diagram';
import { PAGE as HUB } from './mermaid-diagram-examples';

export type { MermaidExamplesPage } from './types';

export const MERMAID_PAGES: MermaidExamplesPage[] = [
  PIE,
  GANTT,
  MINDMAP,
  GITGRAPH,
  IN_MARKDOWN,
  BAR,
  QUADRANT,
  SANKEY,
  KANBAN,
  RADAR,
  JOURNEY,
  WHAT_IS,
  HUB,
];

export function getMermaidPage(slug: string): MermaidExamplesPage {
  const p = MERMAID_PAGES.find((x) => x.slug === slug);
  if (!p) throw new Error(`mermaid-examples: no page ${slug}`);
  return p;
}

const ROOT = process.cwd();
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

function words(s: string): number {
  return s.replace(LINK, '$1').replace(/`[^`]*`/g, ' x ').split(/\s+/).filter(Boolean).length;
}

function pathExists(path: string): boolean {
  const clean = path.replace(/[#?].*$/, '').replace(/\/+$/, '');
  if (clean === '') return true;
  const g = /^\/guides\/([^/]+)$/.exec(clean);
  if (g) return existsSync(join(ROOT, 'content', 'guides', `${g[1]}.md`));
  const d = /^\/discord-markdown\/([^/]+)$/.exec(clean);
  if (d) return existsSync(join(ROOT, 'lib', 'discord-guides', `${d[1]}.ts`));
  const dir = join(ROOT, 'app', ...clean.split('/').filter(Boolean));
  return ['page.tsx', 'page.ts', 'route.ts', 'route.tsx'].some((f) => existsSync(join(dir, f)));
}

export function validateMermaidPage(p: MermaidExamplesPage, all: MermaidExamplesPage[]): string[] {
  const e: string[] = [];
  if (!existsSync(join(ROOT, 'app', p.slug, 'page.tsx'))) e.push(`app/${p.slug}/page.tsx missing`);
  if (all.filter((x) => x.slug === p.slug).length > 1) e.push('duplicate slug');
  if (!p.title || p.title.length > 60) e.push(`title must be 1–60 chars (${p.title.length})`);
  if (p.description.length < 80 || p.description.length > 155) e.push(`description must be 80–155 chars (${p.description.length})`);
  if (!DATE.test(p.updated) || p.updated > new Date().toISOString().slice(0, 10)) e.push('updated must be YYYY-MM-DD, not in the future');
  if (words(p.answer) > 60) e.push(`answer must be ≤ 60 words (${words(p.answer)})`);
  if (LINK.test(p.answer.split(/(?<=[.!?])\s/)[0] ?? '')) e.push('no link in the first sentence of the answer');
  LINK.lastIndex = 0;
  if (p.examples.length < 3 || p.examples.length > 8) e.push(`3–8 examples (${p.examples.length})`);
  const ids = new Set<string>();
  for (const ex of p.examples) {
    if (!/^[a-z0-9-]+$/.test(ex.id) || ids.has(ex.id)) e.push(`example id "${ex.id}" must be unique kebab-case`);
    ids.add(ex.id);
    if (!ex.code.trim() || ex.code.includes('```')) e.push(`example "${ex.id}" code is empty or contains a fence`);
  }
  if (p.sections.length < 3) e.push(`≥ 3 sections (${p.sections.length})`);
  for (const s of p.sections) if (s.table) for (const r of s.table.rows) if (r.length !== s.table.head.length) e.push(`table in "${s.h2}" has a row of the wrong width`);
  if (p.faq.length < 4) e.push(`≥ 4 FAQ (${p.faq.length})`);
  for (const f of p.faq) {
    if (!f.q.endsWith('?')) e.push(`FAQ question must end with "?": ${f.q}`);
    const n = words(f.a);
    if (n < 30 || n > 120) e.push(`FAQ answer must be 30–120 words (${n}): ${f.q}`);
  }
  if (!p.sources.length) e.push('≥ 1 source');
  if (p.related.length < 2 || p.related.length > 6) e.push(`2–6 related paths (${p.related.length})`);
  const body = [p.answer, ...p.examples.map((x) => x.intro), ...p.sections.flatMap((s) => [...s.paragraphs, ...(s.table?.rows.flat() ?? [])]), ...p.faq.map((f) => f.a)].join(' ');
  if (words(body) < 700) e.push(`body must be ≥ 700 words excluding code (${words(body)})`);
  for (const h of [...[...body.matchAll(LINK)].map((m) => m[2]), ...p.related]) {
    if (h.startsWith('/')) {
      if (!pathExists(h)) e.push(`internal link ${h} does not resolve`);
    } else if (!/^https:\/\//.test(h)) e.push(`link must be an internal path or https: ${h}`);
  }
  return e;
}
