---
title: How to Convert a Markdown Table to PDF
h1: How do I convert a Markdown table to PDF?
description: Paste the table into a converter that renders pipe tables, check the preview, save as PDF. Steps, wide-table fixes, and what breaks.
tool: markdown-to-pdf
updated: 2026-10-17
related: /guides/markdown-table, /guides/markdown-table-line-break, /markdown-table-generator, /csv-to-markdown
---
Paste the markdown that contains the table into a converter that understands pipe tables, check the preview, and save it as a PDF. In a browser converter that means clicking Download PDF and choosing Save as PDF in the print dialog. The table comes out as a real bordered table with selectable text, not a picture of one.

A markdown table is the pipe syntax that GitHub popularised: a header row, a separator row of dashes, and one line per row, with `|` between cells. It is an extension (GitHub Flavored Markdown, or GFM) rather than part of the original markdown, so the first thing to check in any converter is that it supports GFM tables. If it does not, the PDF shows the raw pipes and dashes as a paragraph of text. The [markdown table guide](/guides/markdown-table) covers the syntax itself; this page is about getting a finished table onto paper.

```markdown
| Region | Q2 sales | Q3 sales |
| :----- | -------: | -------: |
| North  |   12,400 |   13,950 |
| South  |    9,870 |   11,020 |
```

## How do I convert a Markdown table to PDF in the browser?

The [markdown to PDF converter](/markdown-to-pdf) on this site renders GFM tables and runs entirely in your browser, so the document is not uploaded. The steps:

1. Paste your markdown into the left pane, or click **Open .md file** (it also accepts `.markdown` and `.txt`), or drag the file onto the editor.
2. Check the table in the preview on the right. The preview is what will be printed.
3. Type a file name in the box next to the button. It becomes the suggested PDF name.
4. Click **Download PDF**. Your browser's print dialog opens.
5. Set the destination to **Save as PDF**, set margins to **Default**, turn off **Headers and footers**, and save.

The output is produced by the browser's own print engine, so text in the cells stays selectable and searchable, and links in cells stay clickable.

## What does the table look like in the PDF?

Each cell gets a thin border, the header row is bold on a light grey background, and the table spans the full width of the page. Column alignment from the separator row is kept: `:---` aligns left, `:---:` centres and `---:` aligns right, which matters for columns of numbers. Inline formatting inside cells (bold, italic, `code`, links, strikethrough) prints as it appears in the preview. Column widths are chosen by the browser from the content, so a column of long sentences takes more room than a column of short numbers.

Rows that do not fit on a page continue on the next one. The browser decides where to split, usually between rows; a very tall row may be split across the page boundary.

## How do I fit a wide table on a PDF page?

Switch the print dialog to **Landscape** first; on A4 or Letter paper that alone adds noticeable width. If it is still too wide, lower the scale in the print dialog's more-settings panel (Chrome and Edge call it Scale, Firefox has a similar option) so the whole page shrinks. After that, change the table rather than the page:

- **Shorten cell text.** Put long explanations in a paragraph or footnote under the table and keep a short label in the cell.
- **Split the table.** Two tables of five columns each read better on paper than one table of ten.
- **Transpose it.** If you have many columns and few rows, swap them so the long dimension runs down the page.
- **Break long strings.** A long URL or identifier with no spaces cannot wrap and can push the table past the right margin. Use link text instead of a bare URL.

## Why does `<br>` appear as text in my PDF table?

Because this converter does not render raw HTML, so the tag prints literally, as `<br>`. That is a deliberate safety choice: pasted HTML is shown as text rather than executed. Many renderers, including GitHub, accept `<br>` for a line break inside a cell, and the [table line break guide](/guides/markdown-table-line-break) lists where it works. For this converter, split the content into separate rows, or separate items in one cell with a semicolon or a middle dot. The same applies to any other HTML in the document, such as `<div>` page breaks or `<span>` colours.

## Can I convert a Markdown table to PDF with Pandoc?

Yes, if you prefer the command line and have a LaTeX engine installed, which Pandoc uses by default to make PDFs:

```bash
pandoc table.md -o table.pdf
pandoc table.md -o table.pdf -V geometry:landscape
```

The second command sets a landscape page through the LaTeX `geometry` variable. One Pandoc behaviour is worth knowing for tables: according to the [Pandoc manual](https://pandoc.org/MANUAL.html#tables), if any line of a pipe table is longer than the column width, the table takes the full text width and wraps cell contents, and the relative column widths come from the number of dashes in the separator row. So `|---|-|` makes the first column three quarters of the width. If your columns come out at odd widths in Pandoc, adjust the dashes. The browser converter ignores dash counts and sizes columns from their content.

## How do I make the table if my data is in a spreadsheet?

Export the sheet as CSV and paste it into the [CSV to markdown converter](/csv-to-markdown), which writes the pipe table for you. For a small table typed by hand, the [markdown table generator](/markdown-table-generator) gives you a grid to fill in and copies the markdown. Either way, paste the result into the PDF converter and follow the steps above. Building the table in markdown first, rather than printing the spreadsheet, gives you a clean bordered table without gridlines, hidden columns or cut-off cells.

## What can the browser converter not do with tables?

It cannot merge cells: markdown tables have no colspan or rowspan, so a header that spans two columns has to be restructured as two separate headers or written as a heading above the table. It does not accept custom CSS, so you cannot change the border colour, font or cell padding. It does not render LaTeX-style math such as `$x^2$` inside cells; that prints as typed. It also has no manual page breaks, so you cannot force a table to start on a new page, although a heading directly above a table is kept with what follows it where the browser can manage it. If you need any of these, use a tool with stylesheet support such as Pandoc with a LaTeX template, or convert to Word with the [markdown to Word converter](/markdown-to-word) and adjust the table there.

## Is the PDF table selectable and searchable?

Yes. The PDF is generated from text, not a screenshot, so you can select a cell, copy it and search the document with Ctrl+F or Cmd+F. Copying a whole table out of a PDF, however, usually gives you the cell values separated by spaces or line breaks rather than a table, because PDF files store positioned text, not rows and columns. Keep the markdown source if you will need the table again, and treat the PDF as the printed copy.
