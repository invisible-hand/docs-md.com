import type { Section } from '@/components/CheatSheet';

export const PANDOC_MANUAL = 'https://pandoc.org/MANUAL.html#pandocs-markdown';
export const QUARTO_R = 'https://quarto.org/docs/computations/r.html';
export const QUARTO_EXEC = 'https://quarto.org/docs/computations/execution-options.html';
export const RMD = 'https://rmarkdown.rstudio.com/lesson-3.html';

// Content of /pandoc-markdown, shared by the page and /llms-full.txt.
export const SECTIONS: Section[] = [
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
