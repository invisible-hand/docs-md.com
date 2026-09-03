import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp, parseJsonBodyWithLimit, RequestBodyError } from '@/lib/security';
import { vetUrl, vetUrlSyntax } from '@/lib/url-safety';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_BODY_BYTES = 32_000;
const MAX_URLS = 100;
const CONCURRENCY = 8;
const TIMEOUT_MS = 8_000;
const MAX_REDIRECTS = 5;
const MAX_READ_BYTES = 64 * 1024;
const USER_AGENT = 'docs-md-link-checker/1.0 (+https://docs-md.com/markdown-link-checker)';

const schema = z.object({
  urls: z.array(z.string().trim().min(1).max(2048)).min(1).max(MAX_URLS),
});

export interface LinkCheckResult {
  url: string;
  status: number;
  ok: boolean;
  finalUrl: string;
  redirected: boolean;
  ms: number;
  error?: string;
}

async function fetchOnce(url: string, method: 'HEAD' | 'GET'): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      method,
      redirect: 'manual',
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
        'Accept-Language': 'en',
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

/** Follow redirects by hand so every hop goes through the SSRF guard. */
async function fetchFollowing(start: string, method: 'HEAD' | 'GET'): Promise<{ res: Response; finalUrl: string; redirected: boolean }> {
  let current = start;
  let redirected = false;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await fetchOnce(current, method);
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      await res.body?.cancel();
      const next = new URL(res.headers.get('location')!, current).toString();
      const vet = await vetUrl(next);
      if (!vet.ok) throw new Error(`redirect blocked: ${vet.reason}`);
      current = next;
      redirected = true;
      continue;
    }
    return { res, finalUrl: current, redirected };
  }
  throw new Error('too many redirects');
}

async function drain(res: Response): Promise<void> {
  // Read at most MAX_READ_BYTES so a huge body never ties up the function.
  const reader = res.body?.getReader();
  if (!reader) return;
  let read = 0;
  try {
    while (read < MAX_READ_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      read += value.byteLength;
    }
  } finally {
    await reader.cancel().catch(() => undefined);
  }
}

async function checkOne(url: string): Promise<LinkCheckResult> {
  const started = Date.now();
  const base = { url, finalUrl: url, redirected: false };
  const vet = await vetUrl(url);
  if (!vet.ok) return { ...base, status: 0, ok: false, ms: 0, error: vet.reason };

  const attempt = async (method: 'HEAD' | 'GET') => {
    const { res, finalUrl, redirected } = await fetchFollowing(url, method);
    await drain(res);
    return { res, finalUrl, redirected };
  };

  try {
    let result = await attempt('HEAD');
    if ([403, 405, 501].includes(result.res.status) || result.res.status >= 500) {
      result = await attempt('GET');
    }
    return {
      url,
      status: result.res.status,
      ok: result.res.status >= 200 && result.res.status < 400,
      finalUrl: result.finalUrl,
      redirected: result.redirected,
      ms: Date.now() - started,
    };
  } catch (headErr) {
    // Network error on HEAD: one GET retry, then report.
    try {
      const result = await attempt('GET');
      return {
        url,
        status: result.res.status,
        ok: result.res.status >= 200 && result.res.status < 400,
        finalUrl: result.finalUrl,
        redirected: result.redirected,
        ms: Date.now() - started,
      };
    } catch (err) {
      const e = err instanceof Error ? err : headErr instanceof Error ? headErr : new Error('fetch failed');
      const error = e.name === 'AbortError' ? 'timeout' : (e.message || 'fetch failed').slice(0, 120);
      return { ...base, status: 0, ok: false, ms: Date.now() - started, error };
    }
  }
}

async function pool<T, R>(items: T[], size: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return results;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit({ key: `check-links:${ip}`, limit: 20, windowMs: 10 * 60_000 });
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again in a few minutes.' },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } },
      );
    }

    const body = await parseJsonBodyWithLimit<unknown>(request, MAX_BODY_BYTES);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
    }

    const unique = [...new Set(parsed.data.urls)].slice(0, MAX_URLS);
    const results = await pool(unique, CONCURRENCY, async (url) => {
      const syntax = vetUrlSyntax(url);
      if (!syntax.ok) {
        return { url, status: 0, ok: false, finalUrl: url, redirected: false, ms: 0, error: syntax.reason } satisfies LinkCheckResult;
      }
      return checkOne(url);
    });

    return NextResponse.json({ results, rateLimit: { remaining: rate.remaining } });
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('check-links failed:', error);
    return NextResponse.json({ error: 'Link check failed' }, { status: 500 });
  }
}
