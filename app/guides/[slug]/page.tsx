import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { getGuide, listGuideSlugs } from '@/lib/guides';

export const dynamicParams = false;

export function generateStaticParams() {
  return listGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const guide = getGuide(slug);
    return {
      title: guide.title,
      description: guide.description,
      alternates: { canonical: `/guides/${slug}` },
    };
  } catch {
    return {};
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let guide;
  try {
    guide = getGuide(slug);
  } catch {
    notFound();
  }

  const related = guide.related.map((s) => {
    try {
      return getGuide(s);
    } catch {
      return null;
    }
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: guide.h1,
        description: guide.description,
        dateModified: guide.updated,
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: `https://docs-md.com/guides/${guide.slug}`,
      },
      {
        '@type': 'FAQPage',
        mainEntity: guide.faq.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/guides" className="text-indigo-700 underline">
          Markdown guides
        </Link>{' '}
        / {guide.h1}
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
        {guide.h1}
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Updated{' '}
        <time dateTime={guide.updated}>
          {new Date(`${guide.updated}T00:00:00Z`).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC',
          })}
        </time>
      </p>
      <article className="mt-8 guide-article">
        <MarkdownRenderer content={guide.body} />
      </article>
      <section className="mt-12 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6">
        <h2 className="text-base font-semibold text-gray-950">Keep going</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {related.map(
            (r) =>
              r && (
                <li key={r.slug}>
                  <Link href={`/guides/${r.slug}`} className="text-indigo-700 underline">
                    {r.h1}
                  </Link>
                </li>
              ),
          )}
          <li>
            <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">
              The complete markdown cheat sheet
            </Link>
          </li>
          <li>
            <Link href="/" className="text-indigo-700 underline">
              Share a markdown doc — paste, preview, get a link
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
