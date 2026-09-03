import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import CopyButton from '@/components/CopyButton';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import UpdatedLine from '@/components/UpdatedLine';

const UPDATED = '2026-09-01';

const FAQ = [
  {
    q: 'What is a markdown cheat sheet?',
    a: 'A one-page reference of every markdown element with the syntax and the rendered result side by side, so you can copy the exact characters instead of guessing. This one covers core markdown, GitHub Flavored Markdown (tables, task lists, strikethrough, footnotes), and mermaid diagrams.',
  },
  {
    q: 'How do I make text bold or italic in markdown?',
    a: 'Wrap text in double asterisks for bold (**bold**) and single asterisks or underscores for italic (*italic* or _italic_). Triple asterisks give bold italic. Underscores inside a word do not trigger emphasis on GitHub, so asterisks are the safer default.',
  },
  {
    q: 'How do I add a link or an image?',
    a: 'A link is [text](https://example.com) and an image is the same with a leading exclamation mark: ![alt text](image.png). Add a tooltip with a quoted title after the URL. Reference-style links ([text][id] plus [id]: url on its own line) keep long documents readable.',
  },
  {
    q: 'How do I write a code block?',
    a: 'Put the code between two lines of three backticks. Add a language name right after the opening backticks (```js) to get syntax highlighting. Use single backticks for inline code.',
  },
  {
    q: 'How do I make a table in markdown?',
    a: 'Separate columns with pipes and add a line of dashes under the header row. Colons in that separator line set alignment: :--- left, :---: center, ---: right. Tables are a GFM extension supported by GitHub, GitLab, and most renderers.',
  },
  {
    q: 'What is the difference between markdown and GitHub Flavored Markdown?',
    a: 'GitHub Flavored Markdown (GFM) is the original markdown plus tables, task lists, strikethrough, autolinks, and footnotes. Nearly every modern renderer supports GFM, so it is what people usually mean by "markdown". The formal spec underneath both is CommonMark.',
  },
];

export const metadata: Metadata = {
  title: 'Markdown Cheat Sheet — Complete Syntax Reference',
  description:
    'Every markdown element with live rendered examples: headings, emphasis, lists, links, images, code, tables, task lists, footnotes, mermaid. Copy a snippet.',
};

interface Snippet {
  label: string;
  code: string;
  note?: string;
  renderable?: boolean;
}

interface Section {
  id: string;
  title: string;
  gfm?: boolean;
  snippets: Snippet[];
}

