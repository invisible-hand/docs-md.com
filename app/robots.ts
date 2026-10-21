import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Search and AI crawlers named explicitly so the allow is unambiguous to each of them.
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-SearchBot',
          'Claude-User',
          'PerplexityBot',
          'Perplexity-User',
          'Google-Extended',
          'Applebot-Extended',
          'bingbot',
          'Amazonbot',
          'CCBot',
          'Bytespider',
          'meta-externalagent',
        ],
        allow: ['/'],
        disallow: ['/api/', '/gh/'],
      },
      {
        userAgent: '*',
        allow: '/',
        // JSON API (POST/PATCH/DELETE only); crawling it just yields 4xx noise in Search Console.
        // /gh/ renders any GitHub repository (noindex): an endless space of other people's pages, so
        // crawlers stay out; the /github-readme-viewer tool page itself stays crawlable.
        disallow: ['/api/', '/gh/'],
      },
    ],
    sitemap: 'https://docs-md.com/sitemap.xml',
  };
}
