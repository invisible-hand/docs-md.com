/**
 * IndexNow pings — tell Bing/Yandex/Seznam/Naver about new or changed URLs
 * immediately instead of waiting for a sitemap re-crawl. (Google ignores
 * IndexNow; it still relies on the sitemap.)
 *
 * The key is public by design: ownership is verified by fetching
 * `https://docs-md.com/<key>.txt`, which lives in `public/`.
 */
export const INDEXNOW_KEY = 'c8e28ea113e8a2c30214e3131d36176b';
const HOST = 'docs-md.com';

/** Best-effort, never throws, no-op outside production. */
export async function pingIndexNow(paths: string | string[]): Promise<void> {
  if (process.env.VERCEL_ENV !== 'production') return;
  const urlList = (Array.isArray(paths) ? paths : [paths])
    .filter(Boolean)
    .map((p) => (p.startsWith('http') ? p : `https://${HOST}${p}`));
  if (!urlList.length) return;
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // Indexing hints are best-effort; never let them break a caller.
  }
}
