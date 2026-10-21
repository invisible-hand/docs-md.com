import Link from 'next/link';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import CheatSheet, { SectionNav } from '@/components/CheatSheet';
import { SECTIONS, PANDOC_MANUAL, QUARTO_R, RMD } from '@/lib/platform-sheets/pandoc-markdown';
import UpdatedLine from '@/components/UpdatedLine';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-10-15';
const PANDOC_OPTIONS = 'https://pandoc.org/MANUAL.html#options';

export const metadata = pageMetadata({
  title: 'Pandoc Markdown Cheat Sheet (R Markdown and Quarto)',
  description:
    'Pandoc markdown extensions: fenced divs, attributes, definition lists, citations, footnotes, grid tables, math, YAML, conversion commands.',
  path: '/pandoc-markdown',
  type: 'article',
  kicker: 'Reference',
});

const FAQ: Array<{ q: string; a: string; href?: { path: string; label: string } }> = [
  {
    q: 'What is Pandoc markdown?',
    a: 'Pandoc\'s Markdown is the input dialect of the pandoc document converter: original markdown plus a long list of extensions — YAML metadata, fenced divs and bracketed spans with attributes, definition lists, four table syntaxes, footnotes, citations, TeX math, superscript and subscript, example lists and raw format blocks. Each extension has a name (footnotes, fenced_divs, citations) that can be switched with +name or -name after the format, e.g. -f markdown-smart.',
  },
  {
    q: 'How do I convert markdown to Word, PDF or HTML with pandoc?',
    a: 'pandoc input.md -o output.docx for Word, pandoc input.md -o output.pdf (needs a LaTeX engine, or add --pdf-engine=wkhtmltopdf / typst) for PDF, and pandoc input.md -s -o output.html for a standalone HTML page. The output format is inferred from the extension; -t sets it explicitly. Add --toc for a table of contents and --reference-doc=styles.docx to apply Word styles.',
    href: { path: '/markdown-to-word', label: 'Browser-side markdown to Word (no install)' },
  },
  {
    q: 'How do citations work in pandoc markdown?',
    a: 'Write [@doe99] for a parenthetical citation, @doe99 for author-in-text, [-@doe99] to suppress the author, and [see @doe99, pp. 33-35; @smith04, chap. 1] for prefixes, locators and multiple items. Run pandoc with --citeproc --bibliography refs.bib (and optionally --csl style.csl); the bibliography is appended where a div with id="refs" is placed, or at the end.',
  },
  {
    q: 'What is the difference between a pipe table and a grid table in pandoc?',
    a: 'Pipe tables are the familiar | a | b | syntax: easy to write, but cells cannot contain block elements and cannot span lines. Grid tables draw the cell borders with +, - and |; cells may contain paragraphs, lists and code blocks, and can span rows and columns. Simple and multiline tables are whitespace-aligned alternatives; all four accept a caption line starting with "Table:" or ":".',
    href: { path: '/markdown-table-generator', label: 'Pipe table generator' },
  },
  {
    q: 'What is the difference between R Markdown and Quarto?',
    a: 'Both put executable code chunks (```{r}) inside pandoc markdown and render through pandoc. R Markdown (rmarkdown + knitr) sets chunk options inside the braces: ```{r name, echo=FALSE}. Quarto (.qmd, the quarto CLI) sets them on #| comment lines inside the chunk (#| echo: false), uses hyphenated names (fig-cap instead of fig.cap), supports Python and Julia natively through Jupyter, and reads document-wide defaults from an execute: block in the YAML header.',
  },
  {
    q: 'How do I add a footnote or a definition list in pandoc markdown?',
    a: 'Footnote: a reference [^note] in the text and a definition [^note]: text anywhere outside other blocks, or an inline note ^[like this] with no identifier. Definition list: the term on one line, then one or more lines starting with a colon or tilde (": definition"), each definition indented to align after the marker.',
    href: { path: '/guides/markdown-footnotes', label: 'Footnotes guide' },
  },
  {
    q: 'How do I write math in pandoc markdown?',
    a: 'Inline math between single dollar signs ($E = mc^2$) with no space inside the dollars; display math between double dollars ($$ … $$). For HTML output add --mathjax (now --math-method=mathjax) or --katex; LaTeX and PDF output render it natively; docx output converts it to Word equations.',
    href: { path: '/guides/markdown-math', label: 'Markdown math guide' },
  },
];

