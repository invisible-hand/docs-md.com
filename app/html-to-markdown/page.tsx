import Link from 'next/link';
import HtmlToMarkdown from '@/components/tools/HtmlToMarkdown';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('html-to-markdown');

export default function HtmlToMarkdownPage() {
  return (
    <ToolPage
      slug="html-to-markdown"
      intro="Paste HTML source, or simply copy content from a web page, Google Doc, or Notion and paste it here — the rich-text clipboard arrives as HTML and is converted to GitHub-flavored markdown on the spot. Tables, code blocks, nested lists, task lists, and strikethrough all survive. Nothing is uploaded."
      tool={<HtmlToMarkdown />}
      faq={[
        {
          q: 'Does the converter handle tables?',
          a: 'Yes. HTML tables become GFM pipe tables with a header row and alignment separator. Merged cells (colspan/rowspan) have no markdown equivalent, so their contents are flattened into ordinary cells.',
        },
        {
          q: 'Can I paste a whole web page?',
          a: 'Yes. Select the page, copy, and paste into the source box. With "Strip scripts, styles, nav" on, script and style tags, navigation, headers, footers, and iframes are removed before conversion so you get the article, not the chrome.',
        },
        {
          q: 'What is the difference between inline and reference links?',
          a: 'Inline links put the URL right after the text: [text](url). Reference style puts a short label in the text and lists every URL at the bottom of the document, which keeps long paragraphs readable and is common in READMEs.',
        },
        {
          q: 'Why do some pasted documents lose their headings?',
          a: 'Word processors and some sites express headings as styled paragraphs (a <p> with a big font) rather than <h1>–<h6> tags. The converter only sees the tags, so those become plain paragraphs. Add the # marks by hand or use the markdown formatter afterwards.',
        },
        {
          q: 'Is the conversion done in my browser?',
          a: 'Yes. The page loads the turndown library on demand and runs it locally; the HTML never leaves your machine, and there is no size limit beyond what your browser can hold.',
        },
      ]}
    >
      <section className="space-y-3">
        <h2 className={H2}>How does HTML become markdown?</h2>
        <p>
          The converter walks the HTML document tree and replaces each element with its markdown
          equivalent: <code className={CODE}>{'<h2>'}</code> becomes <code className={CODE}>## </code>,{' '}
          <code className={CODE}>{'<strong>'}</code> becomes <code className={CODE}>**bold**</code>,{' '}
          <code className={CODE}>{'<ul><li>'}</code> becomes a bulleted list, and{' '}
          <code className={CODE}>{'<pre><code class="language-js">'}</code> becomes a fenced code block
          tagged with its language. Elements that markdown cannot express — spans with inline styles,
          divs, forms — are unwrapped so their text is kept and the wrapper is dropped. The result is
          the same GFM that GitHub renders, so it pastes straight into a README or a{' '}
          <Link href="/" className="text-indigo-700 underline">
            shared markdown link
          </Link>
          .
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>Which option should I pick for headings and bullets?</h2>
        <p>
          ATX headings (<code className={CODE}># Title</code>) are the modern default and the only style
          that supports six levels; setext headings underline a title with <code className={CODE}>===</code>{' '}
          or <code className={CODE}>---</code> and only reach two levels. For bullets, <code className={CODE}>-</code>{' '}
          is the most common marker in open-source projects and what most linters expect. If you need
          the output to match an existing document, run it through the{' '}
          <Link href="/markdown-formatter" className="text-indigo-700 underline">
            markdown formatter
          </Link>{' '}
          with that document&apos;s settings.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>What about the other direction?</h2>
        <p>
          The{' '}
          <Link href="/markdown-to-html" className="text-indigo-700 underline">
            markdown to HTML converter
          </Link>{' '}
          turns markdown back into a clean fragment or a complete styled document. For Word files use
          the{' '}
          <Link href="/markdown-to-word" className="text-indigo-700 underline">
            markdown to Word converter
          </Link>
          , which also accepts pasted Word content, and the{' '}
          <Link href="/pdf-to-markdown" className="text-indigo-700 underline">
            PDF to markdown converter
          </Link>{' '}
          handles PDFs.
        </p>
      </section>
    </ToolPage>
  );
}
