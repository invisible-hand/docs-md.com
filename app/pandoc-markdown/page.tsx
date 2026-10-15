import Link from 'next/link';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import CheatSheet, { SectionNav, type Section } from '@/components/CheatSheet';
import UpdatedLine from '@/components/UpdatedLine';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-10-15';
const PANDOC_MANUAL = 'https://pandoc.org/MANUAL.html#pandocs-markdown';
const PANDOC_OPTIONS = 'https://pandoc.org/MANUAL.html#options';
const QUARTO_R = 'https://quarto.org/docs/computations/r.html';
const QUARTO_EXEC = 'https://quarto.org/docs/computations/execution-options.html';
const RMD = 'https://rmarkdown.rstudio.com/lesson-3.html';

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

const SECTIONS: Section[] = [
  {
    id: 'structure',
    title: 'Metadata, attributes, divs and spans',
    snippets: [
      {
        label: 'YAML metadata block',
        syntax: '---\ntitle: Quarterly report\nauthor:\n  - Ana Ruiz\n  - Ben Okafor\ndate: 2026-10-15\nabstract: |\n  Two paragraphs are fine here.\n---',
        render: false,
        note: 'String values are themselves parsed as markdown; the block may appear anywhere if preceded by a blank line, but the top is conventional.',
        more: { href: '/front-matter-generator', label: 'Front matter generator' },
      },
      {
        label: 'Heading identifiers and classes',
        syntax: '# My heading {#foo}\n\n## Appendix {.unnumbered}\n\n## Also unnumbered {-}\n\nSee [the heading](#foo).',
        preview: '# My heading\n\n## Appendix\n\n## Also unnumbered\n\nSee [the heading](#my-heading).',
        note: 'Identifiers are used for links and LaTeX labels; .unnumbered (or -) keeps a heading out of --number-sections.',
      },
      {
        label: 'Fenced divs',
        syntax: '::::: {#special .sidebar}\nHere is a paragraph.\n\nAnd another.\n:::::\n\n::: Warning ::::::\nThis is a warning.\n::: Danger\nThis is a warning within a warning.\n:::\n::::::::::::::::::',
        render: false,
        note: 'Opening fences must carry attributes (or a single class word); a fence without attributes always closes. Nesting works, with any number of colons ≥ 3.',
      },
      {
        label: 'Bracketed spans and raw blocks',
        syntax: '[This is *some text*]{.class key="val"}\n\nThis is `<a>html</a>`{=html} inline.\n\n```{=latex}\n\\newpage\n```',
        render: false,
        note: '{=format} marks raw content passed only to that writer (html, latex, openxml for docx, typst).',
      },
    ],
  },
  {
    id: 'lists-notes',
    title: 'Definition lists, footnotes, example lists',
    snippets: [
      {
        label: 'Definition list',
        syntax: 'Term 1\n:   Definition 1\n\nTerm 2 with *inline markup*\n:   Definition 2\n\n        { some code, part of Definition 2 }\n\n    Third paragraph of definition 2.',
        render: false,
        note: 'Each term on one line, followed by one or more definitions starting with : or ~; a term may have several definitions.',
        more: { href: '/guides/markdown-definition-list', label: 'Definition list guide' },
      },
      {
        label: 'Footnotes, regular and inline',
        syntax: 'Here is a footnote reference,[^1] and another.[^longnote]\n\n[^1]: Here is the footnote.\n\n[^longnote]: Here\'s one with multiple blocks.\n\n    Subsequent paragraphs are indented.\n\nHere is an inline note.^[Inline notes are easier to write.]',
        preview: 'Here is a footnote reference,[^1] and another.[^longnote]\n\n[^1]: Here is the footnote.\n\n[^longnote]: Here\'s one with multiple blocks.\n\n    Subsequent paragraphs are indented.\n\nHere is an inline note.[^3]\n\n[^3]: Inline notes are easier to write.',
        note: 'Identifiers may not contain spaces or ^ [ ]; footnotes are renumbered sequentially in output.',
      },
      {
        label: 'Numbered example lists',
        syntax: '(@) My first example will be numbered (1).\n(@) My second example will be numbered (2).\n\nExplanation of examples.\n\n(@good) This is a good example.\n\nAs (@good) illustrates, ...',
        render: false,
        note: 'The @ marker counts across the whole document, and labelled examples can be referenced later by label.',
      },
    ],
  },
  {
    id: 'citations',
    title: 'Citations',
    snippets: [
      {
        label: 'Citation forms',
        syntax: 'Blah blah [@doe99; @smith2000; @smith2004].\n\nBlah blah [see @doe99, pp. 33-35 and *passim*; @smith04, chap. 1].\n\nSmith says blah [-@smith04].\n\n@smith04 says blah.\n\n@smith04 [p. 33] says blah.',
        render: false,
        note: 'Keys come from a BibTeX/CSL JSON/YAML bibliography; run pandoc --citeproc --bibliography refs.bib, and put ::: {#refs} ::: where the bibliography should go.',
      },
      {
        label: 'Locators and odd keys',
        syntax: '[@smith{ii, A, D-Z}, with a suffix]\n[@{https://example.com/bib?name=foobar&date=2000}, p. 33]',
        render: false,
        note: 'Curly braces force a locator or protect a key that contains punctuation such as a URL.',
      },
    ],
  },
  {
    id: 'tables',
    title: 'Tables: pipe, grid, multiline, simple',
    snippets: [
      {
        label: 'Pipe table with caption',
        syntax: '| Right | Left | Default | Center |\n|------:|:-----|---------|:------:|\n|   12  |  12  |    12   |    12  |\n|  123  |  123 |   123   |   123  |\n\n: Demonstration of pipe table syntax.',
        preview: '| Right | Left | Default | Center |\n|------:|:-----|---------|:------:|\n|   12  |  12  |    12   |    12  |\n|  123  |  123 |   123   |   123  |\n\nTable: Demonstration of pipe table syntax.',
        note: 'Cells cannot hold block elements; relative column widths come from the dash counts when any line exceeds --columns.',
        more: { href: '/guides/markdown-table', label: 'Table guide' },
      },
      {
        label: 'Grid table (block content, spans)',
        syntax: ': Sample grid table.\n\n+---------------+---------------+--------------------+\n| Fruit         | Price         | Advantages         |\n+===============+===============+====================+\n| Bananas       | $1.34         | - built-in wrapper |\n|               |               | - bright color     |\n+---------------+---------------+--------------------+\n| Oranges       | $2.10         | - cures scurvy     |\n|               |               | - tasty            |\n+---------------+---------------+--------------------+',
        render: false,
        note: 'The = row separates header from body (omit it for a headerless table); cells may contain lists, paragraphs and code, and can span rows or columns.',
      },
      {
        label: 'Multiline table',
        syntax: '-------------------------------------------------------------\n Centered   Default           Right Left\n  Header    Aligned         Aligned Aligned\n----------- ------- --------------- -------------------------\n   First    row                12.0 Example of a row that\n                                    spans multiple lines.\n\n  Second    row                 5.0 Here\'s another one. Note\n                                    the blank line between\n                                    rows.\n-------------------------------------------------------------\n\nTable: Here\'s the caption.',
        render: false,
        note: 'Rows are separated by blank lines so cell text can wrap; alignment follows where the header text sits relative to the dashes.',
      },
      {
        label: 'Simple table',
        syntax: '  Right     Left     Center     Default\n-------     ------ ----------   -------\n     12     12        12            12\n    123     123       123          123\n\nTable: Demonstration of simple table syntax.',
        render: false,
        note: 'Columns are defined by the dashed line; one row per line, no wrapping.',
      },
    ],
  },
  {
    id: 'inline',
    title: 'Math, super/subscript, line blocks, code attributes',
    snippets: [
      {
        label: 'TeX math',
        syntax: 'Inline: $E = mc^2$ and display:\n\n$$\n\\int_0^1 x^2 \\, dx = \\frac{1}{3}\n$$',
        render: false,
        note: 'The opening $ needs a non-space to its right and the closing $ a non-space to its left (and no digit after), so $20,000 and $30,000 stay plain text.',
        more: { href: '/guides/markdown-math', label: 'Math guide' },
      },
      {
        label: 'Superscript and subscript',
        syntax: 'H~2~O is a liquid.  2^10^ is 1024.  P~a\\ cat~',
        preview: 'H<sub>2</sub>O is a liquid.  2<sup>10</sup> is 1024.  P<sub>a cat</sub>',
        note: 'Spaces inside ^…^ or ~…~ must be backslash-escaped; a single tilde is subscript, not strikethrough.',
      },
      {
        label: 'Line block',
        syntax: '| The limerick packs laughs anatomical\n| In space that is quite economical.\n|    But the good ones I\'ve seen\n|    So seldom are clean',
        render: false,
        note: 'Line breaks and leading spaces are preserved; inline formatting still applies.',
      },
      {
        label: 'Fenced code with attributes',
        syntax: '~~~~ {#mycode .haskell .numberLines startFrom="100"}\nqsort []     = []\nqsort (x:xs) = qsort (filter (< x) xs) ++ [x] ++\n               qsort (filter (>= x) xs)\n~~~~',
        render: false,
        note: 'Tildes or backticks both fence; .numberLines turns on line numbers in HTML and LaTeX output.',
      },
    ],
    more: [{ href: PANDOC_MANUAL, label: 'Pandoc manual: Pandoc\u2019s Markdown (official)' }],
  },
  {
    id: 'rmarkdown-quarto',
    title: 'R Markdown and Quarto',
    intro: 'Both wrap pandoc markdown around executable code chunks. The chunk header differs: R Markdown puts options in the braces, Quarto puts them on #| lines.',
    snippets: [
      {
        label: 'R Markdown document (.Rmd)',
        syntax: '---\ntitle: "Air quality"\noutput: html_document\n---\n\n```{r setup, include=FALSE}\nknitr::opts_chunk$set(echo = TRUE)\n```\n\n## Temperature vs ozone\n\n```{r ozone-plot, echo=FALSE, fig.cap="Temperature and ozone level.", warning=FALSE}\nplot(airquality$Temp, airquality$Ozone)\n```\n\nThe mean temperature was `r mean(airquality$Temp)` degrees.',
        render: false,
        note: 'Chunk options are comma-separated R arguments after the optional label; inline code `r expr` prints a value in prose and accepts no options.',
      },
      {
        label: 'Quarto document (.qmd)',
        syntax: '---\ntitle: "ggplot2 demo"\nauthor: "Norah Jones"\ndate: "5/22/2021"\nformat:\n  html:\n    code-fold: true\nexecute:\n  echo: false\n---\n\n```{r}\n#| label: fig-airquality\n#| fig-cap: "Temperature and ozone level."\n#| warning: false\n\nlibrary(ggplot2)\nggplot(airquality, aes(Temp, Ozone)) + geom_point() + geom_smooth(method = "loess")\n```\n\nSee @fig-airquality.',
        render: false,
        note: 'Lines at the top of a cell prefixed with #| are options; execute: in the header sets document-wide defaults; ```{python} and ```{julia} cells work the same way.',
      },
      {
        label: 'Render commands',
        syntax: 'quarto render document.qmd          # all formats in the header\nquarto render document.qmd --to pdf\n\nRscript -e \'rmarkdown::render("document.Rmd")\'',
        render: false,
        note: 'Both call pandoc underneath, so every pandoc extension on this page is available inside .Rmd and .qmd files.',
      },
    ],
    more: [
      { href: QUARTO_R, label: 'Quarto: using R (official)' },
      { href: QUARTO_EXEC, label: 'Quarto: execution options (official)' },
      { href: RMD, label: 'R Markdown: code chunks (official)' },
    ],
  },
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
