---
title: Markdown Underline — What Actually Works
h1: How to underline text in markdown
description: Markdown has no underline syntax; underscores make italics. Use HTML <u> or <ins> tags where allowed, and see what works on GitHub, Discord, and Slack.
updated: 2026-08-29
related: markdown-strikethrough, markdown-center-text
---
Markdown has **no native underline syntax** — that's by design, because on the web underlined text looks like a link. Wrapping text in `_underscores_` gives you *italics*, not an underline. Where inline HTML is allowed (GitHub READMEs, most static site generators), use the `<u>` tag:

```markdown
This is <u>underlined</u> with HTML.
```

## Why doesn't markdown have underline?

Markdown was designed to mirror plain-text email conventions and compile to clean HTML. Underline was deliberately left out: readers confuse underlined text with hyperlinks, so typographic convention on the web reserves underline for links and uses *italics* or **bold** for emphasis. If your goal is emphasis, those are the portable, semantic choices.

## What HTML tags underline text?

Two, with different meanings:

```markdown
<u>stylistic underline</u>
<ins>inserted text — renders underlined in most browsers</ins>
```

`<u>` is purely visual. `<ins>` means "this text was added" (the counterpart of `<del>`) and browsers underline it by default. GitHub allows both in READMEs, issues, and comments. Renderers that sanitize HTML away (many chat apps, some wikis) will show the tags as literal text — there is no plain-markdown fallback.

## How do you underline in Discord or Slack?

- **Discord** supports underline with its own syntax: double underscores, `__like this__`. (In real markdown, double underscores mean **bold** — don't mix the two up.)
- **Slack** has no underline at all — its `_underscores_` are italics, and HTML isn't rendered.

## What about underlining headings?

Markdown's "setext" heading style puts `===` or `---` under a line of text, which *looks* like underlining in the source but just creates an H1 or H2 — the rendered output isn't underlined. It only covers two heading levels, so the `#` prefix style is generally preferred.
