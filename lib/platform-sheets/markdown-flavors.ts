import type { Section } from '@/components/CheatSheet';

// Content of /markdown-flavors, shared by the page and /llms-full.txt.
export const SECTIONS: Section[] = [
  {
    id: 'same-text',
    title: 'The same paragraph in five dialects',
    intro: 'Bold, italic, strikethrough, a link and a code span — written for five platforms. The preview on the right is how a GFM renderer (this site, GitHub) reads each one.',
    snippets: [
      {
        label: 'CommonMark / GFM / Obsidian / Reddit / Jira',
        syntax: '**bold** *italic* ~~struck~~ [docs](https://docs-md.com) `code`',
        note: 'The widest overlap. CommonMark alone lacks ~~strikethrough~~; everything else here is in all five.',
      },
      {
        label: 'Slack mrkdwn',
        syntax: '*bold* _italic_ ~struck~ <https://docs-md.com|docs> `code`',
        preview: '**bold** *italic* ~~struck~~ [docs](https://docs-md.com) `code`',
        note: 'Single markers and <url|text> links. Pasted into GitHub, *bold* becomes italic and the link shows its angle brackets.',
        more: { href: '/slack-markdown', label: 'Slack formatting sheet' },
      },
      {
        label: 'Discord',
        syntax: '**bold** *italic* ~~struck~~ __underlined__ ||spoiler|| [docs](https://docs-md.com) `code`',
        preview: '**bold** *italic* ~~struck~~ **underlined** ▮▮▮▮▮▮▮ [docs](https://docs-md.com) `code`',
        note: '__double underscore__ is underline, not bold; ||spoiler|| is Discord-only. Masked links render in messages; wrap a URL in < > to suppress its embed.',
        more: { href: '/discord-markdown', label: 'Discord formatting sheet' },
      },
      {
        label: 'Telegram MarkdownV2',
        syntax: '*bold* _italic_ ~struck~ __underlined__ ||spoiler|| [docs](https://docs-md.com) `code`\\. Escape \\- \\! \\. outside entities\\.',
        render: false,
        note: 'Single markers like Slack, plus __underline__ and ||spoiler|| like Discord — and every one of _ * [ ] ( ) ~ ` > # + - = | { } . ! must be backslash-escaped in plain text.',
        more: { href: '/telegram-markdown', label: 'Telegram MarkdownV2 sheet' },
      },
      {
        label: 'WhatsApp',
        syntax: '*bold* _italic_ ~struck~ ```monospace``` `inline code`\n> quote\n- bullet\n1. numbered',
        preview: '**bold** *italic* ~~struck~~ `monospace` `inline code`\n> quote\n- bullet\n1. numbered',
        note: 'Single markers; no headings, links are plain URLs, no tables. Three backticks make inline monospace, not a block.',
        more: { href: '/whatsapp-formatting', label: 'WhatsApp formatting sheet' },
      },
    ],
  },
  {
    id: 'rst',
    title: 'reStructuredText vs Markdown',
    intro: 'reST (Sphinx, Python docs) is a different language with the same goals: readable plain text that compiles to HTML. The markers overlap just enough to be confusing.',
    snippets: [
      {
        label: 'The same section in reST',
        syntax: 'Install\n=======\n\nRun ``pip install docs`` then see `the guide <https://docs-md.com>`_.\n\n.. note::\n\n   Directives replace markdown\'s HTML escape hatch.\n\n- *emphasis* and **strong** match markdown\n- literal blocks follow a paragraph ending in ::\n\n::\n\n    indented code',
        render: false,
        note: 'Inline code needs two backticks, links are `text <url>`_, headings are underlined with any punctuation character, and tables are drawn with + - | or = rows. Convert between the two with Pandoc (-f rst -t gfm).',
      },
    ],
  },
];
