---
title: Markdown Line Breaks — New Line Syntax That Works Everywhere
h1: How to make a new line in markdown
description: A single Enter collapses in markdown. Force a line break with two trailing spaces, a backslash or <br>; leave a blank line for a paragraph. Per-app rules for GitHub, Obsidian, Slack, Discord, Notion, and inside tables and lists.
updated: 2026-10-15
related: markdown-table-line-break, markdown-indent, markdown-table, markdown-nested-list, markdown-horizontal-rule, markdown-escape-characters
---
Markdown collapses a single newline into a space: pressing Enter once does **not** start a new line in the output. To force a line break inside a paragraph, end the line with **two spaces** or a **backslash**; to start a new paragraph, leave a **blank line**:

```markdown
Line one ends with two spaces··
Line two is in the same paragraph, on its own line.

A blank line starts a new paragraph.
```

Line one ends with two spaces  
Line two is in the same paragraph, on its own line.

A blank line starts a new paragraph.

(The `··` above stands for two real spaces, which are invisible in the source.) That is the whole of the standard behaviour, defined as soft and hard line breaks in [CommonMark](https://spec.commonmark.org/0.31.2/#hard-line-breaks). The complications are the renderers that treat every newline as a break (GitHub comments, Obsidian by default, chat apps) and the two places where none of the paragraph syntax works: table cells and the first line of a list item.

## What's the difference between a line break and a paragraph?

A line break (`<br>`) keeps the next line inside the same block, with no extra vertical space: an address, a verse, a sign-off. A paragraph (`<p>`) is a new block with a margin above it. Choose by how much separation you want:

| You want | Write | HTML produced |
|---|---|---|
| Next line directly under this one | Two trailing spaces, or `\` at the end of the line | `<br>` inside the same `<p>` |
| A new paragraph with spacing | One blank line | A new `<p>` |
| The lines joined into one | Just press Enter once (in a `.md` file) | Nothing; the newline becomes a space |
| Visible vertical gap, no text | `<br>` on its own line, where HTML is allowed | An empty line's worth of space |

Multiple blank lines in a row are the same as one; markdown has no "double paragraph break".

## Is there an alternative to invisible trailing spaces?

Yes, two. A **backslash** at the end of the line is a CommonMark hard break and, unlike trailing spaces, survives editors and formatters that trim whitespace on save, which is why most style guides prefer it:

```markdown
Line one\
Line two
```

The second alternative is the HTML `<br>` tag, which works wherever inline HTML is allowed and is the only option inside a [table cell](/guides/markdown-table-line-break). Its weakness is the platforms that strip HTML (Slack, Discord, Reddit), where it prints as text. The three forms compared:

| Form | Standard | Survives whitespace trimming | Works in table cells | Works where HTML is stripped |
|---|---|---|---|---|
| Two trailing spaces | CommonMark | No | No | Yes |
| Backslash `\` | CommonMark | Yes | No | Yes |
| `<br>` | HTML | Yes | Yes | No |

In MDX the tag must be self-closing (`<br />`); a bare `<br>` fails the build.

## Why does my new line work on GitHub but not elsewhere?

Because some renderers treat every single newline as a hard break ("soft break as hard break"), and others follow the spec. GitHub does both, depending on where you are typing: its [docs](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#line-breaks) state that in issues, pull requests and discussions a newline renders as a line break, while in `.md` files it does not. So a block of text written in a PR description reflows into one paragraph when pasted into a README. Use explicit breaks (backslash, trailing spaces or `<br>`) and it renders the same everywhere.

## How do you make a new line in Slack, Discord, Notion, Obsidian and the rest?

| App | Line break in the editor | In the source / API | New paragraph | Source |
|---|---|---|---|---|
| GitHub `.md` files | Two spaces, `\`, or `<br>` | Same | Blank line | [GitHub line breaks](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#line-breaks) |
| GitHub issues, PRs, discussions | Enter | A newline is a break | Blank line | Same page |
| GitLab | Two spaces, `\`, or `<br>` | Single newline stays in the paragraph | Blank line | [GitLab line breaks](https://docs.gitlab.com/ee/user/markdown.html#line-breaks) |
| Obsidian | Enter (default); Shift+Enter always | "Strict line breaks" setting off by default, so a newline is a break; on, it follows CommonMark | Blank line | [Obsidian syntax](https://obsidian.md/help/syntax) |
| Notion | Shift+Enter inside a block | Enter creates a new block | Enter | [Notion shortcuts](https://www.notion.com/help/keyboard-shortcuts) |
| Slack | Shift+Enter | `\n` in the message text | Shift+Enter twice | [Slack formatting](https://docs.slack.dev/messaging/formatting-message-text) |
| Discord | Shift+Enter | A newline is a break | Shift+Enter twice | [Discord formatting](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline) |
| Reddit | Enter in the rich editor; two trailing spaces in markdown mode | Single newline collapses in markdown mode | Blank line | [Reddit markdown sheet](/reddit-markdown) |
| Jira Cloud | Shift+Enter | `\\` in legacy wiki markup | Enter | [Jira shortcuts](https://support.atlassian.com/jira-software-cloud/docs/markdown-and-keyboard-shortcuts/) |
| MDX | Two spaces, `\`, or `<br />` | Follows CommonMark | Blank line | [MDX docs](https://mdxjs.com/docs/what-is-mdx/) |
| Pandoc | Two spaces or `\`; `--from markdown+hard_line_breaks` makes every newline a break | Follows CommonMark by default | Blank line | [Pandoc manual](https://pandoc.org/MANUAL.html#extension-hard_line_breaks) |

The [Slack markdown sheet](/slack-markdown), [Discord markdown sheet](/discord-markdown), [Obsidian markdown sheet](/obsidian-markdown) and [Notion markdown sheet](/notion-markdown) cover the rest of each app's syntax.

## How do you add a line break inside a table cell or a list item?

In a table cell, only `<br>` works. A cell must stay on one source line, so trailing spaces and backslashes have nothing to break:

```markdown
| Step | Commands |
|---|---|
| Build | `npm install`<br>`npm run build` |
```

In a list item, a trailing backslash or two spaces breaks the line, and the continuation must be indented to the item's content column (2 spaces for `-`, 3 for `1.`) or it leaves the list:

```markdown
- First line of the item\
  second line of the same item
- Next item
```

A blank line followed by an indented paragraph starts a new paragraph *inside* the item; the [indent guide](/guides/markdown-indent) and [nested list guide](/guides/markdown-nested-list) cover the column rules.

## How do you add extra blank space between paragraphs?

Markdown ignores extra blank lines, so stacking them does nothing. Where HTML is allowed, put `<br>` on its own line between the paragraphs, one per extra line of space; where it is not, there is no way to widen the gap, because the gap belongs to the renderer's stylesheet. A [horizontal rule](/guides/markdown-horizontal-rule) (`---`) is the markdown-native way to mark a larger break between sections, and a heading is usually the better answer if the extra space was meant to signal a new topic. In Pandoc exports to docx or PDF, paragraph spacing is set in the reference document or template, not in the markdown.

## Which line-break syntax should you use?

The backslash, unless the document is going somewhere that treats it as a literal character. It is standard, visible in the source and immune to whitespace trimming. Trailing spaces are the original syntax and still work everywhere CommonMark does, but they are invisible, and markdownlint's MD009 flags them by default (it allows exactly two when configured). `<br>` is for table cells and for docs tools where you also need `<br>` elsewhere. In chat apps none of the three apply; use Shift+Enter.

## Why is my line break not working?

1. **One trailing space, not two.** A single space is a soft break. Use the backslash to avoid counting.
2. **The editor trimmed the spaces.** Most editors strip trailing whitespace on save. Use the backslash.
3. **Inside a table cell.** Only `<br>` works there.
4. **`<br>` where HTML is stripped.** Slack, Discord and Reddit show the tag. Use the app's Shift+Enter.
5. **You are in a code block.** Newlines in code are preserved exactly, and markdown syntax is not parsed, so a `\` is just a backslash.
6. **A backslash before a space.** `\ ` at the end of a line is an escaped space, not a break; the `\` must be the last character.

The [markdown viewer](/markdown-viewer) renders with GitHub's `.md`-file rules, so if the break shows there, it will show in a README. For the full syntax see the [markdown cheat sheet](/markdown-cheat-sheet).
