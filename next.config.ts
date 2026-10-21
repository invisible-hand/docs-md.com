import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Bare /raw (no share id) is what crawlers extract from "https://docs-md.com/raw/<id>"
      // examples in page copy; send it to the docs for the raw endpoint instead of a 404.
      { source: "/raw", destination: "/api-docs", permanent: true },
    ];
  },
  async rewrites() {
    // Agents get the markdown itself: /<id>.md, or /<id> with "Accept: text/markdown".
    // Only share-id-shaped paths match, so no static page can be shadowed.
    const shareId = ":id([a-z]+-[a-z]+-[A-Za-z0-9]{5})";
    return {
      beforeFiles: [
        { source: `/${shareId}.md`, destination: "/raw/:id" },
        {
          source: `/${shareId}`,
          has: [{ type: "header", key: "accept", value: "(.*)text/markdown(.*)" }],
          destination: "/raw/:id",
        },
      ],
      afterFiles: [],
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
