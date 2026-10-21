import { cheatSheetMarkdown } from '@/lib/cheat-sheet-markdown';

// The cheat sheet as plain markdown, for agents, scripts and anyone who wants the source.
export const dynamic = 'force-static';

export function GET() {
  return new Response(cheatSheetMarkdown('2026-10-20'), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      Link: '<https://docs-md.com/markdown-cheat-sheet>; rel="canonical"',
    },
  });
}