const EXTENSIONS: Array<{ ext: string; name: string; syntax: string; note: string }> = [
  { ext: 'YAML metadata', name: 'yaml_metadata_block', syntax: '---\\ntitle: My doc\\nauthor: Ana\\n---', note: 'Must start with --- (no blank line after) and end with --- or ...' },
  { ext: 'Heading attributes', name: 'header_attributes', syntax: '# Intro {#intro .unnumbered}', note: 'Also {-} as shorthand for .unnumbered.' },
  { ext: 'Fenced div', name: 'fenced_divs', syntax: '::: {.warning}\\nText\\n:::', note: 'Nestable; a bare word (::: warning) is a class.' },
  { ext: 'Bracketed span', name: 'bracketed_spans', syntax: '[some text]{.smallcaps #id}', note: 'Inline element with attributes.' },
  { ext: 'Definition list', name: 'definition_lists', syntax: 'Term\\n:   Definition', note: 'Marker : or ~; blank line between items.' },
  { ext: 'Footnote', name: 'footnotes', syntax: 'Text[^1]\\n\\n[^1]: Note.', note: 'Definition can go anywhere outside blocks.' },
  { ext: 'Inline footnote', name: 'inline_notes', syntax: 'Text^[Inline note.]', note: 'Single paragraph only.' },
  { ext: 'Citation', name: 'citations', syntax: '[@doe99; @smith04, p. 3]', note: 'Needs --citeproc and --bibliography.' },
  { ext: 'Pipe table', name: 'pipe_tables', syntax: '| a | b |\\n|--:|:--|', note: 'No block content in cells.' },
  { ext: 'Grid table', name: 'grid_tables', syntax: '+---+---+\\n| a | b |\\n+===+===+', note: 'Block content and spans allowed.' },
  { ext: 'Multiline table', name: 'multiline_tables', syntax: '----- -----\\nHead  Head\\n----- -----', note: 'Rows separated by blank lines.' },
  { ext: 'Table caption', name: 'table_captions', syntax: 'Table: Caption text', note: 'Before or after the table; ":" alone also works.' },
  { ext: 'Inline math', name: 'tex_math_dollars', syntax: '$x^2$', note: 'No space after opening or before closing $.' },
  { ext: 'Display math', name: 'tex_math_dollars', syntax: '$$\\n\\\\int_0^1 f\\n$$', note: 'No blank lines inside.' },
  { ext: 'Superscript / subscript', name: 'superscript, subscript', syntax: '2^10^  H~2~O', note: 'Escape inner spaces: P~a\\\\ cat~.' },
  { ext: 'Strikeout', name: 'strikeout', syntax: '~~deleted~~', note: 'Same as GFM.' },
  { ext: 'Line block', name: 'line_blocks', syntax: '| Line one\\n| Line two', note: 'Preserves line breaks (verse, addresses).' },
  { ext: 'Example list', name: 'example_lists', syntax: '(@good) Example.\\nSee (@good).', note: 'Numbered continuously across the document.' },
  { ext: 'Fenced code attributes', name: 'fenced_code_attributes', syntax: '```{.python .numberLines startFrom="10"}', note: 'Classes, id and key=value on fences.' },
  { ext: 'Raw block', name: 'raw_attribute', syntax: '```{=latex}\\n\\\\newpage\\n```', note: 'Passed through only to that output format.' },
  { ext: 'Link / image attributes', name: 'link_attributes', syntax: '![Alt](img.png){width=50%}', note: 'width, height, #id, .class.' },
  { ext: 'Implicit figure', name: 'implicit_figures', syntax: '![Caption](img.png)', note: 'An image alone in a paragraph becomes a captioned figure.' },
  { ext: 'Task list', name: 'task_lists', syntax: '- [x] done\\n- [ ] todo', note: 'Same as GFM.' },
  { ext: 'Smart punctuation', name: 'smart', syntax: '"quotes" -- --- ...', note: 'Curly quotes, en/em dashes, ellipsis.' },
];

