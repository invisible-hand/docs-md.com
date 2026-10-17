---
title: CSV to Markdown From the Command Line: pandoc, Miller
h1: How do I convert CSV to Markdown from the command line?
description: One-line commands with pandoc, Miller, csvkit and pandas that turn a CSV file into a markdown table, tested, with the quirks each tool has.
tool: csv-to-markdown
updated: 2026-10-17
related: /guides/markdown-table, /guides/markdown-escape-characters, /csv-to-markdown/google-sheets-to-markdown, /json-to-markdown-table
---
Run `pandoc -f csv -t gfm data.csv` to print a GitHub-flavored markdown table, or `mlr --icsv --omd cat data.csv` if you use Miller. Both read quoted fields correctly and escape pipe characters. Add `-o table.md` to pandoc, or redirect with `>`, to write the result to a file instead of the terminal.

Those two are the safest choices. csvkit's `csvlook` and Python's pandas also print markdown-style tables, but both change your data in ways that are easy to miss. Every command below was run on 2026-10-17 against the same test file with the versions named, and the differences are described from that run rather than from memory.

The test file has a comma inside a quoted field and a literal pipe:

```csv
name,price,note
Widget,9.99,"Small, blue"
Gadget,24.50,"Has a | pipe"
```

## pandoc

pandoc lists CSV and TSV among its input formats in the [pandoc manual](https://pandoc.org/MANUAL.html), and `gfm` (GitHub-Flavored Markdown) among its outputs. Tested with pandoc 3.12.1:

```bash
pandoc -f csv -t gfm data.csv
pandoc -f csv -t gfm data.csv -o table.md
cat data.csv | pandoc -f csv -t gfm
pandoc -f tsv -t gfm data.tsv
```

Output:

```markdown
| name   | price | note          |
|--------|-------|---------------|
| Widget | 9.99  | Small, blue   |
| Gadget | 24.50 | Has a \| pipe |
```

The columns are padded, the pipe is escaped as `\|`, and `24.50` stays `24.50`. pandoc treats the first row as the header. Install it from the [pandoc releases page](https://github.com/jgm/pandoc/releases) or your package manager.

One behavior to know: when a cell contains a line break, pandoc cannot express the table as a pipe table, so it writes a raw HTML `<table>` instead, with `<br />` inside the cell. That still renders on GitHub, but it is no longer a markdown table you can edit comfortably. If you want a pipe table, replace the line breaks first; the [line break in a table cell guide](/guides/markdown-table-line-break) explains the options.

## Miller

[Miller](https://miller.readthedocs.io/en/latest/file-formats/) (`mlr`) supports markdown as an output format, and as of Miller 6.11.0 as an input format too. Tested with Miller 6.22.0:

```bash
mlr --icsv --omd cat data.csv
mlr --c2m cat data.csv
mlr --itsv --omd cat data.tsv
mlr --icsv --ifs ';' --omd cat data.csv
```

`--c2m` is shorthand for CSV in, markdown out. Output:

```markdown
| name | price | note |
| --- | --- | --- |
| Widget | 9.99 | Small, blue |
| Gadget | 24.50 | Has a \| pipe |
```

Miller does not pad the columns, which makes the source harder to read but renders identically. Its strength is that `cat` can be any Miller verb, so you can filter, sort or pick columns in the same command, for example `mlr --c2m sort -f name then cut -f name,price data.csv`.

The weakness: a cell with a line break is written into the table as-is, which splits the row across two lines and breaks the table. Replace line breaks before converting if your data has them.

## csvkit (csvlook)

The [csvlook documentation](https://csvkit.readthedocs.io/en/latest/scripts/csvlook.html) describes its output as a "Markdown-compatible, fixed-width format". Tested with csvkit 2.2.0:

```bash
csvlook data.csv
csvlook -I data.csv
csvlook -d ';' -I data.csv
```

Two problems showed up in testing. First, csvlook does not escape pipes, so `Has a | pipe` became an extra column when rendered. Second, it infers column types by default: a value of `007` came out as `7`, and with `-d ';'` the value `1,5` came out as `15`. The `-I` (`--no-inference`) flag turns inference off and keeps values as written. Use csvlook for reading a CSV in the terminal; if you publish its output, add `-I` and check for pipes by hand.

## Python with pandas

pandas has `DataFrame.to_markdown()`, which, as its [documentation](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_markdown.html) says, requires the `tabulate` package. Tested with pandas 3.0.6 and tabulate 0.10.0:

```bash
pip install pandas==3.0.6 tabulate==0.10.0
python -c "import pandas as pd; print(pd.read_csv('data.csv', dtype=str).to_markdown(index=False))"
```

`index=False` drops the row-number column that pandas adds otherwise. `dtype=str` matters: without it, pandas parses `24.50` as a number and prints `24.5`, and `007` as `7`. Like csvlook, this output did not escape the pipe, and a cell with a line break split the row. pandas is the right choice when the data needs cleaning in Python anyway; for a straight conversion it is the heaviest option.

## Which tool should I use?

pandoc for a one-off conversion or a build script, because it escapes pipes, keeps values unchanged and pads columns. Miller when you also want to filter, sort or select columns in the same step. pandas when the conversion sits inside a Python data pipeline. csvlook for looking at data in a terminal rather than for producing published markdown.

| Tool | Version tested | Escapes `\|` | Keeps `007` and `24.50` | Cell with a line break |
|---|---|---|---|---|
| pandoc | 3.12.1 | yes | yes | writes an HTML table |
| Miller | 6.22.0 | yes | yes | breaks the table |
| csvlook | csvkit 2.2.0 | no | only with `-I` | shows `↵` |
| pandas + tabulate | 3.0.6 + 0.10.0 | no | only with `dtype=str` | breaks the table |

## How do I convert every CSV file in a folder?

Use a shell loop. With pandoc, this writes `report.md` next to `report.csv` for each file in the current folder:

```bash
for f in *.csv; do pandoc -f csv -t gfm "$f" -o "${f%.csv}.md"; done
```

The quotes around `$f` keep file names with spaces intact, and `${f%.csv}` strips the extension before adding `.md`.

## How do I set column alignment from the command line?

None of these commands sets alignment for you; pandoc and Miller write plain `---` separators, which render left-aligned. Edit the separator row afterwards: `---:` aligns a column right and `:---:` centers it, as the [markdown table guide](/guides/markdown-table) shows. If you would rather click than edit, paste the CSV into the [CSV to markdown converter](/csv-to-markdown), which has per-column alignment and runs in the browser.

## How do I keep a generated table in sync with the CSV?

Treat the markdown as a build output. Keep the CSV as the source of truth, put the conversion command in a script or a `Makefile` target, and run it whenever the data changes:

```make
docs/prices.md: data/prices.csv
	pandoc -f csv -t gfm data/prices.csv -o docs/prices.md
```

If both files are committed, a continuous-integration job can run the same command and then `git diff --exit-code docs/prices.md`, which fails the build when someone edited the CSV without regenerating the table. That catches the most common drift: a table in the docs that no longer matches the data it claims to show. Pinning the converter version in the job keeps the output stable, because padding and escaping can change between releases.

## What about CSV files with a semicolon or tab delimiter?

For tab-separated files use pandoc's `-f tsv` or Miller's `--itsv`. For semicolons, which spreadsheet software writes in some locales, Miller takes `--ifs ';'` and csvlook takes `-d ';'`. pandoc's CSV reader expects commas, so convert the delimiter first or use Miller.

## Can I do this without installing anything?

Yes, if you do not need it in a script. The [CSV to markdown converter](/csv-to-markdown) accepts pasted CSV or TSV, detects the delimiter, escapes pipes, turns in-cell line breaks into `<br>` tags, and works offline once the page has loaded. For data that starts as JSON rather than CSV, the [JSON to markdown table converter](/json-to-markdown-table) does the same job.
