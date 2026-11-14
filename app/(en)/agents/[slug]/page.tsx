import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { AGENT_PAGE_GROUPS, getAgentPage, listAgentPageSlugs } from '@/lib/agent-pages';
import { pageMetadata } from '@/lib/page-metadata';

// Guides for AI agents (content/agents/*.md, plus the generated tool reference). Each page is
// also served as plain markdown at /agents/<slug>.md (app/agents-md/[slug]/route.ts).

export const dynamicParams = false;

export function generateStaticParams() {
  return listAgentPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const page = getAgentPage(slug);
    return pageMetadata({
      title: page.title,
      description: page.description,
      path: `/agents/${slug}`,
      type: 'article',
      kicker: 'For AI agents',
      extra: { alternates: { canonical: `/agents/${slug}`, types: { 'text/markdown': `/agents/${slug}.md` } } },
    });
  } catch {
    return {};
  }
}

export default async function AgentGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let page;
  try {
    page = getAgentPage(slug);
  } catch {
    notFound();
  }
  const related = page.related.flatMap((s) => {
    try {
      return [getAgentPage(s)];
    } catch {
      return [];
    }
  });
  const group = AGENT_PAGE_GROUPS.find((g) => g.slugs.includes(slug));
  const url = `https://docs-md.com/agents/${page.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Docs MD', item: 'https://docs-md.com/' },
          { '@type': 'ListItem', position: 2, name: 'For AI agents', item: 'https://docs-md.com/agents' },
          { '@type': 'ListItem', position: 3, name: page.h1, item: url },
        ],
      },
      {
        '@type': 'TechArticle',
        headline: page.h1,
        description: page.description,
        dateModified: page.updated,
        datePublished: '2026-11-13',
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        publisher: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: url,
        audience: { '@type': 'Audience', audienceType: 'AI agents and the people who operate them' },
        encoding: { '@type': 'MediaObject', encodingFormat: 'text/markdown', contentUrl: `${url}.md` },
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faq.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/agents" className="text-indigo-700 underline">
          For AI agents
        </Link>{' '}
        / {group ? `${group.title} / ` : ''}
        {page.h1}
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">{page.h1}</h1>
      <p className="mt-2 text-sm text-gray-500">
        Updated{' '}
        <time dateTime={page.updated}>
          {new Date(`${page.updated}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
        </time>{' '}
        · Agents: this page as markdown is at{' '}
        <a href={`/agents/${page.slug}.md`} className="text-indigo-700 underline">
          /agents/{page.slug}.md
        </a>
      </p>
      <article className="guide-article mt-8">
        <MarkdownRenderer content={page.body} demoteH1 />
      </article>
      <section className="mt-12 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6">
        <h2 className="text-base font-semibold text-gray-950">Keep going</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {related.map((r) => (
            <li key={r.slug}>
              <Link href={`/agents/${r.slug}`} className="text-indigo-700 underline">
                {r.h1}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/agents" className="text-indigo-700 underline">
              All guides for agents
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
