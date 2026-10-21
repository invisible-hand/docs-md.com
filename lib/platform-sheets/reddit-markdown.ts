import type { Section } from '@/components/CheatSheet';

// Content of /reddit-markdown, shared by the page and /llms-full.txt.
export const SECTIONS: Section[] = [
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
