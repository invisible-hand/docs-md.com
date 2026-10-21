import { NextResponse } from 'next/server';
import { isExpired } from '@/lib/db';
import { getCachedShare } from '@/lib/share-cache';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// Header values must be Latin-1, so non-ASCII names go in the RFC 5987 filename* form
// with an ASCII fallback (a raw "заметки.md" here used to throw and return 500).
function contentDisposition(filename: string): string {
  const ascii = filename.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '') || 'untitled.md';
  const encoded = encodeURIComponent(filename).replace(/['()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
  return `inline; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const cached = await getCachedShare(id);
    // Expired shares 404 at once; the cleanup cron deletes them.
    if (!cached || cached.content === null || isExpired(cached.share, Date.now())) {
      return new NextResponse('Not found', { status: 404 });
    }
    const { share, content } = cached;

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': contentDisposition(share.filename),
        'Cache-Control': 'public, max-age=60',
        // /<id> rewrites here for "Accept: text/markdown"; keep the CDN from serving markdown to browsers.
        'CDN-Cache-Control': 'no-store',
        Vary: 'Accept',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (error) {
    console.error('Raw share error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
