import Link from 'next/link';
import CheatSheet, { SectionNav, type Section } from '@/components/CheatSheet';
import UpdatedLine from '@/components/UpdatedLine';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-10-15';

const SLACK_MARKUP = 'https://slack.com/help/articles/360039953113-Format-your-messages-in-Slack-with-markup';
const SLACK_FORMAT = 'https://slack.com/help/articles/202288908-Format-your-messages';
const SLACK_API = 'https://docs.slack.dev/messaging/formatting-message-text';

export const metadata = pageMetadata({
  title: 'Slack Markdown — Message Formatting Cheat Sheet',
  description:
    'Slack formatting is not real markdown: *asterisks* bold, _underscores_ italicize, ~tildes~ strike through. Full mrkdwn syntax, gaps, and API differences.',
  path: '/slack-markdown',
  type: 'article',
  kicker: 'Reference',
});

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'Why does pasted markdown break in Slack?',
    a: 'Because Slack\'s mrkdwn uses different characters for the basics: *single asterisks* are bold (so **double asterisks** arrive as a bold word wrapped in stray asterisks), _underscores_ are italic, and ~single tildes~ strike through while ~~double tildes~~ show literally. Headings, tables, images, horizontal rules and task lists have no Slack equivalent at all, so a pasted README degrades to plain text with its # and | characters showing.',
  },
  {
    q: 'Does Slack support markdown links like [text](url)?',
    a: 'In the message composer, yes, but only when "Format messages with markup" is enabled in Preferences > Advanced; Slack\'s markup help page lists [your text](the link) as the link syntax. With the default formatting toolbar you paste a URL or use the link button. In the API (chat.postMessage, Block Kit mrkdwn text) the [text](url) form is not supported: write <https://example.com|shown text> instead.',
  },
  {
    q: 'How do you turn on markup formatting in Slack?',
    a: 'Click your profile picture, open Preferences, choose Advanced, and under Input Options check "Format messages with markup". This hides the formatting toolbar; formatting is then applied after you send, pasted text stays plain, and automatic list formatting is turned off.',
  },
  {
    q: 'How do you share real markdown through Slack?',
    a: 'Three options keep formatting intact: create a text snippet (the + menu, "Create a text snippet", type Markdown), which renders when expanded; share the document as a link, so the full doc renders with code highlighting and tables; or convert it to PDF and upload the file.',
  },
  {
    q: 'Is mrkdwn the same in the Slack API?',
    a: 'The characters are the same (*bold*, _italic_, ~strike~, `code`, ``` blocks, > quotes) but the API is stricter. Links must be written as <url|text>, mentions as <@USER_ID> and <#CHANNEL_ID>, special mentions as <!here> / <!channel>, and the three characters &, < and > must be HTML-escaped as &amp;, &lt; and &gt; in the text you send. Block Kit text objects take "type": "mrkdwn" with the same rules, and there is no list syntax at all in app-published text.',
  },
];

const SECTIONS: Section[] = [
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

const SUPPORT: Array<{ feature: string; slack: string; standard: string }> = [
  { feature: 'Bold', slack: '*text*', standard: '**text**' },
  { feature: 'Italic', slack: '_text_', standard: '*text* or _text_' },
  { feature: 'Strikethrough', slack: '~text~', standard: '~~text~~ (GFM)' },
  { feature: 'Underline', slack: 'Toolbar / Cmd+U only', standard: 'No syntax (HTML <u>)' },
  { feature: 'Inline code', slack: '`text`', standard: '`text`' },
  { feature: 'Code block', slack: '``` (no language tag)', standard: '```lang with highlighting' },
  { feature: 'Block quote', slack: '> text', standard: '> text' },
  { feature: 'Link', slack: '[text](url) in markup mode; <url|text> in the API', standard: '[text](url)' },
  { feature: 'Lists', slack: 'Auto-format on * or 1. + space; none in API', standard: '- item, 1. item' },
  { feature: 'Headings', slack: 'No', standard: '# through ######' },
  { feature: 'Tables', slack: 'No', standard: 'Yes (GFM)' },
  { feature: 'Images ![alt](url)', slack: 'No (upload the file)', standard: 'Yes' },
  { feature: 'Task lists', slack: 'No (use Slack Lists)', standard: '- [ ] item (GFM)' },
  { feature: 'Horizontal rule', slack: 'No', standard: '---' },
  { feature: 'Emoji :shortcode:', slack: 'Yes', standard: 'GitHub only' },
];

export default function SlackMarkdownPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'Slack markdown (mrkdwn) formatting cheat sheet',
        description: metadata.description,
        dateModified: UPDATED,
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: 'https://docs-md.com/slack-markdown',
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
          Slack markdown cheat sheet
        </h1>
        <UpdatedLine date={UPDATED} />
        <p className="mt-4 text-base text-gray-600">
          Slack&apos;s formatting language, officially <em>mrkdwn</em>, looks like markdown but uses
          different characters for the basics. Syntax on the left, what Slack shows on the right.
          Verified against Slack&apos;s{' '}
          <a href={SLACK_MARKUP} className="text-indigo-700 underline" rel="noopener noreferrer">
            markup help page
          </a>
          ,{' '}
          <a href={SLACK_FORMAT} className="text-indigo-700 underline" rel="noopener noreferrer">
            Format your messages
          </a>{' '}
          and the{' '}
          <a href={SLACK_API} className="text-indigo-700 underline" rel="noopener noreferrer">
            API formatting reference
          </a>
          .
        </p>
        <SectionNav sections={SECTIONS} className="no-print mt-5 flex flex-wrap gap-2 text-xs" />
      </div>

      <CheatSheet sections={SECTIONS} />

      <section className="mt-16 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Slack mrkdwn vs standard markdown</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-4 py-2.5 font-semibold text-gray-950">Feature</th>
                <th className="px-4 py-2.5 font-semibold text-gray-950">Slack</th>
                <th className="px-4 py-2.5 font-semibold text-gray-950">Standard / GFM</th>
              </tr>
            </thead>
            <tbody>
              {SUPPORT.map((r) => (
                <tr key={r.feature} className="border-b border-gray-100 align-top">
                  <td className="px-4 py-2.5 font-medium text-gray-900">{r.feature}</td>
                  <td className="px-4 py-2.5 text-gray-700">{r.slack}</td>
                  <td className="px-4 py-2.5 text-gray-700">{r.standard}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600">
          Have a markdown document to post? The{' '}
          <Link href="/markdown-to-slack" className="text-indigo-700 underline">
            markdown to Slack converter
          </Link>{' '}
          swaps the bold, italic and strikethrough markers and flattens what Slack cannot show. The{' '}
          <Link href="/markdown-flavors" className="text-indigo-700 underline">
            markdown flavors comparison
          </Link>{' '}
          puts Slack next to Discord, Notion, Reddit and GitHub.
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
            <Link href="/discord-markdown" className="text-indigo-700 underline">Discord formatting</Link>{' · '}
            <Link href="/telegram-markdown" className="text-indigo-700 underline">Telegram formatting</Link>{' · '}
            <Link href="/whatsapp-formatting" className="text-indigo-700 underline">WhatsApp formatting</Link>{' · '}
            <Link href="/markdown-to-slack" className="text-indigo-700 underline">Markdown to Slack converter</Link>{' · '}
            <Link href="/markdown-to-pdf" className="text-indigo-700 underline">Markdown to PDF</Link>{' · '}
            <Link href="/" className="text-indigo-700 underline">Share markdown as a link</Link>{' · '}
            <Link href="/guides/markdown-underline" className="text-indigo-700 underline">Underline guide</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
