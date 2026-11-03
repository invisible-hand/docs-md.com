---
title: Markdown Table to CSV or Excel: Convert and Paste
h1: How do you convert a Markdown table to CSV or Excel?
description: Paste the table into a Markdown-to-CSV converter, choose comma, tab or semicolon, and paste or import the result into Excel or Google Sheets.
tool: csv-to-markdown
updated: 2026-11-03
related: /csv-to-markdown/excel-to-markdown-table, /markdown-table-generator/sort-markdown-table, /guides/markdown-table, /csv-to-markdown/google-sheets-to-markdown
---
Paste the table into a converter that reads Markdown pipe tables and writes delimited text, then put the result in a spreadsheet. Choose tab-separated output to paste straight into Excel or Google Sheets, or download a CSV file to open or import. Escaped pipes become plain pipes, and values that need quoting get quoted.

The [CSV to Markdown converter](/csv-to-markdown) works in both directions. Its default mode turns CSV or pasted spreadsheet cells into a table; the Markdown → CSV mode does the reverse. It runs in the browser, so the table is not uploaded anywhere. The rest of this page describes exactly what that mode does, taken from the tool's code, and how to get the result into a spreadsheet without losing data on the way.

## How do I convert a Markdown table with the converter?

Switch the converter to Markdown → CSV, paste the table, choose a delimiter, and copy or download the result. In detail:

1. Open the [CSV to Markdown converter](/csv-to-markdown) and click **Markdown → CSV** at the top.
2. Paste the table into the Markdown table box. Outer pipes are optional, and the columns do not need to line up.
3. Pick a delimiter: Comma (CSV), Tab (TSV) or Semicolon.
4. Click **Copy**, or **Download** to save `table.csv` (`table.tsv` when Tab is selected).

The line under the boxes reports what was found, for example "4 rows × 3 columns", or "No table found" when nothing parsed. Compare those numbers with the table you pasted before you go further: a row count that is too high usually means two tables were read as one, and a column count that is too high usually means an unescaped pipe.

## How do I paste the table into Excel or Google Sheets?

Choose Tab (TSV), click Copy, click the top-left cell where the table should go, and paste. Tab is the better delimiter for pasting because prose often contains commas and almost never contains tabs.

