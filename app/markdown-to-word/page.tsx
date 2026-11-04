import Link from 'next/link';
import { ToolGuideLinks } from '@/components/ToolGuidePage';
import MarkdownWord from '@/components/tools/MarkdownWord';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('markdown-to-word');

export default function MarkdownToWordPage() {
  return (
    <ToolPage
      slug="markdown-to-word"
      intro={
        <>
          Both directions of the eternal handoff: turn markdown into a{' '}
          <strong>.doc file that opens in Word</strong> with headings, tables, lists, and code
          styled — or paste formatted text <em>from</em> Word and get clean markdown back. The
          conversion runs entirely in your browser; the document is never uploaded.
        </>
      }
      tool={<MarkdownWord />}
      faq={[
        {
          q: 'Which file format is the download?',
          a: 'A .doc file: the markdown is rendered to HTML and wrapped in a Word-compatible envelope that Word has opened natively for twenty years. Open it, then use Save As → .docx if you want a native document.',
        },
        {
          q: 'Why does Word show a compatibility prompt?',
          a: 'Some Word versions warn when a .doc file contains HTML-based content. Click through; the document opens with its headings, tables, lists and code intact. Saving as .docx removes the prompt for anyone you send it to.',
        },
        {
          q: 'Do images survive the trip from Word to markdown?',
          a: 'Images pasted from Word point at your local clipboard, so the markdown gets a placeholder you need to replace. Upload the image wherever the markdown will live and reference it with ![alt](path); the image syntax guide covers the options.',
        },
        {
          q: 'Is my document uploaded anywhere?',
          a: 'No. Both directions run in your browser: the markdown is rendered locally, and the Word paste is read from your clipboard and translated element by element on your machine.',
        },
      ]}
    >
      <section className="space-y-3">
        <h2 className={H2}>How does markdown to Word work?</h2>
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
        <h2 className={H2}>How does Word to markdown work?</h2>
        <p>
          When you copy from Word, the clipboard carries an HTML version of the selection. Pasting
          into the converter reads that HTML and translates it element by element — headings to{' '}
          <code className={CODE}>#</code>, bold to{' '}
          <code className={CODE}>**</code>, tables to GFM pipes — while discarding
          Word&apos;s styling noise (fonts, colors, margins), which is exactly what you want when
          the destination is a README or a docs site. Run the result through the{' '}
          <Link href="/markdown-formatter" className="text-indigo-700 underline">
            formatter
          </Link>{' '}
          for perfectly consistent output.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>What doesn&apos;t convert?</h2>
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

      <ToolGuideLinks tool="markdown-to-word" />
    </ToolPage>
  );
}
