import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp, parseJsonBodyWithLimit, RequestBodyError } from '@/lib/security';
import { createShare } from '@/lib/share-service';
import { pingIndexNow } from '@/lib/indexnow';

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
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimitKey = `share:${ip}`;
    const rateResult = checkRateLimit({
      key: rateLimitKey,
      limit: RATE_LIMIT_SHARE_PER_WINDOW,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });

    if (!rateResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again shortly.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateResult.retryAfterSeconds) },
        }
      );
    }

    const body = await parseJsonBodyWithLimit<unknown>(request, MAX_SHARE_REQUEST_BYTES);
    const parsed = shareRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid request payload' },
        { status: 400 }
      );
    }

    const { content, filename, expiry } = parsed.data;
    const share = await createShare(content, filename, expiry);
    // Only never-expiring shares are indexable (others are noindex), so only those get pinged.
    if (expiry === 'never') await pingIndexNow(`/${share.id}`);

    return NextResponse.json({
      success: true,
      id: share.id,
      url: share.url,
      rawUrl: share.rawUrl,
      editToken: share.editToken,
      expiresAt: share.expiresAt,
      rateLimit: {
        remaining: rateResult.remaining,
      },
    });
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error('Error creating share:', error);
    return NextResponse.json(
      { error: 'Failed to create share' },
      { status: 500 }
    );
  }
}
