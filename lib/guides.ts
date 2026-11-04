import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const GUIDES_DIR = join(process.cwd(), 'content', 'guides');

export interface Guide {
  slug: string;
  title: string; // meta title
  h1: string;
  description: string;
  updated: string; // YYYY-MM-DD
  related: string[];
  body: string; // markdown
  /** H2 question + the first paragraph after it, for FAQPage JSON-LD. */
  faq: Array<{ question: string; answer: string }>;
}

export interface ParsedDoc {
  meta: Record<string, string>;
  body: string;
  faq: Array<{ question: string; answer: string }>;
}

/** First non-code paragraph of a markdown fragment, stripped of inline markup ('' if none). */
export function firstParagraph(markdown: string): string {
  const para = markdown
    .trim()
    .split(/\n\n/)
    .find((p) => !p.startsWith('```') && !p.startsWith('````') && p.trim());
  if (!para) return '';
  return para
    .replace(/`{1,4}/g, '')
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\n/g, ' ')
    .trim();
}

/**
 * Splits a content file into flat `key: value` frontmatter and a markdown body, and
 * extracts FAQ entries: every H2 ending in "?" paired with the first non-code paragraph
 * after it. Shared by the syntax guides and the tool guides (lib/tool-guides.ts).
 */
export function parseMarkdownDoc(raw: string, id: string): ParsedDoc {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${id} is missing frontmatter`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  const body = m[2].trim();
  const faq: ParsedDoc['faq'] = [];
  // Split on H2 lines, ignoring any "## " that sits inside a fenced code block.
  const sections: string[] = [];
  let inFence = false;
  let current: string[] | null = null;
  for (const line of body.split('\n')) {
    if (/^(```|~~~)/.test(line)) inFence = !inFence;
    if (!inFence && line.startsWith('## ')) {
      if (current) sections.push(current.join('\n'));
      current = [line.slice(3)];
      continue;
    }
    if (current) current.push(line);
  }
  if (current) sections.push(current.join('\n'));
  for (const section of sections) {
    const lines = section.split('\n');
    const question = lines[0].trim();
    // Only question-phrased H2s become FAQ entries; rendered heading examples stay out.
    if (!question.endsWith('?')) continue;
    const answer = firstParagraph(lines.slice(1).join('\n'));
    if (!answer) continue;
    faq.push({ question, answer });
  }

  return { meta, body, faq };
}

function parseGuide(slug: string): Guide {
  const { meta, body, faq } = parseMarkdownDoc(readFileSync(join(GUIDES_DIR, `${slug}.md`), 'utf8'), `Guide ${slug}`);
  return {
    slug,
    title: meta.title,
    h1: meta.h1,
    description: meta.description,
    updated: meta.updated,
    related: (meta.related ?? '').split(',').map((s) => s.trim()).filter(Boolean),
    body,
    faq,
  };
}

export function listGuideSlugs(): string[] {
  return readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .sort();
}

export function getGuide(slug: string): Guide {
  return parseGuide(slug);
}

export function listGuides(): Guide[] {
  return listGuideSlugs().map(parseGuide);
}

// ---------------------------------------------------------------------------
// Validation, run before `next build` by scripts/check-guides.mjs (any problem fails the build).

export const GUIDE_RULES = {
  /** Bare <title>; the layout appends " | Docs MD" (10 chars), so 50 keeps the rendered title ≤ 60. */
  titleMax: 50,
  descriptionMax: 155,
} as const;

/** Problems with one guide's frontmatter; empty when it meets the contract. */
export function validateGuide(guide: Guide): string[] {
  const R = GUIDE_RULES;
  const errors: string[] = [];
  if (!guide.title) errors.push('frontmatter "title" is missing');
  else if (guide.title.length > R.titleMax)
    errors.push(`title is ${guide.title.length} chars (max ${R.titleMax} before the site suffix, ${R.titleMax + 10} rendered)`);
  if (!guide.h1) errors.push('frontmatter "h1" is missing');
  if (!guide.description) errors.push('frontmatter "description" is missing');
  else if (guide.description.length > R.descriptionMax)
    errors.push(`description is ${guide.description.length} chars (max ${R.descriptionMax})`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(guide.updated) || Number.isNaN(Date.parse(`${guide.updated}T00:00:00Z`)))
    errors.push(`updated "${guide.updated}" must be a YYYY-MM-DD date`);
  else if (guide.updated > new Date().toISOString().slice(0, 10)) errors.push(`updated ${guide.updated} is in the future`);
  for (const r of guide.related) if (!existsSync(join(GUIDES_DIR, `${r}.md`))) errors.push(`related "${r}" is not a guide slug`);
  return errors;
}
