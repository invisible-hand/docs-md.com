---
title: Merge Cells in a Markdown Table (Colspan)
h1: Can you merge cells in a Markdown table?
description: Not in a pipe table: GFM has no colspan or rowspan. Use an HTML table where the platform renders HTML, a Pandoc grid table, or restructure the data.
tool: markdown-table-generator
updated: 2026-11-03
related: /guides/markdown-table, /html-to-markdown/html-table-to-markdown, /markdown-table-generator/markdown-table-cell-lists-images, /markdown-to-html
---
No. GitHub Flavored Markdown tables have no colspan or rowspan: each row is one line with one cell per column. To merge cells, write the table in HTML where the platform renders HTML, use a format with span syntax such as Pandoc grid tables, or restructure the data so that no cell has to span.

People usually want one of two things: a header that groups several columns ("Revenue" over Q1 and Q2), or a label that groups several rows ("Docs" next to everyone on the docs team). Both have workable answers. Which one fits depends on where the table will be read, because HTML tables render on some platforms and show up as raw tags on others.

## Why can't a pipe table merge cells?

Because the format has no place to say so. The [GFM specification](https://github.github.com/gfm/#tables-extension-) defines a table as "a single header row, a delimiter row separating the header from the data, and zero or more data rows", with cells separated by pipes. Its only rule about rows of different lengths is there to handle mistakes, not spans: "If there are a number of cells fewer than the number of cells in the header row, empty cells are inserted. If there are greater, the excess is ignored."

So two pipes with nothing between them make an empty cell, not a wider one. GitHub renders this row as three cells with an empty one in the middle:

```markdown
| Quarter | Month | Revenue |
|---------|-------|---------|
| Q1      ||  120 |
```

## How do I merge cells with an HTML table?

Write the table in HTML and use `colspan` to span columns and `rowspan` to span rows. Each spanning cell replaces the cells it covers, so the rows around it have fewer cells in the source:

```html
<table>
  <thead>
    <tr><th rowspan="2">Region</th><th colspan="2">Revenue</th></tr>
    <tr><th>Q1</th><th>Q2</th></tr>
  </thead>
  <tbody>
    <tr><td>North</td><td>120</td><td>135</td></tr>
    <tr><td>South</td><td>98</td><td>110</td></tr>
  </tbody>
</table>
```

Region covers both header rows, so the second header row holds only Q1 and Q2; Revenue covers two columns. GitHub keeps both attributes when it renders Markdown. Two rules matter there:

- **Leave a blank line before and after the table**, so it forms an HTML block of its own.
- **Markdown next to the tags is not parsed.** `<td>**total**</td>` shows the asterisks. Use HTML inside cells (`<strong>`, `<a href="...">`, `<code>`), or put the Markdown on its own lines with a blank line above and below. The GFM spec calls that blank-line rule "a very simple and flexible way of including Markdown content inside HTML tags", and GitLab's [Markdown documentation](https://docs.gitlab.com/user/markdown/#tables) uses the same pattern to put a task list in an HTML table cell.

```html
<td>

**Bold**, a [link](https://example.com) and a list:

- one
- two

</td>
```

Obsidian works the other way round. Its help page on [HTML content](https://obsidian.md/help/html) says Obsidian "does not render Markdown syntax inside HTML elements" and that blank lines break an HTML block, so write an Obsidian table without blank lines and format the cells with HTML tags only.

## Which platforms render merged cells?

GitHub, GitLab, Obsidian and Pandoc can all show merged cells, each with its own rules; MultiMarkdown can span columns but not rows; Discord and Slack messages cannot show tables at all:

| Where | Merged cells | How |
|---|---|---|
| GitHub | Yes | HTML table; Markdown in cells only on lines set off by blank lines |
| GitLab | Yes | HTML table, same blank-line rule; tables with spanning cells cannot be sorted in the rendered view |
| Obsidian | Yes | HTML table with no blank lines inside; HTML formatting only |
| Pandoc | Yes | Grid tables; raw HTML reaches HTML-family output only |
| MultiMarkdown | Columns only | Extra pipes after a cell |
| Discord and Slack messages | No | No table syntax and no HTML |

GitLab's documentation lists "Tables with cells that span multiple rows or columns" among the tables its sort buttons skip. The [Pandoc manual](https://pandoc.org/MANUAL.html#extension-raw_html) says raw HTML is passed through to HTML, EPUB and Markdown output and "suppressed in other formats", so an HTML table in a Pandoc source vanishes from Word or LaTeX output; use a grid table there. Chat apps have no tables at all, merged or not, as [making a table in Discord or Slack](/markdown-table-generator/markdown-table-in-discord-and-slack) explains, and Slack's table block for apps has no span setting either.

## How do I fake a merged header in plain Markdown?

Move the group name into each column header, so the single header row carries both levels:

```markdown
| Region | Revenue Q1 | Revenue Q2 | Cost Q1 | Cost Q2 |
|--------|-----------:|-----------:|--------:|--------:|
| North  |        120 |        135 |      80 |      84 |
```

Or split the table, one per group, under a heading that does the grouping:

```markdown
### Revenue

| Region | Q1  | Q2  |
|--------|----:|----:|
| North  | 120 | 135 |
```

Both keep a single header row, render wherever pipe tables render, and convert to CSV or a spreadsheet without losing anything.

## How do I show a cell that spans several rows?

Repeat the value in every row it applies to. It looks redundant, but it is the only option that keeps its meaning when the table is sorted, filtered, exported to CSV or read one row at a time:

```markdown
| Team | Name | Role   |
|------|------|--------|
| Docs | Ann  | Lead   |
| Docs | Bob  | Writer |
| QA   | Cy   | Tester |
```

Two alternatives read more like a merged cell but depend on row order. You can leave the repeated cells empty, so only the first row of each group carries the label. Or you can add a group row: a row whose first cell holds the group name in bold and whose other cells are empty, followed by the members with an empty first cell. Both break as soon as someone sorts the table, and a row read on its own no longer says which group it belongs to.

## What about Pandoc grid tables and MultiMarkdown?

Both have span syntax, for documents those tools process. Pandoc's grid tables draw the cell borders with `+`, `-`, `=` and `|`, and the manual says "Cells can span multiple columns or rows". This example from the Pandoc manual has a header cell spanning three columns and another spanning both header rows:

```text
+---------------------+-----------------------+
| Location            | Temperature 1961-1990 |
|                     | in degree Celsius     |
|                     +-------+-------+-------+
|                     | min   | mean  | max   |
+=====================+=======+=======+=======+
| Antarctica          | -89.2 | N/A   | 19.8  |
+---------------------+-------+-------+-------+
| Earth               | -89.2 | 14    | 56.7  |
+---------------------+-------+-------+-------+
```

[MultiMarkdown](https://fletcher.github.io/MultiMarkdown-6/syntax/tables.html) spans columns only: add extra pipes after a cell, and "The number of pipes equals the number of columns the cell should span".

```markdown
|        | Revenue      ||
| Region | Q1    | Q2    |
|--------|-------|-------|
| North  | 120   | 135   |
```

Neither works on GitHub. A grid table shows there as plain text, and in the MultiMarkdown example GitHub prints the first line as stray text above an ordinary table. Use them only where Pandoc or MultiMarkdown does the rendering.

## Can the Markdown table generator merge cells?

No. The [Markdown table generator](/markdown-table-generator) writes pipe tables: cells, column alignment, rows and columns, and pasted CSV or TSV data, with no merge option, because the output format has none. When a table needs spans, build the grid there, paste the Markdown into [Markdown to HTML](/markdown-to-html) to get the `<table>` markup, then add `colspan` or `rowspan` by hand and delete the cells each span covers.

## What happens to merged cells when I convert a table to Markdown?

They are flattened, and the values around them can end up in the wrong column. Converting an HTML table drops `colspan` and `rowspan`, so the row with the spanning cell comes out short; [converting an HTML table to Markdown](/html-to-markdown/html-table-to-markdown) shows the effect and the fix. In a spreadsheet, unmerge the cells and fill in the repeated values before you copy or export, as the [Google Sheets to Markdown guide](/csv-to-markdown/google-sheets-to-markdown) describes. For everything else about pipe-table syntax, see the [Markdown table guide](/guides/markdown-table).
