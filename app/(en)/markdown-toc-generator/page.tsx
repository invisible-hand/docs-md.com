import Link from 'next/link';
import { ToolGuideLinks } from '@/components/ToolGuidePage';
import TocGenerator from '@/components/tools/TocGenerator';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('markdown-toc-generator');

export default function TocGeneratorPage() {
  return (
    <ToolPage
      slug="markdown-toc-generator"
      intro="Paste a markdown document and get a linked table of contents built from its headings — with anchor slugs generated exactly the way GitHub does it, so every link works in your README. Nothing leaves your browser."
      tool={<TocGenerator />}
      related={['readme-generator', 'markdown-formatter', 'markdown-link-generator', 'markdown-cheat-sheet']}
      faq={[
        {
          q: 'Will the links work on GitHub?',
          a: 'Yes. Anchors are built with github-slugger, the same algorithm GitHub uses for heading ids: lowercase, spaces to hyphens, punctuation dropped, and -1, -2… added to duplicate headings. The links also work on GitLab, npm and most static-site generators that follow the same rules.',
        },
        {
          q: 'Which heading levels should the TOC include?',
          a: 'You choose the depth. For a README, H2–H3 keeps the list scannable; include H4 and deeper only for long reference documents. The document title (H1) is left out because the TOC sits directly under it.',
        },
        {
          q: 'Are headings inside code blocks counted?',
          a: 'No. Lines that start with # inside a fenced code block are code, not headings, and are skipped. Markdown formatting inside a heading (bold, inline code, links) is stripped from the link text but kept in the anchor the way GitHub computes it.',
        },
        {
          q: 'Is my document uploaded anywhere?',
          a: 'No. The headings are parsed in your browser; the text never leaves your machine. The Insert into document button edits your pasted copy locally so you can copy the finished file back out.',
        },
      ]}
    >
      <section className="space-y-3">
        <h2 className={H2}>How do the anchor links work?</h2>
        <p>
          Every heading in rendered markdown gets an HTML id: the text lowercased, spaces turned
          into hyphens, punctuation dropped, and a <code className={CODE}>-1</code>,{' '}
          <code className={CODE}>-2</code>… suffix added to duplicates. This tool uses{' '}
          <code className={CODE}>github-slugger</code> — the same algorithm GitHub uses —
          so <code className={CODE}>## Getting Started!</code> correctly becomes{' '}
          <code className={CODE}>#getting-started</code>. Headings inside code fences are
          ignored, and markdown formatting inside headings is stripped from the link text.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>Where should the TOC go?</h2>
        <p>
          Convention: directly under the H1 title, headed &ldquo;Table of contents&rdquo; — which
          is exactly what the <em>Insert into document</em> button does. For long READMEs,
          limiting depth to H2–H3 keeps it scannable; go deeper only for reference docs. GitHub
          also auto-generates a TOC in the file header menu, but an inline one still helps
          readers on npm, crates.io, and anywhere else the README is mirrored. See{' '}
          <Link href="/guides/markdown-link" className="text-indigo-700 underline">how markdown links work</Link>{' '}
          for the anchor syntax itself, and{' '}
          <Link href="/" className="text-indigo-700 underline">share the finished doc</Link> when it is done.
        </p>
      </section>

      <ToolGuideLinks tool="markdown-toc-generator" />
    </ToolPage>
  );
}
