import Link from 'next/link';
import type { ReactNode } from 'react';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import CheatSheet, { SectionNav } from '@/components/CheatSheet';
import { SECTIONS } from '@/lib/platform-sheets/confluence-markdown';
import UpdatedLine from '@/components/UpdatedLine';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-11-03';
const PATH = '/confluence-markdown';

export const metadata = pageMetadata({
  title: 'Confluence Markdown: Shortcuts, Paste, Mermaid Diagrams',
  description:
    'Does Confluence support Markdown? Partly: typing shortcuts for **bold**, # headings, lists, code; paste needs the legacy editor; Mermaid needs an app.',
  path: PATH,
  type: 'article',
  kicker: 'Reference',
});

const SOURCES = [
  { href: 'https://support.atlassian.com/confluence-cloud/docs/available-markdown-commands/', label: 'Atlassian Support: Available markdown commands (Confluence Cloud)' },
  {
    href: 'https://support.atlassian.com/confluence-cloud/docs/keyboard-shortcuts-markdown-and-autocomplete/',
    label: 'Atlassian Support: Keyboard shortcuts and autocomplete — "Use markdown syntax as formatting shortcuts"',
  },
  { href: 'https://support.atlassian.com/confluence-cloud/docs/format-text/', label: 'Atlassian Support: Format text ("Markdown can also be used for most formatting actions")' },
  {
    href: 'https://support.atlassian.com/confluence-cloud/docs/insert-confluence-wiki-markup/',
    label: 'Atlassian Support: Confluence wiki markup syntax for the legacy editor (includes "Can I insert markdown?")',
  },
  { href: 'https://support.atlassian.com/confluence-cloud/docs/import-content-into-confluence-cloud/', label: 'Atlassian Support: Import external documents (Markdown and Mermaid via Marketplace apps)' },
  {
    href: 'https://support.atlassian.com/confluence-cloud/docs/export-content-to-word-pdf-html-and-xml/',
    label: 'Atlassian Support: Export a space\'s content as Word, PDF, or data files',
  },
  { href: 'https://marketplace.atlassian.com/search?query=mermaid&hosting=cloud&product=confluence', label: 'Atlassian Marketplace: Mermaid apps for Confluence Cloud' },
];

const SHORTCUTS: Array<{ format: string; type: string; gfm: string; note?: string }> = [
  { format: 'Bold', type: '**Bold**', gfm: 'Same' },
  { format: 'Italic', type: '*Italic*', gfm: 'Same (GFM also accepts _Italic_)' },
  { format: 'Strikethrough', type: '~~Strikethrough~~', gfm: 'Same' },
  { format: 'Code', type: '`Code`', gfm: 'Same' },
  { format: 'Heading 1–6', type: '# … ###### then Space', gfm: 'Same' },
  { format: 'Numbered list', type: '1. then Space', gfm: 'Same' },
  { format: 'Bulleted list', type: '* then Space', gfm: 'Same (GFM also accepts - and +)', note: 'Only * is on Atlassian\'s list' },
  { format: 'Quote', type: '> then Space', gfm: 'Same' },
  { format: 'Code snippet', type: '``` then Space', gfm: 'Fenced code block' },
  { format: 'Divider', type: '--- then Space', gfm: 'Horizontal rule' },
  { format: 'Link', type: '[LinkTitle](http://a.com)', gfm: 'Same' },
  { format: 'Action item', type: '[] then Space', gfm: 'Not Markdown (GFM task list is - [ ])', note: 'Confluence-specific' },
  { format: 'Decision', type: '<> then Space', gfm: 'Not Markdown', note: 'Confluence-specific' },
  { format: 'Table', type: 'Not on the list', gfm: '| a | b | pipe table', note: 'Use the Table toolbar button or /table' },
  { format: 'Image', type: 'Not on the list', gfm: '![alt](url)', note: 'Upload or drag the file in' },
  { format: 'Footnote, alert, math', type: 'Not on the list', gfm: 'Extensions in some flavors' },
];

