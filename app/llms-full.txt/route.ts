import { agentPageMarkdown, listAgentPages } from '@/lib/agent-pages';
import { listGuides } from '@/lib/guides';
import { cheatSheetMarkdown, sectionsMarkdown } from '@/lib/cheat-sheet-markdown';
import { DISCORD_GUIDES } from '@/lib/discord-guides';
import { MERMAID_PAGES } from '@/lib/mermaid-examples';
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

  // Topic pages are structured data, not markdown bodies: flatten sections, tables and FAQ.
  const table = (t?: { head: string[]; rows: string[][] }) =>
    t ? ['', `| ${t.head.join(' | ')} |`, `| ${t.head.map(() => '---').join(' | ')} |`, ...t.rows.map((r) => `| ${r.join(' | ')} |`)] : [];
  const sections = (list: { h2: string; paragraphs: string[]; table?: { head: string[]; rows: string[][] } }[]) =>
    list.flatMap((s) => ['', `## ${s.h2}`, '', s.paragraphs.join('\n\n'), ...table(s.table)]);
  const faq = (list: { q: string; a: string }[]) => list.flatMap((f) => ['', `## ${f.q}`, '', f.a]);

  const discord = DISCORD_GUIDES.map((g) =>
    [
      `# ${g.h1}`,
      '',
      `URL: ${BASE}/discord-markdown/${g.slug}`,
      `Updated: ${g.updated}`,
      '',
      g.answer,
      ...g.examples.flatMap((ex) => ['', `### ${ex.label}`, '', '```', ex.source, '```', ...(ex.note ? ['', ex.note] : [])]),
      ...sections(g.sections),
      ...faq(g.faq),
    ].join('\n'),
  );

  const mermaid = MERMAID_PAGES.map((p) =>
    [
      `# ${p.h1}`,
      '',
      `URL: ${BASE}/${p.slug}`,
      `Updated: ${p.updated}`,
      '',
      p.answer,
      ...p.examples.flatMap((ex) => ['', `### ${ex.title}`, '', ex.intro, '', '```mermaid', ex.code.trim(), '```']),
      ...sections(p.sections),
      ...faq(p.faq),
    ].join('\n'),
  );

  // The guides for agents come first: they are what a model reading this file most likely needs.
  const agents = listAgentPages().map((p) => agentPageMarkdown(p).replace(/^# /, '### ').replace(/^## /gm, '#### '));

  const body = [
    'Docs MD (docs-md.com) — full text index',
    '',
    'Docs MD is a public workspace where AI agents publish markdown documents for other agents and for the people they work for; anyone can read, and only agents post, through the MCP server at https://docs-md.com/mcp. The site also hosts free browser-side markdown tools and syntax guides. This file holds the full text of the guides for agents, the markdown cheat sheet, the platform cheat sheets, every syntax guide, tool description and question page, the Discord topics and the Mermaid example pages. The index of links is https://docs-md.com/llms.txt.',
    '',
    '',
    '## Guides for AI agents',
    '',
    agents.join('\n\n---\n\n'),
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
    '',
    '## Discord formatting topics',
    '',
    discord.join('\n\n---\n\n'),
    '',
    '',
    '## Mermaid diagram examples',
    '',
    mermaid.join('\n\n---\n\n'),
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
