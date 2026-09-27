import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // JSON API (POST/PATCH/DELETE only); crawling it just yields 4xx noise in Search Console.
        disallow: '/api/',
      },
    ],
    sitemap: 'https://docs-md.com/sitemap.xml',
  };
}
