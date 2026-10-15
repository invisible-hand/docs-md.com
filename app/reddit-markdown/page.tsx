import Link from 'next/link';
import type { ReactNode } from 'react';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import CheatSheet, { SectionNav, type Section } from '@/components/CheatSheet';
import UpdatedLine from '@/components/UpdatedLine';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-10-15';
const PATH = '/reddit-markdown';

export const metadata = pageMetadata({
  title: 'Reddit Markdown Formatting Cheat Sheet',
  description:
    'Reddit markdown: >!spoilers!<, ^superscript, tables, code, line breaks, escaping, r/ links — plus Rich Text vs Markdown editor and old vs new Reddit.',
  path: PATH,
  type: 'article',
  kicker: 'Reference',
});

const SOURCES = [
  {
    href: 'https://support.reddithelp.com/hc/en-us/articles/360043033952-Formatting-Guide',
    label: 'Reddit Help: Formatting Guide',
  },
  { href: 'https://www.reddit.com/wiki/markdown/', label: 'r/reddit.com wiki: Markdown' },
];

const SYNTAX: Array<{ effect: string; syntax: string; note: string }> = [
  { effect: 'Italic', syntax: '*italic* or _italic_', note: 'Part-of-word emphasis only works with asterisks' },
  { effect: 'Bold', syntax: '**bold** or __bold__', note: '' },
  { effect: 'Bold italic', syntax: '***both*** or ___both___', note: 'Nested emphasis like _a __b__ c_ fails on old Reddit' },
  { effect: 'Strikethrough', syntax: '~~text~~', note: 'Double tilde only' },
  { effect: 'Spoiler', syntax: '>!hidden text!<', note: 'Reddit-only; no space after >! or before !<' },
  { effect: 'Superscript (one word)', syntax: '^word', note: 'Ends at the next space' },
  { effect: 'Superscript (phrase)', syntax: '^(several words)', note: 'Misparsed on old Reddit; ^each ^word is the safe form' },
  { effect: 'Inline code', syntax: '`code`', note: 'Use `` double `` backticks if the code contains a backtick' },
  { effect: 'Code block', syntax: '```\ncode\n``` or 4-space indent', note: 'Fences work on www.reddit.com; old Reddit needs the indent' },
  { effect: 'Heading', syntax: '# H1 … ###### H6', note: 'H1/H2 also via === / --- underline' },
  { effect: 'Quote', syntax: '> quoted', note: 'Prefix every line for multi-paragraph quotes; nest with > >' },
  { effect: 'Bulleted list', syntax: '- item or * item', note: 'Sub-items: 2+ spaces under -, 3+ under 1.' },
  { effect: 'Numbered list', syntax: '1. item (or 1) item)', note: 'Must start at 1; the ) form fails on old Reddit' },
  { effect: 'Link', syntax: '[text](https://example.com "title")', note: 'Scheme required — www.example.com alone is not a link; no space before (' },
  { effect: 'Reference link', syntax: '[text][1] … [1]: https://example.com', note: '' },
  { effect: 'Community / user link', syntax: 'r/help, /r/help, u/reddit, /u/reddit', note: 'Autolinked everywhere' },
  { effect: 'Bare URL', syntax: 'https://www.reddit.com or <https://…>', note: 'Angle brackets fix URLs that parse badly' },
  { effect: 'Table', syntax: '| a | b |\n|:--|--:|\n| 1 | 2 |', note: 'Header row required; leading/trailing pipes recommended' },
  { effect: 'Line break', syntax: 'two trailing spaces  or \\', note: 'Backslash only works on www.reddit.com' },
  { effect: 'Blank line (extra space)', syntax: '&nbsp;', note: 'A paragraph containing only &nbsp;' },
  { effect: 'Horizontal rule', syntax: '---, *** or ___', note: '' },
  { effect: 'Escape', syntax: '\\* \\- \\# \\> \\^ \\!', note: 'Backslash before any markdown character' },
  { effect: 'HTML entity', syntax: '&mdash; &#x2003; &nbsp;', note: 'Entities work; HTML tags do not' },
  { effect: 'Emoji', syntax: ':smile  (Rich Text editor picker)', note: 'Shortcodes are a picker, not markdown; paste the character in Markdown mode' },
];

