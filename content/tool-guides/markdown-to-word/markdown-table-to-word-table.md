---
title: Markdown Table to Word Table: 3 Ways That Keep Columns
h1: How do I turn a Markdown table into a Word table?
description: Three ways to get a real Word table from a Markdown pipe table: a converter, Pandoc, or Word's Convert Text to Table. Steps, column widths, limits.
tool: markdown-to-word
updated: 2026-10-17
related: /guides/markdown-table, /csv-to-markdown, /markdown-table-generator, /markdown-to-word/keep-code-blocks-in-word
---
Convert the Markdown to a Word document with a converter that understands pipe tables, and each table arrives as a real Word table with rows, columns and borders. Pasting the raw text into Word gives you lines full of `|` characters instead; Word's Convert Text to Table can repair that, but only after some cleanup.

A Markdown table is plain text: pipes mark the columns, a row of hyphens separates the header, and each line is one row. Word does not read that syntax. It needs the table structure spelled out, either as HTML table markup or as Word's own table XML inside a `.docx`. Every method below is a way of producing one of those two things. Pick the one that fits how often you do this and how much control you need over the result.

## What is the quickest way to get a Word table from Markdown?

Use the [Markdown to Word converter](/markdown-to-word) on this site: paste the whole document, click Download .doc, and open the file in Word. The converter renders the Markdown to HTML with the GitHub Flavored Markdown table rules, so every pipe table becomes an HTML `<table>`, and Word opens that as a native table you can resize, restyle and sort.

What you get, concretely:

- The header row is a real header row, and each cell sits in its own Word cell.
- Cells have a thin grey border and a little padding, so the table is readable before you apply a style.
- Bold, italic, links and inline code inside cells keep their formatting.
- The conversion runs in your browser; the document is not uploaded anywhere.

Two honest limits. First, the download is a `.doc` file that contains HTML, which desktop Word opens directly, sometimes after a compatibility prompt. Use File > Save As and choose Word Document (.docx) to turn it into a normal Word file. Microsoft's own list of [formats Word for the web opens](https://support.microsoft.com/en-us/office/differences-between-using-a-document-in-the-browser-and-in-word-90fac46c-2b8e-4fa1-b997-4e55ce4ed754) excludes HTML, so do that save in desktop Word before you upload the file to the browser version or SharePoint. Second, the table gets the converter's simple bordered look rather than one of Word's table styles; apply a style from the Table Design tab once the file is open.

## How do I convert a Markdown table to Word with Pandoc?

Pandoc writes `.docx` directly and is the better choice when you convert often or need a house style. Install it, then run:

```bash
pandoc report.md -o report.docx
```

Pandoc's Markdown reader handles pipe tables by default. If your file is GitHub-flavored, say so explicitly with `-f gfm`:

```bash
pandoc report.md -f gfm -o report.docx
```

Every pipe table becomes a Word table with the style named `Table`. To change how all tables look (borders, shading, fonts), make a reference document once and pass it on every run. The [Pandoc manual](https://pandoc.org/MANUAL.html#option--reference-doc) gives the steps:

```bash
pandoc -o custom-reference.docx --print-default-data-file reference.docx
# open custom-reference.docx in Word, edit the "Table" style, save
pandoc report.md --reference-doc=custom-reference.docx -o report.docx
```

Column widths follow a rule worth knowing. According to the [pipe_tables section](https://pandoc.org/MANUAL.html#extension-pipe_tables) of the manual, if any line of the table is longer than the column width setting, the table takes the full text width and the relative column widths come from the number of hyphens in the delimiter row. So `|---|-|` gives the first column three quarters of the width. If every line is shorter, cells are sized to their content. When a table comes out with a cramped first column, adjust the hyphens rather than fighting the widths in Word afterwards.

## Can I fix a Markdown table that I already pasted into Word?

Yes, with Word's built-in Convert Text to Table. Microsoft documents it in [Convert text to a table or a table to text](https://support.microsoft.com/en-us/word/convert-text-to-a-table-or-a-table-to-text): separator characters mark the columns and paragraph marks mark the rows. Steps for a pasted pipe table:

1. Delete the delimiter line (the one made of hyphens and colons). It would otherwise become a row of dashes.
2. Select the remaining table lines.
3. Choose Insert > Table > Convert Text to Table.
4. Under Separate text at, choose Other and type `|`.
5. Click OK, then delete the empty first and last columns that the outer pipes create.

The result is a real table, but expect cleanup: the spaces around each cell value stay in the cells, an escaped pipe (`\|`) inside a cell is split into two cells, and any Markdown inside cells (`**bold**`, backticks, links) stays as literal characters. Microsoft also notes that when your text contains commas you should use tabs as the separator, and the same reasoning applies to pipes.

A cleaner variant: paste the table into the [CSV to Markdown converter](/csv-to-markdown), switch it to Markdown to CSV, choose Tab as the output delimiter, and paste the tab-separated result into Word. Convert Text to Table with Tabs then needs no column deletion and no space trimming.

## Why does my table show pipes instead of columns in Word?

Because Word received the Markdown source, not a converted document. This happens when you paste from a text editor, open a `.md` file directly, or copy from a viewer that copies the raw text. Word has no Markdown reader; Microsoft's [file format reference](https://learn.microsoft.com/en-us/office/compatibility/office-file-format-reference) for Word lists formats such as .docx, .doc, .rtf, .odt, .htm and .txt, and no Markdown format. Convert first with one of the methods above; renaming the file to `.docx` does not help, because the content is still plain text.

## Which method keeps formatting inside cells?

Both converters keep inline formatting, because they parse the Markdown before building the table. Bold, italic, inline code, links and line breaks written as `<br>` come through as formatting in the Word cell. Word's Convert Text to Table does not parse anything, so the asterisks and backticks stay as text. If the cells hold more than short inline content, remember the source format's limits first: a GitHub Flavored Markdown cell cannot hold a list, a paragraph break or a code block, as the [GFM specification](https://github.github.com/gfm/#tables-extension-) states that block-level elements cannot be inserted in a table. The [table syntax guide](/guides/markdown-table) and [line breaks in table cells](/guides/markdown-table-line-break) cover the workarounds.

## What about merged cells, captions and very wide tables?

Markdown pipe tables have no merged cells, so nothing to convert; merge the cells in Word after conversion using Layout > Merge Cells. Captions are not part of GFM; Pandoc's own Markdown accepts a caption paragraph starting with `Table:` or just `:` directly before or after the table (the [table_captions extension](https://pandoc.org/MANUAL.html#extension-table_captions)), and the reference document has a Table Caption style for it. For tables wider than the page, convert first, then either set the table to AutoFit to window in Word or switch that section to landscape. If the same wide table is going to a PDF instead, the [Markdown to PDF converter](/markdown-to-pdf) handles the layout in one step.

## What should I check after converting?

Open the result and look at four things:

- **Header row.** Select the first row and choose Table Layout > [Repeat Header Rows](https://support.microsoft.com/en-us/word/repeat-table-header-on-subsequent-pages) so a long table repeats its header on every page.
- **Number alignment.** Right-align numeric columns if the converter did not.
- **Escaped characters.** A `\|` in the source should appear as a single `|` inside one cell.
- **Widths.** Long cells can squeeze short ones; drag the column borders or use AutoFit to contents.

If you are still building the table, the [Markdown table generator](/markdown-table-generator) produces padded, correctly escaped pipe tables that convert without surprises.
