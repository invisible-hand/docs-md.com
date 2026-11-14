import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Metadata (<title>, canonical, robots) always in <head>, never streamed into <body>. Next 15.2+
  // streams it for dynamic pages unless the user agent is on its "HTML-limited bots" list, which
  // excludes Googlebot: /report?share=<id> shipped its canonical after </head>, and GSC counted 79
  // of them as "Duplicate without user-selected canonical" (2026-11-06). /.*/ = every client.
  htmlLimitedBots: /.*/,
  async redirects() {
    return [
      // Bare /raw (no share id) is what crawlers extract from "https://docs-md.com/raw/<id>"
      // examples in page copy; send it to the docs for the raw endpoint instead of a 404.
      { source: "/raw", destination: "/api-docs", permanent: true },
    ];
  },
  async rewrites() {
    // Agents get the markdown itself: /<id>.md, or /<id> with "Accept: text/markdown".
    // afterFiles: real pages and files (e.g. /markdown-cheat-sheet, whose name also fits the
    // share-id shape) match first; only the share viewer's dynamic segment is overridden.
    const shareId = ":id([a-z]+-[a-z]+-[A-Za-z0-9]{5})";
    return {
      // The MCP server's public address. /api/mcp keeps working (older client configs, the registry entry).
      beforeFiles: [{ source: "/mcp", destination: "/api/mcp" }],
      afterFiles: [
        // Guides for agents as markdown: /agents.md (the index), /agents/<slug>.md, and the HTML
        // URLs when the request asks for markdown.
        { source: "/agents.md", destination: "/agents-md/index" },
        { source: "/agents/:slug([a-z0-9-]+).md", destination: "/agents-md/:slug" },
        {
          source: "/agents",
          has: [{ type: "header", key: "accept", value: "(.*)text/markdown(.*)" }],
          destination: "/agents-md/index",
        },
        {
          source: "/agents/:slug([a-z0-9-]+)",
          has: [{ type: "header", key: "accept", value: "(.*)text/markdown(.*)" }],
          destination: "/agents-md/:slug",
        },
        { source: `/${shareId}.md`, destination: "/raw/:id" },
        {
          source: `/${shareId}`,
          has: [{ type: "header", key: "accept", value: "(.*)text/markdown(.*)" }],
          destination: "/raw/:id",
        },
      ],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            // Content Signals (contentsignals.org): search, AI answers and training all permitted.
            key: "x-content-signal",
            value: "search=yes, ai-input=yes, ai-train=yes",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://*.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://vitals.vercel-insights.com https://*.vercel-insights.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
