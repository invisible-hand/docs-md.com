---
title: Markdown Indentation — Nested Lists, Paragraphs, Code, Tabs
h1: How to indent in markdown
description: Indentation in markdown is syntax: 2 spaces nests a bullet, 3 nests under 1., 4 spaces makes a code block. Paragraph indents with &nbsp;, continuation lines, tabs vs spaces, and per-app rules.
updated: 2026-10-15
related: markdown-nested-list, markdown-numbered-list, markdown-bullet-points, markdown-code-block, markdown-new-line, markdown-quote
---
In markdown, indentation is syntax, not styling: leading spaces change what an element *is*. Two rules cover most cases. Indent **2 spaces** to nest a list item under a `-` bullet (3 under a `1.` item), and never indent a normal paragraph by 4 or more spaces, because **4 spaces turns text into a code block**.

```markdown
- Parent item
  - Nested item (2 spaces)
    - Deeper (4 spaces total, still inside the list)

1. Numbered parent
   - Nested under a number (3 spaces, under the "N")
```

- Parent item
  - Nested item (2 spaces)
    - Deeper (4 spaces total, still inside the list)

1. Numbered parent
   - Nested under a number (3 spaces, under the "N")

There is no way to indent prose for looks. Everything below is about the cases where indentation decides structure: nested lists, continuation paragraphs, code inside lists, quotes, and the apps that count spaces differently.

## Why did my text turn into a code box?

