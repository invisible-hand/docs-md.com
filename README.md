# MD Share - Markdown File Sharing Platform

A minimalist, fast markdown file sharing platform built with Next.js 15. Share markdown files with automatically expiring links and integrate with Cursor/Windsurf via the MCP server.

## Features

- 🚀 **Lightning Fast** - Built with Next.js 15 App Router and server components
- 📝 **Markdown Support** - Full markdown rendering with syntax highlighting
- 🔒 **Anonymous Sharing** - No sign-up required
- ⏰ **Auto-Expiring Links** - All shares expire after 30 days
- 🔌 **MCP Server Integration** - Share files directly from Cursor/Windsurf
- 🎨 **Minimalist Design** - Clean, monochrome Vercel-inspired aesthetic

## Tech Stack

- **Frontend + Backend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Storage**: SQLite (better-sqlite3) + File System
- **MCP**: Model Context Protocol TypeScript SDK
- **Markdown**: react-markdown with GFM and syntax highlighting

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd docs-md
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:
```env
BASE_URL=http://localhost:3000
```

In production, set `BASE_URL` to your deployed URL.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Web Interface

1. Visit the homepage
2. Paste markdown content
3. Click "Share" to get a unique link
4. Share the link - it expires in 30 days

### MCP Server Integration

Share markdown files directly from Cursor/Windsurf using the built-in MCP server.

#### Quick Setup for Cursor

1. **Open MCP Settings:**
   - Press `Cmd/Ctrl + Shift + P`
   - Search for "Preferences: Open User Settings (JSON)"
   - Or: Settings → search "MCP" → click "Edit in settings.json"

2. **Add MCP Server Configuration:**
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
   
   For local development, use `http://localhost:3000/api/mcp`

3. **Restart Cursor**

4. **Test it:**
   In Cursor chat, ask:
   ```
   Share this markdown file:
   # Hello World
   This is a test.
   ```

#### How It Works

The MCP server exposes a `share_markdown` tool that:
- Takes markdown content and optional filename
- Creates a share on your server
- Returns a public URL that expires in 30 days

**Example conversation:**
```
You: "Share these meeting notes as markdown"
AI: Uses the share_markdown tool
AI: "✓ Shared at https://docs-md.com/abc123xyz (expires in 30 days)"
```

#### For Windsurf

Similar setup - add to your MCP configuration:
```json
{
  "md-share": {
    "url": "https://docs-md.com/api/mcp",
    "transport": "http"
  }
}
```

## API Routes

### POST `/api/share`

Create a new markdown share.

**Request:**
```json
{
  "content": "# Your markdown content",
  "filename": "document.md"
}
```

**Response:**
```json
{
  "success": true,
  "id": "abc123xyz",
  "url": "http://localhost:3000/abc123xyz",
  "expiresAt": 1234567890
}
```

### GET/DELETE `/api/cleanup`

Remove expired shares from storage and database.

**Response:**
```json
{
  "success": true,
  "deletedCount": 5,
  "message": "Cleaned up 5 expired shares"
}
```

### POST `/api/mcp`

MCP server endpoint for AI assistant integration.

## Project Structure

```
/app
  /page.tsx              # Home page with upload form
  /[id]/page.tsx         # View shared markdown
  /not-found.tsx         # Custom 404 page
  /api
    /share/route.ts      # Create new share
    /cleanup/route.ts    # Delete expired files
    /mcp/route.ts        # MCP server endpoint
  /layout.tsx            # Root layout
  /globals.css           # Global styles + markdown styling

/components
  /MarkdownRenderer.tsx  # Markdown rendering component
  /CopyButton.tsx        # Copy-to-clipboard button

/lib
  /db.ts                 # SQLite database operations
  /storage.ts            # File system operations
  /mcp-server.ts         # MCP server configuration

/data
  /shares.db             # SQLite database (auto-created)

/public
  /uploads               # Markdown files (auto-created)
```

## Database Schema

```sql
CREATE TABLE shares (
  id TEXT PRIMARY KEY,
  filename TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
```

## Deployment

### Deploy to Vercel with Custom Domain

**Prerequisites:**
- GitHub account
- Vercel account
- Domain (docs-md.com)

**Steps:**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/docs-md.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`
   - Add Environment Variable:
     - Key: `BASE_URL`
     - Value: `https://docs-md.com`
   - Click "Deploy"

3. **Connect Custom Domain:**
   - In Vercel project dashboard → Settings → Domains
   - Add domain: `docs-md.com`
   - Follow DNS instructions:
     ```
     A Record: @ → 76.76.21.21
     CNAME: www → cname.vercel-dns.com
     ```
   - Wait for DNS propagation (5-30 minutes)

4. **Verify MCP Integration:**
   - Update your Cursor settings to use `https://docs-md.com/api/mcp`
   - Test sharing from Cursor

**Automatic Cleanup:**
The `vercel.json` configures a daily cron job to clean up expired shares.

### Important Notes

- SQLite works fine for single-region Vercel deployments
- For multi-region or high traffic, consider PostgreSQL
- Vercel has file system limitations - uploads stored in `/tmp` are ephemeral
  - For production at scale, migrate to PostgreSQL + S3

## Automated Cleanup

Expired shares are lazily deleted when accessed. For proactive cleanup, set up a cron job:

```bash
# Run cleanup daily
curl -X DELETE http://localhost:3000/api/cleanup
```

On Vercel, use [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs):

```json
{
  "crons": [{
    "path": "/api/cleanup",
    "schedule": "0 0 * * *"
  }]
}
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Design

Clean, monochrome design inspired by Vercel:
- Light gray backgrounds (#fafafa)
- Pure white cards with subtle borders
- Black buttons and accents
- Minimal shadows
- Geist Sans typography
- Generous spacing

## Production Checklist

Before going live:
- [ ] Set `BASE_URL` environment variable in Vercel
- [ ] Test MCP integration with deployed URL
- [ ] Configure custom domain DNS
- [ ] Test share creation and retrieval
- [ ] Verify cleanup cron job is running
- [ ] Update README with your domain

## Troubleshooting

**MCP not working:**
- Ensure BASE_URL is set correctly
- Verify `/api/mcp` endpoint is accessible
- Restart Cursor after config changes

**Shares not persisting:**
- Check Vercel logs for errors
- Ensure `/tmp` directory permissions
- Consider PostgreSQL for production

**Domain not working:**
- Wait 30 minutes for DNS propagation
- Verify DNS records with `dig docs-md.com`
- Check Vercel domain settings

## License

MIT
