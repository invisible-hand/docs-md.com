import Link from 'next/link';
import type { ReactNode } from 'react';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import CheatSheet, { SectionNav, type Section } from '@/components/CheatSheet';
import UpdatedLine from '@/components/UpdatedLine';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-10-15';
const PATH = '/obsidian-markdown';

export const metadata = pageMetadata({
  title: 'Obsidian Markdown Cheat Sheet: Wikilinks, Callouts',
  description:
    'Obsidian markdown: [[wikilinks]], ![[embeds]], 13 callout types with fold +/-, ==highlight==, %%comments%%, properties, tags, math. From Obsidian Help.',
  path: PATH,
  type: 'article',
  kicker: 'Reference',
});

const SOURCES = [
  { href: 'https://help.obsidian.md/syntax', label: 'Obsidian Help: Basic formatting syntax' },
  { href: 'https://help.obsidian.md/advanced-syntax', label: 'Obsidian Help: Advanced formatting syntax' },
  { href: 'https://help.obsidian.md/links', label: 'Obsidian Help: Internal links' },
  { href: 'https://help.obsidian.md/embeds', label: 'Obsidian Help: Embed files' },
  { href: 'https://help.obsidian.md/callouts', label: 'Obsidian Help: Callouts' },
  { href: 'https://help.obsidian.md/properties', label: 'Obsidian Help: Properties' },
  { href: 'https://help.obsidian.md/tags', label: 'Obsidian Help: Tags' },
];

const CALLOUTS: Array<{ type: string; aliases: string; use: string }> = [
  { type: 'note', aliases: '—', use: 'Default; any unknown type falls back to it' },
  { type: 'abstract', aliases: 'summary, tldr', use: 'Short summary at the top of a note' },
  { type: 'info', aliases: '—', use: 'Background information' },
  { type: 'todo', aliases: '—', use: 'Open work' },
  { type: 'tip', aliases: 'hint, important', use: 'Advice' },
  { type: 'success', aliases: 'check, done', use: 'Completed / positive outcome' },
  { type: 'question', aliases: 'help, faq', use: 'Open question' },
  { type: 'warning', aliases: 'caution, attention', use: 'Something to watch out for' },
  { type: 'failure', aliases: 'fail, missing', use: 'Something that did not work' },
  { type: 'danger', aliases: 'error', use: 'Risk of damage or data loss' },
  { type: 'bug', aliases: '—', use: 'Known defect' },
  { type: 'example', aliases: '—', use: 'Worked example' },
  { type: 'quote', aliases: 'cite', use: 'Quotation with a source' },
];

const LINKS: Array<{ want: string; syntax: string; note: string }> = [
  { want: 'Link to a note', syntax: '[[Three laws of motion]]', note: 'Vault-wide name; add a folder path from the vault root if two notes share a name' },
  { want: 'Link with display text', syntax: '[[Three laws of motion|Newton]]', note: 'Text after | is shown instead of the note name' },
  { want: 'Link to a heading', syntax: '[[Note#Heading]]', note: 'Same note: [[#Heading]]; nested: [[Note#Heading#Subheading]]' },
  { want: 'Link to a block', syntax: '[[Note#^37066d]]', note: 'The block needs a ^id at the end of its line (or on its own line after lists/tables)' },
  { want: 'Markdown-style link', syntax: '[Newton](Three%20laws%20of%20motion.md)', note: 'Spaces must be %20-encoded; works in other markdown apps too' },
  { want: 'Link to a non-markdown file', syntax: '[[Figure 1.png]]', note: 'Extension required for anything that is not a note' },
  { want: 'External link', syntax: '[Obsidian Help](https://help.obsidian.md)', note: 'Spaces in the URL: %20 or wrap the URL in < >' },
  { want: 'Human-readable block id', syntax: 'Some paragraph. ^quote-of-the-day', note: 'Only Latin letters, numbers and dashes' },
];

const EMBEDS: Array<{ want: string; syntax: string }> = [
  { want: 'Whole note', syntax: '![[Internal links]]' },
  { want: 'One heading section', syntax: '![[Note#Heading]]' },
  { want: 'One block', syntax: '![[Internal links#^b15695]]' },
  { want: 'Image', syntax: '![[Engelbart.jpg]]' },
  { want: 'Image, width × height', syntax: '![[Engelbart.jpg|100x145]]' },
  { want: 'Image, width only', syntax: '![[Engelbart.jpg|100]]' },
  { want: 'External image with width', syntax: '![250](https://example.com/photo.jpg)' },
  { want: 'Audio', syntax: '![[Excerpt.ogg]]' },
  { want: 'PDF at page 3, 400 px tall', syntax: '![[Document.pdf#page=3&height=400]]' },
  { want: 'Canvas', syntax: '![[My canvas.canvas]]' },
  { want: 'A list (give it a block id first)', syntax: '![[My note#^my-list-id]]' },
];

