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
        disallow: ['/api/'],
      },
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
