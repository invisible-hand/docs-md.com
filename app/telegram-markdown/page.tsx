import Link from 'next/link';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import CheatSheet, { SectionNav, type Section } from '@/components/CheatSheet';
import UpdatedLine from '@/components/UpdatedLine';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-10-15';
const BOT_API = 'https://core.telegram.org/bots/api#formatting-options';

export const metadata = pageMetadata({
  title: 'Telegram Markdown (MarkdownV2) Cheat Sheet',
  description:
    'Telegram text formatting in the app and in bots: MarkdownV2 syntax, the full escape table, HTML parse-mode equivalents and legacy Markdown differences.',
  path: '/telegram-markdown',
  type: 'article',
  kicker: 'Reference',
});

const FAQ: Array<{ q: string; a: string; href?: { path: string; label: string } }> = [
  {
    q: 'Why does my Telegram bot return "Bad Request: can\'t parse entities"?',
    a: 'In MarkdownV2 every reserved character that is not part of your markup must be escaped with a backslash: _ * [ ] ( ) ~ ` > # + - = | { } . ! — including the period at the end of a sentence and the hyphen in a date. One unescaped "." or "-" is enough to make the whole sendMessage call fail. Escape the text first, then wrap it in markup, or switch parse_mode to HTML, which only needs <, > and & escaped.',
  },
  {
    q: 'What is the difference between Markdown and MarkdownV2 in the Telegram Bot API?',
    a: 'Markdown is the legacy mode: single asterisks for bold, underscores for italic, backticks for code, [text](url) links, no nesting and no underline, strikethrough, spoiler or blockquote. MarkdownV2 adds __underline__, ~strikethrough~, ||spoiler||, >quotes, custom emoji and nested entities, but requires escaping of 18 reserved characters. The Bot API documentation calls Markdown "a legacy mode, retained for backward compatibility".',
  },
  {
    q: 'How do I make text bold, italic or monospace in the Telegram app?',
    a: 'Select the text and use the formatting menu (Bold, Italic, Underline, Strikethrough, Spoiler, Mono, Link, Quote), or type the shortcuts Telegram lists in its own interface strings: **bold**, __italic__, ~~strikethrough~~, `monospace`, ||spoiler|| and [text](url). Note that the app shortcuts are not the same as Bot API MarkdownV2 — the app uses double underscores for italic, while MarkdownV2 uses a single underscore for italic and double underscores for underline.',
  },
  {
    q: 'Should I use MarkdownV2 or HTML for a Telegram bot?',
    a: 'HTML is usually easier for generated text: only <, > and & need escaping (as &lt;, &gt;, &amp;), the tag set is small (b, i, u, s, span class="tg-spoiler", a, code, pre, blockquote, tg-emoji), and the same entities are available as in MarkdownV2. MarkdownV2 is shorter to type by hand but any user-supplied text must be run through an escape function first.',
  },
  {
    q: 'How do I write a code block with a language in a Telegram message?',
    a: 'In MarkdownV2 and legacy Markdown, open a fence with three backticks followed by the language name on the same line (```python), put the code on the following lines, and close with three backticks. In HTML, nest <pre><code class="language-python">…</code></pre>. Inside pre and code entities, backticks and backslashes must be escaped with a backslash.',
  },
  {
    q: 'How do I make an expandable (collapsed) quote in Telegram?',
    a: 'In MarkdownV2, start the first line of the quote with **> (an empty bold entity followed by the quote marker) and end the last line with ||. In HTML use <blockquote expandable>…</blockquote>. Regular quotes are lines starting with > in MarkdownV2 or a <blockquote> tag in HTML. Blockquotes cannot be nested.',
  },
  {
    q: 'Does Telegram support headings, tables or bullet lists?',
    a: 'No. Telegram messages have no heading, table, list or image-embed entities in any parse mode. Typing # Heading or - item sends the characters literally (and in MarkdownV2 the # and - must be escaped). Use bold for titles, plain bullets like • for lists, and a <pre> block for anything column-aligned.',
    href: { path: '/markdown-cheat-sheet', label: 'Standard markdown cheat sheet' },
  },
];