const EDITORS: Array<{ aspect: string; rich: string; markdown: string }> = [
  { aspect: 'Default when you write a post or comment', rich: 'Yes', markdown: 'Click "Markdown Editor" / "Switch to Markdown"' },
  { aspect: 'Formatting', rich: 'Toolbar buttons (bold, italic, link, list, quote, code, spoiler, table, superscript, heading)', markdown: 'You type the syntax' },
  { aspect: 'Pasting markdown', rich: 'Shows the asterisks and brackets literally', markdown: 'Rendered on submit' },
  { aspect: 'Live preview', rich: 'WYSIWYG', markdown: 'No preview until posted (or use the toggle to check)' },
  { aspect: 'Switching mid-draft', rich: 'Rich → Markdown keeps formatting as syntax', markdown: 'Markdown → Rich may lose unsupported syntax' },
  { aspect: 'Tables', rich: 'Table button, no alignment control', markdown: 'Full pipe-table syntax with alignment' },
  { aspect: 'Spoilers, superscript', rich: 'Buttons', markdown: '>!text!< and ^text' },
  { aspect: 'Nested lists, nested quotes', rich: 'Limited', markdown: 'Full control' },
  { aspect: 'Headings', rich: 'One "Heading" button', markdown: 'Six levels' },
  { aspect: 'Emoji', rich: ':shortcode picker', markdown: 'Paste the character' },
  { aspect: 'Best for', rich: 'Short comments', markdown: 'Guides, tables, code, bots' },
];

const OLD_NEW: Array<{ feature: string; newReddit: string; oldReddit: string }> = [
  { feature: 'Hard line break with \\', newReddit: 'Yes', oldReddit: 'No — use two trailing spaces' },
  { feature: 'Fenced code blocks ```', newReddit: 'Yes', oldReddit: 'No — indent four spaces' },
  { feature: 'Ordered list with 1)', newReddit: 'Yes', oldReddit: 'No — use 1.' },
  { feature: 'Link title in (parentheses)', newReddit: 'Yes', oldReddit: 'No — use "quotes"' },
  { feature: 'Nested emphasis _a __b__ c_', newReddit: 'Yes', oldReddit: 'No' },
  { feature: 'Superscript ^(phrase)', newReddit: 'Yes', oldReddit: 'Often misparsed — use ^each ^word' },
  { feature: 'Superscript towers ^a^b^c', newReddit: 'No', oldReddit: 'Yes' },
  { feature: 'HTML entities (&nbsp;)', newReddit: 'Unescaped during parsing', oldReddit: 'Preserved' },
  { feature: 'Space between [text] and (url)', newReddit: 'Breaks the link', oldReddit: 'Tolerated' },
  { feature: 'Tables without outer pipes', newReddit: 'Works, quirks differ', oldReddit: 'Works, quirks differ' },
  { feature: 'Spoilers >!text!<', newReddit: 'Yes', oldReddit: 'Yes' },
];

