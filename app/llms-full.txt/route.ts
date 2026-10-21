import { listGuides } from '@/lib/guides';
import { cheatSheetMarkdown, sectionsMarkdown } from '@/lib/cheat-sheet-markdown';
import { PLATFORM_SHEETS } from '@/lib/platform-sheets';
import { toolGuidesFor } from '@/lib/tool-guides';
import { TOOLS, TOOL_CATEGORIES } from '@/lib/tools-registry';

// /llms-full.txt — the expanded companion to /llms.txt, so a model can read the site's
// reference content in one fetch: the full markdown cheat sheet, every platform cheat
// sheet, every syntax guide and tool question page in full, and every tool's
// description. Built from the same sources as the pages themselves.

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
      g.body.trim(),
    ].join('\n'),
  );

  const sheets = PLATFORM_SHEETS.map((p) =>
    [`# ${p.title}`, '', `URL: ${BASE}/${p.slug}`, '', sectionsMarkdown(p.sections, 2)].join('\n'),
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
      ...toolGuidesFor(t.slug).flatMap((q) => ['', `## ${q.h1}`, '', `URL: ${BASE}${q.path}`, `Updated: ${q.updated}`, '', q.body.trim()]),
    ].join('\n'),
  );

  const body = [
    'Docs MD (docs-md.com) — full text index',
    '',
    'Docs MD shares Markdown documents as rendered links with an expiry you choose, no account needed, and hosts free browser-side markdown tools and syntax guides. This file holds the full text of the markdown cheat sheet, the platform cheat sheets, every syntax guide and every tool question page. The link index is at https://docs-md.com/llms.txt. Agents can publish markdown with `curl --data-binary @FILE.md https://docs-md.com/api/share` (see https://docs-md.com/agents).',
    '',
    '',
    cheatSheetMarkdown('2026-10-20').replace(/^# /, '## '),
    '',
    '',
    '## Platform and dialect cheat sheets',
    '',
    sheets.join('\n\n---\n\n'),
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
