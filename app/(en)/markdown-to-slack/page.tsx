import Link from 'next/link';
import MarkdownToDialect from '@/components/tools/MarkdownToDialect';
import SyntaxMappingTable, { type MappingRow } from '@/components/tools/SyntaxMappingTable';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('markdown-to-slack');

const LINK = 'text-indigo-700 underline';

const ROWS: MappingRow[] = [
  { element: 'Bold', markdown: '**bold** or __bold__', target: '*bold*', note: 'Single asterisks. Double asterisks show literally in Slack.' },
  { element: 'Italic', markdown: '*italic* or _italic_', target: '_italic_', note: 'Underscores only.' },
  { element: 'Strikethrough', markdown: '~~gone~~', target: '~gone~', note: 'Single tildes.' },
  { element: 'Inline code', markdown: '`code`', target: '`code`', note: 'Same. No other formatting applies inside.' },
  { element: 'Code block', markdown: '```js\ncode\n```', target: '```\ncode\n```', note: 'Language tag dropped; mrkdwn has no highlighting.' },
  { element: 'Link', markdown: '[text](https://u)', target: '<https://u|text>', note: 'API/Block Kit form. In the composer, paste the bare URL.' },
  { element: 'Heading', markdown: '# Title', target: '*Title*', note: 'No headings in mrkdwn; a bold line stands in (use a header block in Block Kit).' },
  { element: 'Bulleted list', markdown: '- item\n  - nested', target: '• item\n    ◦ nested', note: 'No list syntax in app text; bullet characters and spaces.' },
  { element: 'Numbered list', markdown: '1. item', target: '1. item', note: 'Plain numbered lines.' },
  { element: 'Task item', markdown: '- [x] done', target: '• [x] done', note: 'Checkbox kept as text.' },
  { element: 'Blockquote', markdown: '> quote', target: '> quote', note: 'Same; each line prefixed.' },
  { element: 'Table', markdown: '| a | b |\n|---|---|', target: '```\na  b\n-  -\n```', note: 'No tables; aligned grid in a code block.' },
  { element: 'Image', markdown: '![alt](https://i.png)', target: 'alt: https://i.png', note: 'No inline images; Slack unfurls the URL.' },
  { element: 'Horizontal rule', markdown: '---', target: '———', note: 'No rule in mrkdwn (use a divider block).' },
  { element: 'Line break', markdown: 'two trailing spaces', target: '\\n', note: 'A newline character.' },
  { element: 'HTML', markdown: '<b>x</b>', target: 'x', note: 'Tags stripped; Slack shows HTML literally.' },
  { element: 'Special characters', markdown: '& < >', target: '&amp; &lt; &gt;', note: 'Required in API text; only these three.' },
];

export default function MarkdownToSlackPage() {
  return (
    <ToolPage
      slug="markdown-to-slack"
      intro={
        <>
          Paste standard markdown and get Slack mrkdwn: <code className={CODE}>**bold**</code> becomes{' '}
          <code className={CODE}>*bold*</code>, <code className={CODE}>[text](url)</code> becomes{' '}
          <code className={CODE}>&lt;url|text&gt;</code>, headings turn into bold lines, and tables are laid out as a grid inside a
          code block. Every element Slack cannot express is listed under the output so you know what was approximated. Runs
          in your browser.
        </>
      }
      tool={<MarkdownToDialect dialect="slack" />}
      faq={[
        {
          q: 'Why does **bold** not work in Slack?',
          a: 'Slack uses its own markup called mrkdwn, not CommonMark. Bold is a single pair of asterisks (*bold*), italic a single pair of underscores (_italic_), and strikethrough a single pair of tildes (~strike~). Double asterisks are shown as literal characters.',
        },
        {
          q: 'How do I write a link with custom text in Slack?',
          a: 'In messages sent through the API or Block Kit, write <https://example.com|shown text>. The markdown form [text](url) is not understood. In the message composer there is no text-link syntax at all: paste the bare URL, or select text and use the link button in the toolbar.',
        },
        {
          q: 'Does Slack support headings or tables?',
          a: 'No. mrkdwn has no heading or table syntax. This converter writes a heading as a bold line and a table as a space-aligned grid inside a code block, which keeps the columns readable in a monospace font. In Block Kit you can use a header block for titles.',
        },
        {
          q: 'Why are & < > converted to &amp; &lt; &gt;?',
          a: 'Slack\'s formatting reference requires these three characters to be HTML-escaped in text sent through the API, because < and > delimit links and mentions. Only these three are escaped, nothing else. Switch the target to "Message composer" if you are pasting into the chat box, where the raw characters are fine.',
        },
        {
          q: 'Can I get syntax highlighting in a Slack code block?',
          a: 'No. Slack code blocks are plain monospace with no language tag, so the converter drops the language from fenced blocks and reports it as an approximation. Share a snippet instead if you need highlighting.',
        },
      ]}
    >
      <section className="space-y-3">
        <h2 className={H2}>How does each markdown element map to Slack mrkdwn?</h2>
        <p>
          The table is the exact rule set the converter applies, checked against Slack&apos;s{' '}
          <a href="https://docs.slack.dev/messaging/formatting-message-text" className={LINK} rel="noopener">
            Formatting text for app surfaces
          </a>{' '}
          reference. The full dialect is described on the{' '}
          <Link href="/slack-markdown" className={LINK}>
            Slack markdown cheat sheet
          </Link>
          .
        </p>
        <SyntaxMappingTable target="Slack mrkdwn" rows={ROWS} />
      </section>
      <section className="space-y-3">
        <h2 className={H2}>When should I use the API target and when the composer?</h2>
        <p>
          Choose <em>API / Block Kit</em> when the text goes into a <code className={CODE}>text</code> field of a message
          payload, a webhook, a bot, or a workflow: you get <code className={CODE}>&lt;url|text&gt;</code> links and the
          required escaping of <code className={CODE}>&amp;</code>, <code className={CODE}>&lt;</code> and{' '}
          <code className={CODE}>&gt;</code>. Choose <em>Message composer</em> when you will paste the result into the chat
          box yourself: the composer auto-links bare URLs, shows angle brackets literally, and needs no escaping. Bold,
          italic, strikethrough, code and quotes are identical in both.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>Which markdown features have no Slack equivalent?</h2>
        <p>
          Headings, tables, images, horizontal rules, footnotes, reference-style links, nested-list syntax, and HTML. The
          converter never silently drops content: each of these is rewritten in the closest plain form and reported with
          its line number in the warnings list. If you need the same document in other chat tools, the{' '}
          <Link href="/markdown-to-discord" className={LINK}>
            Discord
          </Link>
          ,{' '}
          <Link href="/markdown-to-jira" className={LINK}>
            Jira
          </Link>{' '}
          and{' '}
          <Link href="/markdown-to-plain-text" className={LINK}>
            plain-text
          </Link>{' '}
          converters apply the same approach, and{' '}
          <Link href="/markdown-flavors" className={LINK}>
            markdown flavors
          </Link>{' '}
          explains why the dialects differ in the first place. The standard syntax is on the{' '}
          <Link href="/markdown-cheat-sheet" className={LINK}>
            markdown cheat sheet
          </Link>
          .
        </p>
      </section>
    </ToolPage>
  );
}