const SECTIONS: Section[] = [
  {
    id: 'emphasis',
    title: 'Emphasis, spoilers, superscript',
    snippets: [
      {
        label: 'Bold, italic, strikethrough',
        syntax: 'Lorem ipsum *dolor* sit **amet**, ***consectetur*** ~~adipiscing~~ vul*pu*ta**te**.',
        note: 'Asterisks and underscores both work around whole words; inside a word only asterisks do.',
        more: { href: '/guides/markdown-bold-italic', label: 'Bold and italic guide' },
      },
      {
        label: 'Spoiler',
        syntax: 'The greatest thing you\'ll ever learn is just to >!reddit and be reddited in return!<.',
        preview: 'The greatest thing you\'ll ever learn is just to ████ ████ ███ ██████ ██ ██████.',
        note: 'Reddit-only. The text is blacked out until tapped; it still appears in the raw markdown and in notifications.',
      },
      {
        label: 'Superscript',
        syntax: 'just to ^reddit and ^(be reddited in return)\nor ^and ^be ^reddited ^in ^return',
        render: false,
        note: 'A caret superscripts one word; ^(…) a phrase on www.reddit.com but not reliably on old Reddit. Use &#x2005; between words to keep spacing even. There is no subscript.',
        more: { href: '/guides/markdown-superscript', label: 'Superscript guide' },
      },
    ],
  },
  {
    id: 'links',
    title: 'Links and autolinks',
    snippets: [
      {
        label: 'Inline, reference, community and user links',
        syntax: '[Reddit Help](https://support.reddithelp.com/hc/ "hover title")\n[Lorem ipsum][cl] with the target elsewhere.\n\n[cl]: https://www.reddit.com\n\nr/help, /u/reddit and https://www.reddit.com autolink.',
        note: 'The URL needs its scheme (https://). Accepted prefixes include http, https, ftp, mailto, git, steam, irc, ssh, / and #. Wrap a URL that parses badly in < >.',
        more: { href: '/guides/markdown-link', label: 'Link guide' },
      },
    ],
  },
  {
    id: 'structure',
    title: 'Headings, lists, quotes',
    snippets: [
      {
        label: 'Headings',
        syntax: '# Heading 1\n## Heading 2\n### Heading 3\n\nHeading 1 again\n===\n\nHeading 2 again\n---',
        note: 'Six levels with #; the underline form covers H1 and H2 only. Headings only work in posts, wikis and sidebars — comments render them too but moderators tend to dislike it.',
        more: { href: '/guides/markdown-headings', label: 'Headings guide' },
      },
      {
        label: 'Lists and sublists',
        syntax: '- List item 1\n  - Sublist item (2 spaces under a bullet)\n- List item 2\n\n1. First\n   1. Sub-step (3 spaces under a number)\n2. Second',
        note: 'Ordered lists must start at 1. Use 1. rather than 1) for old Reddit.',
        more: { href: '/guides/markdown-bullet-points', label: 'Bullet points guide' },
      },
      {
        label: 'Quote with a nested quote and a table inside',
        syntax: '> - First point\n>\n> > A nested reply.\n>\n> | Lorem | Ipsum |\n> |-----|-----|\n> | 8 | 1 |',
        note: 'For a single paragraph one leading > is enough; for anything longer prefix every line.',
        more: { href: '/guides/markdown-quote', label: 'Blockquote guide' },
      },
    ],
  },
  {
    id: 'tables',
    title: 'Tables',
    snippets: [
      {
        label: 'Aligned table',
        syntax: '| Ticker | Investment | Profit |\n|:-------|-----------:|:------:|\n| BTC    | $100       | $-50   |\n| ETH    | $1000      | $-500  |',
        note: 'The dashed marker row is required and sets alignment (:-- left, --: right, :-: center). Columns do not need to line up. Keep the outer pipes: both parsers misread tables without them.',
        more: { href: '/markdown-table-generator', label: 'Build a Reddit table with the generator' },
      },
    ],
  },
  {
    id: 'code',
    title: 'Code',
    snippets: [
      {
        label: 'Inline code and fenced block',
        syntax: 'Curabitur `gravida` molestie.\n\n```\nif ((err = SSLHashSHA1.update(&hashCtx, &signedParams)) != 0)\n    goto fail;\n    goto fail;\n```',
        note: 'Fences (``` or ~~~, 3+ matching characters) work on www.reddit.com. Old Reddit only understands the four-space indented form — use it when compatibility matters.',
        more: { href: '/guides/markdown-code-block', label: 'Code block guide' },
      },
      {
        label: 'Old-Reddit-safe indented block',
        syntax: '    fn main() {\n        println!("hey")\n    }',
        note: 'Four spaces (or a tab) before every line, with a blank line above. No language tag, no syntax highlighting on Reddit either way.',
      },
    ],
  },
  {
    id: 'breaks',
    title: 'Line breaks, spacing, escaping',
    snippets: [
      {
        label: 'Line break vs paragraph',
        syntax: 'Sed luctus ultricies leo et ultricies.  \nTwo trailing spaces broke that line.\n\nA blank line starts a paragraph; extra blank lines are collapsed.',
        note: 'A backslash at the end of the line also breaks it on www.reddit.com, but not on old Reddit. For visible vertical space, post a paragraph containing only &nbsp;.',
        more: { href: '/guides/markdown-new-line', label: 'New line guide' },
      },
      {
        label: 'Escaping a character',
        syntax: 'Lorem ipsum dolor sit amet\n\\- consectetur, not a list item.\n\n\\*not italic\\* and 1\\. not a list',
        note: 'A dash or number at the start of a wrapped line turns into a list; put a backslash in front of it.',
        more: { href: '/guides/markdown-escape-characters', label: 'Escape characters guide' },
      },
    ],
  },
];