You indented a line by four or more spaces (or a tab) outside a list. That is the original *indented code block* syntax, kept by [CommonMark](https://spec.commonmark.org/0.31.2/#indented-code-blocks), and it is the single most common markdown accident, usually from text pasted out of an editor or a Word document. Remove the leading spaces. If you actually want code, use a fenced block with three backticks, which cannot be triggered by accident and takes a language tag; the [code block guide](/guides/markdown-code-block) covers it. Inside a list the threshold moves: text is only code if it is indented 4 spaces *beyond* the list item's content column, so 6 spaces under a `- ` bullet is code and 2 is a nested item.

## How many spaces do you need to nest a list item?

Enough to reach the column where the parent item's text starts. That is the CommonMark rule and it is why the number differs by marker:

| Parent marker | Content starts at column | Indent for the nested item | Example |
|---|---|---|---|
| `- ` or `* ` or `+ ` | 2 | 2 spaces | `  - child` |
| `1. ` to `9. ` | 3 | 3 spaces | `   - child` |
| `10. ` to `99. ` | 4 | 4 spaces | `    - child` |
| `100. ` | 5 | 5 spaces | `     - child` |
| `- [ ] ` task | 2 | 2 spaces (the checkbox is content) | `  - [ ] child` |

GitHub's [nested list docs](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#nested-lists) state the same rule: count the characters before the parent's content and indent by that many. Indenting more than needed (up to 3 extra spaces) still works; indenting less puts the item at the parent's level. The [nested list guide](/guides/markdown-nested-list) and [numbered list guide](/guides/markdown-numbered-list) go through mixed and restarted lists.

## How do you indent a paragraph like in Word?

You cannot. Markdown has no first-line indent, margin or tab-stop concept; visual indentation is the renderer's stylesheet's job. The workarounds, from most to least portable:

```markdown
> A blockquote is the only markdown construct that visibly indents prose.

&nbsp;&nbsp;&nbsp;&nbsp;Four non-breaking spaces fake a first-line indent where HTML entities pass through.

<p style="margin-left: 2em">Margin via CSS, where style attributes are allowed (not GitHub).</p>
```

The [blockquote](/guides/markdown-quote) is honest markdown and works everywhere, but it adds a bar and italic or grey styling in most themes. `&nbsp;` renders on GitHub, GitLab, Obsidian and docs generators, and prints literally in Slack and Discord. A styled `<p>` only works where CSS survives, which excludes GitHub and GitLab. For a document that needs real typographic indents, write it in markdown and apply the indent in the export tool (Pandoc's reference docx, a site stylesheet) rather than in the source.

## How do you keep a second paragraph inside a list item?

Indent the continuation paragraph to the item's content column and leave a blank line before it:

```markdown
1. First step

   This paragraph belongs to step 1 (3 spaces, under the "F").

   > So does this quote.

2. Second step
```

For `1.` lists that is 3 spaces; for `-` bullets it is 2. Misaligned, the paragraph either escapes the list (too few spaces, and the next number restarts at 1) or becomes a code block (4 spaces past the column). The same rule applies to any block inside an item: a nested list, a quote, a table or a code fence.

## How do you put a code block inside a list item?

Indent the fence lines and the code to the item's content column:

````markdown
1. Install the package:

   ```bash
   npm install example
   ```

2. Run it.
````

The fence keeps the code's own indentation intact relative to the fence. GitHub's docs note that a *non-fenced* code block inside a list must be indented eight spaces (four for the list, four for the code), which is one more reason to prefer fences. Leaving the fence at column 0 ends the list and the next `2.` restarts numbering.

## Should you indent with tabs or spaces?

Spaces. CommonMark treats a tab as advancing to the next multiple of four columns, which silently over-indents nested bullets (a tab under `- ` lands at column 4, not 2) and triggers code blocks in paragraphs. Editors also display tabs at different widths, so a file that looks right in one editor nests differently in another. markdownlint's rule MD010 flags hard tabs and every mainstream style guide defaults to spaces. Set the editor to insert spaces for `.md` files, and 2 as the tab width if most of your lists use `-`.

## How does indentation differ per app?

| App | Nest a list | Code block by indent | `&nbsp;` indent | Notes |
|---|---|---|---|---|
| GitHub, GitLab | Align with parent content (2 for `-`, 3 for `1.`) | 4 spaces outside a list | Yes | Standard CommonMark/GFM |
| Obsidian | Tab or spaces; `Tab` / `Shift+Tab` indent selected items | 4 spaces | Yes | [Obsidian syntax](https://obsidian.md/help/syntax); the editor inserts a tab by default, which Obsidian itself renders correctly |
| Notion | `Tab` key nests a block; typed spaces do nothing | None (use `/code`) | No | Markdown import keeps nesting from indentation |
| Discord | Spaces before `-` nest one level | None (use fences) | No | [Discord Markdown Text 101](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline) |
| Slack | No list syntax | None (use fences) | No | Fake nesting with Unicode bullets and spaces |
| Reddit | 4 spaces (old Reddit's parser); 2 usually works in the new editor | 4 spaces on old Reddit; fences on new | No | Use 4 to be safe |
| Jira Cloud | `Tab` in the editor; `**` for a second-level bullet in legacy wiki markup | `{code}` macro in wiki markup | No | [Jira shortcuts](https://support.atlassian.com/jira-software-cloud/docs/markdown-and-keyboard-shortcuts/) |
| MDX | Same as CommonMark | **Not supported**: indented lines are paragraphs | Yes | [MDX docs](https://mdxjs.com/docs/what-is-mdx/); use fences |
| Pandoc | Align with parent content; 4 spaces always safe | 4 spaces | Yes | [Pandoc manual](https://pandoc.org/MANUAL.html#lists) |

The [Obsidian](/obsidian-markdown), [Notion](/notion-markdown) and [Discord](/discord-markdown) sheets have each platform's full list behaviour.

## How do you indent a blockquote or nest one?

Quotes do not use spaces; they use the `>` prefix, and nesting is another `>`:

```markdown
> Outer quote
>
> > Nested quote
>
> Back to the outer level
```

Spaces after `>` are optional (up to one is swallowed), and a line indented 4 spaces after the `>` is a code block inside the quote. Lists inside quotes use the same spacing as lists anywhere, counted after the `> `. The [blockquote guide](/guides/markdown-quote) covers multi-paragraph and lazy continuation lines.

## Why is my nested list not rendering?

1. **Too few spaces.** Two spaces under a `1.` item is not enough; the content column is 3.
2. **A tab that expanded to 4.** Under a `- ` bullet that is 2 spaces too many, which some renderers accept and others turn into a code block. Replace tabs with spaces.
3. **No blank line before the list.** Some renderers (and GitHub, when the list follows a paragraph without a blank line in a `.md` file) treat the first `-` as part of the paragraph.
4. **Mixed markers at one level.** Switching from `-` to `*` starts a new list, which looks like a broken one.
5. **The app has no nesting.** Slack has no lists at all; Notion ignores typed spaces and wants the Tab key.

Paste the list into the [markdown viewer](/markdown-viewer) to see how a GFM parser reads the indentation, or run it through the [markdown formatter](/markdown-formatter), which rewrites list indentation to the standard columns. For the rest of the syntax see the [markdown cheat sheet](/markdown-cheat-sheet).
