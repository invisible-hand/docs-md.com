import Link from 'next/link';
import CsvToMarkdown from '@/components/tools/CsvToMarkdown';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('csv-to-markdown');

export default function CsvToMarkdownPage() {
  return (
    <ToolPage
      slug="csv-to-markdown"
      intro="Paste CSV, TSV, or a range copied straight from Excel or Google Sheets and get an aligned GitHub-flavored markdown table. Quoted fields, embedded commas, and multi-line cells are parsed correctly; pipes are escaped for you. Flip the direction to turn a markdown table back into CSV. Everything runs in your browser."
      tool={<CsvToMarkdown />}
      faq={[
        {
          q: 'How do I convert an Excel or Google Sheets table to markdown?',
          a: 'Select the cells in the spreadsheet, copy, and paste into the input box. Spreadsheets put tab-separated text on the clipboard, which the delimiter auto-detect recognizes. Tick "First row is header" if your selection included the column titles.',
        },
        {
          q: 'What happens to commas and quotes inside a cell?',
          a: 'The parser follows RFC 4180: a field wrapped in double quotes may contain commas, newlines, and doubled quotes ("") for a literal quote. Those characters land in the markdown cell unchanged; a newline inside a cell becomes a <br> tag because markdown table cells cannot span lines.',
        },
        {
          q: 'How are pipe characters handled?',
          a: 'A literal | inside a cell would split the column, so the converter writes it as \\| which GitHub and most renderers display as a plain pipe. Converting back to CSV reverses the escape.',
        },
        {
          q: 'Can I set column alignment?',
          a: 'Yes. Click a column chip above the input to cycle it through left, center, and right. Alignment is written into the separator row with colons (:---, :---:, ---:), which is how GFM tables express it.',
        },
        {
          q: 'Does it work for large files?',
          a: 'Yes, within your browser\'s memory. Files of tens of thousands of rows convert in well under a second; nothing is uploaded, so there is no server-side size limit.',
        },
      ]}
    >
      <section className="space-y-3">
        <h2 className={H2}>Why is the markdown padded with spaces?</h2>
        <p>
          Padding is purely cosmetic: markdown renderers ignore extra spaces inside table cells, but
          a padded source reads like a table in any text editor, which matters when the file lives in
          a repository and people edit it by hand. Turn <em>Pad columns</em> off for the most compact
          output, for example when the table is generated programmatically or will be embedded in a
          chat message. The{' '}
          <Link href="/markdown-formatter" className="text-indigo-700 underline">
            markdown formatter
          </Link>{' '}
          can re-pad an existing table later.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>How is this different from the table generator?</h2>
        <p>
          The{' '}
          <Link href="/markdown-table-generator" className="text-indigo-700 underline">
            markdown table generator
          </Link>{' '}
          is a grid editor: you type into cells, add rows, and drag things around. This page is a
          converter: it takes data you already have in CSV or TSV form and produces the table in one
          step, and it can go the other way, turning a table from a README back into CSV you can open
          in a spreadsheet. Use the generator to author; use this to convert.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>What does a markdown table look like?</h2>
        <p>
          A header row, a separator row of dashes, then data rows, all divided by pipes. Colons in the
          separator set alignment: <code className={CODE}>:---</code> left, <code className={CODE}>:---:</code>{' '}
          center, <code className={CODE}>---:</code> right. Tables are a GitHub Flavored Markdown
          extension supported by GitHub, GitLab, Notion, Obsidian, and most documentation tools; the
          full syntax is on the{' '}
          <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">
            markdown cheat sheet
          </Link>
          .
        </p>
      </section>
    </ToolPage>
  );
}