const WIKI: Array<{ element: string; wiki: string; md: string }> = [
  { element: 'Heading', wiki: 'h1. Title … h6. Title', md: '# Title … ###### Title' },
  { element: 'Bold', wiki: '*bold*', md: '**bold**' },
  { element: 'Italic', wiki: '_italics_', md: '*italics* or _italics_' },
  { element: 'Strikethrough', wiki: '-strikethrough-', md: '~~strikethrough~~' },
  { element: 'Underline', wiki: '+underline+', md: 'None (HTML <u>)' },
  { element: 'Superscript / subscript', wiki: 'text^sup^ / text~sub~', md: 'None (HTML <sup> <sub>)' },
  { element: 'Monospace', wiki: '{{monospace text}}', md: '`monospace text`' },
  { element: 'Bulleted list', wiki: '* item, ** sub-item', md: '- item, indented - sub-item' },
  { element: 'Numbered list', wiki: '# item, ## sub-item', md: '1. item, indented 1. sub-item' },
  { element: 'Table', wiki: '||head||head|| then |cell|cell|', md: '| head | head | plus a | --- | --- | row' },
  { element: 'Block quote', wiki: 'bq. quote', md: '> quote' },
  { element: 'Horizontal rule', wiki: '---- (four dashes)', md: '--- (three or more)' },
  { element: 'Link', wiki: '[alias|https://example.com]', md: '[alias](https://example.com)' },
  { element: 'Image', wiki: '!image.png!', md: '![alt](image.png)' },
  { element: 'Line break', wiki: '\\\\', md: 'Two trailing spaces or \\' },
  { element: 'Colour', wiki: '{color:red}text{color}', md: 'None' },
];

const ROUTES: Array<{ route: string; editor: string; result: string }> = [
  { route: 'Type markdown commands', editor: 'Cloud editor (pages and live docs)', result: 'Each marker converts to rich text as you type; the Markdown itself is not stored' },
  { route: 'Insert → Markup → Markdown', editor: 'Legacy editor only', result: 'Paste a whole document, preview, insert; converted to rich text, no further Markdown editing' },
  { route: 'Paste Markdown into the cloud editor', editor: 'Cloud editor', result: 'Not documented by Atlassian as a conversion; treat the result as plain text until you check it' },
  { route: 'Import .md files', editor: 'Marketplace apps', result: 'Atlassian\'s import guide lists apps for Markdown, HTML, PlantUML, LaTeX, Open API and Mermaid' },
  { route: 'Export a page', editor: 'Any', result: 'Word or PDF for one page; PDF, CSV, HTML or XML for a space. No Markdown export' },
];

const MERMAID_APPS: Array<{ app: string; vendor: string; note: string }> = [
  { app: 'Mermaid Chart for Confluence', vendor: 'Mermaid Chart Inc', note: 'Described on the Marketplace as the official app from the team behind Mermaid.js' },
  { app: 'Mermaid diagrams viewer', vendor: 'Atlassian Labs', note: 'Renders a diagram from Mermaid source placed in a code block on the same page' },
  { app: 'Mermaid Diagrams for Confluence', vendor: 'Stratus Add-ons Ltd', note: 'Client-side rendering, syntax highlighting, PDF export, version history' },
  { app: 'Mermaid for Confluence', vendor: 'Tech Labs', note: 'Graphs, Gantt charts and other diagrams from plain text' },
];

