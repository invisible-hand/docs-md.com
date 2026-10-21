import type { Section } from '@/components/CheatSheet';

export const BOT_API = 'https://core.telegram.org/bots/api#formatting-options';

// Content of /telegram-markdown, shared by the page and /llms-full.txt.
export const SECTIONS: Section[] = [
  {
    id: 'app',
    title: 'Formatting in the Telegram app',
    intro:
      'Telegram apps (iOS, Android, Desktop, Web) format text through the selection menu, and also recognise a handful of typed shortcuts. The shortcuts are listed in Telegram’s own interface strings; they are not the same as the Bot API syntax further down.',
    snippets: [
      {
        label: 'Typed shortcuts the app converts as you send',
        syntax: '**bold** __italic__ ~~strikethrough~~ `monospace` ||spoiler|| [text](https://example.com)',
        preview: '**bold** *italic* ~~strikethrough~~ `monospace` *spoiler (hidden until tapped)* [text](https://example.com)',
        note: 'Double underscores are italic in the app but underline in Bot API MarkdownV2 — the single most common mix-up when people move from chatting to bot code.',
      },
      {
        label: 'Only in the menu',
        syntax: 'Select text → Underline, Quote, Spoiler, Code block (with language), Link',
        render: false,
        note: 'There is no typed shortcut for underline, quotes or language-tagged code blocks in the app; select the text and use the formatting menu.',
      },
    ],
  },
  {
    id: 'markdownv2',
    title: 'Bot API: MarkdownV2',
    intro: 'Pass parse_mode = "MarkdownV2" with sendMessage. Entities can be nested (bold inside italic inside spoiler), but pre/code cannot contain other entities and blockquotes cannot be nested.',
    snippets: [
      {
        label: 'Inline styles',
        syntax: '*bold* _italic_ __underline__ ~strikethrough~ ||spoiler|| `inline code`',
        preview: '**bold** *italic* <u>underline</u> ~~strikethrough~~ *spoiler* `inline code`',
        note: 'Single asterisk is bold, single underscore is italic, double underscore is underline, single tilde is strikethrough — four of these differ from GitHub markdown.',
      },
      {
        label: 'Nesting',
        syntax: '*bold _italic bold ~italic bold strikethrough ||italic bold strikethrough spoiler||~ __underline italic bold___ bold*',
        render: false,
        note: 'The official example from the Bot API docs; note the ___ at the end is underline-close plus italic-close, which works only because underline is parsed greedily left to right.',
      },
      {
        label: 'Italic + underline needs an empty bold separator',
        syntax: '___italic underline_**__',
        render: false,
        note: 'Because __ is always read as underline, ___text___ is ambiguous; the docs tell you to insert an empty bold entity (**) between the closing _ and __.',
      },
      {
        label: 'Links and mentions',
        syntax: '[inline URL](http://www.example.com/)\n[inline mention of a user](tg://user?id=123456789)',
        preview: '[inline URL](http://www.example.com/)\n[inline mention of a user](#)',
        note: 'Inside the (...) part, every ) and \\ must be escaped; tg://user?id= links only work in inline links and inline keyboard buttons.',
      },
      {
        label: 'Code and pre blocks',
        syntax: '`inline fixed-width code`\n```\npre-formatted fixed-width code block\n```\n```python\nprint("hello")\n```',
        note: 'Inside pre and code entities, all ` and \\ characters must be escaped; nothing else needs escaping there.',
      },
      {
        label: 'Block quotation',
        syntax: '>Block quotation started\n>Block quotation continued\n>The last line of the block quotation',
        preview: '> Block quotation started\n> Block quotation continued\n> The last line of the block quotation',
        note: 'Each line of the quote starts with >; a > anywhere else in the message must be escaped as \\>.',
      },
      {
        label: 'Expandable block quotation',
        syntax: '**>The expandable block quotation started\n>Expandable block quotation continued\n>Hidden by default part\n>The last line with the expandability mark||',
        render: false,
        note: 'Starts with an empty bold entity (**) before the first >, and ends with || on the last line; clients show the first lines and a "show more" control.',
      },
      {
        label: 'Escaping reserved characters',
        syntax: 'Order \\#42 costs 9\\.99 \\(incl\\. VAT\\) \\- ships 2026\\-10\\-15\\!',
        render: false,
        note: 'Any character with code 1–126 can be escaped with a preceding backslash; the 18 characters in the table below MUST be escaped whenever they are not part of markup.',
      },
    ],
    more: [{ href: BOT_API, label: 'Bot API: formatting options (official)' }],
  },
  {
    id: 'html',
    title: 'Bot API: HTML parse mode',
    intro: 'Pass parse_mode = "HTML". Only the tags below are supported, and every <, > and & that is not part of a tag must become &lt;, &gt; and &amp;. Only four named entities are recognised: &lt; &gt; &amp; &quot; (numeric entities all work).',
    snippets: [
      {
        label: 'All supported tags',
        syntax: '<b>bold</b> <strong>bold</strong>\n<i>italic</i> <em>italic</em>\n<u>underline</u> <ins>underline</ins>\n<s>strike</s> <strike>strike</strike> <del>strike</del>\n<span class="tg-spoiler">spoiler</span> <tg-spoiler>spoiler</tg-spoiler>\n<a href="http://www.example.com/">inline URL</a>\n<a href="tg://user?id=123456789">inline mention of a user</a>\n<tg-emoji emoji-id="5368324170671202286">👍</tg-emoji>\n<code>inline fixed-width code</code>\n<pre>pre-formatted fixed-width code block</pre>\n<pre><code class="language-python">pre-formatted code in Python</code></pre>\n<blockquote>Block quotation</blockquote>\n<blockquote expandable>Expandable block quotation</blockquote>',
        render: false,
        note: 'A language can only be set with nested <pre><code class="language-xxx">; a standalone <code> tag cannot carry a language.',
      },
      {
        label: 'Escaping user text for HTML mode',
        syntax: 'if a &lt; b &amp;&amp; b &gt; c',
        render: false,
        note: 'Three replacements (& first, then < and >) are all that is needed, which is why HTML mode is the safer choice for programmatically built messages.',
      },
    ],
  },
  {
    id: 'legacy',
    title: 'Legacy Markdown (parse_mode = "Markdown")',
    intro: 'Kept for backward compatibility. Same bold/italic/code/link syntax as MarkdownV2 but no underline, strikethrough, spoiler, blockquote, custom emoji — and no nesting.',
    snippets: [
      {
        label: 'Everything legacy Markdown can do',
        syntax: '*bold text*\n_italic text_\n[inline URL](http://www.example.com/)\n[inline mention of a user](tg://user?id=123456789)\n`inline fixed-width code`\n```python\npre-formatted fixed-width code block\n```',
        preview: '**bold text**\n*italic text*\n[inline URL](http://www.example.com/)\n[inline mention of a user](#)\n`inline fixed-width code`\n```python\npre-formatted fixed-width code block\n```',
        note: 'Only _ * ` [ need escaping outside entities; escaping inside an entity is not allowed, so for italic snake_case the docs say to close and reopen: _snake_\\__case_.',
      },
    ],
  },
];
