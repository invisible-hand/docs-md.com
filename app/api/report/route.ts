import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dbOperations } from '@/lib/db';
import { REPORT_REASONS } from '@/lib/legal';
import { consumeDailyQuota, DAILY_REPORT_LIMIT_PER_IP } from '@/lib/quota';
import { getClientIp, parseJsonBodyWithLimit, RequestBodyError } from '@/lib/security';

const MAX_REPORT_BYTES = 16_000;

const reportSchema = z.object({
  // Accepts a bare share id or a full docs-md.com URL; the id is extracted below.
  share: z.string().trim().max(300).optional().default(''),
  reason: z.enum(REPORT_REASONS.map((r) => r.value) as [string, ...string[]]),
  details: z.string().trim().max(5_000).optional().default(''),
  contact: z.string().trim().max(200).optional().default(''),
});

function extractShareId(input: string): string | null {
  const match = /([a-z]+-[a-z]+-[A-Za-z0-9]{5})\/?(?:[?#].*)?$/.exec(input.trim());
  return match ? match[1] : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseJsonBodyWithLimit<unknown>(request, MAX_REPORT_BYTES);
    const parsed = reportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid report' }, { status: 400 });
    }

    const { share, reason, details, contact } = parsed.data;
    const shareId = share ? extractShareId(share) : null;
    if (share && !shareId) {
      return NextResponse.json({ error: 'That does not look like a docs-md.com share link.' }, { status: 400 });
    }
    if (!shareId && !details) {
      return NextResponse.json({ error: 'Add the share link or describe what you are reporting.' }, { status: 400 });
    }

    const quota = await consumeDailyQuota('report', getClientIp(request), DAILY_REPORT_LIMIT_PER_IP);
    if (!quota.allowed) {
      return NextResponse.json({ error: 'Too many reports from this address today. Email us instead.' }, { status: 429 });
    }

    const id = await dbOperations.createReport(shareId, reason, details || null, contact || null);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Error saving report:', error);
    return NextResponse.json({ error: 'Could not save the report. Please email us instead.' }, { status: 500 });
  }
}
