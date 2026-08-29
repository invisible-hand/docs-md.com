---
title: Markdown Blockquotes — Quote Syntax
h1: How to quote text in markdown
description: Quote text in markdown by starting lines with >. Multi-line and nested blockquotes, quoting code and lists, and GitHub callouts like [!NOTE] explained.
updated: 2026-08-29
related: markdown-code-block, markdown-indent
---
To quote text in markdown, start the line with a `>` character (a *blockquote*):

```markdown
> The best way to predict the future is to invent it.
```

> The best way to predict the future is to invent it.

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
