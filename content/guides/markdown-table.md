---
title: Markdown Table Syntax — Alignment, Escaping, Line Breaks
h1: How to make a table in markdown
description: Markdown table syntax: pipes for columns, a hyphen row under the header, colons for alignment. Escaping |, line breaks with <br>, empty cells, no colspan, and where tables render.
updated: 2026-10-15
related: markdown-table-line-break, markdown-escape-characters, markdown-new-line, markdown-headings, markdown-bullet-points, markdown-definition-list
---
To make a table in markdown, separate columns with `|` and put a row of hyphens (at least three per column) under the header row. Every other line is a data row. Add a colon to the hyphen row to set the column's alignment:

```markdown
| Feature  | Syntax     | Works on      |
|:---------|:----------:|--------------:|
| Bold     | `**text**` | everywhere    |
| Table    | `\|` pipes | GitHub, GitLab |
```

| Feature  | Syntax     | Works on      |
|:---------|:----------:|--------------:|
| Bold     | `**text**` | everywhere    |
| Table    | `\|` pipes | GitHub, GitLab |

That is the whole syntax on the happy path. The rest of this guide covers the parts that bite: pipes inside cells, multi-line cells, empty cells, merged cells (there are none), and which apps render tables at all. If you would rather not count pipes by hand, the [markdown table generator](/markdown-table-generator) builds the grid for you and [CSV to markdown](/csv-to-markdown) converts a spreadsheet export.

## What is the markdown table syntax?