If every row lands in a single column, split it after pasting. In Google Sheets, select the column and use [Data > Split text to columns](https://support.google.com/docs/answer/6325535), then pick the separator. In Excel, select the column and use [Data > Text to Columns](https://support.microsoft.com/en-us/office/split-text-into-different-columns-with-the-convert-text-to-columns-wizard-30b14928-5550-41f5-97ca-7a3e9c363ed7), choose Delimited, and tick Tab.

## How do I open the CSV file in Excel?

Download the file with Comma selected, then either double-click it or import it. Microsoft's page on [importing text and CSV files](https://support.microsoft.com/en-us/office/import-or-export-text-txt-or-csv-files-5250ac4c-663c-47ce-937b-339e391393ba) explains the difference: when Excel opens a `.csv` directly, "it uses the current default data format settings to interpret how to import each column of data." That is where leading zeros in IDs and postal codes go missing and dates get read in a different order. For control over each column, import with **Data > From Text/CSV** instead, which shows a preview and lets you choose the delimiter.

Encoding is the other trap. The converter's download is UTF-8 without a byte order mark. Microsoft's note on [opening UTF-8 CSV files](https://support.microsoft.com/en-us/office/opening-csv-utf-8-files-correctly-in-excel-8a935af5-3416-4edd-ba7e-3dfd2bc4a032) says Excel opens a UTF-8 CSV normally only if it was saved with that mark; otherwise use Data > Get Data > From File > From Text/CSV. If accented letters or non-Latin text look garbled after a double-click, this is why. Copying with Tab and pasting avoids the question, because the clipboard carries text rather than a file.

If your Excel uses a comma as the decimal separator, choose Semicolon. Microsoft's import page notes that a comma decimal separator forces Excel to use a semicolon as its list separator for CSV files, so a semicolon-separated file matches what that copy of Excel uses.

## How do I import it into Google Sheets?

Use File > Import, upload the file, and choose where the data should go. Google's help on [importing data sets](https://support.google.com/docs/answer/40608) lists `.csv`, `.tsv` and `.txt` among the accepted types, and for plain text files offers a "Separator character" setting: Detect automatically, Tab, Comma or Custom. A semicolon file works with Detect automatically or with Custom set to `;`.

## What changes between the Markdown table and the CSV?

The values stay the same; the Markdown around them goes. The header becomes the first row, alignment disappears, escaped pipes and `<br>` tags turn back into the characters they stand for, and anything else written in Markdown syntax, such as bold markers or links, is kept as literal text:

| In the Markdown table | In the CSV |
|---|---|
| Header row | First row |
| Delimiter row and alignment colons | Dropped; CSV has no alignment |
| A backslash-escaped pipe in a cell | A plain pipe character |
| `<br>` in a cell | A real line break inside the field, which is then quoted |
| `**bold**`, `[text](url)`, backticks | Kept as typed; Markdown syntax is not stripped |
| Spaces around cell text | Trimmed |
| A value containing the delimiter, a quote or a line break | Wrapped in double quotes, with inner quotes doubled |

The quoting follows the convention in [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180): a field is enclosed in double quotes only when it needs to be, and a quote inside it is written twice. Most cells therefore come out unquoted. Formatting markers are the one thing to clean up by hand: a header written as `**Name**` arrives in the spreadsheet with its asterisks, so remove them in the Markdown first or with find and replace afterwards.

## Which table does the converter read?

The first one. It looks for the first line containing a pipe that is followed by a delimiter row, then reads rows until it reaches a line with no pipe. Blank lines are skipped, which means two tables separated only by blank lines are read as one, with the second table's header and delimiter row arriving as extra data rows. Paste one table at a time. If the input has no delimiter row at all, every line containing a pipe is treated as a row.

Rows are written exactly as they are. A Markdown renderer, following the [GFM spec](https://github.github.com/gfm/#tables-extension-), drops cells beyond the header's count and fills short rows with empty cells. The converter does neither: extra cells are kept and short rows stay short. That is useful for debugging, because a row that spills into an extra spreadsheet column points straight at an unescaped pipe in the source.

## Can I convert a Markdown table to CSV on the command line?

Yes. [Miller](https://miller.readthedocs.io/en/latest/file-formats/) reads Markdown tables as of version 6.11.0 (the `--imd` flag), and a short Python script does the job with nothing to install. With Miller, for a file that holds just the table:

```bash
mlr --imd --ocsv cat table.md > table.csv
```

The Python script uses only the standard library. It reads the first table in the file, treats a backslash-escaped pipe as a literal pipe, skips the delimiter row, and stops at the first line without a pipe, which is also where GFM ends a table:

```python
import csv, re, sys

def cells(line):
    line = line.strip()
    if line.startswith('|'):
        line = line[1:]
    if line.endswith('|') and not line.endswith('\\|'):
        line = line[:-1]
    return [c.strip().replace('\\|', '|') for c in re.split(r'(?<!\\)\|', line)]

rows = []
with open(sys.argv[1], encoding='utf-8') as f:
    for line in f:
        if '|' not in line:
            if rows:
                break  # a line without a pipe ends the table
            continue
        row = cells(line)
        if all(re.fullmatch(r':?-+:?', c) for c in row):
            continue  # skip the delimiter row
        rows.append(row)

with open(sys.argv[2], 'w', newline='', encoding='utf-8-sig') as out:
    csv.writer(out).writerows(rows)
```

Run it as `python3 md2csv.py table.md table.csv`. The `utf-8-sig` encoding writes the byte order mark Excel looks for, and the `csv` module applies the same quoting rules described above.

## How do I turn the CSV back into a Markdown table?

Switch the converter back to CSV → Markdown and paste the cells, or open the file. The delimiter is auto-detected, and cells copied from a spreadsheet arrive tab-separated. Column alignment does not survive a trip through CSV, so set it again with the per-column alignment buttons, which cycle each column through left, center and right. This round trip is the easiest way to [sort a Markdown table](/markdown-table-generator/sort-markdown-table) or edit many cells at once, and the full spreadsheet-to-table direction is covered in [converting an Excel sheet to a Markdown table](/csv-to-markdown/excel-to-markdown-table).