const VS_GFM: Array<{ feature: string; obsidian: string; gfm: string }> = [
  { feature: 'Links between documents', obsidian: '[[Note]] wikilinks (also [text](Note.md))', gfm: '[text](path.md) only' },
  { feature: 'Embedding another file', obsidian: '![[Note]], ![[file.pdf#page=3]]', gfm: 'Images only: ![alt](img.png)' },
  { feature: 'Image size', obsidian: '![[img.png|100x145]] or ![100](url)', gfm: 'Not in markdown; <img width=…>' },
  { feature: 'Highlight', obsidian: '==text==', gfm: 'None (use <mark>)' },
  { feature: 'Comments', obsidian: '%%hidden%% and <!-- -->', gfm: '<!-- --> only' },
  { feature: 'Callouts', obsidian: '> [!tip]- Title (13 types, foldable)', gfm: '> [!NOTE] (5 types, not foldable, github.com only)' },
  { feature: 'Tags', obsidian: '#tag, #parent/child', gfm: 'None; # at line start is a heading' },
  { feature: 'Front matter', obsidian: 'YAML properties with typed values', gfm: 'Rendered as a table on github.com, otherwise raw' },
  { feature: 'Task list', obsidian: '- [ ] / - [x] / any char: - [?]', gfm: '- [ ] / - [x] only' },
  { feature: 'Inline footnote', obsidian: '^[inline note] and [^1]', gfm: '[^1] only (github.com)' },
  { feature: 'Math', obsidian: '$inline$ and $$block$$ (MathJax)', gfm: '$inline$, $$block$$, ```math (github.com)' },
  { feature: 'Mermaid', obsidian: '```mermaid, with internal-link class', gfm: '```mermaid (github.com)' },
  { feature: 'Strikethrough', obsidian: '~~text~~', gfm: '~~text~~ or ~text~' },
  { feature: 'Table cell pipe inside a wikilink', obsidian: '[[Note\\|alias]]', gfm: '\\| escapes the pipe' },
];

