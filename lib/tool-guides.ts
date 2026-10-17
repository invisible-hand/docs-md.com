import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { listGuides, parseMarkdownDoc } from './guides';
import { TOOLS } from './tools-registry';

// Tool guides: one question per page, nested under the tool that answers it, at
// /<tool>/<question>. Content lives in content/tool-guides/<tool>/<question>.md.
// The top-level dynamic segment belongs to the share viewer (app/[id]), so every
// tool that has guides needs its own app/<tool>/[question]/page.tsx (see
// lib/tool-guide-route.tsx). The writer contract is in docs/tool-guides.md and is
// enforced by validateToolGuide(), which `npm run build` runs first.

const ROOT = process.cwd();
const TOOL_GUIDES_DIR = join(ROOT, 'content', 'tool-guides');

export interface ToolGuide {
  /** Parent tool slug (a TOOLS entry), taken from the folder name. */
  tool: string;
  /** The frontmatter `tool` as written; validation checks it matches the folder. */
  declaredTool: string;
  /** Question slug: the file name without .md. */
  slug: string;
  /** Site path, e.g. "/readme-generator/what-is-a-readme-file". */
  path: string;
  /** <title> (the layout appends "| Docs MD"). */
  title: string;
  /** The question, ending in "?". */
  h1: string;
  description: string;
  /** YYYY-MM-DD; shown as "Updated" and used as dateModified. */
  updated: string;
  /** Site paths of related pages. */
  related: string[];
  body: string;
  faq: Array<{ question: string; answer: string }>;
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function toolDirs(): string[] {
  if (!existsSync(TOOL_GUIDES_DIR)) return [];
  return readdirSync(TOOL_GUIDES_DIR)
    .filter((d) => statSync(join(TOOL_GUIDES_DIR, d)).isDirectory())
    .sort();
}

function questionSlugs(tool: string): string[] {
  const dir = join(TOOL_GUIDES_DIR, tool);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .sort();
}

function parseToolGuide(tool: string, slug: string): ToolGuide {
  const raw = readFileSync(join(TOOL_GUIDES_DIR, tool, `${slug}.md`), 'utf8');
  const { meta, body, faq } = parseMarkdownDoc(raw, `Tool guide ${tool}/${slug}`);
  return {
    tool,
    slug,
    path: `/${tool}/${slug}`,
    title: meta.title ?? '',
    h1: meta.h1 ?? '',
    description: meta.description ?? '',
    updated: meta.updated ?? '',
    related: (meta.related ?? '').split(',').map((s) => s.trim()).filter(Boolean),
    body,
    faq,
    declaredTool: meta.tool ?? '',
  };
}

/** Every tool guide, sorted by tool then question slug. */
export function listToolGuides(): ToolGuide[] {
  return toolDirs().flatMap((tool) => questionSlugs(tool).map((q) => parseToolGuide(tool, q)));
}

/** Throws if the guide does not exist. */
export function getToolGuide(tool: string, q: string): ToolGuide {
  if (!SLUG_RE.test(tool) || !SLUG_RE.test(q)) throw new Error(`Unknown tool guide: ${tool}/${q}`);
  if (!existsSync(join(TOOL_GUIDES_DIR, tool, `${q}.md`))) throw new Error(`Unknown tool guide: ${tool}/${q}`);
  return parseToolGuide(tool, q);
}

/** Guides for one tool (empty when it has none). */
export function toolGuidesFor(tool: string): ToolGuide[] {
  return questionSlugs(tool).map((q) => parseToolGuide(tool, q));
}

// ---------------------------------------------------------------------------
// Link resolution, shared by the validator and the page (for related-link labels).

/** Label for a site path that is a syntax guide, a tool, or a tool guide; null otherwise. */
export function labelForPath(path: string): string | null {
  const clean = path.replace(/[#?].*$/, '');
  const guide = clean.match(/^\/guides\/([a-z0-9-]+)$/);
  if (guide) {
    const g = listGuides().find((x) => x.slug === guide[1]);
    return g ? g.h1 : null;
  }
  const parts = clean.split('/').filter(Boolean);
  if (parts.length === 1) {
    const t = TOOLS.find((x) => x.slug === parts[0]);
    return t ? t.title : null;
  }
  if (parts.length === 2 && TOOLS.some((x) => x.slug === parts[0])) {
    try {
      return getToolGuide(parts[0], parts[1]).h1;
    } catch {
      return null;
    }
  }
  return null;
}

/** True when an internal path points at a page that exists in this app. */
function internalPathExists(path: string): boolean {
  const clean = path.replace(/[#?].*$/, '').replace(/\/+$/, '');
  if (clean === '') return true;
  if (labelForPath(clean)) return true;
  if (clean === '/guides') return true;
  const dir = join(ROOT, 'app', ...clean.split('/').filter(Boolean));
  return ['page.tsx', 'page.ts', 'route.ts', 'route.tsx'].some((f) => existsSync(join(dir, f)));
}

// ---------------------------------------------------------------------------
// Validation (the writer contract). Returns a list of problems; empty means OK.

const FENCE_RE = /^(```|~~~)[\s\S]*?^\1/gm;
const LINK_RE = /\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

function stripCode(md: string): string {
  return md.replace(FENCE_RE, '');
}

export function countWords(md: string): number {
  const text = stripCode(md)
    .replace(/<[^>]+>/g, ' ')
    .replace(LINK_RE, '$1')
    .replace(/[#*_>|`~-]+/g, ' ');
  return text.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
}

/** The body's first block, which must be a plain paragraph answering the H1. */
export function firstParagraph(body: string): string {
  return body.split(/\n\s*\n/)[0]?.trim() ?? '';
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export const TOOL_GUIDE_RULES = {
  titleMax: 60,
  descriptionMax: 155,
  minWords: 900,
  minFaq: 4,
  firstParagraphMaxWords: 60,
  minInternalLinks: 2,
} as const;

export function validateToolGuide(guide: ToolGuide, all: ToolGuide[] = listToolGuides()): string[] {
  const R = TOOL_GUIDE_RULES;
  const errors: string[] = [];
  const declared = guide.declaredTool;

  // Frontmatter
  if (!SLUG_RE.test(guide.slug)) errors.push(`file name "${guide.slug}" must be lowercase kebab-case`);
  if (!TOOLS.some((t) => t.slug === guide.tool)) errors.push(`folder "${guide.tool}" is not a tool slug in TOOLS`);
  if (!declared) errors.push('frontmatter "tool" is missing');
  else if (declared !== guide.tool) errors.push(`frontmatter tool "${declared}" does not match folder "${guide.tool}"`);
  if (!existsSync(join(ROOT, 'app', guide.tool, '[question]', 'page.tsx')))
    errors.push(`app/${guide.tool}/[question]/page.tsx is missing, so this guide would not be built`);
  if (!guide.title) errors.push('frontmatter "title" is missing');
  else if (guide.title.length > R.titleMax) errors.push(`title is ${guide.title.length} chars (max ${R.titleMax})`);
  if (!guide.h1) errors.push('frontmatter "h1" is missing');
  else if (!guide.h1.endsWith('?')) errors.push('h1 must be a question ending in "?"');
  if (!guide.description) errors.push('frontmatter "description" is missing');
  else if (guide.description.length > R.descriptionMax)
    errors.push(`description is ${guide.description.length} chars (max ${R.descriptionMax})`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(guide.updated) || Number.isNaN(Date.parse(`${guide.updated}T00:00:00Z`)))
    errors.push(`updated "${guide.updated}" must be a YYYY-MM-DD date`);
  else if (guide.updated > new Date().toISOString().slice(0, 10)) errors.push(`updated ${guide.updated} is in the future`);
  for (const r of guide.related) {
    if (!r.startsWith('/')) errors.push(`related "${r}" must be a site path starting with "/"`);
    else if (!labelForPath(r)) errors.push(`related "${r}" is not a syntax guide, tool or tool guide`);
  }

  // Uniqueness against existing pages
  const h1 = norm(guide.h1);
  const clashGuide = listGuides().find((g) => norm(g.h1) === h1);
  if (clashGuide) errors.push(`h1 duplicates the syntax guide /guides/${clashGuide.slug}`);
  const clashTool = TOOLS.find((t) => norm(t.title) === h1);
  if (clashTool) errors.push(`h1 duplicates the tool title of /${clashTool.slug}`);
  for (const other of all) {
    if (other.path === guide.path) continue;
    if (norm(other.h1) === h1) errors.push(`h1 duplicates ${other.path}`);
    if (other.slug === guide.slug) errors.push(`question slug "${guide.slug}" is also used by ${other.path}`);
  }

  // Body
  if (/^# /m.test(stripCode(guide.body))) errors.push('body must not contain an H1 (the page renders the frontmatter h1)');
  const words = countWords(guide.body);
  if (words < R.minWords) errors.push(`body has ${words} words (min ${R.minWords})`);
  if (guide.faq.length < R.minFaq) errors.push(`${guide.faq.length} question H2s (min ${R.minFaq}; an H2 counts when it ends in "?")`);

  const first = firstParagraph(guide.body);
  if (/^(#|```|~~~|[-*+] |\d+\. |>|\||!\[|<)/.test(first))
    errors.push('body must open with a plain paragraph that answers the h1');
  const firstWords = countWords(first);
  if (firstWords > R.firstParagraphMaxWords)
    errors.push(`first paragraph has ${firstWords} words (max ${R.firstParagraphMaxWords})`);
  const firstSentence = first.split(/(?<=[.!?])\s/)[0] ?? '';
  if (/\]\(|<a\s|https?:\/\//.test(firstSentence)) errors.push('no link may come before the answer (first sentence)');

  const hrefs = [...stripCode(guide.body).matchAll(LINK_RE)].map((m) => m[2]);
  const internal = hrefs.filter((h) => h.startsWith('/'));
  if (internal.length < R.minInternalLinks)
    errors.push(`${internal.length} internal links (min ${R.minInternalLinks})`);
  if (!internal.some((h) => h.replace(/[#?].*$/, '') === `/${guide.tool}`))
    errors.push(`body must link to the tool at /${guide.tool}`);
  for (const h of internal) if (!internalPathExists(h)) errors.push(`internal link ${h} does not resolve to a page`);

  return errors;
}
