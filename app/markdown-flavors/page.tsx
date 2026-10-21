import Link from 'next/link';
import type { ReactNode } from 'react';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import CheatSheet, { SectionNav } from '@/components/CheatSheet';
import { SECTIONS } from '@/lib/platform-sheets/markdown-flavors';
import UpdatedLine from '@/components/UpdatedLine';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-10-15';
const PATH = '/markdown-flavors';

export const metadata = pageMetadata({
  title: 'Markdown Flavors Compared: GFM, Slack, Discord…',
  description:
    '22 markdown elements across CommonMark, GFM, Discord, Slack, Obsidian, Notion, Reddit, Jira, MDX, Pandoc and reST in one matrix, plus portability rules.',
  path: PATH,
  type: 'article',
  kicker: 'Reference',
});

type FlavorKey = 'cm' | 'gfm' | 'discord' | 'slack' | 'obsidian' | 'notion' | 'reddit' | 'jira' | 'mdx' | 'pandoc' | 'rst';

const FLAVORS: Array<{ key: FlavorKey; name: string; href: string; doc: string; docLabel: string; kind: string }> = [
  { key: 'cm', name: 'CommonMark', href: '/markdown-cheat-sheet', doc: 'https://spec.commonmark.org/', docLabel: 'CommonMark spec', kind: 'Base spec' },
  { key: 'gfm', name: 'GFM', href: '/github-flavored-markdown', doc: 'https://github.github.com/gfm/', docLabel: 'GFM spec', kind: 'Spec + github.com' },
  { key: 'discord', name: 'Discord', href: '/discord-markdown', doc: 'https://support.discord.com/hc/en-us/articles/210298617', docLabel: 'Discord Markdown Text 101', kind: 'Chat' },
  { key: 'slack', name: 'Slack', href: '/slack-markdown', doc: 'https://docs.slack.dev/messaging/formatting-message-text', docLabel: 'Slack mrkdwn reference', kind: 'Chat (mrkdwn)' },
  { key: 'obsidian', name: 'Obsidian', href: '/obsidian-markdown', doc: 'https://help.obsidian.md/syntax', docLabel: 'Obsidian Help', kind: 'Notes' },
  { key: 'notion', name: 'Notion', href: '/notion-markdown', doc: 'https://www.notion.com/help/keyboard-shortcuts', docLabel: 'Notion Markdown shortcuts', kind: 'Notes (block editor)' },
  { key: 'reddit', name: 'Reddit', href: '/reddit-markdown', doc: 'https://support.reddithelp.com/hc/en-us/articles/360043033952-Formatting-Guide', docLabel: 'Reddit Formatting Guide', kind: 'Forum' },
  { key: 'jira', name: 'Jira Cloud', href: '/jira-markdown', doc: 'https://support.atlassian.com/jira-software-cloud/docs/markdown-and-keyboard-shortcuts/', docLabel: 'Jira markdown shortcuts', kind: 'Issue tracker' },
  { key: 'mdx', name: 'MDX', href: '/mdx-cheat-sheet', doc: 'https://mdxjs.com/docs/what-is-mdx/', docLabel: 'What is MDX?', kind: 'Docs sites (JSX)' },
  { key: 'pandoc', name: 'Pandoc', href: '/pandoc-markdown', doc: 'https://pandoc.org/MANUAL.html#pandocs-markdown', docLabel: "Pandoc's Markdown", kind: 'Converter' },
  { key: 'rst', name: 'reStructuredText', href: '/markdown-flavors#rst', doc: 'https://docutils.sourceforge.io/docs/user/rst/quickref.html', docLabel: 'reST quick reference', kind: 'Not markdown' },
];