const FAQ: Array<{ q: string; a: string; href?: { path: string; label: string } }> = [
  {
    q: 'Does Reddit use markdown?',
    a: 'Yes — a Reddit-specific dialect. Comments and posts written in the Markdown editor, plus wikis, sidebars, community rules and profile text, are parsed as markdown. The Rich Text editor (formerly Fancy Pants) is the default and does not interpret markdown you type; switch to the Markdown editor or paste will show literal asterisks.',
  },
  {
    q: 'How do I make a spoiler on Reddit?',
    a: 'Wrap the text in >! and !<, for example >!the butler did it!<. Do not put spaces directly inside the markers. In the Rich Text editor select the text and press the spoiler button instead. Spoilers also hide the text in the comment preview but not in push notifications.',
  },
  {
    q: 'How do I do superscript on Reddit?',
    a: 'Put a caret before a word: ^like ^this superscripts each word. ^(a whole phrase) works on www.reddit.com but is often misparsed on old Reddit, so Reddit itself recommends superscripting word by word and joining them with &#x2005; if spacing matters. Reddit has no subscript.',
    href: { path: '/guides/markdown-superscript', label: 'Superscript guide' },
  },
  {
    q: 'How do I make a table on Reddit?',
    a: 'A header row, a marker row of dashes, then data rows, all separated by pipes. Colons in the marker row set alignment. Reddit recommends keeping the leading and trailing pipes because the old and new parsers both have quirks without them. Tables need the Markdown editor (or the table button in Rich Text, which has no alignment).',
    href: { path: '/markdown-table-generator', label: 'Markdown table generator' },
  },
  {
    q: 'Why does my line break not show on Reddit?',
    a: 'Single newlines are joined into one paragraph. End the line with two spaces for a hard break (works everywhere) or a backslash (www.reddit.com only), or leave a blank line for a new paragraph. Multiple blank lines collapse; a paragraph containing only &nbsp; adds real vertical space.',
    href: { path: '/guides/markdown-new-line', label: 'New line guide' },
  },
  {
    q: 'What is the difference between the Rich Text editor and the Markdown editor?',
    a: 'The Rich Text editor is a WYSIWYG toolbar: you click Bold, Link, Table, Spoiler. The Markdown editor is a plain textarea where you type the syntax on this page. Rich Text → Markdown keeps your formatting as syntax; the reverse can drop syntax Rich Text has no button for. Bots and the API always post markdown.',
  },
  {
    q: 'What markdown works differently on old Reddit?',
    a: 'Old Reddit uses an older parser: no fenced code blocks (indent four spaces), no backslash line breaks (use two spaces), no 1) ordered lists, no parenthesised link titles, no nested emphasis, and ^(phrase) superscript is unreliable. Writing for the overlap — indented code, two-space breaks, 1. lists, quoted titles — renders correctly on both.',
    href: { path: '/markdown-flavors', label: 'Write for maximum portability' },
  },
];

function Th({ children }: { children: ReactNode }) {
  return <th className="py-2 pr-4 text-left font-semibold text-gray-950">{children}</th>;
}
function Td({ children, mono = false }: { children: ReactNode; mono?: boolean }) {
  return (
    <td className="py-2 pr-4 align-top text-gray-700">
      {mono ? <code className="whitespace-pre rounded bg-gray-100 px-1.5 py-0.5 text-xs">{children}</code> : children}
    </td>
  );
}

