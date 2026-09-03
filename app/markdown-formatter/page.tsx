import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import MarkdownFormatter from '@/components/tools/MarkdownFormatter';

export const metadata: Metadata = {
  title: 'Markdown Formatter — Free Online Beautifier',
  description:
    'Format and prettify markdown online: normalize list markers, emphasis style, table alignment, and spacing. Semantic formatting that never changes output.',
};

function InlineCode({ children }: { children: string }) {
  return <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">{children}</code>;
}

export default function MarkdownFormatterPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-8 max-w-3xl">
        <div className="flex items-start gap-4">
          <ToolIconTile slug="markdown-formatter" size="lg" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
              Markdown formatter
            </h1>
          </div>
        </div>
        <p className="mt-4 text-base text-gray-600">
          Paste messy markdown and get a consistently formatted version back: uniform list markers,
          one emphasis style, aligned tables, and normalized spacing. The formatter parses your
          document and re-prints it, so the rendered result never changes — only the source gets
          cleaner.
        </p>
      </div>

      <MarkdownFormatter />

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-950">What gets normalized</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>List markers</strong> — a document mixing <InlineCode>-</InlineCode>,{' '}
              <InlineCode>*</InlineCode>, and <InlineCode>+</InlineCode> bullets comes out using
              one marker of your choice, with consistent indentation for nested lists.
            </li>
            <li>
              <strong>Emphasis style</strong> — <InlineCode>*asterisks*</InlineCode> and{' '}
              <InlineCode>_underscores_</InlineCode> render identically, but mixing them in one
              file reads badly. Pick one; the formatter applies it everywhere, to bold too.
            </li>
            <li>
              <strong>Tables</strong> — cells get padded so pipes line up vertically, the same
              formatting our{' '}
              <Link href="/markdown-table-generator" className="text-indigo-700 underline">
                table generator
              </Link>{' '}
              produces.
            </li>
            <li>
              <strong>Headings</strong> — setext headings (underlined with{' '}
              <InlineCode>===</InlineCode>) become ATX headings (<InlineCode>#</InlineCode>), and
              stray spaces after the hashes are removed.
            </li>
            <li>
              <strong>Spacing</strong> — extra blank lines collapse, and blocks are separated by
              exactly one blank line, which some renderers require.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-950">
            Semantic formatting, not find-and-replace
          </h2>
          <p>
            The formatter is built on <InlineCode>remark</InlineCode>, the same parser used by
            Prettier&apos;s markdown support and thousands of documentation pipelines. Your text is
            parsed into a syntax tree and printed back out — which is why it can safely tell the
            difference between a <InlineCode>*</InlineCode> that starts a list item and a{' '}
            <InlineCode>*</InlineCode> inside a sentence, or between an underscore in{' '}
            <InlineCode>variable_name</InlineCode> and one that starts emphasis. A regex-based
            beautifier can&apos;t make those distinctions; a parser can.
          </p>
          <p>
            One consequence worth knowing: because the output is re-printed from the tree,
            insignificant quirks of your original source (trailing whitespace, inconsistent escape
            styles, indented vs. fenced code) are normalized to the standard form. If some exotic
            construct matters to your toolchain, diff the output before committing it.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-950">When to use it</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Before committing docs</strong> — a formatted README diffs cleanly in code
              review because only real changes show up, not style noise.
            </li>
            <li>
              <strong>After AI generation</strong> — LLM-generated markdown often mixes emphasis
              markers and bullet styles mid-document; one pass here fixes it.
            </li>
            <li>
              <strong>Merging docs from multiple authors</strong> — unify everyone&apos;s habits
              into one house style.
            </li>
            <li>
              <strong>Cleaning up exports</strong> — Notion, Google Docs, and other exporters
              produce technically-valid but ugly markdown.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-950">FAQ</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">Will formatting change how my document renders?</h3>
              <p>
                No — that&apos;s the core guarantee. The document is parsed and re-printed, so the
                HTML any renderer produces from the output is the same as from the input. The only
                changes are to the plain-text source.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Does my text leave the browser?</h3>
              <p>
                No. Parsing and printing run entirely client-side. Nothing is uploaded, logged, or
                stored.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Can I enforce this style automatically in a repo?</h3>
              <p>
                Yes — add Prettier (which formats <InlineCode>.md</InlineCode> files out of the
                box) or <InlineCode>remark-cli</InlineCode> with{' '}
                <InlineCode>remark-preset-lint-consistent</InlineCode> to your CI. This tool is the
                zero-setup version of the same idea.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Why did my HTML comment / footnote survive untouched?</h3>
              <p>
                Inline HTML and GFM footnotes are preserved verbatim — the formatter only
                restyles constructs it fully understands.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl bg-indigo-50 p-6">
          <h2 className="text-xl font-semibold text-gray-950">More markdown tools</h2>
          <p>
            <Link href="/markdown-to-html" className="text-indigo-700 underline">Markdown to HTML</Link>{' · '}
            <Link href="/markdown-to-pdf" className="text-indigo-700 underline">Markdown to PDF</Link>{' · '}
            <Link href="/readme-generator" className="text-indigo-700 underline">README generator</Link>{' · '}
            <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">Cheat sheet</Link>{' · '}
            <Link href="/" className="text-indigo-700 underline">Share markdown as a link</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
