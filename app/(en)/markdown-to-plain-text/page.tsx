import Link from 'next/link';
import MarkdownToDialect from '@/components/tools/MarkdownToDialect';
import SyntaxMappingTable, { type MappingRow } from '@/components/tools/SyntaxMappingTable';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('markdown-to-plain-text');

const LINK = 'text-indigo-700 underline';

const ROWS: MappingRow[] = [
  { element: 'Heading', markdown: '## Title', target: 'Title', note: 'Hashes removed; the line is kept as its own paragraph.' },
  { element: 'Bold / italic', markdown: '**bold** _italic_', target: 'bold italic', note: 'Markers removed.' },
  { element: 'Strikethrough', markdown: '~~gone~~', target: 'gone', note: 'Text kept; the deletion is not marked.' },
  { element: 'Inline code', markdown: '`code`', target: 'code', note: 'Backticks removed.' },
  { element: 'Code block', markdown: '```js\ncode\n```', target: 'code', note: 'Fence and language removed; the code itself is untouched.' },
  { element: 'Link', markdown: '[text](https://u)', target: 'text  or  text (https://u)', note: 'Second form with "Keep link URLs" on.' },
  { element: 'Autolink', markdown: '<https://u>', target: 'https://u', note: 'URL kept.' },
  { element: 'Image', markdown: '![alt](https://i.png)', target: 'alt  or  alt (https://i.png)', note: 'Same option as links.' },
  { element: 'Bulleted list', markdown: '* item\n  + nested', target: '- item\n  - nested', note: 'Normalized to hyphens with two-space indent.' },
  { element: 'Numbered list', markdown: '1. item', target: '1. item', note: 'Numbers renumbered from the list start.' },
  { element: 'Task item', markdown: '- [x] done', target: '- [x] done', note: 'Checkbox kept as text.' },
  { element: 'Blockquote', markdown: '> quote', target: 'quote', note: 'The > prefix is removed.' },
  { element: 'Table', markdown: '| a | b |\n|---|---|\n| 1 | 2 |', target: 'a  b\n-  -\n1  2', note: 'Space-aligned grid; alignment from the separator row respected.' },
  { element: 'Horizontal rule', markdown: '---', target: '(removed)', note: 'Paragraphs on either side stay separated.' },
  { element: 'Line break', markdown: 'two trailing spaces', target: 'newline', note: '' },
  { element: 'HTML', markdown: 'a<br>b <b>c</b>', target: 'a\nb c', note: 'Tags removed; <br> becomes a newline; entities decoded.' },
  { element: 'Escaped characters', markdown: '2\\*3', target: '2*3', note: 'Backslash escapes resolved.' },
  { element: 'Footnote', markdown: 'text[^1]', target: 'text[^1]', note: 'Kept literally.' },
];

export default function MarkdownToPlainTextPage() {
  return (
    <ToolPage
      slug="markdown-to-plain-text"
      intro={
        <>
          Paste markdown and get the text with every formatting marker removed: no hashes, asterisks, backticks, pipes or
          brackets, while the words, the line structure, lists and code stay exactly as written. Links can keep their URL
          as <code className={CODE}>text (url)</code> so nothing is lost. Use it for email, SMS, form fields, commit
          messages and anywhere markup would show literally. Runs in your browser.
        </>
      }
      tool={<MarkdownToDialect dialect="plain" />}
      faq={[
        {
          q: 'What does "strip markdown" actually remove?',
          a: 'Syntax only: heading hashes, emphasis markers, code fences and backticks, link and image brackets, blockquote prefixes, table pipes and separator rows, horizontal rules, HTML tags and backslash escapes. The text inside every element, including code, is kept unchanged.',
        },
        {
          q: 'Are links lost when converting markdown to plain text?',
          a: 'Not if "Keep link URLs" is on (the default): [text](url) becomes text (url) and images become alt (url). Turn it off to keep only the visible text, which reads better when the URLs are not needed, for example in a spoken script or a character-limited field.',
        },
        {
          q: 'Why are my bullet markers normalized to hyphens?',
          a: 'Markdown allows -, * and + for bullets. Plain text has no rendering step to make them look alike, so the converter writes one marker (-) with two spaces of indent per nesting level, which reads consistently in any editor or email client.',
        },
        {
          q: 'How are tables converted to plain text?',
          a: 'As a space-aligned grid: columns are padded to the widest cell, a row of dashes separates the header, and left/center/right alignment from the separator row is applied. It lines up in a monospace font and still reads as rows and columns in a proportional one.',
        },
        {
          q: 'Is the conversion done with regular expressions?',
          a: 'No. The markdown is parsed into a syntax tree with remark (GitHub Flavored Markdown on), the same parser used by the other converters on this site, so emphasis inside code, escaped characters, nested lists and tables are handled by the grammar rather than by pattern matching.',
        },
      ]}
    >
      <section className="space-y-3">
        <h2 className={H2}>How is each markdown element converted to plain text?</h2>
        <p>
          The table lists what the converter does with every element of CommonMark and GitHub Flavored Markdown; the
          element syntax itself is on the{' '}
          <Link href="/markdown-cheat-sheet" className={LINK}>
            markdown cheat sheet
          </Link>
          .
        </p>
        <SyntaxMappingTable target="Plain text" rows={ROWS} />
      </section>
      <section className="space-y-3">
        <h2 className={H2}>When is plain text the right target?</h2>
        <p>
          Whenever the destination shows markup literally: email clients that send text/plain, SMS and push
          notifications, CSV cells, form fields, terminal output, voice scripts, and search-index or summary fields. If the
          destination has its own markup, use the converter for it instead:{' '}
          <Link href="/markdown-to-slack" className={LINK}>
            Slack
          </Link>
          ,{' '}
          <Link href="/markdown-to-discord" className={LINK}>
            Discord
          </Link>{' '}
          or{' '}
          <Link href="/markdown-to-jira" className={LINK}>
            Jira
          </Link>
          . For HTML, the{' '}
          <Link href="/markdown-to-html" className={LINK}>
            markdown to HTML converter
          </Link>{' '}
          keeps the structure.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>Why is the paragraph structure kept?</h2>
        <p>
          Removing markup should not turn a document into one run-on block. Headings, paragraphs, list items, quotes and
          code blocks stay separated by blank lines, so the result reads in the same order and rhythm as the rendered
          page. Only horizontal rules disappear, because a rule has no textual content. The{' '}
          <Link href="/markdown-word-counter" className={LINK}>
            word counter
          </Link>{' '}
          uses the same prose-only view to count words without the syntax, and{' '}
          <Link href="/markdown-flavors" className={LINK}>
            markdown flavors
          </Link>{' '}
          explains which extensions (tables, task lists, strikethrough) are GFM rather than CommonMark.
        </p>
      </section>
    </ToolPage>
  );
}