/** Effect → app formatting shortcut → MarkdownV2 → HTML, in one table. */
const EFFECTS: Array<{ effect: string; app: string; v2: string; html: string; note?: string }> = [
  { effect: 'Bold', app: '**bold**', v2: '*bold*', html: '<b>bold</b> or <strong>', note: 'MarkdownV2 uses a single asterisk.' },
  { effect: 'Italic', app: '__italic__', v2: '_italic_', html: '<i>italic</i> or <em>', note: 'In MarkdownV2 double underscore means underline, not italic.' },
  { effect: 'Underline', app: 'menu only', v2: '__underline__', html: '<u>underline</u> or <ins>' },
  { effect: 'Strikethrough', app: '~~strike~~', v2: '~strike~', html: '<s>strike</s>, <strike>, <del>', note: 'MarkdownV2 uses a single tilde.' },
  { effect: 'Spoiler', app: '||spoiler||', v2: '||spoiler||', html: '<span class="tg-spoiler">…</span> or <tg-spoiler>' },
  { effect: 'Inline code', app: '`mono`', v2: '`mono`', html: '<code>mono</code>' },
  { effect: 'Code block', app: 'menu only', v2: '```lang\ncode\n```', html: '<pre><code class="language-lang">code</code></pre>' },
  { effect: 'Link', app: '[text](url)', v2: '[text](https://example.com/)', html: '<a href="https://example.com/">text</a>', note: 'Inside the (…) part, ) and \\ must be escaped.' },
  { effect: 'Mention by id', app: '—', v2: '[name](tg://user?id=123456789)', html: '<a href="tg://user?id=123456789">name</a>' },
  { effect: 'Quote', app: 'menu only', v2: '>line one\n>line two', html: '<blockquote>…</blockquote>', note: 'Every quoted line starts with >.' },
  { effect: 'Expandable quote', app: 'menu only', v2: '**>first line\n>last line||', html: '<blockquote expandable>…</blockquote>' },
  { effect: 'Custom emoji', app: 'premium picker', v2: '![👍](tg://emoji?id=5368324170671202286)', html: '<tg-emoji emoji-id="5368324170671202286">👍</tg-emoji>', note: 'Bots need a Fragment username or a Premium owner to send these.' },
];

/** The 18 characters that must be escaped outside entities in MarkdownV2. */
const ESCAPES: Array<{ ch: string; where: string }> = [
  { ch: '_', where: 'Everywhere outside markup' },
  { ch: '*', where: 'Everywhere outside markup' },
  { ch: '[', where: 'Everywhere outside markup' },
  { ch: ']', where: 'Everywhere outside markup' },
  { ch: '(', where: 'Everywhere outside markup' },
  { ch: ')', where: 'Everywhere outside markup; also inside a link URL' },
  { ch: '~', where: 'Everywhere outside markup' },
  { ch: '`', where: 'Everywhere outside markup; also inside pre and code' },
  { ch: '>', where: 'Everywhere outside markup' },
  { ch: '#', where: 'Everywhere outside markup' },
  { ch: '+', where: 'Everywhere outside markup' },
  { ch: '-', where: 'Everywhere outside markup' },
  { ch: '=', where: 'Everywhere outside markup' },
  { ch: '|', where: 'Everywhere outside markup' },
  { ch: '{', where: 'Everywhere outside markup' },
  { ch: '}', where: 'Everywhere outside markup' },
  { ch: '.', where: 'Everywhere outside markup' },
  { ch: '!', where: 'Everywhere outside markup' },
  { ch: '\\', where: 'Everywhere (it is the escape character itself); also inside pre, code and link URLs' },
];

