---
title: Markdown Highlight Text — ==text== and the <mark> Fallback
h1: How to highlight text in markdown
description: Highlight text in markdown with ==text== in Obsidian, Typora, Pandoc and Markdown Extra tools, or with <mark>text</mark> on GitHub and GitLab. No highlight in Slack, Discord or Reddit; alternatives that work.
updated: 2026-10-15
related: markdown-color-text, markdown-underline, markdown-bold-italic, markdown-alerts, markdown-escape-characters
---
To highlight text in markdown, wrap it in double equals signs in apps that support the extension (`==like this==`), or use the HTML `<mark>` tag where raw HTML is allowed:

```markdown
Obsidian, Typora, Pandoc: ==highlighted text==
GitHub, GitLab, most blogs: <mark>highlighted text</mark>
```

Neither form is in CommonMark or GitHub Flavored Markdown, so there is no highlight syntax that works everywhere. The `==` form is the de facto extension; `<mark>` is the HTML element that the extension compiles to, and it works wherever raw HTML survives. In chat apps there is nothing, and the fallback is bold.

## Does markdown have a highlight syntax?

No. CommonMark defines emphasis (`*`, `_`), code spans and nothing else for inline styling, and GFM adds only strikethrough. Highlighting exists as an extension that a handful of parsers added independently, all using `==text==` because it mirrors `~~strike~~` and `**bold**`. The HTML it produces is `<mark>text</mark>`, which browsers render with a yellow background by default. Where neither the extension nor HTML is available, the text simply shows the equals signs.

## Which apps support ==highlight==?

Note-taking apps and converters do; code hosts and chat apps do not:

| App | `==text==` | `<mark>` | Notes |
|---|---|---|---|
| Obsidian | Yes | Yes | Six colours by adding an emoji after the opening `==` ([Obsidian syntax](https://obsidian.md/help/syntax)) |
| Typora | Yes, after enabling it in Preferences > Markdown | Yes | Off by default ([Typora reference](https://support.typora.io/Markdown-Reference/)) |
| Pandoc | Yes, with the `mark` extension | Yes | `==text==` becomes `<mark>` in HTML output ([Pandoc manual](https://pandoc.org/MANUAL.html#extension-mark)) |
| iA Writer, Bear, Ulysses | Yes | Varies | Markdown Extra-style editors |
| MkDocs (pymdownx.mark), Python-Markdown | Yes, with the extension | Yes | Must be enabled in config |
| Jekyll (kramdown) | No | Yes | Raw HTML passes through |
| Hugo (Goldmark) | No by default | Yes | Goldmark has no mark extension built in |
| Docusaurus | No | Yes (as JSX `<mark>`) | MDX treats HTML as JSX |
| GitHub | No | Yes | `mark` is on the sanitiser allowlist |
| GitLab | No | Yes | Same sanitiser family as GitHub |
| Notion | No | No | Highlight via the toolbar or `/color` instead ([Notion basics](https://www.notion.com/help/writing-and-editing-basics)) |
| Slack | No | No | No highlight in mrkdwn ([Slack formatting](https://docs.slack.dev/messaging/formatting-message-text)) |
| Discord | No | No | Not in [Markdown Text 101](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline) |
| Reddit | No | No | HTML tags are not rendered |

On GitHub, `==text==` renders as literal equals signs with no error, which is the most common way people discover the gap. Markdown Extra itself (the PHP implementation) does not define `==`; the syntax spread through editors that extended Markdown Extra, which is why "Markdown Extra highlight" turns up in searches.

## How do you highlight text on GitHub?

Use the `<mark>` tag. GitHub's HTML sanitiser keeps `mark` (along with `ins`, `del`, `sup`, `sub`, `kbd` and `abbr`), and the browser's default style gives it a yellow background:

```markdown
The build fails if <mark>NODE_ENV</mark> is unset.
```

Two limits. There is no colour choice, because `style` attributes are stripped, so every highlight is the browser default. And `<mark>` does not render inside code spans or code blocks, where it prints as text; in those places use a comment or a `# <-- here` marker instead. For a line-level highlight in a README, a GitHub alert (`> [!IMPORTANT]`) gives a coloured box with an icon and is the idiomatic choice; the [alerts guide](/guides/markdown-alerts) covers the five types. The [colour text guide](/guides/markdown-color-text) explains why `style` and `<font>` do not work on GitHub.

## How do you highlight in Obsidian?

With `==text==`, and optionally with a colour emoji right after the opening marker. Obsidian's syntax docs list six: 🔴 red, 🟠 orange, 🟡 yellow, 🟢 green, 🔵 blue and 🟣 purple. Without an emoji the highlight uses the theme's default colour:

```markdown
This is ==important== and this is ==🟢 approved==.
```

The emoji travels with the text, so the file still reads correctly in another app (the circle emoji remains visible, the `==` print literally). Obsidian also renders `<mark>`, so for notes that are published to GitHub from a vault, `<mark>` is the form that highlights in both places.

## What is the alternative when highlight is not supported?

Bold is the portable fallback, and a structural element is often better than any inline style:

| Goal | Portable alternative | Works in |
|---|---|---|
| Draw the eye to a phrase | `**bold**` | Everywhere |
| Mark a change or addition | `<ins>text</ins>` or `**+ text**` | GitHub, GitLab, HTML-tolerant renderers |
| Flag a whole line or paragraph | `> [!IMPORTANT]` alert or `> **Note:**` quote | GitHub, GitLab, Obsidian; plain quote elsewhere |
| Call out a value in text | `` `code span` `` | Everywhere |
| Highlight in Slack or Discord | `*bold*` (Slack) / `**bold**` (Discord), or an emoji marker | Chat apps |

Underline is not a good substitute: it looks like a link in every renderer and has its own compatibility problems, covered in the [underline guide](/guides/markdown-underline). Italics are too quiet to read as a highlight. If the point is to show a diff, a fenced code block with the `diff` language renders added lines green and removed lines red on GitHub, which is a real highlight for code.

## How do you show literal equals signs without highlighting?

Escape the first one in apps that support highlight: `\==not highlighted==`. In a code span (`` `==` ``) they are always literal. On GitHub and everywhere else without the extension nothing needs escaping, because `==` has no meaning. A single `=` never triggers highlight in any parser, and a line of `===` under text is a setext H1, not a highlight; see the [headings guide](/guides/markdown-headings).

## Should you use highlight in documentation?

Sparingly. A highlight in a README reads as a yellow marker on a printed page: it is effective once and noise the third time. Reserve it for a single value or term per section that the reader must not miss, prefer an alert for a whole sentence, and avoid it in text that will be pasted into chat apps or Notion, where it is lost. For the full list of inline styles and their compatibility see the [bold and italic guide](/guides/markdown-bold-italic) and the [markdown cheat sheet](/markdown-cheat-sheet).
