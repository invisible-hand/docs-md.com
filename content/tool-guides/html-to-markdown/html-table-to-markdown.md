---
title: HTML Table to Markdown: Headers, Colspan, Paste
h1: How do you convert an HTML table to Markdown?
description: Paste the table's HTML or the copied table into a converter. One header row converts cleanly; colspan, rowspan and multi-line cells need fixing.
tool: html-to-markdown
updated: 2026-11-03
related: /guides/markdown-table, /markdown-table-generator/merge-cells-in-markdown-table, /html-to-markdown/copy-web-page-as-markdown, /markdown-formatter/fix-markdown-table-alignment
---
Paste the table's HTML, or the table itself copied from a web page, into an HTML to Markdown converter and copy the pipe table it writes. That works cleanly when the table has one header row and one short value per cell. Merged cells, multi-line cells and pipe characters in the text need fixing by hand.

A pipe table in GitHub Flavored Markdown is a narrow format. The [GFM specification](https://github.github.com/gfm/#tables-extension-) describes it as "a single header row, a delimiter row separating the header from the data, and zero or more data rows", and adds that "Block-level elements cannot be inserted in a table". HTML tables have none of those limits, so converting one is mostly a question of how much of the HTML fits that shape. The [HTML to Markdown converter](/html-to-markdown) uses turndown with its GFM table plugin, in your browser. Every behavior described below was checked by running those same libraries (turndown 7.2.4 and turndown-plugin-gfm 1.0.2) on test tables.

## How do I convert a table copied from a web page?

Copy the table in your browser and paste it into the converter, which reads the HTML the browser puts on the clipboard, so rows and cells survive the trip. Step by step:

1. Select the table on the page, including its header row, and copy it.
2. Paste it into the input of the [HTML to Markdown converter](/html-to-markdown). With "Use rich-text clipboard" switched on, which is the default, the converter reads the HTML that the browser put on the clipboard instead of the plain text, so the rows and cells arrive as real `<tr>`, `<th>` and `<td>` elements.
3. Open the Preview tab. If you see a grid, copy the Markdown or download it as a `.md` file.
4. If the output still contains `<table>` tags, the converter did not find a header row. The next section explains why.

For a table in a saved page or in source code, paste the HTML itself or open the `.html` file. The "Strip scripts, styles, nav" option, also on by default, removes `script`, `style`, `nav`, `header`, `footer` and similar page furniture before converting. It does not touch `<thead>` or `<tfoot>`, which belong to the table. To convert a whole article rather than one table, see [copying a web page as Markdown](/html-to-markdown/copy-web-page-as-markdown).

## Which HTML tables become a pipe table?

Only tables with a header row the converter can recognize. A row counts as the header when it sits inside `<thead>`, or when it is the first row of the table and every cell in it is a `<th>`. Anything else is passed through as the original HTML table.

| HTML input | Markdown output |
|---|---|
| `<thead>` with `<th>` cells | Pipe table |
| `<thead>` with `<td>` cells | Pipe table; the row still counts as the header |
| No `<thead>`, first row all `<th>` | Pipe table (the usual layout on wikis and documentation sites) |
| No `<th>` anywhere | Kept as an HTML table |
| First row mixes `<th>` and `<td>` | Kept as an HTML table |
| `<th>` cells in body rows | Ordinary cells |
| `<tfoot>` | Its rows become the last body rows |
| `<caption>` | A line of plain text directly above the table |
| `align="right"` on a header cell | `--:` in the delimiter row |
| CSS `text-align` | Ignored |

A table kept as HTML is not an error. GitHub and most documentation sites render it. But it is not a Markdown table you can edit as text, so if you want one, make the first row `<th>` cells (or wrap it in `<thead>`) and convert again. A caption lands on the line right above the table; GitHub's [table documentation](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables) asks for a blank line before a table, so add one, or turn the caption into a heading.

## What happens to colspan and rowspan?

They are dropped, and the result is usually wrong rather than visibly broken. Markdown has no merged cells, so a spanning cell becomes one ordinary cell and its row ends up shorter than the others.

For example, this header and row:

```html
<tr><th colspan="2">Quarter</th><th>Total</th></tr>
<tr><td>Q1</td><td>Q2</td><td>9</td></tr>
```

becomes

```markdown
| Quarter | Total |
| --- | --- |
| Q1 | Q2 | 9 |
```

The header now has two columns and the body row three. The GFM spec says that when a row has more cells than the header, "the excess is ignored", so the 9 silently disappears from the rendered table. A `rowspan` fails the other way: the merged cell appears only in its first row, the following row starts one cell short, and every value in it slides one column to the left, under the wrong header.

Fix the HTML before converting. Repeat the merged value in each cell it covered and delete the `colspan` or `rowspan`, or combine two header rows into one with names like "Q1 revenue". If the merge matters to readers, keep the HTML table instead; [merging cells in a Markdown table](/markdown-table-generator/merge-cells-in-markdown-table) covers where HTML tables with spans render.

## Why does a converted row break across several lines?

Because a cell held something a pipe table cannot: a line break, paragraphs, a list or a nested table. The converter writes that content on several lines, a table row has to be one line, and the row splits. Three fixes cover most cases:

- **Line breaks.** `<br>` turns into a Markdown hard break (two spaces and a newline), which ends the row. Join the lines and put `<br>` between them; GitHub and GitLab render `<br>` inside a cell.
- **Paragraphs and lists.** Flatten them into one line, for example `• first<br>• second`. The [guide to line breaks in table cells](/guides/markdown-table-line-break) shows the options.
- **Pipe characters.** The converter escapes `*` and `_` in cell text but not `|`, so a cell containing `a | b` gains a column. Put a backslash before each pipe. GitHub's documentation shows that escape, and the GFM spec says it applies inside inline code too.

## What about tables with two header rows?

Each header row gets its own delimiter row. The first pair becomes the table header, the second header row becomes a body row, and its delimiter row shows up as a row of literal dashes:

```markdown
| A | B |
| --- | --- |
| a2 | b2 |
| --- | --- |
| 1 | 2 |
```

Delete the second `| --- | --- |` line. Then either merge the two header rows into one ("Revenue Q1", "Revenue Q2") or keep the second row as the first data row. A Markdown table has exactly one header row, so there is no way to keep both as headers.

## How do I clean up the converted table?

The converter does not pad cells, so rows come out as `| PDF | Done |` with ragged pipes. That renders correctly. To line the columns up in the source, run the table through a formatter as described in [aligning a Markdown table](/markdown-formatter/fix-markdown-table-alignment). Set alignment by adding colons to the delimiter row, `---:` for right and `:---:` for center. Then paste the result into the [Markdown viewer](/markdown-viewer) and check that every row shows the right number of cells, which catches a dropped colspan or a stray pipe quickly.

## Can I convert HTML tables on the command line?

Yes. The converter is built on turndown and turndown-plugin-gfm, which also run in Node.js, so a short script gives the same results as the browser tool, header-row rule included:

```js
// npm install turndown turndown-plugin-gfm
const TurndownService = require('turndown');
const { gfm } = require('turndown-plugin-gfm');
const fs = require('node:fs');

const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
td.use(gfm);
console.log(td.turndown(fs.readFileSync(process.argv[2], 'utf8')));
```

Run it as `node table.js page.html > page.md`. The header-row rule is the same as in the browser, so tables without a recognizable header come out as HTML, and colspan and rowspan are dropped the same way.

## Should I keep the table in HTML instead?

Keep it when merged cells, several paragraphs in a cell or real lists inside cells carry meaning, and the place you publish renders HTML. GitHub keeps `colspan` and `rowspan` when it renders Markdown, and GitLab and Obsidian render HTML tables too. Chat apps do not: Discord and Slack have no table syntax at all, as [making a table in Discord or Slack](/markdown-table-generator/markdown-table-in-discord-and-slack) explains. When the data is simple and the HTML was only a container, convert it. A pipe table is easier to read in a diff and to edit by hand, and the [Markdown table generator](/markdown-table-generator) can rebuild one from pasted CSV or TSV rows if the conversion gets messy.
