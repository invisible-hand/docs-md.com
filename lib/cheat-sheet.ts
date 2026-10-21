// The English markdown cheat sheet's content, shared by /markdown-cheat-sheet, its plain-markdown
// twin /markdown-cheat-sheet.md and /llms-full.txt. Translations live in content/i18n/<locale>/.
import type { Section } from '@/components/CheatSheet';

export const CHEAT_SHEET_FAQ: Array<{ q: string; a: string; href?: { path: string; label: string } }> = [
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

export const CHEAT_SHEET_SECTIONS: Section[] = [
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


/** One row of the "Markdown syntax at a glance" table at the top of the cheat sheet. */
export interface GlanceRow {
  element: string;
  syntax: string;
  note?: string;
}

export const CHEAT_SHEET_GLANCE: GlanceRow[] = [
  { element: 'Heading', syntax: '# H1  ## H2  ### H3', note: 'Up to six #; put a space after them.' },
  { element: 'Bold', syntax: '**bold text**' },
  { element: 'Italic', syntax: '*italic* or _italic_' },
  { element: 'Bold and italic', syntax: '***both***' },
  { element: 'Strikethrough', syntax: '~~deleted~~', note: 'GitHub Flavored Markdown (GFM).' },
  { element: 'Inline code', syntax: '`code`' },
  { element: 'Code block', syntax: '```js\ncode\n```', note: 'The word after the backticks sets the highlighting language.' },
  { element: 'Link', syntax: '[text](https://example.com)' },
  { element: 'Image', syntax: '![alt text](image.png)' },
  { element: 'Bulleted list', syntax: '- item', note: '* and + work too.' },
  { element: 'Numbered list', syntax: '1. item' },
  { element: 'Task list', syntax: '- [ ] to do\n- [x] done', note: 'GFM.' },
  { element: 'Blockquote', syntax: '> quoted text' },
  { element: 'Table', syntax: '| A | B |\n| --- | --- |\n| 1 | 2 |', note: 'GFM. Colons in the second row set alignment.' },
  { element: 'Horizontal rule', syntax: '---' },
  { element: 'Line break', syntax: 'line one\\\nline two', note: 'A backslash or two trailing spaces at the end of the line.' },
  { element: 'Footnote', syntax: 'Text[^1]\n\n[^1]: The note.', note: 'GFM.' },
  { element: 'Escape a character', syntax: '\\*not italic\\*', note: 'A backslash before any markdown symbol.' },
  { element: 'Diagram', syntax: '```mermaid\nflowchart LR\n  A --> B\n```', note: 'Renders on GitHub, GitLab and Docs MD.' },
];
