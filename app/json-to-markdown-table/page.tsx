import Link from 'next/link';
import JsonToMarkdownTable from '@/components/tools/JsonToMarkdownTable';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('json-to-markdown-table');

const A = 'text-indigo-700 underline';
const TABLE_WRAP = 'overflow-x-auto rounded-2xl border border-gray-200';
const TABLE = 'w-full min-w-[640px] text-left text-sm';
const THEAD = 'bg-gray-50 text-xs uppercase tracking-wide text-gray-500';
const TH = 'px-3 py-2';
const TD = 'px-3 py-2 align-top';
const TD_CODE = 'px-3 py-2 align-top font-mono text-xs text-gray-900';

const SHAPES: { shape: string; example: string; columns: string; rows: string }[] = [
  { shape: 'Array of objects', example: '[{"id":1,"name":"Ada"}, {"id":2}]', columns: 'Union of every key, in first-seen order', rows: 'One per object; missing keys are empty cells' },
  { shape: 'Object of objects', example: '{"ada":{"age":36}, "grace":{"age":85}}', columns: 'A key column, then the inner keys', rows: 'One per outer key' },
  { shape: 'Object of arrays', example: '{"name":["Ada","Grace"], "age":[36,85]}', columns: 'One per outer key (column-major data)', rows: 'One per index; shorter arrays pad with empty cells' },
  { shape: 'Array of arrays', example: '[[1,2],[3,4]]', columns: 'column1, column2, … as wide as the longest row', rows: 'One per inner array' },
  { shape: 'Array of primitives', example: '["a","b","c"]', columns: 'A single value column', rows: 'One per element' },
  { shape: 'Single object', example: '{"name":"Ada","born":1815}', columns: 'key and value', rows: 'One per (flattened) key' },
  { shape: 'Wrapped API response', example: '{"data":[{"id":1},{"id":2}]}', columns: 'As array of objects', rows: 'A single wrapper key around an array of objects is unwrapped' },
];

const RULES: { value: string; example: string; cell: string }[] = [
  { value: 'Nested object', example: '{"geo":{"lat":51.5}}', cell: 'Flattened into a dot-path column geo.lat (up to the chosen depth); deeper levels are kept as compact JSON' },
  { value: 'Array of primitives', example: '["a","b"]', cell: 'Joined with a comma and a space: a, b' },
  { value: 'Array of objects', example: '[{"id":1}]', cell: 'Kept as compact JSON text: [{"id":1}]' },
  { value: 'null', example: 'null', cell: 'Empty cell' },
  { value: 'Missing key', example: '(key absent in this object)', cell: 'Empty cell' },
  { value: 'Boolean', example: 'true', cell: 'The text true or false' },
  { value: 'Number', example: '1.5e3', cell: "JavaScript's number text: 1500" },
  { value: 'String with a pipe', example: '"a | b"', cell: 'The pipe is escaped as \\| so it does not split the column' },
  { value: 'String with a newline', example: '"line1\\nline2"', cell: 'The newline becomes <br>, because a table cell cannot span lines' },
  { value: 'Empty object', example: '{}', cell: 'The text {}' },
];