/** Cell = the syntax the platform accepts, or '—' when there is no way to express the element. */
const MATRIX: Array<{ element: string } & Record<FlavorKey, string>> = [
  { element: 'Bold', cm: '**b**', gfm: '**b**', discord: '**b**', slack: '*b*', obsidian: '**b**', notion: '**b**', reddit: '**b**', jira: '**b**', mdx: '**b**', pandoc: '**b**', rst: '**b**' },
  { element: 'Italic', cm: '*i* _i_', gfm: '*i* _i_', discord: '*i* _i_', slack: '_i_', obsidian: '*i* _i_', notion: '*i*', reddit: '*i* _i_', jira: '*i* _i_', mdx: '*i* _i_', pandoc: '*i* _i_', rst: '*i*' },
  { element: 'Underline', cm: '—', gfm: '<ins>', discord: '__u__', slack: '—', obsidian: '<u>', notion: 'Cmd+U', reddit: '—', jira: 'toolbar', mdx: '<u>', pandoc: '[u]{.underline}', rst: '—' },
  { element: 'Strikethrough', cm: '—', gfm: '~~s~~ ~s~', discord: '~~s~~', slack: '~s~', obsidian: '~~s~~', notion: '~s~', reddit: '~~s~~', jira: '~~s~~', mdx: '~~s~~ (gfm)', pandoc: '~~s~~', rst: '—' },
  { element: 'Heading', cm: '# … ######', gfm: '# … ######', discord: '# ## ###', slack: '—', obsidian: '# … ######', notion: '# ## ###', reddit: '# … ######', jira: '# … ######', mdx: '# … ######', pandoc: '# … ######', rst: 'Title\n=====' },
  { element: 'Bulleted list', cm: '- item', gfm: '- item', discord: '- item', slack: '— (type •)', obsidian: '- item', notion: '- item', reddit: '- item', jira: '- item', mdx: '- item', pandoc: '- item', rst: '- item' },
  { element: 'Numbered list', cm: '1. item', gfm: '1. item', discord: '1. item', slack: '—', obsidian: '1. item', notion: '1. item', reddit: '1. item', jira: '1. item', mdx: '1. item', pandoc: '1. item  (@)', rst: '1. item  #.' },
  { element: 'Task list', cm: '—', gfm: '- [ ]', discord: '—', slack: '—', obsidian: '- [ ] - [?]', notion: '[] +space', reddit: '—', jira: '[] +space', mdx: '- [ ] (gfm)', pandoc: '- [ ]', rst: '—' },
  { element: 'Link', cm: '[t](url)', gfm: '[t](url)', discord: '[t](url)', slack: '<url|t>', obsidian: '[[Note]] [t](url)', notion: 'paste URL', reddit: '[t](url)', jira: '[t](url)', mdx: '[t](url)', pandoc: '[t](url)', rst: '`t <url>`_' },
  { element: 'Bare URL autolink', cm: '<url> only', gfm: 'yes', discord: 'yes', slack: 'yes', obsidian: 'yes', notion: 'yes', reddit: 'yes', jira: 'yes', mdx: '—', pandoc: 'with ext.', rst: 'yes' },
  { element: 'Image', cm: '![a](src)', gfm: '![a](src)', discord: '—', slack: '—', obsidian: '![[img|100]]', notion: '/image', reddit: '—', jira: '![a](src)', mdx: '![a](src)', pandoc: '![a](src)', rst: '.. image::' },
  { element: 'Inline code', cm: '`c`', gfm: '`c`', discord: '`c`', slack: '`c`', obsidian: '`c`', notion: '`c`', reddit: '`c`', jira: '`c`', mdx: '`c`', pandoc: '`c`', rst: '``c``' },
  { element: 'Code block', cm: '``` or indent', gfm: '```lang', discord: '```lang', slack: '```', obsidian: '```lang', notion: '/code', reddit: '``` (new) indent (old)', jira: '```', mdx: '``` only', pandoc: '```lang', rst: '::' },
  { element: 'Blockquote', cm: '> q', gfm: '> q', discord: '> q  >>> all', slack: '> q', obsidian: '> q', notion: '" (> = toggle)', reddit: '> q', jira: '> q', mdx: '> q', pandoc: '> q', rst: 'indent' },
  { element: 'Table', cm: '—', gfm: '| a | b |', discord: '—', slack: '—', obsidian: '| a | b |', notion: 'paste / /table', reddit: '| a | b |', jira: 'toolbar', mdx: '| a | b | (gfm)', pandoc: 'pipe grid simple multiline', rst: 'grid / simple' },
  { element: 'Horizontal rule', cm: '---', gfm: '---', discord: '—', slack: '—', obsidian: '---', notion: '---', reddit: '---', jira: '--- ***', mdx: '---', pandoc: '---', rst: '----' },
  { element: 'Footnote', cm: '—', gfm: '[^1] (github.com)', discord: '—', slack: '—', obsidian: '[^1] ^[inline]', notion: '—', reddit: '—', jira: '—', mdx: '[^1] (gfm)', pandoc: '[^1] ^[inline]', rst: '[#]_' },
  { element: 'Spoiler', cm: '—', gfm: '<details>', discord: '||s||', slack: '—', obsidian: '—', notion: 'toggle', reddit: '>!s!<', jira: '—', mdx: '<details>', pandoc: '—', rst: '—' },
  { element: 'Callout / alert', cm: '—', gfm: '> [!NOTE] (5)', discord: '—', slack: '—', obsidian: '> [!tip]- (13)', notion: '/callout', reddit: '—', jira: 'toolbar panel', mdx: '<Component>', pandoc: '::: {.class}', rst: '.. note::' },
  { element: 'Math', cm: '—', gfm: '$x$ $$ (github.com)', discord: '—', slack: '—', obsidian: '$x$ $$', notion: '/equation', reddit: '—', jira: '—', mdx: 'remark-math', pandoc: '$x$ $$', rst: ':math:`x`' },
  { element: 'Raw HTML', cm: 'yes', gfm: 'yes, filtered', discord: '—', slack: '—', obsidian: 'yes', notion: '—', reddit: 'entities only', jira: '—', mdx: 'JSX instead', pandoc: 'yes', rst: '.. raw:: html' },
  { element: 'Escape character', cm: '\\', gfm: '\\', discord: '\\', slack: '&lt; &gt; &amp;', obsidian: '\\', notion: '—', reddit: '\\', jira: '—', mdx: '\\ (also \\< \\{)', pandoc: '\\', rst: '\\' },
];

