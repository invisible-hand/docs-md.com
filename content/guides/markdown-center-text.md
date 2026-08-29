---
title: Center Text in Markdown — HTML Methods
h1: How to center text in markdown
description: Markdown has no centering syntax — use <div align="center"> or <p align="center"> where HTML is allowed, like GitHub READMEs. Centering images, headings, and tables.
updated: 2026-08-29
related: markdown-underline, markdown-image
---
Markdown itself **cannot center text** — it has no alignment syntax at all. Where inline HTML is allowed (GitHub READMEs, most documentation generators), wrap the content in a centering tag:

```markdown
<div align="center">
This text is centered.
</div>
```

## What's the most compatible way to center on GitHub?

The old-school `align` attribute, not CSS. GitHub sanitizes `style=` attributes away, so `<div style="text-align: center">` does **nothing** there — but the legacy `align="center"` attribute survives:

```markdown
<p align="center">
  <img src="logo.png" alt="Project logo" width="200">
</p>
```

That pattern — a centered logo, then centered badge row — opens half the popular READMEs on GitHub.

## Can you center a heading?

Yes, with the same attribute directly on a heading tag, since markdown headings can't take attributes:

```markdown
<h1 align="center">Project Name</h1>
```

The tradeoff: HTML headings don't get automatic anchor links in some renderers, and markdown inside HTML blocks isn't always processed (on GitHub, markdown inside a `<div>` only renders if you leave blank lines around it).

## Can you center table columns?

Table *columns* are the one thing markdown can align natively — put colons on both sides of the divider row:

```markdown
| Left | Center | Right |
| :--- | :----: | ----: |
| a    |   b    |     c |
```

| Left | Center | Right |
| :--- | :----: | ----: |
| a    |   b    |     c |

Our [markdown table generator](/markdown-table-generator) sets these alignment colons for you.

## Why doesn't centering work in my renderer?

Renderers that strip raw HTML (many chat apps, comment systems, and strict-mode processors) drop the tags entirely, and there is no markdown fallback. If the document targets one of those, centering simply isn't available — restructure instead (e.g., a heading or a one-cell centered table).
