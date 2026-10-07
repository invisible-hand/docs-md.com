---
title: Markdown Bullet Points — Bullet List Syntax
h1: Markdown bullet points: how to make a bullet list
description: Markdown bullet points: start a line with -, * or + and a space. Nested bullets, tight vs loose lists, bullets inside quotes and tables, and why a list does not render.
updated: 2026-10-07
related: markdown-indent, markdown-checkbox, markdown-quote, markdown-new-line, markdown-escape-characters
---
To make bullet points in markdown, start each line with a hyphen, asterisk or plus sign followed by a space. All three markers produce the same bullet list:

```markdown
- First point
- Second point
- Third point
```

- First point
- Second point
- Third point

The space after the marker is required: `-First` is just text. Everything else in this guide is a variation: nested bullets (indent the child), numbered lists, blank lines that turn a tight list into a loose one, bullets with several paragraphs or code, and the reasons a bullet list refuses to render. For the same idea with tick boxes, see the [checkbox guide](/guides/markdown-checkbox).

## What is the markdown bullet list syntax?

A markdown bullet list is a run of lines that each begin with `-`, `*` or `+`, then a space, then the item text. The renderer wraps them in an HTML `<ul>` with one `<li>` per line. The full syntax:

| You want | Markdown | CommonMark | GitHub | GitLab | Obsidian | Discord | Slack | Notion | VS Code preview |
|---|---|---|---|---|---|---|---|---|---|
| Bullet with hyphen | `- item` | yes | yes | yes | yes | yes | yes (as typed) | converts to a bulleted block | yes |
| Bullet with asterisk | `* item` | yes | yes | yes | yes | yes | yes | yes | yes |
| Bullet with plus | `+ item` | yes | yes | yes | yes | yes | no | yes | yes |
| Nested bullet | two or more spaces, then `- item` | yes | yes | yes | yes | yes | indent with spaces | Tab | yes |
| Numbered list | `1. item` | yes | yes | yes | yes | yes | yes | yes | yes |
| Task list item | `- [ ] item` | no | yes | yes | yes | no | no | converts | yes |
| Literal bullet character | `\- item` | yes | yes | yes | yes | yes | n/a | n/a | yes |

Discord renders `-` and `*` lists in messages (since its 2023 markdown update); Slack's message box shows its own bullet formatting, and `-` typed at the start of a line followed by a space converts to a bullet in the composer. Support in chat apps changes, so test in yours.

## Which bullet marker should I use: -, * or +?

Use the hyphen. All three are valid in CommonMark and render identically, but the hyphen is the most common, is not confused with emphasis, and is the default of most formatters and linters. The marker matters in only two ways.

- **Changing the marker starts a new list.** In CommonMark, a list item with `-` followed by one with `*` is two separate lists, which can add a gap between them. Pick one marker per list.
- **A `*` at the start of a line can be mistaken for emphasis.** `*word*` is italics; `* word` with a space is a bullet. Spaces decide it.

Markdown linters usually enforce a consistent marker across a file; the [markdown lint tool](/markdown-lint) checks that for you.

## How do you make nested bullet points in markdown?

Indent the child bullet so it lines up under the text of its parent item. In practice that means two to four spaces before the child's marker. The rule in CommonMark is that the child must be indented to the column where the parent's text starts, which is two characters after a `-` and three after `1.`.

```markdown
- Fruit
  - Apple
  - Pear
    - Conference
- Vegetables
```

- Fruit
  - Apple
  - Pear
    - Conference
- Vegetables

Common nesting problems:

- **One space is not enough.** `- parent` followed by ` - child` (one space) is a sibling, not a child, in CommonMark. Use at least two.
- **Tabs.** A tab counts as four columns in CommonMark. It usually works but mixed tabs and spaces are the top cause of lists that render differently in different tools. Use spaces.
- **Ordered lists need three or more spaces.** The child of `1. item` must be indented three spaces to reach the text column.
- **Obsidian and Notion** use Tab to indent a bullet in the editor; the underlying markdown is the same indented hyphen. See the [indent guide](/guides/markdown-indent).

## What is the difference between tight and loose bullet lists?

A tight list has no blank lines between items; a loose list has a blank line between at least two items, and the renderer wraps each item's text in a paragraph, adding visible spacing. Both are the same list.

```markdown
- tight one
- tight two

- loose one

- loose two
```

The catch is that a single blank line anywhere between items makes the whole list loose, in CommonMark and on GitHub. If your bullets suddenly get extra space, look for a stray empty line. Conversely, if you want spacing, put a blank line between every item so the result looks deliberate.

## How do you put several paragraphs, code or a line break inside one bullet?

Indent every continuation line to the same column as the item's text. A blank line followed by an indented paragraph keeps that paragraph inside the bullet:

````markdown
- Install the package.

  Run this from the project root:

  ```bash
  npm install docs-md
  ```

- Start the server.
````

For a line break without a new paragraph, end the line with two spaces or a backslash, or put the next line indented directly below (it joins the same paragraph unless you add the break). The [new line guide](/guides/markdown-new-line) covers the options. A fenced code block inside a bullet must be indented too; a fence at column one ends the list and the numbering or bullets restart afterwards.

## Can you put bullet points inside a blockquote or a table?

Yes in a quote, awkwardly in a table. In a blockquote, prefix each list line with `> `:

```markdown
> Checklist:
>
> - Backups done
> - Tests green
```

In a GitHub-flavoured table, a cell is a single line, so markdown list syntax does not work. The common workaround is the HTML line break and a bullet character: `Item one<br>• Item two`. On GitHub, `<br>` is allowed in table cells; in renderers that strip HTML the cell shows the tags, so use a separate list below the table instead. See the [blockquote guide](/guides/markdown-quote) for quoting.

## How do you make a bullet without list syntax?

Type the Unicode bullet `•` (Option+8 on a Mac) and a space. It is plain text, so it shows in every app, but it is not a real list: no nesting, no wrapping indent, and screen readers do not announce a list. Use it only where list syntax is ignored.

## Why is my markdown bullet list not rendering?

Nearly every failed bullet list is one of these six causes. Check them in order:

1. **No space after the marker.** `-item` and `*item` are text. Add a space.
2. **No blank line before the list.** CommonMark lets a bullet list interrupt a paragraph, but original Markdown.pl and some CMS editors need a blank line before the first item. Add one.
3. **The list is indented four spaces or more.** Four leading spaces make an indented code block. Keep top-level bullets in column one to three.
4. **A tab or odd spacing in nested items**, producing code blocks or flat lists. Convert to spaces.
5. **Different markers in one list**, creating several lists. Use one marker.
6. **The app has no markdown lists.** Slack formats lists only in its composer; WhatsApp supports `- ` and `* ` bullets at line start, but nesting is limited; many plain-text fields show the hyphens as typed.

To see what a renderer does with your list, paste it in the [markdown viewer](/markdown-viewer).

## How do I start a numbered list at a different number?

Write the start number you want on the first item: `5. Fifth thing`. CommonMark uses only the first number to decide where counting begins; the rest increment by one, so `1.` on every line gives 1, 2, 3 and so on. A start number of 0 is allowed. Chat apps usually ignore the start value.

## What are the best practices for bullet points in markdown?

Use hyphens, one marker per list, a space after the marker, two or four spaces per nesting level, and a blank line before and after the list. Keep bullets parallel (all sentences or all fragments), don't nest deeper than three levels, and avoid putting essential content in a table cell's bullet. The [markdown cheat sheet](/markdown-cheat-sheet) lists every other element.
