import Link from 'next/link';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import CheatSheet, { SectionNav, type Section } from '@/components/CheatSheet';
import UpdatedLine from '@/components/UpdatedLine';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-10-15';

const FAQ: Array<{ q: string; a: string; href?: { path: string; label: string } }> = [
  {
    q: 'What is a markdown cheat sheet?',
    a: 'A one-page reference of every markdown element with the syntax and the rendered result side by side, so you can copy the exact characters instead of guessing. This one covers core markdown, GitHub Flavored Markdown (tables, task lists, strikethrough, footnotes), and mermaid diagrams.',
  },
  {
    q: 'How do I make text bold or italic in markdown?',
    a: 'Wrap text in double asterisks for bold (**bold**) and single asterisks or underscores for italic (*italic* or _italic_). Triple asterisks give bold italic. Underscores inside a word do not trigger emphasis on GitHub, so asterisks are the safer default.',
  },
  {
    q: 'How do I add a link or an image?',
    a: 'A link is [text](https://example.com) and an image is the same with a leading exclamation mark: ![alt text](image.png). Add a tooltip with a quoted title after the URL. Reference-style links ([text][id] plus [id]: url on its own line) keep long documents readable.',
  },
  {
    q: 'How do I write a code block?',
    a: 'Put the code between two lines of three backticks. Add a language name right after the opening backticks (```js) to get syntax highlighting. Use single backticks for inline code.',
  },
  {
    q: 'How do I make a table in markdown?',
    a: 'Separate columns with pipes and add a line of dashes under the header row. Colons in that separator line set alignment: :--- left, :---: center, ---: right. Tables are a GFM extension supported by GitHub, GitLab, and most renderers.',
  },
  {
    q: 'What is the difference between Markdown and GitHub Flavored Markdown?',
    a: 'GitHub Flavored Markdown (GFM) is the original markdown plus tables, task lists, strikethrough, autolinks, and footnotes, with a formal spec built on CommonMark. Nearly every modern renderer supports GFM, so it is what people usually mean by "markdown". GitHub itself adds alerts, emoji shortcodes and mermaid on top of GFM.',
    href: { path: '/github-flavored-markdown', label: 'GitHub Flavored Markdown cheat sheet' },
  },
  {
    q: 'Which Markdown works in Slack, Discord and Notion?',
    a: 'Each one is a different dialect. Discord supports most of the basics (**bold**, *italic*, code fences, headings, quotes) but has no tables or images and uses __underscores__ for underline. Slack is not markdown at all: *single asterisks* are bold, _underscores_ italic, ~tildes~ strikethrough, and [text](url) links only work in the composer with the markup preference on. Notion converts markdown as you type and on paste, including tables and task lists. Check the per-platform sheets before pasting.',
    href: { path: '/markdown-flavors', label: 'Markdown flavors compared' },
  },
];

