---
title: Markdown Indentation — Lists, Paragraphs, Code
h1: How to indent in markdown
description: Indentation in markdown is syntax, not styling: 2 spaces nests lists, 4 spaces makes a code block. Indent paragraphs, continue list items, avoid tabs.
updated: 2026-08-29
related: markdown-new-line, markdown-checkbox
---
In markdown, indentation is **syntax, not styling** — leading spaces change what an element *is*. Two rules cover most cases: indent **2 spaces** to nest a list item under a `-` bullet, and never indent a normal paragraph by 4+ spaces, because **4 spaces turns text into a code block**.

```markdown
- Parent item
  - Nested item (2 spaces)
    - Deeper (4 spaces total)
```

- Parent item
  - Nested item (2 spaces)
    - Deeper (4 spaces total)

## Why did my text turn into a code box?

You indented a line by four or more spaces (or a tab) outside a list — that's the classic *indented code block* syntax from original markdown. It's the single most common markdown formatting accident, especially in text pasted from an editor. Remove the leading spaces, or if you actually want code, prefer explicit fenced blocks (see the [code block guide](/guides/markdown-code-block)).

## How do you indent a paragraph like in Word?

You can't — markdown has no first-line indent or margin control. Visual indentation is the renderer's stylesheet's job. If you truly need an indented block of prose, the conventional workarounds are a blockquote (`> text`) or, where HTML is allowed, non-breaking spaces (`&nbsp;`) or a wrapping element with styling.

## How do you keep a second paragraph inside a list item?

Indent the continuation to align with the item's *text*, and leave a blank line:

```markdown
1. First step

   This paragraph belongs to step 1 (3 spaces, aligning under "First").

2. Second step
```

For `1.` ordered lists that's 3 spaces; for `-` bullets it's 2. Misalign it and the paragraph either escapes the list or becomes a code block.

## Should you indent with tabs or spaces?

Spaces. CommonMark treats a tab as four spaces, which silently over-indents nested lists and triggers accidental code blocks, and editors display tabs inconsistently. Every markdown style guide and linter defaults to spaces.
