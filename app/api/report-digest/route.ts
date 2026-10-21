import { NextRequest, NextResponse } from 'next/server';
import { dbOperations, ShareReport } from '@/lib/db';
import { REPORT_REASONS } from '@/lib/legal';
import { isAuthorizedByEnvSecret } from '@/lib/security';

// Daily cron (vercel.json): emails the operator the reports and contact messages that arrived
// since the last digest, and sends nothing when there are none. Addresses and the Resend key
// live only in environment variables (REPORT_DIGEST_TO, REPORT_DIGEST_FROM, RESEND_API_KEY).

const URGENT = new Set(['child-safety', 'intimate-imagery', 'personal-data', 'illegal']);

function reasonLabel(value: string): string {
  return REPORT_REASONS.find((r) => r.value === value)?.label ?? value;
}

function formatReport(r: ShareReport): string {
  const when = new Date(Number(r.created_at)).toISOString().slice(0, 16).replace('T', ' ');
  return [
    `#${r.id} · ${when} UTC · ${URGENT.has(r.reason) ? 'URGENT · ' : ''}${reasonLabel(r.reason)}`,
    `Share: ${r.share_id ? `https://docs-md.com/${r.share_id}` : '(none)'}`,
    `From: ${r.contact || '(no email left)'}`,
    r.details ? `\n${r.details}` : '',
  ].join('\n');
}

export async function GET(request: NextRequest) {
  if (!isAuthorizedByEnvSecret(request, 'CRON_SECRET')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { RESEND_API_KEY, REPORT_DIGEST_TO, REPORT_DIGEST_FROM } = process.env;
  if (!RESEND_API_KEY || !REPORT_DIGEST_TO || !REPORT_DIGEST_FROM) {
    return NextResponse.json({ error: 'Digest email is not configured' }, { status: 500 });
  }

  const reports = await dbOperations.getUnnotifiedReports();
  if (reports.length === 0) {
    return NextResponse.json({ success: true, sent: 0 });
  }

  // Urgent categories first: the acceptable use policy promises action within 48 hours.
  const ordered = [...reports].sort((a, b) => Number(URGENT.has(b.reason)) - Number(URGENT.has(a.reason)));
  const urgentCount = reports.filter((r) => URGENT.has(r.reason)).length;
  const subject = `Docs MD: ${reports.length} new report${reports.length === 1 ? '' : 's'}${urgentCount ? ` (${urgentCount} urgent)` : ''}`;
  const text = [
    `${reports.length} new report${reports.length === 1 ? '' : 's'} or message${reports.length === 1 ? '' : 's'} from the docs-md.com form.`,
    '',
    ordered.map(formatReport).join('\n\n----------------------------------------\n\n'),
    '',
    'List them any time: npx tsx scripts/list-reports.ts',
  ].join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: REPORT_DIGEST_FROM, to: [REPORT_DIGEST_TO], subject, text }),
  });
  if (!res.ok) {
    console.error('Report digest send failed:', res.status, await res.text());
    return NextResponse.json({ error: 'Send failed' }, { status: 502 });
  }

  await dbOperations.markReportsNotified(reports.map((r) => r.id));
  return NextResponse.json({ success: true, sent: reports.length });
}
