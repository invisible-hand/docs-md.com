import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dbOperations } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp, normalizeFilename, parseJsonBodyWithLimit, RequestBodyError } from '@/lib/security';
import { storageOperations } from '@/lib/storage';
import { generateSlug } from '@/lib/slug-generator';

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

    const { content, filename } = parsed.data;

    // Generate unique friendly slug
    let id = generateSlug();
    
    // Ensure uniqueness (unlikely collision, but check anyway)
    let attempts = 0;
    while (await dbOperations.getShare(id) && attempts < 5) {
      id = generateSlug();
      attempts++;
    }
    
    // Save markdown file and get blob URL
    const blobUrl = await storageOperations.saveMarkdown(id, content);
    
    // Save metadata to database
    const share = await dbOperations.createShare(
      id,
      normalizeFilename(filename),
      blobUrl
    );

    // Get base URL - always use custom domain
    const baseUrl = 'https://docs-md.com';
    const shareUrl = `${baseUrl}/${id}`;

    return NextResponse.json({
      success: true,
      id: share.id,
      url: shareUrl,
      expiresAt: share.expires_at,
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

