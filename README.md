# Docs MD

**Share Markdown online for free — no signup.** Paste a Markdown file and get a rendered link with Mermaid diagrams, highlighted code, and an expiry you choose (1, 7, 30 days, or never). Share from the browser at [docs-md.com](https://docs-md.com), from Cursor or Claude Code through the MCP server, or from scripts with the REST API. Shares are public URLs; an edit token lets you update or delete them in place.

Worked examples with downloadable documents: [share an implementation plan for review](https://docs-md.com/share-implementation-plan) · [agent handoff document](https://docs-md.com/agent-handoff-document) · [architecture diagram with notes](https://docs-md.com/share-architecture-diagram) · [no-account sharing services compared](https://docs-md.com/share-markdown-without-account).

## Demo: share a plan from Claude Code

```bash
claude mcp add --transport http md-share https://docs-md.com/api/mcp
```

Then, with a plan open:

> Publish implementation-plan.md with a 7-day expiry. Give me the reading link and keep the edit token out of the document.

The assistant calls `share_markdown` and returns the rendered URL, the raw URL, the expiry date, and the edit token. Later, "update the share with the new plan" calls `update_share` — same link, new content.

## Features

- 📝 **Instant Sharing** - Paste markdown, get a shareable link
- 👀 **Live Preview** - Write and preview side-by-side before publishing
- ⏰ **Flexible Expiry** - 30 days by default; 1 day, 7 days, or never
- ✏️ **Edit & Delete** - Every share returns a private edit token
- 🧜 **Mermaid Diagrams** - ` ```mermaid ` code blocks render as diagrams
- 📑 **Table of Contents** - Auto-generated sidebar for long documents
- 🔗 **Raw Endpoint + API** - `GET /raw/:id`, full REST API at `/api-docs`
- 🔌 **MCP Integration** - `share_markdown`, `update_share`, `delete_share` tools
- 📚 **Guides and tools** - About, What is MCP, AI IDE guide, use cases, API docs, worked examples, 21 free markdown tools
- 🔐 **Security Defaults** - Validation, payload limits, rate limiting, and protected ops endpoints

## Public Pages

- `/` - Markdown editor + live preview
- `/about` - Product overview
- `/what-is-mcp` - MCP explainer
- `/ai-powered-ide` - AI IDE workflow guide
- `/use-cases` - Common usage patterns
- `/api-docs` - REST API documentation (includes a GitHub Actions publishing recipe)
- `/github-action` - the reusable GitHub Action (`uses: invisible-hand/docs-md.com/action@v1`, source in `action/`)
- `/llms.txt` - machine-readable index of the public pages for AI crawlers
- `/share-implementation-plan`, `/agent-handoff-document`, `/share-architecture-diagram`, `/bug-report-template` - walkthroughs with example documents (`content/examples/*.md`, served at `/examples/<slug>/raw`)
- `/share-markdown-without-account` - comparison of no-signup markdown sharing services
- `/tools` - free markdown tools; `/guides` - syntax guides
- `/sitemap.xml` and `/robots.txt`

## API

See [docs-md.com/api-docs](https://docs-md.com/api-docs). Summary:

- `POST /api/share` — body `{content, filename?, expiry?}` where expiry ∈ `1d|7d|30d|never`; returns `{id, url, rawUrl, editToken, expiresAt}` (expiresAt `0` = permanent)
- `PATCH /api/share/:id` — header `x-edit-token`, body `{content, filename?}`
- `DELETE /api/share/:id` — header `x-edit-token`
- `GET /raw/:id` — raw `text/markdown`

Indexing policy: only permanent shares are indexable; expiring shares are served with `noindex` (a request to search engines, not a guarantee). All shares are public to anyone with the link; expiry deletes the page at its URL but cannot recall downloaded copies.

## MCP Registry

Published in the [official MCP Registry](https://registry.modelcontextprotocol.io) as `com.docs-md/markdown-share` — remote streamable-HTTP server at `https://docs-md.com/api/mcp` with tools `share_markdown`, `update_share`, and `delete_share`.

## MCP Setup

Remote streamable-HTTP server, no API key. Per-editor configs (Cursor, Claude Code, VS Code, Windsurf, Zed) are on [docs-md.com/ai-powered-ide](https://docs-md.com/ai-powered-ide). Cursor, in `~/.cursor/mcp.json` or the project's `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "md-share": {
      "url": "https://docs-md.com/api/mcp"
    }
  }
}
```

Restart Cursor, then say: "Share this markdown file with a 7-day expiry".

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
