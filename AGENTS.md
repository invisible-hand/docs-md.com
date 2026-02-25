# AGENTS.md

## Cursor Cloud specific instructions

### Project Overview
MD Share (docs-md.com) — Next.js 16 markdown sharing app. See `README.md` for standard commands (`npm run dev`, `npm run build`, `npm run lint`, `npm run type-check`).

### Local Development Services

Three services must be running for the full app to work:

1. **PostgreSQL** (port 5432): `sudo pg_ctlcluster 16 main start`
2. **Neon HTTP Proxy** (ports 4444/4445): Required because `@vercel/postgres` internally uses Neon's HTTP driver (`neon()`), not standard Postgres wire protocol.
   ```
   sudo docker run -d --name neon-http-proxy --network host \
     -e PG_CONNECTION_STRING="postgres://mdshare:mdshare_dev@localhost:5432/mdshare" \
     ghcr.io/timowilhelm/local-neon-http-proxy:main
   ```
3. **Next.js dev server** (port 3000): `npm run dev`

### Critical Gotchas

- **Turbopack module isolation**: `neonConfig` set in `instrumentation.ts` does NOT propagate to the `@neondatabase/serverless` module instance used by `@vercel/postgres` under Turbopack. The solution is a `globalThis.__neonLocalProxy` bridge patched into `node_modules/@neondatabase/serverless/index.mjs`. Running `npm install` resets this patch — re-apply via the `instrumentation.ts` + module patch approach.
- **Neon proxy SNI requirement**: The proxy expects hostnames matching `*.localtest.me` (resolves to 127.0.0.1). The `fetchFunction` in `instrumentation.ts` rewrites `@localhost:` to `@db.localtest.me:` in the `Neon-Connection-String` header.
- **PostgreSQL user permissions**: The `mdshare` user needs superuser privileges (`ALTER USER mdshare WITH SUPERUSER`) so the neon proxy can query `pg_authid` for authentication.
- **`BLOB_READ_WRITE_TOKEN`**: Must be a real Vercel Blob token (provided as a secret). No local alternative exists for `@vercel/blob`.
- **`/api/init-db` swallows errors**: The `initDatabase()` function catches and logs errors without re-throwing. Always verify schema directly via `psql`.
- **Pre-existing lint errors**: `npm run lint` reports 7 errors in `app/[id]/page.tsx` and `app/not-found.tsx` (React purity rules, `<a>` vs `<Link>`).

### Environment Variables (.env.local)
```
POSTGRES_URL=postgres://mdshare:mdshare_dev@localhost:5432/mdshare
POSTGRES_URL_NON_POOLING=postgres://mdshare:mdshare_dev@localhost:5432/mdshare
BLOB_READ_WRITE_TOKEN=<from secrets>
```

### Database Schema Init
After all services are running, initialize via `curl http://localhost:3000/api/init-db` or directly:
```
PGPASSWORD=mdshare_dev psql -h localhost -U mdshare -d mdshare -c \
  "CREATE TABLE IF NOT EXISTS shares (id TEXT PRIMARY KEY, filename TEXT, blob_url TEXT NOT NULL, created_at BIGINT NOT NULL, expires_at BIGINT NOT NULL); CREATE INDEX IF NOT EXISTS idx_expires_at ON shares(expires_at);"
```
