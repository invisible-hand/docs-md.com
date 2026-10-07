---
title: Markdown Escape Characters — Backslash Escapes
h1: Markdown escape characters: how to show * _ # and | literally
description: Markdown escape characters: put a backslash before a symbol to show it literally. Full CommonMark escape list, escaping pipes in tables, backticks, < and >, HTML entities, Discord and Slack.
updated: 2026-10-07
related: markdown-code-block, markdown-bullet-points, markdown-quote, markdown-math, markdown-footnotes
---
To show a markdown symbol literally instead of letting it format text, put a backslash in front of it: `\*` prints an asterisk, `\_` an underscore, `\#` a hash sign. The backslash is markdown's escape character:

```markdown
\*not italic\* and \# not a heading and 2 \* 3 = 6
```

\*not italic\* and \# not a heading and 2 \* 3 = 6

The backslash disappears in the rendered output and the character after it is treated as plain text. This works in CommonMark, GitHub, GitLab, Obsidian, VS Code and Discord, but not everywhere: Slack ignores backslash escapes, and some characters need code spans or HTML entities instead. The rest of this guide has the complete list, the table-pipe problem, backticks, angle brackets and the app-specific rules.

## Which characters can you escape in markdown?

In CommonMark, any ASCII punctuation character can be escaped with a backslash. That is exactly these 32 characters:

```text
!  "  #  $  %  &  '  (  )  *  +  ,  -  .  /  :  ;  <  =  >  ?  @  [  \  ]  ^  _  `  {  |  }  ~
```

A backslash before any other character (a letter, a digit or a space) is just a backslash and is shown as typed. In practice, only some of the punctuation characters ever need escaping:

| Character | Why it needs escaping | Write |
|---|---|---|
| `\` | the escape itself | `\\` |
| `` ` `` | starts inline code | `` \` `` |
| `*` | emphasis, bullet | `\*` |
| `_` | emphasis | `\_` |
| `#` | heading at line start | `\#` |
| `[` `]` | links, footnotes, task lists | `\[` `\]` |
| `(` `)` | link destination after `]` | `\(` `\)` |
| `<` `>` | HTML tags, autolinks, quotes at line start | `\<` `\>` |
| `!` | image if followed by `[` | `\!` |
| `-` `+` | bullets at line start | `\-` `\+` |
| `.` `)` | numbered list after digits (`1\.`) | `\.` |
| `|` | table cell separator | `\|` |
| `~` | strikethrough | `\~` |
| `$` | math delimiters | `\$` |
| `{` `}` | attribute syntax in Pandoc and kramdown | `\{` `\}` |

