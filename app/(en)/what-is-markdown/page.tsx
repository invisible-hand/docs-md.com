import Link from 'next/link';
import ContentPage from '@/components/ContentPage';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import UpdatedLine from '@/components/UpdatedLine';
import { pageMetadata } from '@/lib/page-metadata';
import { pageDate } from '@/lib/page-dates';

const UPDATED = pageDate('/what-is-markdown');

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
  {
    q: 'Is plain text valid Markdown?',
    a: 'Yes. A paragraph of ordinary text with no symbols at all is valid Markdown: the CommonMark specification defines a paragraph as a sequence of non-blank lines that cannot be interpreted as any other kind of block. Markdown only adds meaning to a few characters (#, *, -, >, backticks, brackets); everything else passes through unchanged.',
  },
  {
    q: 'Who created Markdown?',
    a: 'John Gruber published Markdown on his site Daring Fireball on 15 March 2004, as a plain-text formatting syntax and a Perl script that converts it to HTML. Aaron Swartz worked with him on the syntax and wrote html2text, the reverse converter. Version 1.0.1, still the reference release, is dated 17 December 2004.',
  },
  {
    q: 'How do you create a Markdown file?',
    a: 'Open any text editor, type the text with Markdown symbols where you want formatting, and save the file with the .md extension (for example notes.md). There is no special program to install. To see it rendered, open the file in a Markdown viewer, a code editor with preview, or on GitHub.',
  },
  {
    q: 'Why do AI tools answer in Markdown?',
    a: 'Because Markdown is plain text, so a model can produce it one token at a time and a chat window can render it as it streams. Headings, lists, bold text and code fences give an answer structure with a few characters, and the same text pastes cleanly into editors, issues and notes. Models also learned the syntax from the READMEs, forums and documentation in their training data, where it is the dominant lightweight format.',
  },
];

export default function WhatIsMarkdownPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'What is Markdown? Markdown files and the .md format explained',
        description: metadata.description,
        dateModified: UPDATED,
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
      <UpdatedLine date={UPDATED} className="text-sm text-gray-500" />
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
            <MarkdownRenderer content={SAMPLE} headingOffset={1} />
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
        <h2 className="text-xl font-semibold text-gray-950">Is plain text valid Markdown?</h2>
        <p>
          Yes. A paragraph of ordinary text with no symbols in it is already valid Markdown. The{' '}
          <a href="https://spec.commonmark.org/0.31.2/#paragraphs" className="text-indigo-700 underline" rel="noopener">
            CommonMark specification
          </a>{' '}
          defines a paragraph as &quot;a sequence of non-blank lines that cannot be interpreted as other
          kinds of blocks&quot;, so a plain sentence renders as a plain sentence. Markdown attaches meaning
          to only a handful of characters — <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">#</code>,{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">*</code>,{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">-</code>,{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">&gt;</code>, backticks and brackets — and
          leaves everything else alone. That is why any .txt file can be renamed .md and nothing breaks,
          and why a Markdown file is readable in an editor with no preview at all. The one thing to know:
          a single line break inside a paragraph does not start a new line; leave a blank line between
          paragraphs (see the{' '}
          <Link href="/guides/markdown-new-line" className="text-indigo-700 underline">
            new line guide
          </Link>
          ).
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
          on this site, with no install. An AI agent can publish it to{' '}
          <Link href="/agents" className="text-indigo-700 underline">
            Docs MD
          </Link>{' '}
          to give you a shareable link, and you can{' '}
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
        <h2 className="text-xl font-semibold text-gray-950">How do you create a Markdown file?</h2>
        <p>
          Open any text editor — Notepad, TextEdit in plain-text mode, VS Code, or the{' '}
          <Link href="/markdown-viewer" className="text-indigo-700 underline">
            Markdown viewer on this site
          </Link>{' '}
          — type your text with Markdown symbols where you want formatting, and save the file with
          the <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">.md</code> extension, for example{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">notes.md</code>. There is nothing to
          install and no template to start from; the sample at the top of this page is a complete
          Markdown file. To check the result, open it in the{' '}
          <Link href="/markdown-viewer" className="text-indigo-700 underline">
            Markdown viewer
          </Link>
          , and if a tool wants a different format,{' '}
          <Link href="/markdown-to-word" className="text-indigo-700 underline">
            convert it to Word
          </Link>{' '}
          or PDF. Many apps also create the file for you: Google Docs (File → Download → Markdown),
          Notion and Apple Notes have an{' '}
          <Link href="/guides/export-as-markdown" className="text-indigo-700 underline">
            Export as Markdown
          </Link>{' '}
          option, and every Obsidian note is a .md file on disk.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">Who created Markdown?</h2>
        <p>
          John Gruber, who announced it on his site Daring Fireball on 15 March 2004 in{' '}
          <a href="https://daringfireball.net/2004/03/introducing_markdown" className="text-indigo-700 underline" rel="noopener">
            &quot;Introducing Markdown&quot;
          </a>
          : a plain-text formatting syntax plus a Perl script that converts it to HTML, inspired by the
          conventions of plain-text email. Aaron Swartz worked with him on the syntax — in his own words,
          the two &quot;pored over the syntax details from top to bottom&quot; — and wrote html2text, the
          converter that runs the other way. The{' '}
          <a href="https://daringfireball.net/projects/markdown/" className="text-indigo-700 underline" rel="noopener">
            Markdown project page
          </a>{' '}
          still hosts the original syntax description and version 1.0.1 from 17 December 2004. Gruber
          never versioned the syntax further; the ambiguities were pinned down later by the CommonMark
          specification, and GitHub, Slack, Discord and others added their own{' '}
          <Link href="/markdown-flavors" className="text-indigo-700 underline">
            flavors
          </Link>{' '}
          on top.
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
        <h2 className="text-xl font-semibold text-gray-950">Why do AI tools answer in Markdown?</h2>
        <p>
          Because it is plain text: a model can produce it one token at a time and the chat window can
          render headings, lists, bold text and code fences as they stream in, with only a few extra
          characters. The same text pastes cleanly into editors, issues and notes, and the models learned
          the syntax from the READMEs, forums and documentation in their training data, where it is the
          dominant lightweight format. If you want the answer without the symbols, the{' '}
          <Link href="/markdown-for-ai-output" className="text-indigo-700 underline">
            Markdown for AI output
          </Link>{' '}
          sheet shows how to read, strip or keep it.
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