const FAQ: Array<{ q: string; a: string; href?: { path: string; label: string } }> = [
  {
    q: 'Does Confluence support Markdown?',
    a: 'Partly. Confluence Cloud\'s editor converts a fixed list of "markdown commands" as you type: **bold**, *italic*, ~~strikethrough~~, `code`, # to ###### headings, 1. and * lists, > quotes, ``` code snippets, --- dividers and [text](url) links, plus Confluence-only [] action items and <> decisions. It stores the result as rich text, not Markdown; there is no Markdown source view and no Markdown export. Tables, images and footnotes are not on Atlassian\'s list.',
  },
  {
    q: 'How do I paste Markdown into Confluence?',
    a: 'The documented route is the legacy editor: Insert → Markup, select Markdown, paste the text, check the preview and choose Insert. Confluence converts it to rich text and you cannot edit it as Markdown afterwards. Atlassian notes that the new (cloud) editor does not support the Markup dialog; there you type markdown commands one element at a time, or use a Marketplace import app for whole files.',
    href: { path: '/markdown-formatter', label: 'Format the Markdown first' },
  },
  {
    q: 'Does Confluence support Markdown tables?',
    a: 'Pipe tables are not on Atlassian\'s markdown command list for the cloud editor. Build the table with the Table button or the /table command, or bring the content in through the legacy editor\'s Markup dialog or a Marketplace import app. The legacy wiki markup has its own table syntax: ||heading|| cells and |cell| rows, with no separator row.',
    href: { path: '/markdown-table-generator', label: 'Markdown table generator' },
  },
  {
    q: 'How do I add a Mermaid diagram in Confluence?',
    a: 'Install a Mermaid app from the Atlassian Marketplace and paste the diagram text into its macro. A ```mermaid fence in a page is only a code snippet. Apps listed for Confluence Cloud include Mermaid Chart for Confluence (Mermaid Chart Inc, the Mermaid.js team), Mermaid diagrams viewer (Atlassian Labs), Mermaid Diagrams for Confluence (Stratus Add-ons) and Mermaid for Confluence (Tech Labs). Atlassian\'s import guide also points to a combined Markdown, PlantUML, LaTeX and Mermaid app.',
    href: { path: '/mermaid-in-markdown', label: 'Mermaid in Markdown: syntax and where it renders' },
  },
  {
    q: 'Can I export a Confluence page as Markdown?',
    a: 'Not with the built-in export. A single page or blog post exports to Word or PDF; a space exports to PDF, CSV, HTML or XML (space admins). To get Markdown, export HTML and convert it, or use a Marketplace app or the REST API with your own converter.',
    href: { path: '/html-to-markdown', label: 'HTML to Markdown converter' },
  },
  {
    q: 'What is Confluence wiki markup, and is it Markdown?',
    a: 'No. Wiki markup is Confluence\'s older markup language, still used by the legacy editor\'s Insert → Markup dialog and some admin screens, and shared with Jira. It writes headings as h1., bold with *single asterisks*, italics with _underscores_, numbered lists with #, tables with || and |, quotes with bq. and links as [alias|url]. Because # and * mean different things, pasting Markdown as wiki markup turns headings into numbered items and italics into bold.',
    href: { path: '/jira-markdown', label: 'Jira wiki markup vs Markdown' },
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

export default function ConfluenceMarkdownPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'Confluence Markdown: shortcuts, paste, wiki markup and Mermaid',
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
          <ToolIconTile slug="confluence-markdown" size="lg" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
              Confluence Markdown: shortcuts, paste, wiki markup and Mermaid
            </h1>
            <UpdatedLine date={UPDATED} />
          </div>
        </div>
        <p className="mt-4 text-base text-gray-600">
          Confluence supports Markdown as <em>typing shortcuts</em>, not as a document format. The
          cloud editor converts <code className="rounded bg-gray-100 px-1">**bold**</code>,{' '}
          <code className="rounded bg-gray-100 px-1"># headings</code>, lists, quotes, code fences and{' '}
          <code className="rounded bg-gray-100 px-1">[links](url)</code> as you type them and stores rich
          text. Pasting a whole Markdown file is documented only for the legacy editor&apos;s Markup dialog,
          tables are not on the shortcut list, export produces Word, PDF, HTML or XML, and Mermaid
          diagrams need a Marketplace app. Everything below is from Atlassian&apos;s support pages and
          the Marketplace.
        </p>
        <SectionNav sections={SECTIONS} className="mt-5 flex flex-wrap gap-2 text-xs" />
      </div>

      <section id="shortcut-table" className="mb-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Markdown commands the Confluence Cloud editor converts</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>Format</Th>
                <Th>Type this</Th>
                <Th>In GFM</Th>
                <Th>Note</Th>
              </tr>
            </thead>
            <tbody>
              {SHORTCUTS.map((r) => (
                <tr key={r.format} className="border-b border-gray-100">
                  <Td>
                    <span className="font-medium text-gray-900">{r.format}</span>
                  </Td>
                  <Td mono>{r.type}</Td>
                  <Td>{r.gfm}</Td>
                  <Td>{r.note ?? ''}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CheatSheet sections={SECTIONS} />

      <section id="routes" className="mt-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Getting Markdown into and out of Confluence</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>Route</Th>
                <Th>Where</Th>
                <Th>What happens</Th>
              </tr>
            </thead>
            <tbody>
              {ROUTES.map((r) => (
                <tr key={r.route} className="border-b border-gray-100">
                  <Td>
                    <span className="font-medium text-gray-900">{r.route}</span>
                  </Td>
                  <Td>{r.editor}</Td>
                  <Td>{r.result}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="wiki-table" className="mt-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Confluence wiki markup vs Markdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>Element</Th>
                <Th>Wiki markup</Th>
                <Th>Markdown</Th>
              </tr>
            </thead>
            <tbody>
              {WIKI.map((r) => (
                <tr key={r.element} className="border-b border-gray-100">
                  <Td>
                    <span className="font-medium text-gray-900">{r.element}</span>
                  </Td>
                  <Td mono>{r.wiki}</Td>
                  <Td mono>{r.md}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="mermaid-apps" className="mt-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Mermaid apps on the Atlassian Marketplace</h2>
        <p className="text-base text-gray-600">
          Confluence Cloud has no documented built-in Mermaid macro; a pasted{' '}
          <code className="rounded bg-gray-100 px-1">```mermaid</code> fence is a code snippet. These
          apps were listed for Confluence Cloud on the Marketplace when this page was checked; names and
          vendors are as the Marketplace shows them.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>App</Th>
                <Th>Vendor</Th>
                <Th>Marketplace summary</Th>
              </tr>
            </thead>
            <tbody>
              {MERMAID_APPS.map((r) => (
                <tr key={r.app} className="border-b border-gray-100">
                  <Td>
                    <span className="font-medium text-gray-900">{r.app}</span>
                  </Td>
                  <Td>{r.vendor}</Td>
                  <Td>{r.note}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600">
          Writing the diagram first? The{' '}
          <Link href="/mermaid-in-markdown" className="text-indigo-700 underline">Mermaid in Markdown</Link> page covers the
          fence syntax and which Markdown renderers draw it natively.
        </p>
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
            Convert an HTML export with{' '}
            <Link href="/html-to-markdown" className="text-indigo-700 underline">HTML to Markdown</Link>, turn a Markdown
            table into something you can rebuild with the{' '}
            <Link href="/markdown-table-generator" className="text-indigo-700 underline">table generator</Link>, prepare Jira
            text with{' '}
            <Link href="/markdown-to-jira" className="text-indigo-700 underline">Markdown to Jira</Link>, or{' '}
            <Link href="/" className="text-indigo-700 underline">share the Markdown as a link</Link> instead of pasting it.
            See also the{' '}
            <Link href="/jira-markdown" className="text-indigo-700 underline">Jira</Link>,{' '}
            <Link href="/notion-markdown" className="text-indigo-700 underline">Notion</Link> and{' '}
            <Link href="/google-docs-markdown" className="text-indigo-700 underline">Google Docs</Link> sheets.
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
