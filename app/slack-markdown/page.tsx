import Link from 'next/link';
import CheatSheet, { SectionNav } from '@/components/CheatSheet';
import { SECTIONS } from '@/lib/platform-sheets/slack-markdown';
import UpdatedLine from '@/components/UpdatedLine';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-11-03';

const SLACK_MARKUP = 'https://slack.com/help/articles/360039953113-Format-your-messages-in-Slack-with-markup';
const SLACK_FORMAT = 'https://slack.com/help/articles/202288908-Format-your-messages';
const SLACK_API = 'https://docs.slack.dev/messaging/formatting-message-text';
const SLACK_CANVAS = 'https://slack.com/help/articles/203950418-Use-a-canvas-in-Slack';
const SLACK_TABLE_BLOCK = 'https://docs.slack.dev/changelog/2025/08/14/block-kit-table-block';

export const metadata = pageMetadata({
  title: 'Slack Formatting Cheat Sheet: mrkdwn vs Markdown',
  description:
    'Does Slack support Markdown? No — mrkdwn: *asterisks* bold, _underscores_ italic, ~tildes~ strike, no headings or tables. Syntax, gaps, table workarounds.',
  path: '/slack-markdown',
  type: 'article',
  kicker: 'Reference',
});

const SUPPORTS_Q = 'Does Slack support Markdown?';
const SUPPORTS_A =
  'No. Slack messages use mrkdwn, which Slack\'s developer documentation describes as "Slack\'s custom text formatting syntax … inspired by markdown, but uses different rules". Bold is *one asterisk*, italic is _underscores_, strikethrough is ~one tilde~; `code`, ```code blocks``` and > quotes match Markdown. There is no syntax for headings, tables, images, horizontal rules or task lists, and in the composer the markup is only interpreted when "Format messages with markup" is enabled in Preferences → Advanced; by default you use the formatting toolbar instead.';

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'How do you make a table in Slack?',
    a: 'Messages have no table formatting: Slack\'s help lists bold, italic, underline, strikethrough, code, block quote, code block and ordered and bulleted lists as the toolbar options, and the markup page adds links. The workarounds are a space-aligned grid inside a code block, a canvas (its toolbar has "Create a table"), a Block Kit table block if an app posts the message (added 14 August 2025), or a link to the rendered table.',
  },
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
        headline: 'Slack formatting cheat sheet: mrkdwn vs Markdown',
        description: metadata.description,
        dateModified: UPDATED,
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: 'https://docs-md.com/slack-markdown',
      },
      {
        '@type': 'FAQPage',
        mainEntity: [{ q: SUPPORTS_Q, a: SUPPORTS_A }, ...FAQ].map((f) => ({
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
          Slack formatting cheat sheet: mrkdwn vs Markdown
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

      <section id="supports-markdown" className="mb-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">{SUPPORTS_Q}</h2>
        <p className="text-base text-gray-600">{SUPPORTS_A}</p>
        <ul className="list-disc space-y-1 pl-5 text-base text-gray-600">
          <li>
            <strong>Bold:</strong> <code className="rounded bg-gray-100 px-1">*text*</code> — one asterisk, where Markdown
            needs two.
          </li>
          <li>
            <strong>Italic:</strong> <code className="rounded bg-gray-100 px-1">_text_</code> — underscores only; single
            asterisks mean bold.
          </li>
          <li>
            <strong>Strikethrough:</strong> <code className="rounded bg-gray-100 px-1">~text~</code> — one tilde; the GFM{' '}
            <code className="rounded bg-gray-100 px-1">~~text~~</code> shows literally.
          </li>
          <li>
            <strong>Same as Markdown:</strong> <code className="rounded bg-gray-100 px-1">`code`</code>,{' '}
            <code className="rounded bg-gray-100 px-1">```blocks```</code> and{' '}
            <code className="rounded bg-gray-100 px-1">&gt;</code> quotes.
          </li>
          <li>
            <strong>Missing:</strong> headings, tables, images, horizontal rules, task lists and, in app-published text, any
            list syntax.
          </li>
        </ul>
      </section>

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

      <section id="tables" className="mt-16 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Tables in Slack</h2>
        <p className="text-gray-700">
          A Markdown table pasted into a Slack message arrives as lines of pipes and dashes. Slack&apos;s{' '}
          <a href={SLACK_FORMAT} className="text-indigo-700 underline" rel="noopener noreferrer">
            formatting help
          </a>{' '}
          lists bold, italic, underline, strikethrough, code, block quote, code block and ordered and
          bulleted lists as the options for messages; neither it nor the{' '}
          <a href={SLACK_MARKUP} className="text-indigo-700 underline" rel="noopener noreferrer">
            markup page
          </a>{' '}
          has a table. Four ways around it:
        </p>
        <ol className="list-decimal space-y-2 pl-5 text-gray-700">
          <li>
            <strong>Code block.</strong> Pad the columns with spaces and wrap the grid in ```; the monospace font keeps the
            columns aligned. Fine for a few rows.
          </li>
          <li>
            <strong>Canvas.</strong> A{' '}
            <a href={SLACK_CANVAS} className="text-indigo-700 underline" rel="noopener noreferrer">
              canvas
            </a>{' '}
            has real tables (&quot;Create a table&quot; in its toolbar) plus headings and checklists; share it in the channel.
          </li>
          <li>
            <strong>Block Kit table block.</strong> Apps and bots can post a structured table since Slack added the{' '}
            <a href={SLACK_TABLE_BLOCK} className="text-indigo-700 underline" rel="noopener noreferrer">
              table block
            </a>{' '}
            on 14 August 2025. Not available from the message composer.
          </li>
          <li>
            <strong>Link to the rendered table.</strong> Paste the Markdown into the{' '}
            <Link href="/" className="text-indigo-700 underline">
              editor
            </Link>{' '}
            and share the link; readers see a real table.
          </li>
        </ol>
        <p className="text-sm text-gray-600">
          Step-by-step with examples:{' '}
          <Link href="/markdown-table-generator/markdown-table-in-discord-and-slack" className="text-indigo-700 underline">
            How do you make a table in Discord or Slack?
          </Link>{' '}
          Build the Markdown first with the{' '}
          <Link href="/markdown-table-generator" className="text-indigo-700 underline">
            table generator
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
