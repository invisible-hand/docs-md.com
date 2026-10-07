---
title: Markdown Page Break — How to Force a New Page
h1: Markdown page break: how to start a new page in PDF and Word
description: Markdown has no page break syntax. Use <div style="page-break-after: always"> for HTML and PDF export, \newpage in Pandoc, or editor options. Why --- is not a page break.
updated: 2026-10-07
related: markdown-horizontal-rule, markdown-new-line, markdown-collapsible-section, markdown-color-text, markdown-footnotes
---
Markdown has no page break syntax, because markdown describes a document's structure and a web page has no pages. When you export to PDF or print, the most widely supported way to force a break is an empty HTML block with a CSS page-break property:

```markdown
First page content.

<div style="page-break-after: always;"></div>

Second page content.
```

This works in Typora, Obsidian's PDF export, VS Code's Markdown PDF extension and any markdown-to-HTML-to-PDF pipeline, because those tools print through a browser engine that honours the CSS. It does nothing on GitHub and other web renderers, which show a blank space at most. Pandoc has its own commands (`\newpage` for LaTeX PDF, a raw block for Word). The rule of thumb below is the one to remember: the horizontal rule `---` is not a page break.

## What is the markdown page break syntax?

There is no standard syntax, so the table lists what each tool or export path accepts. "Works in" means that the break appears in the exported PDF or document, not on screen:

| Method | Syntax | Pandoc to PDF (LaTeX) | Pandoc to Word | Typora PDF | Obsidian PDF | VS Code Markdown PDF | GitHub view |
|---|---|---|---|---|---|---|---|
| CSS page break | `<div style="page-break-after: always;"></div>` | no | no | yes | yes | yes | no (no effect) |
| Modern CSS | `<div style="break-after: page;"></div>` | no | no | yes | yes | yes | no |
| LaTeX command | `\newpage` or `\pagebreak` | yes | no | no | no | no | prints text |
| Raw Word break | an `openxml` raw block | no | yes | no | no | no | no |
| Horizontal rule | `---` | no (draws a line) | no (draws a line) | no | no | no | draws a line |

Check the export tool, not the editor preview: a break that is invisible while you write often appears only in the PDF.

## How do you add a page break with HTML?

Insert an empty block element with `page-break-after: always` (or `break-after: page`) where you want the new page to start. Leave blank lines around it so the markdown parser treats it as a separate HTML block:

```markdown
## Chapter 1

Text of chapter one.

<div style="page-break-after: always;"></div>

## Chapter 2
```

Variants you will meet: `<div style="page-break-before: always;"></div>` breaks before the element; `<p style="page-break-after: always">&nbsp;</p>` is used in older guides for tools that drop empty divs; the VS Code Markdown PDF extension documents `<div class="page"/>` as its break marker. For headings, a stylesheet rule `h1 { page-break-before: always; }` is cleaner than a manual break. `page-break-after` is the older name and `break-after: page` is the current CSS name, and browsers accept both.

The break only appears when the markdown goes through a CSS print engine. If your pipeline strips raw HTML (many sanitisers do), the div disappears and so does the break.

## How do you add a page break in Pandoc?

For PDF through LaTeX, write the LaTeX command `\newpage` on its own line; Pandoc passes it through:

```markdown
End of the first page.

\newpage

Start of the second page.
```

`\pagebreak` and `\clearpage` also work (`\clearpage` also flushes floating figures). For Word (`.docx`) output, `\newpage` is ignored, so use a raw OpenXML block with a page-break run:

````markdown
```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```
````

For HTML output from Pandoc, use the `<div style>` form. If you need one source for several outputs, a Lua filter can turn a single marker (for example a `\newpage` paragraph) into the right raw block for each format. That is the standard approach and is documented in the Pandoc manual and its filter examples.

## How does page breaking work in Typora, Obsidian and VS Code?

Each editor exports through a browser-style engine, so the HTML approach works in all three; none has a dedicated markdown command. Typora exports to PDF with the CSS in the document and honours `page-break-after: always`. Obsidian's "Export to PDF" respects the same CSS in reading view output, so you can add the div in the note; it appears as an invisible block on screen. The VS Code "Markdown PDF" extension prints through headless Chromium, so the div or its own `<div class="page"/>` marker works; the built-in preview does not show pages at all.

To see where pages end, preview the export itself, not the editor view.

## Can you add a page break in markdown converted to Word?

Yes, but the method depends on the converter. Pandoc to docx needs the raw OpenXML block shown above; the CSS div is ignored. Many online "markdown to Word" tools convert through HTML, and some honour `page-break-after`, but behaviour varies and there is no standard, so test with a two-page sample. Word itself adds the break on Ctrl+Enter, which is a manual fix after conversion if the tool ignores your markup. The [markdown to Word converter](/markdown-to-word) on this site converts markdown to a .docx file; test a short two-page sample to see how your break survives.

## Why does --- not make a page break?

Because `---` is a horizontal rule, a visual divider and not a layout instruction. In HTML it becomes an `<hr>` element, in a PDF it draws a line across the page and the text continues underneath it. The confusion comes from slide tools such as Marp and reveal.js, which use `---` as a slide separator by convention; that is a feature of those tools, not markdown. See the [horizontal rule guide](/guides/markdown-horizontal-rule) for how `---` works and the pitfalls around it.

## Why is my markdown page break not working?

Most failures come from the converter dropping or ignoring the marker. Check in this order:

1. **You are viewing it on screen**, not in the export. Breaks affect print and PDF output only.
2. **The renderer strips raw HTML.** GitHub, Discord, Slack and many CMS editors remove or ignore it, so there is no break.
3. **`\newpage` is in a non-LaTeX export.** Pandoc ignores it for Word and HTML output, so use the matching raw block.
4. **No blank lines around the div**, so the parser treats it as text and shows it literally.
5. **Break inside a table or list item**, where browsers often ignore page-break properties. Move the break outside.
6. **The element is empty and collapsed.** Some converters remove empty elements; add `&nbsp;` inside a `<p>`.
7. **You used `---`.** It is a rule, not a break.
8. **A flexbox or fixed-height container** swallows the break in some print engines.

You can check your markdown source in the [markdown to PDF tool](/markdown-to-pdf) before you commit to a pipeline.

## What are the best practices for page breaks in markdown?

Avoid manual page breaks when you can: let headings start pages through a stylesheet and keep the markdown portable. When a break is needed, use the `<div>` form for HTML-based pipelines, Pandoc raw blocks for Pandoc, put each on its own line with blank lines around it, and test the actual export. Keep a comment in the source if the break is intentional. The [markdown cheat sheet](/markdown-cheat-sheet) lists everything else.
