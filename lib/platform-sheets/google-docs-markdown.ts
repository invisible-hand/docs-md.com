import type { Section } from '@/components/CheatSheet';

// Content of /google-docs-markdown, shared by the page and /llms-full.txt.
export const SECTIONS: Section[] = [
  {
    id: 'typing',
    title: 'Markdown Google Docs converts as you type',
    intro:
      'With Tools → Preferences → "Enable Markdown" checked, Docs, Slides and Drawings autocorrect these markers the moment you finish typing them. Headings are Docs-only.',
    snippets: [
      {
        label: 'Bold, italic, both, strikethrough',
        syntax: 'This is **bold**, this is _italic_, this is ***both*** and this is ~struck~.',
        preview: 'This is **bold**, this is _italic_, this is ***both*** and this is ~~struck~~.',
        note: 'Asterisks or underscores both work (one pair for italic, two for bold, three for both). Strikethrough is a SINGLE tilde in Google\'s help, not the ~~double tilde~~ of GitHub Flavored Markdown.',
        more: { href: '/guides/markdown-bold-italic', label: 'Bold and italic guide' },
      },
      {
        label: 'Headings 1–6 (Docs only)',
        syntax: '# Heading 1\n## Heading 2\n### Heading 3\n#### Heading 4\n##### Heading 5\n###### Heading 6',
        note: 'Type the number signs at the start of a paragraph, a space, then the text. Google\'s help stresses the space: "#Heading" without it stays plain text. Slides and Drawings do not convert headings.',
        more: { href: '/guides/markdown-headings', label: 'Headings guide' },
      },
      {
        label: 'Link',
        syntax: 'Open a file in [Google Docs](https://docs.google.com/document/).',
        note: 'No space between the closing bracket and the opening parenthesis, or Docs leaves the brackets as text.',
        more: { href: '/guides/markdown-link', label: 'Link guide' },
      },
      {
        label: 'Lists and checkboxes (older autocorrect)',
        syntax: '- bulleted item\n* also a bulleted item\n1. numbered item\n[] checkbox item',
        preview: '- bulleted item\n- also a bulleted item\n\n1. numbered item\n\n- [ ] checkbox item',
        note: 'Google\'s 2022 announcement lists "* or - followed by a space", numbered-list starts and "[] followed by a space" as the autocorrections that existed before the 2022 expansion. [] is the Docs checkbox shortcut; GFM spells it - [ ].',
        more: { href: '/guides/markdown-checkbox', label: 'Checkbox guide' },
      },
    ],
  },
  {
    id: 'paste',
    title: 'Paste from Markdown',
    intro:
      'A normal paste keeps the asterisks and hashes as literal text. The documented route is the right-click menu: copy the Markdown, right-click in the document and choose "Paste from Markdown". It is off until "Enable Markdown" is checked.',
    snippets: [
      {
        label: 'A document to paste',
        syntax: '## Release notes\n\n**Shipped:** the new importer.\n\n- Faster uploads\n- Fewer timeouts\n\nSee the [changelog](https://example.com/changelog).',
        note: 'Google\'s help documents the menu item, not an element-by-element list of what it converts. Headings, bold, italic, strikethrough, links and lists are the elements Google names elsewhere on the same page; check tables, code blocks and footnotes in the result before trusting them.',
        more: { href: '/markdown-formatter', label: 'Tidy the Markdown before you paste it' },
      },
    ],
  },
  {
    id: 'export',
    title: 'Download as Markdown and Copy as Markdown',
    intro:
      'File → Download → "Markdown (.md)" writes the whole document as a .md file and is on by default. Select text, right-click and choose "Copy as Markdown" to put Markdown on the clipboard; that item also needs "Enable Markdown".',
    snippets: [
      {
        label: 'Round-trip test document',
        syntax: '# Round trip\n\nParagraph with **bold**, _italic_ and a [link](https://docs-md.com).\n\n1. First\n2. Second\n\n| Column | Column |\n| --- | --- |\n| cell | cell |\n\n```\ncode block\n```\n\nFootnote reference.[^1]\n\n[^1]: The footnote.',
        note: 'Paste this with "Paste from Markdown", then File → Download → Markdown (.md) and open the file in the markdown viewer. Whatever came back unchanged is safe to rely on in your own documents; whatever flattened to plain text is not documented as supported.',
        more: { href: '/markdown-viewer', label: 'Open the downloaded .md in the viewer' },
      },
    ],
  },
  {
    id: 'import',
    title: 'Import a .md file as a Google Doc',
    intro:
      'In Docs: File → Open → Upload, pick the .md file, and it opens as a new document. In Drive: upload the file, right-click it and choose Open with → Google Docs. Both are on by default.',
    snippets: [
      {
        label: 'What a .md file is',
        syntax: 'README.md\nnotes.md\nmeeting-2026-11-03.md',
        render: false,
        note: 'A .md file is plain text with Markdown markup inside. Any text editor opens it; Docs converts the markup into real headings, lists and links on import. For a .docx instead, convert the Markdown first and upload that.',
        more: { href: '/markdown-to-word', label: 'Markdown to Word (.docx) converter' },
      },
    ],
  },
];
