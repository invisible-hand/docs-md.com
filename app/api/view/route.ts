import { NextRequest } from 'next/server';
import { isBotUserAgent } from '@/lib/client-info';
import { dbOperations } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/security';

// POST /api/view: one human view of a share page (sent by components/ShareViewBeacon.tsx).
// Bots and bursts are dropped before the database is touched. Always 204.
export async function POST(request: NextRequest) {
  const ua = request.headers.get('user-agent');
  const burst = checkRateLimit({ key: `view:${getClientIp(request)}`, limit: 30, windowMs: 60_000 });
  if (!isBotUserAgent(ua) && burst.allowed) {
    await dbOperations.recordShareView().catch((error) => console.error('Error recording share view:', error));
  }
  return new Response(null, { status: 204 });
}
