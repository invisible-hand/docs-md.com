import type { Section } from '@/components/CheatSheet';

// Content of /discord-markdown, shared by the page and /llms-full.txt.
export const SECTIONS: Section[] = [
  {
    id: 'text',
    title: 'Text formatting',
    snippets: [
      {
        label: 'Italic, bold, bold italic',
        syntax: '*italic* or _italic_\n**bold**\n***bold italic***',
        preview: '*italic* or _italic_\\\n**bold**\\\n***bold italic***',
        note: 'Same as standard markdown. Discord lets these stack with underline: __*underline italics*__, __**underline bold**__, __***all three***__.',
      },
      {
        label: 'Underline',
        syntax: '__underline__',
        render: false,
        note: 'Discord-only. In GitHub, Slack and most other renderers __double underscores__ mean bold, so do not paste Discord text elsewhere expecting an underline.',
        more: { href: '/guides/markdown-underline', label: 'Underline in other markdown flavors' },
      },
      {
        label: 'Strikethrough',
        syntax: '~~strikethrough~~',
        note: 'Two tildes on each side, the same as GitHub Flavored Markdown.',
      },
      {
        label: 'Spoiler',
        syntax: '||hidden until clicked||',
        render: false,
        note: 'Discord-only. Two pipes on each side hide the text behind a grey box; readers click to reveal. Spoilers inside a code block are not hidden. Wrapping a URL in || also spoilers its embed.',
      },
    ],
  },
  {
    id: 'structure',
    title: 'Headers, subtext and quotes',
    snippets: [
      {
        label: 'Headers (three levels)',
        syntax: '# Big header\n## Smaller header\n### Smallest header',
        render: false,
        note: 'Only #, ## and ### exist. The hash must be the first character on the line and needs a space after it. #### and deeper show as literal text.',
      },
      {
        label: 'Subtext',
        syntax: '-# This line is small and grey',
        render: false,
        note: 'Discord-only: a dimmed, smaller line, the opposite of a header. -# must be at the very start of the line with a space after it.',
      },
      {
        label: 'Single-line and multi-line quotes',
        syntax: '> Quotes one line\n\n>>> Quotes every line\nuntil the end of the message',
        preview: '> Quotes one line\n\n> Quotes every line\n> until the end of the message',
        note: '> quotes the current line only; >>> starts a quote that runs to the end of the message. Both need a space after the angle bracket(s).',
        more: { href: '/guides/markdown-quote', label: 'Blockquote guide' },
      },
    ],
  },
  {
    id: 'lists',
    title: 'Lists',
    snippets: [
      {
        label: 'Bulleted and numbered lists',
        syntax: '- First item\n- Second item\n  - Indented with 2 spaces\n* Asterisks work too\n\n1. Step one\n2. Step two',
        note: 'Bullets take - or *; numbers take 1. and so on. Indent a nested item with two spaces. A space after the marker is required. There are no task-list checkboxes on Discord.',
        more: { href: '/guides/markdown-nested-list', label: 'Nested list guide' },
      },
    ],
  },
  {
    id: 'code',
    title: 'Code',
    snippets: [
      {
        label: 'Inline code',
        syntax: 'Run `npm install` first.',
        note: 'Single backticks. Formatting characters inside show literally, which makes inline code a handy way to escape markdown.',
      },
      {
        label: 'Code block with syntax highlighting',
        syntax: '```js\nconst answer = 42;\nconsole.log(answer);\n```',
        note: 'Three backticks on their own lines. A language name right after the opening fence (js, py, css, json, diff, ...) turns on highlighting. Spoilers and all other formatting are disabled inside.',
        more: { href: '/guides/markdown-code-block', label: 'Code block guide' },
      },
    ],
  },
  {
    id: 'links',
    title: 'Links and embeds',
    snippets: [
      {
        label: 'Masked link',
        syntax: 'Read the [formatting docs](https://docs-md.com/markdown-cheat-sheet)',
        note: 'Standard [text](url) syntax; Discord calls it a masked link. Masked links show a warning dialog when clicked in some contexts.',
      },
      {
        label: 'Plain URL without an embed',
        syntax: 'No preview card: <https://docs-md.com>',
        render: false,
        note: 'A bare URL is auto-linked and usually generates an embed preview. Wrap it in angle brackets to keep the link but suppress the embed.',
      },
    ],
  },
  {
    id: 'mentions-timestamps',
    title: 'Mentions, emoji and timestamps',
    snippets: [
      {
        label: 'Timestamps in the reader\'s timezone',
        syntax: '<t:1760486400:F>  full date and time\n<t:1760486400:R>  relative (e.g. "in 2 days")\n<t:1760486400:d>  short date',
        render: false,
        note: 'Discord-only. The number is Unix seconds. Styles: t short time, T medium time, d short date, D long date, f long date + short time (default), F full date + short time, R relative. Each reader sees their own timezone and locale.',
      },
      {
        label: 'Mentions and custom emoji (bots and the API)',
        syntax: '<@USER_ID>  <#CHANNEL_ID>  <@&ROLE_ID>  <:emoji_name:EMOJI_ID>',
        render: false,
        note: 'This is the raw form the Discord API uses; in the chat box you type @name, #channel or :emoji_name: and Discord inserts these for you. Unicode emoji and :shortcodes: like :tada: both work in messages.',
        more: { href: '/guides/markdown-emoji', label: 'Emoji shortcode guide' },
      },
    ],
  },
  {
    id: 'escaping',
    title: 'Escaping',
    snippets: [
      {
        label: 'Show markdown characters literally',
        syntax: '\\*not italic\\* and \\_\\_not underlined\\_\\_ and \\|\\|not a spoiler\\|\\|',
        note: 'A backslash before any formatting character prints it as-is. Inline code and code blocks also disable formatting.',
        more: { href: '/guides/markdown-escape-characters', label: 'Escape characters guide' },
      },
    ],
  },
];
