---
title: Markdown Numbered List — Start Number, Restarts and Nesting
h1: How to make a numbered list in markdown
description: Make a numbered list in markdown with 1. 2. 3. or just 1. 1. 1. — renderers auto-number. Start at any number, continue after a paragraph, the 1) form, nested numbering, and the renderers that differ.
updated: 2026-10-15
related: markdown-bullet-points, markdown-nested-list, markdown-indent, markdown-escape-characters, markdown-checkbox, markdown-new-line
---
To make a numbered list in markdown, start each line with a number, a period and a space. The renderer counts for you, so the numbers you type only matter for the first item:

```markdown
1. Clone the repository
2. Install dependencies
3. Run the tests
```

1. Clone the repository
2. Install dependencies
3. Run the tests

Writing `1.` on every line produces the same output and is the form most style guides prefer, because inserting an item never means renumbering the rest. Everything else about ordered lists, starting at 5, restarting after a paragraph, `1)` instead of `1.`, and `1.1` sub-numbering, follows from one rule: only the first number counts.

## Does markdown auto-number a list?

Yes. The [CommonMark spec](https://spec.commonmark.org/0.31.2/#list-items) takes the start number from the first item and ignores the numbers on the rest. `1. 1. 1.`, `1. 2. 3.` and `1. 7. 2.` all render as 1, 2, 3. The HTML output is an `<ol>` whose items are numbered by the browser, which is why you cannot skip a number or write "3a" with markdown alone.

```markdown
1. First
1. Second
1. Third
```

1. First
1. Second
1. Third

GitHub, GitLab, Obsidian, Reddit, Discord and every static-site generator follow this. The one visible exception is the source itself: in an editor or a raw diff, `1. 1. 1.` reads worse than `1. 2. 3.`, which is why some teams number sequentially anyway. Both are correct; pick one per project.

## How do you start a numbered list at a number other than 1?

Write that number on the first item. CommonMark allows any start number from 0 to 999999999 (nine digits), and the list continues from there:

```markdown
5. Fifth step
6. Sixth step
7. Seventh step
```

5. Fifth step
6. Sixth step
7. Seventh step

This renders as `<ol start="5">`. Two renderers ignore it: kramdown (used by Jekyll) states that an ordered list [always starts at 1](https://kramdown.gettalong.org/syntax.html#ordered-lists), and Reddit's [formatting guide](https://support.reddithelp.com/hc/en-us/articles/360043033952-Formatting-Guide) says lists must start at 1 there. Pandoc honours the start number with its `startnum` extension, which is on by default for its markdown input. Negative numbers and leading `+` signs are not list markers anywhere.

## How do you continue a numbered list after a paragraph or code block?

Indent the paragraph or code block to the list item's content column (three spaces under `1. `) and leave the numbering alone. If the paragraph sits at column one, the list ends, and the next `4.` starts a new list, which CommonMark numbers from 4 and most renderers display correctly:

```markdown
1. Download the installer
2. Run it

   The installer asks for an install path.

3. Open the app
```

1. Download the installer
2. Run it

   The installer asks for an install path.

3. Open the app

The unindented version has one trap. A list that *interrupts* a paragraph (no blank line between prose and `1.`) must start at 1; the spec adds this so a sentence ending with "in 2024." on a wrapped line does not become a list. So after a non-indented paragraph, `4. Open the app` only works if there is a blank line between them. With the blank line, GitHub starts a fresh list at 4; without it, the line is plain text. The [nested list guide](/guides/markdown-nested-list) shows the indentation rules for paragraphs, code and quotes inside items in detail.

## Can you use 1) instead of 1. for a numbered list?

Yes. CommonMark accepts a period or a closing parenthesis after the number, and the two forms render identically as `<ol>`. The catch is that changing the delimiter starts a new list, so `1.` followed by `2)` is two lists, not one:

```markdown
1) Period or parenthesis, your choice
2) but use the same one throughout
```

1) Period or parenthesis, your choice
2) but use the same one throughout

