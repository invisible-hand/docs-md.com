---
title: Excel to Markdown Table: Copy, Paste, Convert
h1: How do I convert an Excel sheet to a Markdown table?
description: Copy the cells in Excel, paste them into a CSV to Markdown converter, copy the table. Or save one sheet as CSV first. Steps, limits, and what gets lost.
tool: csv-to-markdown
updated: 2026-10-17
related: /markdown-table-generator, /guides/markdown-table, /markdown-table-generator/sort-markdown-table, /markdown-to-word/markdown-table-to-word-table
---
Select the cells in Excel, copy them, and paste them into a CSV to Markdown converter. The copied cells arrive as tab-separated text, which the converter turns into a pipe table with the first row as the header. For a whole sheet, save it as CSV first. Formatting and formulas do not carry over; values do.

Markdown has no spreadsheet format of its own, so every route goes through plain text: either the text Excel puts on the clipboard when you copy, or a CSV file. The converter's job is to split that text into cells, escape anything that would break a pipe table, and lay out the header and delimiter rows.

## What is the fastest way to turn Excel cells into a Markdown table?

Copy and paste:

1. In Excel, select the range, including the header row. Select only the cells you need; empty rows and columns at the edges become empty table rows and columns.
2. Copy it (Ctrl+C, or Cmd+C on a Mac).
3. Paste into the input of the [CSV to Markdown converter](/csv-to-markdown). The delimiter is set to auto-detect, and a pasted spreadsheet range is detected as tab-separated.
4. Check the options: First row is header (on by default), Pad columns (aligns the pipes in the source), Trim whitespace, and Bold header.
5. Click a column's alignment control to right-align numbers or center a status column, then copy the Markdown.

The same copy and paste works from Google Sheets, Numbers and LibreOffice Calc. If you prefer to edit cells after pasting, the [Markdown table generator](/markdown-table-generator) also accepts pasted tab-separated data and gives you a grid to work in.

## How do I convert a whole sheet saved as CSV?

Save the sheet as CSV, then open the file in the converter. Microsoft's instructions for [saving a workbook as text or CSV](https://support.microsoft.com/en-us/office/save-a-workbook-to-text-format-txt-or-csv-3e9a9d6c-70da-4255-aa28-fcacf1f081e6) are: File > Save As (or Save a Copy), choose a location, and pick a CSV or text format in the file type list. Two things in that page matter here:

- Every CSV and tab-delimited format "saves only the active sheet". A workbook with five sheets needs five saves, one per sheet, each giving one table.
- "When you save a workbook in any of the text formats, all formatting will be removed." Colors, fonts, borders and number formats do not reach the CSV.

Then use the converter's file button to open the `.csv` (it also accepts `.tsv` and `.txt`), or open the file in a text editor and paste its contents. Values with commas, quotes or line breaks are fine as long as they are quoted the standard way, which [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180) describes: the field is enclosed in double quotes, and a quote inside it is doubled. The converter parses that format, so a quoted address such as `"12 High St, Leeds"` stays in one cell.

If accented or non-Latin characters come out garbled, the CSV was saved in an encoding other than UTF-8. Copy and paste avoids the question entirely, because the clipboard carries text rather than a file.

## Can I convert an .xlsx file directly?

Not in the browser converter; it reads delimited text, not Excel's file format. On the command line, recent [Pandoc](https://pandoc.org/MANUAL.html) releases list `xlsx` among their input formats, so this is worth trying:

```bash
pandoc budget.xlsx -t gfm -o budget.md
```

Run `pandoc --list-input-formats` first; if `xlsx` is not listed, your version predates the reader. Check the output carefully, especially for workbooks with several sheets, merged cells or formulas, and fall back to the CSV route when it does not match what you see in Excel.

## What gets lost when Excel data becomes Markdown?

More than people expect, because a Markdown table is only text in a grid:

| In Excel | In the Markdown table |
|---|---|
| Cell values | Kept |
| Formulas | Not kept; only a value can appear in a cell |
| Number formats, colors, fonts, borders | Removed |
| Merged cells | No equivalent; Markdown tables cannot merge cells |
| Several sheets | One table per sheet, converted separately |
| Charts, images, comments | Not converted |
| Line breaks inside a cell | Written as `<br>` |
| A pipe character in a value | Escaped with a backslash so it stays in its cell |

Before converting, unmerge merged cells and fill in the repeated values, delete helper columns, and check that dates and numbers display the way you want them to read. The [Markdown table guide](/guides/markdown-table) explains why merged cells and multi-line cells have no Markdown syntax and what the HTML fallback looks like.

## How big a sheet can I turn into a Markdown table?

There is no fixed limit in the syntax, but readability sets one. A Markdown table works well up to roughly the width of a page in columns and a few dozen rows; beyond that, the source becomes hard to edit and the rendered table needs horizontal scrolling on GitHub. For larger data, keep the CSV as the source file in the repository, link to it, and put a short summary table in the Markdown. GitHub also [renders `.csv` and `.tsv` files](https://docs.github.com/en/repositories/working-with-files/using-files/working-with-non-code-files#rendering-csv-and-tsv-data) as tables when you open them in the repository view, which is often enough on its own.

## Why do my columns come out shifted?

Usually because of a delimiter mismatch. Auto-detect picks between comma, tab, semicolon and pipe from the first lines; if it guesses wrong (for example on a semicolon-separated file whose values contain commas), set the delimiter by hand. If one row has fewer cells than the header, the converter pads it with empty cells; check the source for a missing value or an unquoted comma in that row. When you paste a range, make sure the selection is a clean rectangle without hidden columns you did not intend to include.

## Can I go back from a Markdown table to Excel?

Yes. Switch the converter to Markdown → CSV, paste the table, and download the result or copy it as tab-separated text to paste straight into a sheet. Escaped pipes become plain pipes and fields that need quoting are quoted. That round trip is also the easiest way to [sort a Markdown table](/markdown-table-generator/sort-markdown-table) or bulk-edit it. If the table's next stop is a Word document rather than a spreadsheet, see [turning a Markdown table into a Word table](/markdown-to-word/markdown-table-to-word-table).
