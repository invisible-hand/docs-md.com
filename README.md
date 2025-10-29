# MD Share

Share markdown files with auto-expiring links. Built with Next.js 15.

## Features

- 📝 **Instant Sharing** - Paste markdown, get a shareable link
- ⏰ **Auto-Expiring** - All links expire after 30 days
- 🔌 **MCP Integration** - Share directly from Cursor AI
- 🎨 **Clean Design** - Minimalist, readable interface

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

## Development

```bash
# Install
npm install

# Run dev server
npm run dev

# Build
npm run build
```

## Tech Stack

- Next.js 15, TypeScript, Tailwind CSS
- SQLite + File System
- Model Context Protocol (MCP)

## License

MIT
