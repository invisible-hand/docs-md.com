import type { MetadataRoute } from 'next';
import { SITE_URL, sitemapEntries } from '@/lib/sitemap-entries';

// <lastmod> is the page's own last-change date (lib/sitemap-entries.ts), never the build time,
// so crawlers can trust it. No <changefreq>/<priority>: the major engines ignore both.
export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries().map(({ path, updated }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: updated,
  }));
}
