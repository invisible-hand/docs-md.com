import Link from 'next/link';
import type { ReactNode } from 'react';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import CheatSheet, { SectionNav } from '@/components/CheatSheet';
import { SECTIONS } from '@/lib/platform-sheets/notion-markdown';
import UpdatedLine from '@/components/UpdatedLine';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-10-15';
const PATH = '/notion-markdown';

export const metadata = pageMetadata({
  title: 'Notion Markdown: Shortcuts, Import and Export',
  description:
    'What Notion does with markdown: the shortcuts it converts as you type, what survives paste and import, and what Markdown & CSV export produces.',
  path: PATH,
  type: 'article',
  kicker: 'Reference',
});

const SOURCES = [
  { href: 'https://www.notion.com/help/keyboard-shortcuts', label: 'Notion Help: Keyboard shortcuts (Markdown style)' },
  { href: 'https://www.notion.com/help/writing-and-editing-basics', label: 'Notion Help: Writing and editing basics' },
  { href: 'https://www.notion.com/help/import-data-into-notion', label: 'Notion Help: Import data into Notion' },
  { href: 'https://www.notion.com/help/export-your-content', label: 'Notion Help: Export your content' },
];

const SHORTCUTS: Array<{ type: string; result: string; gfm: string; note?: string }> = [
  { type: '**text**', result: 'Bold', gfm: 'Same' },
  { type: '*text*', result: 'Italic', gfm: 'Same (also _text_ in GFM; Notion only documents *)' },
  { type: '`text`', result: 'Inline code', gfm: 'Same' },
  { type: '~text~', result: 'Strikethrough', gfm: 'GFM prefers ~~text~~', note: 'Single tilde' },
  { type: '# + space', result: 'Heading 1', gfm: 'Same' },
  { type: '## + space', result: 'Heading 2', gfm: 'Same' },
  { type: '### + space', result: 'Heading 3', gfm: 'Same; Notion has no H4–H6' },
  { type: '-, * or + + space', result: 'Bulleted list', gfm: 'Same' },
  { type: '1., a. or i. + space', result: 'Numbered list', gfm: 'Only 1. in GFM' },
  { type: '[] + space', result: 'To-do checkbox', gfm: '- [ ] in GFM', note: 'No space between the brackets' },
  { type: '> + space', result: 'Toggle list', gfm: '> is a blockquote in GFM', note: 'The biggest surprise for markdown users' },
  { type: '" + space', result: 'Quote block', gfm: 'Not markdown' },
  { type: '---', result: 'Divider', gfm: 'Same (horizontal rule)' },
  { type: '[text](url)', result: 'Not converted while typing', gfm: 'Link', note: 'Paste a URL over selected text, or Cmd/Ctrl+K' },
  { type: '| a | b |', result: 'Not converted while typing', gfm: 'Table', note: 'Use /table, or paste a whole markdown table' },
  { type: '```', result: 'Not documented as a shortcut', gfm: 'Code block', note: 'Use /code or Cmd/Ctrl+Option/Shift+8' },
  { type: '![alt](url)', result: 'Not converted while typing', gfm: 'Image', note: 'Use /image' },
];

const IMPORT: Array<{ element: string; imports: string; note: string }> = [
  { element: 'Headings', imports: 'Yes', note: 'Notion only has heading blocks 1–3' },
  { element: 'Paragraphs, bold, italic, code', imports: 'Yes', note: 'Standard markdown' },
  { element: 'Bulleted and numbered lists', imports: 'Yes', note: 'Nesting preserved' },
  { element: 'Task lists', imports: 'Yes', note: '- [ ] becomes a to-do block' },
  { element: 'Fenced code blocks', imports: 'Yes', note: 'Named in the help article as supported' },
  { element: 'Blockquotes', imports: 'Yes', note: '> becomes a quote block, not a toggle' },
  { element: 'Tables', imports: 'Yes (simple)', note: 'Pipe tables become simple table blocks' },
  { element: 'Links', imports: 'Yes', note: 'External links; relative links between files are not re-pointed' },
  { element: 'Anchor links (#heading)', imports: 'No', note: 'Explicitly listed as not importing' },
  { element: 'Images', imports: 'If reachable', note: 'Remote URLs import; local paths need the files zipped with the markdown' },
  { element: 'HTML inside markdown', imports: 'No', note: 'Not a Notion block; not listed as supported' },
  { element: 'Front matter (YAML)', imports: 'No', note: 'Not standard markdown — arrives as plain text' },
  { element: 'Footnotes, alerts, wikilinks, math', imports: 'No', note: '"Advanced or nonstandard Markdown extensions" are not imported' },
  { element: 'Folder structure', imports: 'Yes, from a ZIP', note: 'Zip the folder first to keep the hierarchy' },
];