const COMMANDS: Array<{ goal: string; cmd: string; note: string }> = [
  { goal: 'Markdown to Word', cmd: 'pandoc doc.md -o doc.docx', note: 'Format inferred from the extension.' },
  { goal: 'Word with your styles', cmd: 'pandoc doc.md --reference-doc=template.docx -o doc.docx', note: 'Styles (Heading 1, Body Text…) copied from the reference file.' },
  { goal: 'Markdown to PDF (LaTeX)', cmd: 'pandoc doc.md -o doc.pdf', note: 'Needs pdflatex/xelatex installed.' },
  { goal: 'PDF without LaTeX', cmd: 'pandoc doc.md --pdf-engine=typst -o doc.pdf', note: 'Also wkhtmltopdf, weasyprint, context, lualatex.' },
  { goal: 'Standalone HTML', cmd: 'pandoc doc.md -s -o doc.html', note: '-s adds <html>, <head> and CSS; omit for a fragment.' },
  { goal: 'Single-file HTML', cmd: 'pandoc doc.md -s --embed-resources -o doc.html', note: 'Inlines images and CSS; --self-contained is the deprecated synonym.' },
  { goal: 'HTML with math', cmd: 'pandoc doc.md -s --mathjax -o doc.html', note: '--mathjax is now spelled --math-method=mathjax.' },
  { goal: 'HTML with a stylesheet and TOC', cmd: 'pandoc doc.md -s --toc -c style.css -o doc.html', note: '--toc-depth=2 limits levels.' },
  { goal: 'EPUB', cmd: 'pandoc doc.md -o book.epub --metadata title="Title"', note: 'Chapters split at level-1 headings; add --epub-cover-image.' },
  { goal: 'With citations', cmd: 'pandoc doc.md --citeproc --bibliography=refs.bib --csl=apa.csl -o doc.docx', note: 'Bibliography appended automatically.' },
  { goal: 'Explicit formats', cmd: 'pandoc -f markdown -t gfm doc.md -o README.md', note: 'Pandoc markdown to GitHub Flavored Markdown.' },
  { goal: 'Toggle an extension', cmd: 'pandoc -f markdown-smart+hard_line_breaks doc.md -o doc.html', note: '-name disables, +name enables.' },
  { goal: 'Jira / Confluence wiki markup', cmd: 'pandoc -t jira doc.md', note: 'Writer for Atlassian wiki markup.' },
  { goal: 'Many files to one book', cmd: 'pandoc ch1.md ch2.md ch3.md metadata.yaml -s -o book.html', note: 'Inputs are concatenated; metadata can live in its own YAML file.' },
  { goal: 'Reverse: Word/HTML to markdown', cmd: 'pandoc doc.docx -t gfm -o doc.md', note: 'Add --extract-media=./img to pull images out.' },
];

const CHUNK_OPTIONS: Array<{ opt: string; rmd: string; quarto: string; meaning: string }> = [
  { opt: 'Hide code, show output', rmd: 'echo=FALSE', quarto: 'echo: false', meaning: 'Prevents code, but not results, from appearing.' },
  { opt: 'Run but hide everything', rmd: 'include=FALSE', quarto: 'include: false', meaning: 'Code runs; no code or results in the document.' },
  { opt: 'Do not run', rmd: 'eval=FALSE', quarto: 'eval: false', meaning: 'Code is shown but not executed.' },
  { opt: 'Hide warnings', rmd: 'warning=FALSE', quarto: 'warning: false', meaning: 'Warnings generated by the code are dropped.' },
  { opt: 'Hide messages', rmd: 'message=FALSE', quarto: 'message: false', meaning: 'Messages (e.g. package loading) are dropped.' },
  { opt: 'Continue on error', rmd: 'error=TRUE', quarto: 'error: true', meaning: 'Errors are printed instead of stopping the render.' },
  { opt: 'Figure caption', rmd: 'fig.cap="…"', quarto: 'fig-cap: "…"', meaning: 'Caption under a plot; Quarto also has fig-alt.' },
  { opt: 'Chunk label', rmd: '{r my-label}', quarto: 'label: my-label', meaning: 'Names the chunk; fig- prefix enables cross-references in Quarto.' },
  { opt: 'Output handling', rmd: 'results=\'asis\'', quarto: 'output: asis', meaning: 'Treat printed text as raw markdown.' },
];


