import type { Metadata } from 'next';
import Link from 'next/link';
import TocGenerator from '@/components/tools/TocGenerator';

export const metadata: Metadata = {
  title: 'Markdown Table of Contents Generator — Free TOC Tool',
  description:
    'Generate a markdown table of contents from your headings with correct GitHub anchor links. Choose depth, numbered or bulleted, and insert it in the doc.',
};

export default function TocGeneratorPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
          Markdown table of contents generator
        </h1>
        <p className="mt-4 text-base text-gray-600">
          Paste a markdown document and get a linked table of contents built from its headings —
          with anchor slugs generated exactly the way GitHub does it, so every link works in your
          README. Nothing leaves your browser.
        </p>
      </div>

      <TocGenerator />

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">How do the anchor links work?</h2>
          <p>
            Every heading in rendered markdown gets an HTML id: the text lowercased, spaces turned
            into hyphens, punctuation dropped, and a <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">-1</code>,{' '}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">-2</code>… suffix added to duplicates. This tool uses{' '}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">github-slugger</code> — the same algorithm GitHub uses —
            so <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">## Getting Started!</code> correctly becomes{' '}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">#getting-started</code>. Headings inside code fences are
            ignored, and markdown formatting inside headings is stripped from the link text.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">Where should the TOC go?</h2>
          <p>
            Convention: directly under the H1 title, headed &ldquo;Table of contents&rdquo; — which
            is exactly what the <em>Insert into document</em> button does. For long READMEs,
            limiting depth to H2–H3 keeps it scannable; go deeper only for reference docs. GitHub
            also auto-generates a TOC in the file header menu, but an inline one still helps
            readers on npm, crates.io, and anywhere else the README is mirrored.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">Related tools</h2>
          <p className="text-sm">
            <Link href="/readme-generator" className="text-indigo-700 underline">README generator</Link>{' · '}
            <Link href="/markdown-formatter" className="text-indigo-700 underline">markdown formatter</Link>{' · '}
            <Link href="/guides/markdown-link" className="text-indigo-700 underline">how markdown links work</Link>{' · '}
            <Link href="/" className="text-indigo-700 underline">share the finished doc</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