const SECTIONS: Section[] = [
  {
    id: 'basics',
    title: 'Basics that match GFM',
    snippets: [
      {
        label: 'Emphasis, code, strikethrough',
        syntax: '**bold** *italic* ***both*** ~~struck~~ `inline code`',
        note: 'Underscores work too. Obsidian shows the markers in Live Preview until the cursor leaves the line; Reading view hides them.',
        more: { href: '/guides/markdown-bold-italic', label: 'Bold and italic guide' },
      },
      {
        label: 'Task list with custom states',
        syntax: '- [ ] Incomplete\n- [x] Complete\n- [?] Any character is allowed inside the brackets',
        preview: '- [ ] Incomplete\n- [x] Complete\n- [ ] Any character is allowed inside the brackets (theme-dependent)',
        note: 'Obsidian accepts any character in the box; themes decide how [?], [!] or [-] look. Other apps render them as plain text.',
        more: { href: '/guides/markdown-checkbox', label: 'Checkbox guide' },
      },
    ],
  },
  {
    id: 'highlight-comments',
    title: 'Highlight and comments',
    snippets: [
      {
        label: '==Highlight==',
        syntax: 'This is ==highlighted== and ==🔴 colour-coded== text.',
        render: false,
        note: 'Two equals signs on each side, rendered as <mark>. Not GFM: GitHub shows the = signs. Obsidian suggests an emoji right after the opening == to colour-code highlights.',
        more: { href: '/guides/markdown-color-text', label: 'Color text guide: highlight alternatives' },
      },
      {
        label: '%%Comments%%',
        syntax: 'Visible text %%hidden inline comment%% more visible text.\n\n%%\nA block comment: everything until the next %% is hidden in Reading view.\n%%',
        render: false,
        note: 'Obsidian-only. For a comment that other markdown apps also hide, use <!-- HTML comment --> instead.',
        more: { href: '/guides/markdown-comment', label: 'Comment guide' },
      },
    ],
  },
  {
    id: 'wikilinks',
    title: '[[Wikilinks]]',
    intro: 'Obsidian links by note name, not by path. Type [[ to get autocomplete; the link stays valid when you rename the note because Obsidian updates every reference.',
    snippets: [
      {
        label: 'Note, alias, heading, block',
        syntax: '[[Three laws of motion]]\n[[Three laws of motion|Newton]]\n[[About Obsidian#Links are first-class citizens]]\n[[2023-01-01#^37066d]]',
        render: false,
        note: 'Characters that break a link target: # | ^ : %% [[ ]]. A link in a table cell must escape its pipe: [[Note\\|alias]].',
        more: { href: '/guides/markdown-link', label: 'Link guide' },
      },
      {
        label: 'Portable alternative: markdown link',
        syntax: '[Newton](Three%20laws%20of%20motion.md)',
        note: 'Turn off "Use [[Wikilinks]]" in Settings → Files and links and Obsidian writes this form, which GitHub, VS Code and static site generators understand.',
      },
    ],
  },
  {
    id: 'embeds',
    title: '![[Embeds]]',
    snippets: [
      {
        label: 'Embed a note, a section, an image with size, a PDF page',
        syntax: '![[Internal links]]\n![[Internal links#^b15695]]\n![[Engelbart.jpg|100x145]]\n![[Document.pdf#page=3&height=400]]',
        render: false,
        note: 'Same syntax as a wikilink with ! in front. Width-only (|100) scales proportionally; a canvas embed shows shapes but not card text.',
        more: { href: '/guides/markdown-image', label: 'Image guide' },
      },
    ],
  },
  {
    id: 'callouts',
    title: 'Callouts',
    intro: 'A blockquote whose first line is [!type] becomes a coloured callout. The identifier is case-insensitive; text after it on the same line is the title.',
    snippets: [
      {
        label: 'Callout with custom title',
        syntax: '> [!tip] Callouts can have custom titles\n> Like this one.',
        preview: '> **Tip: Callouts can have custom titles**\n> Like this one.',
        note: 'Without a title the type name is used. Outside Obsidian (and GitHub, which only knows NOTE/TIP/IMPORTANT/WARNING/CAUTION) the [!tip] shows as text.',
      },
      {
        label: 'Foldable: - collapsed, + expanded',
        syntax: '> [!faq]- Are callouts foldable?\n> Yes! In a foldable callout, the contents are hidden when the callout is collapsed.\n\n> [!info]+ Open by default\n> A plus sign expands the callout by default.',
        preview: '> **FAQ: Are callouts foldable?** ▸\n> (collapsed)\n\n> **Info: Open by default** ▾\n> A plus sign expands the callout by default.',
        note: 'The fold marker goes directly after the closing bracket, before the title. GitHub alerts have no equivalent — use <details> there.',
        more: { href: '/guides/markdown-collapsible-section', label: 'Collapsible section guide' },
      },
      {
        label: 'Nested callouts',
        syntax: '> [!question] Can callouts be nested?\n>\n> > [!todo] Yes!, they can.\n>\n> > > [!example] You can even use multiple layers of nesting.',
        preview: '> **Question: Can callouts be nested?**\n>\n> > **Todo: Yes!, they can.**\n>\n> > > **Example: You can even use multiple layers of nesting.**',
        note: 'Each level is one more > prefix, exactly like nested blockquotes.',
        more: { href: '/guides/markdown-quote', label: 'Blockquote guide' },
      },
    ],
  },
  {
    id: 'properties',
    title: 'Properties (front matter)',
    snippets: [
      {
        label: 'YAML block at the top of the note',
        syntax: '---\ntitle: Three laws of motion\ntags:\n  - physics\n  - classical/mechanics\naliases:\n  - Newton\'s laws\ndate: 2020-08-21\nreviewed: 2020-08-21T10:30:00\npublished: true\nsource: "[[Principia]]"\n---',
        render: false,
        note: 'Types: text, list, number, checkbox (true/false), date, date & time, plus the special tags type. A wikilink in a property must be quoted. Markdown is not rendered in properties, and nested YAML is not supported.',
        more: { href: '/front-matter-generator', label: 'Front matter generator' },
      },
    ],
  },
  {
    id: 'tags',
    title: 'Tags',
    snippets: [
      {
        label: 'Inline and nested tags',
        syntax: 'Meeting notes #meeting #inbox/to-read #y1984',
        render: false,
        note: 'Letters, numbers, _ - / and emoji; no spaces; at least one non-numeric character (#1984 is not a tag, #y1984 is). Case-insensitive. A line starting with "# " is a heading, not a tag.',
      },
    ],
  },
  {
    id: 'math-diagrams',
    title: 'Math and diagrams',
    snippets: [
      {
        label: 'MathJax',
        syntax: 'Inline $e^{2i\\pi} = 1$ and a block:\n\n$$\n\\begin{vmatrix}a & b\\\\ c & d \\end{vmatrix}=ad-bc\n$$',
        render: false,
        note: 'Same $ and $$ delimiters as GitHub; Obsidian renders them with MathJax in Live Preview and Reading view.',
        more: { href: '/guides/markdown-math', label: 'Math guide' },
      },
      {
        label: 'Mermaid with links into the vault',
        syntax: '```mermaid\ngraph TD\nBiology --> Chemistry\nclass Biology,Chemistry internal-link;\n```',
        note: 'The internal-link class turns nodes into links to notes of the same name; quote names that contain special characters. Those links do not appear in Graph view.',
      },
    ],
  },
  {
    id: 'footnotes',
    title: 'Footnotes',
    snippets: [
      {
        label: 'Referenced and inline',
        syntax: 'A claim.[^1] Another with an inline note.^[Inline footnotes render in Reading view only.]\n\n[^1]: The referenced footnote.\n  Continuation lines start with two spaces.',
        preview: 'A claim.[^1] Another with an inline note.[^2]\n\n[^1]: The referenced footnote.\n  Continuation lines start with two spaces.\n[^2]: Inline footnotes render in Reading view only.',
        note: 'The ^[inline] form is Obsidian (and Pandoc) only; GitHub shows it as text.',
        more: { href: '/guides/markdown-footnotes', label: 'Footnotes guide' },
      },
    ],
  },
  {
    id: 'dataview',
    title: 'Dataview and other plugin syntax',
    snippets: [
      {
        label: 'Dataview query block (community plugin)',
        syntax: '```dataview\nTABLE date, status\nFROM #meeting\nSORT date DESC\n```',
        render: false,
        note: 'Not Obsidian markdown — it only works with the Dataview community plugin installed, and exports as a literal code block everywhere else. Same for ```tasks, ```query and inline `= this.file.name` fields.',
      },
    ],
  },
];

