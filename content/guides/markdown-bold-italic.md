---
title: Bold and Italic in Markdown — Asterisks, Underscores, Nesting
h1: How to make text bold or italic in markdown
description: Bold is **text** or __text__, italic is *text* or _text_, bold italic is ***text***. Nesting, the mid-word underscore trap, punctuation rules, HTML fallbacks, and the Slack, Discord, WhatsApp, Jira and Pandoc differences.
updated: 2026-10-15
related: markdown-strikethrough, markdown-underline, markdown-highlight, markdown-escape-characters, markdown-headings, markdown-table
---
To make text bold in markdown, wrap it in two asterisks: `**bold**`. For italic, use one asterisk: `*italic*`. For both at once, three: `***bold italic***`. Underscores work the same way (`__bold__`, `_italic_`) in most renderers.

```markdown
**bold** and __also bold__
*italic* and _also italic_
***bold and italic*** or **bold with *italic* inside**
```

**bold** and __also bold__
*italic* and _also italic_
***bold and italic*** or **bold with *italic* inside**

The markers must hug the text: `** bold **` with inner spaces is not bold in CommonMark; it renders the asterisks literally.

## Should you use asterisks or underscores?

Asterisks, unless you have a reason. They behave the same everywhere, including in the middle of a word, while underscores have one trap: CommonMark and GitHub do not treat `_` as emphasis inside a word, so `snake_case_name` stays literal (good) but `un_believ_able` does not italicise "believ" (surprising if you meant it to). Asterisks have no such rule: `un*believ*able` renders un*believ*able. Most style guides (Google's, markdownlint's MD049 and MD050 defaults) pick `*` for italic and `**` for bold and ask you to be consistent.

## How do you nest bold and italic?

Mix the two markers so the parser can tell them apart: `**bold with _italic_ inside**` or `*italic with __bold__ inside*`. Three asterisks for the whole run (`***text***`) is fine, but `***bold** and italic*` is the kind of thing that works on GitHub and fails elsewhere; split it into clear runs instead.

```markdown
**Warning:** _do not_ run this on production.
```

**Warning:** _do not_ run this on production.

## How do you write a literal asterisk or underscore?

Escape it with a backslash: `\*not italic\*` renders \*not italic\*, and `5 \* 3` renders 5 \* 3. Inside inline code nothing is interpreted, so `` `*args` `` is the cleanest way to show a code identifier with an asterisk. A lone `*` surrounded by spaces is also left alone by most renderers (`2 * 3 = 6` renders as written), but escape it if the document goes through several tools. The [escaping guide](/guides/markdown-escape-characters) has the full list.

## Why is my text not turning bold?

Text that keeps its asterisks is almost always a spacing or marker-matching problem; four usual causes:

1. **Spaces inside the markers**: `** bold **`. Remove them.
2. **Unmatched markers**: an opening `**` with no close later on the line, often because a word contains a stray asterisk.
3. **Underscores inside words**: `my_var_name` is intentionally literal. Use asterisks.
4. **The renderer has no bold**: a code block, a plain-text email, or a tool that only supports its own syntax (see the table).

## Does bold and italic work in Slack, Discord, WhatsApp and Notion?