const EXPORT: Array<{ block: string; produces: string }> = [
  { block: 'Page', produces: 'One .md file named "Title <32-char id>.md"' },
  { block: 'Headings 1–3', produces: '#, ##, ###' },
  { block: 'Text with bold / italic / code / strike', produces: '**bold**, *italic*, `code`, ~~strike~~' },
  { block: 'Bulleted, numbered, to-do lists', produces: '-, 1., - [ ] / - [x]' },
  { block: 'Toggle', produces: 'Its heading line plus the indented content; the fold is lost' },
  { block: 'Callout', produces: 'HTML (<aside>) — Notion says there is no Markdown equivalent' },
  { block: 'Quote', produces: '> blockquote' },
  { block: 'Code block', produces: 'Fenced block with the language tag' },
  { block: 'Divider', produces: '---' },
  { block: 'Simple table', produces: 'Pipe table' },
  { block: 'Image / file', produces: 'Downloaded into a folder, linked with a relative path' },
  { block: 'Sub-page', produces: 'Separate .md file (with "Include subpages" on), linked from the parent' },
  { block: 'Full-page database', produces: 'One .csv per view you choose, plus a .md per row page' },
  { block: 'Inline database', produces: 'A .csv next to the page and a link in the .md' },
  { block: 'Database form view', produces: 'Cannot be exported; use Table view' },
  { block: 'Comments', produces: 'Only the HTML export option mentions comments' },
  { block: 'Columns, colours, page icon and cover', produces: 'No markdown equivalent' },
];


const FAQ: Array<{ q: string; a: string; href?: { path: string; label: string } }> = [
  {
    q: 'Does Notion support markdown?',
    a: 'Partially. Notion is not a markdown editor: it stores blocks, but it accepts markdown three ways. While typing, it converts shortcuts (**bold**, # headings, - lists, [] to-dos, > toggles, --- dividers). On paste, it converts whole markdown documents including tables and code fences. On import, it reads .md files. In each case anything without a Notion block equivalent becomes plain text.',
  },
  {
    q: 'Why does > make a toggle instead of a quote in Notion?',
    a: 'Because Notion assigned the > shortcut to its toggle block and gave quotes the " shortcut. This only applies to the typing shortcut: when you paste or import markdown, a > line becomes a quote block. If you want a toggle from imported markdown, you have to convert the block afterwards.',
  },
  {
    q: 'How do I import a markdown file into Notion?',
    a: 'Settings → Import → Text & Markdown, or drag the .md file onto a page. Notion imports headings, lists, code blocks and standard markdown; anchor links and non-standard extensions (footnotes, alerts, wikilinks, math, HTML) do not import. Files are limited to 5 MB on the Free plan and 50 MB on paid plans, and there is a limit of roughly 120 file imports per 12 hours. Zip a folder to keep its structure.',
  },
  {
    q: 'How do I export a Notion page to markdown?',
    a: 'Open the page menu (…) → Export → format "Markdown & CSV". You get a ZIP with one .md per page, a folder of images and files, a .csv for every database, and separate .md files for sub-pages if "Include subpages" is on. Callouts come out as HTML, toggles lose their fold, and comments are not included.',
    href: { path: '/markdown-to-html', label: 'Convert the exported markdown to HTML' },
  },
  {
    q: 'What markdown features does Notion not have?',
    a: 'Headings 4–6, footnotes, alerts and callouts in markdown form, definition lists, HTML, front matter, math inside text (Notion has a separate equation block), wikilinks, and nested tables. Pasting them produces plain text; exporting a Notion page never produces them.',
    href: { path: '/markdown-flavors', label: 'Feature × flavor matrix' },
  },
  {
    q: 'Do Notion exports render on GitHub?',
    a: 'Mostly: headings, lists, to-dos, tables, code fences, dividers and quotes are GFM. Fix two things first — the <aside> blocks from callouts (GitHub keeps the tag but not the styling; rewrite them as > [!NOTE] alerts) and the relative image paths with page ids and spaces in them, which need URL-encoding.',
    href: { path: '/github-flavored-markdown', label: 'GitHub Flavored Markdown cheat sheet' },
  },
];

