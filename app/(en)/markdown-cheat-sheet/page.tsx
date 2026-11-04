import Link from 'next/link';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import CheatSheet, { SectionNav } from '@/components/CheatSheet';
import { CHEAT_SHEET_FAQ as FAQ, CHEAT_SHEET_GLANCE, CHEAT_SHEET_SECTIONS as SECTIONS } from '@/lib/cheat-sheet';
import GlanceTable from '@/components/GlanceTable';
import LanguageLinks from '@/components/LanguageLinks';
import { languageAlternates, otherLanguageLinks } from '@/lib/i18n';
import UpdatedLine from '@/components/UpdatedLine';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-10-20';

export const metadata = pageMetadata({
  title: 'Markdown Cheat Sheet — Complete Syntax Reference',
  description:
    'Every markdown element with live rendered examples: headings, emphasis, lists, links, images, code, tables, task lists, footnotes, mermaid. Copy a snippet.',
  path: '/markdown-cheat-sheet',
  type: 'article',
  kicker: 'Reference',
  extra: {
    alternates: {
      canonical: '/markdown-cheat-sheet',
      languages: languageAlternates('markdown-cheat-sheet'),
      types: { 'text/markdown': '/markdown-cheat-sheet.md' },
    },
  },
});

const MORE_SHEETS: Array<{ href: string; label: string; blurb: string }> = [
  { href: '/github-flavored-markdown', label: 'GitHub Flavored Markdown', blurb: 'Tables, task lists, alerts, footnotes — the GitHub superset.' },
  { href: '/markdown-flavors', label: 'Markdown flavors compared', blurb: 'CommonMark vs GFM vs chat apps vs note apps in one table.' },
  { href: '/obsidian-markdown', label: 'Obsidian', blurb: 'Wikilinks, callouts, embeds, properties.' },
  { href: '/notion-markdown', label: 'Notion', blurb: 'What converts on paste and what Notion ignores.' },
  { href: '/reddit-markdown', label: 'Reddit', blurb: 'Spoilers, superscript, tables, and the fancy-pants editor.' },
  { href: '/telegram-markdown', label: 'Telegram', blurb: 'MarkdownV2 escaping rules and the Bot API.' },
  { href: '/whatsapp-formatting', label: 'WhatsApp', blurb: 'Bold, italic, strikethrough, monospace — and nothing else.' },
  { href: '/jira-markdown', label: 'Jira', blurb: 'Wiki markup vs markdown in Jira Cloud.' },
  { href: '/markdown-for-ai-output', label: 'Markdown for AI output', blurb: 'What ChatGPT, Claude and Gemini render and how to ask for it.' },
  { href: '/mdx-cheat-sheet', label: 'MDX', blurb: 'Components, expressions and imports inside markdown.' },
  { href: '/pandoc-markdown', label: 'Pandoc', blurb: 'Divs, citations, definition lists, metadata blocks.' },
  { href: '/discord-markdown', label: 'Discord', blurb: 'Underline, spoilers, subtext, timestamps.' },
  { href: '/slack-markdown', label: 'Slack', blurb: 'mrkdwn: single asterisks bold, no headings, no tables.' },
];

const ELEMENT_GUIDES: Array<{ slug: string; label: string }> = [
  { slug: 'markdown-headings', label: 'Headings' },
  { slug: 'markdown-bold-italic', label: 'Bold and italic' },
  { slug: 'markdown-underline', label: 'Underline' },
  { slug: 'markdown-strikethrough', label: 'Strikethrough' },
  { slug: 'markdown-highlight', label: 'Highlight' },
  { slug: 'markdown-color-text', label: 'Color text' },
  { slug: 'markdown-center-text', label: 'Center text' },
  { slug: 'markdown-subscript', label: 'Subscript' },
  { slug: 'markdown-superscript', label: 'Superscript' },
  { slug: 'markdown-bullet-points', label: 'Bullet points' },
  { slug: 'markdown-numbered-list', label: 'Numbered list' },
  { slug: 'markdown-nested-list', label: 'Nested list' },
  { slug: 'markdown-checkbox', label: 'Checkbox / task list' },
  { slug: 'markdown-definition-list', label: 'Definition list' },
  { slug: 'markdown-indent', label: 'Indent' },
  { slug: 'markdown-link', label: 'Link' },
  { slug: 'markdown-anchor-link', label: 'Anchor link' },
  { slug: 'markdown-image', label: 'Image' },
  { slug: 'markdown-embed-video', label: 'Embed video' },
  { slug: 'markdown-code-block', label: 'Code block' },
  { slug: 'markdown-table', label: 'Table' },
  { slug: 'markdown-table-line-break', label: 'Line break in a table cell' },
  { slug: 'markdown-quote', label: 'Blockquote' },
  { slug: 'markdown-alerts', label: 'Alerts / callouts' },
  { slug: 'markdown-collapsible-section', label: 'Collapsible section' },
  { slug: 'markdown-footnotes', label: 'Footnotes' },
  { slug: 'markdown-emoji', label: 'Emoji' },
  { slug: 'markdown-math', label: 'Math' },
  { slug: 'markdown-comment', label: 'Comment' },
  { slug: 'markdown-escape-characters', label: 'Escape characters' },
  { slug: 'markdown-new-line', label: 'New line' },
  { slug: 'markdown-horizontal-rule', label: 'Horizontal rule' },
  { slug: 'markdown-page-break', label: 'Page break' },
];

