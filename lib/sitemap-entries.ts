import { listAgentPages } from './agent-pages';
import { DISCORD_GUIDES } from './discord-guides';
import { listGuides } from './guides';
import { LOCALES, listLocalized } from './i18n';
import { MERMAID_PAGES } from './mermaid-examples';
import { PAGE_DATES } from './page-dates';
import { listToolGuides } from './tool-guides';
import { TOOL_ROUTES, TOOLS } from './tools-registry';

// Every indexable URL with the date its content last changed. app/sitemap.ts renders this as
// <url><loc>/<lastmod>; scripts/indexnow-ping.mjs diffs it against the live sitemap after a
// production build. Dates come from the page's own source of truth (never from build time), so
// a <lastmod> only moves when someone changes the page.

export const SITE_URL = 'https://docs-md.com';

export interface SitemapEntry {
  /** Site path, '' for the homepage. */
  path: string;
  /** YYYY-MM-DD of the last substantive change. */
  updated: string;
}

/** Hand-built pages (app/(en)/<route>/page.tsx). Data-driven families are appended by sitemapEntries(). */
export const STATIC_ROUTES = [
  '',
  '/about',
  '/what-is-mcp',
  '/ai-powered-ide',
  '/use-cases',
  '/api-docs',
  '/tools',
  '/markdown-table-generator',
  '/markdown-to-pdf',
  '/markdown-cheat-sheet',
  '/markdown-to-html',
  '/readme-generator',
  '/handoff-generator',
  '/markdown-formatter',
  '/guides',
  '/github-readme-viewer',
  '/pdf-to-markdown',
  '/what-is-an-mcp-server',
  '/mcp-servers',
  '/discord-markdown',
  '/slack-markdown',
  '/github-flavored-markdown',
  '/markdown-flavors',
  '/obsidian-markdown',
  '/notion-markdown',
  '/google-docs-markdown',
  '/confluence-markdown',
  '/reddit-markdown',
  '/telegram-markdown',
  '/whatsapp-formatting',
  '/jira-markdown',
  '/markdown-for-ai-output',
  '/mdx-cheat-sheet',
  '/pandoc-markdown',
  '/mermaid-timeline-examples',
  '/mermaid-pie-chart-examples',
  '/mermaid-gantt-chart-examples',
  '/mermaid-mindmap-examples',
  '/mermaid-gitgraph-examples',
  '/mermaid-in-markdown',
  '/mermaid-bar-chart-examples',
  '/mermaid-quadrant-chart-examples',
  '/mermaid-sankey-diagram-examples',
  '/mermaid-kanban-examples',
  '/mermaid-radar-chart-examples',
  '/mermaid-user-journey-examples',
  '/what-is-a-mermaid-diagram',
  '/mermaid-diagram-examples',
  '/markdown-toc-generator',
  '/readme-templates',
  '/what-is-markdown',
  '/markdown-link-generator',
  '/markdown-to-word',
  '/html-to-markdown',
  '/markdown-viewer',
  '/markdown-badge-generator',
  '/csv-to-markdown',
  '/markdown-lint',
  '/markdown-diff',
  '/changelog-generator',
  '/front-matter-generator',
  '/markdown-link-checker',
  '/markdown-word-counter',
  '/share-implementation-plan',
  '/agent-handoff-document',
  '/share-architecture-diagram',
  '/share-markdown-without-account',
  '/agents',
  '/terms',
  '/privacy',
  '/acceptable-use',
  '/report',
  '/bug-report-template',
  '/github-action',
  '/json-to-markdown-table',
  '/markdown-to-slack',
  '/markdown-to-discord',
  '/markdown-to-jira',
  '/markdown-to-plain-text',
  '/discord-timestamp-generator',
  '/discord-colored-text-generator',
];

for (const route of TOOL_ROUTES) {
  if (!STATIC_ROUTES.includes(route)) throw new Error(`sitemap: ${route} missing from STATIC_ROUTES`);
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Date of a hand-built route: the tool registry, the Mermaid registry, or PAGE_DATES. Throws for an undated page. */
function staticRouteDate(route: string): string {
  const slug = route.slice(1);
  const tool = TOOLS.find((t) => t.slug === slug);
  if (tool) return tool.updated;
  const mermaid = MERMAID_PAGES.find((p) => p.slug === slug);
  if (mermaid) return mermaid.updated;
  const dated = PAGE_DATES[route];
  if (!dated) throw new Error(`sitemap: no updated date for ${route || '/'} (add it to lib/page-dates.ts)`);
  return dated;
}

/** All sitemap URLs with their last-change dates, in sitemap order. */
export function sitemapEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [
    ...STATIC_ROUTES.map((route) => ({ path: route, updated: staticRouteDate(route) })),
    ...listAgentPages().map((p) => ({ path: `/agents/${p.slug}`, updated: p.updated })),
    ...listGuides().map((g) => ({ path: `/guides/${g.slug}`, updated: g.updated })),
    ...listToolGuides().map((g) => ({ path: g.path, updated: g.updated })),
    ...DISCORD_GUIDES.map((g) => ({ path: `/discord-markdown/${g.slug}`, updated: g.updated })),
    ...LOCALES.flatMap((locale) => listLocalized(locale).map((p) => ({ path: `/${locale}/${p.slug}`, updated: p.updated }))),
  ];
  for (const e of entries) {
    if (!DATE.test(e.updated)) throw new Error(`sitemap: ${e.path || '/'} has a malformed updated date "${e.updated}"`);
  }
  return entries;
}
