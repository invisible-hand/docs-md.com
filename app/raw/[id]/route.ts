import { NextResponse } from 'next/server';
import { getLiveShare, ShareServiceError } from '@/lib/share-service';
import { storageOperations } from '@/lib/storage';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const share = await getLiveShare(id);
    const content = await storageOperations.readMarkdown(share.blob_url);

    if (content === null) {
      return new NextResponse('Not found', { status: 404 });
    }

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `inline; filename="${share.filename.replace(/"/g, '')}"`,
        'Cache-Control': 'public, max-age=60',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (error) {
    if (error instanceof ShareServiceError) {
      return new NextResponse('Not found', { status: 404 });
    }
    console.error('Raw share error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