export default function MarkdownCheatSheetPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'Markdown cheat sheet: complete syntax reference with examples',
        description: metadata.description,
        dateModified: UPDATED,
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: 'https://docs-md.com/markdown-cheat-sheet',
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-10 max-w-3xl">
        <div className="flex items-start gap-4">
          <ToolIconTile slug="markdown-cheat-sheet" size="lg" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
              Markdown cheat sheet
            </h1>
            <UpdatedLine date={UPDATED} />
          </div>
        </div>
        <p className="mt-4 text-base text-gray-600">
          Every markdown element with the syntax on the left and the rendered result on the right.
          Covers core markdown, GitHub Flavored Markdown (GFM), alerts, emoji, anchor links and
          mermaid diagrams. Click <em>Copy</em> on any block to grab the snippet.
        </p>
        <div className="no-print mt-5 flex flex-wrap items-center gap-3">
          <a
            href="/markdown-cheat-sheet.pdf"
            download
            className="inline-flex items-center gap-2 rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Download printable PDF
          </a>
          <a
            href="/markdown-cheat-sheet.md"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-indigo-300 hover:text-indigo-700"
          >
            View as markdown
          </a>
          <span className="text-xs text-gray-500">One file, every snippet on this page. Or press Ctrl/Cmd+P — the page has print styles.</span>
        </div>
        <div className="no-print mt-4">
          <LanguageLinks label="Also available in" links={otherLanguageLinks('markdown-cheat-sheet', 'en')} />
        </div>
        <SectionNav sections={SECTIONS} className="no-print mt-5 flex flex-wrap gap-2 text-xs" />
      </div>

      <div className="mb-12">
        <GlanceTable
          rows={CHEAT_SHEET_GLANCE}
          title="Markdown syntax at a glance"
          headers={{ element: 'Element', syntax: 'Syntax', note: 'Note' }}
        />
      </div>

      <CheatSheet sections={SECTIONS} />

      <section className="no-print mt-16 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">More cheat sheets</h2>
        <p className="max-w-3xl text-base text-gray-600">
          Every platform bends markdown a little. These sheets cover what each one renders, what it
          ignores, and what it invents.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MORE_SHEETS.map((m) => (
            <li key={m.href}>
              <Link
                href={m.href}
                className="block h-full rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-indigo-300"
              >
                <span className="block text-sm font-semibold text-gray-900">{m.label}</span>
                <span className="mt-1 block text-sm text-gray-600">{m.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="no-print mt-12 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Element guides</h2>
        <p className="max-w-3xl text-base text-gray-600">
          One page per element, with every variant and the platforms where it does not work.
        </p>
        <ul className="flex flex-wrap gap-2 text-sm">
          {ELEMENT_GUIDES.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                className="inline-block rounded-full border border-gray-200 px-3 py-1.5 font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700"
              >
                {g.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-950">Which markdown is this?</h2>
          <p>
            &quot;Markdown&quot; in the wild almost always means{' '}
            <strong>GitHub Flavored Markdown (GFM)</strong> — the original 2004 syntax plus tables,
            task lists, strikethrough, autolinks, and footnotes. Everything on this page renders on
            GitHub, GitLab, and on Docs MD share pages. The formal spec behind it is CommonMark;
            when two renderers disagree about an edge case, CommonMark&apos;s answer is the one to
            bet on. Chat apps are the exception — see the{' '}
            <Link href="/markdown-flavors" className="text-indigo-700 underline">
              flavor comparison
            </Link>{' '}
            and the dedicated{' '}
            <Link href="/discord-markdown" className="text-indigo-700 underline">
              Discord
            </Link>{' '}
            and{' '}
            <Link href="/slack-markdown" className="text-indigo-700 underline">
              Slack
            </Link>{' '}
            formatting sheets, and the{' '}
            <Link href="/guides" className="text-indigo-700 underline">
              markdown guides
            </Link>{' '}
            for deep dives on single features.
          </p>
        </section>

        {FAQ.map((f) => (
          <section key={f.q} className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-950">{f.q}</h2>
            <p>{f.a}</p>
            {f.href ? (
              <p>
                <Link href={f.href.path} className="text-indigo-700 underline">
                  {f.href.label} →
                </Link>
              </p>
            ) : null}
          </section>
        ))}

        <section className="no-print space-y-3 rounded-2xl bg-indigo-50 p-6">
          <h2 className="text-xl font-semibold text-gray-950">Put it to work</h2>
          <p>
            Build tables visually with the{' '}
            <Link href="/markdown-table-generator" className="text-indigo-700 underline">
              table generator
            </Link>
            , turn a document into a file with the{' '}
            <Link href="/markdown-to-pdf" className="text-indigo-700 underline">
              PDF converter
            </Link>{' '}
            or{' '}
            <Link href="/markdown-to-html" className="text-indigo-700 underline">
              HTML converter
            </Link>
            , clean it up with the{' '}
            <Link href="/markdown-formatter" className="text-indigo-700 underline">
              formatter
            </Link>
            , scaffold a README with the{' '}
            <Link href="/readme-generator" className="text-indigo-700 underline">
              README generator
            </Link>
            , or{' '}
            <Link href="/" className="text-indigo-700 underline">
              share markdown as a link
            </Link>{' '}
            that renders everything on this page — including the mermaid diagrams.
          </p>
        </section>
      </div>
    </div>
  );
}
