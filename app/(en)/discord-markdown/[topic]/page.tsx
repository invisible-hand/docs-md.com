import Link from 'next/link';
import { notFound } from 'next/navigation';
import CopyButton from '@/components/CopyButton';
import DiscordMessage from '@/components/discord/DiscordMessage';
import RichText from '@/components/discord/RichText';
import SyntaxAnatomy from '@/components/SyntaxAnatomy';
import UpdatedLine from '@/components/UpdatedLine';
import { DISCORD_GUIDES, getDiscordGuide } from '@/lib/discord-guides';
import { pageMetadata } from '@/lib/page-metadata';

// /discord-markdown/<topic>: one Discord formatting question per page, data in lib/discord-guides/<topic>.ts.
// Contract: docs/discord-guides.md.

export const dynamicParams = false;

export function generateStaticParams() {
  return DISCORD_GUIDES.map((g) => ({ topic: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const g = getDiscordGuide(topic);
  if (!g) return {};
  return pageMetadata({ title: g.title, description: g.description, path: `/discord-markdown/${g.slug}`, type: 'article', kicker: 'Discord formatting' });
}

const LABEL_FOR: Record<string, string> = {
  '/discord-markdown': 'Discord markdown cheat sheet',
  '/markdown-to-discord': 'Markdown to Discord converter',
  '/discord-timestamp-generator': 'Discord timestamp generator',
  '/discord-colored-text-generator': 'Discord colored text generator',
  '/slack-markdown': 'Slack formatting',
  '/telegram-markdown': 'Telegram formatting',
  '/whatsapp-formatting': 'WhatsApp formatting',
  '/reddit-markdown': 'Reddit markdown',
  '/markdown-cheat-sheet': 'Markdown cheat sheet',
  '/markdown-flavors': 'Markdown flavors compared',
};

function labelFor(path: string): string {
  if (LABEL_FOR[path]) return LABEL_FOR[path];
  const d = /^\/discord-markdown\/(.+)$/.exec(path);
  if (d) return `Discord ${getDiscordGuide(d[1])?.label.toLowerCase() ?? d[1]}`;
  const g = /^\/guides\/markdown-(.+)$/.exec(path);
  if (g) return `Markdown ${g[1].replace(/-/g, ' ')} guide`;
  return path.replace(/^\//, '').replace(/-/g, ' ');
}

export default async function DiscordTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const g = getDiscordGuide(topic);
  if (!g) notFound();
  const url = `https://docs-md.com/discord-markdown/${g.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: g.h1,
        description: g.description,
        dateModified: g.updated,
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: url,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Discord markdown', item: 'https://docs-md.com/discord-markdown' },
          { '@type': 'ListItem', position: 2, name: g.label, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: g.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/`/g, '') } })),
      },
    ],
  };
  const others = DISCORD_GUIDES.filter((x) => x.slug !== g.slug);
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/discord-markdown" className="hover:text-gray-800">
          Discord markdown
        </Link>{' '}
        / <span className="text-gray-700">{g.label}</span>
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">{g.h1}</h1>
      <UpdatedLine date={g.updated} />
      <p className="mt-4 max-w-3xl text-lg text-gray-700">
        <RichText text={g.answer} />
      </p>
      <SyntaxAnatomy title={g.anatomy.title} parts={g.anatomy.parts} />

      <div className="mt-10 space-y-10">
        {g.examples.map((ex) => (
          <section key={ex.label} className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-950">{ex.label}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative rounded-2xl border border-gray-200 bg-gray-50">
                <div className="absolute right-3 top-3">
                  <CopyButton content={ex.source} />
                </div>
                <div className="px-4 pt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">You type</div>
                <pre className="overflow-x-auto whitespace-pre-wrap break-words p-4 pt-2 text-sm leading-relaxed text-gray-800">{ex.source}</pre>
              </div>
              <div>
                <div className="pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Discord shows</div>
                <DiscordMessage source={ex.source} />
              </div>
            </div>
            {ex.note && (
              <p className="text-sm text-gray-600">
                <RichText text={ex.note} />
              </p>
            )}
          </section>
        ))}
      </div>

      <div className="mx-auto mt-14 max-w-3xl space-y-10 text-gray-700">
        {g.sections.map((s) => (
          <section key={s.h2} className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-950">{s.h2}</h2>
            {s.paragraphs.map((p, i) => (
              <p key={i}>
                <RichText text={p} />
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

        {g.faq.map((f) => (
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
            {g.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} className="text-indigo-700 underline" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="no-print space-y-3 rounded-2xl bg-indigo-50 p-6">
          <h2 className="text-xl font-semibold text-gray-950">Related</h2>
          <p className="text-sm">
            {g.related.map((p, i) => (
              <span key={p}>
                {i > 0 && ' · '}
                <Link href={p} className="text-indigo-700 underline">
                  {labelFor(p)}
                </Link>
              </span>
            ))}
          </p>
          {others.length > 0 && (
            <p className="text-sm">
              <span className="font-medium text-gray-900">More Discord formatting: </span>
              {others.map((o, i) => (
                <span key={o.slug}>
                  {i > 0 && ' · '}
                  <Link href={`/discord-markdown/${o.slug}`} className="text-indigo-700 underline">
                    {o.label}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