const PORTABLE: Array<{ element: string; write: string; avoid: string; why: string }> = [
  { element: 'Bold', write: '**text**', avoid: '__text__', why: 'Double underscore is underline on Discord' },
  { element: 'Italic', write: '*text*', avoid: '_text_ mid-word', why: 'Underscores inside words do not trigger emphasis in GFM; Slack needs _ but is a different dialect anyway' },
  { element: 'Strikethrough', write: '~~text~~', avoid: '~text~', why: 'Single tilde only works in GFM, Slack, Notion and WhatsApp' },
  { element: 'Headings', write: '# … ###, one H1', avoid: '#### and deeper, Setext ===', why: 'Discord and Notion stop at H3' },
  { element: 'Lists', write: '- item, 1. item, 2-space indent', avoid: '* and + bullets, 1) numbers', why: 'Mixed markers start new lists; 1) fails on old Reddit' },
  { element: 'Links', write: '[text](https://full.url)', avoid: 'bare www. URLs, <url|text>', why: 'www. without scheme is not a link on Reddit; CommonMark does not autolink at all' },
  { element: 'Code', write: '```lang fences', avoid: '4-space indented code', why: 'Indented code is not supported in MDX; fences are everywhere except old Reddit' },
  { element: 'Line break', write: 'blank line = paragraph; two trailing spaces = break', avoid: 'backslash breaks', why: 'Backslash works in GFM and new Reddit only' },
  { element: 'Tables', write: 'pipe table with outer pipes and a --- row', avoid: 'grid tables, cells with line breaks', why: 'Only pipe tables are shared by GFM, Obsidian, Reddit, Pandoc and Notion paste' },
  { element: 'Quotes', write: '> on every line', avoid: 'lazy continuation lines', why: 'Chat apps break the quote at the first unprefixed line' },
  { element: 'Callouts', write: '> **Note:** text', avoid: '> [!NOTE], > [!tip]-', why: 'Alert syntax only renders on github.com, GitLab and Obsidian; everywhere else the bracket shows' },
  { element: 'Images', write: '![alt](https://absolute.url)', avoid: '![[wikilink]], relative paths', why: 'Wikilinks are Obsidian-only; relative paths break on paste' },
  { element: 'Comments', write: '<!-- -->', avoid: '%% %%', why: 'Obsidian-only; MDX needs {/* */}' },
  { element: 'Emoji', write: 'the Unicode character', avoid: ':shortcode:', why: 'Shortcodes expand on GitHub, Slack, Discord, Jira — not in CommonMark renderers' },
  { element: 'HTML', write: 'none', avoid: '<details>, <sub>, <kbd>', why: 'Chat apps, Notion and Reddit strip tags; MDX parses them as JSX' },
];

