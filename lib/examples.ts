import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Worked example documents used by the walkthrough pages, the viewer, and the
// homepage editor (`/?example=<slug>`). One markdown file per example under
// content/examples; the same file backs the rendered preview, the raw/download
// route, and the "open in editor" action so they can never drift apart.

const EXAMPLES_DIR = join(process.cwd(), 'content', 'examples');

export interface Example {
  slug: string;
  title: string;
  filename: string;
  description: string;
  body: string;
}

export function listExampleSlugs(): string[] {
  return readdirSync(EXAMPLES_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .sort();
}

export function getExample(slug: string): Example {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`Invalid example slug: ${slug}`);
  const raw = readFileSync(join(EXAMPLES_DIR, `${slug}.md`), 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`Example ${slug} is missing frontmatter`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return {
    slug,
    title: meta.title,
    filename: meta.filename || `${slug}.md`,
    description: meta.description,
    body: m[2].trim(),
  };
}
