# MD Share

Share markdown files with flexible expiry (including permanent links), a public API, and MCP support for AI-powered IDE workflows.

## Features

- 📝 **Instant Sharing** - Paste markdown, get a shareable link
- 👀 **Live Preview** - Write and preview side-by-side before publishing
- ⏰ **Flexible Expiry** - 1 day, 7 days, 30 days, or never
- ✏️ **Edit & Delete** - Every share returns a private edit token
- 🧜 **Mermaid Diagrams** - ` ```mermaid ` code blocks render as diagrams
- 📑 **Table of Contents** - Auto-generated sidebar for long documents
- 🔗 **Raw Endpoint + API** - `GET /raw/:id`, full REST API at `/api-docs`
- 🔌 **MCP Integration** - `share_markdown`, `update_share`, `delete_share` tools
- 📚 **SEO Pages** - About, What is MCP, AI IDE guide, use cases, API docs
- 🔐 **Security Defaults** - Validation, payload limits, rate limiting, and protected ops endpoints

## Public Pages

- `/` - Markdown editor + live preview
- `/about` - Product overview
- `/what-is-mcp` - MCP explainer
- `/ai-powered-ide` - AI IDE workflow guide
- `/use-cases` - Common usage patterns
- `/api-docs` - REST API documentation
- `/sitemap.xml` and `/robots.txt`

## API

See [docs-md.com/api-docs](https://docs-md.com/api-docs). Summary:

- `POST /api/share` — body `{content, filename?, expiry?}` where expiry ∈ `1d|7d|30d|never`; returns `{id, url, rawUrl, editToken, expiresAt}` (expiresAt `0` = permanent)
- `PATCH /api/share/:id` — header `x-edit-token`, body `{content, filename?}`
- `DELETE /api/share/:id` — header `x-edit-token`
- `GET /raw/:id` — raw `text/markdown`

Indexing policy: only permanent shares are indexable; expiring shares are served with `noindex`.

## MCP Setup for Cursor

Share markdown files directly from Cursor using our MCP server.

**1. Open Cursor Settings**

Press `Cmd/Ctrl + Shift + P` → "Preferences: Open User Settings (JSON)"

**2. Add Configuration**

```json
{
  "mcpServers": {
    "md-share": {
      "url": "https://docs-md.com/api/mcp",
      "transport": "http"
    }
  }
}
```

**3. Restart Cursor**

**4. Test It**

In Cursor chat, say: "Share this markdown file"

## Security Configuration

Set these environment variables in production:

```bash
# API body limits
MAX_SHARE_REQUEST_BYTES=200000
MAX_MCP_REQUEST_BYTES=250000
MAX_MARKDOWN_CHARS=120000

# Rate limiting (per IP, per window)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_SHARE_PER_WINDOW=20
RATE_LIMIT_MCP_PER_WINDOW=30

# Protected endpoints
CRON_SECRET=your-cleanup-secret
ADMIN_API_SECRET=your-admin-secret

# Optional CORS allowlist for MCP preflight
MCP_ALLOWED_ORIGINS=https://docs-md.com,http://localhost:3000
```

## Development

```bash
# Install
npm install

# Run dev server
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

## Tech Stack

- Next.js 16, TypeScript, Tailwind CSS
- Neon Postgres + Vercel Blob
- Model Context Protocol (MCP)
- Zod request validation

## License

MIT
