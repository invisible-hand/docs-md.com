import type { Section } from '@/components/CheatSheet';

// Content of /notion-markdown, shared by the page and /llms-full.txt.
export const SECTIONS: Section[] = [
  {
    id: 'inline',
    title: 'Inline shortcuts (type around text)',
    snippets: [
      {
        label: 'Bold, italic, code, strikethrough',
        syntax: '**bold** *italic* `code` ~strike~',
        preview: '**bold** *italic* `code` ~~strike~~',
        note: 'Notion converts the markers the moment you type the closing one. Strikethrough is a single tilde; the double tilde GFM uses also works on paste.',
        more: { href: '/guides/markdown-bold-italic', label: 'Bold and italic guide' },
      },
    ],
  },
  {
    id: 'blocks',
    title: 'Block shortcuts (type at the start of a line, then space)',
    snippets: [
      {
        label: 'Headings, lists, to-dos',
        syntax: '# Heading 1\n## Heading 2\n### Heading 3\n- Bulleted item\n1. Numbered item\n[] To-do item',
        preview: '# Heading 1\n## Heading 2\n### Heading 3\n- Bulleted item\n1. Numbered item\n- [ ] To-do item',
        note: 'Notion has only three heading levels. The to-do shortcut is [] with no space inside, then a space — different from GFM\'s - [ ].',
        more: { href: '/guides/markdown-headings', label: 'Headings guide' },
      },
      {
        label: 'Toggle vs quote: > is a toggle in Notion',
        syntax: '> This becomes a TOGGLE in Notion\n" This becomes a QUOTE in Notion\n--- (divider)',
        render: false,
        note: 'In every other markdown dialect > is a blockquote. Notion\'s "typing" shortcut makes it a collapsible toggle; the quote block shortcut is a double quote. On paste or import, > is treated as a quote.',
        more: { href: '/guides/markdown-quote', label: 'Blockquote guide' },
      },
    ],
  },
  {
    id: 'paste',
    title: 'Pasting markdown',
    snippets: [
      {
        label: 'Paste a whole document',
        syntax: '## Release notes\n\n- [x] Ship v2\n- [ ] Write docs\n\n| Area | Owner |\n| --- | --- |\n| API | Sam |\n\n```js\nconsole.log("hi");\n```',
        note: 'Pasting multi-line markdown into a Notion page converts headings, lists, to-dos, tables and code fences into blocks. Anything Notion has no block for (footnotes, alerts, HTML, front matter) stays as plain text.',
        more: { href: '/markdown-formatter', label: 'Format the markdown first' },
      },
    ],
  },
  {
    id: 'export',
    title: 'What export writes',
    snippets: [
      {
        label: 'Callout and toggle after "Markdown & CSV" export',
        syntax: '<aside>\n💡 A callout comes out as HTML because markdown has no callout block.\n\n</aside>\n\n- A toggle heading\n    The toggle body is exported as an indented block under it; the fold is gone.',
        render: false,
        note: 'Notion\'s help says callouts "will be exported as HTML, as there is no Markdown equivalent". Replace the <aside> with a GitHub alert or a blockquote before publishing elsewhere.',
        more: { href: '/github-flavored-markdown', label: 'GitHub alerts syntax' },
      },
      {
        label: 'Database → CSV + one .md per row',
        syntax: 'Tasks 1a2b3c4d.csv\nTasks/\n  Write docs 5e6f7a8b.md\n  Ship v2 9c0d1e2f.md',
        render: false,
        note: 'Every exported file name carries the 32-character page id. Only the current or default view is exported, and form views cannot be exported at all.',
        more: { href: '/csv-to-markdown', label: 'Turn the CSV back into a markdown table' },
      },
    ],
  },
];
