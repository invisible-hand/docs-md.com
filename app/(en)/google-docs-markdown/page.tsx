import Link from 'next/link';
import type { ReactNode } from 'react';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import CheatSheet, { SectionNav } from '@/components/CheatSheet';
import { SECTIONS } from '@/lib/platform-sheets/google-docs-markdown';
import UpdatedLine from '@/components/UpdatedLine';
import { pageMetadata } from '@/lib/page-metadata';
import { pageDate } from '@/lib/page-dates';

const UPDATED = pageDate('/google-docs-markdown');
const PATH = '/google-docs-markdown';

export const metadata = pageMetadata({
  title: 'Google Docs Markdown: Paste, Import, Export',
  description:
    'Does Google Docs support Markdown? Yes: enable it in Tools → Preferences, Paste from Markdown, Copy as Markdown, download as .md, import .md files.',
  path: PATH,
  type: 'article',
  kicker: 'Reference',
});

const SOURCES = [
  { href: 'https://support.google.com/docs/answer/12014036', label: 'Google Docs Editors Help: Use Markdown in Google Docs, Slides, & Drawings' },
  {
    href: 'https://workspaceupdates.googleblog.com/2024/07/import-and-export-markdown-in-google-docs.html',
    label: 'Google Workspace Updates (16 July 2024): Import and export Markdown in Google Docs',
  },
  {
    href: 'https://workspaceupdates.googleblog.com/2022/03/compose-with-markdown-in-google-docs-on.html',
    label: 'Google Workspace Updates (29 March 2022): Compose with Markdown in Google Docs on web',
  },
  { href: 'https://developers.google.com/workspace/drive/api/guides/ref-export-formats', label: 'Google Drive API: Export MIME types (Markdown, text/markdown)' },
];

const ROUTES: Array<{ route: string; where: string; menu: string; onByDefault: string; needsToggle: string }> = [
  { route: 'Type Markdown, get formatting', where: 'Docs, Slides, Drawings', menu: 'Just type **bold**, # Heading, [text](url)…', onByDefault: 'No', needsToggle: 'Yes' },
  { route: 'Paste Markdown as formatted text', where: 'Docs', menu: 'Right-click → Paste from Markdown', onByDefault: 'No', needsToggle: 'Yes' },
  { route: 'Copy formatted text as Markdown', where: 'Docs', menu: 'Select → right-click → Copy as Markdown', onByDefault: 'No', needsToggle: 'Yes' },
  { route: 'Export the whole document', where: 'Docs', menu: 'File → Download → Markdown (.md)', onByDefault: 'Yes', needsToggle: 'No' },
  { route: 'Import a .md file', where: 'Docs or Drive', menu: 'File → Open → Upload, or Drive: right-click → Open with → Google Docs', onByDefault: 'Yes', needsToggle: 'No' },
  { route: 'Export by API', where: 'Drive API', menu: 'files.export with mimeType text/markdown', onByDefault: 'Yes', needsToggle: 'No' },
];

const SHORTCUTS: Array<{ type: string; result: string; gfm: string; note?: string }> = [
  { type: '*text* or _text_', result: 'Italic', gfm: 'Same' },
  { type: '**text** or __text__', result: 'Bold', gfm: 'Same' },
  { type: '***text*** or ___text___', result: 'Bold italic', gfm: 'Same' },
  { type: '~text~', result: 'Strikethrough', gfm: 'GFM uses ~~text~~', note: 'Single tilde in Google\'s help' },
  { type: '# + space … ###### + space', result: 'Heading 1–6', gfm: 'Same', note: 'Docs only; the space is required' },
  { type: '[text](https://…)', result: 'Link', gfm: 'Same', note: 'No space before the parenthesis' },
  { type: '* or - + space', result: 'Bulleted list', gfm: 'Same', note: 'Listed in the 2022 announcement' },
  { type: '1. + space', result: 'Numbered list', gfm: 'Same', note: '"Various ways to start a numbered list"' },
  { type: '[] + space', result: 'Checkbox', gfm: '- [ ] in GFM', note: 'No space between the brackets' },
  { type: '`code`', result: 'Not in Google\'s list', gfm: 'Inline code', note: 'Docs has a code-block building block instead' },
  { type: '> quote', result: 'Not in Google\'s list', gfm: 'Blockquote' },
  { type: '| a | b |', result: 'Not in Google\'s list', gfm: 'Table', note: 'Insert → Table' },
  { type: '![alt](url)', result: 'Not in Google\'s list', gfm: 'Image', note: 'Insert → Image' },
];

