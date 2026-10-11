import Link from 'next/link';
import ContentPage from '@/components/ContentPage';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata({
  title: 'What Is Markdown? The .md File Format Explained',
  description:
    'A .md file is a plain-text file written in Markdown. Learn what Markdown is, how to open a .md file, and how .md, .markdown and .mdx differ.',
  path: '/what-is-markdown',
  type: 'article',
});

const SAMPLE = `# Trip notes

**Flight** lands at *14:30* — then:

1. Pick up the rental car
2. Check in before 18:00

> Confirmation code: \`KX-42871\``;

const FAQ = [
  {
    q: 'What is a .md file?',
    a: 'A .md file is a plain text file written in Markdown syntax. It opens in any text editor and renders as formatted text on GitHub, in editors with preview, and in Markdown viewers.',
  },
  {
    q: 'How do I open a .md file?',
    a: 'To read or edit the raw text, use any text editor: Notepad on Windows, TextEdit on Mac, or VS Code. To see it formatted, use the VS Code preview (Cmd/Ctrl+Shift+V), view it on GitHub, or open it in the browser-based Markdown viewer on this site.',
  },
  {
    q: 'Is .md the same as Markdown?',
    a: 'Not exactly. Markdown is the writing syntax. .md is the most common file extension for text written in that syntax. The same syntax can also be saved as .markdown or .mdown, and most tools treat those like .md.',
  },
  {
    q: 'What is markdown in simple terms?',
    a: 'Markdown is a way of writing formatted text using ordinary characters instead of buttons: **asterisks** for bold, # for headings, - for lists. The file stays plain text, and any markdown-aware app renders it with real formatting.',
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
        headline: 'What is Markdown? The .md file format explained',
        description: metadata.description,
        dateModified: '2026-10-11',
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
      title="What is Markdown? The .md file format explained"
      description="A .md file is a plain-text file written in Markdown. It opens in any text editor and renders as formatted text on GitHub, in editors and in viewers. Markdown itself is the syntax inside: asterisks for bold, # for headings, dashes for lists."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="space-y-4">
        <p>
          A <strong>.md file</strong> is a plain text file written in Markdown, and Markdown is
          a lightweight markup language created by John Gruber and Aaron Swartz in 2004. Instead of clicking formatting buttons, you type conventions
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
          A <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">.md</code> file is a plain text file written in Markdown syntax.
          It opens in any text editor and renders as formatted text on GitHub, in editors with
          preview, and in Markdown viewers. There&apos;s no special format to decode and no app that
          owns it. Every repository&apos;s <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">README.md</code> is one, and
          .md files diff cleanly in version control. A .md file from 2004 still opens today.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">Markdown file extensions: .md, .markdown, .mdx</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-950">
                <th className="py-2 pr-4 font-semibold">Extension</th>
                <th className="py-2 font-semibold">What it is</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4"><code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">.md</code></td>
                <td className="py-2">The most common extension for Markdown files.</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4"><code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">.markdown</code></td>
                <td className="py-2">The same content with the long extension. Treated like .md by most tools.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">.mdx</code></td>
                <td className="py-2">Markdown that also allows JSX components. Needs a build step; plain viewers show it as text.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">How to open a .md file</h2>
        <p>
          To <em>edit</em>: Notepad on Windows, TextEdit on Mac (plain text mode), or any code
          editor. To <em>view it rendered</em>: VS Code&apos;s built-in preview (Cmd/Ctrl+Shift+V),
          GitHub, Obsidian, or the browser-based{' '}
          <Link href="/markdown-viewer" className="text-indigo-700 underline">
            Markdown viewer
          </Link>{' '}
          on this site, with no install. You can also paste it into the{' '}
          <Link href="/" className="text-indigo-700 underline">
            editor
          </Link>{' '}
          to get a shareable link, and{' '}
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
