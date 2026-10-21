import type { MetadataRoute } from 'next';
import { listGuideSlugs } from '@/lib/guides';
import { listToolGuides } from '@/lib/tool-guides';
import { TOOL_ROUTES } from '@/lib/tools-registry';

const BASE_URL = 'https://docs-md.com';

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
  '/reddit-markdown',
  '/telegram-markdown',
  '/whatsapp-formatting',
  '/jira-markdown',
  '/markdown-for-ai-output',
  '/mdx-cheat-sheet',
  '/pandoc-markdown',
  '/mermaid-timeline-examples',
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
];

// The IndexNow post-build script parses STATIC_ROUTES textually, so tool routes
// must be listed above by hand; this guard catches a registry entry that was not.
for (const route of TOOL_ROUTES) {
  if (!STATIC_ROUTES.includes(route)) throw new Error(`sitemap: ${route} missing from STATIC_ROUTES`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...STATIC_ROUTES,
    ...listGuideSlugs().map((s) => `/guides/${s}`),
    ...listToolGuides().map((g) => g.path),
  ];
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));
}