export default function JsonToMarkdownTablePage() {
  return (
    <ToolPage
      slug="json-to-markdown-table"
      intro="Paste a JSON array of objects, an object of objects, an object of arrays, or a single object and get a GitHub-flavored markdown table. Nested keys flatten to dot paths, arrays join with commas, null becomes an empty cell, and pipes are escaped. Reorder, hide and align columns, then copy or download. Flip the direction to turn a markdown table back into a JSON array. Everything runs in your browser."
      tool={<JsonToMarkdownTable />}
      related={['csv-to-markdown', 'markdown-table-generator', 'markdown-formatter', 'markdown-to-html', 'markdown-cheat-sheet']}
      faq={[
        {
          q: 'How do I convert a JSON array of objects to a markdown table?',
          a: 'Paste the array into the JSON box. Each object becomes one row and the union of all keys becomes the header, in the order the keys first appear. Objects that are missing a key get an empty cell in that column. Copy the markdown or download it as a .md file.',
        },
        {
          q: 'What happens to nested objects and arrays in the JSON?',
          a: 'Nested objects are flattened into dot-path columns such as address.city, as many levels deep as the Flatten depth setting allows; anything deeper is kept as compact JSON text in the cell. Arrays of strings or numbers are joined with a comma and a space; arrays of objects stay as JSON text.',
        },
        {
          q: 'How are null, true, false and numbers written in the table?',
          a: 'null and missing keys become empty cells. Booleans are written as the words true and false, and numbers as their shortest JavaScript text, so 1.5e3 becomes 1500 and 1.0 becomes 1. The reverse direction turns those texts back into the same JSON types when "Infer numbers, booleans, null" is on.',
        },
        {
          q: 'Why does my JSON show an error with a line and column?',
          a: 'The input must be strict JSON: double-quoted keys and strings, no trailing commas, no comments, no NaN or undefined. The error names the first violation and where it is, for example a single-quoted string on line 3 or a trailing comma before a closing bracket. Fix that spot and the table appears immediately.',
        },
        {
          q: 'Can I turn a markdown table back into JSON?',
          a: 'Yes. Switch to Markdown → JSON, paste a table, and every body row becomes an object keyed by the header cells. Numbers, booleans and null are inferred unless you turn that off, and dotted headers like address.city are expanded back into nested objects.',
        },
      ]}
    >
      <section className="space-y-4">
        <h2 className={H2}>How does each JSON shape map to a table?</h2>
        <p>
          A markdown table is a flat grid, so the converter first decides which part of the JSON is the
          list of rows and which part is the list of columns. These are the shapes it recognizes and
          what it does with each one.
        </p>
        <div className={TABLE_WRAP}>
          <table className={TABLE}>
            <thead className={THEAD}>
              <tr>
                <th className={TH}>JSON shape</th>
                <th className={TH}>Example</th>
                <th className={TH}>Columns</th>
                <th className={TH}>Rows</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {SHAPES.map((r) => (
                <tr key={r.shape}>
                  <td className={`${TD} font-medium text-gray-900`}>{r.shape}</td>
                  <td className={TD_CODE}>{r.example}</td>
                  <td className={TD}>{r.columns}</td>
                  <td className={TD}>{r.rows}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>What are the flattening rules for nested values?</h2>
        <p>
          A table cell holds text, so every non-scalar value has to be turned into text. The rules
          below are applied to each value; the only setting that changes them is{' '}
          <em>Flatten depth</em>, which caps how many levels of nested objects become dot-path
          columns.
        </p>
        <div className={TABLE_WRAP}>
          <table className={TABLE}>
            <thead className={THEAD}>
              <tr>
                <th className={TH}>Value in the JSON</th>
                <th className={TH}>Example</th>
                <th className={TH}>Cell in the table</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {RULES.map((r) => (
                <tr key={r.value}>
                  <td className={`${TD} font-medium text-gray-900`}>{r.value}</td>
                  <td className={TD_CODE}>{r.example}</td>
                  <td className={TD}>{r.cell}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600">
          The output is a standard GFM table: header row, a separator row of dashes with optional
          colons for alignment (<code className={CODE}>:---</code> left,{' '}
          <code className={CODE}>:---:</code> center, <code className={CODE}>---:</code> right), then one
          line per row. Syntax details are in the{' '}
          <Link href="/guides/markdown-table" className={A}>
            markdown table guide
          </Link>{' '}
          and on the{' '}
          <Link href="/markdown-cheat-sheet" className={A}>
            cheat sheet
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className={H2}>How do I choose, order and align the columns?</h2>
        <p>
          Every flattened key appears as a chip above the input. Click a chip to cycle its alignment
          through left, center and right; click the × to hide that column (the data is untouched, it
          is just left out of the table). The <em>Columns</em> menu switches between the order the keys
          were first seen, alphabetical order, and a custom order you type as a comma-separated list
          of column names, with any unlisted columns following in their original order.{' '}
          <em>Header</em> rewrites the header cells only, so <code className={CODE}>firstName</code> or{' '}
          <code className={CODE}>contact.city</code> can be shown as <code className={CODE}>First Name</code>{' '}
          and <code className={CODE}>Contact City</code> while the data stays as it was.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className={H2}>When should I use this instead of the CSV converter or the table generator?</h2>
        <p>
          Use this page when the data is already JSON: an API response, a config file, a log export, or
          the output of a script. The{' '}
          <Link href="/csv-to-markdown" className={A}>
            CSV to markdown converter
          </Link>{' '}
          does the same job for comma- or tab-separated text and cells pasted from a spreadsheet; the{' '}
          <Link href="/markdown-table-generator" className={A}>
            markdown table generator
          </Link>{' '}
          is a grid editor for typing a table from scratch. All three produce the same GFM syntax, so a
          table made here can be re-padded later with the{' '}
          <Link href="/markdown-formatter" className={A}>
            formatter
          </Link>{' '}
          or converted to HTML with the{' '}
          <Link href="/markdown-to-html" className={A}>
            markdown to HTML converter
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className={H2}>Does the conversion lose information?</h2>
        <p>
          Some, by design: a table has no way to say whether <code className={CODE}>1</code> was a number
          or the string <code className={CODE}>&quot;1&quot;</code>, whether a blank cell was{' '}
          <code className={CODE}>null</code>, an empty string, or a missing key, or where one array element
          ends and the next begins once they are joined with commas. The reverse direction makes the
          common-sense guess (numbers, booleans and null are inferred; dotted headers become nested
          objects), which round-trips typical records exactly. If the strings matter, turn inference off
          and every cell comes back as a string. Nothing leaves your browser in either direction.
        </p>
      </section>
    </ToolPage>
  );
}
