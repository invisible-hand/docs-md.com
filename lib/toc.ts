import GithubSlugger from 'github-slugger';

export interface TocEntry {
  depth: number;
  text: string;
  slug: string;
}

// Extract markdown headings (outside code fences) with slugs matching rehype-slug.
export function extractToc(content: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const entries: TocEntry[] = [];
  let inFence = false;

  for (const line of content.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      continue;
    }

    const match = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) {
      continue;
    }

    const text = match[2]
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_`~]/g, '')
      .trim();

    if (!text) {
      continue;
    }

    entries.push({
      depth: match[1].length,
      text,
      slug: slugger.slug(text),
    });
  }

  return entries;
}
