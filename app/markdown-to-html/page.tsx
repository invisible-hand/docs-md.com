import type { Metadata } from 'next';
import Link from 'next/link';
import MarkdownToHtml from '@/components/tools/MarkdownToHtml';

export const metadata: Metadata = {
  title: 'Markdown to HTML Converter — Free Online Tool',
  description:
    'Convert markdown to clean HTML in your browser: GFM tables, task lists, and code blocks supported. Copy the HTML or download a complete styled document. No signup.',
};

function InlineCode({ children }: { children: string }) {
  return <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">{children}</code>;
}

export default function MarkdownToHtmlPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
          Markdown to HTML converter
        </h1>
        <p className="mt-4 text-base text-gray-600">
          Paste markdown on the left and get clean, semantic HTML on the right — updated as you
          type. Supports the full GitHub Flavored Markdown spec: tables, task lists, strikethrough,
          and fenced code blocks. Copy the fragment for embedding, or download a complete styled
          HTML document.
        </p>
      </div>

      <MarkdownToHtml />

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-950">What the converter outputs</h2>
          <p>
            The conversion uses the same parser pipeline that powers GitHub&apos;s own rendering
            stack (<InlineCode>remark</InlineCode> + <InlineCode>rehype</InlineCode> from the
            unified ecosystem), so the HTML you get matches what you see on GitHub:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Headings become <InlineCode>{'<h1>'}</InlineCode>–<InlineCode>{'<h6>'}</InlineCode>,
              paragraphs become <InlineCode>{'<p>'}</InlineCode> — semantic tags, no wrapper divs
              or inline styles polluting the output.
            </li>
            <li>
              GFM tables become real <InlineCode>{'<table>'}</InlineCode> elements with{' '}
              <InlineCode>{'<thead>'}</InlineCode> and alignment attributes preserved.
            </li>
            <li>
              Fenced code blocks become <InlineCode>{'<pre><code class="language-…">'}</InlineCode>{' '}
              — ready for any syntax highlighter (highlight.js, Prism, Shiki) to pick up.
            </li>
            <li>
              Task lists become checkboxes, <InlineCode>~~strikethrough~~</InlineCode> becomes{' '}
              <InlineCode>{'<del>'}</InlineCode>, and autolinks become real anchors.
            </li>
            <li>
              Inline HTML in your markdown passes through unchanged — handy for{' '}
              <InlineCode>{'<br>'}</InlineCode>, <InlineCode>{'<details>'}</InlineCode>, or
              embedded iframes.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-950">Fragment vs. full document</h2>
          <p>
            By default you get an HTML <strong>fragment</strong> — just the converted content,
            ready to paste into an existing page, a CMS body field, an email template, or a
            server-side include. Tick <em>Wrap in a full HTML document</em> and the output becomes
            a standalone file with a doctype, viewport meta tag, your page title, and a small
            embedded stylesheet that mimics GitHub&apos;s typography. That file opens directly in
            any browser and is a reasonable starting point for a one-page site.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-950">Common uses</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Email newsletters</strong> — write in markdown, convert, paste the fragment
              into your email tool&apos;s HTML editor.
            </li>
            <li>
              <strong>CMS content</strong> — many older CMSes accept raw HTML but not markdown.
            </li>
            <li>
              <strong>Static pages</strong> — the full-document mode produces a self-contained
              page you can host anywhere, including on{' '}
              <Link href="/" className="text-indigo-700 underline">MD Share</Link> if you keep it
              as markdown instead.
            </li>
            <li>
              <strong>Debugging renderers</strong> — when a markdown file renders oddly, looking
              at the generated HTML usually explains why.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-950">FAQ</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">Is my markdown uploaded anywhere?</h3>
              <p>
                No. The parser runs as JavaScript in your browser tab; your text never touches a
                server. You can disconnect from the internet after the page loads and the
                converter keeps working.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Why does the code in my output have no colors?</h3>
              <p>
                Syntax highlighting is a styling concern, not a markup concern. The converter tags
                each code block with its language (<InlineCode>language-js</InlineCode> etc.) so
                any highlighter can colorize it — add highlight.js or Prism to the page where the
                HTML lives.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Can I convert HTML back to markdown?</h3>
              <p>
                Not with this tool — it&apos;s one-directional. For the reverse, look at libraries
                like <InlineCode>turndown</InlineCode> or <InlineCode>rehype-remark</InlineCode>.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Is there a size limit?</h3>
              <p>
                Practically no — conversion is local, so it handles book-length documents. Very
                large inputs (megabytes) may make typing feel slower since the preview re-converts
                as you type.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl bg-indigo-50 p-6">
          <h2 className="text-xl font-semibold text-gray-950">More markdown tools</h2>
          <p>
            <Link href="/markdown-formatter" className="text-indigo-700 underline">Markdown formatter</Link>{' · '}
            <Link href="/markdown-to-pdf" className="text-indigo-700 underline">Markdown to PDF</Link>{' · '}
            <Link href="/markdown-table-generator" className="text-indigo-700 underline">Table generator</Link>{' · '}
            <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">Cheat sheet</Link>{' · '}
            <Link href="/" className="text-indigo-700 underline">Share markdown as a link</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
