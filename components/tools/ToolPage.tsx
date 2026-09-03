import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import UpdatedLine from '@/components/UpdatedLine';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import { getTool, relatedTools } from '@/lib/tools-registry';

export interface FaqItem {
  q: string;
  a: string;
}

interface ToolPageProps {
  slug: string;
  /** Lead paragraph under the H1. */
  intro: ReactNode;
  /** The interactive tool (a client component). */
  tool: ReactNode;
  /** Prose sections (each a <section> with a question-phrased <h2>). */
  children?: ReactNode;
  /** Rendered as question-phrased H2s at the end and emitted as FAQPage JSON-LD. */
  faq: FaqItem[];
  /** Override the automatic related-tools list. */
  related?: string[];
  /** Width of the tool area. */
  width?: 'wide' | 'narrow';
}

export function toolMetadata(slug: string): Metadata {
  const tool = getTool(slug);
  return { title: tool.metaTitle, description: tool.metaDescription };
}

export const H2 = 'text-xl font-semibold text-gray-950';
export const CODE = 'rounded bg-gray-100 px-1.5 py-0.5 text-sm';

/**
 * The standard shell for a tool page: icon + H1 + updated line, WebApplication
 * and FAQPage JSON-LD, the tool itself, prose sections, the FAQ, and cross-links.
 * Everything a page needs to pass the extractability checklist lives here.
 */
export default function ToolPage({ slug, intro, tool, children, faq, related, width = 'wide' }: ToolPageProps) {
  const t = getTool(slug);
  const url = `https://docs-md.com/${slug}`;
  const more = related ? related.map(getTool) : relatedTools(slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: t.title,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description: t.metaDescription,
        dateModified: t.updated,
        url,
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Tools', item: 'https://docs-md.com/tools' },
          { '@type': 'ListItem', position: 2, name: t.title, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <div className={`mx-auto w-full px-4 py-12 md:py-16 ${width === 'wide' ? 'max-w-6xl' : 'max-w-4xl'}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/tools" className="text-indigo-700 underline">
          Markdown tools
        </Link>{' '}
        / {t.title}
      </nav>
      <div className="mb-8 max-w-3xl">
        <div className="flex items-start gap-4">
          <ToolIconTile slug={slug} size="lg" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">{t.title}</h1>
            <UpdatedLine date={t.updated} className="mt-1 text-sm text-gray-500" />
          </div>
        </div>
        <p className="mt-4 text-base text-gray-600">{intro}</p>
      </div>

      {tool}

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        {children}

        {faq.map((f) => (
          <section key={f.q} className="space-y-2">
            <h2 className={H2}>{f.q}</h2>
            <p>{f.a}</p>
          </section>
        ))}

        <section className="space-y-3 rounded-2xl bg-indigo-50 p-6">
          <h2 className={H2}>More markdown tools</h2>
          <ul className="flex flex-wrap gap-2 text-sm">
            {more.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/${m.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-gray-700 transition hover:border-indigo-400 hover:text-indigo-700"
                >
                  <ToolIconTile slug={m.slug} size="sm" />
                  {m.title}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/tools"
                className="inline-flex items-center rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-gray-700 transition hover:border-indigo-400 hover:text-indigo-700"
              >
                All tools →
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
