// Classifies who is calling, for the share channel stats (scripts/share-stats.ts).
// Only a short product token is stored (e.g. "curl", "python-requests", "claude-code"), never the full user agent.

const BOT_PATTERN =
  /bot|crawl|spider|slurp|preview|fetcher|scrape|headless|lighthouse|monitor|uptime|curl|wget|python|httpx|axios|node-fetch|undici|go-http|java\/|okhttp|libwww|facebookexternalhit|whatsapp|telegram|discord|slack|embedly|vercel|ahrefs|semrush|gptbot|claude|perplexity|bytespider/i;

/** True for crawlers, link unfurlers and scripts: anything that is not a person reading the page. */
export function isBotUserAgent(ua: string | null | undefined): boolean {
  if (!ua) return true;
  return BOT_PATTERN.test(ua);
}

/** Short lowercase product token: "Mozilla/5.0 (…)" → "browser", "curl/8.4.0" → "curl". */
export function userAgentFamily(ua: string | null | undefined): string {
  if (!ua) return 'none';
  if (/^Mozilla\//.test(ua) && !/bot|crawl|spider/i.test(ua)) return 'browser';
  const token = ua.trim().split(/[\s/;(]/)[0] ?? '';
  return token.toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 40) || 'unknown';
}

/** Client names sent by our own front ends, the CLI, the skill and integrations. Free-form but bounded. */
export function normalizeClientName(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const v = value.trim().toLowerCase().replace(/[^a-z0-9:._-]/g, '').slice(0, 40);
  return v || null;
}
