---
title: Markdown Table Line Break — Multiple Lines in One Cell
h1: How to add a line break in a markdown table cell
description: Put multiple lines in a markdown table cell with <br>. Two-space and backslash breaks do not work in tables. Escaped pipes in inline code, bullets inside cells, and when to switch to an HTML table.
updated: 2026-10-15
related: markdown-table, markdown-new-line, markdown-escape-characters, markdown-bullet-points, markdown-code-block
---
To add a line break inside a markdown table cell, use the HTML `<br>` tag. Every cell must stay on one source line, so the paragraph line-break tricks (two trailing spaces, a backslash) have no effect in a table:

```markdown
| Step | Commands |
|---|---|
| Install | `npm install`<br>`npm run build` |
| Deploy | Push to main<br>Wait for the deploy<br>Check the logs |
```

On GitHub, GitLab, Obsidian, Typora and every docs generator that allows inline HTML, the cell shows the lines stacked. That covers the common need. The rest of this guide handles the cases around it: pipes inside the cell, lists inside the cell, code inside the cell, the renderers that strip `<br>`, and the point at which a markdown table should become an HTML one.

## Why do two trailing spaces not work in a table cell?

Because a table row ends at the end of the line. The [GFM table extension](https://github.github.com/gfm/#tables-extension-) defines a row as a single line split on pipes, and each cell's content is parsed as inline markdown only, so there is no next line for a hard break to join to. A trailing backslash is treated the same way. The HTML `<br>` works because it is an inline element, and inline HTML is allowed inside cells on the platforms that allow it anywhere. The [new line guide](/guides/markdown-new-line) covers breaks in normal paragraphs, where the two-space and backslash forms do apply.

## Which line-break forms work inside a table cell?

Only one of the markdown forms, and only on renderers that pass HTML through:

| Form | In a paragraph | In a table cell | Notes |
|---|---|---|---|
| Two trailing spaces | Yes | No | Spaces are trimmed from cell content |
| Backslash at end of line | Yes | No | Line already ended |
| `<br>` or `<br/>` | Yes | Yes on GitHub, GitLab, Obsidian, Typora, Hugo, Jekyll, MkDocs | Stripped on Reddit, Slack, Discord, Notion |
| Blank line | New paragraph | Ends the table | Nothing after it is in the table |
| Literal newline in the source | Joins lines | Starts a new row (or breaks the table) | Never wrap a cell |

GitLab's docs state the rule directly: cells must stay on a single line in the markdown, and `<br>` is the way to add a line break ([GitLab tables](https://docs.gitlab.com/ee/user/markdown.html#tables)). GitHub's own [table docs](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables) do not cover line breaks, but `br` is on GitHub's HTML allowlist and the tag renders in cells as in prose.

## How do you put a pipe inside a table cell, including in inline code?

Escape it as `\|`. GitHub's docs say to put a backslash before a pipe you want to display, and the GFM spec applies the escape inside code spans in cells too, because the row is split on pipes before the inline code is parsed:

```markdown
| Syntax | Meaning |
|---|---|
| `a \| b` | shell pipe |
| `x \|\| y` | logical or |
| `grep -E "foo\|bar"` | regex alternation |
```

| Syntax | Meaning |
|---|---|
| `a \| b` | shell pipe |
| `x \|\| y` | logical or |
| `grep -E "foo\|bar"` | regex alternation |

The backslash does not appear in the output. If a cell has many pipes (a regex, a shell one-liner), the escapes get hard to read in the source; an HTML entity `&#124;` renders as a pipe on GitHub and GitLab without the backslash, and a code block below the table is often clearer than a cell full of escapes. Outside a table, `\|` shows the backslash in some renderers, so escape only inside cells. The [escape characters guide](/guides/markdown-escape-characters) has the complete list.

## Can you put a bulleted list inside a table cell?

Not with markdown list syntax; the `- ` marker is just text inside a cell. The workable options, in order of portability:

```markdown
| Option | How it renders |
|---|---|
| `• item one<br>• item two` | Bullet characters with `<br>` between them |
| `- item one<br>- item two` | Hyphens show literally on GitHub; GitLab escapes them as `\-` |
| `<ul><li>item one</li><li>item two</li></ul>` | Real list on GitHub, GitLab, Obsidian |
```

The Unicode bullet (`•`, U+2022) with `<br>` is the most reliable: it is plain text plus one tag, it reads correctly as a list, and it degrades to one line in renderers that strip `<br>`. The `<ul>` form gives real list semantics and renders on GitHub because `ul` and `li` are allowed, but a nested `<ul>` inside a `<td>` has no bullet indentation in GitHub's table style, so the result looks the same as the `•` version. A numbered list follows the same pattern with `1.`, `2.` as text. If every row needs a multi-item list, the data is probably two tables or a definition list; see [when to switch to HTML](#when-should-you-switch-to-an-html-table) below.

## Can you put a code block inside a table cell?

No. A fenced code block is a block element and needs its own lines, which a cell does not have. Inline code works (one or more backtick spans per cell, with `<br>` between them for separate lines), so a cell can show two or three short commands:

```markdown
| Task | Command |
|---|---|
| Lint and fix | `npm run lint`<br>`npm run lint -- --fix` |
```

For anything longer than a line or two, put the code in a fenced block under the table and reference it from the cell ("see below"). An HTML table is the only way to get a real `<pre>` block in a cell on GitHub, and even there the content of the `<pre>` is HTML, not markdown, so backticks and language highlighting are lost. The [code block guide](/guides/markdown-code-block) covers fenced blocks and highlighting.

## When should you switch to an HTML table?

When a cell needs a block element: a real list, a paragraph break, a code block, or merged cells. GitHub and GitLab render `<table>`, `<tr>`, `<th>`, `<td>` with `colspan`, `rowspan`, `align` and `valign` attributes, and inside `<td>` you can use `<br>`, `<ul>`, `<pre>`, `<code>` and `<img>`:

```html
<table>
  <tr><th>Option</th><th>Details</th></tr>
  <tr>
    <td><code>--watch</code></td>
    <td>
      Re-runs on change.<br>
      <ul><li>Ignores <code>node_modules</code></li><li>Debounced 300 ms</li></ul>
    </td>
  </tr>
</table>
```

The costs: markdown inside the cells is not parsed on GitHub (GitLab parses it when each markdown line stands alone inside the tag), the source is five times longer, the table is invisible in renderers that strip HTML, and `style` attributes are removed on GitHub so widths and colours do not survive. The decision is usually simple. One `<br>` per cell: stay in markdown. Lists in most cells or any merged header: go to HTML, or split the content into a separate table or a [definition list](/guides/markdown-definition-list). The [markdown table guide](/guides/markdown-table) covers alignment, empty cells and the per-app support table, and the [table generator](/markdown-table-generator) escapes pipes for you.

## Why does my table break when I add a line break?

Three causes account for nearly all of them:

1. **A real newline in the cell.** Wrapping a long cell in the editor splits the row; the second half becomes a malformed row or plain text. Join the line and use `<br>`.
2. **`<br>` inside a code span.** Inside backticks the tag is literal text. Close the code span, add `<br>`, open a new span: `` `one`<br>`two` ``.
3. **The renderer strips HTML.** Reddit, Discord and Slack remove or print the tag (Slack and Discord do not render tables at all). For Reddit, the only option is to keep each cell to one line.

Test in the [markdown viewer](/markdown-viewer): it uses GitHub's table rules, so a table that holds together there will hold on GitHub. For everything else in markdown see the [cheat sheet](/markdown-cheat-sheet).