const SECTIONS: Section[] = [
  {
    id: 'headings',
    title: 'Headings',
    snippets: [
      {
        label: 'Six levels',
        code: '# H1 — page title\n## H2 — section\n### H3 — subsection\n#### H4\n##### H5\n###### H6',
        note: 'One H1 per document is the convention. The alternative "underline" syntax (=== / ---) only covers H1 and H2 — the # form is preferred.',
      },
    ],
  },
  {
    id: 'emphasis',
    title: 'Emphasis',
    snippets: [
      {
        label: 'Bold, italic, both',
        code: '**bold** and *italic* and ***bold italic***',
        note: 'Underscores work too (__bold__, _italic_), but asterisks survive mid-word: fan**tas**tic.',
      },
      {
        label: 'Strikethrough (GFM)',
        code: '~~crossed out~~',
      },
    ],
  },
  {
    id: 'lists',
    title: 'Lists',
    snippets: [
      {
        label: 'Unordered',
        code: '- First item\n- Second item\n  - Nested (indent 2 spaces)\n- Third item',
      },
      {
        label: 'Ordered',
        code: '1. Step one\n2. Step two\n1. The numbers you type don\'t matter — renderers count for you',
      },
      {
        label: 'Task list (GFM)',
        code: '- [x] Ship the feature\n- [ ] Write the docs\n- [ ] Tell someone',
      },
    ],
  },
  {
    id: 'links-images',
    title: 'Links & images',
    snippets: [
      {
        label: 'Inline link',
        code: '[link text](https://docs-md.com "optional hover title")',
      },
      {
        label: 'Image',
        code: '![alt text describing the image](https://docs-md.com/favicon.ico)',
        note: 'An image is a link with a ! in front. Alt text matters: screen readers read it, and it shows when the image breaks.',
      },
      {
        label: 'Autolink (GFM)',
        code: 'Bare URLs become links: https://docs-md.com',
      },
      {
        label: 'Reference-style',
        code: 'Long documents read better with [named references][docs].\n\n[docs]: https://docs-md.com',
        note: 'Definitions can live anywhere in the file — conventionally at the bottom.',
      },
    ],
  },
  {
    id: 'code',
    title: 'Code',
    snippets: [
      {
        label: 'Inline code',
        code: 'Run `npm install` before `npm run dev`.',
      },
      {
        label: 'Fenced block with language',
        code: "```ts\nfunction greet(name: string) {\n  return `Hello, ${name}`;\n}\n```",
        note: 'The language tag after ``` turns on syntax highlighting. Common tags: js, ts, python, bash, json, sql, diff.',
      },
      {
        label: 'Fence inside a fence',
        code: '````md\nTo show a code block inside a code block,\nuse more backticks on the outside:\n```js\nconsole.log("nested");\n```\n````',
        renderable: false,
      },
    ],
  },
  {
    id: 'tables',
    title: 'Tables (GFM)',
    snippets: [
      {
        label: 'Basic table with alignment',
        code: '| Left | Center | Right |\n| :--- | :----: | ----: |\n| a    |   b    |     c |\n| d    |   e    |     f |',
        note: 'Colons in the separator row control alignment. Escape literal pipes in cells as \\|. Need to build one fast? Use the table generator below.',
      },
    ],
  },
  {
    id: 'blockquotes',
    title: 'Blockquotes',
    snippets: [
      {
        label: 'Quote and nesting',
        code: '> A quoted paragraph.\n>\n> > Nested quotes work too.\n>\n> Back to the first level — **formatting works inside**.',
      },
    ],
  },
  {
    id: 'structure',
    title: 'Structure & spacing',
    snippets: [
      {
        label: 'Horizontal rule',
        code: 'Above the line.\n\n---\n\nBelow the line.',
        note: 'Three or more hyphens on their own line, with blank lines around them (otherwise --- under text becomes an H2).',
      },
      {
        label: 'Line break vs. new paragraph',
        code: 'End a line with two spaces  \nfor a line break in the same paragraph.\n\nA blank line starts a new paragraph.',
        note: 'A backslash at the end of a line also forces a break and is easier to see than trailing spaces.',
      },
      {
        label: 'Escaping characters',
        code: '\\*not italic\\* and \\# not a heading and \\| not a table pipe',
      },
    ],
  },
  {
    id: 'footnotes',
    title: 'Footnotes (GFM)',
    snippets: [
      {
        label: 'Footnote reference and definition',
        code: 'Markdown was created in 2004.[^1]\n\n[^1]: By John Gruber, with Aaron Swartz contributing to the syntax.',
        note: 'Supported on GitHub and most modern renderers; not part of original markdown.',
      },
    ],
  },
  {
    id: 'mermaid',
    title: 'Mermaid diagrams',
    snippets: [
      {
        label: 'Flowchart from a code fence',
        code: '```mermaid\ngraph LR\n  A[Write markdown] --> B{Share it?}\n  B -->|yes| C[Get a link]\n  B -->|no| D[Keep local]\n```',
        note: 'Supported on GitHub, GitLab, and Docs MD share pages. Also handles sequence diagrams, gantt charts, and ER diagrams.',
      },
    ],
  },
  {
    id: 'html',
    title: 'Inline HTML',
    snippets: [
      {
        label: 'When markdown runs out',
        code: 'Markdown has no underline, so use <u>HTML</u>, <sub>subscript</sub>, <sup>superscript</sup>, or <kbd>Ctrl</kbd>+<kbd>C</kbd>.',
        note: 'Most renderers pass HTML through (GitHub sanitizes scripts and styles). Collapsible sections use <details><summary>…</summary></details>.',
      },
    ],
  },
];