export const metadata = pageMetadata({
  title: 'Markdown Cheat Sheet — Complete Syntax Reference',
  description:
    'Every markdown element with live rendered examples: headings, emphasis, lists, links, images, code, tables, task lists, footnotes, mermaid. Copy a snippet.',
  path: '/markdown-cheat-sheet',
  type: 'article',
  kicker: 'Reference',
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

const SECTIONS: Section[] = [
  {
    id: 'headings',
    title: 'Headings',
    snippets: [
      {
        label: 'Six levels',
        syntax: '# H1 — page title\n## H2 — section\n### H3 — subsection\n#### H4\n##### H5\n###### H6',
        note: 'One H1 per document is the convention. The alternative "underline" syntax (=== / ---) only covers H1 and H2 — the # form is preferred.',
      },
    ],
  },
  {
    id: 'emphasis',
    title: 'Emphasis',
    snippets: [
      {
        label: 'Bold, italic, both',
        syntax: '**bold** and *italic* and ***bold italic***',
        note: 'Underscores work too (__bold__, _italic_), but asterisks survive mid-word: fan**tas**tic.',
      },
      {
        label: 'Strikethrough (GFM)',
        syntax: '~~crossed out~~',
      },
    ],
  },
  {
    id: 'lists',
    title: 'Lists',
    snippets: [
      {
        label: 'Unordered',
        syntax: '- First item\n- Second item\n  - Nested (indent 2 spaces)\n- Third item',
        more: { href: '/guides/markdown-nested-list', label: 'Nested list guide: indentation rules' },
      },
      {
        label: 'Ordered',
        syntax: '1. Step one\n2. Step two\n1. The numbers you type don\'t matter — renderers count for you',
        more: { href: '/guides/markdown-numbered-list', label: 'Numbered list guide: restarting and continuing numbers' },
      },
      {
        label: 'Task list (GFM)',
        syntax: '- [x] Ship the feature\n- [ ] Write the docs\n- [ ] Tell someone',
      },
    ],
  },
  {
    id: 'links-images',
    title: 'Links & images',
    snippets: [
      {
        label: 'Inline link',
        syntax: '[link text](https://docs-md.com "optional hover title")',
      },
      {
        label: 'Image',
        syntax: '![alt text describing the image](https://docs-md.com/favicon.ico)',
        note: 'An image is a link with a ! in front. Alt text matters: screen readers read it, and it shows when the image breaks.',
      },
      {
        label: 'Autolink (GFM)',
        syntax: 'Bare URLs become links: https://docs-md.com',
      },
      {
        label: 'Reference-style',
        syntax: 'Long documents read better with [named references][docs].\n\n[docs]: https://docs-md.com',
        note: 'Definitions can live anywhere in the file — conventionally at the bottom.',
      },
    ],
  },
  {
    id: 'anchor-links',
    title: 'Anchor links',
    intro: 'A link to a heading on the same page. The target is the heading text as a slug: lowercase, spaces to hyphens, punctuation removed.',
    snippets: [
      {
        label: 'Link to a heading',
        syntax: '## Getting Started\n\nJump to [Getting Started](#getting-started) or [Step 2: Install](#step-2-install).',
        note: 'Slug rules on GitHub: lowercase everything, drop punctuation except hyphens and underscores, turn spaces into hyphens, and add -1, -2 to duplicate headings. "Step 2: Install" becomes #step-2-install.',
        more: { href: '/guides/markdown-anchor-link', label: 'Anchor link guide: slug rules per platform' },
      },
      {
        label: 'Custom anchor with HTML',
        syntax: '<a id="custom-target"></a>\n## Any heading text\n\n[Go there](#custom-target)',
        render: false,
        note: 'When the heading text might change, pin an explicit id with an empty <a> tag above it. Works wherever inline HTML is allowed (GitHub, GitLab, most static site generators).',
      },
    ],
  },
  {
    id: 'code',
    title: 'Code',
    snippets: [
      {
        label: 'Inline code',
        syntax: 'Run `npm install` before `npm run dev`.',
      },
      {
        label: 'Fenced block with language',
        syntax: "```ts\nfunction greet(name: string) {\n  return `Hello, ${name}`;\n}\n```",
        note: 'The language tag after ``` turns on syntax highlighting. Common tags: js, ts, python, bash, json, sql, diff.',
      },
      {
        label: 'Fence inside a fence',
        syntax: '````md\nTo show a code block inside a code block,\nuse more backticks on the outside:\n```js\nconsole.log("nested");\n```\n````',
        render: false,
      },
    ],
  },
  {
    id: 'tables',
    title: 'Tables (GFM)',
    snippets: [
      {
        label: 'Basic table with alignment',
        syntax: '| Left | Center | Right |\n| :--- | :----: | ----: |\n| a    |   b    |     c |\n| d    |   e    |     f |',
        note: 'Colons in the separator row control alignment. Escape literal pipes in cells as \\|. Need to build one fast? Use the table generator below.',
        more: { href: '/guides/markdown-table', label: 'Table guide: alignment, line breaks inside cells, wide tables' },
      },
    ],
  },
  {
    id: 'blockquotes',
    title: 'Blockquotes',
    snippets: [
      {
        label: 'Quote and nesting',
        syntax: '> A quoted paragraph.\n>\n> > Nested quotes work too.\n>\n> Back to the first level — **formatting works inside**.',
        note: 'Prefix every line with > (a lone > keeps a multi-paragraph quote together). GitHub turns > [!NOTE] / [!WARNING] quotes into coloured alerts.',
        more: { href: '/guides/markdown-quote', label: 'Full blockquote guide: attribution, alerts, Discord/Slack quirks' },
      },
    ],
  },
  {
    id: 'alerts',
    title: 'Alerts (GitHub)',
    intro: 'A blockquote whose first line is [!TYPE] renders as a coloured callout on GitHub. Five types: NOTE, TIP, IMPORTANT, WARNING, CAUTION.',
    snippets: [
      {
        label: 'The five alert types',
        syntax: '> [!NOTE]\n> Useful information the reader should know.\n\n> [!TIP]\n> Advice for doing something better.\n\n> [!IMPORTANT]\n> Key information needed to succeed.\n\n> [!WARNING]\n> Urgent info that needs immediate attention.\n\n> [!CAUTION]\n> Negative consequences of an action.',
        preview: '> **Note**\n> Useful information the reader should know.\n\n> **Tip**\n> Advice for doing something better.\n\n> **Important**\n> Key information needed to succeed.\n\n> **Warning**\n> Urgent info that needs immediate attention.\n\n> **Caution**\n> Negative consequences of an action.',
        note: 'Rendered as coloured boxes with icons on GitHub (READMEs, issues, PRs, discussions) and GitLab. Everywhere else — VS Code preview, Slack, Discord, Notion, most static site generators — the literal text "[!NOTE]" shows inside a plain blockquote, which is roughly what the preview on the right approximates.',
        more: { href: '/guides/markdown-alerts', label: 'Alerts guide: every type, nesting and fallbacks' },
      },
    ],
  },
  {
    id: 'structure',
    title: 'Structure & spacing',
    snippets: [
      {
        label: 'Horizontal rule',
        syntax: 'Above the line.\n\n---\n\nBelow the line.',
        note: 'Three or more hyphens on their own line, with blank lines around them (otherwise --- under text becomes an H2).',
      },
      {
        label: 'Line break vs. new paragraph',
        syntax: 'End a line with two spaces  \nfor a line break in the same paragraph.\n\nA blank line starts a new paragraph.',
        note: 'A backslash at the end of a line also forces a break and is easier to see than trailing spaces.',
      },
      {
        label: 'Escaping characters',
        syntax: '\\*not italic\\* and \\# not a heading and \\| not a table pipe',
      },
    ],
  },
  {
    id: 'footnotes',
    title: 'Footnotes (GFM)',
    snippets: [
      {
        label: 'Footnote reference and definition',
        syntax: 'Markdown was created in 2004.[^1]\n\n[^1]: By John Gruber, with Aaron Swartz contributing to the syntax.',
        note: 'Supported on GitHub and most modern renderers; not part of original markdown.',
      },
    ],
  },
  {
    id: 'emoji',
    title: 'Emoji',
    snippets: [
      {
        label: 'Shortcodes and literal emoji',
        syntax: 'Ship it :tada: :rocket: — or paste the character directly: 🎉 🚀',
        render: false,
        note: 'Shortcodes like :tada: are not markdown: GitHub, GitLab, Slack and Discord expand them; CommonMark renderers, VS Code preview and most static site generators print the colons. Pasting the actual emoji character works everywhere.',
        more: { href: '/guides/markdown-emoji', label: 'Emoji guide: shortcode support matrix' },
      },
    ],
  },
  {
    id: 'mermaid',
    title: 'Mermaid diagrams',
    snippets: [
      {
        label: 'Flowchart from a code fence',
        syntax: '```mermaid\ngraph LR\n  A[Write markdown] --> B{Share it?}\n  B -->|yes| C[Get a link]\n  B -->|no| D[Keep local]\n```',
        note: 'Supported on GitHub, GitLab, and Docs MD share pages. Also handles sequence diagrams, gantt charts, and ER diagrams.',
      },
    ],
  },
  {
    id: 'html',
    title: 'Inline HTML',
    snippets: [
      {
        label: 'When markdown runs out',
        syntax: 'Markdown has no underline, so use <u>HTML</u>, <sub>subscript</sub>, <sup>superscript</sup>, or <kbd>Ctrl</kbd>+<kbd>C</kbd>.',
        note: 'Most renderers pass HTML through (GitHub sanitizes scripts and styles). The preview on this page strips raw HTML, so check the result on your target platform.',
      },
      {
        label: 'Keyboard keys with <kbd>',
        syntax: 'Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> to open the command palette.',
        render: false,
        note: 'GitHub styles <kbd> as a small key cap. There is no markdown-native syntax for keys; backticks (`Ctrl`) are the plain-text fallback that works everywhere.',
      },
      {
        label: 'Collapsible section with <details>',
        syntax: '<details>\n<summary>Click to expand</summary>\n\nHidden content — **markdown works here** if you leave a blank line after the summary.\n\n</details>',
        render: false,
        note: 'Supported on GitHub, GitLab and most docs sites. Add <details open> to start expanded. Not supported in Slack, Discord or Notion.',
        more: { href: '/guides/markdown-collapsible-section', label: 'Collapsible section guide' },
      },
    ],
  },
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
          <span className="text-xs text-gray-500">One file, every snippet on this page. Or press Ctrl/Cmd+P — the page has print styles.</span>
        </div>
        <SectionNav sections={SECTIONS} className="no-print mt-5 flex flex-wrap gap-2 text-xs" />
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