const DETECT: Array<{ clue: string; flavor: string; href: string }> = [
  { clue: '*single asterisks* are bold and [text](url) shows the brackets', flavor: 'Slack mrkdwn', href: '/slack-markdown' },
  { clue: '__double underscore__ underlines, ||bars|| hide text, -# makes small text', flavor: 'Discord', href: '/discord-markdown' },
  { clue: '[[double brackets]] link notes and ==equals== highlight', flavor: 'Obsidian (or another wiki-style note app)', href: '/obsidian-markdown' },
  { clue: '> made a collapsible toggle instead of a quote', flavor: 'Notion', href: '/notion-markdown' },
  { clue: '>!text!< hides spoilers and ^word floats up', flavor: 'Reddit', href: '/reddit-markdown' },
  { clue: '> [!NOTE] rendered as a coloured box; #26 became a link', flavor: 'GitHub (GFM + github.com extras)', href: '/github-flavored-markdown' },
  { clue: '*bold* with single asterisks, h1. headings, {code} blocks', flavor: 'Jira wiki markup (legacy), not markdown', href: '/jira-markdown' },
  { clue: 'import statements at the top and <Components /> in the body', flavor: 'MDX', href: '/mdx-cheat-sheet' },
  { clue: '::: fenced divs, [@citations], ^superscript^ with carets', flavor: 'Pandoc markdown', href: '/pandoc-markdown' },
  { clue: 'Titles underlined with ===, ``double backticks`` for code, .. note:: directives', flavor: 'reStructuredText, not markdown', href: '#rst' },
  { clue: 'Characters like . ! - must be escaped as \\. \\! \\-', flavor: 'Telegram MarkdownV2 (Bot API)', href: '/telegram-markdown' },
  { clue: 'Only *bold* _italic_ ~strike~ and ```mono``` work', flavor: 'WhatsApp', href: '/whatsapp-formatting' },
];


const FAQ: Array<{ q: string; a: string; href?: { path: string; label: string } }> = [
  {
    q: 'What is the difference between CommonMark and GFM?',
    a: 'CommonMark is the unambiguous base specification of markdown: headings, emphasis, lists, links, images, code, blockquotes, raw HTML. GitHub Flavored Markdown is a strict superset that adds five extensions — tables, task lists, strikethrough, bare-URL autolinks and an HTML tag filter — and github.com adds alerts, footnotes, math, mermaid, emoji shortcodes and references on top. Anything valid in CommonMark renders the same in GFM.',
    href: { path: '/github-flavored-markdown', label: 'GFM cheat sheet with the GFM vs CommonMark table' },
  },
  {
    q: 'Which markdown flavor should I write in?',
    a: 'GFM, unless you are targeting one specific app. It is the default of GitHub, GitLab, VS Code preview, most static site generators, remark/markdown-it, Obsidian\'s shared subset and every AI assistant\'s output. For chat apps (Slack, Discord, Telegram, WhatsApp) write in their dialect at send time rather than pasting GFM.',
  },
  {
    q: 'Is Slack markdown?',
    a: 'No. Slack calls its format mrkdwn and documents it as "inspired by markdown, but uses different rules": *single asterisks* are bold, _underscores_ italic, ~tildes~ strikethrough, links are <url|text>, and there are no headings, tables, images or list syntax. Pasting GFM into Slack produces visible asterisks and brackets.',
    href: { path: '/slack-markdown', label: 'Slack formatting sheet' },
  },
  {
    q: 'What is the difference between reStructuredText and Markdown?',
    a: 'Both are plain-text markup, but reST is a single formal spec (docutils) with an extensible directive system (.. note::, .. image::, .. toctree::) and roles (:math:`x`), while markdown is a family of dialects with raw HTML as the escape hatch. reST uses ``double backticks`` for code, `text <url>`_ for links and underlined titles; it has no bold-italic, no task lists and no pipe tables. Sphinx and Python documentation use reST; almost everything else uses markdown. Pandoc converts between them.',
  },
  {
    q: 'Why does my markdown look different on Discord, Slack, Notion and Reddit?',
    a: 'Because each one implements its own parser with its own rules. Discord treats __ as underline and has no tables or images; Slack uses single-character markers and ignores [text](url); Notion converts > into a toggle while typing and has only three heading levels; Reddit adds >!spoilers!< and ^superscript and, on old Reddit, lacks fenced code. The matrix above shows the exact syntax per element so you can rewrite before pasting.',
  },
  {
    q: 'What is the most portable markdown?',
    a: 'The CommonMark core written in its most common form: **bold**, *italic*, # headings up to H3, - bullets, 1. numbers, [text](https://url), ```fenced code, > quotes with every line prefixed, blank lines between blocks, and pipe tables when you need them. Skip HTML, shortcodes, alerts, footnotes and anything with a platform name in this matrix. The portability table lists the swaps.',
  },
  {
    q: 'Are MDX and Pandoc markdown separate flavors?',
    a: 'Yes, in opposite directions. MDX is markdown (CommonMark + GFM via plugins) that also parses JSX, import/export and {expressions}; it drops indented code, autolinks and raw HTML in exchange. Pandoc\'s markdown is the broadest superset — fenced divs, bracketed spans, four table styles, citations, definition and example lists, inline footnotes, ^super^ and ~sub~ — meant for converting to LaTeX, DOCX and HTML rather than for rendering in an app.',
    href: { path: '/pandoc-markdown', label: 'Pandoc markdown sheet' },
  },
];

