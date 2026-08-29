---
title: Markdown Comments — Hide Text From Output
h1: How to write a comment in markdown
description: Markdown has no comment syntax, but HTML comments <!-- like this --> stay hidden in rendered output. Where they leak, and truly invisible alternatives.
updated: 2026-08-29
related: markdown-new-line, markdown-code-block
---
Markdown has no comment syntax of its own, but since markdown passes HTML through, an **HTML comment** stays out of the rendered page:

```markdown
Visible text.
<!-- This is a comment — readers won't see it. -->
More visible text.
```

## Are HTML comments really hidden?

Hidden from the *rendered* view, yes — GitHub, GitLab, and virtually every renderer omit them from output. But they remain in the **source**: anyone viewing the raw file, the page's HTML source in some generators, or a git diff will see them. Never put secrets in markdown comments.

Two practical uses where they shine:

- **Notes to future editors** — `<!-- TODO: update screenshot after v2 -->`
- **Issue/PR template instructions** on GitHub — template text authors should replace is wrapped in comments so it never shows in the rendered issue.

## Is there a comment that doesn't reach the HTML at all?

A widely-cited trick abuses link reference definitions, which produce no output:

```markdown
[//]: # (This never appears in the rendered output or the HTML)
```

The target `#` and the "text" in parentheses are just a dummy link definition that's never referenced. It needs blank lines around it and chokes on unbalanced parentheses — HTML comments are the more robust default.

## Do comments work everywhere?

No. Renderers that strip or escape raw HTML show the comment as literal text — Discord and Slack display `<!-- ... -->` verbatim. Comments are a feature of document markdown (READMEs, docs sites, static blogs), not chat markdown.

## Can you comment out a block of markdown temporarily?

Yes — an HTML comment can span many lines, which is handy for parking a draft section:

```markdown
<!--
## Old section
This whole block is disabled until we need it again.
-->
```

One catch: the block must not itself contain `-->`, and content inside indented code blocks that *looks* like a comment won't be treated as one.
