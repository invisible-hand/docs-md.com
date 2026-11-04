import Link from 'next/link';
import { ToolGuideLinks } from '@/components/ToolGuidePage';
import MarkdownToHtml from '@/components/tools/MarkdownToHtml';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('markdown-to-html');

function InlineCode({ children }: { children: string }) {
  return <code className={CODE}>{children}</code>;
}

export default function MarkdownToHtmlPage() {
  return (
    <ToolPage
      slug="markdown-to-html"
      intro="Paste markdown on the left and get clean, semantic HTML on the right — updated as you type. Supports the full GitHub Flavored Markdown spec: tables, task lists, strikethrough, and fenced code blocks. Copy the fragment for embedding, or download a complete styled HTML document."
      tool={<MarkdownToHtml />}
      related={['markdown-formatter', 'markdown-to-pdf', 'markdown-table-generator', 'markdown-cheat-sheet']}
      faq={[
        {
          q: 'Is my markdown uploaded anywhere?',
          a: 'No. The parser runs as JavaScript in your browser tab; your text never touches a server. You can disconnect from the internet after the page loads and the converter keeps working.',
        },
        {
          q: 'Why does the code in my output have no colors?',
          a: 'Syntax highlighting is a styling concern, not a markup concern. The converter tags each code block with its language (language-js etc.) so any highlighter can colorize it — add highlight.js or Prism to the page where the HTML lives.',
        },
        {
          q: 'Can I convert HTML back to markdown?',
          a: "Not with this tool — it's one-directional. Use the HTML to markdown converter on this site for the reverse, or libraries like turndown or rehype-remark in code.",
        },
        {
          q: 'Is there a size limit?',
          a: 'Practically no — conversion is local, so it handles book-length documents. Very large inputs (megabytes) may make typing feel slower since the preview re-converts as you type.',
        },
      ]}
    >
      <section className="space-y-4">
        <h2 className={H2}>What the converter outputs</h2>
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
        <h2 className={H2}>Fragment vs. full document</h2>
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
        <h2 className={H2}>Common uses</h2>
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
            <Link href="/" className="text-indigo-700 underline">Docs MD</Link> if you keep it
            as markdown instead.
          </li>
          <li>
            <strong>Debugging renderers</strong> — when a markdown file renders oddly, looking
            at the generated HTML usually explains why.
          </li>
        </ul>
      </section>

      <ToolGuideLinks tool="markdown-to-html" />
    </ToolPage>
  );
}
