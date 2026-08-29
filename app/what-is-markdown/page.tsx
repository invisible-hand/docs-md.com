import type { Metadata } from 'next';
import Link from 'next/link';
import ContentPage from '@/components/ContentPage';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export const metadata: Metadata = {
  title: 'What Is Markdown? And What Is a .md File?',
  description:
    'Markdown is a plain-text way to write formatted documents — **bold**, # headings, - lists. What .md files are, how to open one, why developers and AI tools standardized on it.',
};

const SAMPLE = `# Trip notes

**Flight** lands at *14:30* — then:

1. Pick up the rental car
2. Check in before 18:00

> Confirmation code: \`KX-42871\``;

const FAQ = [
  {
    q: 'What is markdown in simple terms?',
    a: 'Markdown is a way of writing formatted text using ordinary characters instead of buttons: **asterisks** for bold, # for headings, - for lists. The file stays plain text, and any markdown-aware app renders it with real formatting.',
  },
  {
    q: 'What is a .md file?',
    a: 'A .md (or .markdown) file is just a plain text file whose content uses markdown syntax. It opens in any text editor — Notepad, TextEdit, VS Code — and renders as a formatted document in markdown viewers, on GitHub, or on a share link.',
  },
  {
    q: 'How do you open a markdown file?',
    a: 'To edit: any text editor. To see it rendered: GitHub or an editor with preview (VS Code: Cmd/Ctrl+Shift+V), or paste it into docs-md.com to view and share it rendered — no install needed.',
  },
  {
    q: 'Is markdown the same everywhere?',
    a: 'The core (headings, emphasis, lists, links, code) is universal, standardized as CommonMark. Most sites add GitHub Flavored Markdown extensions — tables, task lists, strikethrough. Chat apps like Slack and Discord use their own dialects.',
  },
];

export default function WhatIsMarkdownPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'What is markdown? And what is a .md file?',
        description: metadata.description,
        dateModified: '2026-08-29',
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: 'https://docs-md.com/what-is-markdown',
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
  return (
    <ContentPage
      title="What is markdown?"
      description="Markdown is a plain-text way to write formatted documents: a few punctuation conventions — **bold**, # headings, - lists — that stay readable as raw text and render as rich formatting."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="space-y-4">
        <p>
          <strong>Markdown</strong> is a lightweight markup language created by John Gruber and
          Aaron Swartz in 2004. Instead of clicking formatting buttons, you type conventions
          straight into the text — <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">**bold**</code>,{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm"># heading</code>,{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">- list item</code> — and any markdown-aware app turns them
          into formatted output. The design goal, in Gruber&apos;s words, was text that&apos;s
          publishable as-is: readable even when it never gets rendered.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">You type</p>
            <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm text-gray-800">{SAMPLE}</pre>
          </div>
          <div className="rounded-2xl border border-gray-200 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Readers see</p>
            <MarkdownRenderer content={SAMPLE} />
          </div>
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">What is a .md file?</h2>
        <p>
          A file ending in <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">.md</code> (or{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">.markdown</code>) is a plain text file written in markdown —
          nothing more. There&apos;s no special format to decode and no app that owns it: it opens in
          Notepad, renders on GitHub (every repository&apos;s{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">README.md</code> is one), and diffs cleanly in version
          control. That durability is the point — a .md file from 2004 still opens perfectly today.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">How do you open and view a markdown file?</h2>
        <p>
          To <em>edit</em>: any text editor. To <em>view it rendered</em>: VS Code&apos;s built-in
          preview (Cmd/Ctrl+Shift+V), GitHub, Obsidian — or paste it into the{' '}
          <Link href="/" className="text-indigo-700 underline">
            editor on this site
          </Link>{' '}
          to see it rendered instantly and get a shareable link, with no install. From there you can
          also{' '}
          <Link href="/markdown-to-pdf" className="text-indigo-700 underline">
            convert it to PDF
          </Link>{' '}
          or{' '}
          <Link href="/markdown-to-html" className="text-indigo-700 underline">
            to HTML
          </Link>
          .
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">Why did developers and AI tools standardize on markdown?</h2>
        <p>
          Because plain text wins everywhere it matters: it works in git, survives every platform,
          and is trivial for programs to generate. That last property made markdown the native
          output format of AI assistants — ChatGPT, Claude, and coding agents all emit it, and
          AI IDEs read and write <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">.md</code> context files. Writing,
          docs sites, note apps (Obsidian, Notion), forums (Reddit, Discord in dialect form), and
          READMEs all converged on the same syntax — learn it once, use it everywhere.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">How do you learn the syntax?</h2>
        <p>
          The core takes ten minutes: skim the{' '}
          <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">
            cheat sheet
          </Link>{' '}
          for every element with rendered examples, and use the{' '}
          <Link href="/guides" className="text-indigo-700 underline">
            guides
          </Link>{' '}
          when a specific question comes up — checkboxes, line breaks, comments, centering. Chat
          apps differ: see{' '}
          <Link href="/discord-markdown" className="text-indigo-700 underline">
            Discord
          </Link>{' '}
          and{' '}
          <Link href="/slack-markdown" className="text-indigo-700 underline">
            Slack
          </Link>
          .
        </p>
      </section>
    </ContentPage>
  );
}