The support is the same in every CommonMark renderer (GitHub, GitLab, Obsidian, VS Code preview, Notion's markdown import), and Discord understands the same set for its own formatting characters (`* _ ~ | > # - \``). Slack does not support backslash escapes in messages.

## How do you escape asterisks, underscores and hashes?

Put one backslash before each marker you want shown. Escape the opening marker, and the closing one if both could be read as a pair:

```markdown
Price: 5 \* 3 = 15
snake\_case\_name
\# Not a heading
\- Not a bullet
1\. Not a numbered list
\> Not a quote
```

Two shortcuts: underscores inside a word (`snake_case`) are usually left alone by CommonMark and GitHub, but not by every renderer, so escape them in documents that travel; and a `#`, `-`, `+`, `*`, `>` or `1.` only matters at the start of a line, so you rarely need to escape them in the middle of a sentence. The [bullet points guide](/guides/markdown-bullet-points) and the [blockquote guide](/guides/markdown-quote) explain the line-start rules.

## How do you escape the pipe character in a markdown table?

A literal pipe inside a table cell must be written `\|`, because an unescaped `|` ends the cell. GFM treats `\|` as a pipe even inside a code span in a table:

```markdown
| Command | Meaning |
|---|---|
| `a \| b` | pipe output of a into b |
| x \| y | a literal pipe in normal text |
```

If a renderer does not support `\|` (some older or custom parsers show the backslash too), use the HTML entity `&#124;` or `&vert;` instead: `a &#124; b`. Entities do not work inside code spans, though, because code is literal, so a code cell with a pipe is the case where `\|` matters. If the table is generated from data, the [table generator](/markdown-table-generator) escapes pipes for you.

## How do you show a backtick in markdown?

Wrap the text in a longer run of backticks than the one it contains. Inside a code span a backslash does not escape anything, so you cannot escape the backtick there. Use double backticks and a space on each side to show a single backtick:

```markdown
`` ` `` shows a lone backtick
`` a`b `` shows a backtick inside code
```

For a fenced code block that contains triple backticks, open and close with four (or use `~~~`). Outside a code span, `` \` `` prints one backtick. See the [code block guide](/guides/markdown-code-block).

## How do you show < and > or HTML tags?

In markdown, `<` starts an HTML tag or autolink, so a bare tag such as `<div>` may disappear. Use an HTML entity or a backslash: `&lt;div&gt;` and `\<div\>` both show `<div>`. The shortest and most readable approach is a code span: `` `<div>` `` shows the tag exactly, with no escaping, and it is what you should use for code.

| You want | Write |
|---|---|
| `<` | `&lt;` or `\<` |
| `>` | `&gt;` or `\>` |
| `&` | `&amp;` |
| a non-breaking space | `&nbsp;` |
| `©` | `&copy;` |
| a quote | `&quot;` |

Entities work wherever HTML is rendered. In a code span or code block they are shown as typed, so `&lt;` there prints `&lt;`. A bare `&` is fine in most cases; `&amp;` matters only when the text could be read as an entity (`&copy`).

## How do you escape characters in Discord and Slack?

Discord uses the same backslash: `\*text\*`, `\_`, `\~`, `\|\|` and `\>` show the characters. Discord's own markdown also uses a code span or a code block to disable everything inside it.

Slack does not honour backslashes. To show formatting characters literally in Slack, put the text in backticks, or break the pairing with a zero-width space after the opening asterisk or underscore. In the Slack API, the three characters `&`, `<` and `>` must be written as `&amp;`, `&lt;` and `&gt;` because Slack uses `<…>` for links and mentions. Details are in the [Slack markdown guide](/slack-markdown) and the [Discord markdown guide](/discord-markdown).

## Do you need to escape characters in code blocks?

No. Nothing is interpreted inside inline code or a fenced code block, so `*`, `_`, `#`, `<`, `|` and even `\` are shown as typed and backslash escapes do not apply. The one exception in GFM tables: inside a code span in a table cell, write `\|`. When you cannot use code (running prose in a table, a heading), escape with backslash or an entity.

## What does a backslash at the end of a line do?

A backslash as the last character on a line creates a hard line break in CommonMark, so it is not a literal backslash. It is an alternative to two trailing spaces. To show a literal backslash at the end of a line, escape it with another one: `\\`. See the [new line guide](/guides/markdown-new-line).

## Why are my markdown escape characters not working?

When an escape fails, it is usually because the renderer or the context differs from what you assumed. Check:

1. **The backslash shows up in the output.** The next character is not ASCII punctuation (`\n` is just `\n`), or you are inside a code span, where escapes do not apply.
2. **Slack shows the backslash.** Slack has no escape; use backticks.
3. **The pipe still splits the table cell.** Some parsers need `&#124;`; also check the cell is not inside inline HTML.
4. **`<tag>` still disappears.** The tag was not escaped and the renderer treated it as HTML. Use `\<`, `&lt;` or a code span.
5. **Underscores still make italics.** In some renderers `\_` must be on both sides of a word, or the word sits next to other underscores.
6. **The escape worked in the preview but not in the exported PDF.** The converter may pass raw backslashes into LaTeX, where `\` is a command. Use Pandoc, which handles it.
7. **A URL with underscores is broken.** Wrap the URL in `<…>` or code instead of escaping inside it. If a tool already escaped your text once, a second backslash prints literally.

Paste your text into the [markdown viewer](/markdown-viewer) to see the GFM result, and see the [markdown cheat sheet](/markdown-cheat-sheet) for the other syntax.

## What are the best practices for escaping in markdown?

Prefer code spans for anything technical, escape only the characters that actually trigger formatting, use `\|` in tables, and use entities for angle brackets in text that must survive several renderers. Avoid over-escaping every punctuation mark: it makes the source unreadable. For maths-heavy text, switch to math delimiters instead of escaping every symbol (see the [math guide](/guides/markdown-math)); for footnote-like brackets see the [footnotes guide](/guides/markdown-footnotes).
