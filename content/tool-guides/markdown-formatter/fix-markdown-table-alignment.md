---
title: How to Align a Markdown Table So the Columns Line Up
h1: How do I align a markdown table so the columns line up?
description: Pad every cell to its column's widest entry so the pipes line up. Do it by hand, with an md formatter, or with Prettier. Colons only set text alignment.
tool: markdown-formatter
updated: 2026-10-20
related: /guides/markdown-table, /markdown-table-generator, /markdown-formatter/format-markdown-with-prettier, /markdown-table-generator/sort-markdown-table
---
Pad each cell with spaces to the width of the widest cell in its column, and make the dashes in the delimiter row the same width. Then every pipe sits in the same position on every line. A formatter does this automatically: paste the table into a markdown formatter or run Prettier, and the source comes back aligned.

Alignment in the source is purely for people reading the raw file. Renderers ignore the extra spaces: a table with ragged pipes and the same table with perfect columns produce identical HTML. That is also why aligning a table is safe to automate. A formatter that parses the table and prints it back can only change whitespace, not content.

## What does an aligned markdown table look like?

Every row has the same length and the pipes form straight vertical lines. Here is a table as people usually type it, and the same table after one pass through our [Markdown Formatter](/markdown-formatter):

```markdown
|Name|Score|Notes|
|:---|---:|:-:|
|Ada|99|first|
|Grace Hopper|7|x|
```

```markdown
| Name         | Score | Notes |
| :----------- | ----: | :---: |
| Ada          |    99 | first |
| Grace Hopper |     7 |   x   |
```

Both render as the same three-column table. The second one shows the formatter doing two separate jobs. It pads the cells so the pipes line up, and it pads each cell on the side that matches the column's text alignment, so right-aligned numbers sit flush right in the source too. The delimiter row is stretched to the column width with the colons kept in place.

## How do the colons in the separator row affect alignment?

The colons set how text is aligned inside each column when the table is rendered; they do not line up the source. Per the GitHub Flavored Markdown spec, `:---` is left-aligned, `---:` is right-aligned and `:---:` is centred, and a delimiter with no colons leaves alignment to the renderer's default, which is usually left ([GFM spec, Tables](https://github.github.com/gfm/#tables-extension-)).

This is the most common confusion behind the question. Someone adds `:---:` hoping the raw file will look tidy, and nothing in the source changes. Two different things are called "alignment": text alignment inside rendered cells, set by colons, and vertical alignment of pipes in the source, set by padding. You usually want both: colons for how readers see the table, padding for how editors see the file. The [markdown table guide](/guides/markdown-table) covers the colon syntax with more examples.

## How do I align a table automatically?

Use a tool that parses tables rather than one that counts pipes. Three options, from no setup to fully automatic:

1. **In the browser.** Paste the document into the [Markdown Formatter](/markdown-formatter). Every table in it is reprinted aligned, along with the rest of the file. If you are building a new table rather than fixing one, the [Markdown Table Generator](/markdown-table-generator) produces aligned output from a grid you fill in.
2. **With Prettier.** `npx prettier --write table.md` aligns every table in the file. Prettier keeps tables aligned unless you set `proseWrap` to `never` and the aligned table is wider than `printWidth`; then it prints a compact table instead. See [How do I format markdown files with Prettier?](/markdown-formatter/format-markdown-with-prettier).
3. **In your editor.** In VS Code, the Prettier extension does this on Format Document. Some markdown extensions also offer a table formatting command; check the extension's own documentation for the exact name.

Any of these makes an md formatter part of your workflow, so you never align tables by hand again. Doing it by hand is fine for a three-row table and miserable for a twenty-row one, where adding one long cell means re-padding the whole column.

## Why do my columns still look misaligned after formatting?

Usually because of characters that are wider or narrower on screen than their count suggests. The common causes:

- **CJK characters and emoji.** In a monospaced font, a Chinese, Japanese or Korean character usually takes two columns, and most emoji also display wide. A formatter that counts characters will under-pad these cells. We tested this: our browser formatter counts characters, so a cell containing `東京` comes out two spaces short, while Prettier measures display width and aligns the same table correctly. If your tables contain CJK text, use Prettier for them.
- **A proportional font.** Alignment only works in monospaced fonts. If your editor, or a website showing raw markdown, uses a proportional font, no amount of padding will line the pipes up.
- **Tabs.** A tab character inside a cell is rendered at a width your editor decides. Replace tabs with spaces.
- **Escaped pipes and inline markup.** A cell containing `a \| b` or `[link](https://example.com)` is padded by its source length, which is correct for the source but means the rendered column widths look nothing like the source widths. That is expected.

## Does an aligned table render differently from an unaligned one?

No. The outer pipes, the padding and the number of dashes in the delimiter row are all optional in the GFM spec, so these two tables render identically:

```markdown
a|b
-|-
1|2

| a | b |
| - | - |
| 1 | 2 |
```

What does matter for rendering is that the header row and the delimiter row have the same number of cells, and that a blank line separates the table from a preceding paragraph, which several renderers need to recognise the table at all. A table that does not render at all is a syntax problem, not an alignment problem; a linter such as [Markdown Lint](/markdown-lint) is the better tool for finding it.

## Should I keep markdown tables aligned in a repository?

Keep them aligned if people read the raw files, and let a tool do it. Aligned tables are much easier to read in a terminal, in a pull request diff and in an editor without preview. The cost is diff noise: when one long value is added, every row of that column gets new padding, so a one-cell change shows as a change to every line of the table.

Some teams accept the noise in exchange for readability. Others choose compact tables with a single space around each cell, which markdownlint's MD060 rule calls the `compact` style, and enforce that instead. Either choice works if a formatter applies it consistently. What does not work is a mix: hand-aligned tables that drift out of alignment the first time someone edits them without a formatter.

If you only need a one-off fix, paste the table into the formatter, copy it back, and move on. If tables change often, run Prettier in CI with `--check` so misaligned tables are caught before merge.
