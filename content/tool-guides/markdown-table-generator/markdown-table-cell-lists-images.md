---
title: Lists and Images in a Markdown Table Cell: What Works
h1: Can a Markdown table cell contain a list or an image?
description: An image, yes: it is inline content. A real list, no: pipe-table cells cannot hold block elements. The workarounds, and when to change the layout instead.
tool: markdown-table-generator
updated: 2026-10-17
related: /guides/markdown-table, /guides/markdown-table-line-break, /guides/markdown-image, /markdown-to-word/markdown-table-to-word-table
---
An image, yes. A real list, no. In GitHub Flavored Markdown a table cell holds inline content only, and an image is inline, so `![alt](url)` works in a cell. A list is a block element, so `- item` stays literal text. Fake a list with `•` and `<br>`, or use HTML or a different layout.

The rule behind both answers is short. A pipe table is one line per row, and each cell is the text between two pipes on that line. The [GFM specification](https://github.github.com/gfm/#tables-extension-) says the cells contain text "in which inlines are parsed" and that "block-level elements cannot be inserted in a table". Inline means anything that can sit inside a sentence: emphasis, links, inline code, images, line breaks written as HTML. Block means anything that needs lines of its own: paragraphs, lists, fenced code, quotes, headings.

## Which content can go in a Markdown table cell?

Here is the practical split for GitHub, GitLab and most renderers that follow GFM:

| Content | In a pipe-table cell? | How |
|---|---|---|
| Bold, italic, strikethrough | Yes | `**bold**`, `*italic*`, `~~old~~` |
| Links | Yes | `[docs](https://example.com)` |
| Inline code | Yes | `` `npm test` `` (escape any pipe inside with a backslash) |
| Images | Yes | `![logo](logo.png)` |
| Line breaks | Yes, as HTML | `first<br>second` |
| Bulleted or numbered list | No, as Markdown | Fake it with `•` and `<br>`, or use HTML |
| Fenced code block | No | Inline code, or put the block under the table |
| Several paragraphs | No | `<br><br>` gives the look, not the structure |

The details of line breaks, bullet workarounds and code in cells are in [line breaks in a Markdown table cell](/guides/markdown-table-line-break). The rest of this page is about choosing between those workarounds and keeping images readable.

## How do I put an image in a table cell?

Type the normal image syntax into the cell:

```markdown
| Status | Meaning |
|---|---|
| ![passing](img/passing.svg) | All checks green |
| ![failing](img/failing.svg) | At least one check failed |
```

Images in cells follow the same rules as images anywhere else, which the [image syntax guide](/guides/markdown-image) covers in full. Three points matter more inside a table:

- **Size.** Markdown image syntax has no width, and a large image stretches the column. On GitHub, use an HTML tag with a width instead: `<img src="img/screenshot.png" width="120" alt="Settings screen">`. Keep the tag on the same line as the rest of the row.
- **Alt text.** In a table, the alt text often stands in for a whole cell when the image does not load or a screen reader reads the row. Write what the image means, not what file it is.
- **Pipes in URLs.** A literal `|` in an image URL ends the cell. Percent-encode it as `%7C`.

## What is the most reliable way to fake a list in a cell?

Use a bullet character and `<br>` between items: `• Fast<br>• Free<br>• Offline`. It is plain text plus one HTML tag, so it renders wherever `<br>` is allowed and degrades to a single readable line where it is not. Writing `- item` with `<br>` looks similar in the source, but the hyphens show as hyphens and some editors escape them. For a numbered list, type the numbers: `1. Install<br>2. Configure`.

This is the right choice when a few cells need two to four short items. The source stays readable, the table still works in a plain text editor, and the [table generator](/markdown-table-generator) handles it: type the items into a cell with `<br>` between them and the generated Markdown keeps them on one line, with any pipes escaped for you.

## When should I use an HTML table instead?

When the cells need real structure: proper `<ul>` lists, multiple paragraphs, a `<pre>` code block, or merged cells. GitHub and GitLab render HTML tables, and inside `<td>` you can use list tags. The costs are a much longer source, Markdown syntax that GitHub does not parse inside the HTML, and a table that disappears in renderers that strip HTML. The [Markdown table guide](/guides/markdown-table) shows where HTML tables render and where they do not.

If you write for Pandoc rather than GitHub, there is a third option. Pandoc's [grid tables](https://pandoc.org/MANUAL.html#extension-grid_tables) draw the borders with `+`, `-` and `|`, and their cells "may contain arbitrary block elements (multiple paragraphs, code blocks, lists, etc.)":

```markdown
+-----------+--------------------+
| Plan      | Includes           |
+===========+====================+
| Basic     | - 1 project        |
|           | - Email support    |
+-----------+--------------------+
```

GitHub does not render grid tables, so use them only for documents that Pandoc converts, such as Word or PDF output.

## Should the content be a table at all?

Often not. If most cells need a list, the data is usually a list of items with details, and a table squeezes it. Two alternatives read better:

- **Headings with lists under them.** One heading per row of the would-be table, then the list. Long content gets room, and every item can link to its own anchor.
- **A narrow table plus details below.** Keep the table to short comparable values (name, status, version) and move the long text into sections under it.

A good test: if you need `<br>` in more than a third of the cells, change the layout. Tables work best when every cell is a short value a reader compares across rows.

## Can I put a checkbox or task list in a table cell?

Not as an interactive task list. GitHub's `- [ ]` syntax is a list item, so it has the same problem as any other list: inside a pipe-table cell it stays literal text and nothing becomes clickable. For a status column, use characters that read correctly as text, such as `☐` and `☑`, or words like Done and Open, which also sort and search better. If the checkboxes need to be ticked on GitHub, put the task list under the table, one item per row, and reference it from the table.

## Do images and lists in cells survive conversion to Word or PDF?

Images do, when the converter can reach the file. Inline formatting and `<br>` line breaks also come through with converters that parse the Markdown first. HTML tables convert as tables in tools that render HTML, and Pandoc grid tables become Word tables with real lists in the cells. Faked lists stay faked: the `•` characters convert as text. For the full Word workflow see [turning a Markdown table into a Word table](/markdown-to-word/markdown-table-to-word-table).

## Why does my list in a table cell show as dashes?

Because the list marker is not parsed inside a pipe-table cell, so `- item` is the literal text "- item". Nothing is broken; the syntax does not apply there. Replace the hyphens with `•` and join the items with `<br>`, or move the list out of the table.
