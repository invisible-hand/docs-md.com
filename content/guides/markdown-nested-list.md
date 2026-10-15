---
title: Markdown Nested List — Indentation Rules That Actually Work
h1: How to nest lists in markdown
description: Nest a markdown list by indenting the child item to where the parent's text starts: 2 spaces under -, 3 under 1., 4 under 10. CommonMark rule, mixed lists, paragraphs and code in items.
updated: 2026-10-15
related: markdown-bullet-points, markdown-numbered-list, markdown-indent, markdown-checkbox, markdown-code-block, markdown-new-line
---
To nest a list in markdown, indent the child item so its marker lines up with the first character of the parent item's text. Under a `- ` bullet that is two spaces; under `1. ` it is three; under `10. ` it is four:

```markdown
- Fruit
  - Apple
  - Pear
    - Conference
1. First step
   1. Sub-step
   2. Sub-step
```

- Fruit
  - Apple
  - Pear
    - Conference
1. First step
   1. Sub-step
   2. Sub-step

"Two spaces" and "four spaces" are both folk rules, and both are wrong often enough to matter. The real rule is relative to the parent marker, and once you know it nesting stops being trial and error.

## How many spaces do you indent a nested list in markdown?

As many as it takes to reach the parent item's content, plus zero or more. The [CommonMark spec](https://spec.commonmark.org/0.31.2/#list-items) defines a list item as a marker of width W followed by 1 to 4 spaces N, and says the item's content (including any sublist) must be indented W + N columns. Any line indented less than that is not part of the item.

| Parent line | Marker width + space | Child indent | Example child |
|---|---|---|---|
| `- Item` | 1 + 1 | 2 spaces | `  - Child` |
| `* Item` or `+ Item` | 1 + 1 | 2 spaces | `  * Child` |
| `1. Item` | 2 + 1 | 3 spaces | `   1. Child` |
| `10. Item` | 3 + 1 | 4 spaces | `    - Child` |
| `100. Item` | 4 + 1 | 5 spaces | `     - Child` |
| `-   Item` (3 spaces after marker) | 1 + 3 | 4 spaces | `    - Child` |

Indenting more than the content column is fine as long as the extra is fewer than four spaces; four or more extra turns the line into an indented code block. That is why "four spaces under a bullet" works (2 needed, 2 extra) but "four spaces under `100.`" does not (5 needed). GitHub's [nested list docs](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#nested-lists) say the same thing in plain words: count the characters before the parent's content and type that many spaces, and each deeper level needs at least two more.

## Does 2-space or 4-space indentation work in every renderer?

Two spaces under a bullet works in every CommonMark-based renderer (GitHub, GitLab, Obsidian, Discord, Reddit, Docusaurus, MkDocs, Hugo). Four spaces also works under bullets in all of them and is the safer choice for ordered lists and for older engines. The ones that differ are the non-CommonMark parsers:

