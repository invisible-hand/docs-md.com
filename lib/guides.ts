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

export interface ParsedDoc {
  meta: Record<string, string>;
  body: string;
  faq: Array<{ question: string; answer: string }>;
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
