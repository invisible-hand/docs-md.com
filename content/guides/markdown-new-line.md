---
title: Markdown Line Breaks — New Line Syntax
h1: How to make a new line in markdown
description: Single newlines collapse in markdown. Force a line break with two trailing spaces or a backslash, or leave a blank line for a new paragraph. Renderer differences explained.
updated: 2026-08-29
related: markdown-indent, markdown-comment
---
Markdown collapses a single newline into a space — pressing Enter once does **not** start a new line in the output. To force a line break, end the line with **two spaces**, or leave a **blank line** to start a new paragraph:

```markdown
Line one with two trailing spaces··
Line two, same paragraph.

A blank line starts a new paragraph.
```

## What's the difference between a line break and a paragraph?

- **Two trailing spaces** produce a `<br>` — the next line hugs the previous one (an address, a poem, a sign-off).
- **A blank line** produces a new `<p>` — with visible vertical spacing between the blocks.

Choose by how much visual separation you want.

## Is there an alternative to invisible trailing spaces?

Yes — a **backslash at the end of the line** is a CommonMark-standard line break and, unlike trailing spaces, survives editors that trim whitespace on save:

```markdown
Line one\
Line two
```

You can also write `<br>` directly wherever inline HTML is allowed; it's the only way to force a break *inside a table cell*.

## Why does my new line work on GitHub but not elsewhere?

Some renderers treat every single newline as a real break ("soft break as hard break" mode): GitHub *comments and issues* do this, as do Discord, Reddit, and many note apps. But GitHub *README files*, standard CommonMark, and most static site generators collapse single newlines. That asymmetry is why text written in one place reflows in another — use explicit breaks (trailing spaces, backslash, or `<br>`) and it renders the same everywhere.

## How do you add extra blank space between paragraphs?

Multiple blank lines collapse into one paragraph break — markdown ignores the extras. To force more vertical space, insert `<br>` on its own lines between paragraphs, or use spacing controls if the target supports them (CSS, LaTeX). A markdown-only document has no "double blank line" concept.
