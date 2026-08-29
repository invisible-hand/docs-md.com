---
title: Markdown Links — Hyperlink Syntax
h1: How to make a link in markdown
description: Create markdown hyperlinks with [text](url). Titles, reference-style links, linking to headings within a page, bare URLs, and opening in a new tab.
updated: 2026-08-29
related: markdown-image, markdown-code-block
---
To make a hyperlink in markdown, put the link text in square brackets followed immediately by the URL in parentheses:

```markdown
Read the [markdown cheat sheet](https://docs-md.com/markdown-cheat-sheet).
```

No space between `]` and `(` — that gap is the most common reason a link doesn't render.

## How do you link to a section on the same page?

Headings automatically get anchors: lowercase the heading text, replace spaces with hyphens, drop punctuation, and prefix `#`:

```markdown
Jump to [the install steps](#how-do-you-install-it).
```

That's how README tables of contents are built. Renderers differ slightly on edge cases (emoji, duplicate headings get `-1` suffixes), so test long anchors.

## What are reference-style links?

A form that keeps long URLs out of your prose — a label inline, the URL defined anywhere else in the document (conventionally at the bottom):

```markdown
See the [spec][cm] and the [GFM extensions][gfm].

[cm]: https://spec.commonmark.org
[gfm]: https://github.github.com/gfm/
```

Great for documents that cite the same URL repeatedly.

## Do bare URLs become links automatically?

In angle brackets, always: `<https://docs-md.com>`. Pasted bare, it depends on the renderer — GFM autolinks plain URLs, strict CommonMark doesn't. The angle-bracket form is the portable one.

## How do you make a link open in a new tab?

Markdown has no syntax for it — that's an HTML behavior. Where raw HTML is allowed:

```markdown
<a href="https://docs-md.com" target="_blank" rel="noopener">docs-md</a>
```

GitHub strips `target` from READMEs, so links there always open in the same tab; many documentation generators handle external links via config instead.

## Can you add a tooltip to a link?

Yes — an optional quoted title after the URL shows on hover: `[docs](https://docs-md.com "Markdown sharing and tools")`.