function SnippetBlock({ snippet }: { snippet: Snippet }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-900">{snippet.label}</h3>
        <CopyButton content={snippet.code} />
      </div>
      <div className={`grid gap-4 ${snippet.renderable === false ? '' : 'lg:grid-cols-2'}`}>
        <pre className="overflow-x-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-200">
          <code>{snippet.code}</code>
        </pre>
        {snippet.renderable === false ? null : (
          <div className="overflow-x-auto rounded-xl border border-dashed border-gray-200 px-4 py-3">
            <MarkdownRenderer content={snippet.code} />
          </div>
        )}
      </div>
      {snippet.note ? <p className="mt-3 text-sm text-gray-600">{snippet.note}</p> : null}
    </div>
  );
}

export default function MarkdownCheatSheetPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'Markdown cheat sheet: complete syntax reference with examples',
        description: metadata.description,
        dateModified: UPDATED,
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: 'https://docs-md.com/markdown-cheat-sheet',
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
    <div className="mx-auto w-full max-w-5xl px-4 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-10 max-w-3xl">
        <div className="flex items-start gap-4">
          <ToolIconTile slug="markdown-cheat-sheet" size="lg" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
              Markdown cheat sheet
            </h1>
            <UpdatedLine date={UPDATED} />
          </div>
        </div>
        <p className="mt-4 text-base text-gray-600">
          Every markdown element with the syntax on the left and the rendered result on the right.
          Covers core markdown, GitHub Flavored Markdown (GFM), and mermaid diagrams. Click{' '}
          <em>Copy</em> on any block to grab the snippet.
        </p>
        <nav className="mt-5 flex flex-wrap gap-2 text-xs">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-full border border-gray-200 px-3 py-1.5 font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700"
            >
              {section.title}
            </a>
          ))}
        </nav>
      </div>

      <div className="space-y-12">
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-950">{section.title}</h2>
            {section.snippets.map((snippet) => (
              <SnippetBlock key={snippet.label} snippet={snippet} />
            ))}
          </section>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-950">Which markdown is this?</h2>
          <p>
            &quot;Markdown&quot; in the wild almost always means{' '}
            <strong>GitHub Flavored Markdown (GFM)</strong> — the original 2004 syntax plus tables,
            task lists, strikethrough, autolinks, and footnotes. Everything on this page renders on
            GitHub, GitLab, and on Docs MD share pages. The formal spec behind it is CommonMark;
            when two renderers disagree about an edge case, CommonMark&apos;s answer is the one to
            bet on. Chat apps are the exception — see the dedicated{' '}
            <Link href="/discord-markdown" className="text-indigo-700 underline">
              Discord
            </Link>{' '}
            and{' '}
            <Link href="/slack-markdown" className="text-indigo-700 underline">
              Slack
            </Link>{' '}
            formatting sheets, and the{' '}
            <Link href="/guides" className="text-indigo-700 underline">
              markdown guides
            </Link>{' '}
            for deep dives on single features.
          </p>
        </section>

        {FAQ.map((f) => (
          <section key={f.q} className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-950">{f.q}</h2>
            <p>{f.a}</p>
          </section>
        ))}

        <section className="space-y-3 rounded-2xl bg-indigo-50 p-6">
          <h2 className="text-xl font-semibold text-gray-950">Put it to work</h2>
          <p>
            Build tables visually with the{' '}
            <Link href="/markdown-table-generator" className="text-indigo-700 underline">
              table generator
            </Link>
            , turn a document into a file with the{' '}
            <Link href="/markdown-to-pdf" className="text-indigo-700 underline">
              PDF converter
            </Link>{' '}
            or{' '}
            <Link href="/markdown-to-html" className="text-indigo-700 underline">
              HTML converter
            </Link>
            , clean it up with the{' '}
            <Link href="/markdown-formatter" className="text-indigo-700 underline">
              formatter
            </Link>
            , scaffold a README with the{' '}
            <Link href="/readme-generator" className="text-indigo-700 underline">
              README generator
            </Link>
            , or{' '}
            <Link href="/" className="text-indigo-700 underline">
              share markdown as a link
            </Link>{' '}
            that renders everything on this page — including the mermaid diagrams.
          </p>
        </section>
      </div>
    </div>
  );
}
