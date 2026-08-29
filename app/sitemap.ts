import type { MetadataRoute } from 'next';
import { listGuideSlugs } from '@/lib/guides';

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
  '/markdown-formatter',
  '/guides',
  '/pdf-to-markdown',
  '/what-is-an-mcp-server',
  '/mcp-servers',
  '/discord-markdown',
  '/slack-markdown',
  '/mermaid-timeline-examples',
  '/markdown-toc-generator',
  '/readme-templates',
  '/what-is-markdown',
  '/markdown-link-generator',
  '/markdown-to-word',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...STATIC_ROUTES, ...listGuideSlugs().map((s) => `/guides/${s}`)];
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));
}
