import Link from 'next/link';
import MarkdownDiff from '@/components/tools/MarkdownDiff';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('markdown-diff');

const FAQ = [
  {
    q: 'How do I compare two markdown files?',
    a: 'Paste or drop the older version into Before and the newer one into After. The tool aligns the two line by line, marks added lines green, removed lines red, and changed lines amber with the exact words that differ highlighted. Switch to Unified for a patch-style view you can copy or download.',
  },
  {
    q: 'What is the difference between side-by-side and unified view?',
    a: 'Side-by-side shows both versions in aligned columns with line numbers from each file, which is easiest to read. Unified shows one column in the standard patch format with @@ hunk headers and +/- prefixes, which is what git and code review tools use and what you paste into an issue.',
  },
  {
    q: 'Can I ignore whitespace or case changes?',
    a: 'Yes. Ignore whitespace collapses runs of spaces and tabs and trims line ends before comparing, ignore case compares letters case-insensitively, and ignore blank lines drops empty lines from both sides. The visible text is unchanged; only the comparison is relaxed.',
  },
  {
    q: 'Does it show the rendered markdown, not just the source?',
    a: 'The Rendered view shows both versions rendered with GitHub-flavored markdown, tables, code highlighting, and mermaid diagrams, side by side, so you can check what readers actually see.',
  },
  {
    q: 'How large a document can it handle?',
    a: 'Thousands of lines comfortably. The line diff uses Myers algorithm, which is fast when the two versions mostly agree, and the word-level pass only runs on changed line pairs.',
  },
];

export default function MarkdownDiffPage() {
  return (
    <ToolPage
      slug="markdown-diff"
      intro="Paste two versions of a README, spec, or blog post and see exactly what changed: aligned side by side with word-level highlights, or as a unified patch you can paste into a pull request. Whitespace, case, and blank-line changes can be ignored, and the rendered view shows the difference the way a reader sees it."
      tool={<MarkdownDiff />}
      faq={FAQ}
    >
      <section className="space-y-3">
        <h2 className={H2}>How does the diff work?</h2>
        <p>
          Both documents are split into lines and compared with Myers&apos; shortest-edit-script
          algorithm — the one behind <code className={CODE}>git diff</code>. Runs of removed and
          added lines that sit next to each other are paired into changed rows, and those pairs
          get a second, word-level pass so a single edited word in a long paragraph is highlighted
          rather than the whole line. The similarity figure is the share of rows that are
          unchanged.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>When is a markdown-specific diff better than a generic text diff?</h2>
        <p>
          When you need to see the rendered result. Markdown source changes are often invisible
          in the output (a reflowed paragraph, a switched list marker) or the reverse — a
          one-character change like a missing space after <code className={CODE}>#</code> turns a
          heading into a paragraph. The Rendered view makes both cases obvious. For source-level
          cleanup that is not a meaningful change, run both versions through the{' '}
          <Link href="/markdown-formatter" className="text-indigo-700 underline">
            formatter
          </Link>{' '}
          first so the diff only shows real edits.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>Can I use the patch with git?</h2>
        <p>
          Yes. The unified output uses standard <code className={CODE}>---</code> /{' '}
          <code className={CODE}>+++</code> headers and <code className={CODE}>@@</code> hunks with three
          lines of context, so <code className={CODE}>git apply changes.patch</code> works if the file
          paths match your repository; rename the headers or use{' '}
          <code className={CODE}>patch -p1</code> otherwise. To check the result before committing,
          run it through the{' '}
          <Link href="/markdown-lint" className="text-indigo-700 underline">
            markdown linter
          </Link>
          .
        </p>
      </section>
    </ToolPage>
  );
}