A markdown table is a header row, a delimiter row of hyphens, and zero or more body rows, with cells separated by pipes. Tables are not in the original markdown or in CommonMark; they are a [GitHub Flavored Markdown extension](https://github.github.com/gfm/#tables-extension-) that most renderers adopted. The rules GitHub documents in [Organizing information with tables](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables) are the ones to follow:

| Rule | Detail |
|---|---|
| Header row | Required. The first line is always the header; there is no headerless table |
| Delimiter row | Required. At least three hyphens per column (`---`); GFM accepts one, GitHub's docs say three |
| Outer pipes | Optional. `a \| b` and `\| a \| b \|` are the same table |
| Blank line before | Required on GitHub. A table glued to the paragraph above does not render |
| Column count | Set by the header. Extra cells in a body row are dropped, missing ones are filled empty |
| Cell width | Irrelevant. Cells do not need to line up in the source |
| Inline formatting | Works in cells: bold, italic, code, links, images, emoji |
| Block content | Not allowed: no lists, headings, code fences or paragraphs inside a cell |

The delimiter row is what turns pipes into a table. A single column still needs a pipe on the line (`| only |`), otherwise the parser sees plain text.

## How do you align columns in a markdown table?

Put a colon on the side of the hyphens you want the text pulled toward: `:---` is left, `---:` is right, `:---:` is centre. Alignment is set per column in the delimiter row and applies to every cell in that column, header included:

```markdown
| Left | Centre | Right |
|:-----|:------:|------:|
| 1    | 2      | 3     |
| long text | long text | long text |
```

| Left | Centre | Right |
|:-----|:------:|------:|
| 1    | 2      | 3     |
| long text | long text | long text |

With no colon the column uses the renderer's default, which is left-aligned in almost every stylesheet. You cannot align a single cell differently from its column; that needs an HTML `<td align="right">`.

## How do you put a pipe character inside a table cell?

Escape it with a backslash: `\|`. GitHub's docs are explicit that a backslash before the pipe is how you show a literal `|` in a cell. The escape is needed even inside inline code, because the table parser splits on pipes before the code span is parsed:

```markdown
| Shell | Meaning |
|---|---|
| `a \| b` | pipe the output of a into b |
| `\|\|` | logical OR |
```

| Shell | Meaning |
|---|---|
| `a \| b` | pipe the output of a into b |
| `\|\|` | logical OR |

The GFM spec confirms that `\|` inside a code span in a table cell is rendered as a plain pipe. Outside tables the backslash is unnecessary and would show up in most renderers, so only escape pipes in cells. An HTML entity (`&#124;`) also works in renderers that pass entities through, which includes GitHub.

## How do you add a line break inside a table cell?

Use the HTML `<br>` tag. A markdown table cell has to stay on one source line, so the two-trailing-spaces and backslash line breaks that work in paragraphs do nothing here. GitLab's [markdown docs](https://docs.gitlab.com/ee/user/markdown.html#tables) show the same approach:

```markdown
| Step | Command |
|---|---|
| Install | `npm install`<br>`npm run build` |
```

On GitHub, GitLab, Obsidian and most docs generators the cell shows two lines. In renderers that strip HTML (Reddit, Discord, Slack) the `<br>` is removed or printed literally. The [table line break guide](/guides/markdown-table-line-break) covers bullets inside cells and when to give up and switch to HTML.

## Can a markdown table have an empty cell?

Yes. Leave nothing between two pipes (`| |` or `||`) and the cell renders empty. Rows that end early are padded with empty cells, so the trailing pipes can be omitted, but the row still has to have at least one pipe to belong to the table:

```markdown
| Name | Email | Phone |
|---|---|---|
| Ann  |       | 555-0100 |
| Bob  | bob@example.com |
```

| Name | Email | Phone |
|---|---|---|
| Ann  |       | 555-0100 |
| Bob  | bob@example.com |

Screen readers announce an empty cell as nothing, which is ambiguous. GitLab's accessibility note recommends writing `N/A` or `None` instead of leaving a cell blank in documentation.

## Can you merge cells (colspan or rowspan) in markdown?

No. There is no markdown syntax for merged cells in GFM, CommonMark, Markdown Extra or any mainstream flavour. The only portable fallback is an HTML table, which GitHub and GitLab render because `<table>`, `<td>` and the `colspan` and `rowspan` attributes are on their HTML allowlist:

```html
<table>
  <tr><th colspan="2">Quarter</th></tr>
  <tr><td>Q1</td><td>Q2</td></tr>
</table>
```

Markdown inside an HTML table only renders on GitLab (and only when each markdown line sits on its own line inside the tag); GitHub treats the contents of a raw `<table>` as HTML. Before reaching for HTML, consider whether a merged header is really needed. A second table, a column of repeated values, or a grouped heading above the table are all plain markdown and work everywhere.

## Where do markdown tables render?

Tables render in every code host, note app and static-site generator, and in none of the chat apps. The pattern is consistent enough to memorise:

| App | Pipe tables | Alignment colons | `<br>` in cells | HTML `<table>` |
|---|---|---|---|---|
| GitHub | Yes | Yes | Yes | Yes (sanitised) |
| GitLab | Yes | Yes | Yes | Yes (markdown inside `<td>` too) |
| Obsidian | Yes | Yes | Yes | Yes |
| Notion | Converts on `.md` import; pasted pipes stay text | No | No | No |
| Reddit | Yes (new Reddit and old Reddit) | Yes | No | No |
| Slack | No | No | No | No |
| Discord | No | No | No | No |
| Typora, MkDocs, Docusaurus, Hugo, Jekyll | Yes | Yes | Yes | Yes |

Slack's [formatting reference](https://docs.slack.dev/messaging/formatting-message-text) has no table or list syntax at all, and Discord's [Markdown Text 101](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline) stops at headers, lists, quotes and code. In both, the fallback is a code block (three backticks) so the columns at least line up in monospace. Reddit's [formatting guide](https://support.reddithelp.com/hc/en-us/articles/360043033952-Formatting-Guide) supports pipe tables with alignment and recommends keeping the outer pipes so the table is not misparsed. Notion's [import](https://www.notion.com/help/import-data-into-notion) accepts standard markdown files; inside the editor a pasted `|` grid is plain text, so build the table with `/table`.

## Why is my markdown table not rendering?

Almost every broken table is one of these five problems, in order of frequency:

1. **No blank line above it.** GitHub needs an empty line between a paragraph and the table. Add one.
2. **The delimiter row is missing or short.** Every column needs hyphens in the second line; `|---|` with one column of hyphens under a three-column header leaves two columns unrendered.
3. **An unescaped pipe in a cell.** A `|` inside inline code or a regex splits the cell. Write `\|`.
4. **Mismatched columns.** More cells in a body row than in the header are silently dropped, so data goes missing without an error. Count the pipes in the header.
5. **Wrong renderer.** Slack and Discord do not render tables at all, and Notion does not convert pasted pipes.

Paste the table into the [markdown viewer](/markdown-viewer) to see it with the same GFM rules as GitHub, or rebuild it with the [table generator](/markdown-table-generator), which escapes pipes and pads columns for you.

## How wide can a markdown table be?

There is no limit in the syntax, but there is one in the layout: a table wider than the page scrolls horizontally on GitHub and gets cut off in some docs themes. Keep tables to about six columns and put the longest text in the last column, where wrapping does the least damage. For reference data with many columns, a CSV in a code block or a linked spreadsheet is more readable than a 12-column table nobody can scan.

## What are the best practices for markdown tables?

Keep the outer pipes (they survive every renderer and make the source readable), align numeric columns right with `---:`, escape pipes in cells, avoid empty cells in documentation, and do not use a table for layout. Use a [definition list](/guides/markdown-definition-list) or a bulleted list when there is only one column of values. If you are converting data, start from the [CSV to markdown converter](/csv-to-markdown) rather than typing pipes, and check the result in the viewer before publishing. For the rest of the syntax see the [markdown cheat sheet](/markdown-cheat-sheet).
