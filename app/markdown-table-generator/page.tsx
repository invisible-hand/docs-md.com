import type { Metadata } from 'next';
import Link from 'next/link';
import TableGenerator from '@/components/tools/TableGenerator';

export const metadata: Metadata = {
  title: 'Markdown Table Generator — Free Online Tool',
  description:
    'Build markdown tables visually: edit cells, set column alignment, paste CSV or TSV data, and copy clean padded markdown. Free, no signup, works in your browser.',
};

function InlineCode({ children }: { children: string }) {
  return <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">{children}</code>;
}

export default function MarkdownTableGeneratorPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
          Markdown table generator
        </h1>
        <p className="mt-4 text-base text-gray-600">
          Edit cells in a grid, click a column header to change its alignment, or paste CSV/TSV
          data straight from a spreadsheet. The markdown output is padded for readability and ready
          to paste into GitHub, a README, or any markdown editor.
        </p>
      </div>

      <TableGenerator />

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-950">Markdown table syntax, explained</h2>
          <p>
            A markdown table is plain text: pipes (<InlineCode>|</InlineCode>) separate columns, and
            a separator line of dashes after the header row tells the parser where the header ends.
            Alignment is controlled by colons in that separator line:
          </p>
          <pre className="overflow-x-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-200">
            <code>{`| Left     | Center   | Right    |
| :------- | :------: | -------: |
| a        |    b     |        c |`}</code>
          </pre>
          <ul className="list-disc space-y-2 pl-6">
            <li><InlineCode>:---</InlineCode> (or plain <InlineCode>---</InlineCode>) aligns the column left</li>
            <li><InlineCode>:---:</InlineCode> centers the column</li>
            <li><InlineCode>---:</InlineCode> aligns the column right</li>
          </ul>
          <p>
            The padding spaces this generator adds are optional — markdown parsers ignore them — but
            they keep the source readable, which matters when the table lives in a README that
            people edit by hand.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-950">Things markdown tables can and can&apos;t do</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Pipes inside cells</strong> must be escaped as <InlineCode>\|</InlineCode> —
              the generator does this automatically.
            </li>
            <li>
              <strong>Line breaks inside cells</strong> aren&apos;t part of the syntax; the common
              workaround is an HTML <InlineCode>{'<br>'}</InlineCode> tag, which this tool inserts
              for you if a pasted cell contains newlines.
            </li>
            <li>
              <strong>Merged cells, row spans, and nested tables</strong> don&apos;t exist in
              markdown. If you need them, use HTML tables — most markdown renderers pass HTML
              through.
            </li>
            <li>
              <strong>Inline formatting works inside cells</strong>: bold, links, and{' '}
              <InlineCode>`code`</InlineCode> all render normally.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-950">FAQ</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">Does my data leave the browser?</h3>
              <p>
                No — the table is built entirely client-side. Nothing is uploaded unless you click{' '}
                <em>Share as link</em>, which publishes the markdown to a URL you control (it comes
                with an edit token and expires after 30 days).
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Can I convert an Excel or Google Sheets range?</h3>
              <p>
                Yes. Copy the range in your spreadsheet, click <em>Paste CSV / TSV</em>, and paste —
                spreadsheet copies are tab-separated, which the parser detects automatically. The
                first row becomes the header.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Do GitHub and GitLab render these tables?</h3>
              <p>
                Yes — tables are part of GitHub Flavored Markdown (GFM) and supported by GitHub,
                GitLab, Bitbucket, Discord (partially), Notion, and most documentation tools. See
                the{' '}
                <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">
                  markdown cheat sheet
                </Link>{' '}
                for the full GFM reference.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl bg-indigo-50 p-6">
          <h2 className="text-xl font-semibold text-gray-950">More markdown tools</h2>
          <p>
            <Link href="/markdown-to-pdf" className="text-indigo-700 underline">Markdown to PDF converter</Link>{' · '}
            <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">Markdown cheat sheet</Link>{' · '}
            <Link href="/" className="text-indigo-700 underline">Share markdown as a link</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
