import type { Section } from '@/components/CheatSheet';

// Content of /obsidian-markdown, shared by the page and /llms-full.txt.
export const SECTIONS: Section[] = [
  {
    id: 'basics',
    title: 'Basics that match GFM',
    snippets: [
      {
        label: 'Emphasis, code, strikethrough',
        syntax: '**bold** *italic* ***both*** ~~struck~~ `inline code`',
        note: 'Underscores work too. Obsidian shows the markers in Live Preview until the cursor leaves the line; Reading view hides them.',
        more: { href: '/guides/markdown-bold-italic', label: 'Bold and italic guide' },
      },
      {
        label: 'Task list with custom states',
        syntax: '- [ ] Incomplete\n- [x] Complete\n- [?] Any character is allowed inside the brackets',
        preview: '- [ ] Incomplete\n- [x] Complete\n- [ ] Any character is allowed inside the brackets (theme-dependent)',
        note: 'Obsidian accepts any character in the box; themes decide how [?], [!] or [-] look. Other apps render them as plain text.',
        more: { href: '/guides/markdown-checkbox', label: 'Checkbox guide' },
      },
    ],
  },
  {
    id: 'highlight-comments',
    title: 'Highlight and comments',
    snippets: [
      {
        label: '==Highlight==',
        syntax: 'This is ==highlighted== and ==🔴 colour-coded== text.',
        render: false,
        note: 'Two equals signs on each side, rendered as <mark>. Not GFM: GitHub shows the = signs. Obsidian suggests an emoji right after the opening == to colour-code highlights.',
        more: { href: '/guides/markdown-color-text', label: 'Color text guide: highlight alternatives' },
      },
      {
        label: '%%Comments%%',
        syntax: 'Visible text %%hidden inline comment%% more visible text.\n\n%%\nA block comment: everything until the next %% is hidden in Reading view.\n%%',
        render: false,
        note: 'Obsidian-only. For a comment that other markdown apps also hide, use <!-- HTML comment --> instead.',
        more: { href: '/guides/markdown-comment', label: 'Comment guide' },
      },
    ],
  },
  {
    id: 'wikilinks',
    title: '[[Wikilinks]]',
    intro: 'Obsidian links by note name, not by path. Type [[ to get autocomplete; the link stays valid when you rename the note because Obsidian updates every reference.',
    snippets: [
      {
        label: 'Note, alias, heading, block',
        syntax: '[[Three laws of motion]]\n[[Three laws of motion|Newton]]\n[[About Obsidian#Links are first-class citizens]]\n[[2023-01-01#^37066d]]',
        render: false,
        note: 'Characters that break a link target: # | ^ : %% [[ ]]. A link in a table cell must escape its pipe: [[Note\\|alias]].',
        more: { href: '/guides/markdown-link', label: 'Link guide' },
      },
      {
        label: 'Portable alternative: markdown link',
        syntax: '[Newton](Three%20laws%20of%20motion.md)',
        note: 'Turn off "Use [[Wikilinks]]" in Settings → Files and links and Obsidian writes this form, which GitHub, VS Code and static site generators understand.',
      },
    ],
  },
  {
    id: 'embeds',
    title: '![[Embeds]]',
    snippets: [
      {
        label: 'Embed a note, a section, an image with size, a PDF page',
        syntax: '![[Internal links]]\n![[Internal links#^b15695]]\n![[Engelbart.jpg|100x145]]\n![[Document.pdf#page=3&height=400]]',
        render: false,
        note: 'Same syntax as a wikilink with ! in front. Width-only (|100) scales proportionally; a canvas embed shows shapes but not card text.',
        more: { href: '/guides/markdown-image', label: 'Image guide' },
      },
    ],
  },
  {
    id: 'callouts',
    title: 'Callouts',
    intro: 'A blockquote whose first line is [!type] becomes a coloured callout. The identifier is case-insensitive; text after it on the same line is the title.',
    snippets: [
      {
        label: 'Callout with custom title',
        syntax: '> [!tip] Callouts can have custom titles\n> Like this one.',
        preview: '> **Tip: Callouts can have custom titles**\n> Like this one.',
        note: 'Without a title the type name is used. Outside Obsidian (and GitHub, which only knows NOTE/TIP/IMPORTANT/WARNING/CAUTION) the [!tip] shows as text.',
      },
      {
        label: 'Foldable: - collapsed, + expanded',
        syntax: '> [!faq]- Are callouts foldable?\n> Yes! In a foldable callout, the contents are hidden when the callout is collapsed.\n\n> [!info]+ Open by default\n> A plus sign expands the callout by default.',
        preview: '> **FAQ: Are callouts foldable?** ▸\n> (collapsed)\n\n> **Info: Open by default** ▾\n> A plus sign expands the callout by default.',
        note: 'The fold marker goes directly after the closing bracket, before the title. GitHub alerts have no equivalent — use <details> there.',
        more: { href: '/guides/markdown-collapsible-section', label: 'Collapsible section guide' },
      },
      {
        label: 'Nested callouts',
        syntax: '> [!question] Can callouts be nested?\n>\n> > [!todo] Yes!, they can.\n>\n> > > [!example] You can even use multiple layers of nesting.',
        preview: '> **Question: Can callouts be nested?**\n>\n> > **Todo: Yes!, they can.**\n>\n> > > **Example: You can even use multiple layers of nesting.**',
        note: 'Each level is one more > prefix, exactly like nested blockquotes.',
        more: { href: '/guides/markdown-quote', label: 'Blockquote guide' },
      },
    ],
  },
  {
    id: 'properties',
    title: 'Properties (front matter)',
    snippets: [
      {
        label: 'YAML block at the top of the note',
        syntax: '---\ntitle: Three laws of motion\ntags:\n  - physics\n  - classical/mechanics\naliases:\n  - Newton\'s laws\ndate: 2020-08-21\nreviewed: 2020-08-21T10:30:00\npublished: true\nsource: "[[Principia]]"\n---',
        render: false,
        note: 'Types: text, list, number, checkbox (true/false), date, date & time, plus the special tags type. A wikilink in a property must be quoted. Markdown is not rendered in properties, and nested YAML is not supported.',
        more: { href: '/front-matter-generator', label: 'Front matter generator' },
      },
    ],
  },
  {
    id: 'tags',
    title: 'Tags',
    snippets: [
      {
        label: 'Inline and nested tags',
        syntax: 'Meeting notes #meeting #inbox/to-read #y1984',
        render: false,
        note: 'Letters, numbers, _ - / and emoji; no spaces; at least one non-numeric character (#1984 is not a tag, #y1984 is). Case-insensitive. A line starting with "# " is a heading, not a tag.',
      },
    ],
  },
  {
    id: 'math-diagrams',
    title: 'Math and diagrams',
    snippets: [
      {
        label: 'MathJax',
        syntax: 'Inline $e^{2i\\pi} = 1$ and a block:\n\n$$\n\\begin{vmatrix}a & b\\\\ c & d \\end{vmatrix}=ad-bc\n$$',
        render: false,
        note: 'Same $ and $$ delimiters as GitHub; Obsidian renders them with MathJax in Live Preview and Reading view.',
        more: { href: '/guides/markdown-math', label: 'Math guide' },
      },
      {
        label: 'Mermaid with links into the vault',
        syntax: '```mermaid\ngraph TD\nBiology --> Chemistry\nclass Biology,Chemistry internal-link;\n```',
        note: 'The internal-link class turns nodes into links to notes of the same name; quote names that contain special characters. Those links do not appear in Graph view.',
      },
    ],
  },
  {
    id: 'footnotes',
    title: 'Footnotes',
    snippets: [
      {
        label: 'Referenced and inline',
        syntax: 'A claim.[^1] Another with an inline note.^[Inline footnotes render in Reading view only.]\n\n[^1]: The referenced footnote.\n  Continuation lines start with two spaces.',
        preview: 'A claim.[^1] Another with an inline note.[^2]\n\n[^1]: The referenced footnote.\n  Continuation lines start with two spaces.\n[^2]: Inline footnotes render in Reading view only.',
        note: 'The ^[inline] form is Obsidian (and Pandoc) only; GitHub shows it as text.',
        more: { href: '/guides/markdown-footnotes', label: 'Footnotes guide' },
      },
    ],
  },
  {
    id: 'dataview',
    title: 'Dataview and other plugin syntax',
    snippets: [
      {
        label: 'Dataview query block (community plugin)',
        syntax: '```dataview\nTABLE date, status\nFROM #meeting\nSORT date DESC\n```',
        render: false,
        note: 'Not Obsidian markdown — it only works with the Dataview community plugin installed, and exports as a literal code block everywhere else. Same for ```tasks, ```query and inline `= this.file.name` fields.',
      },
    ],
  },
];
