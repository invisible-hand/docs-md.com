import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import UpdatedLine from '@/components/UpdatedLine';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import { SITE_URL } from '@/lib/page-metadata';
import { labelForPath, toolGuidesFor, type ToolGuide } from '@/lib/tool-guides';
import { getTool } from '@/lib/tools-registry';

/** "Do it now" card linking a tool guide back to the tool that answers it. */
function ToolCta({ slug }: { slug: string }) {
  const tool = getTool(slug);
  return (
    <Link
      href={`/${slug}`}
      className="group flex items-start gap-4 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 transition hover:border-indigo-400"
    >
      <ToolIconTile slug={slug} size="md" />
      <span className="block">
        <span className="block text-base font-semibold text-gray-950">{tool.title}</span>
        <span className="mt-1 block text-sm text-gray-600">{tool.description}</span>
        <span className="mt-2 block text-sm font-medium text-indigo-700 group-hover:underline">
          Do it now →
        </span>
      </span>
    </Link>
  );
}

/**
 * A question page nested under a tool (/<tool>/<question>): breadcrumb, H1, the
 * markdown body, CTA cards to the tool at top and bottom, related links, and
 * BreadcrumbList + Article + FAQPage JSON-LD. Modelled on app/guides/[slug].
 */
export default function ToolGuidePage({ guide }: { guide: ToolGuide }) {
  const tool = getTool(guide.tool);
  const url = `${SITE_URL}${guide.path}`;

  const related = guide.related
    .map((path) => ({ path, label: labelForPath(path) }))
    .filter((r): r is { path: string; label: string } => Boolean(r.label));
  const siblings = toolGuidesFor(guide.tool).filter(
    (g) => g.slug !== guide.slug && !guide.related.includes(g.path),
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Docs MD', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: tool.title, item: `${SITE_URL}/${tool.slug}` },
          { '@type': 'ListItem', position: 3, name: guide.h1, item: url },
        ],
      },
      {
        '@type': 'Article',
        headline: guide.h1,
        description: guide.description,
        dateModified: guide.updated,
        author: { '@type': 'Organization', name: 'Docs MD', url: SITE_URL },
        publisher: { '@type': 'Organization', name: 'Docs MD', url: SITE_URL },
        mainEntityOfPage: url,
        about: { '@type': 'WebApplication', name: tool.title, url: `${SITE_URL}/${tool.slug}` },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
        <Link href="/" className="text-indigo-700 underline">
          Docs MD
        </Link>{' '}
        ›{' '}
        <Link href={`/${tool.slug}`} className="text-indigo-700 underline">
          {tool.title}
        </Link>{' '}
        › {guide.h1}
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">{guide.h1}</h1>
      <UpdatedLine date={guide.updated} />

      <div className="mt-6">
        <ToolCta slug={tool.slug} />
      </div>

      <article className="mt-8 guide-article">
        <MarkdownRenderer content={guide.body} />
      </article>

      <div className="mt-12">
        <ToolCta slug={tool.slug} />
      </div>

      {(related.length > 0 || siblings.length > 0) && (
        <section className="mt-8 rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-950">Related</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {related.map((r) => (
              <li key={r.path}>
                <Link href={r.path} className="text-indigo-700 underline">
                  {r.label}
                </Link>
              </li>
            ))}
            {siblings.map((g) => (
              <li key={g.path}>
                <Link href={g.path} className="text-indigo-700 underline">
                  {g.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/** "Questions about <tool>" list for a tool page; renders nothing when the tool has no guides. */
export function ToolGuideLinks({ tool }: { tool: string }) {
  const guides = toolGuidesFor(tool);
  if (guides.length === 0) return null;
  const t = getTool(tool);
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-gray-950">Questions about {t.name}</h2>
      <ul className="list-disc space-y-2 pl-6">
        {guides.map((g) => (
          <li key={g.path}>
            <Link href={g.path} className="text-indigo-700 underline">
              {g.h1}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
