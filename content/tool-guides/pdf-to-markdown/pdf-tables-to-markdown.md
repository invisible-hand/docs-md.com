---
title: How to Convert PDF Tables to Markdown Tables
h1: How do I convert PDF tables to Markdown tables?
description: Extract the table with a table-aware tool such as Tabula, Camelot or pdfplumber, export CSV, convert it to a pipe table, then check the cells.
tool: pdf-to-markdown
updated: 2026-10-17
related: /csv-to-markdown, /markdown-table-generator, /guides/markdown-table, /pdf-to-markdown/pdf-to-markdown-for-llm
---
Use a tool that detects table structure, such as Tabula, Camelot or pdfplumber, to pull the table out as rows and columns, export it as CSV, and turn the CSV into a markdown pipe table. For a small table, retyping it into a table generator is often quicker. Then check every cell against the PDF.

The reason this needs its own step is that a PDF does not store tables. It stores characters at positions on a page, plus lines and rectangles that happen to be drawn around them. A table on screen is something your eyes assemble from alignment; software has to guess the same thing from coordinates. General text extractors read across the page line by line and lose the columns, while table extractors look for ruling lines or aligned gaps and rebuild the grid.

## What does the PDF to Markdown converter do with tables?

The [PDF to markdown converter](/pdf-to-markdown) on this site extracts text, headings, lists and paragraphs in your browser, but it does not rebuild tables. Each row of a table comes out as one line with the cell values separated by spaces, and consecutive rows are joined into a paragraph. That is fine for a document that happens to contain a small table you can rebuild by hand. It is not a table extractor, so for data tables use one of the methods below, and use the converter for the surrounding text.

A common workflow for a report is to do both: convert the whole PDF for the prose, extract the tables separately, and paste the finished markdown tables back into the converted text where they belong.

## How do I convert a small table quickly?

Open the [markdown table generator](/markdown-table-generator), add rows and columns with the **+ Row** and **+ Column** buttons, and type the values into the grid; it also accepts pasted comma- or tab-separated text. It writes the pipe syntax for you. For up to a few dozen cells this is usually faster than installing anything, and you check each value as you type it. The [markdown table guide](/guides/markdown-table) covers the syntax if you prefer to write it directly:

```markdown
| Plan  | Seats | Price |
| ----- | ----: | ----: |
| Basic |     5 |  $10  |
| Team  |    25 |  $40  |
```

## How do I extract larger tables without code?

[Tabula](https://github.com/tabulapdf/tabula) is a free desktop application for exactly this job. You open a PDF, drag a box around a table, and export the selection as CSV. It needs Java installed. Its README says it works only on text-based PDFs, with a simple test: if you can click and drag to select text in the table in a PDF viewer, Tabula should work. The same README notes that the original authors are not actively updating the desktop application, though the underlying `tabula-java` library still gets releases.

Once you have a CSV file, paste it into the [CSV to markdown converter](/csv-to-markdown) to get the pipe table. Check the header row: extractors sometimes split a two-line header into two rows, which you will want to merge into one.

## How do I extract PDF tables with Python?

Two well-documented libraries work on text-based PDFs. [Camelot](https://github.com/camelot-dev/camelot) can write markdown directly:

```python
import camelot

tables = camelot.read_pdf("report.pdf", pages="1-3")
tables[0].to_markdown("table.md")
```

`read_pdf` reads only page 1 unless you pass `pages`. Its default method, `lattice`, uses the ruling lines between cells; for tables separated only by whitespace, its README recommends `flavor="network"` or `flavor="stream"`, and `flavor="auto"` picks per page. Each table also exposes `tables[0].df`, a pandas DataFrame, if you want to clean it before writing.

[pdfplumber](https://github.com/jsvine/pdfplumber) gives you the rows as lists, which pandas can turn into markdown (the `to_markdown` method needs the `tabulate` package installed):

```python
import pdfplumber
import pandas as pd

with pdfplumber.open("report.pdf") as pdf:
    rows = pdf.pages[0].extract_table()

df = pd.DataFrame(rows[1:], columns=rows[0])
print(df.to_markdown(index=False))
```

By default pdfplumber, like Camelot's lattice mode, finds cells from the page's drawn lines; its `table_settings` argument lets you switch strategies for borderless tables. Its documentation is explicit that it works best on machine-generated PDFs and does not do OCR.

## What about tables in scanned PDFs?

A scanned table is a picture, so there is no text for these tools to align. The scan needs OCR first, and table structure from OCR output is less reliable than from a digital PDF. Camelot's README describes an optional machine-learning mode with OCR for scanned and image-only pages. Otherwise, run OCR on the file as described in [converting a scanned PDF to markdown](/pdf-to-markdown/scanned-pdf-to-markdown), then try an extractor on the result, and plan to check numbers by hand.

## What gets lost when a PDF table becomes a Markdown table?

Markdown tables are simple, so some PDF tables cannot be represented exactly:

- **Merged cells.** There is no colspan or rowspan. A header spanning two columns must be repeated or split into two headers, and a cell spanning rows must be repeated on each row or left blank.
- **Multi-line cells.** Each row must sit on one line of markdown. Line breaks inside a cell are lost, or need `<br>` in renderers that allow HTML.
- **Nested headers and subtotals.** Grouped column headers and bold subtotal rows become ordinary rows; mark them with bold text if the meaning depends on them.
- **Formatting and footnotes.** Colours, shading and superscript footnote markers usually disappear; add footnotes as a list under the table.

## How do I check the extracted table?

Compare row and column counts with the PDF first, since a merged or dropped row shifts everything below it. Then check the cells most likely to break: numbers with thousands separators or negative values in brackets, cells that wrapped onto two lines in the PDF, empty cells, and the last row before a page break. If a table continues across pages, extract each page's part and join them, removing the repeated header. For tables headed to a language model, a correct small table is worth more than a large one with shifted columns, so cut columns you do not need; the guide to [preparing PDFs for ChatGPT, Claude or RAG](/pdf-to-markdown/pdf-to-markdown-for-llm) covers the rest of that clean-up.

## Can I copy a table from a PDF viewer and paste it?

You can try, but the result is usually text with spaces or line breaks between cells rather than columns, because the viewer copies characters in reading order. It sometimes works for a simple table with one word per cell, if you paste into a spreadsheet and split the text into columns there. For anything bigger, a table extractor saves time, and once the data is in a spreadsheet you can save it as CSV and convert it in one step.
