import type { Metadata } from 'next';
import Link from 'next/link';
import LinkGenerator from '@/components/tools/LinkGenerator';

export const metadata: Metadata = {
  title: 'Markdown Link, Image & Code Block Generator',
  description:
    'Generate correct markdown for links, images, and fenced code blocks: fill in the fields, see a live preview, copy the snippet. Handles tooltips, reference links, image sizing, and fence escaping.',
};

export default function LinkGeneratorPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
          Markdown link &amp; image generator
        </h1>
        <p className="mt-4 text-base text-gray-600">
          The three snippets people most often get slightly wrong — links, images, and fenced code
          blocks — generated correctly from a form, with a live preview. It handles the edge cases
          for you: tooltip titles, reference-style links, sized images (which need HTML), clickable
          images, and code that itself contains backtick fences.
        </p>
      </div>

      <LinkGenerator />

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">The syntax being generated</h2>
          <p>
            Links are <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">[text](url &quot;title&quot;)</code> — no space
            between the brackets and parenthesis. Images are the same with a leading{' '}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">!</code>, and sizing requires switching to an HTML{' '}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">&lt;img width&gt;</code> tag. Code blocks are fenced with
            three backticks plus a language tag — or four backticks when the code contains a fence.
            Full details in the guides:{' '}
            <Link href="/guides/markdown-link" className="text-indigo-700 underline">links</Link>,{' '}
            <Link href="/guides/markdown-image" className="text-indigo-700 underline">images</Link>,{' '}
            <Link href="/guides/markdown-code-block" className="text-indigo-700 underline">code blocks</Link>.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">Related tools</h2>
          <p className="text-sm">
            <Link href="/markdown-table-generator" className="text-indigo-700 underline">table generator</Link>{' · '}
            <Link href="/markdown-toc-generator" className="text-indigo-700 underline">TOC generator</Link>{' · '}
            <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">cheat sheet</Link>{' · '}
            <Link href="/" className="text-indigo-700 underline">share the doc</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