| App | Bold | Italic | Notes | Source |
| --- | --- | --- | --- | --- |
| GitHub, GitLab | `**bold**` | `*italic*` | Full CommonMark/GFM behaviour; underscores work except inside words | [GitHub styling text](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#styling-text), [GitLab emphasis](https://docs.gitlab.com/ee/user/markdown.html#emphasis) |
| Obsidian | `**bold**` | `*italic*` | Also `_` forms; Ctrl/Cmd+B and +I insert the markers | [Obsidian syntax](https://obsidian.md/help/syntax) |
| Reddit | `**bold**` | `*italic*` | Both the markdown and fancy editors | [Reddit markdown sheet](/reddit-markdown) |
| Discord | `**bold**` | `*italic*` or `_italic_` | Also `***bold italic***`, `__underline__` (underline, not bold) | [Discord Markdown Text 101](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline) |
| Slack | `*bold*` | `_italic_` | **Single** asterisk is bold in Slack's mrkdwn; `**text**` shows stray asterisks | [Slack formatting](https://docs.slack.dev/messaging/formatting-message-text) |
| WhatsApp | `*bold*` | `_italic_` | Same single-marker style as Slack; `~strike~` for strikethrough | [WhatsApp formatting sheet](/whatsapp-formatting) |
| Telegram | `**bold**` | `__italic__` | In MarkdownV2; `_italic_` also works in legacy mode | [Telegram markdown sheet](/telegram-markdown) |
| Notion | `**bold**` | `*italic*` | Converts as you type; also Ctrl/Cmd+B and +I | [Notion shortcuts](https://www.notion.com/help/keyboard-shortcuts) |
| Jira Cloud | `**bold**` or `__bold__` | `*italic*` or `_italic_` | Converts as you type; legacy wiki markup is `*bold*` and `_italic_` | [Jira shortcuts](https://support.atlassian.com/jira-software-cloud/docs/markdown-and-keyboard-shortcuts/) |
| MDX | `**bold**` | `*italic*` | Standard; `<strong>` and `<em>` as JSX also work | [MDX docs](https://mdxjs.com/docs/what-is-mdx/) |
| Pandoc | `**bold**` | `*italic*` | Converts to real bold and italic in docx, LaTeX and ODT; `intraword_underscores` is on by default | [Pandoc manual](https://pandoc.org/MANUAL.html#emphasis) |
| Google Docs | `*bold*` | `_italic_` | Only with "Automatically detect Markdown" enabled | — |

The Slack and WhatsApp rows are the ones that catch people: text written for GitHub arrives with doubled asterisks showing. The [Slack markdown guide](/slack-markdown), [Discord markdown guide](/discord-markdown) and [Notion markdown guide](/notion-markdown) cover each app's full syntax, and the [markdown to Slack converter](/markdown-to-slack) rewrites the markers for you.

## What HTML tags make text bold or italic?

Where inline HTML is allowed, `<strong>` and `<em>` are what the markdown markers compile to, and `<b>` and `<i>` give the same look with a different meaning:

| Tag | Markdown equivalent | Meaning | Screen readers |
|---|---|---|---|
| `<strong>` | `**text**` | Strong importance | May announce "strong" in verbose mode; otherwise read as text |
| `<em>` | `*text*` | Stress emphasis (changes the sentence's meaning) | Same |
| `<b>` | none | Visually bold, no importance (keywords, product names) | Read as text |
| `<i>` | none | Alternate voice: a title, a term, a foreign phrase | Read as text |

Use the markdown forms unless you are inside raw HTML already (a `<p align="center">` block, an HTML table cell), where the markers do not render on GitHub and the tags are the only option. Because most screen readers ignore all four by default, never let bold carry meaning on its own: "**Required**" in a table is fine next to a column header that says Required, and not fine as the only signal.

## Does bold work next to punctuation and inside words?

Mostly, with rules that CommonMark spells out as [left- and right-flanking delimiters](https://spec.commonmark.org/0.31.2/#left-flanking-delimiter-run). An opening `**` must not be followed by a space; a closing `**` must not be preceded by one. Punctuation is allowed on the outside: `**"Quoted"**` and `(**parenthesised**)` work, and `**bold**.` is bold followed by a period. Inside words, asterisks always work (`un**believ**able`), underscores never do (`un__believ__able` stays literal), and a `*` with spaces on both sides is a plain asterisk. Markers cannot cross a paragraph boundary: a `**` opened in one paragraph and closed in the next renders as asterisks in both. A single `**` run can span a line break inside the same paragraph, which is useful in long sentences and confusing in diffs, so most style guides keep emphasis within a line.

## When should you use bold versus italic?

Bold is for the thing the eye must find: a warning, a key term on first use, the name of a button ("click **Save**"). Italic is for a change of voice: a title, a foreign phrase, a word used as a word, mild emphasis in a sentence. A paragraph with bold in every sentence has no emphasis at all; if everything is loud, nothing is. Neither is a substitute for a heading, and neither should be used for links (the link styling already distinguishes them).

## Can you make text bold in a heading, a list, or a table?

Yes, anywhere inline text goes: `## **Breaking** change` (the [headings guide](/guides/markdown-headings) covers what else is allowed in a heading), `- **Fast**: zero config`, and inside [table cells](/guides/markdown-table) `| **Plan** | Price |`. The one place it does not work is inside a code span or code block, by design. If the goal is to draw the eye rather than to stress a word, the [highlight guide](/guides/markdown-highlight) covers `==text==` and `<mark>`. For the rest of the syntax see the [markdown cheat sheet](/markdown-cheat-sheet).
