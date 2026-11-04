import type { ReactNode } from 'react';
import UpdatedLine from '@/components/UpdatedLine';

interface ContentPageProps {
  title: string;
  description: string;
  children: ReactNode;
  /** YYYY-MM-DD; renders the visible "Updated" line (pair with `path` for the JSON-LD). */
  updated?: string;
  /**
   * Pathname, e.g. "/about". With `updated`, emits Article JSON-LD (headline, description,
   * dateModified, publisher). Leave it out on pages that build their own JSON-LD graph.
   */
  path?: string;
}

export default function ContentPage({ title, description, children, updated, path }: ContentPageProps) {
  const jsonLd =
    updated && path
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description,
          dateModified: updated,
          author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
          mainEntityOfPage: `https://docs-md.com${path}`,
        }
      : null;
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 md:py-16">
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /> : null}
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">{title}</h1>
        <p className="mt-4 text-base text-gray-600">{description}</p>
        {updated ? <UpdatedLine date={updated} /> : null}
        <div className="mt-8 space-y-8 text-gray-700">{children}</div>
      </div>
    </section>
  );
}
