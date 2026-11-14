import { TOOLS } from './tools-registry';

/**
 * Last substantive change of each hand-built page (YYYY-MM-DD): the explainers, platform cheat
 * sheets, hubs and legal pages whose content lives in app/(en)/<route>/page.tsx. Shown as the
 * visible "Updated" line, emitted as `dateModified` in the page's JSON-LD, and used as the
 * sitemap <lastmod> (lib/sitemap-entries.ts). Bump the date when the page's content changes.
 * Tools, guides, tool guides, Discord topics, Mermaid pages and translations carry their own
 * dates in their registries or frontmatter.
 */
export const PAGE_DATES: Record<string, string> = {
  '': '2026-11-13',
  '/about': '2026-11-13',
  '/acceptable-use': '2026-11-13',
  '/agent-handoff-document': '2026-11-13',
  '/agents': '2026-11-13',
  '/ai-powered-ide': '2026-11-13',
  '/api-docs': '2026-11-13',
  '/bug-report-template': '2026-11-13',
  '/confluence-markdown': '2026-11-03',
  '/discord-markdown': '2026-11-03',
  '/github-action': '2026-11-13',
  '/github-flavored-markdown': '2026-10-15',
  '/google-docs-markdown': '2026-11-03',
  '/guides': '2026-09-08',
  '/jira-markdown': '2026-10-15',
  '/markdown-flavors': '2026-10-15',
  '/markdown-for-ai-output': '2026-11-13',
  '/mcp-servers': '2026-11-13',
  '/mdx-cheat-sheet': '2026-10-15',
  '/mermaid-timeline-examples': '2026-11-03',
  '/notion-markdown': '2026-10-15',
  '/obsidian-markdown': '2026-11-03',
  '/pandoc-markdown': '2026-10-15',
  '/privacy': '2026-11-13',
  '/readme-templates': '2026-09-12',
  '/reddit-markdown': '2026-11-03',
  '/report': '2026-11-03',
  '/share-architecture-diagram': '2026-11-13',
  '/share-implementation-plan': '2026-11-13',
  '/share-markdown-without-account': '2026-11-13',
  '/slack-markdown': '2026-11-03',
  '/telegram-markdown': '2026-10-15',
  '/terms': '2026-11-13',
  '/use-cases': '2026-11-13',
  '/what-is-an-mcp-server': '2026-10-14',
  '/what-is-markdown': '2026-11-13',
  '/what-is-mcp': '2026-11-13',
  '/whatsapp-formatting': '2026-10-15',
  // The tools hub changes whenever any tool does.
  '/tools': TOOLS.map((t) => t.updated).sort().at(-1)!,
};

export function pageDate(path: string): string {
  const date = PAGE_DATES[path];
  if (!date) throw new Error(`page-dates: no updated date for ${path}`);
  return date;
}
