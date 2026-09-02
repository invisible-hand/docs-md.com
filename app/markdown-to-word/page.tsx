import type { Metadata } from 'next';
import Link from 'next/link';
import MarkdownWord from '@/components/tools/MarkdownWord';

export const metadata: Metadata = {
  title: 'Markdown to Word Converter (and Word to Markdown)',
  description:
    'Convert markdown to a Word document with headings, tables, and code preserved, or paste from Word and get clean markdown back. Free, both ways, in-browser.',
};

export default function MarkdownToWordPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
          Markdown to Word converter
        </h1>
        <p className="mt-4 text-base text-gray-600">
          Both directions of the eternal handoff: turn markdown into a{' '}
          <strong>.doc file that opens in Word</strong> with headings, tables, lists, and code
          styled — or paste formatted text <em>from</em> Word and get clean markdown back. The
          conversion runs entirely in your browser; the document is never uploaded.
        </p>
      </div>

      <MarkdownWord />

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">How does markdown to Word work?</h2>
          <p>
            The markdown is rendered to HTML (the same GitHub-flavored pipeline as the{' '}
            <Link href="/markdown-to-html" className="text-indigo-700 underline">
              HTML converter
            </Link>
            ) and wrapped in a Word-compatible envelope — a format Word has opened natively for
            twenty years. Word shows a compatibility prompt on some versions; click through and use{' '}
            <em>Save As → .docx</em> to normalize it. Tables, nested lists, blockquotes, and
            monospaced code all survive the trip.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">How does Word to markdown work?</h2>
          <p>
            When you copy from Word, the clipboard carries an HTML version of the selection. Pasting
            into the converter reads that HTML and translates it element by element — headings to{' '}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">#</code>, bold to{' '}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">**</code>, tables to GFM pipes — while discarding
            Word&apos;s styling noise (fonts, colors, margins), which is exactly what you want when
            the destination is a README or a docs site. Run the result through the{' '}
            <Link href="/markdown-formatter" className="text-indigo-700 underline">
              formatter
            </Link>{' '}
            for perfectly consistent output.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">What doesn&apos;t convert?</h2>
          <p>
            Anything markdown can&apos;t express: comments, tracked changes, footnote formatting
            beyond GFM, text boxes, and embedded charts. Images pasted from Word reference your
            local clipboard and need re-uploading wherever the markdown will live — see the{' '}
            <Link href="/guides/markdown-image" className="text-indigo-700 underline">
              image syntax guide
            </Link>
            . For a PDF instead of a Word file, use the{' '}
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
