import Link from 'next/link';
import MarkdownToDialect from '@/components/tools/MarkdownToDialect';
import SyntaxMappingTable, { type MappingRow } from '@/components/tools/SyntaxMappingTable';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('markdown-to-jira');

const LINK = 'text-indigo-700 underline';

const ROWS: MappingRow[] = [
  { element: 'Heading', markdown: '# Title … ###### Title', target: 'h1. Title … h6. Title', note: 'All six levels exist.' },
  { element: 'Bold', markdown: '**bold** or __bold__', target: '*bold*', note: 'Single asterisks.' },
  { element: 'Italic', markdown: '*italic* or _italic_', target: '_italic_', note: 'Underscores.' },
  { element: 'Strikethrough', markdown: '~~gone~~', target: '-gone-', note: 'Hyphens ("deleted" in Jira terms).' },
  { element: 'Inline code', markdown: '`code`', target: '{{code}}', note: 'Monospaced.' },
  { element: 'Code block with language', markdown: '```js\ncode\n```', target: '{code:javascript}\ncode\n{code}', note: 'Aliases mapped (js → javascript, sh → bash, yml → yaml).' },
  { element: 'Code block, no language', markdown: '```\ncode\n```', target: '{noformat}\ncode\n{noformat}', note: 'Preformatted, no highlighting.' },
  { element: 'Code block, unknown language', markdown: '```brainfuck\n+\n```', target: '{code}\n+\n{code}', note: 'Reported in the warnings.' },
  { element: 'Link', markdown: '[text](https://u)', target: '[text|https://u]', note: 'Bare URL: [https://u].' },
  { element: 'Image', markdown: '![alt](https://i.png)', target: '!https://i.png!', note: 'Alt text is dropped (reported).' },
  { element: 'Bulleted list', markdown: '- item\n  - nested', target: '* item\n** nested', note: 'Marker repeated per level, no indent.' },
  { element: 'Numbered list', markdown: '1. item\n   1. nested', target: '# item\n## nested', note: 'Hashes.' },
  { element: 'Mixed nesting', markdown: '- item\n  1. nested', target: '* item\n*# nested', note: 'Outer marker then inner.' },
  { element: 'Task item', markdown: '- [x] done', target: '* [x] done', note: 'Checkbox kept as text.' },
  { element: 'Blockquote', markdown: '> quote', target: '{quote}\nquote\n{quote}', note: 'bq. also works for one paragraph.' },
  { element: 'Table', markdown: '| a | b |\n|---|---|\n| 1 | 2 |', target: '||a||b||\n|1|2|', note: 'Double pipes mark header cells; pipes inside cells become ¦.' },
  { element: 'Horizontal rule', markdown: '---', target: '----', note: 'Four hyphens on their own line.' },
  { element: 'Line break', markdown: 'two trailing spaces', target: '\\\\', note: 'Two backslashes.' },
  { element: 'Literal { and [', markdown: 'a {b} [c]', target: 'a \\{b} \\[c]', note: 'Escaped so Jira does not read a macro or link.' },
];

export default function MarkdownToJiraPage() {
  return (
    <ToolPage
      slug="markdown-to-jira"
      intro={
        <>
          Paste standard markdown and get Jira wiki markup for issue descriptions and comments:{' '}
          <code className={CODE}>## Title</code> becomes <code className={CODE}>h2. Title</code>,{' '}
          <code className={CODE}>**bold**</code> becomes <code className={CODE}>*bold*</code>, fenced code becomes{' '}
          <code className={CODE}>{'{code:lang}'}</code>, tables use <code className={CODE}>||header||</code> rows, and nested
          lists use <code className={CODE}>**</code> and <code className={CODE}>*#</code>. Anything approximated is listed
          under the output. Runs in your browser.
        </>
      }
      tool={<MarkdownToDialect dialect="jira" />}
      faq={[
        {
          q: 'Does Jira accept markdown?',
          a: 'Jira Cloud\'s editor auto-formats a few markdown shortcuts as you type (## for a heading, ** for bold, ``` for a code block), but pasted or API-submitted text in the classic description and comment fields is interpreted as Jira wiki markup, a different notation. Converting the whole document avoids a mix of literal asterisks and half-applied formatting.',
        },
        {
          q: 'How do I write a code block in Jira?',
          a: 'Wrap it in {code:language} … {code}, for example {code:python}. Jira\'s notation help lists the highlighted languages (Java is the default); a fenced block without a language is written as {noformat} … {noformat}, which is preformatted text with no highlighting.',
        },
        {
          q: 'How are nested lists written in Jira wiki markup?',
          a: 'Repeat the marker for each level with no indentation: * for a bullet, ** for a nested bullet, # for a numbered item, ## for a nested numbered item. Mixed nesting combines markers, so a numbered item under a bullet is *#. Blank lines between items can break a list, so the converter keeps items on consecutive lines.',
        },
        {
          q: 'How do I make a table in Jira?',
          a: 'Header cells are separated by double pipes (||Name||Status||) and body cells by single pipes (|Login|Done|). There is no escape for a pipe inside a cell, so the converter replaces it with a broken-bar character and reports the change.',
        },
        {
          q: 'Why is strikethrough -text- and not ~~text~~?',
          a: 'In Jira wiki markup hyphens mark deleted text, while tildes mark subscript (~sub~) and carets superscript (^sup^). The converter writes ~~text~~ as -text-; the standard mapping is in the table above.',
        },
      ]}
    >
      <section className="space-y-3">
        <h2 className={H2}>How does each markdown element map to Jira wiki markup?</h2>
        <p>
          The table is the rule set the converter applies, checked against Atlassian&apos;s{' '}
          <a href="https://jira.atlassian.com/secure/WikiRendererHelpAction.jspa?section=all" className={LINK} rel="noopener">
            Text formatting notation help
          </a>
          . The complete notation, including panels, colors and citations, is on the{' '}
          <Link href="/jira-markdown" className={LINK}>
            Jira markdown cheat sheet
          </Link>
          .
        </p>
        <SyntaxMappingTable target="Jira wiki markup" rows={ROWS} />
      </section>
      <section className="space-y-3">
        <h2 className={H2}>Where does Jira wiki markup apply?</h2>
        <p>
          The classic description and comment fields of Jira issues (Server, Data Center, and Jira Cloud fields that use the
          wiki renderer), the REST API v2 <code className={CODE}>description</code> and <code className={CODE}>comment</code>{' '}
          bodies, and Confluence pages inserted through the wiki markup editor. The Jira Cloud rich-text editor stores
          Atlassian Document Format instead, but it still accepts pasted wiki markup in most fields and converts it on save.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>Which markdown features have no Jira equivalent?</h2>
        <p>
          Image alt text, footnotes, reference-style links, pipes inside table cells, and HTML (the{' '}
          <code className={CODE}>{'{html}'}</code> macro is disabled on most sites). Each is rewritten in the closest form
          and reported with its line number. The same document for other targets:{' '}
          <Link href="/markdown-to-slack" className={LINK}>
            Slack
          </Link>
          ,{' '}
          <Link href="/markdown-to-discord" className={LINK}>
            Discord
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
