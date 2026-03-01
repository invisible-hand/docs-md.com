# MD Share

Share markdown files with auto-expiring links and MCP support for AI-powered IDE workflows.

## Features

- 📝 **Instant Sharing** - Paste markdown, get a shareable link
- 👀 **Live Preview** - Write and preview side-by-side before publishing
- ⏰ **Auto-Expiring** - All links expire after 30 days
- 🔌 **MCP Integration** - Share directly from Cursor AI
- 📚 **SEO Pages** - About, What is MCP, AI IDE guide, and use cases
- 🔐 **Security Defaults** - Validation, payload limits, rate limiting, and protected ops endpoints

## Public Pages

- `/` - Markdown editor + live preview
- `/about` - Product overview
- `/what-is-mcp` - MCP explainer
- `/ai-powered-ide` - AI IDE workflow guide
- `/use-cases` - Common usage patterns
- `/sitemap.xml` and `/robots.txt`

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
