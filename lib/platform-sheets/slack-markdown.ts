import type { Section } from '@/components/CheatSheet';

// Content of /slack-markdown, shared by the page and /llms-full.txt.
export const SECTIONS: Section[] = [
  {
    id: 'text',
    title: 'Text formatting',
    intro: 'Slack\'s formatting language is called mrkdwn. It looks like markdown but swaps the characters for bold, italic and strikethrough. The right column shows what Slack displays.',
    snippets: [
      {
        label: 'Bold',
        syntax: '*bold*',
        preview: '**bold**',
        note: 'Single asterisks. Standard markdown\'s **double asterisks** show up as a bold word with a stray asterisk on each side.',
        more: { href: '/guides/markdown-bold-italic', label: 'Bold and italic in standard markdown' },
      },
      {
        label: 'Italic',
        syntax: '_italic_',
        preview: '*italic*',
        note: 'Underscores only. *single asterisks* mean bold in Slack, not italic.',
      },
      {
        label: 'Strikethrough',
        syntax: '~strikethrough~',
        preview: '~~strikethrough~~',
        note: 'Single tildes. The ~~double tilde~~ of GitHub Flavored Markdown is shown literally.',
        more: { href: '/guides/markdown-strikethrough', label: 'Strikethrough guide' },
      },
      {
        label: 'Combined',
        syntax: '*_bold italic_* and ~*bold strike*~',
        preview: '***bold italic*** and ~~**bold strike**~~',
        note: 'Nest the markers; the outer pair must close in reverse order. There is no markup for underline: use the toolbar or Cmd/Ctrl+U.',
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
        note: 'Single backticks. Nothing inside is formatted, which makes backticks the easiest way to show *asterisks* literally.',
      },
      {
        label: 'Code block',
        syntax: '```\nconst answer = 42;\nconsole.log(answer);\n```',
        note: 'Three backticks. No language tag and no syntax highlighting in messages; a ```js tag is treated as part of the code. For highlighted code, create a text snippet instead.',
        more: { href: '/guides/markdown-code-block', label: 'Code block guide' },
      },
    ],
  },
  {
    id: 'quotes-lists',
    title: 'Quotes and lists',
    snippets: [
      {
        label: 'Block quote',
        syntax: '> quoted line\n> second quoted line',
        note: 'An angle bracket at the start of each line. Slack\'s markup page writes it without a space (>text); both forms work in the composer.',
        more: { href: '/guides/markdown-quote', label: 'Blockquote guide' },
      },
      {
        label: 'Bulleted and numbered lists',
        syntax: '* first item (type * then space)\n1. first step (type 1. then space)',
        preview: '- first item (type * then space)\n\n1. first step (type 1. then space)',
        render: true,
        note: 'With the default toolbar, typing * or 1. followed by a space starts an auto-formatted list; indent with Tab. With markup mode on, auto-formatting is off and there is no list syntax: type the bullet character or hyphen yourself. The API has no list syntax either.',
        more: { href: '/guides/markdown-bullet-points', label: 'Bullet points guide' },
      },
    ],
  },
  {
    id: 'links',
    title: 'Links, mentions and emoji',
    snippets: [
      {
        label: 'Link in the composer (markup mode)',
        syntax: '[shown text](https://docs-md.com)',
        note: 'Works in the composer only when "Format messages with markup" is on. Otherwise paste the URL (auto-linked) or use the toolbar link button.',
        more: { href: '/guides/markdown-link', label: 'Link guide' },
      },
      {
        label: 'Link in the API',
        syntax: '<https://docs-md.com|shown text>\n<mailto:hello@example.com|Email us>',
        render: false,
        note: 'API-only form for chat.postMessage and Block Kit mrkdwn text. The [text](url) form is not supported there and arrives as plain text.',
      },
      {
        label: 'Mentions',
        syntax: 'In the composer: @name  #channel  @here  @channel\nIn the API: <@U012AB3CD>  <#C123ABC456>  <!here>  <!channel>  <!subteam^ID>',
        render: false,
        note: 'Type the @ or # and pick from the autocomplete. Apps must send the ID form; plain @name in API text does not notify anyone.',
      },
      {
        label: 'Emoji',
        syntax: 'Shipped :tada: :rocket:',
        render: false,
        note: 'Shortcodes expand in the composer and the API. Unicode emoji pasted directly also work; the API converts them to the colon form.',
        more: { href: '/guides/markdown-emoji', label: 'Emoji shortcode guide' },
      },
    ],
  },
  {
    id: 'api',
    title: 'API-only mrkdwn',
    snippets: [
      {
        label: 'Escaping & < > in API text',
        syntax: 'Tom &amp; Jerry: 3 &lt; 5 &gt; 1',
        render: false,
        note: 'Because the API uses < > for links and mentions, these three characters must be sent as &amp; &lt; &gt;. Only escape those three, not the whole message.',
      },
      {
        label: 'Localised dates',
        syntax: '<!date^1760486400^{date_short} at {time}|Oct 15 2026 at 00:00 UTC>',
        render: false,
        note: 'Renders the timestamp in each reader\'s timezone; the text after | is the fallback. Tokens include {date_num}, {date_short}, {date_long}, {time}, {time_secs} and {ago}.',
      },
    ],
  },
];
