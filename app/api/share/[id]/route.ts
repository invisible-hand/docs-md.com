import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { MCP_URL } from '@/lib/mcp/tools';
import { getClientIp, RequestBodyError } from '@/lib/security';
import { deleteShare, ShareServiceError } from '@/lib/share-service';

const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
const RATE_LIMIT_SHARE_PER_WINDOW = Number(process.env.RATE_LIMIT_SHARE_PER_WINDOW ?? 20);

interface RouteContext {
  params: Promise<{ id: string }>;
}

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

/** Updating over REST was retired with the rest of the write API on 2026-11-13 (see app/api/share/route.ts). */
export function PATCH(): NextResponse {
  return NextResponse.json(
    {
      error: 'gone',
      message:
        'PATCH /api/share/<id> was retired on 2026-11-13. Update the document with the MCP tool update_share (pass edit_token for a document created before that date).',
      mcp: MCP_URL,
      docs: 'https://docs-md.com/agents/changelog',
    },
    { status: 410 },
  );
}

// DELETE with x-edit-token stays: it is how the author of a document created before agent keys withdraws it.
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