const FAQ: Array<{ q: string; a: string; href?: { path: string; label: string } }> = [
  {
    q: 'Is Obsidian markdown the same as GitHub markdown?',
    a: 'Mostly. Obsidian reads CommonMark plus the GFM tables, task lists, strikethrough and footnotes, and renders math and mermaid like GitHub. It adds [[wikilinks]], ![[embeds]], ==highlight==, %%comments%%, 13 callout types with fold markers, #tags and typed YAML properties, none of which GitHub understands. A note that uses only the shared subset renders identically in both.',
    href: { path: '/github-flavored-markdown', label: 'GitHub Flavored Markdown cheat sheet' },
  },
  {
    q: 'How do I make a callout in Obsidian?',
    a: 'Write a blockquote whose first line is [!type], for example > [!warning] Title, then the body on the following > lines. Append - after the bracket for a callout that starts collapsed or + for one that starts expanded. The type is case-insensitive; unknown types render as note.',
  },
  {
    q: 'What is the difference between [[wikilink]] and [markdown](link) in Obsidian?',
    a: 'Both resolve to the same note. Wikilinks use the note name, get autocomplete, and are rewritten automatically on rename. Markdown links need the path with %20 for spaces but survive outside Obsidian (GitHub, Hugo, VS Code). Settings → Files and links → "Use [[Wikilinks]]" controls which form Obsidian writes for you.',
    href: { path: '/guides/markdown-link', label: 'Markdown link guide' },
  },
  {
    q: 'How do I highlight text in Obsidian?',
    a: 'Wrap it in double equals signs: ==like this==. It renders as a <mark> element. Add an emoji right after the opening == to colour-code highlights visually. Other markdown apps that do not support ==highlight== show the equals signs.',
    href: { path: '/guides/markdown-color-text', label: 'Color text guide' },
  },
  {
    q: 'How do I embed a note or image in another note?',
    a: 'Prefix a wikilink with an exclamation mark: ![[Note]] embeds the whole note, ![[Note#Heading]] one section, ![[Note#^blockid]] one block, ![[image.png|300]] an image at 300 px wide, and ![[file.pdf#page=3]] a PDF opened at page 3.',
  },
  {
    q: 'What goes in Obsidian properties (front matter)?',
    a: 'A YAML block between --- lines at the very top of the file. Property names must be unique in a note; values are typed (text, list, number, checkbox, date, date & time) and a name keeps the same type across the whole vault. tags, aliases and cssclasses are the built-in list properties. Markdown is not rendered inside properties and nested YAML is unsupported.',
    href: { path: '/front-matter-generator', label: 'Front matter generator' },
  },
  {
    q: 'Will my Obsidian notes render correctly on GitHub or a website?',
    a: 'Only the shared subset will. Wikilinks, embeds, highlights, %% comments, tags and foldable callouts show up as literal text elsewhere. For portable notes, switch Obsidian to markdown links, use <!-- --> comments, prefer > [!NOTE] / [!TIP] / [!IMPORTANT] / [!WARNING] / [!CAUTION] which GitHub also renders, and keep plugin blocks like dataview out of pages you publish.',
    href: { path: '/markdown-flavors', label: 'Write for maximum portability' },
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

export default function ObsidianMarkdownPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'Obsidian markdown cheat sheet',
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
          <ToolIconTile slug="obsidian-markdown" size="lg" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">Obsidian markdown cheat sheet</h1>
            <UpdatedLine date={UPDATED} />
          </div>
        </div>
        <p className="mt-4 text-base text-gray-600">
          Obsidian reads standard markdown (CommonMark plus GFM tables, task lists, footnotes, math
          and mermaid) and adds its own layer: <code className="rounded bg-gray-100 px-1">[[wikilinks]]</code>,{' '}
          <code className="rounded bg-gray-100 px-1">![[embeds]]</code>, thirteen callout types that can fold,{' '}
          <code className="rounded bg-gray-100 px-1">==highlight==</code>,{' '}
          <code className="rounded bg-gray-100 px-1">%%comments%%</code>, #tags and typed YAML properties.
          Everything below is taken from Obsidian Help; the last table lists what will not survive a
          trip to GitHub.
        </p>
        <SectionNav sections={SECTIONS} className="mt-5 flex flex-wrap gap-2 text-xs" />
      </div>

      <CheatSheet sections={SECTIONS} />

      <section id="callout-types" className="mt-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">All callout types and aliases</h2>
        <p className="text-base text-gray-600">
          Write <code className="rounded bg-gray-100 px-1">&gt; [!type]</code>, optionally followed by <code className="rounded bg-gray-100 px-1">-</code> or{' '}
          <code className="rounded bg-gray-100 px-1">+</code> to fold, then a title. Aliases render identically to their base type.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>Type</Th>
                <Th>Aliases</Th>
                <Th>Typical use</Th>
              </tr>
            </thead>
            <tbody>
              {CALLOUTS.map((c) => (
                <tr key={c.type} className="border-b border-gray-100">
                  <Td mono>{`> [!${c.type}]`}</Td>
                  <Td>{c.aliases}</Td>
                  <Td>{c.use}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="link-table" className="mt-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Link syntax reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>You want</Th>
                <Th>Type this</Th>
                <Th>Notes</Th>
              </tr>
            </thead>
            <tbody>
              {LINKS.map((l) => (
                <tr key={l.want} className="border-b border-gray-100">
                  <Td>{l.want}</Td>
                  <Td mono>{l.syntax}</Td>
                  <Td>{l.note}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="embed-table" className="mt-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Embed syntax reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>Embed</Th>
                <Th>Type this</Th>
              </tr>
            </thead>
            <tbody>
              {EMBEDS.map((e) => (
                <tr key={e.want} className="border-b border-gray-100">
                  <Td>{e.want}</Td>
                  <Td mono>{e.syntax}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="vs-gfm" className="mt-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Obsidian vs GitHub Flavored Markdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>Feature</Th>
                <Th>Obsidian</Th>
                <Th>GFM / github.com</Th>
              </tr>
            </thead>
            <tbody>
              {VS_GFM.map((r) => (
                <tr key={r.feature} className="border-b border-gray-100">
                  <Td>
                    <span className="font-medium text-gray-900">{r.feature}</span>
                  </Td>
                  <Td mono>{r.obsidian}</Td>
                  <Td mono>{r.gfm}</Td>
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
            Generate a properties block with the{' '}
            <Link href="/front-matter-generator" className="text-indigo-700 underline">front matter generator</Link>, build
            tables with the{' '}
            <Link href="/markdown-table-generator" className="text-indigo-700 underline">table generator</Link>, convert a
            note to{' '}
            <Link href="/markdown-to-pdf" className="text-indigo-700 underline">PDF</Link> or{' '}
            <Link href="/markdown-to-word" className="text-indigo-700 underline">Word</Link>, or{' '}
            <Link href="/" className="text-indigo-700 underline">share a note as a link</Link> (the shared subset renders;
            wikilinks do not). See also the{' '}
            <Link href="/notion-markdown" className="text-indigo-700 underline">Notion</Link> sheet and the{' '}
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
