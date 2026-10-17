---
title: How to Sort a Markdown Table by Any Column
h1: How do I sort a Markdown table?
description: Markdown has no sort syntax; rows show in the order you write them. Sort with a spreadsheet round trip or the sort command, keeping the header in place.
tool: markdown-table-generator
updated: 2026-10-17
related: /csv-to-markdown, /guides/markdown-table, /markdown-table-generator/markdown-table-vs-csv-for-llm, /csv-to-markdown/excel-to-markdown-table
---
Markdown has no sort feature: rows appear in the order they are written. To sort, reorder the lines. The simplest way is a round trip: convert the table to CSV, sort it in a spreadsheet, and convert it back. On the command line, `sort` with `|` as the field separator works, as long as you keep the header out of it.

A pipe table is just lines of text. The renderer does not reorder anything, and GitHub Flavored Markdown has no attribute for a sort column or a default order. Sorting is something you do to the source before you commit or publish it. The methods below go from the most forgiving (any data, any platform) to the fastest (one command, clean data only).

## How do I sort a Markdown table with a spreadsheet?

This works for any table and handles text, numbers and dates the way a spreadsheet does.

1. Paste the table into the [CSV to Markdown converter](/csv-to-markdown) and switch the direction to Markdown → CSV. Choose Tab as the output delimiter; it pastes most cleanly into a spreadsheet.
2. Copy the output and paste it into Excel, Google Sheets, Numbers or LibreOffice Calc. Escaped pipes (`\|`) come out as plain `|` characters, and the header lands in the first row.
3. Select the data, use the spreadsheet's sort command with "data has header row" turned on, and pick the column and direction.
4. Copy the sorted range, including the header, and paste it back into the CSV to Markdown converter in the normal direction. It detects the tab separator and rebuilds the table.

Column alignment is not carried through CSV, so set it again in the converter (click a column's alignment control) if your table had right-aligned numbers. This round trip is also the moment to fix anything else: rename a header, delete a column, or correct a value. If your data started in a spreadsheet, see [converting an Excel sheet to a Markdown table](/csv-to-markdown/excel-to-markdown-table).

## How do I sort a Markdown table on the command line?

Keep the first two lines (header and delimiter row) as they are and sort the rest with pipes as the field separator. The [GNU sort manual](https://www.gnu.org/software/coreutils/manual/html_node/sort-invocation.html) documents `-t` for the separator and `-k` for the key:

```bash
(head -n 2 table.md; tail -n +3 table.md | sort -t '|' -k 2,2) > sorted.md
```

The field numbers are one higher than you might expect. A row like `| axios | 105000 |` starts with a pipe, so field 1 is the empty text before it, field 2 is the first column, field 3 the second, and so on. Common variations:

```bash
# second column, numeric, largest first
(head -n 2 table.md; tail -n +3 table.md | sort -t '|' -k 3,3 -n -r)

# third column, ignoring upper and lower case
(head -n 2 table.md; tail -n +3 table.md | sort -t '|' -k 4,4 -f)
```

`-n` compares numbers by value instead of character by character, so `9800` comes before `10275`. `-r` reverses the order and `-f` treats `b` and `B` as equal. If the order of letters looks wrong, it is the locale: the manual notes that sort follows your `LC_COLLATE` setting, and suggests setting `LC_ALL=C` for plain byte order, for example `LC_ALL=C sort -t '|' -k 2,2`.

## When does the command-line method break?

When a cell contains an escaped pipe. `sort` does not know Markdown, so `\|` inside a cell counts as a field separator, the rest of that row shifts one field to the right, and the row is sorted on the wrong value. It also breaks on tables that span several sections or have blank lines, and on numbers with currency symbols, units or a leading `+`, which the manual says `-n` does not recognise (thousands separators depend on the locale's `LC_NUMERIC` setting). For any of those, use the spreadsheet round trip, which parses the table properly.

The table itself is never damaged by a wrong sort; only the order is. Still, write to a new file (`> sorted.md`) and compare before you replace the original.

## How do I sort by two columns?

In a spreadsheet, add a second level in the sort dialog: for example Language first, then Stars within each language. On the command line, give `sort` more than one key. The manual says it compares the keys in the order they appear on the command line, so the second key only decides between rows that tie on the first:

```bash
(head -n 2 table.md; tail -n +3 table.md | sort -t '|' -k 4,4 -k 3,3nr)
```

Here the letters after a key (`n` for numeric, `r` for reverse) apply to that key alone, so the table is sorted by the third column alphabetically and, within each group, by the second column from largest to smallest.

## Can the Markdown table generator sort rows?

No. The [Markdown table generator](/markdown-table-generator) builds and edits tables: cells, alignment, adding and removing rows and columns, and pasting CSV or TSV data. It does not sort or reorder rows. To sort a table you are building there, sort the data before pasting it in with Paste CSV / TSV, or finish the table, then sort it with one of the methods above. The generator's paste splits on tabs or commas without reading quotes, so for data with commas inside values, paste tab-separated text.

## Should I sort in a text editor?

Many code editors have a command to sort selected lines alphabetically, and that works for a quick sort on the first column: select the data rows only (not the header or the delimiter row) and run it. It compares whole lines as text, so it effectively sorts by the first column and cannot sort numbers by value. For any other column, or for numbers, use a spreadsheet or `sort -k`.

## How do I keep a table sorted as it grows?

Pick a rule and write it down where contributors will see it, for example in a comment above the table: `<!-- keep rows sorted by Name -->`. HTML comments are not rendered, so the note stays in the source only; the [comment guide](/guides/markdown-comment) covers the syntax. Alphabetical order by the first column is the easiest rule to keep, because new rows can be inserted by eye without any tool. For tables generated from data, such as a list of releases or benchmark results, sort in the script that writes the table rather than by hand.

## What order should a table be in?

The order a reader needs. Alphabetical suits reference lists that people scan for a name. Descending by a metric suits rankings and comparisons. Chronological suits changelogs and timelines; decide once whether newest goes first. If you hand the table to an AI assistant, say in the prompt how it is sorted, as covered in [Markdown table or CSV for an LLM](/markdown-table-generator/markdown-table-vs-csv-for-llm). The [Markdown table guide](/guides/markdown-table) covers the rest of the syntax.