Support differs more here than for the period form. Reddit documents the `1)` form as working on new Reddit only, and Pandoc with `fancy_lists` also accepts `(1)`, `a.`, `A.`, `i.` and `#.` markers that no other renderer understands. When in doubt, use `1.`; it has worked in every markdown parser since 2004.

## How do you nest a numbered list (1.1, 1.2)?

Indent the child list three spaces under `1. ` and start it at `1.` again. Markdown has no syntax for hierarchical numbers such as 1.1, 1.2; the child list renders as 1, 2 (or as letters, depending on the stylesheet):

```markdown
1. Setup
   1. Install Node
   2. Install dependencies
2. Build
   1. Run the compiler
```

1. Setup
   1. Install Node
   2. Install dependencies
2. Build
   1. Run the compiler

To show literal `1.1` numbering you have three options: write the numbers into the text of a bulleted list (`- 1.1 Install Node`), use a table with a number column, or add CSS counters on a site you control. GitHub's stylesheet renders nested ordered lists as decimal at every level, so `1. 1. 2.` is what readers see there. Nested ordered lists must start at 1 to be recognised as nested in Pandoc; CommonMark does not require that but starting at 1 is the only choice that renders the same everywhere.

## How do you write a number followed by a period without starting a list?

Escape the period: `2024\. was a good year`. The backslash goes before the period, not the number, as Obsidian's [syntax docs](https://obsidian.md/help/syntax) point out, because `2024.` at the start of a line is the list marker and `\.` breaks it. The same applies to a line that starts with a year or a version number after a hard wrap. Inside a paragraph (not at the start of a line) nothing needs escaping, and in the middle of an existing list a `12.` starting a line is simply the next item.

```markdown
1984\. was published in 1949.
```

1984\. was published in 1949.

The [escape characters guide](/guides/markdown-escape-characters) lists every other character that needs a backslash.

## Where do numbered lists differ between apps?

The syntax is universal; the differences are in start numbers, the `1)` form and how nesting is entered:

| Renderer | `1.` auto-numbers | Start at N | `1)` form | Nested numbering | Source |
|---|---|---|---|---|---|
| GitHub, GitLab | Yes | Yes | Yes | 3-space indent | [GitHub lists](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#lists) |
| Obsidian | Yes | Yes | Yes | Tab or 3 spaces | [Obsidian syntax](https://obsidian.md/help/syntax) |
| Reddit | Yes | No, must start at 1 | New Reddit only | 3 spaces | [Reddit guide](https://support.reddithelp.com/hc/en-us/articles/360043033952-Formatting-Guide) |
| Jekyll (kramdown) | Yes | No, always 1 | No | 4 spaces | [kramdown syntax](https://kramdown.gettalong.org/syntax.html#ordered-lists) |
| Pandoc | Yes | Yes (`startnum`) | Yes, plus letters and roman (`fancy_lists`) | Must start at 1 | [Pandoc manual](https://pandoc.org/MANUAL.html#ordered-lists) |
| Discord | Yes | Not documented | Not documented | 2 spaces, one level | [Discord Markdown 101](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline) |
| Slack | Type `1.` then space to start a list | No | No | Tab key | [Slack formatting](https://slack.com/help/articles/202288908-Format-your-messages) |
| Notion | `1.`, `a.` or `i.` then space | No | No | Tab key | [Notion shortcuts](https://www.notion.com/help/keyboard-shortcuts) |

Slack and Notion are editors, not renderers: typing `1. ` converts the line into a list block, but pasting a markdown list keeps the numbers as text. If you need a list to survive a paste into either, paste one item at a time or use their native list buttons. The [markdown viewer](/markdown-viewer) shows the GitHub rendering of any list before you publish it, and the [cheat sheet](/markdown-cheat-sheet) covers the rest of the syntax.
