import Link from 'next/link';
import CheatSheet, { SectionNav, type Section } from '@/components/CheatSheet';
import UpdatedLine from '@/components/UpdatedLine';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-10-15';

const DISCORD_DOCS = 'https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline';
const DISCORD_SPOILERS = 'https://support.discord.com/hc/en-us/articles/360022320632-Spoiler-Tags';
const DISCORD_DEV = 'https://docs.discord.com/developers/reference';

export const metadata = pageMetadata({
  title: 'Discord Markdown — Text Formatting Cheat Sheet',
  description:
    'Every Discord text format with the syntax and rendered result: bold, italic, underline, strikethrough, spoilers, headers, subtext, lists, quotes, code blocks, masked links, timestamps.',
  path: '/discord-markdown',
  type: 'article',
  kicker: 'Reference',
});

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'How is Discord markdown different from standard markdown?',
    a: 'Three things differ. Double underscores (__text__) underline on Discord but mean bold in standard markdown. Discord adds its own syntax: ||spoilers||, -# subtext, and <t:unix:STYLE> timestamps. And several standard features do not exist in messages at all: tables, task-list checkboxes, images via ![alt](url), horizontal rules, and headings below ###. Everything else (bold, italic, strikethrough, lists, quotes, code, links) works as it does elsewhere.',
  },
  {
    q: 'How do you show markdown characters literally in Discord?',
    a: 'Escape the character with a backslash: \\*not italic\\* shows the asterisks. Inline code (`like this`) also displays everything inside it literally, and code blocks turn off all formatting including spoilers. To stop a URL from generating an embed preview, wrap it in angle brackets: <https://example.com>.',
  },
  {
    q: 'Does Discord support tables, images or checkboxes?',
    a: 'No. Pipe tables, ![alt](url) images and - [ ] task lists are not part of Discord markdown; they show as plain text. Paste images as attachments instead, and share tables as a code block (monospace keeps the columns aligned) or as a link to a rendered document.',
  },
  {
    q: 'How do you make a multi-line quote in Discord?',
    a: 'Put >>> followed by a space before the first line and everything after it in the same message becomes one quote block. A single > quotes only that line. In both cases the space after the angle bracket is required.',
  },
  {
    q: 'How do Discord timestamps work?',
    a: 'Type <t:UNIX_SECONDS:STYLE> and every reader sees the moment in their own timezone and locale. The style letter picks the format: t short time, T medium time, d short date, D long date, f long date and short time (the default), F full date and short time, R relative ("in 3 hours").',
  },
];

const SECTIONS: Section[] = [
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

const SUPPORT: Array<{ feature: string; discord: string; standard: string }> = [
  { feature: 'Bold / italic / strikethrough', discord: 'Yes', standard: 'Yes' },
  { feature: 'Underline', discord: '__text__', standard: 'No syntax (HTML <u> on GitHub)' },
  { feature: 'Spoiler', discord: '||text||', standard: 'No' },
  { feature: 'Headers', discord: '#, ##, ### only', standard: '# through ######' },
  { feature: 'Subtext', discord: '-# text', standard: 'No' },
  { feature: 'Multi-line quote', discord: '>>> text', standard: '> on every line' },
  { feature: 'Code blocks with highlighting', discord: 'Yes', standard: 'Yes (GFM)' },
  { feature: 'Lists, nested lists', discord: 'Yes (2-space indent)', standard: 'Yes' },
  { feature: 'Task-list checkboxes', discord: 'No', standard: 'Yes (GFM)' },
  { feature: 'Tables', discord: 'No', standard: 'Yes (GFM)' },
  { feature: 'Images ![alt](url)', discord: 'No (attach the file)', standard: 'Yes' },
  { feature: 'Horizontal rule ---', discord: 'No', standard: 'Yes' },
  { feature: 'Timestamps <t:unix:STYLE>', discord: 'Yes', standard: 'No' },
];

export default function DiscordMarkdownPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'Discord markdown formatting cheat sheet',
        description: metadata.description,
        dateModified: UPDATED,
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: 'https://docs-md.com/discord-markdown',
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
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
          Discord markdown cheat sheet
        </h1>
        <UpdatedLine date={UPDATED} />
        <p className="mt-4 text-base text-gray-600">
          Discord uses a dialect of markdown: most of the standard syntax, plus underline, spoilers,
          subtext and timestamps of its own, minus tables, images and checkboxes. Syntax on the left,
          what Discord shows on the right (approximated with a standard renderer where Discord-only
          features have no equivalent). Verified against Discord&apos;s{' '}
          <a href={DISCORD_DOCS} className="text-indigo-700 underline" rel="noopener noreferrer">
            Markdown Text 101
          </a>
          ,{' '}
          <a href={DISCORD_SPOILERS} className="text-indigo-700 underline" rel="noopener noreferrer">
            Spoiler Tags
          </a>{' '}
          and{' '}
          <a href={DISCORD_DEV} className="text-indigo-700 underline" rel="noopener noreferrer">
            developer reference
          </a>
          .
        </p>
        <SectionNav sections={SECTIONS} className="no-print mt-5 flex flex-wrap gap-2 text-xs" />
      </div>

      <CheatSheet sections={SECTIONS} />

      <section className="mt-16 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">What works on Discord vs standard markdown</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-4 py-2.5 font-semibold text-gray-950">Feature</th>
                <th className="px-4 py-2.5 font-semibold text-gray-950">Discord</th>
                <th className="px-4 py-2.5 font-semibold text-gray-950">Standard / GFM</th>
              </tr>
            </thead>
            <tbody>
              {SUPPORT.map((r) => (
                <tr key={r.feature} className="border-b border-gray-100 align-top">
                  <td className="px-4 py-2.5 font-medium text-gray-900">{r.feature}</td>
                  <td className="px-4 py-2.5 text-gray-700">{r.discord}</td>
                  <td className="px-4 py-2.5 text-gray-700">{r.standard}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600">
          Converting a document for a Discord message? The{' '}
          <Link href="/markdown-to-discord" className="text-indigo-700 underline">
            markdown to Discord converter
          </Link>{' '}
          rewrites underline, strips tables and images, and warns about anything that will not render.
          See how Discord compares with Slack, Notion, Reddit and others in the{' '}
          <Link href="/markdown-flavors" className="text-indigo-700 underline">
            markdown flavors comparison
          </Link>
          .
        </p>
      </section>

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        {FAQ.map((f) => (
          <section key={f.q} className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-950">{f.q}</h2>
            <p>{f.a}</p>
          </section>
        ))}

        <section className="no-print space-y-3 rounded-2xl bg-indigo-50 p-6">
          <h2 className="text-xl font-semibold text-gray-950">Related</h2>
          <p className="text-sm">
            <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">Full markdown cheat sheet</Link>{' · '}
            <Link href="/slack-markdown" className="text-indigo-700 underline">Slack formatting</Link>{' · '}
            <Link href="/telegram-markdown" className="text-indigo-700 underline">Telegram formatting</Link>{' · '}
            <Link href="/whatsapp-formatting" className="text-indigo-700 underline">WhatsApp formatting</Link>{' · '}
            <Link href="/markdown-to-discord" className="text-indigo-700 underline">Markdown to Discord converter</Link>{' · '}
            <Link href="/guides/markdown-strikethrough" className="text-indigo-700 underline">Strikethrough guide</Link>{' · '}
            <Link href="/guides/markdown-underline" className="text-indigo-700 underline">Underline guide</Link>{' · '}
            <Link href="/guides/markdown-quote" className="text-indigo-700 underline">Blockquote guide</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
