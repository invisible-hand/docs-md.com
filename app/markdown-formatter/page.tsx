import Link from 'next/link';
import MarkdownFormatter from '@/components/tools/MarkdownFormatter';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('markdown-formatter');

export default function MarkdownFormatterPage() {
  return (
    <ToolPage
      slug="markdown-formatter"
      intro="A markdown formatter (md formatter) takes messy markdown and returns a consistently formatted version: uniform list markers, one emphasis style, aligned tables, and normalized spacing. It parses your document and re-prints it, so the rendered result never changes — only the source gets cleaner. Paste, format, copy."
      tool={<MarkdownFormatter />}
      faq={[
        {
          q: 'What is an md formatter?',
          a: 'An md formatter (markdown formatter or beautifier) is a tool that rewrites the plain-text source of a .md file into one consistent style — one bullet marker, one emphasis character, aligned table pipes, standard spacing — without changing what the document renders as. This one runs entirely in your browser and is free.',
        },
        {
          q: 'Will formatting change how my document renders?',
          a: "No — that's the core guarantee. The document is parsed and re-printed, so the HTML any renderer produces from the output is the same as from the input. The only changes are to the plain-text source.",
        },
        {
          q: 'Does my text leave the browser?',
          a: 'No. Parsing and printing run entirely client-side. Nothing is uploaded, logged, or stored.',
        },
        {
          q: 'Can I enforce this style automatically in a repo?',
          a: 'Yes — add Prettier (which formats .md files out of the box) or remark-cli with remark-preset-lint-consistent to your CI. This tool is the zero-setup version of the same idea.',
        },
        {
          q: 'Why did my HTML comment or footnote survive untouched?',
          a: 'Inline HTML and GFM footnotes are preserved verbatim — the formatter only restyles constructs it fully understands.',
        },
      ]}
    >
      <section className="space-y-3">
        <h2 className={H2}>What does a markdown formatter normalize?</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>List markers</strong> — a document mixing <code className={CODE}>-</code>,{' '}
            <code className={CODE}>*</code>, and <code className={CODE}>+</code> bullets comes out
            using one marker of your choice, with consistent indentation for nested lists.
          </li>
          <li>
            <strong>Emphasis style</strong> — <code className={CODE}>*asterisks*</code> and{' '}
            <code className={CODE}>_underscores_</code> render identically, but mixing them in one
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
            <code className={CODE}>===</code>) become ATX headings (<code className={CODE}>#</code>),
            and stray spaces after the hashes are removed.
          </li>
          <li>
            <strong>Spacing</strong> — extra blank lines collapse, and blocks are separated by
            exactly one blank line, which some renderers require.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className={H2}>How is this different from find-and-replace?</h2>
        <p>
          The formatter is built on <code className={CODE}>remark</code>, the same parser used by
          Prettier&apos;s markdown support and thousands of documentation pipelines. Your text is
          parsed into a syntax tree and printed back out — which is why it can safely tell the
          difference between a <code className={CODE}>*</code> that starts a list item and a{' '}
          <code className={CODE}>*</code> inside a sentence, or between an underscore in{' '}
          <code className={CODE}>variable_name</code> and one that starts emphasis. A regex-based
          beautifier can&apos;t make those distinctions; a parser can.
        </p>
        <p>
          One consequence worth knowing: because the output is re-printed from the tree,
          insignificant quirks of your original source (trailing whitespace, inconsistent escape
          styles, indented vs. fenced code) are normalized to the standard form. If some exotic
          construct matters to your toolchain, diff the output before committing it.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className={H2}>When should you format markdown?</h2>
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
            <strong>Merging docs from multiple authors</strong> — unify everyone&apos;s habits into
            one house style.
          </li>
          <li>
            <strong>Cleaning up exports</strong> — Notion, Google Docs, and other exporters produce
            technically-valid but ugly markdown.
          </li>
        </ul>
      </section>
    </ToolPage>
  );
}