function Th({ children, sticky = false }: { children: ReactNode; sticky?: boolean }) {
  return (
    <th className={`py-2 pr-3 text-left text-xs font-semibold text-gray-950 ${sticky ? 'sticky left-0 bg-white' : ''}`}>
      {children}
    </th>
  );
}
function Td({ children, mono = false, sticky = false }: { children: ReactNode; mono?: boolean; sticky?: boolean }) {
  return (
    <td className={`py-2 pr-3 align-top text-gray-700 ${sticky ? 'sticky left-0 bg-white' : ''}`}>
      {mono ? <code className="whitespace-pre rounded bg-gray-100 px-1 py-0.5 text-[11px]">{children}</code> : children}
    </td>
  );
}

export default function MarkdownFlavorsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'Markdown flavors compared: CommonMark, GFM, Discord, Slack, Obsidian, Notion, Reddit, Jira, MDX, Pandoc, reStructuredText',
        description: metadata.description,
        dateModified: UPDATED,
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: `https://docs-md.com${PATH}`,
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
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-10 max-w-3xl">
        <div className="flex items-start gap-4">
          <ToolIconTile slug="markdown-flavors" size="lg" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
              Markdown flavors compared: CommonMark, GFM, Discord, Slack, Obsidian, Notion, Reddit, Jira, MDX, Pandoc, reStructuredText
            </h1>
            <UpdatedLine date={UPDATED} />
          </div>
        </div>
        <p className="mt-4 text-base text-gray-600">
          &quot;Markdown&quot; is a family, not one language. CommonMark is the base spec, GFM is the
          superset almost everything renders, and each chat app, note app and converter bends the
          rules — Slack bolds with single asterisks, Discord underlines with double underscores,
          Notion turns <code className="rounded bg-gray-100 px-1">&gt;</code> into a toggle, Reddit hides
          text with <code className="rounded bg-gray-100 px-1">&gt;!…!&lt;</code>. The matrix below
          puts 22 elements against 11 flavors; the second table says what to write when a document
          must survive all of them.
        </p>
        <SectionNav sections={SECTIONS} className="mt-5 flex flex-wrap gap-2 text-xs" />
      </div>

      <section id="matrix" className="mb-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Feature × flavor matrix</h2>
        <p className="max-w-3xl text-base text-gray-600">
          Each cell is the syntax that platform accepts; &quot;—&quot; means there is no way to write
          the element. Column headers link to the per-platform sheet; sources are listed under the
          table.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full min-w-[1180px] border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50">
                <Th sticky>Element</Th>
                {FLAVORS.map((f) => (
                  <Th key={f.key}>
                    <Link href={f.href} className="text-indigo-700 underline">
                      {f.name}
                    </Link>
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((row) => (
                <tr key={row.element} className="border-b border-gray-100">
                  <Td sticky>
                    <span className="font-medium text-gray-900">{row.element}</span>
                  </Td>
                  {FLAVORS.map((f) => (
                    <Td key={f.key} mono={row[f.key] !== '—'}>
                      {row[f.key]}
                    </Td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          {FLAVORS.map((f) => (
            <li key={f.key}>
              <a href={f.doc} className="underline" rel="noopener">
                {f.name}: {f.docLabel}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section id="portable" className="mb-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Write for maximum portability</h2>
        <p className="max-w-3xl text-base text-gray-600">
          The subset that renders identically on GitHub, GitLab, Obsidian, Reddit, Jira, MDX, Pandoc,
          VS Code and on Notion paste. Chat apps still need their own markers.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>Element</Th>
                <Th>Write</Th>
                <Th>Avoid</Th>
                <Th>Why</Th>
              </tr>
            </thead>
            <tbody>
              {PORTABLE.map((r) => (
                <tr key={r.element} className="border-b border-gray-100">
                  <Td>
                    <span className="font-medium text-gray-900">{r.element}</span>
                  </Td>
                  <Td mono>{r.write}</Td>
                  <Td mono>{r.avoid}</Td>
                  <Td>{r.why}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="which" className="mb-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Which flavor am I in?</h2>
        <p className="max-w-3xl text-base text-gray-600">Match what you saw to the dialect that does it.</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>What happened</Th>
                <Th>You are writing</Th>
              </tr>
            </thead>
            <tbody>
              {DETECT.map((r) => (
                <tr key={r.clue} className="border-b border-gray-100">
                  <Td>{r.clue}</Td>
                  <Td>
                    <Link href={r.href} className="text-indigo-700 underline">
                      {r.flavor}
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CheatSheet sections={SECTIONS} />

      <section className="mt-12 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Per-platform cheat sheets</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: '/markdown-cheat-sheet', label: 'Markdown cheat sheet', blurb: 'The CommonMark + GFM core, every element rendered.' },
            { href: '/github-flavored-markdown', label: 'GitHub Flavored Markdown', blurb: 'Tables, task lists, alerts, footnotes, math, mermaid.' },
            { href: '/obsidian-markdown', label: 'Obsidian', blurb: 'Wikilinks, embeds, 13 callout types, properties, tags.' },
            { href: '/notion-markdown', label: 'Notion', blurb: 'Typing shortcuts, what imports, what export produces.' },
            { href: '/reddit-markdown', label: 'Reddit', blurb: 'Spoilers, superscript, tables, old vs new Reddit.' },
            { href: '/discord-markdown', label: 'Discord', blurb: 'Underline, spoilers, subtext, headers, no tables.' },
            { href: '/slack-markdown', label: 'Slack', blurb: 'mrkdwn: single asterisks, <url|text> links.' },
            { href: '/telegram-markdown', label: 'Telegram', blurb: 'MarkdownV2 and its escaping rules.' },
            { href: '/whatsapp-formatting', label: 'WhatsApp', blurb: 'Bold, italic, strikethrough, monospace, lists, quotes.' },
            { href: '/jira-markdown', label: 'Jira', blurb: 'Markdown shortcuts vs legacy wiki markup.' },
            { href: '/mdx-cheat-sheet', label: 'MDX', blurb: 'Components, expressions and imports in markdown.' },
            { href: '/pandoc-markdown', label: 'Pandoc', blurb: 'Divs, spans, citations, four table styles.' },
            { href: '/markdown-for-ai-output', label: 'Markdown for AI output', blurb: 'What ChatGPT, Claude and Gemini render.' },
          ].map((m) => (
            <li key={m.href}>
              <Link href={m.href} className="block h-full rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-indigo-300">
                <span className="block text-sm font-semibold text-gray-900">{m.label}</span>
                <span className="mt-1 block text-sm text-gray-600">{m.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
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

        <section className="space-y-3 rounded-2xl bg-indigo-50 p-6">
          <h2 className="text-xl font-semibold text-gray-950">Tools</h2>
          <p>
            Check how GFM renders a document in the{' '}
            <Link href="/markdown-viewer" className="text-indigo-700 underline">markdown viewer</Link>, normalise markers
            with the{' '}
            <Link href="/markdown-formatter" className="text-indigo-700 underline">formatter</Link>, find flavor-specific
            syntax with{' '}
            <Link href="/markdown-lint" className="text-indigo-700 underline">markdown lint</Link>, convert to{' '}
            <Link href="/markdown-to-html" className="text-indigo-700 underline">HTML</Link> or{' '}
            <Link href="/markdown-to-word" className="text-indigo-700 underline">Word</Link>, or{' '}
            <Link href="/" className="text-indigo-700 underline">share markdown as a rendered link</Link> instead of
            pasting it into a chat app.
          </p>
        </section>
      </div>
    </div>
  );
}
