import type { Section } from '@/components/CheatSheet';

// Content of /github-flavored-markdown, shared by the page and /llms-full.txt.
export const SECTIONS: Section[] = [
  {
    id: 'text',
    title: 'Text styling',
    snippets: [
      {
        label: 'Bold, italic, strikethrough',
        syntax: '**bold** or __bold__\n*italic* or _italic_\n***bold italic***\n~~strikethrough~~ or ~strikethrough~',
        note: 'GFM accepts one or two tildes for strikethrough; three or more do nothing. Most other renderers need exactly two.',
        more: { href: '/guides/markdown-strikethrough', label: 'Strikethrough guide' },
      },
      {
        label: 'Subscript, superscript, underline (HTML)',
        syntax: 'H<sub>2</sub>O and E = mc<sup>2</sup> and <ins>underlined</ins>',
        render: false,
        note: 'No markdown syntax for these on GitHub — the docs prescribe the <sub>, <sup> and <ins> tags. This preview strips raw HTML; GitHub renders it.',
        more: { href: '/guides/markdown-underline', label: 'Underline guide' },
      },
      {
        label: 'Color chip (issues, PRs, discussions only)',
        syntax: 'Brand blue is `#0969DA`, also `rgb(9, 105, 218)` or `hsl(212, 92%, 45%)`.',
        note: 'A HEX, RGB or HSL value in backticks with no spaces inside gets a colour swatch — but only in issues, pull requests and discussions, never in .md files.',
      },
    ],
  },
  {
    id: 'tables',
    title: 'Tables',
    snippets: [
      {
        label: 'Table with alignment',
        syntax: '| Left | Center | Right |\n| :--- | :----: | ----: |\n| a    |   b    |     c |',
        note: 'Needs a header row and a delimiter row of at least three dashes per column; colons set alignment. A literal | inside a cell must be written \\|.',
        more: { href: '/markdown-table-generator', label: 'Build one with the table generator' },
      },
    ],
  },
  {
    id: 'task-lists',
    title: 'Task lists',
    snippets: [
      {
        label: 'Checkboxes',
        syntax: '- [x] Write the code\n- [ ] Write the tests\n- [ ] \\(Optional) Open a follow-up issue',
        note: 'In issues and PRs the boxes are clickable and the file updates. Escape a leading parenthesis after the box (\\() or the item breaks.',
        more: { href: '/guides/markdown-checkbox', label: 'Checkbox guide' },
      },
    ],
  },
  {
    id: 'links',
    title: 'Links, autolinks and references',
    snippets: [
      {
        label: 'Bare URLs and www. autolinks',
        syntax: 'Docs at https://docs-md.com or www.example.com, mail hello@example.com',
        note: 'The GFM autolink extension recognises http://, https://, www. and e-mail addresses without angle brackets. CommonMark needs <https://…>.',
      },
      {
        label: 'Section link to a heading',
        syntax: '## Step 2: Install\n\nSee [the install step](#step-2-install).',
        note: 'GitHub slugs: lowercase, spaces to hyphens, other punctuation removed, markup stripped, duplicates get -1, -2. Edit the heading and the anchor changes.',
        more: { href: '/markdown-toc-generator', label: 'Generate a table of contents with correct anchors' },
      },
      {
        label: 'Relative link to a file in the repo',
        syntax: '[Contributing](docs/CONTRIBUTING.md) and [root file](/README.md)',
        render: false,
        note: 'Paths are relative to the current file; a leading / means the repository root. Keep link text on one line — a link broken across lines does not work.',
      },
      {
        label: 'Issue, PR and commit references (github.com only)',
        syntax: 'Fixes #26, see GH-26 and jlord/sheetsee.js#26.\nCommit a5c3785ed8d6a35868bc169f07e40e889087fd2e or jlord/sheetsee.js@a5c3785',
        render: false,
        note: 'Converted to short links in issues, PRs, discussions and commit messages — not in wikis or in files rendered from the repository.',
      },
      {
        label: '@mentions',
        syntax: 'cc @octocat and @github/docs-team',
        render: false,
        note: 'Mentioning notifies the person or every team member — only if they have read access to the repository.',
      },
    ],
  },
  {
    id: 'code',
    title: 'Code',
    snippets: [
      {
        label: 'Fenced block with language',
        syntax: '```diff\n- const old = 1;\n+ const fresh = 2;\n```',
        note: 'The identifier after the fence picks the highlighter (Linguist). Unknown tags fall back to plain text — see the language table below.',
        more: { href: '/guides/markdown-code-block', label: 'Code block guide' },
      },
      {
        label: 'Inline code and the `#` color chip trap',
        syntax: 'Run `git status`; a value like `#0969DA` gets a colour swatch in issues.',
      },
    ],
  },
  {
    id: 'alerts',
    title: 'Alerts',
    intro:
      'A blockquote whose first line is [!TYPE] renders as a coloured callout with an icon on github.com. Five types, uppercase, one per blockquote; they cannot be nested inside other elements.',
    snippets: [
      {
        label: 'The five alert types',
        syntax: '> [!NOTE]\n> Useful information that users should know.\n\n> [!TIP]\n> Helpful advice for doing things better.\n\n> [!IMPORTANT]\n> Key information users need to succeed.\n\n> [!WARNING]\n> Urgent info to avoid problems.\n\n> [!CAUTION]\n> Risks or negative outcomes of an action.',
        preview: '> **Note**\n> Useful information that users should know.\n\n> **Tip**\n> Helpful advice for doing things better.\n\n> **Important**\n> Key information users need to succeed.\n\n> **Warning**\n> Urgent info to avoid problems.\n\n> **Caution**\n> Risks or negative outcomes of an action.',
        note: 'Outside github.com (and GitLab, which copied the syntax) the text [!NOTE] is shown literally inside a plain blockquote, which is what the preview approximates.',
        more: { href: '/guides/markdown-quote', label: 'Blockquote guide: nesting, attribution, callouts' },
      },
    ],
  },
  {
    id: 'footnotes',
    title: 'Footnotes',
    snippets: [
      {
        label: 'Reference and definition',
        syntax: 'GFM is a superset of CommonMark.[^1]\n\n[^1]: Per the GFM spec, version 0.29-gfm.\n  A second line needs two leading spaces.',
        note: 'Definitions render at the bottom of the page wherever you put them. Not supported in GitHub wikis, and not part of the GFM spec itself.',
        more: { href: '/guides/markdown-footnotes', label: 'Footnotes guide' },
      },
    ],
  },
  {
    id: 'math',
    title: 'Math (LaTeX)',
    snippets: [
      {
        label: 'Inline and block math',
        syntax: 'Inline: $\\sqrt{3x-1}+(1+x)^2$ or $`\\sqrt{3x-1}`$ when the expression clashes with markdown.\n\n$$\n\\left( \\sum_{k=1}^n a_k b_k \\right)^2 \\leq \\left( \\sum_{k=1}^n a_k^2 \\right)\n$$\n\n```math\n\\frac{a}{b}\n```',
        render: false,
        note: 'Rendered with MathJax in issues, discussions, PRs, wikis and .md files. A literal dollar on the same line as math must be written <span>$</span>100; inside math use \\$.',
        more: { href: '/guides/markdown-math', label: 'Math guide' },
      },
    ],
  },
  {
    id: 'diagrams',
    title: 'Mermaid and other diagrams',
    snippets: [
      {
        label: 'Mermaid flowchart',
        syntax: '```mermaid\ngraph TD\n  A[Push] --> B{CI green?}\n  B -->|yes| C[Merge]\n  B -->|no| D[Fix]\n```',
        note: 'GitHub also renders ```geojson and ```topojson as maps and ```stl as a 3D model. Put `info` in a mermaid block to see which Mermaid version GitHub runs.',
        more: { href: '/mermaid-timeline-examples', label: 'Mermaid timeline examples' },
      },
    ],
  },
  {
    id: 'emoji',
    title: 'Emoji shortcodes',
    snippets: [
      {
        label: ':shortcode:',
        syntax: 'Ship it :shipit: :+1: :tada:',
        render: false,
        note: 'Typing : opens an autocomplete on github.com. Shortcodes are a GitHub feature, not markdown — CommonMark renderers print the colons.',
        more: { href: '/markdown-cheat-sheet#emoji', label: 'Emoji on the general cheat sheet' },
      },
    ],
  },
  {
    id: 'html',
    title: 'HTML that GitHub keeps',
    snippets: [
      {
        label: 'Collapsible section',
        syntax: '<details>\n\n<summary>Tips for collapsed sections</summary>\n\nMarkdown **works** here after a blank line.\n\n</details>',
        render: false,
        note: 'Add open to <details open> to start expanded. GitHub filters <script>, <style>, <iframe>, <title>, <textarea>, <xmp>, <noembed>, <noframes> and <plaintext> (the tagfilter extension).',
        more: { href: '/guides/markdown-collapsible-section', label: 'Collapsible section guide' },
      },
      {
        label: 'Hidden comment',
        syntax: '<!-- Reviewers: this paragraph is hidden in the rendered README -->\nVisible text.',
        render: false,
        note: 'Hidden in the rendered page but present in the source — anyone who opens the raw file sees it.',
        more: { href: '/guides/markdown-comment', label: 'Comment guide' },
      },
    ],
  },
  {
    id: 'breaks',
    title: 'Line breaks and escaping',
    snippets: [
      {
        label: 'Line break in a .md file',
        syntax: 'Two trailing spaces  \nor a backslash\\\nor <br/> end a line.',
        preview: 'Two trailing spaces  \nor a backslash\\\nor a br tag end a line.',
        note: 'In issues, PRs and discussions a single newline is already a line break; in .md files it is not, so you need one of the three forms.',
        more: { href: '/guides/markdown-new-line', label: 'New line guide' },
      },
      {
        label: 'Escaping',
        syntax: '\\*not italic\\*, \\#not-a-heading, \\[not a link\\]',
        note: 'A backslash disables the next markdown character. Escaping does not work in issue or PR titles.',
        more: { href: '/guides/markdown-escape-characters', label: 'Escape characters guide' },
      },
    ],
  },
];
