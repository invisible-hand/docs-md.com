import type { Metadata } from 'next';
import Link from 'next/link';
import UpdatedLine from '@/components/UpdatedLine';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import { TOOL_CATEGORIES, TOOLS, toolsInCategory } from '@/lib/tools-registry';

export const metadata: Metadata = {
  title: 'Free Markdown Tools — Converters, Generators, Checkers',
  description:
    'Free browser-based markdown tools: converters (HTML, PDF, Word, CSV), generators (tables, README, badges, changelog), a linter, diff, link checker, viewer.',
};

const UPDATED = TOOLS.map((t) => t.updated).sort().at(-1)!;

export default function ToolsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Free markdown tools',
    description: metadata.description,
    dateModified: UPDATED,
    url: 'https://docs-md.com/tools',
    hasPart: TOOLS.map((t) => ({
      '@type': 'WebApplication',
      name: t.title,
      url: `https://docs-md.com/${t.slug}`,
      applicationCategory: 'DeveloperApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    })),
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">Free markdown tools</h1>
        <UpdatedLine date={UPDATED} />
        <p className="mt-4 text-base text-gray-600">
          {TOOLS.length + 1} small, fast, browser-based tools for working with markdown. No accounts, no
          uploads — your text stays on your machine unless you explicitly share it as a link.
        </p>
        <nav className="mt-5 flex flex-wrap gap-2 text-xs">
          {TOOL_CATEGORIES.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="rounded-full border border-gray-200 px-3 py-1.5 font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700"
            >
              {c.label} · {toolsInCategory(c.id).length + (c.id === 'edit' ? 1 : 0)}
            </a>
          ))}
        </nav>
      </div>

      <div className="mt-12 space-y-14">
        {TOOL_CATEGORIES.map((c) => {
          const tools = toolsInCategory(c.id);
          return (
            <section key={c.id} id={c.id} className="scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-950">{c.label}</h2>
              <p className="mt-1 text-sm text-gray-600">{c.blurb}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/${tool.slug}`}
                    className="group flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                  >
                    <ToolIconTile slug={tool.slug} />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-950 group-hover:text-indigo-700">{tool.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{tool.description}</p>
                    </div>
                  </Link>
                ))}
                {c.id === 'edit' ? (
                  <Link
                    href="/"
                    className="group flex gap-4 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md"
                  >
                    <ToolIconTile slug="share" />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-950 group-hover:text-indigo-700">Markdown sharing</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                        The core product: paste markdown, get a link. Expiry from 1 day to forever,
                        edit tokens, raw endpoints, and an MCP server for AI IDEs.
                      </p>
                    </div>
                  </Link>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>

      <section className="mx-auto mt-16 max-w-3xl space-y-8 text-gray-700">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">Is anything uploaded when I use these tools?</h2>
          <p>
            No. Every converter, generator, and checker on this page runs in your browser; the
            only network requests are the ones you trigger yourself — clicking <em>Share as
            link</em>, or asking the link checker to test external URLs. Files you open never
            leave your machine.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">Which markdown flavor do the tools use?</h2>
          <p>
            GitHub Flavored Markdown (GFM): tables, task lists, strikethrough, autolinks, and
            footnotes on top of CommonMark. It is what GitHub, GitLab, and most documentation
            systems render, so output from any tool here pastes straight into a README. Looking
            for syntax answers instead? The{' '}
            <Link href="/guides" className="text-indigo-700 underline">
              markdown guides
            </Link>{' '}
            cover checkboxes, strikethrough, line breaks, comments, and more; the{' '}
            <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">
              cheat sheet
            </Link>{' '}
            has everything on one page.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">Can I use these from an AI IDE or a script?</h2>
          <p>
            Sharing works over MCP — see the{' '}
            <Link href="/ai-powered-ide" className="text-indigo-700 underline">
              setup guide for Cursor, Claude Code, VS Code, Windsurf, and Zed
            </Link>
            — or automate it with the{' '}
            <Link href="/api-docs" className="text-indigo-700 underline">
              REST API
            </Link>
            . The tools themselves are browser pages; the source for all of them is on{' '}
            <a
              href="https://github.com/invisible-hand/docs-md.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-700 underline"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
