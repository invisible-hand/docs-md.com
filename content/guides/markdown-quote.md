---
title: Markdown Blockquote Syntax — How to Quote Text
h1: Markdown blockquote: how to quote text
description: Markdown blockquote syntax: start a line with > to quote text. Multi-line, nested and attributed quotes, Discord/Slack notes, GitHub [!NOTE] callouts.
updated: 2026-09-06
related: markdown-code-block, markdown-indent
---
To quote text in markdown, start the line with a `>` character. The result is called a *blockquote* — the same element HTML renders as `<blockquote>`:

```markdown
> The best way to predict the future is to invent it.
```

> The best way to predict the future is to invent it.

## What is the full markdown blockquote syntax?

Every blockquote form is a line that starts with `>`. The variations only change what follows it:

| You want | Markdown | Works in |
|---|---|---|
| One-line quote | `> text` | Everywhere |
| Multi-paragraph quote | `> para` / `>` / `> para` | Everywhere |
| Nested quote (reply chain) | `>> text` | Everywhere |
| Quote with attribution | `> text` / `>` / `> — Name` | Everywhere |
| List, code or heading inside | `> - item`, `> ## Title` | Everywhere |
| Coloured callout | `> [!NOTE]` | GitHub, Obsidian, some docs tools |
| Literal `>` without quoting | `\>` | Everywhere |

A space after the `>` is optional in CommonMark (`>text` also works) but keep it — some editors and Slack-style chat apps require it.

## How do you add attribution or a citation to a quote?

Markdown has no built-in "cite" syntax. The convention is an em dash line inside the same blockquote, separated by an empty `>` line:

```markdown
> Simplicity is prerequisite for reliability.
>
> — Edsger W. Dijkstra
```

> Simplicity is prerequisite for reliability.
>
> — Edsger W. Dijkstra

If you need a machine-readable source (for a blog engine or a docs site that renders HTML), drop to HTML: `<blockquote cite="https://example.com">…</blockquote>` — but the `cite` attribute is invisible to readers, so keep the visible dash line as well.

## How do you end a blockquote or put two quotes back to back?

A blockquote ends at the first line that doesn't start with `>` **and** isn't a lazy continuation of the previous line. In practice: leave one blank line, then write normal text.

Two quotes separated only by a blank line usually **merge into one** on GitHub and most CommonMark renderers, because the blank line is treated as part of the same quote. To keep them separate, put something between them — a sentence, a heading, or an invisible HTML comment:

```markdown
> First quote.

<!-- -->

> Second quote, rendered as its own block.
```

## Does the > quote syntax work in Discord, Slack and Reddit?

Yes, with small differences:

- **Discord**: `> ` quotes one line; `>>> ` at the start quotes everything after it in the message. Nested `>>` doesn't work. See the [Discord markdown guide](/discord-markdown).
- **Slack**: `> ` at the start of a line quotes that line; `>>> ` quotes the rest of the message. Slack adds the quote bar only in its own message box, not via markdown in code. See the [Slack markdown guide](/slack-markdown).
- **Reddit**: standard `> ` per line; nested `>>` works in the markdown editor.
- **GitHub, GitLab, Obsidian, Notion (`/quote` or `"` + space)**: full CommonMark behaviour as described above.

## How do you show a literal > sign without making a quote?

Escape it with a backslash: `\> not a quote`. Inside a code span or code block a `>` is always literal, so `` `a > b` `` needs no escape either.

## How do you write a multi-line or multi-paragraph quote?

Consecutive `>` lines merge into one blockquote. For multiple paragraphs, put a `>` on the blank line between them too:

```markdown
> First paragraph of the quote.
>
> Second paragraph, same quote.
```

> First paragraph of the quote.
>
> Second paragraph, same quote.

## Can you nest quotes inside quotes?

Yes — stack `>` characters. Standard when quoting a reply chain:

```markdown
> The report is ready.
>> Didn't we agree on Friday?
```

> The report is ready.
>> Didn't we agree on Friday?

## Can a blockquote contain lists, code, or other markdown?

Everything works inside a blockquote — keep prefixing each line with `> `:

```markdown
> Steps to reproduce:
> 1. Open the app
> 2. Run:
> ```bash
> npm test
> ```
```

## What are GitHub's [!NOTE] and [!WARNING] quotes?

GitHub (and some other renderers) turn blockquotes that start with a special marker into colored **callouts/alerts**:

```markdown
> [!NOTE]
> Useful information users should know.

> [!WARNING]
> Critical content demanding attention.
```

The five types are `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, and `[!CAUTION]`. On renderers without the feature they degrade gracefully into a normal quote with the literal marker text.
