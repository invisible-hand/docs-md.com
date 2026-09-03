import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import UpdatedLine from '@/components/UpdatedLine';

const UPDATED = '2026-09-01';
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Markdown Table Generator',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description: metadata.description,
        dateModified: UPDATED,
        url: 'https://docs-md.com/markdown-table-generator',
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'Does my data leave the browser?', acceptedAnswer: { '@type': 'Answer', text: 'No — the table is built entirely client-side. Nothing is uploaded unless you click Share as link, which publishes the markdown to a URL you control (it comes with an edit token and expires after 30 days).' } },
          { '@type': 'Question', name: 'Can I convert an Excel or Google Sheets range?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Copy the range in your spreadsheet, click Paste CSV / TSV, and paste — spreadsheet copies are tab-separated, which the parser detects automatically. The first row becomes the header.' } },
          { '@type': 'Question', name: 'Do GitHub and GitLab render these tables?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — tables are part of GitHub Flavored Markdown (GFM) and supported by GitHub, GitLab, Bitbucket, Discord (partially), Notion, and most documentation tools. See the markdown cheat sheet for the full GFM reference.' } },
        ],
      },
    ],
  };
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-8 max-w-3xl">
        <div className="flex items-start gap-4">
          <ToolIconTile slug="markdown-table-generator" size="lg" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
              Markdown table generator
            </h1>
            <UpdatedLine date={UPDATED} />
          </div>
        </div>
        <p className="mt-4 text-base text-gray-600">
          Edit cells in a grid, click a column header to change its alignment, or paste CSV/TSV
          data straight from a spreadsheet. The markdown output is padded for readability and ready
          to paste into GitHub, a README, or any markdown editor.
        </p>
      </div>

      <TableGenerator />

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-950">How does markdown table syntax work?</h2>
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
          <h2 className="text-xl font-semibold text-gray-950">What can and can&apos;t a markdown table do?</h2>
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
          <h2 className="text-xl font-semibold text-gray-950">Frequently asked questions</h2>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-950">Does my data leave the browser?</h2>
              <p>
                No — the table is built entirely client-side. Nothing is uploaded unless you click{' '}
                <em>Share as link</em>, which publishes the markdown to a URL you control (it comes
                with an edit token and expires after 30 days).
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-950">Can I convert an Excel or Google Sheets range?</h2>
              <p>
                Yes. Copy the range in your spreadsheet, click <em>Paste CSV / TSV</em>, and paste —
                spreadsheet copies are tab-separated, which the parser detects automatically. The
                first row becomes the header.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-950">Do GitHub and GitLab render these tables?</h2>
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
            <Link href="/markdown-formatter" className="text-indigo-700 underline">Markdown formatter</Link>{' · '}
            <Link href="/markdown-to-html" className="text-indigo-700 underline">Markdown to HTML</Link>{' · '}
            <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">Markdown cheat sheet</Link>{' · '}
            <Link href="/" className="text-indigo-700 underline">Share markdown as a link</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
