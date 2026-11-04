---
title: Markdown Table to Google Sheets: Paste, Import, SPLIT
h1: How do you create a Google Sheet from a Markdown table?
description: Sheets pastes a Markdown table into one column. Convert it to TSV or CSV first, or split the pasted pipes with Data → Split text to columns or SPLIT().
tool: markdown-table-generator
updated: 2026-11-03
related: /csv-to-markdown/markdown-table-to-csv, /csv-to-markdown/google-sheets-to-markdown, /markdown-table-generator/markdown-table-to-excel, /guides/markdown-table
---
Convert the Markdown table to tab-separated text and paste it into the sheet; Sheets puts each tab-separated value in its own cell. Pasting the raw Markdown instead leaves every row in column A, pipes included. From there, Data → Split text to columns with `|` as the separator, or a `SPLIT()` formula, breaks the rows into columns.

Google Sheets has no Markdown import. It reads tabs, commas and a few other separators, and a pipe table has none of those where they matter. So every route below does the same thing in a different place: turn `| a | b |` into cells. The [CSV to Markdown converter](/csv-to-markdown) does it before you paste, Split text to columns does it after, and `SPLIT()` does it in a formula. If you built the table in the [table generator](/markdown-table-generator), copy its output and start from the first route.

## What happens when you paste a Markdown table into Google Sheets?

Each line of the table becomes one row, and the whole line lands in a single cell in column A, pipes and all. The header row, the row of hyphens and the data rows are all treated as text; nothing is parsed. Bold markers, links and alignment colons stay literal too, because Sheets does not know Markdown.

That is not a bug in Sheets. Spreadsheets split pasted text at tabs and line breaks, and a Markdown table has line breaks between rows but no tabs between cells. The fix is to supply a separator Sheets understands, either by converting the table first or by telling Sheets to split on the pipe.

## What is the quickest way to get the table into Sheets?

Convert it to tab-separated values and paste. Open the [Markdown table to CSV page](/csv-to-markdown/markdown-table-to-csv), paste the Markdown, choose tab as the separator and copy the result. In Sheets, click the top-left cell of where the table should go and paste: the values spread across columns, and the header row is the first row. The converter drops the row of hyphens, turns `\|` back into a plain pipe, and converts `<br>` in a cell into a line break inside the cell, so the pasted sheet needs no cleanup.

Tab-separated text is the right choice for pasting. Comma-separated text pasted into Sheets stays in one column, because the paste handler only splits on tabs; commas need the import dialog described next.

## How do you import a CSV file with File → Import?

Download the CSV from the converter and import the file. Google's [import help](https://support.google.com/docs/answer/40608) lists `.csv`, `.tsv`, `.txt` and `.tab` among the accepted file types, and the steps are: open a spreadsheet, click **File → Import**, choose the file, pick an import option and click **Import**. The import options are to create a new spreadsheet, insert new sheets, replace the spreadsheet, replace the current sheet, append rows to the current sheet, or replace data starting at a selected cell.

For plain text files the dialog also shows a **Separator character** setting with the choices Detect automatically, Tab, Comma and Custom. Leave it on Detect automatically for a CSV from the converter; it also handles semicolons, which some locales use. The file route is the one to use for a large table, or when a value contains commas or quotes, because the converter quotes those values and the importer reads the quoting correctly.

## How do you split the pasted rows with Split text to columns?

If the raw Markdown is already in column A, select those cells and click **Data → Split text to columns**. Google's [split text help](https://support.google.com/docs/answer/6325535) describes the feature and notes that right after pasting you can also click the Paste icon that appears and choose Split text to columns from there. A small Separator menu opens next to the data; it offers Detect automatically and the common separators, plus a Custom entry where you type the character yourself. Type `|` and the rows split at every pipe.

Three things need tidying afterwards. The leading and trailing pipes produce an empty first and last column, so delete those. The second row holds the `---` cells from the delimiter row; delete it. And any `\|` that was escaped in the Markdown keeps its backslash, because this route never parses Markdown. Spaces around the values are usually gone already: Google's [TRIM documentation](https://support.google.com/docs/answer/3094140) notes that Sheets trims text input into cells by default. If some survive, select the range and use **Data → Data cleanup → Trim whitespace**, which the same split-text help page documents.

## How does the SPLIT function do the same with a formula?

Put the Markdown rows in column A and write `=SPLIT(A1, "|")` in B1, then fill the formula down. The [SPLIT function](https://support.google.com/docs/answer/3094136) divides text around the delimiter and puts each fragment in its own cell across the row; the delimiter itself is not included in the result. Its full form is `SPLIT(text, delimiter, [split_by_each], [remove_empty_text])`, and the last argument matters for tables. With the default `TRUE`, consecutive delimiters are treated as one, so an empty cell in the Markdown (`| a | | c |`) disappears and the columns shift left. Pass `FALSE` to keep empty cells in place:

```
=SPLIT(A1, "|", TRUE, FALSE)
```

With `remove_empty_text` set to `FALSE`, the outer pipes also produce an empty cell at each end, so the data starts one column to the right; that is easy to see and to delete once the formulas are converted to values. To strip stray spaces at the same time, wrap the call: `=ARRAYFORMULA(TRIM(SPLIT(A1, "|")))`. Google's [ARRAYFORMULA page](https://support.google.com/docs/answer/3093275) describes it as the way to use a non-array function such as `TRIM` on an array, and `TRIM` removes leading, trailing and repeated spaces. The formula route is useful when the Markdown is itself generated by another formula or script and you want the sheet to update when it changes. For a one-off paste, Split text to columns is less work.

## Does Google Docs' Paste from Markdown work for tables?

Not according to Google's documentation, and it is a Docs feature rather than a Sheets one. The [Markdown in Google Docs help page](https://support.google.com/docs/answer/12014036) explains that after you enable Markdown under **Tools → Preferences**, a right-click **Paste from Markdown** option converts Markdown on the clipboard into Docs content, alongside **Copy as Markdown** and a Markdown download and upload. The elements it lists are italics, bold, strikethrough, links and, in Docs, headings. Tables are not mentioned, so do not plan on that option to build a table; and even if a future version converts them, you would end up with a table in a document, not a sheet. For a spreadsheet, use one of the three routes above.

## Why are there extra blank columns or a row of hyphens?

Because the split routes work on the characters, not on the table's meaning. A Markdown row usually starts and ends with a pipe, so splitting on `|` yields an empty value before the first cell and after the last one. The delimiter row (`|---|---|`) is just another line of text to Sheets and splits into cells containing hyphens. Delete the empty columns and the hyphen row, or avoid both by using the converter, which already knows that the second row is not data. If a column holds inline code with escaped pipes, expect to remove the backslashes by hand or with Find and replace.

## How do you get the table back out of Sheets as Markdown?

Copy the range in Sheets and paste it into the table generator's **Paste CSV / TSV** box, or into the CSV to Markdown converter; spreadsheet copies are tab-separated, which both tools detect. The result is a padded pipe table with escaped pipes and alignment set per column. The [Google Sheets to Markdown page](/csv-to-markdown/google-sheets-to-markdown) walks through that direction, and the [Markdown table syntax guide](/guides/markdown-table) covers what the generated table can and cannot contain. If the destination is Excel rather than Sheets, the steps differ a little; see [copying a Markdown table into Excel](/markdown-table-generator/markdown-table-to-excel).
