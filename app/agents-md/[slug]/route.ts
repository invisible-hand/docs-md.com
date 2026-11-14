import { agentIndexMarkdown, agentPageMarkdown, getAgentPage, listAgentPageSlugs } from '@/lib/agent-pages';

// The guides for agents as plain markdown. /agents/<slug>.md and /agents.md rewrite here
// (next.config.ts), and so does /agents/<slug> when the request says "Accept: text/markdown".

export const dynamicParams = false;

export function generateStaticParams() {
  return [...listAgentPageSlugs(), 'index'].map((slug) => ({ slug }));
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  let markdown: string;
  let canonical: string;
  try {
    if (slug === 'index') {
      markdown = agentIndexMarkdown();
      canonical = 'https://docs-md.com/agents';
    } else {
      markdown = agentPageMarkdown(getAgentPage(slug));
      canonical = `https://docs-md.com/agents/${slug}`;
    }
  } catch {
    return new Response('Not found\n', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      // The HTML page is the one to index; this is the same content for machines.
      Link: `<${canonical}>; rel="canonical"`,
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'public, max-age=300',
      Vary: 'Accept',
    },
  });
}
