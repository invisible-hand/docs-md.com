import Link from 'next/link';
import WordCounter from '@/components/tools/WordCounter';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('markdown-word-counter');

const FAQ = [
  {
    q: 'How do you count words in markdown?',
    a: 'The document is parsed, and only the prose is counted: paragraph, heading, list, and table text. Code blocks, inline code, URLs, raw HTML, and YAML front matter are excluded, and link text is counted but link destinations are not. The raw-source count is shown next to it so you can see how much the syntax adds.',
  },
  {
    q: 'Why is the prose word count lower than my editor shows?',
    a: 'Editors count every whitespace-separated token in the file, so a fenced code block, a long URL, and the front matter all inflate the number. This tool reports what a reader would actually read. Toggle "Count image alt text" if your alt text is substantial.',
  },
  {
    q: 'How is reading time calculated?',
    a: 'Prose words divided by 238 words per minute, the average adult silent reading speed measured across studies, rounded to the nearest 10 seconds. Change the speed for technical material (slower) or skimming (faster). Speaking time uses 150 words per minute.',
  },
  {
    q: 'What counts as a sentence or a paragraph?',
    a: 'A sentence ends at a period, question mark, or exclamation mark followed by whitespace; headings and list items count as one sentence each. A paragraph is any block of text separated by a blank line.',
  },
  {
    q: 'Is my text uploaded anywhere?',
    a: 'No. Parsing and counting happen in your browser; the page makes no network requests with your document.',
  },
];

export default function WordCounterPage() {
  return (
    <ToolPage
      slug="markdown-word-counter"
      intro="Paste a README, article, or spec and get word, character, sentence, and paragraph counts that ignore markdown syntax, code blocks, and URLs — next to the raw numbers, so you can see the difference. Reading time, top words, keyword density, and a per-section breakdown help you balance a document, and a target bar tracks progress toward a length goal."
      tool={<WordCounter />}
      faq={FAQ}
    >
      <section className="space-y-3">
        <h2 className={H2}>What is the difference between prose and raw counts?</h2>
        <p>
          Raw counts treat the file as text: every token between spaces is a word, including{' '}
          <code className={CODE}>```ts</code>, <code className={CODE}>https://…</code>, and the{' '}
          <code className={CODE}>---</code> lines of front matter. Prose counts come from the parsed
          document — the same GFM parser used across these tools — and include only what a
          reader would read. For a README with a few code samples the two numbers can differ by
          a third; for documentation with large snippets, by more.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>How do I use the per-section counts?</h2>
        <p>
          Every heading starts a section, and the outline shows how many prose words sit under
          each one. A 900-word section next to three 40-word sections usually means the long one
          wants splitting or the short ones are placeholders. The structure row does the same
          for headings by level, links, images, code blocks, tables, and task-list progress. If
          the heading outline itself looks off, the{' '}
          <Link href="/markdown-lint" className="text-indigo-700 underline">
            linter
          </Link>{' '}
          will point at skipped levels and duplicate titles.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>What is keyword density for?</h2>
        <p>
          Type a word or phrase and the tool reports how many times it occurs in the prose and
          what share of all words it makes up. It is a quick check that a page about one topic
          actually names that topic, and that it does not repeat a phrase so often that it reads
          as stuffing — anything above a few percent for a multi-word phrase is a lot. Top words
          (with common stop words hidden) show the same thing without you having to guess the
          phrase. When the document is ready, the{' '}
          <Link href="/" className="text-indigo-700 underline">
            share tool
          </Link>{' '}
          turns it into a link, and the{' '}
          <Link href="/markdown-to-pdf" className="text-indigo-700 underline">
            PDF converter
          </Link>{' '}
          into a file.
        </p>
      </section>
    </ToolPage>
  );
}