| Renderer | Bullet child | Ordered child | Tabs | Notes |
|---|---|---|---|---|
| GitHub, GitLab | 2+ spaces | 3+ spaces | Yes (tab = 4 columns) | CommonMark rule exactly |
| Obsidian | 2+ spaces | 3+ spaces | Yes (Tab key indents) | Any list type can nest under any other ([Obsidian syntax](https://obsidian.md/help/syntax)) |
| Reddit | 2+ spaces | 3+ spaces | Yes | Per the [Reddit formatting guide](https://support.reddithelp.com/hc/en-us/articles/360043033952-Formatting-Guide) |
| Discord | 2 spaces | 2 spaces | No | One documented level ([Discord Markdown 101](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline)) |
| Slack | Tab key only | Tab key only | Key, not syntax | No markdown list syntax ([Slack formatting](https://docs.slack.dev/messaging/formatting-message-text)) |
| Python-Markdown, Jekyll (kramdown) | 4 spaces | 4 spaces | Yes | Original markdown's 4-space rule; 2 spaces may not nest |
| Notion | Tab key | Tab key | Key, not syntax | Markdown shortcuts create items; nesting is done with Tab |

If a document has to render in all of these, indent with four spaces and keep ordered lists under ten items so `1.` through `9.` all share the same three-column content start.

## Can you mix ordered and unordered lists when nesting?

Yes, any combination. A bulleted list can sit under a numbered item and the other way round, and CommonMark treats a change of marker at the same level as a new list rather than an error:

```markdown
1. Install
   - macOS: `brew install tool`
   - Linux: `apt install tool`
2. Configure
   1. Copy the sample file
   2. Edit the path
```

1. Install
   - macOS: `brew install tool`
   - Linux: `apt install tool`
2. Configure
   1. Copy the sample file
   2. Edit the path

Two things to keep consistent. Use the same bullet character at one level: switching from `-` to `*` halfway starts a second list, which usually shows as a visible gap. And start every nested ordered list at `1.`; the parent list's numbering does not carry down, so there is no native way to get `1.1`, `1.2` numbering without CSS (see the [numbered list guide](/guides/markdown-numbered-list)).

## How do you put a paragraph or a code block inside a list item?

Indent it to the item's content column, with a blank line before it. A second paragraph in a bullet needs two spaces of indentation; a fenced code block needs its fence lines indented too:

````markdown
1. Run the installer:

   ```bash
   ./install.sh --prefix=/opt
   ```

   The script prints the install path when it finishes.

2. Reboot.
````

1. Run the installer:

   ```bash
   ./install.sh --prefix=/opt
   ```

   The script prints the install path when it finishes.

2. Reboot.

Blank lines between the parts of an item make the list *loose*, which means every item is wrapped in a paragraph and gets extra vertical spacing. That is expected; it is how CommonMark distinguishes a one-liner list from a list of mini-sections. If the code block appears outside the list and the numbering restarts at 1 afterwards, the fence was not indented far enough.

## Why does my nested list not render?

Check these in order; one of them is almost always the cause:

1. **Too little indentation.** `1. Item` followed by `  - child` (two spaces) is not nested, because the parent's content starts in column 3. Use three spaces.
2. **Too much indentation.** Eight spaces under a bullet (2 needed + 6 extra) becomes an indented code block and prints the dash literally. Stay within three extra spaces.
3. **Mixed tabs and spaces.** CommonMark expands a tab to the next multiple of four columns, so a tab under `- ` nests, but a tab under `1. ` is one column short of a second level. Pick spaces and let the editor convert tabs.
4. **A blank line before the first child.** It is allowed in CommonMark, but it makes the list loose and some older renderers (and Discord) break the nesting on it. Remove it unless you want the spacing.
5. **The renderer needs four spaces.** Jekyll with kramdown and Python-Markdown follow the original four-space rule; two spaces give a run-on paragraph instead of a sublist.

The [markdown viewer](/markdown-viewer) renders with GitHub's rules, so if a list nests there and not in your app, the difference is the app, not the syntax.

## How deep can you nest markdown lists?

There is no limit in the spec; renderers stop at whatever the stylesheet styles. GitHub styles bullets as disc, circle, square and then repeats; beyond three levels the indentation keeps growing but the markers stop changing. Discord documents a single level of nesting and Slack offers a few via the Tab key. For readability, three levels is the practical maximum: a fourth level usually means the content wants headings, a table or its own section instead of deeper bullets.

## Can you nest a checklist or a blockquote inside a list?

Yes, both follow the same content-column rule. A task list item (`- [ ] text`) can be a child of any list on GitHub, GitLab and Obsidian, and a blockquote inside an item needs its `>` indented to the content column:

```markdown
- [ ] Release
  - [x] Tag the commit
  - [ ] Write the notes
    > Keep it to five bullets.
```

- [ ] Release
  - [x] Tag the commit
  - [ ] Write the notes
    > Keep it to five bullets.

Task lists are a GFM extension, so the checkboxes only appear in renderers that support them; see the [checkbox guide](/guides/markdown-checkbox) for the per-app list. For plain indentation without a list marker, the [indent guide](/guides/markdown-indent) explains the alternatives, and the [cheat sheet](/markdown-cheat-sheet) has every other syntax on one page.
