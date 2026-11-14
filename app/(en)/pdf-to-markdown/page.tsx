import Link from 'next/link';
import { ToolGuideLinks } from '@/components/ToolGuidePage';
import PdfToMarkdown from '@/components/tools/PdfToMarkdown';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('pdf-to-markdown');

export default function PdfToMarkdownPage() {
  return (
    <ToolPage
      slug="pdf-to-markdown"
      intro="Drop a PDF and get clean, editable markdown. The converter reads the text layer directly in your browser — nothing is uploaded anywhere — and infers structure from the layout: larger text becomes headings, bullet glyphs become list items, line wraps are joined back into paragraphs, and end-of-line hyphenation is undone."
      tool={<PdfToMarkdown />}
      faq={[
        {
          q: 'Is the PDF uploaded to a server?',
          a: 'No. The file is opened and read in your browser tab; the text never leaves your machine, so confidential contracts and internal reports are safe to convert.',
        },
        {
          q: 'How are headings and lists detected?',
          a: 'The converter measures font sizes to find the body text, promotes noticeably larger lines to # headings, splits paragraphs on vertical gaps and turns bullet characters (•, ◦, –) into list items. Because the structure is inferred, skim the result and fix any heading level that looks off.',
        },
        {
          q: 'Does it work on scanned PDFs?',
          a: 'Not yet. A scan is a photograph of a page with no text layer, so extracting text would need OCR, which this tool skips to stay fast and fully private. PDFs exported from Word, Google Docs, LaTeX or a design tool convert fine.',
        },
        {
          q: 'What about multi-column layouts and tables?',
          a: 'Columns can interleave because the text is read in the order the PDF stores it, and tables are not detected as tables. Rebuild a table with the markdown table generator and tidy the rest with the formatter.',
        },
      ]}
    >
      <section className="space-y-3">
        <h2 className={H2}>How does the conversion work?</h2>
        <p>
          PDFs don&apos;t store paragraphs or headings — only characters positioned on a page. The
          converter groups characters into lines, measures font sizes to find the document&apos;s
          body text, and promotes noticeably larger lines to <code className={CODE}># headings</code>.
          Vertical gaps split paragraphs; bullet characters (•, ◦, –) become markdown list items.
          Because that structure is inferred, skim the output — a subtitle may need its heading
          level adjusted, and multi-column layouts can interleave.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>Why is my PDF producing no text?</h2>
        <p>
          Scanned PDFs are photographs of pages — there is no text layer to extract, and turning
          them into text requires OCR, which this tool deliberately skips to stay fast and fully
          private. If the PDF was produced digitally (exported from Word, Google Docs, LaTeX, or
          a design tool), the text layer is there and conversion works.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>What should you do with the markdown?</h2>
        <p>
          Clean it up with the{' '}
          <Link href="/markdown-formatter" className="text-indigo-700 underline">
            markdown formatter
          </Link>
          , check any syntax you&apos;re unsure of on the{' '}
          <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">
            cheat sheet
          </Link>
          , or ask your AI agent to{' '}
          <Link href="/agents" className="text-indigo-700 underline">
            publish it to Docs MD
          </Link>{' '}
          as a live link. Going the other direction? Use the{' '}
          <Link href="/markdown-to-pdf" className="text-indigo-700 underline">
            markdown to PDF converter
          </Link>
          .
        </p>
      </section>

      <ToolGuideLinks tool="pdf-to-markdown" />
    </ToolPage>
  );
}
