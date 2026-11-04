import Link from 'next/link';
import MarkdownToDialect from '@/components/tools/MarkdownToDialect';
import SyntaxMappingTable, { type MappingRow } from '@/components/tools/SyntaxMappingTable';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('markdown-to-discord');

const LINK = 'text-indigo-700 underline';

const ROWS: MappingRow[] = [
  { element: 'Bold', markdown: '**bold** or __bold__', target: '**bold**', note: 'In Discord, __text__ is underline, so markdown __bold__ is rewritten as **bold**.' },
  { element: 'Italic', markdown: '*italic* or _italic_', target: '*italic*', note: 'Both forms work in Discord; the converter uses asterisks.' },
  { element: 'Strikethrough', markdown: '~~gone~~', target: '~~gone~~', note: 'Same.' },
  { element: 'Underline', markdown: '(none)', target: '__underline__', note: 'Discord-only; type it directly.' },
  { element: 'Spoiler', markdown: '||secret||', target: '||secret||', note: 'Passed through unchanged.' },
  { element: 'Inline code', markdown: '`code`', target: '`code`', note: 'Same.' },
  { element: 'Code block', markdown: '```js\ncode\n```', target: '```js\ncode\n```', note: 'Language tag kept; Discord highlights it.' },
  { element: 'Link', markdown: '[text](https://u)', target: '[text](https://u)', note: 'Masked link. Option: write "text (url)" instead.' },
  { element: 'Heading 1–3', markdown: '# ## ###', target: '# ## ###', note: 'Supported; a space after the hashes is required.' },
  { element: 'Heading 4–6', markdown: '#### Title', target: '**Title**', note: 'Not supported past ###; written bold.' },
  { element: 'Subtext', markdown: '(none)', target: '-# small text', note: 'Discord-only; type it directly.' },
  { element: 'Bulleted list', markdown: '- item\n  - nested', target: '- item\n  - nested', note: 'Two spaces of indent per level.' },
  { element: 'Numbered list', markdown: '1. item', target: '1. item', note: 'Same.' },
  { element: 'Blockquote', markdown: '> quote', target: '> quote', note: 'Same per line; >>> quotes the rest of a message.' },
  { element: 'Table', markdown: '| a | b |\n|---|---|', target: '```\na  b\n-  -\n```', note: 'No tables; aligned grid in a code block.' },
  { element: 'Image', markdown: '![alt](https://i.png)', target: 'alt: https://i.png', note: 'No inline images; direct image links embed.' },
  { element: 'Horizontal rule', markdown: '---', target: '———', note: 'No rule in Discord.' },
  { element: 'HTML', markdown: '<b>x</b>', target: 'x', note: 'Tags stripped; Discord shows HTML literally.' },
  { element: 'Literal * _ ~ `', markdown: '2\\*3', target: '2\\*3', note: 'Backslash-escaped so they do not format.' },
];

export default function MarkdownToDiscordPage() {
  return (
    <ToolPage
      slug="markdown-to-discord"
      intro={
        <>
          Paste standard markdown and get text that renders correctly in a Discord message: headings up to{' '}
          <code className={CODE}>###</code> are kept, <code className={CODE}>__bold__</code> is rewritten as{' '}
          <code className={CODE}>**bold**</code> (double underscores underline in Discord), tables become an aligned grid in a
          code block, and anything Discord cannot show is listed under the output with its line number. Runs in your
          browser.
        </>
      }
      tool={<MarkdownToDialect dialect="discord" />}
      faq={[
        {
          q: 'Is Discord formatting the same as markdown?',
          a: 'Mostly. Discord uses a subset of markdown plus a few additions: __underline__, ||spoiler||, -# subtext, and >>> for multi-line quotes. It has no tables, images, horizontal rules, or headings smaller than ###, which is where a converter earns its keep.',
        },
        {
          q: 'Why did my __bold__ turn into **bold**?',
          a: 'In CommonMark, double underscores mean strong emphasis (bold). In Discord they mean underline. Because the converter follows the meaning of your markdown, __bold__ becomes **bold**. If you want underline, type __text__ directly in Discord.',
        },
        {
          q: 'Do masked links work in Discord messages?',
          a: 'Yes: Discord\'s Markdown Text 101 article documents [text](url) masked links, and the converter emits them by default. Discord may show a confirmation when the link text differs from the destination. Switch the Links option to "Plain" to write "text (url)" instead.',
        },
        {
          q: 'Which heading levels does Discord support?',
          a: 'Three: # for a large header, ## for a medium one, and ### for a small one, each followed by a space at the start of a line. Markdown headings 4 to 6 have no equivalent and are written as bold lines, which the warnings list points out.',
        },
        {
          q: 'How do I show a table in Discord?',
          a: 'Discord has no table syntax. The converter pads the columns with spaces, draws a dash rule under the header, and wraps the result in a code block so the monospace font keeps the columns aligned. Column alignment from the markdown separator row (:---:) is respected.',
        },
      ]}
    >
      <section className="space-y-3">
        <h2 className={H2}>How does each markdown element map to Discord markdown?</h2>
        <p>
          The table is the rule set the converter applies, checked against Discord&apos;s{' '}
          <a href="https://support.discord.com/hc/en-us/articles/210298617" className={LINK} rel="noopener">
            Markdown Text 101
          </a>{' '}
          article. The complete dialect, including spoilers, timestamps and code-block languages, is on the{' '}
          <Link href="/discord-markdown" className={LINK}>
            Discord markdown cheat sheet
          </Link>
          .
        </p>
        <SyntaxMappingTable target="Discord markdown" rows={ROWS} />
      </section>
      <section className="space-y-3">
        <h2 className={H2}>What gets escaped and why?</h2>
        <p>
          Literal asterisks, underscores, tildes, backticks and backslashes in your text are prefixed with a backslash so
          Discord shows them instead of formatting them: <code className={CODE}>snake_case</code> becomes{' '}
          <code className={CODE}>snake\_case</code>, which renders as <code className={CODE}>snake_case</code>. Pipes are
          left alone so that a <code className={CODE}>||spoiler||</code> written in the markdown survives. Text inside
          inline code and code blocks is never escaped.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>Which markdown features have no Discord equivalent?</h2>
        <p>
          Tables, images, horizontal rules, headings below h3, footnotes, reference-style links and HTML. Each is rewritten
          in the closest plain form and reported with its line number. The same document for other targets:{' '}
          <Link href="/markdown-to-slack" className={LINK}>
            Slack
          </Link>
          ,{' '}
          <Link href="/markdown-to-jira" className={LINK}>
            Jira
          </Link>{' '}
          and{' '}
          <Link href="/markdown-to-plain-text" className={LINK}>
            plain text
          </Link>
          . Why the dialects differ is covered in{' '}
          <Link href="/markdown-flavors" className={LINK}>
            markdown flavors
          </Link>
          ; the standard syntax is on the{' '}
          <Link href="/markdown-cheat-sheet" className={LINK}>
            markdown cheat sheet
          </Link>
          .
        </p>
      </section>
    </ToolPage>
  );
}