function Th({ children }: { children: ReactNode }) {
  return <th className="py-2 pr-4 text-left font-semibold text-gray-950">{children}</th>;
}
function Td({ children, mono = false }: { children: ReactNode; mono?: boolean }) {
  return (
    <td className="py-2 pr-4 align-top text-gray-700">
      {mono ? <code className="whitespace-pre rounded bg-gray-100 px-1.5 py-0.5 text-xs">{children}</code> : children}
    </td>
  );
}

export default function NotionMarkdownPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'Notion markdown: what Notion types, imports and exports',
        description: metadata.description,
        dateModified: UPDATED,
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: `https://docs-md.com${PATH}`,
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
          <ToolIconTile slug="notion-markdown" size="lg" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
              Notion markdown: what Notion types, imports and exports
            </h1>
            <UpdatedLine date={UPDATED} />
          </div>
        </div>
        <p className="mt-4 text-base text-gray-600">
          Notion is a block editor, not a markdown editor, but it speaks markdown at three borders:
          shortcuts you type convert into blocks, pasted or imported markdown becomes blocks, and
          &quot;Markdown &amp; CSV&quot; export turns blocks back into files. The tables below say exactly
          what crosses each border and what turns into plain text, straight from Notion&apos;s help
          articles.
        </p>
        <SectionNav sections={SECTIONS} className="mt-5 flex flex-wrap gap-2 text-xs" />
      </div>

      <section id="shortcuts" className="mb-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Markdown shortcuts Notion converts as you type</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>Type this</Th>
                <Th>Notion makes</Th>
                <Th>In GFM</Th>
                <Th>Note</Th>
              </tr>
            </thead>
            <tbody>
              {SHORTCUTS.map((r) => (
                <tr key={r.type} className="border-b border-gray-100">
                  <Td mono>{r.type}</Td>
                  <Td>{r.result}</Td>
                  <Td>{r.gfm}</Td>
                  <Td>{r.note ?? ''}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CheatSheet sections={SECTIONS} />

      <section id="import-table" className="mt-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">What survives paste and .md import</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>Markdown element</Th>
                <Th>Imports?</Th>
                <Th>Notes</Th>
              </tr>
            </thead>
            <tbody>
              {IMPORT.map((r) => (
                <tr key={r.element} className="border-b border-gray-100">
                  <Td>
                    <span className="font-medium text-gray-900">{r.element}</span>
                  </Td>
                  <Td>{r.imports}</Td>
                  <Td>{r.note}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="export-table" className="mt-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">What &quot;Markdown &amp; CSV&quot; export produces</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>Notion block</Th>
                <Th>Exported as</Th>
              </tr>
            </thead>
            <tbody>
              {EXPORT.map((r) => (
                <tr key={r.block} className="border-b border-gray-100">
                  <Td>
                    <span className="font-medium text-gray-900">{r.block}</span>
                  </Td>
                  <Td>{r.produces}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        {FAQ.map((f) => (
          <section key={f.q} className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-950">{f.q}</h2>
            <p>{f.a}</p>
            {f.href ? (
              <p>
                <Link href={f.href.path} className="text-indigo-700 underline">
                  {f.href.label} →
                </Link>
              </p>
            ) : null}
          </section>
        ))}

        <section className="space-y-3 rounded-2xl bg-indigo-50 p-6">
          <h2 className="text-xl font-semibold text-gray-950">Related tools and sheets</h2>
          <p>
            Clean up an export with the{' '}
            <Link href="/markdown-formatter" className="text-indigo-700 underline">markdown formatter</Link>, check its links
            with the{' '}
            <Link href="/markdown-link-checker" className="text-indigo-700 underline">link checker</Link>, convert database
            CSVs with{' '}
            <Link href="/csv-to-markdown" className="text-indigo-700 underline">CSV to markdown</Link>, or{' '}
            <Link href="/" className="text-indigo-700 underline">share the page as a link</Link>. Compare with the{' '}
            <Link href="/obsidian-markdown" className="text-indigo-700 underline">Obsidian</Link> sheet and the{' '}
            <Link href="/markdown-flavors" className="text-indigo-700 underline">flavor comparison</Link>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-950">Sources</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {SOURCES.map((s) => (
              <li key={s.href}>
                <a href={s.href} className="text-indigo-700 underline" rel="noopener">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
