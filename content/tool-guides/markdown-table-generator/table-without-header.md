---
title: Markdown Table Without a Header Row: What Works
h1: Can you make a Markdown table without a header?
description: Not in GFM: every table needs a header row and a delimiter row. Leave the header cells empty, use an HTML table, or make the first row the header.
tool: markdown-table-generator
updated: 2026-11-03
related: /guides/markdown-table, /markdown-table-generator/merge-cells-in-markdown-table, /guides/markdown-definition-list, /markdown-viewer
---
No, not in GitHub Flavored Markdown: a pipe table must start with a header row followed by a delimiter row of hyphens, or the lines are not a table. The usual workaround is a header row with empty cells, `| | |`, which renders an empty header strip. An HTML `<table>` without `<th>` cells is the only way to get no header.

The requirement is in the syntax itself, so no renderer that follows the GFM specification can skip it. What differs between renderers is how an empty header looks and whether raw HTML is allowed. This page lists the options, which ones we verified today on GitHub and in this site's own viewer, and when a table is the wrong structure in the first place. The [Markdown table syntax guide](/guides/markdown-table) covers the normal case.

## Why does Markdown require a header row?

Because the delimiter row is what tells the parser a table is starting, and the delimiter row is defined as the line under the header. The [GFM specification](https://github.github.com/gfm/#tables-extension-) describes a table as "a single header row, a delimiter row separating the header from the data, and zero or more data rows". Without the delimiter row there is nothing that distinguishes `| a | b |` from a sentence that happens to contain pipes, so the lines stay a paragraph. The spec also requires the header row and the delimiter row to have the same number of cells; when they differ, "a table will not be recognized".

We confirmed both rules on 2026-11-03 by rendering test input through GitHub's Markdown API and through this site's renderer. Two pipe rows with no hyphen line came back as a paragraph with a line break, and a two-cell header over a three-cell delimiter row came back as plain text. Only the body rows are flexible: the spec says rows with fewer cells than the header are padded with empty cells and extra cells are ignored.

## What is the simplest workaround for a headerless table?

Keep the header row but leave its cells empty:

```markdown
|   |   |
|---|---|
| Alpha | 1 |
| Beta  | 2 |
```

|   |   |
|---|---|
| Alpha | 1 |
| Beta  | 2 |

This is valid GFM, and on GitHub and in this site's viewer it renders a table whose first row is an empty header strip; the `<th>` cells are there, they just have nothing in them. Pandoc gives the same advice for its pipe tables: the [Pandoc manual](https://pandoc.org/MANUAL.html#extension-pipe_tables) says "the header cannot be omitted" and "to simulate a headerless table, include a header with blank cells". Putting `&nbsp;` in the header cells changes nothing visible; in our GitHub test it produced a header cell containing a single space.

You cannot hide that strip on GitHub with CSS. GitHub's rendering pipeline sanitises the HTML and, as the [github/markup README](https://github.com/github/markup#github-markup) puts it, aggressively removes inline styles and `class` or `id` attributes, so there is no hook for a stylesheet rule. On your own site, where you control the CSS, a rule such as `thead:empty` or a class added by your build step can hide empty header rows.

## Can you use an HTML table without a header instead?

Yes, where raw HTML is rendered. An HTML table with only `<td>` cells has no header row at all:

```html
<table>
  <tr><td>Alpha</td><td>1</td></tr>
  <tr><td>Beta</td><td>2</td></tr>
</table>
```

<table>
  <tr><td>Alpha</td><td>1</td></tr>
  <tr><td>Beta</td><td>2</td></tr>
</table>

In our GitHub API test this rendered as a table with a body and no header, and the same source renders the same way in this site's viewer. The costs are the usual ones for HTML in Markdown: more typing, no Markdown formatting inside the cells unless the renderer re-parses it, and nothing at all in renderers that strip HTML. The [merged cells page](/markdown-table-generator/merge-cells-in-markdown-table) describes the same trade-off for colspan and rowspan, which also need HTML.

## Can the first data row be the header?

Often it should be. If the first row contains labels such as names or dates, make it the header row by adding the delimiter row under it. Headers are rendered bold and centred by most stylesheets, which is usually what a label row wants anyway. The header can also hold data when the table is a list of pairs: a two-column table of settings and values, for example, reads fine with the first pair in the header position, especially when the rows are not compared against each other.

The one case where this fails is a table where every row is equal and there is no label row, such as a grid of images or a matrix of values. For those, the empty header or the HTML table is the honest answer, and the next section argues that a different structure is often better.

## Is a table the right structure when there is no header?

Usually not. A header is what tells the reader what the columns mean; if there is nothing to say about the columns, the content is probably one of these:

- **Key-value pairs** (term, then explanation). A [definition list](/guides/markdown-definition-list), or a bulleted list with the key in bold, keeps the pairing and works in every renderer.
- **A plain list of items** laid out in columns to save space. Use a list; screen readers and narrow screens both handle it better.
- **A grid of images or badges.** On GitHub, images on one line wrap naturally, so a paragraph of images needs no table.
- **Columns that do have a meaning you have not written down.** Write the header; a one-word label such as "Option" and "Default" helps every reader.

A table earns its borders when a reader compares values across rows. If that is not happening, removing the table removes the header problem with it.

## Which renderers did we verify?

| Renderer | Empty header `\| \| \|` | No delimiter row | HTML table without `<th>` |
|---|---|---|---|
| GitHub (Markdown API, 2026-11-03) | Table with empty header cells | Plain paragraph | Table, body only |
| This site's viewer (remark-gfm) | Table with empty header cells | Plain paragraph | Table, body only |
| GFM specification | Allowed | Not a table | Raw HTML passes through |
| Pandoc pipe tables (manual) | Recommended workaround | Not a table | Rendered as raw HTML in HTML output |

Pandoc's other table syntaxes are the exception to the rule: its [simple tables](https://pandoc.org/MANUAL.html#extension-simple_tables) may omit the header row when the table ends with a line of dashes, with alignment taken from the first body row. That only helps documents that go through Pandoc, since GitHub does not render simple tables.

We did not test GitLab, Obsidian or other editors today. They implement GFM tables and should follow the same rules, but check a headerless table in the actual destination before relying on it. Pasting the table into the [Markdown viewer](/markdown-viewer) shows how a GFM parser reads it.

## How do you build a headerless table quickly?

In the [table generator](/markdown-table-generator), clear the header cells and leave the body as it is. The generator pads every cell to the column width, so an empty header comes out as `|   |   |` over a normal delimiter row, which is exactly the valid form shown above. Pipes inside cells are escaped for you, and column alignment set in the generator still applies, since alignment lives in the delimiter row rather than in the header text. If you later decide the first row should be the header after all, move its values up into the header cells and delete the row.