export default function RedditMarkdownPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'Reddit markdown formatting cheat sheet',
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
    <div className="mx-auto w-full max-w-5xl px-4 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-10 max-w-3xl">
        <div className="flex items-start gap-4">
          <ToolIconTile slug="reddit-markdown" size="lg" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">Reddit markdown formatting cheat sheet</h1>
            <UpdatedLine date={UPDATED} />
          </div>
        </div>
        <p className="mt-4 text-base text-gray-600">
          Reddit parses a dialect of markdown in the Markdown editor, wikis, sidebars and rules.
          It is standard markdown plus spoilers (<code className="rounded bg-gray-100 px-1">&gt;!text!&lt;</code>),
          superscript (<code className="rounded bg-gray-100 px-1">^word</code>) and automatic{' '}
          <code className="rounded bg-gray-100 px-1">r/</code> and <code className="rounded bg-gray-100 px-1">u/</code> links,
          minus images and HTML. The first table is the whole syntax; the last two cover the Rich
          Text editor and the differences on old Reddit, all from Reddit&apos;s own formatting guide.
        </p>
        <SectionNav sections={SECTIONS} className="mt-5 flex flex-wrap gap-2 text-xs" />
      </div>

      <section id="syntax-table" className="mb-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Reddit markdown syntax</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>Effect</Th>
                <Th>Type this</Th>
                <Th>Notes</Th>
              </tr>
            </thead>
            <tbody>
              {SYNTAX.map((r) => (
                <tr key={r.effect} className="border-b border-gray-100">
                  <Td>
                    <span className="font-medium text-gray-900">{r.effect}</span>
                  </Td>
                  <Td mono>{r.syntax}</Td>
                  <Td>{r.note}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CheatSheet sections={SECTIONS} />

      <section id="editors" className="mt-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Rich Text (Fancy Pants) editor vs Markdown editor</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>Aspect</Th>
                <Th>Rich Text editor</Th>
                <Th>Markdown editor</Th>
              </tr>
            </thead>
            <tbody>
              {EDITORS.map((r) => (
                <tr key={r.aspect} className="border-b border-gray-100">
                  <Td>
                    <span className="font-medium text-gray-900">{r.aspect}</span>
                  </Td>
                  <Td>{r.rich}</Td>
                  <Td>{r.markdown}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="old-vs-new" className="mt-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">www.reddit.com vs old.reddit.com</h2>
        <p className="text-base text-gray-600">
          Old Reddit runs an older parser. Reddit&apos;s guide lists these differences and recommends
          writing for the overlap when readers may use either.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>Feature</Th>
                <Th>www.reddit.com</Th>
                <Th>old.reddit.com</Th>
              </tr>
            </thead>
            <tbody>
              {OLD_NEW.map((r) => (
                <tr key={r.feature} className="border-b border-gray-100">
                  <Td>
                    <span className="font-medium text-gray-900">{r.feature}</span>
                  </Td>
                  <Td>{r.newReddit}</Td>
                  <Td>{r.oldReddit}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          <h2 className="text-xl font-semibold text-gray-950">Related tools and sheets</h2>
          <p>
            Build a table with the{' '}
            <Link href="/markdown-table-generator" className="text-indigo-700 underline">table generator</Link>, preview a
            long post in the{' '}
            <Link href="/markdown-viewer" className="text-indigo-700 underline">markdown viewer</Link>, count it with the{' '}
            <Link href="/markdown-word-counter" className="text-indigo-700 underline">word counter</Link>, or compare Reddit
            with Discord, Slack and GitHub on the{' '}
            <Link href="/markdown-flavors" className="text-indigo-700 underline">flavor comparison</Link>. The general{' '}
            <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">markdown cheat sheet</Link> covers
            everything Reddit shares with other platforms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-950">Sources</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {SOURCES.map((s) => (
              <li key={s.href}>
                <a href={s.href} className="text-indigo-700 underline" rel="noopener">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