export default function PandocMarkdownPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'Pandoc markdown cheat sheet (with R Markdown and Quarto)',
        description: metadata.description,
        dateModified: UPDATED,
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: 'https://docs-md.com/pandoc-markdown',
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
  const code = 'whitespace-pre rounded bg-gray-100 px-1.5 py-0.5';
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-10 max-w-3xl">
        <div className="flex items-start gap-4">
          <ToolIconTile slug="pandoc-markdown" size="lg" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
              Pandoc markdown cheat sheet (with R Markdown and Quarto)
            </h1>
            <UpdatedLine date={UPDATED} />
          </div>
        </div>
        <p className="mt-4 text-base text-gray-600">
          Pandoc&apos;s Markdown is standard markdown plus the extensions a document converter needs: a YAML
          header, <code className="rounded bg-gray-100 px-1 text-sm">{'{#id .class}'}</code> attributes on
          anything, <code className="rounded bg-gray-100 px-1 text-sm">:::</code> fenced divs, definition
          lists, footnotes, <code className="rounded bg-gray-100 px-1 text-sm">[@key]</code> citations, four
          table syntaxes and TeX math. R Markdown and Quarto add executable{' '}
          <code className="rounded bg-gray-100 px-1 text-sm">{'```{r}'}</code> chunks on top. Every example
          below is taken from the{' '}
          <a href={PANDOC_MANUAL} className="text-indigo-700 underline" rel="noopener">pandoc manual</a>,{' '}
          <a href={QUARTO_R} className="text-indigo-700 underline" rel="noopener">quarto.org</a> and{' '}
          <a href={RMD} className="text-indigo-700 underline" rel="noopener">rmarkdown.rstudio.com</a>.
        </p>
        <SectionNav sections={SECTIONS} />
      </div>

      <section className="mb-12 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Pandoc extensions table</h2>
        <p className="max-w-3xl text-base text-gray-600">
          Extension names are what you pass after the format: <code className={code}>-f markdown+emoji-smart</code>.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="py-2 pr-4 font-semibold text-gray-950">Feature</th>
                <th className="py-2 pr-4 font-semibold text-gray-950">Extension</th>
                <th className="py-2 pr-4 font-semibold text-gray-950">Syntax</th>
                <th className="py-2 font-semibold text-gray-950">Notes</th>
              </tr>
            </thead>
            <tbody>
              {EXTENSIONS.map((r) => (
                <tr key={r.ext} className="border-b border-gray-100 align-top">
                  <td className="py-2.5 pr-4 font-medium text-gray-900">{r.ext}</td>
                  <td className="py-2.5 pr-4"><code className={code}>{r.name}</code></td>
                  <td className="py-2.5 pr-4"><code className={code}>{r.syntax.replace(/\\n/g, '\n')}</code></td>
                  <td className="py-2.5 text-gray-600">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CheatSheet sections={SECTIONS} />

      <section id="commands" className="mt-12 scroll-mt-8 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Conversion command table</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="py-2 pr-4 font-semibold text-gray-950">Goal</th>
                <th className="py-2 pr-4 font-semibold text-gray-950">Command</th>
                <th className="py-2 font-semibold text-gray-950">Notes</th>
              </tr>
            </thead>
            <tbody>
              {COMMANDS.map((r) => (
                <tr key={r.goal} className="border-b border-gray-100 align-top">
                  <td className="py-2.5 pr-4 font-medium text-gray-900">{r.goal}</td>
                  <td className="py-2.5 pr-4"><code className={code}>{r.cmd}</code></td>
                  <td className="py-2.5 text-gray-600">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600">
          Flags from the <a href={PANDOC_OPTIONS} className="text-indigo-700 underline" rel="noopener">pandoc options reference</a>. No pandoc
          installed? The <Link href="/markdown-to-word" className="text-indigo-700 underline">markdown to Word</Link>,{' '}
          <Link href="/markdown-to-pdf" className="text-indigo-700 underline">markdown to PDF</Link> and{' '}
          <Link href="/markdown-to-html" className="text-indigo-700 underline">markdown to HTML</Link> tools run in the browser.
        </p>
      </section>

      <section id="chunk-options" className="mt-12 scroll-mt-8 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Chunk options: R Markdown vs Quarto</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="py-2 pr-4 font-semibold text-gray-950">Goal</th>
                <th className="py-2 pr-4 font-semibold text-gray-950">R Markdown {'```{r …}'}</th>
                <th className="py-2 pr-4 font-semibold text-gray-950">Quarto #|</th>
                <th className="py-2 font-semibold text-gray-950">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {CHUNK_OPTIONS.map((r) => (
                <tr key={r.opt} className="border-b border-gray-100 align-top">
                  <td className="py-2.5 pr-4 font-medium text-gray-900">{r.opt}</td>
                  <td className="py-2.5 pr-4"><code className={code}>{r.rmd}</code></td>
                  <td className="py-2.5 pr-4"><code className={code}>{r.quarto}</code></td>
                  <td className="py-2.5 text-gray-600">{r.meaning}</td>
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

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">Related</h2>
          <p className="text-sm text-gray-600">
            <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">Markdown cheat sheet</Link>{' · '}
            <Link href="/mdx-cheat-sheet" className="text-indigo-700 underline">MDX cheat sheet</Link>{' · '}
            <Link href="/jira-markdown" className="text-indigo-700 underline">Jira wiki markup</Link>{' · '}
            <Link href="/markdown-to-word" className="text-indigo-700 underline">Markdown to Word</Link>{' · '}
            <Link href="/markdown-to-pdf" className="text-indigo-700 underline">Markdown to PDF</Link>{' · '}
            <Link href="/guides/markdown-footnotes" className="text-indigo-700 underline">Footnotes guide</Link>{' · '}
                        <Link href="/guides/markdown-page-break" className="text-indigo-700 underline">Page break guide</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
