import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp, parseJsonBodyWithLimit, RequestBodyError } from '@/lib/security';
import { deleteShare, ShareServiceError, updateShare } from '@/lib/share-service';

const MAX_SHARE_REQUEST_BYTES = Number(process.env.MAX_SHARE_REQUEST_BYTES ?? 200_000);
const MAX_CONTENT_CHARS = Number(process.env.MAX_MARKDOWN_CHARS ?? 120_000);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
const RATE_LIMIT_SHARE_PER_WINDOW = Number(process.env.RATE_LIMIT_SHARE_PER_WINDOW ?? 20);

interface RouteContext {
  params: Promise<{ id: string }>;
}

const updateRequestSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Content is required')
    .max(MAX_CONTENT_CHARS, `Content exceeds ${MAX_CONTENT_CHARS} characters`),
  filename: z.string().trim().max(120).optional(),
});

function getEditToken(request: NextRequest): string {
  return request.headers.get('x-edit-token')?.trim() ?? '';
}

function checkMutationRateLimit(request: NextRequest): NextResponse | null {
  const ip = getClientIp(request);
  const rateResult = checkRateLimit({
    key: `share:${ip}`,
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

  return null;
}

function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof ShareServiceError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof RequestBodyError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error('Share mutation error:', error);
  return NextResponse.json({ error: 'Internal error' }, { status: 500 });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const rateLimited = checkMutationRateLimit(request);
    if (rateLimited) {
      return rateLimited;
    }

    const { id } = await context.params;
    const body = await parseJsonBodyWithLimit<unknown>(request, MAX_SHARE_REQUEST_BYTES);
    const parsed = updateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid request payload' },
        { status: 400 }
      );
    }

    const { url } = await updateShare(id, getEditToken(request), parsed.data.content, parsed.data.filename);
    return NextResponse.json({ success: true, id, url });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const rateLimited = checkMutationRateLimit(request);
    if (rateLimited) {
      return rateLimited;
    }

    const { id } = await context.params;
    await deleteShare(id, getEditToken(request));
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return toErrorResponse(error);
  }
}