const SECTIONS: Section[] = [
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

function EffectsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-300 text-left">
            <th className="py-2 pr-4 font-semibold text-gray-950">Effect</th>
            <th className="py-2 pr-4 font-semibold text-gray-950">App shortcut</th>
            <th className="py-2 pr-4 font-semibold text-gray-950">MarkdownV2</th>
            <th className="py-2 pr-4 font-semibold text-gray-950">HTML</th>
            <th className="py-2 font-semibold text-gray-950">Notes</th>
          </tr>
        </thead>
        <tbody>
          {EFFECTS.map((r) => (
            <tr key={r.effect} className="border-b border-gray-100 align-top">
              <td className="py-2.5 pr-4 font-medium text-gray-900">{r.effect}</td>
              <td className="py-2.5 pr-4"><code className="whitespace-pre rounded bg-gray-100 px-1.5 py-0.5">{r.app}</code></td>
              <td className="py-2.5 pr-4"><code className="whitespace-pre rounded bg-gray-100 px-1.5 py-0.5">{r.v2}</code></td>
              <td className="py-2.5 pr-4"><code className="whitespace-pre rounded bg-gray-100 px-1.5 py-0.5">{r.html}</code></td>
              <td className="py-2.5 text-gray-600">{r.note ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EscapeTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-300 text-left">
            <th className="py-2 pr-4 font-semibold text-gray-950">Character</th>
            <th className="py-2 pr-4 font-semibold text-gray-950">Write</th>
            <th className="py-2 font-semibold text-gray-950">Where it must be escaped</th>
          </tr>
        </thead>
        <tbody>
          {ESCAPES.map((r) => (
            <tr key={r.ch} className="border-b border-gray-100 align-top">
              <td className="py-2 pr-4"><code className="rounded bg-gray-100 px-1.5 py-0.5">{r.ch}</code></td>
              <td className="py-2 pr-4"><code className="rounded bg-gray-100 px-1.5 py-0.5">{'\\' + r.ch}</code></td>
              <td className="py-2 text-gray-600">{r.where}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TelegramMarkdownPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'Telegram markdown (MarkdownV2) cheat sheet',
        description: metadata.description,
        dateModified: UPDATED,
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: 'https://docs-md.com/telegram-markdown',
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-10 max-w-3xl">
        <div className="flex items-start gap-4">
          <ToolIconTile slug="telegram-markdown" size="lg" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
              Telegram markdown (MarkdownV2) cheat sheet
            </h1>
            <UpdatedLine date={UPDATED} />
          </div>
        </div>
        <p className="mt-4 text-base text-gray-600">
          Telegram has three different formatting syntaxes: the shortcuts you type in the app
          (<code className="rounded bg-gray-100 px-1 text-sm">**bold**</code>,{' '}
          <code className="rounded bg-gray-100 px-1 text-sm">__italic__</code>), the Bot API&apos;s{' '}
          <strong>MarkdownV2</strong> (<code className="rounded bg-gray-100 px-1 text-sm">*bold*</code>,{' '}
          <code className="rounded bg-gray-100 px-1 text-sm">_italic_</code>, 18 characters that must be
          backslash-escaped) and the Bot API&apos;s <strong>HTML</strong> mode. None of them is GitHub
          markdown: there are no headings, lists, tables or images. Every snippet below is taken from the{' '}
          <a href={BOT_API} className="text-indigo-700 underline" rel="noopener">
            Bot API formatting options
          </a>{' '}
          and Telegram&apos;s own app strings.
        </p>
        <SectionNav sections={SECTIONS} />
      </div>

      <section className="mb-12 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Telegram formatting at a glance</h2>
        <EffectsTable />
      </section>

      <CheatSheet sections={SECTIONS} />

      <section id="escape-table" className="mt-12 scroll-mt-8 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">MarkdownV2 escape table</h2>
        <p className="max-w-3xl text-base text-gray-600">
          From the Bot API docs: &quot;In all other places characters &apos;_&apos;, &apos;*&apos;, &apos;[&apos;,
          &apos;]&apos;, &apos;(&apos;, &apos;)&apos;, &apos;~&apos;, &apos;`&apos;, &apos;&gt;&apos;, &apos;#&apos;,
          &apos;+&apos;, &apos;-&apos;, &apos;=&apos;, &apos;|&apos;, &apos;{'{'}&apos;, &apos;{'}'}&apos;,
          &apos;.&apos;, &apos;!&apos; must be escaped with the preceding character &apos;\&apos;.&quot;
        </p>
        <EscapeTable />
        <p className="max-w-3xl text-sm text-gray-600">
          A minimal escape function replaces each of those characters with a backslash plus the character, in one
          regular expression, before you add any markup: <code className="rounded bg-gray-100 px-1.5 py-0.5">text.replace(/[_*[\]()~`&gt;#+\-=|{'{}'}.!\\]/g, &apos;\\$&amp;&apos;)</code>.
        </p>
      </section>

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        {FAQ.map((f) => (
          <section key={f.q} className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-950">{f.q}</h2>
            <p>{f.a}</p>
            {f.href ? (
              <p>
                <Link href={f.href.path} className="text-indigo-700 underline">
                  {f.href.label} →
                </Link>
              </p>
            ) : null}
          </section>
        ))}

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">Related</h2>
          <p className="text-sm text-gray-600">
            <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">Markdown cheat sheet</Link>{' · '}
            <Link href="/whatsapp-formatting" className="text-indigo-700 underline">WhatsApp formatting</Link>{' · '}
            <Link href="/discord-markdown" className="text-indigo-700 underline">Discord markdown</Link>{' · '}
            <Link href="/slack-markdown" className="text-indigo-700 underline">Slack formatting</Link>{' · '}
            <Link href="/guides/markdown-escape-characters" className="text-indigo-700 underline">Escape characters guide</Link>{' · '}
            <Link href="/guides/markdown-code-block" className="text-indigo-700 underline">Code block guide</Link>{' · '}
            <Link href="/guides/markdown-quote" className="text-indigo-700 underline">Blockquote guide</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
