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
