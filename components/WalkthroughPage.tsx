import type { ReactNode } from 'react';
import UpdatedLine from '@/components/UpdatedLine';

export interface Faq {
  q: string;
  a: string;
}

interface WalkthroughPageProps {
  slug: string;
  title: string;
  description: string;
  updated: string; // YYYY-MM-DD
  faq: Faq[];
  children: ReactNode;
}

export const H2 = 'text-xl font-semibold text-gray-950';
export const CODE = 'rounded bg-gray-100 px-1.5 py-0.5 text-sm';
export const LINK = 'text-indigo-700 underline';

export function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-200">
      <code>{children}</code>
    </pre>
  );
}

// Article + FAQPage JSON-LD, a visible Updated line, and a FAQ block rendered
// from the same array — the extractability template the cited pages use.
export default function WalkthroughPage({ slug, title, description, updated, faq, children }: WalkthroughPageProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: title,
        description,
        dateModified: updated,
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: `https://docs-md.com/${slug}`,
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
    <section className="mx-auto w-full max-w-4xl px-4 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">{title}</h1>
        <p className="mt-4 text-base text-gray-600">{description}</p>
        <UpdatedLine date={updated} />
        <div className="mt-8 space-y-8 text-gray-700">
          {children}
          <section className="space-y-4">
            <h2 className={H2}>FAQ</h2>
            <div className="space-y-4">
              {faq.map((f) => (
                <div key={f.q}>
                  <h3 className="font-semibold text-gray-900">{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