const ELEMENTS: Array<{ element: string; documented: string; note: string }> = [
  { element: 'Headings 1–6', documented: 'Yes', note: 'Typing shortcut in Docs; part of every Google example' },
  { element: 'Bold, italic, bold italic', documented: 'Yes', note: 'Asterisks or underscores' },
  { element: 'Strikethrough', documented: 'Yes', note: 'Google writes it with one tilde; GFM readers expect two' },
  { element: 'Links', documented: 'Yes', note: '[text](url)' },
  { element: 'Bulleted and numbered lists, checkboxes', documented: 'Yes (2022 announcement)', note: 'Autocorrect existed before the Markdown toggle' },
  { element: 'Tables', documented: 'Not documented', note: 'Run the round-trip test above and check the .md' },
  { element: 'Code blocks', documented: 'Not documented', note: 'Docs has a separate code-block building block' },
  { element: 'Footnotes', documented: 'Not documented', note: 'Docs footnotes exist; whether they map to [^1] is not stated' },
  { element: 'Images', documented: 'Not documented', note: 'A .md file can only reference images by URL or path' },
  { element: 'Comments, suggestions, page breaks, columns', documented: 'No Markdown equivalent', note: 'Markdown has no syntax for them' },
];

const FAQ: Array<{ q: string; a: string; href?: { path: string; label: string } }> = [
  {
    q: 'Does Google Docs support Markdown?',
    a: 'Yes, in four ways, all documented in Google\'s help: it autocorrects Markdown as you type (headings, bold, italic, strikethrough, links) once "Enable Markdown" is checked in Tools → Preferences; it converts a pasted Markdown document with the right-click item "Paste from Markdown"; it puts Markdown on the clipboard with "Copy as Markdown"; and it imports .md files (File → Open) and exports the document as a .md file (File → Download → Markdown). Import and export are on by default; the typing, paste and copy features are off until you enable Markdown.',
  },
  {
    q: 'How do I enable Markdown in Google Docs?',
    a: 'Open a document, go to Tools → Preferences and check "Enable Markdown". The same checkbox exists in Google Slides and Google Drawings. Google launched the setting on 29 March 2022 under the name "Automatically detect Markdown"; the July 2024 announcement and the current help article call it "Enable Markdown". It is a per-user setting with no admin control.',
  },
  {
    q: 'How do I paste Markdown into Google Docs?',
    a: 'Copy the Markdown, right-click in the document and choose "Paste from Markdown". Docs converts it to formatted content. A plain Ctrl/Cmd+V keeps the markup characters as text. The menu item appears only when "Enable Markdown" is checked in Tools → Preferences. Google added it on 16 July 2024 together with "Copy as Markdown", import and export.',
    href: { path: '/markdown-formatter', label: 'Clean up the Markdown first' },
  },
  {
    q: 'How do I import a Markdown file into Google Docs?',
    a: 'In Docs: File → Open → Upload, select the .md file, and it uploads and opens as a Google Doc. In Google Drive: upload the .md file, right-click it and choose Open with → Google Docs. Import is on by default and does not need the Markdown preference. If you need a Word file instead, convert the Markdown to .docx and upload that.',
    href: { path: '/markdown-to-word', label: 'Markdown to Word converter' },
  },
  {
    q: 'How do I export a Google Doc as Markdown?',
    a: 'File → Download → Markdown (.md). The download is a plain-text file whose formatting is written as Markdown markup, ready for GitHub, Obsidian, a static site or an AI tool. To export only part of a document, select it, right-click and choose "Copy as Markdown" (requires "Enable Markdown"). Developers get the same output from the Drive API by exporting the file with the MIME type text/markdown.',
    href: { path: '/guides/export-as-markdown', label: 'What "Export as Markdown" means, and what to do with the file' },
  },
  {
    q: 'Does Google Docs convert tables, code blocks and footnotes to Markdown?',
    a: 'Google\'s help article names headings, bold, italic, strikethrough and links; it does not publish an element-by-element list for import, export or paste. Treat tables, code blocks, footnotes and images as unverified: paste the round-trip test document on this page, download it as .md and open the file in a Markdown viewer to see what survived in your account.',
    href: { path: '/markdown-viewer', label: 'Markdown viewer' },
  },
  {
    q: 'Why do my asterisks and hashes stay visible in Google Docs?',
    a: 'Either "Enable Markdown" is unchecked in Tools → Preferences, or the text was pasted with an ordinary paste instead of "Paste from Markdown". Autocorrect also only fires as you type the closing marker; it does not reformat text that is already in the document. Select the text and use Paste from Markdown, or import the content as a .md file.',
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

export default function GoogleDocsMarkdownPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'Google Docs Markdown: paste, import, export and copy',
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
          <ToolIconTile slug="google-docs-markdown" size="lg" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
              Google Docs Markdown: paste, import, export and copy
            </h1>
            <UpdatedLine date={UPDATED} />
          </div>
        </div>
        <p className="mt-4 text-base text-gray-600">
          Google Docs supports Markdown. Check <strong>Tools → Preferences → Enable Markdown</strong> and
          Docs converts <code className="rounded bg-gray-100 px-1">**bold**</code>,{' '}
          <code className="rounded bg-gray-100 px-1"># headings</code> and{' '}
          <code className="rounded bg-gray-100 px-1">[links](url)</code> as you type, adds
          &quot;Paste from Markdown&quot; and &quot;Copy as Markdown&quot; to the right-click menu, and —
          with or without the setting — opens .md files and downloads any document as one
          (File → Download → Markdown). Every statement below comes from Google&apos;s help article and
          its 2022 and 2024 launch posts; where Google is silent, the table says so.
        </p>
        <SectionNav sections={SECTIONS} className="mt-5 flex flex-wrap gap-2 text-xs" />
      </div>

      <section id="routes" className="mb-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Six ways Markdown gets in and out of Google Docs</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>You want to</Th>
                <Th>Where</Th>
                <Th>How</Th>
                <Th>On by default</Th>
                <Th>Needs &quot;Enable Markdown&quot;</Th>
              </tr>
            </thead>
            <tbody>
              {ROUTES.map((r) => (
                <tr key={r.route} className="border-b border-gray-100">
                  <Td>
                    <span className="font-medium text-gray-900">{r.route}</span>
                  </Td>
                  <Td>{r.where}</Td>
                  <Td>{r.menu}</Td>
                  <Td>{r.onByDefault}</Td>
                  <Td>{r.needsToggle}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="shortcuts" className="mb-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Markdown shortcuts Google Docs recognises</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>Type this</Th>
                <Th>Docs makes</Th>
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

      <section id="elements" className="mt-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">What Google documents, and what it does not</h2>
        <p className="text-base text-gray-600">
          Google&apos;s help lists the elements the typing shortcuts handle but publishes no conversion table
          for paste, import or export. This table separates what Google states from what you have to test.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>Markdown element</Th>
                <Th>In Google&apos;s help</Th>
                <Th>Notes</Th>
              </tr>
            </thead>
            <tbody>
              {ELEMENTS.map((r) => (
                <tr key={r.element} className="border-b border-gray-100">
                  <Td>
                    <span className="font-medium text-gray-900">{r.element}</span>
                  </Td>
                  <Td>{r.documented}</Td>
                  <Td>{r.note}</Td>
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
            Open a downloaded .md in the{' '}
            <Link href="/markdown-viewer" className="text-indigo-700 underline">markdown viewer</Link>, turn Markdown into a
            .docx that Docs opens with{' '}
            <Link href="/markdown-to-word" className="text-indigo-700 underline">Markdown to Word</Link>, tidy a file before
            pasting with the{' '}
            <Link href="/markdown-formatter" className="text-indigo-700 underline">formatter</Link>, or{' '}
            <Link href="/" className="text-indigo-700 underline">share the Markdown as a link</Link>. Compare with the{' '}
            <Link href="/notion-markdown" className="text-indigo-700 underline">Notion</Link> and{' '}
            <Link href="/confluence-markdown" className="text-indigo-700 underline">Confluence</Link> sheets, or read{' '}
            <Link href="/guides/export-as-markdown" className="text-indigo-700 underline">what &quot;Export as Markdown&quot; means</Link>.
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
