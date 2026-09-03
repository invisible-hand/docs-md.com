import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import PdfToMarkdown from '@/components/tools/PdfToMarkdown';

export const metadata: Metadata = {
  title: 'PDF to Markdown Converter — Free, Private, In-Browser',
  description:
    'Convert a PDF to markdown free in your browser: drop the file, get editable markdown with headings, lists, and paragraphs inferred from layout. No upload.',
};

export default function PdfToMarkdownPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-8 max-w-3xl">
        <div className="flex items-start gap-4">
          <ToolIconTile slug="pdf-to-markdown" size="lg" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
              PDF to markdown converter
            </h1>
          </div>
        </div>
        <p className="mt-4 text-base text-gray-600">
          Drop a PDF and get clean, editable markdown. The converter reads the text layer directly
          in your browser — nothing is uploaded anywhere — and infers structure from the layout:
          larger text becomes headings, bullet glyphs become list items, line wraps are joined back
          into paragraphs, and end-of-line hyphenation is undone.
        </p>
      </div>

      <PdfToMarkdown />

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">How does the conversion work?</h2>
          <p>
            PDFs don&apos;t store paragraphs or headings — only characters positioned on a page. The
            converter groups characters into lines, measures font sizes to find the document&apos;s
            body text, and promotes noticeably larger lines to <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm"># headings</code>.
            Vertical gaps split paragraphs; bullet characters (•, ◦, –) become markdown list items.
            Because that structure is inferred, skim the output — a subtitle may need its heading
            level adjusted, and multi-column layouts can interleave.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">Why is my PDF producing no text?</h2>
          <p>
            Scanned PDFs are photographs of pages — there is no text layer to extract, and turning
            them into text requires OCR, which this tool deliberately skips to stay fast and fully
            private. If the PDF was produced digitally (exported from Word, Google Docs, LaTeX, or
            a design tool), the text layer is there and conversion works.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">What should you do with the markdown?</h2>
          <p>
            Clean it up with the{' '}
            <Link href="/markdown-formatter" className="text-indigo-700 underline">
              markdown formatter
            </Link>
            , check any syntax you&apos;re unsure of on the{' '}
            <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">
              cheat sheet
            </Link>
            , or{' '}
            <Link href="/" className="text-indigo-700 underline">
              share it as a live link
            </Link>{' '}
            straight from this site. Going the other direction? Use the{' '}
            <Link href="/markdown-to-pdf" className="text-indigo-700 underline">
              markdown to PDF converter
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
