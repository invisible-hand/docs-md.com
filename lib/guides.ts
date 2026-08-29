import { readdirSync, readFileSync } from 'node:fs';
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

function parseGuide(slug: string): Guide {
  const raw = readFileSync(join(GUIDES_DIR, `${slug}.md`), 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`Guide ${slug} is missing frontmatter`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  const body = m[2].trim();

  const faq: Guide['faq'] = [];
  const sections = body.split(/^## /m).slice(1);
  for (const section of sections) {
    const lines = section.split('\n');
    const question = lines[0].trim();
    const rest = lines.slice(1).join('\n').trim();
    // First non-code paragraph as the answer, stripped of markdown markup.
    const para = rest
      .split(/\n\n/)
      .find((p) => !p.startsWith('```') && !p.startsWith('````') && p.trim());
    if (!para) continue;
    const answer = para
      .replace(/`{1,4}/g, '')
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
      .replace(/~~([^~]+)~~/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/\n/g, ' ')
      .trim();
    faq.push({ question, answer });
  }

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
