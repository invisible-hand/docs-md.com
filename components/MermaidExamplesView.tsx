import Link from 'next/link';
import CopyButton from '@/components/CopyButton';
import RichText from '@/components/discord/RichText';
import MermaidDiagram from '@/components/MermaidDiagram';
import UpdatedLine from '@/components/UpdatedLine';
import { MERMAID_PAGES, type MermaidExamplesPage } from '@/lib/mermaid-examples';

const OTHER_MERMAID: Array<{ href: string; label: string }> = [{ href: '/mermaid-timeline-examples', label: 'Timeline' }];

/** The shared layout of the "Mermaid <chart> examples" pages: rendered examples, answers, FAQ, sources. */
export default function MermaidExamplesView({ page: p }: { page: MermaidExamplesPage }) {
  const url = `https://docs-md.com/${p.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: p.h1,
        description: p.description,
        dateModified: p.updated,
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: url,
      },
      {
        '@type': 'FAQPage',
        mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/`/g, '') } })),
      },
    ],
  };
  const siblings = [
    ...OTHER_MERMAID,
    ...MERMAID_PAGES.filter((x) => x.slug !== p.slug).map((x) => ({ href: `/${x.slug}`, label: x.label })),
  ];
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">{p.h1}</h1>
      <UpdatedLine date={p.updated} />
      <p className="mt-4 max-w-3xl text-base text-gray-600">
        <RichText text={p.answer} />
      </p>
      <nav aria-label="Examples on this page" className="mt-5 flex flex-wrap gap-2 text-xs">
        {p.examples.map((ex) => (
          <a key={ex.id} href={`#${ex.id}`} className="rounded-full border border-gray-200 px-3 py-1 text-gray-700 hover:border-indigo-300 hover:text-indigo-700">
            {ex.title}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-12">
        {p.examples.map((ex) => (
          <section key={ex.id} id={ex.id} className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-950">{ex.title}</h2>
            <p className="max-w-3xl text-gray-600">
              <RichText text={ex.intro} />
            </p>
            <div className="space-y-4">
              <div className="relative rounded-2xl border border-gray-200 bg-gray-50">
                <div className="absolute right-3 top-3">
                  <CopyButton content={'```mermaid\n' + ex.code + '\n```'} />
                </div>
                <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-gray-800">{ex.code}</pre>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6" data-mermaid-example={ex.id}>
                <MermaidDiagram chart={ex.code} />
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        {p.sections.map((s) => (
          <section key={s.h2} className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-950">{s.h2}</h2>
            {s.paragraphs.map((t, i) => (
              <p key={i}>
                <RichText text={t} />
              </p>
            ))}
            {s.table && (
              <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
                <table className="w-full min-w-[480px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-left">
                      {s.table.head.map((h) => (
                        <th key={h} className="px-4 py-2.5 font-semibold text-gray-950">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.table.rows.map((r, i) => (
                      <tr key={i} className="border-b border-gray-100 align-top">
                        {r.map((c, j) => (
                          <td key={j} className="px-4 py-2.5 text-gray-700">
                            <RichText text={c} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
        {p.faq.map((f) => (
          <section key={f.q} className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-950">{f.q}</h2>
            <p>
              <RichText text={f.a} />
            </p>
          </section>
        ))}
        <section className="space-y-2 text-sm text-gray-600">
          <h2 className="text-base font-semibold text-gray-950">Sources</h2>
          <ul className="list-disc space-y-1 pl-5">
            {p.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} className="text-indigo-700 underline" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section className="no-print space-y-3 rounded-2xl bg-indigo-50 p-6">
          <h2 className="text-xl font-semibold text-gray-950">More Mermaid examples</h2>
          <p className="text-sm">
            {siblings.map((s, i) => (
              <span key={s.href}>
                {i > 0 && ' · '}
                <Link href={s.href} className="text-indigo-700 underline">
                  {s.label}
                </Link>
              </span>
            ))}
            {' · '}
            {p.related.map((r, i) => (
              <span key={r}>
                {i > 0 && ' · '}
                <Link href={r} className="text-indigo-700 underline">
                  {r.replace(/^\//, '').replace(/-/g, ' ')}
                </Link>
              </span>
            ))}
          </p>
        </section>
      </div>
    </div>
  );
}
