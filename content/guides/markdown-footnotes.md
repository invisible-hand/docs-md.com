---
title: Markdown Footnotes — Footnote Syntax and Support
h1: Markdown footnotes: how to add a footnote
description: Markdown footnote syntax: [^1] in the text and [^1]: note at the bottom. Inline ^[note] footnotes, multi-paragraph notes, numbering and which apps support them.
updated: 2026-10-07
related: markdown-superscript, markdown-link, markdown-quote, markdown-escape-characters, markdown-bullet-points
---
To add a footnote in markdown, put a reference like `[^1]` in the text and define the note on its own line elsewhere with `[^1]: The note text.` The renderer shows a small raised number in the text, collects the notes at the bottom of the page and links each back to its reference:

```markdown
Markdown was released in 2004.[^1]

[^1]: John Gruber created it, with help from Aaron Swartz.
```

Footnotes are not part of CommonMark, so they depend on the renderer: GitHub, GitLab, Obsidian, Pandoc and most static-site generators support them, while Discord, Slack and plain CommonMark show the brackets as typed. This page has no live demo, because a rendered footnote adds its own section to the page. The rest of the guide covers the syntax table, inline footnotes, multi-paragraph notes, numbering, footnotes in tables and the fixes for notes that do not render.

## What is the markdown footnote syntax?

A markdown footnote has a reference in the text and a definition anywhere else in the file. The full syntax and where it works:

| You want | Syntax | CommonMark | GitHub | GitLab | Obsidian | Discord | Slack | Notion | VS Code preview |
|---|---|---|---|---|---|---|---|---|---|
| Reference | `text[^1]` | no | yes | yes | yes | no | no | no | no (extension needed) |
| Definition | `[^1]: note text` | no | yes | yes | yes | no | no | no | no (extension needed) |
| Named label | `[^source]` and `[^source]: ...` | no | yes | yes | yes | no | no | no | no (extension needed) |
| Inline footnote | `text^[note text]` | no | no | no | yes | no | no | no | no |
| Multi-paragraph note | indented continuation lines | no | yes | yes | yes | no | no | no | no |
| Footnote in a table cell | reference in the cell | no | yes | yes | yes | no | no | no | no |

Pandoc, Markdown Extra (PHP), MultiMarkdown, kramdown, Typora and Hugo (Goldmark) also support the `[^1]` syntax. VS Code's built-in preview does not render footnotes unless you add an extension such as Markdown Footnotes. Notion has no footnotes in the editor; use a superscript or a link.

## How do you write a basic footnote?

Put `[^label]` immediately after the word or punctuation it refers to, and write the definition as `[^label]: text` on a line by itself. The definition can go directly below the paragraph, at the end of the document or in a block of notes; the renderer always moves it to the bottom of the output:

```markdown
The tool exports to PDF.[^pdf] It also supports Word.[^word]

[^pdf]: Using the browser print engine.
[^word]: Through a docx converter; layout may differ.
```

Put a blank line before the first definition, no space between `[^` and the label, and a space after the colon. The label cannot contain spaces. A reference without a matching definition is shown as plain text, `[^pdf]`, so a typo is easy to spot.

## How are footnotes numbered?

The renderer numbers footnotes in the order they are referenced, not by the labels you wrote. `[^b]` used first becomes footnote 1 and `[^a]` used second becomes footnote 2, whatever their names, and the number shown is generated, not the label text. Two consequences: labels like `[^1]`, `[^2]` do not need to be in sequence in the file, and you can use descriptive names such as `[^gruber-2004]` to keep a long document maintainable. Reusing one label for two references makes both point to the same note, and GitHub displays a note referenced twice with two back-arrows.

## What are inline footnotes?

An inline footnote writes the note right where it is used, as `^[the note text]`, with no separate definition. The note can contain links and emphasis but no blank lines:

```markdown
Markdown has many flavours.^[CommonMark, GFM, Pandoc and others.]
```

Pandoc, Obsidian, Typora and some static-site generators support it; GitHub, GitLab and CommonMark do not, and print the brackets and caret literally. If a document will be viewed on GitHub, use the reference and definition form.

## How do you write a multi-paragraph footnote?

Indent every continuation paragraph of the note by four spaces (or one tab), with a blank line between paragraphs. Code blocks and lists work the same way when indented:

```markdown
The result is stable.[^long]

[^long]: First paragraph of the note.

    Second paragraph, indented four spaces so it stays in the note.

    - a list item inside the note
```

Without the indent, the second paragraph is a normal paragraph and the note ends after the first. GitHub follows this rule too. Keep notes short: readers jump to the bottom and back, and long notes are better as a section.

## Do footnotes work in tables, lists and headings?

References work in table cells and list items; definitions must be at the top level, never inside a table or list. A reference in a table cell such as `| Score[^3] | 5 |` is fine, and the definition goes below the table. Avoid references in headings: they pollute the heading's anchor and any generated table of contents. A definition inside a blockquote or list is not recognised by most renderers.

## Which apps support markdown footnotes?

GitHub, GitLab, Obsidian, Typora, Pandoc, Hugo, Jekyll (kramdown), MkDocs (with an extension), Docusaurus and many blog engines do; CommonMark itself, Discord, Slack, Notion, WhatsApp and VS Code's built-in preview do not. GitHub added footnote support in 2021 for READMEs, issues, pull requests and wikis. In an app without footnotes, fall back to a superscript number and a list of notes at the end, linked with ordinary [markdown links](/guides/markdown-link), or to `<sup>` as in the [superscript guide](/guides/markdown-superscript).

## What is the difference between a footnote, a link and a blockquote citation?

A footnote adds side information or a source without interrupting the sentence; a link sends the reader to another page; a blockquote cites someone's words in place. For a quote with a source, use a quote with a dash line (see the [blockquote guide](/guides/markdown-quote)) or a footnote after it. Use a link when the source is online and short, and a footnote when the note is a sentence or a bibliographic entry.

## Why are my markdown footnotes not working?

Footnotes fail for a small set of reasons. Check them in this order:

1. **The renderer does not support footnotes.** Discord, Slack, CommonMark-only tools and some previews print `[^1]` literally.
2. **No matching definition.** `[^1]` with no `[^1]:` line stays as text. Match the labels exactly, including case.
3. **A space in the label or after `[^`.** `[^ 1]` and `[^note one]` fail. Use a single token.
4. **No blank line before the definitions**, or the definition is indented four spaces so it turns into a code block.
5. **The definition is inside a list, table or quote.** Move it to the top level.
6. **The continuation paragraph is not indented.** Four spaces are needed.
7. **The definition's colon is missing a space** (`[^1]:note`) on stricter parsers.
8. **A markdown-to-PDF or Word converter** drops footnotes in some versions. Pandoc converts them to real footnotes; other converters may leave them at the bottom as plain text.

Paste the text in the [markdown viewer](/markdown-viewer) to compare how GFM treats it, and check the [escape characters guide](/guides/markdown-escape-characters) if you need to print a literal `[^1]`.

## What are the best practices for markdown footnotes?

Use footnotes for sources and side remarks, not for essential content; keep each short; name labels so the file is maintainable; group definitions at the bottom; and do not rely on them in chat or documents that others will open in non-supporting apps. The [markdown cheat sheet](/markdown-cheat-sheet) lists the other syntax that GitHub supports.
