import { NextResponse } from 'next/server';
import { getExample, listExampleSlugs } from '@/lib/examples';

// GET /examples/<slug>/raw            → text/markdown, rendered inline
// GET /examples/<slug>/raw?download=1 → same bytes as a file download
export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  if (!listExampleSlugs().includes(slug)) return new NextResponse('Not found', { status: 404 });
  const example = getExample(slug);
  const download = new URL(request.url).searchParams.get('download') === '1';
  return new NextResponse(`${example.body}\n`, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${example.filename}"`,
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex',
    },
  });
}
