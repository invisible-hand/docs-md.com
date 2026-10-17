---
title: Google Sheets to Markdown Table: 3 Ways That Work
h1: How do I convert a Google Sheet to a Markdown table?
description: Copy the cells into a CSV-to-markdown converter, or download the sheet as CSV. Exact steps, plus what breaks: merged cells, line breaks, pipes.
tool: csv-to-markdown
updated: 2026-10-17
related: /guides/markdown-table, /guides/markdown-table-line-break, /csv-to-markdown/csv-to-markdown-command-line, /markdown-table-generator
---
Select the cells in Google Sheets, copy them, and paste into a CSV-to-markdown converter. Sheets puts the selection on the clipboard as tab-separated text, which a converter turns into a pipe table with a header row. For a whole sheet, use File, Download, Comma-separated values, and convert the downloaded file instead.

Google Sheets has no "export as Markdown" option. Google Docs gained one in 2024, but the spreadsheet download menu still offers formats such as Excel, OpenDocument, PDF, web page, CSV and TSV, so every route goes through one of those plain formats first. Below are three routes, from the quickest to the most repeatable, followed by the problems that usually show up in the output.

## Method 1: copy and paste a range

This is the fastest way for a table you will paste into a README, an issue or a chat message once.

1. In Google Sheets, select the range you want, including the row of column titles.
2. Press Ctrl+C (Cmd+C on a Mac).
3. Open the [CSV to markdown converter](/csv-to-markdown) and paste into the input box.
4. Leave "First row is header" ticked if your selection included the titles. If it did not, untick it and the converter writes generic headers that you can rename.
5. Click a column chip to set left, center or right alignment if you need it, then copy the markdown.

For a three-column selection the result looks like this:

```markdown
| Region | Q1     | Q2     |
| ------ | ------ | ------ |
| North  | 12,400 | 13,050 |
| South  | 9,870  | 10,210 |
```

The converter detects the tab delimiter on its own, so there is nothing to configure. Everything happens in your browser; the cells are not uploaded anywhere. If you want to tidy the result by hand afterwards, the [markdown table guide](/guides/markdown-table) covers the syntax, alignment colons and what renders where.

## Method 2: download the sheet as CSV

Use this when the table is large, or when you want a file you can keep next to the markdown.

1. Open the spreadsheet and click the tab of the sheet you want.
2. Go to **File**, then **Download**, then **Comma-separated values (.csv)**. Google's help page on [downloading a copy of a file](https://support.google.com/docs/answer/49114) describes the same menu.
3. Open the downloaded file in a text editor, copy everything, and paste it into the converter. You can also convert it on the command line, which the [command-line guide](/csv-to-markdown/csv-to-markdown-command-line) covers with pandoc and Miller.

The CSV download contains one sheet: the one that was active when you downloaded. A spreadsheet with five tabs needs five downloads. CSV keeps quoting for cells that contain commas, quotes or line breaks, which is why it is safer than copy and paste for messy text columns: a cell holding `Smith, John` stays one cell.

## Method 3: fetch it automatically

If the table changes and you regenerate the markdown often, skip the manual download. Two documented options exist.

**Publish to web as CSV.** In the sheet, choose **File**, **Share**, **Publish to web**, pick the sheet and the CSV format, and publish. Google's [publishing help page](https://support.google.com/docs/answer/183965) explains the dialog and how to stop publishing later. You get a URL that always returns the current data, which you can pipe into a converter:

```bash
curl -sL "PASTE-THE-PUBLISHED-CSV-URL" | pandoc -f csv -t gfm
```

Be careful: a published sheet is readable by anyone who has the link, and your organization's admin may have turned publishing off. Do not publish anything private.

**The Drive API.** A script with access to the file can call the Drive API's export method with the `text/csv` MIME type. Google's [table of export formats](https://developers.google.com/workspace/drive/api/guides/ref-export-formats) notes that CSV and TSV exports through the API contain the first sheet only, so put the table you need on the first tab or use the Sheets API to read a specific range instead.

## Why do my numbers look different in the markdown?

What you copy is the text the sheet displays, so formatting decides the output. A cell formatted as currency may arrive as `$1,250.00` rather than `1250`, and a percentage as `12%`. If you want raw numbers, change the column format to plain number before copying, or add a helper column. Formulas never come through as formulas; you get their current results.

## What happens to merged cells?

Markdown tables have no colspan or rowspan, so a merged cell cannot survive. When you copy or export, the value usually lands in the first cell of the merged area and the others come out empty. Unmerge the cells in Sheets and decide what each cell should say before converting, or switch to an HTML table if the merge really matters. The [table guide](/guides/markdown-table) explains the limits of the syntax.

## How do I keep line breaks inside a cell?

A markdown table row has to sit on one source line, so a cell with a line break (Alt+Enter or Ctrl+Enter in Sheets) cannot be written as-is. The converter replaces each line break inside a cell with a `<br>` tag, which GitHub and most renderers display as a new line. The [line break in a table cell guide](/guides/markdown-table-line-break) lists the alternatives and which renderers accept them.

## What if a cell contains a pipe character?

A literal `|` would split the cell in two. The converter escapes it as `\|`, which GitHub displays as a plain pipe. If you build the table by hand, the [escape characters guide](/guides/markdown-escape-characters) shows the same fix, and its caveat about pipes inside inline code.

## Can I convert the markdown table back into Google Sheets?

Yes. Switch the converter to the markdown-to-CSV direction, paste the table, and copy the CSV. Pasting CSV text into Sheets puts it all in column A; use **Data**, **Split text to columns** to break it on commas, or save it as a `.csv` file and import it with **File**, **Import**. Alignment and bold formatting in the markdown are not carried over, because CSV has no place for them.

## Does the same method work for Excel?

Yes. Excel also puts a copied range on the clipboard as tab-separated text, so the paste route is identical. Saving as CSV from Excel has one trap: in regions that use a comma as the decimal separator, Excel can write semicolons between fields instead of commas. The converter's delimiter detection handles that, but command-line tools need to be told, for example with Miller's `--ifs ';'` option.

## Which method should I use?

Copy and paste for a one-off table under a few hundred rows. Download as CSV when the sheet has commas or line breaks in text cells, or when you want to keep the source file. Publish or use the API only when you regenerate the same table often and the data is safe to expose to the script or the link. In every case, check the first few rows of the output against the sheet: headers, number formatting and empty cells are where problems show up.
