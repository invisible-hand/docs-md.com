---
title: Copy a Markdown Table Into Excel: Three Ways
h1: How do you copy a Markdown table into Excel?
description: Paste the table and run Data → Text to Columns with | as the delimiter, or convert to TSV or CSV first and paste or open the file. Delete the hyphen row.
tool: markdown-table-generator
updated: 2026-11-03
related: /csv-to-markdown/markdown-table-to-csv, /csv-to-markdown/excel-to-markdown-table, /markdown-table-generator/markdown-table-to-google-sheets, /markdown-to-word/markdown-table-to-word-table
---
Paste the Markdown into column A, select those cells and run **Data → Text to Columns**, choose **Delimited**, tick **Other** and type `|`. Excel splits every row at the pipes. Then delete the row of hyphens and the empty first and last columns. Converting the table to tab-separated text first skips the cleanup entirely.

Excel has no Markdown import, so a pipe table arrives as text. Three documented features turn that text into cells: the Convert Text to Columns Wizard, Excel's handling of tab-separated and CSV text, and Get & Transform (Power Query). Which one to use depends on whether the table is already on your clipboard or you can take a detour through the [CSV to Markdown converter](/csv-to-markdown), which reads Markdown tables and writes CSV or TSV. Tables built in the [table generator](/markdown-table-generator) can go either way.

## What happens when you paste a Markdown table into Excel?

Every line becomes a row and the whole line goes into one cell in column A, pipes included. Excel splits pasted text at line breaks and tabs, and a Markdown table contains no tabs, so nothing is split into columns. The header, the delimiter row of hyphens and the data rows are all plain text; alignment colons, bold markers and links stay literal.

That gives you the starting point for the first route. The text is in a column, one row per table row, and all you need is to split it at the pipe character.

## How do you split the pasted table with Text to Columns?

Select the cells in column A that hold the table and follow Microsoft's steps for the [Convert Text to Columns Wizard](https://support.microsoft.com/en-us/office/split-text-into-different-columns-with-the-convert-text-to-columns-wizard-30b14928-5550-41f5-97ca-7a3e9c363ed7): choose **Data → Text to Columns**, select **Delimited** and click **Next**. On the delimiters page, Microsoft's [Text Import Wizard reference](https://support.microsoft.com/en-us/office/text-import-wizard-c5b02af6-fda1-4440-899f-f78bafe41857) explains that if the character you need is not listed you select the **Other** check box and type it in the box; type `|`. Make sure Tab, Comma and Space are unticked, otherwise cells that contain spaces are split again. The **Data preview** at the bottom shows the columns before you commit. Click **Next**, choose a **Destination** cell if you do not want to overwrite column A, and click **Finish**.

The wizard also has a **Treat consecutive delimiters as one** option. Leave it off for a Markdown table: two pipes in a row mean an empty cell, and merging them would shift the data left.

## How do you remove the separator row and the empty columns?

After the split there are three leftovers. The second row contains the `---` cells from the Markdown delimiter row; delete it. Because each Markdown row begins and ends with a pipe, the first and last columns are empty; delete them too. Finally, cells keep the spaces that padded them in the Markdown source. Excel's `TRIM` function removes leading and trailing spaces, so a helper column with `=TRIM(B2)` filled down and across, pasted back as values, cleans the table. Any `\|` that was escaped in the Markdown keeps its backslash, because this route never parses Markdown; Find and Replace fixes those.

If the table has a bold header or links in cells, the Markdown markers (`**`, `[text](url)`) survive as text as well. The conversion route below avoids some of this because the converter unescapes pipes and drops the delimiter row before Excel ever sees the data.

## Is converting to CSV or TSV first easier?

Usually, yes. Paste the Markdown into the [Markdown table to CSV page](/csv-to-markdown/markdown-table-to-csv), choose tab as the separator and copy the output. Pasting tab-separated text into Excel spreads it across columns directly, with no wizard, because the tab is the one separator the paste handler understands; Microsoft's [text file documentation](https://support.microsoft.com/en-us/office/import-or-export-text-txt-or-csv-files-5250ac4c-663c-47ce-937b-339e391393ba) describes tab-delimited `.txt` as one of the two standard text formats Excel works with. The converter has already removed the hyphen row, unescaped pipes and quoted values that need it.

If you download a `.csv` instead, open it with **File → Open**. The same page says a `.csv` opens automatically in a new workbook, while a `.txt` starts the Import Text Wizard, where you can set the delimiter and the column formats. There is a trap worth knowing: when Excel opens a CSV it applies its default data formats to each column, so a column of numbers with leading zeros loses them and dates can be read in the wrong order. Microsoft's advice on that page is to rename the file from `.csv` to `.txt` so the wizard runs and you can mark such columns as Text.

## How do you load the table with Power Query?

Use **Data → Get Data → From File → From Text/CSV** on the CSV you downloaded. Microsoft's [Power Query import guide](https://support.microsoft.com/en-us/office/import-data-from-external-data-sources-power-query-be4330b3-5356-486c-a168-b68e9e616f5a) says that for a CSV file Power Query detects the column delimiter, uses the first row as the column names and sets a data type for each column; the text file page adds that you can change the delimiter from the list under **Delimiter** and see the effect in the preview before loading. Click **Load**, or **Load To** to choose a destination.

The advantage over pasting is that the import is a query: keep the CSV in the same place, replace it with a new export, and **Refresh** reloads the table. The header row of the Markdown table becomes the column names of an Excel table. This is the route for a table you will regenerate, such as a report that a script writes as Markdown every week.

## Which route should you choose?

| Situation | Route | Cleanup afterwards |
|---|---|---|
| The table is on your clipboard and small | Paste, then Text to Columns with `\|` | Delete hyphen row and empty outer columns, trim spaces |
| You can take a detour through the browser | Convert to TSV, paste | None |
| Values contain commas, quotes or line breaks | Convert to CSV, open or import the file | None |
| Columns must keep leading zeros or exact dates | Convert to CSV, rename to `.txt`, use the wizard | Set column formats in step 3 |
| The table is regenerated regularly | Power Query from the CSV | None; refresh the query |

Excel can hold up to 1,048,576 rows and 16,384 columns per sheet, per Microsoft's text import page, so size is not a factor for any table that started as Markdown.

## Why are numbers right-aligned or dates wrong after pasting?

Because Excel converts what it recognises. Text that looks like a number becomes a number and is right-aligned; text that looks like a date is stored as a date in your locale's order; a value such as `007` becomes `7`. Markdown has none of these types, so a column that was meant as an identifier can change. Microsoft's text file documentation calls out exactly the leading-zero and date-order cases and recommends the Import Text Wizard, where step 3 lets you set a column's format to Text. In Power Query, change the column type in the editor before loading. If a value must stay literal, formatting the destination cells as Text before pasting also works.

## How do you turn an Excel range back into a Markdown table?

Copy the range and paste it into the generator's **Paste CSV / TSV** box or into the CSV to Markdown converter. Spreadsheet copies are tab-separated, so both tools split them correctly and escape any pipes in the values. The [Excel to Markdown table page](/csv-to-markdown/excel-to-markdown-table) covers that direction in detail, including number formats and merged cells. For Google Sheets the steps are similar but the menu names differ; see [creating a Google Sheet from a Markdown table](/markdown-table-generator/markdown-table-to-google-sheets). If the table is headed for a document rather than a spreadsheet, [Markdown table to Word table](/markdown-to-word/markdown-table-to-word-table) is the better path.
