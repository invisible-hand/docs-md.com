# AGENTS.md

## Cursor Cloud specific instructions

### Project Overview
MD Share (docs-md.com) is a Next.js 16 markdown file sharing app using `@vercel/postgres` (Neon) for metadata and `@vercel/blob` for file storage. See `README.md` for standard commands (`npm run dev`, `npm run build`, `npm run lint`).

### Local Development Services
- **PostgreSQL**: Must be running on port 5432. Start with `sudo pg_ctlcluster 16 main start`.
- **Neon HTTP Proxy**: Required for `@vercel/postgres`'s `sql` tagged template (which uses Neon's HTTP driver internally). Run via Docker:
  ```
  sudo docker run -d --name neon-http-proxy --network host \
    -e PG_CONNECTION_STRING="postgres://mdshare:mdshare_dev@localhost:5432/mdshare" \
    ghcr.io/timowilhelm/local-neon-http-proxy:main
  ```
- **Next.js dev server**: `npm run dev` (port 3000).

### Key Gotchas
- `@vercel/postgres`'s `sql` template uses Neon's HTTP driver (`neon()`), not standard Postgres wire protocol. A local PostgreSQL alone is insufficient; the neon HTTP proxy (port 4444) must be running.
- The `instrumentation.ts` file configures `neonConfig.fetchEndpoint` to route through the local proxy in development mode. Without it, database queries silently fail.
- `BLOB_READ_WRITE_TOKEN` must be a valid Vercel Blob token for share creation to work. There is no local alternative for `@vercel/blob`.
- The `/api/init-db` endpoint initializes the database schema but swallows errors (logs to console only). Always verify schema via `psql`.
- Lint (`npm run lint`) has pre-existing errors in `app/[id]/page.tsx` and `app/not-found.tsx` (React purity rules, `<a>` vs `<Link>`).
- Type-check: `npm run type-check` (runs `tsc --noEmit`).

### Environment Variables (.env.local)
```
POSTGRES_URL=postgres://mdshare:mdshare_dev@localhost:5432/mdshare
POSTGRES_URL_NON_POOLING=postgres://mdshare:mdshare_dev@localhost:5432/mdshare
BLOB_READ_WRITE_TOKEN=<real Vercel Blob token required for share functionality>
```

### Database Setup
After PostgreSQL and the neon proxy are running, initialize the schema:
```
curl http://localhost:3000/api/init-db
```
Or directly via psql:
```
PGPASSWORD=mdshare_dev psql -h localhost -U mdshare -d mdshare -c "CREATE TABLE IF NOT EXISTS shares (id TEXT PRIMARY KEY, filename TEXT, blob_url TEXT NOT NULL, created_at BIGINT NOT NULL, expires_at BIGINT NOT NULL); CREATE INDEX IF NOT EXISTS idx_expires_at ON shares(expires_at);"
```
