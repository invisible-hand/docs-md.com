# Deployment Guide

## Quick Deploy to Vercel

### 1. Prepare for GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - MD Share platform"

# Create GitHub repository and push
# Go to github.com and create a new repository called 'docs-md'
git remote add origin https://github.com/YOUR_USERNAME/docs-md.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

4. Add Environment Variable:
   - **Name:** `BASE_URL`
   - **Value:** `https://docs-md.com`
   - Click "Add"

5. Click **"Deploy"** and wait (~2 minutes)

### 3. Configure Custom Domain

Once deployed:

1. In Vercel dashboard → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter: `docs-md.com`
4. Click **"Add"**

Vercel will show DNS records to configure:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

5. Go to your domain registrar (GoDaddy, Namecheap, etc.)
6. Add the DNS records shown by Vercel
7. Wait 5-30 minutes for DNS propagation

### 4. Verify Deployment

Test your deployment:

```bash
# Test the website
curl https://docs-md.com

# Test API
curl -X POST https://docs-md.com/api/share \
  -H "Content-Type: application/json" \
  -d '{"content":"# Test","filename":"test.md"}'

# Test MCP endpoint
curl https://docs-md.com/api/mcp
```

### 5. Set Up MCP in Cursor

1. Open Cursor
2. Press `Cmd/Ctrl + Shift + P`
3. Search for "Preferences: Open User Settings (JSON)"
4. Add:

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

5. Restart Cursor
6. Test in chat: "Share this markdown: # Hello World"

## Monitoring

### View Logs
- Vercel Dashboard → Your Project → **Logs**
- Filter by time range and function

### Check Cron Jobs
- Vercel Dashboard → Your Project → **Cron Jobs**
- Should see: `/api/cleanup` running daily at midnight

### Analytics
- Vercel Dashboard → Your Project → **Analytics**
- Track visits, performance, and errors

## Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Verify all dependencies in package.json
- Check Vercel build logs

### Domain Not Working
```bash
# Check DNS propagation
dig docs-md.com
dig www.docs-md.com

# Should show Vercel IPs
```

### MCP Not Connecting
1. Verify BASE_URL is set in Vercel
2. Test endpoint: `curl https://docs-md.com/api/mcp`
3. Check Cursor settings.json syntax
4. Restart Cursor completely

### Database Issues
- SQLite works on Vercel but data is ephemeral in serverless
- Files in `/tmp` are cleared periodically
- For production, consider:
  - Vercel Postgres
  - Vercel Blob Storage
  - Or external PostgreSQL + S3

## Production Optimization

### Enable Caching
Already configured in `next.config.ts` for optimal performance.

### Add Rate Limiting
Consider adding rate limiting for `/api/share`:
- Use Vercel Edge Config
- Or Upstash Redis

### Monitor Costs
- Vercel free tier: 100 GB bandwidth, 100 GB-hours
- Check usage in billing dashboard

## Updating

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push

# Vercel automatically deploys on push to main
```

## Rollback

If something breaks:

1. Vercel Dashboard → **Deployments**
2. Find previous working deployment
3. Click **"..."** → **"Promote to Production"**

---

🎉 **You're live!** Share your first markdown at https://docs-md.com

