import Link from 'next/link';
import MarkdownLint from '@/components/tools/MarkdownLint';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('markdown-lint');

const FAQ = [
  {
    q: 'What does a markdown linter check?',
    a: 'Structural and style problems that renderers will not warn you about: heading levels that skip, a missing space after #, multiple H1s, inconsistent list markers, trailing spaces, hard tabs, bare URLs, fenced code without a language, images without alt text, and links with an empty destination. This tool implements 19 rules named after their markdownlint equivalents.',
  },
  {
    q: 'Is this the same as markdownlint?',
    a: 'It follows the same rule ids and intent (MD001, MD022, MD034 and so on) so findings map directly to markdownlint configuration, but it is an independent browser implementation with a curated subset of the rules. For CI, use markdownlint-cli2 with a config that mirrors what you enable here.',
  },
  {
    q: 'Which problems can be fixed automatically?',
    a: 'Anything whose fix is a local, safe edit: trailing spaces, tabs, extra blank lines, the space after #, blank lines around headings and code fences, trailing punctuation in headings, bare URLs (wrapped in angle brackets), list marker consistency, setext-to-ATX headings, and the final newline. Findings that need a human decision — duplicate headings, skipped levels, missing alt text, empty links — are reported only.',
  },
  {
    q: 'Why does it flag two trailing spaces as fine?',
    a: 'Two trailing spaces are the original markdown syntax for a hard line break, so by default exactly two are allowed and any other count is flagged. Turn the toggle off to flag every trailing space, which is what you want if you use backslash line breaks instead.',
  },
  {
    q: 'Does my document get uploaded?',
    a: 'No. Parsing, linting, and fixing all run in your browser; the page makes no network requests with your text.',
  },
];

export default function MarkdownLintPage() {
  return (
    <ToolPage
      slug="markdown-lint"
      intro="Paste a document or open a .md file and get a list of everything that would trip a strict renderer or a markdownlint run: heading problems, list and spacing inconsistencies, bare URLs, missing alt text, empty links. Every finding is explained, most can be fixed with one click, and the whole thing runs in your browser."
      tool={<MarkdownLint />}
      faq={FAQ}
    >
      <section className="space-y-3">
        <h2 className={H2}>How does the linter decide what is a problem?</h2>
        <p>
          Two passes. A line scanner catches things that are about the source text itself —
          trailing whitespace, tabs, blank-line runs, <code className={CODE}>#Heading</code> without a
          space, fences without a language. Then the document is parsed with the same GFM parser
          that renders shares on this site, and the syntax tree is checked for structure: heading
          levels that jump, duplicate or multiple H1 headings, list markers that switch between{' '}
          <code className={CODE}>-</code>, <code className={CODE}>*</code>, and <code className={CODE}>+</code>,
          bare URLs, empty links, and images with no alt text. Code blocks are skipped by the
          line rules, so a tab inside a snippet is never reported.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>What should I fix first?</h2>
        <p>
          Errors before warnings. The errors — a missing space after <code className={CODE}>#</code>,
          more than one H1, a link with an empty destination — change what readers see. The
          warnings are consistency and accessibility: they matter for maintainability, for
          screen-reader users, and for tooling such as the{' '}
          <Link href="/markdown-toc-generator" className="text-indigo-700 underline">
            table of contents generator
          </Link>
          , which depends on a clean heading outline. If the document is messy across the board,
          run the{' '}
          <Link href="/markdown-formatter" className="text-indigo-700 underline">
            formatter
          </Link>{' '}
          first; it normalises list markers, emphasis, and table alignment in one go, and the
          linter will then be left with the structural findings only.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>Which rules are included?</h2>
        <p>
          MD001 heading increment, MD003 heading style, MD004 list marker style, MD009 trailing
          spaces, MD010 hard tabs, MD012 multiple blank lines, MD018 and MD019 spacing after{' '}
          <code className={CODE}>#</code>, MD022 blank lines around headings, MD024 duplicate
          headings, MD025 single H1, MD026 trailing punctuation, MD031 blank lines around fences,
          MD034 bare URLs, MD040 fence language, MD041 first-line heading, MD042 empty links,
          MD045 alt text, and MD047 final newline. Each can be muted from the findings panel or
          the rule list under the tool. See the{' '}
          <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">
            cheat sheet
          </Link>{' '}
          for the syntax every rule assumes.
        </p>
      </section>
    </ToolPage>
  );
}
