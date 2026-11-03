---
title: Tables in Discord and Slack: Code Blocks, Images, Links
h1: How do you make a table in Discord or Slack?
description: Neither app has table syntax in messages. Use a space-aligned grid in a code block, a converter that builds one, or an image, a link or a Slack canvas.
tool: markdown-table-generator
updated: 2026-11-03
related: /markdown-to-discord, /markdown-to-slack, /guides/markdown-table, /guides/markdown-code-block
---
You cannot type a real table into a Discord or Slack message: neither app has table syntax, so a Markdown pipe table shows up as raw pipes and dashes. The usual workaround is a grid of space-padded columns inside a code block. For wide or formatted data, send an image, a link or a Slack canvas.

Both apps use a Markdown-like syntax, which is why people expect tables to work. Discord's [Markdown Text 101](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline) covers bold, italics, underline, strikethrough, headers, subtext, masked links, lists, code blocks, block quotes and spoilers. Slack's [formatting help](https://slack.com/help/articles/202288908-Format-your-messages) lists the toolbar options (bold, italics, underline, strikethrough, code, block quote, code block, ordered and bulleted lists), and its [markup reference](https://slack.com/help/articles/360039953113-Format-your-messages-in-Slack-with-markup) adds links. Neither page has a table.

## What happens if I send a Markdown table?

It arrives exactly as typed. The header, the `|---|` delimiter row and every pipe stay visible, and because normal message text uses a proportional font, even a carefully padded source does not line up on screen. Nothing is lost, but readers have to work out the columns themselves. HTML is no way around it either: neither formatting guide includes HTML, and `<table>` tags show up as text.

## How do I make a table with a code block?

Write the rows as plain text, pad each column with spaces to the width of its longest value, put a line of dashes under the header, and wrap the whole grid in three backticks so the app shows it in a fixed-width font. For example:

~~~text
```
Task         Owner  Status     Hours
-----------  -----  ---------  -----
Launch post   Ann   Done           4
QA            Bob   In review     12
```
~~~

Text in a code block is shown in a fixed-width font, so every character takes the same space and the columns stay in line. In Discord, type the backticks. In Slack, select the text and choose **Code block** in the formatting toolbar, or type the backticks if you use markup. A few rules keep the grid readable:

- **Pad with spaces, not tabs.** Spaces put every column at the same character position.
- **Keep it narrow.** A grid wider than the message pane has to wrap or scroll, and either breaks the layout. Shorten headers and drop columns that do not matter to the conversation; phones show far less than a desktop window.
- **Expect plain text.** Formatting does not apply inside a code block. Bold, links and mentions inside the grid show as typed, so put the one link people need above or below it.
- **Watch wide characters.** Emoji and many CJK characters take up more than one column in a fixed-width font, so a cell containing them can push the rest of its row out of line. Keep them in the last column, or leave them out.

## How do the Discord and Slack converters build the grid?

Paste the table, on its own or inside a longer message, into [Markdown to Discord](/markdown-to-discord) or [Markdown to Slack](/markdown-to-slack). Each converter rewrites every pipe table as a space-padded grid inside a code block and converts the rest of the message to the app's own syntax.

The grid in the previous section is their actual output for this input:

```markdown
| Task | Owner | Status | Hours |
|:-----|:-----:|--------|------:|
| [Launch post](https://example.com) | Ann | **Done** | 4 |
| QA | Bob | In review | 12 |
```

The rules behind that output:

- Columns are padded to their widest value, with two spaces between columns and a row of dashes under the header.
- The alignment colons are kept as padding: the centered Owner column is padded on both sides, and the right-aligned Hours column is padded on the left.
- Cell formatting is removed, because it cannot work in a code block. Bold markers are dropped, and a link keeps its text but loses its URL.
- The approximations panel under the output lists the table, with the note that it was "written as an aligned grid inside a code block".

The rest of the message is converted to each app's own syntax, for example `*bold*` with single asterisks for Slack. The converters count characters to pad columns, so the wide-character caveat above applies to their output too. To build the table from scratch, use the [Markdown table generator](/markdown-table-generator), copy its Markdown, and paste it into either converter.

## How big can a code-block table be?

For Discord, its help page on [sending messages](https://support.discord.com/hc/en-us/articles/360034632292-Sending-Messages) puts the cap at 2,000 characters per message, or 4,000 with Nitro, and says longer messages are converted into a text file. The padding spaces count, so a wide grid reaches the cap sooner than its content suggests. Split a long table into several messages, or send it another way.

In Slack, a long grid fits better in a text snippet: click the plus icon next to the message field and choose **Create a text snippet**, or press Cmd+Shift+Enter (Ctrl+Shift+Enter on Windows and Linux) to turn what you typed into one. Slack's [snippet help](https://slack.com/help/articles/204145658-Create-or-paste-code-snippets-in-Slack) notes that snippets cannot be created from the mobile apps.

## Can a Slack app or a Discord bot send a real table?

A Slack app can. Since August 2025, Block Kit has a [table block](https://docs.slack.dev/reference/block-kit/blocks/table-block) that apps post with `chat.postMessage`. It takes rows of cells, optional per-column alignment and wrapping, and allows at most 100 rows, 20 cells per row and 10,000 characters across all table cells in a message. Slack's [markdown block](https://docs.slack.dev/reference/block-kit/blocks/markdown-block), intended for apps that post Markdown written by an LLM, lists pipe tables among its supported syntax and "Renders as a formatted table". Both are for apps posting through the API; what people type in the message field is unchanged.

A Discord bot has no table to send. The closest structure is an embed with fields: Discord's [message documentation](https://discord.com/developers/docs/resources/message#embed-object) allows up to 25 fields per embed, each with a name of up to 256 characters and a value of up to 1,024, and an `inline` flag that displays fields side by side. That suits a handful of label and value pairs, not rows of data.

## When should I send an image or a link instead?

When the grid stops doing its job. Typical signs: the table is wider than a phone shows, cells need links or formatting, people will want to sort or edit it, or it would not fit in one message.

- **An image** keeps every column, color and merged cell exactly as designed. Build or paste the table in the [table generator](/markdown-table-generator), take a screenshot of its preview, and paste the image into the message. Add one line of text with the key numbers, because figures inside an image cannot be copied or searched as text, and a screen reader cannot read the cells of a picture.
- **A link** suits anything people will act on. Share the spreadsheet, or use the table generator's **Share as link** button, which publishes the rendered table at a docs-md.com link that expires after 30 days.
- **A Slack canvas** is the native option in Slack. Slack's [canvas help](https://slack.com/help/articles/203950418-Use-a-canvas-in-Slack) lists **Create a table** in the canvas toolbar, so the table lives next to the conversation and others can edit it.

## Why are the columns still out of line?

Almost always for one of four reasons. The grid is not actually inside the code block, so it is shown in the normal proportional font: check that the opening and closing backticks are on their own lines, or that the whole grid is selected when you apply Code block in Slack. The source mixes tabs and spaces. A cell contains emoji or other wide characters. Or a row is wider than the message pane and wraps onto a second line, which happens much sooner on a phone than in a desktop window. Fix the first three in the text; for the last, drop a column or switch to an image or a link. For the Markdown table syntax itself, and the apps where pipe tables do render, see the [Markdown table guide](/guides/markdown-table).
