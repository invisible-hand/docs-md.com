---
title: Bold and Italic in Markdown — Asterisks, Underscores, Nesting
h1: How to make text bold or italic in markdown
description: Bold is **text** or __text__, italic is *text* or _text_, bold italic is ***text***. Nesting, the mid-word underscore trap, escaping, and the Slack, Discord and WhatsApp differences.
updated: 2026-10-13
related: markdown-underline, markdown-strikethrough, markdown-escape-characters
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

Four usual causes:

1. **Spaces inside the markers**: `** bold **`. Remove them.
2. **Unmatched markers**: an opening `**` with no close later on the line, often because a word contains a stray asterisk.
3. **Underscores inside words**: `my_var_name` is intentionally literal. Use asterisks.
4. **The renderer has no bold**: a code block, a plain-text email, or a tool that only supports its own syntax (see the table).

## Does bold and italic work in Slack, Discord, WhatsApp and Notion?

| App | Bold | Italic | Notes |
| --- | --- | --- | --- |
| GitHub, GitLab, Obsidian, Reddit | `**bold**` | `*italic*` | Full CommonMark/GFM behaviour |
| Discord | `**bold**` | `*italic*` or `_italic_` | Also `***bold italic***`, `__underline__` (underline, not bold) |
| Slack | `*bold*` | `_italic_` | **Single** asterisk is bold in Slack's mrkdwn; `**text**` shows stray asterisks |
| WhatsApp | `*bold*` | `_italic_` | Same single-marker style as Slack; `~strike~` for strikethrough |
| Telegram | `**bold**` | `__italic__` | In MarkdownV2; `_italic_` also works in legacy mode |
| Notion | `**bold**` | `*italic*` | Converts as you type; also keyboard shortcuts |
| Google Docs | `*bold*` | `_italic_` | Only with "Automatically detect Markdown" enabled |

The Slack and WhatsApp rows are the ones that catch people: text written for GitHub arrives with doubled asterisks showing. The [Slack markdown guide](/slack-markdown) and [Discord markdown guide](/discord-markdown) cover each app's full syntax.

## When should you use bold versus italic?

Bold is for the thing the eye must find: a warning, a key term on first use, the name of a button ("click **Save**"). Italic is for a change of voice: a title, a foreign phrase, a word used as a word, mild emphasis in a sentence. A paragraph with bold in every sentence has no emphasis at all; if everything is loud, nothing is. Neither is a substitute for a heading, and neither should be used for links (the link styling already distinguishes them).

## Can you make text bold in a heading, a list, or a table?

Yes, anywhere inline text goes: `## **Breaking** change`, `- **Fast**: zero config`, and inside table cells `| **Plan** | Price |`. The one place it does not work is inside a code span or code block, by design.
