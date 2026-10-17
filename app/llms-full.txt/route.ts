import { firstParagraph, listGuides } from '@/lib/guides';
import { TOOLS, TOOL_CATEGORIES } from '@/lib/tools-registry';

// /llms-full.txt — the expanded companion to /llms.txt: one plain-text block per
// syntax guide (title, URL, updated date, description, opening answer paragraph)
// and per tool (title, URL, updated date, description). Built from the same
// registries as llms.txt and the sitemap.

export const dynamic = 'force-static';

const BASE = 'https://docs-md.com';

export function GET() {
  const guides = listGuides().map((g) =>
    [
      `# ${g.h1}`,
      '',
      `URL: ${BASE}/guides/${g.slug}`,
      `Updated: ${g.updated}`,
      '',
      g.description,
      '',
      firstParagraph(g.body),
    ].join('\n'),
  );

  const label = new Map(TOOL_CATEGORIES.map((c) => [c.id, c.label]));
  const tools = TOOLS.map((t) =>
    [
      `# ${t.title}`,
      '',
      `URL: ${BASE}/${t.slug}`,
      `Category: ${label.get(t.category) ?? t.category}`,
      `Updated: ${t.updated}`,
      '',
      t.description,
    ].join('\n'),
  );

  const body = [
    'Docs MD (docs-md.com) — full text index',
    '',
    'Docs MD shares Markdown documents as rendered links with an expiry you choose, no account needed, and hosts free browser-side markdown tools and syntax guides. This file lists every syntax guide with its opening answer and every tool with its description. The link index is at https://docs-md.com/llms.txt.',
    '',
    '',
    '## Markdown syntax guides',
    '',
    guides.join('\n\n---\n\n'),
    '',
    '',
    '## Free markdown tools',
    '',
    tools.join('\n\n---\n\n'),
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
