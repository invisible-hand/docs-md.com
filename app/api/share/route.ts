import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { normalizeClientName, userAgentFamily } from '@/lib/client-info';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp, parseJsonBodyWithLimit, RequestBodyError } from '@/lib/security';
import { createShare } from '@/lib/share-service';
import { pingIndexNow } from '@/lib/indexnow';
import { consumeDailyQuota, DAILY_SHARE_LIMIT_PER_IP, dailyLimitMessage, secondsUntilUtcMidnight } from '@/lib/quota';

const MAX_SHARE_REQUEST_BYTES = Number(process.env.MAX_SHARE_REQUEST_BYTES ?? 200_000);
const MAX_CONTENT_CHARS = Number(process.env.MAX_MARKDOWN_CHARS ?? 120_000);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
const RATE_LIMIT_SHARE_PER_WINDOW = Number(process.env.RATE_LIMIT_SHARE_PER_WINDOW ?? 20);

const shareRequestSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Content is required')
    .max(MAX_CONTENT_CHARS, `Content exceeds ${MAX_CONTENT_CHARS} characters`),
  filename: z.string().trim().max(120).optional(),
  expiry: z.enum(['1d', '7d', '30d', 'never']).optional().default('30d'),
  client: z.string().max(80).optional(),
  ref: z.string().max(80).optional(),
});

const USAGE = `Docs MD share API — publish markdown at a link, no account.

One line:
  curl --data-binary @README.md https://docs-md.com/api/share

Options (query string or headers):
  ?expiry=1d|7d|30d|never      X-Expiry      (default 30d)
  ?filename=notes.md           X-Filename
  ?client=my-agent             X-Client      (optional: name your tool)

The reply is plain text: the share URL on the first line, then the raw URL,
the expiry and the edit token. Send "Accept: application/json" for JSON, or
POST JSON {"content": "...", "filename": "...", "expiry": "7d"} instead.

Update:  curl -X PATCH https://docs-md.com/api/share/<id> -H 'x-edit-token: <token>' -H 'content-type: application/json' -d '{"content":"..."}'
Delete:  curl -X DELETE https://docs-md.com/api/share/<id> -H 'x-edit-token: <token>'
Read:    curl https://docs-md.com/raw/<id>     (or https://docs-md.com/<id>.md)

Limits: ${DAILY_SHARE_LIMIT_PER_IP} new shares per address per day, ${MAX_CONTENT_CHARS.toLocaleString('en-US')} characters per share.
Docs: https://docs-md.com/agents · OpenAPI: https://docs-md.com/openapi.json · MCP: https://docs-md.com/api/mcp
`;

/** GET /api/share prints usage, so an agent that probes the endpoint learns how to call it. */
export async function GET() {
  return new NextResponse(USAGE, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

function errorResponse(message: string, status: number, asText: boolean, headers: Record<string, string> = {}) {
  return asText
    ? new NextResponse(`error: ${message}\n`, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8', ...headers } })
    : NextResponse.json({ error: message }, { status, headers });
}

/** Raw-body requests (anything not sent as JSON, e.g. curl --data-binary @file.md) carry options in the query or headers. */
function rawBodyRequest(request: NextRequest, content: string) {
  const q = request.nextUrl.searchParams;
  const pick = (param: string, header: string) => q.get(param) ?? request.headers.get(header) ?? undefined;
  return {
    content,
    filename: pick('filename', 'x-filename'),
    expiry: pick('expiry', 'x-expiry'),
    client: pick('client', 'x-client'),
    ref: pick('ref', 'x-ref'),
  };
}

export async function POST(request: NextRequest) {
  const isJsonBody = (request.headers.get('content-type') ?? '').includes('json');
  const wantsJson = isJsonBody || (request.headers.get('accept') ?? '').includes('application/json');
  const asText = !wantsJson;

  try {
    const ip = getClientIp(request);
    const rateResult = checkRateLimit({
      key: `share:${ip}`,
      limit: RATE_LIMIT_SHARE_PER_WINDOW,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });

    if (!rateResult.allowed) {
      return errorResponse('Rate limit exceeded. Please try again shortly.', 429, asText, {
        'Retry-After': String(rateResult.retryAfterSeconds),
      });
    }

    let body: unknown;
    if (isJsonBody) {
      body = await parseJsonBodyWithLimit<unknown>(request, MAX_SHARE_REQUEST_BYTES);
    } else {
      const text = await request.text();
      if (Buffer.byteLength(text, 'utf8') > MAX_SHARE_REQUEST_BYTES) {
        throw new RequestBodyError('Request body is too large', 413);
      }
      body = rawBodyRequest(request, text);
    }

    const parsed = shareRequestSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? 'Invalid request payload', 400, asText);
    }

    const quota = await consumeDailyQuota('share', ip, DAILY_SHARE_LIMIT_PER_IP);
    if (!quota.allowed) {
      return errorResponse(dailyLimitMessage(quota.limit), 429, asText, {
        'Retry-After': String(secondsUntilUtcMidnight()),
      });
    }

    const { content, filename, expiry } = parsed.data;
    const ua = request.headers.get('user-agent');
    const client = normalizeClientName(parsed.data.client) ?? (userAgentFamily(ua) === 'browser' ? 'web-other' : 'api');
    const share = await createShare(content, filename, expiry, {
      client,
      ref: normalizeClientName(parsed.data.ref),
      ua: userAgentFamily(ua),
    });
    // Only never-expiring shares are indexable (others are noindex), so only those get pinged.
    if (expiry === 'never') await pingIndexNow(`/${share.id}`);

    if (asText) {
      const expires = share.expiresAt === 0 ? 'never' : new Date(share.expiresAt).toISOString().slice(0, 10);
      return new NextResponse(
        `${share.url}\nraw: ${share.rawUrl}\nexpires: ${expires}\nedit-token: ${share.editToken}\n`,
        { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
      );
    }

    return NextResponse.json({
      success: true,
      id: share.id,
      url: share.url,
      rawUrl: share.rawUrl,
      editToken: share.editToken,
      expiresAt: share.expiresAt,
      rateLimit: {
        remaining: rateResult.remaining,
        dailyRemaining: Math.max(quota.limit - quota.count, 0),
      },
    });
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return errorResponse(error.message, error.status, asText);
    }

    console.error('Error creating share:', error);
    return errorResponse('Failed to create share', 500, asText);
  }
}
