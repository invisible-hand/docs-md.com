---
title: Markdown Underline — What Works on GitHub, Discord, Slack
h1: How to underline text in markdown
description: Markdown has no underline syntax; underscores make italics. Use <ins> on GitHub (it strips <u>), __text__ on Discord, Ctrl+U in Notion and Jira, and see where no underline exists at all.
updated: 2026-10-15
related: markdown-bold-italic, markdown-strikethrough, markdown-highlight, markdown-color-text, markdown-center-text, markdown-escape-characters
---
Markdown has no underline syntax. Wrapping text in `_underscores_` gives you *italics*, not an underline, and there is no other marker to try. Where inline HTML is allowed, use the `<ins>` tag, which works on GitHub, GitLab, Obsidian and most docs generators:

```markdown
This is <ins>underlined</ins> with HTML.
```

On GitHub the word "underlined" renders with an underline and nothing else changes. That one line is the portable answer. The rest of this guide covers why `<u>` is the wrong tag on GitHub, the chat apps that have their own underline markers (Discord, Telegram), the apps with none (Slack, WhatsApp, Reddit) and what to use instead when the text must be emphasised and underline is unavailable.

## Why doesn't markdown have underline?

Because on the web underlined text means "link". Markdown was designed to turn plain-text conventions into clean HTML, and its author left underline out deliberately: readers confuse underlined words with [hyperlinks](/guides/markdown-link), so typographic convention reserves the underline for links and uses *italic* or **bold** for emphasis. CommonMark, GFM and every mainstream flavour kept that decision. If the goal is emphasis, [bold or italic](/guides/markdown-bold-italic) is the portable, semantic choice; if the goal is "look at this", a [highlight](/guides/markdown-highlight) (`==text==` or `<mark>`) is closer to what people reach for underline to do.

## What HTML tags underline text?

Two tags render underlined by default, and only one of them survives GitHub:

| Tag | Meaning | GitHub | GitLab | Obsidian |
|---|---|---|---|---|
| `<ins>text</ins>` | Inserted text, the counterpart of `<del>` | Rendered | Rendered | Rendered |
| `<u>text</u>` | Unarticulated annotation; purely visual | **Stripped**: the tag is removed and plain text remains | Rendered | Rendered |
| `<span style="text-decoration: underline">` | CSS underline | Stripped (`style` is removed) | Stripped | Rendered |

GitHub's [basic formatting docs](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#styling-text) list `<ins>` as the underline syntax, and `u` is absent from the element allowlist in the [html-pipeline sanitizer](https://github.com/gjtorikian/html-pipeline/blob/main/lib/html_pipeline/sanitization_filter.rb) GitHub uses, so `<u>` silently disappears in READMEs, issues and comments. `<ins>` is therefore the tag to use everywhere: it underlines in every browser, it is allowed on GitHub, and its meaning ("this was added") is at least honest when you are marking an edit. Screen readers do not announce either tag by default, so an underline carries no meaning for non-sighted readers; if the emphasis matters, add bold or say it in words.

## How do you underline in Discord, Telegram, Slack and WhatsApp?

Each chat app has its own rules, and none of them accept HTML:

| App | Underline | Note |
|---|---|---|
| Discord | `__text__` (two underscores) | Discord's [Markdown Text 101](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline) lists it; `__*text*__` is underline italic, `__**text**__` underline bold. In real markdown `__text__` is **bold**, so do not copy it elsewhere |
| Telegram | `__text__` in MarkdownV2 | Bot API only; the desktop and mobile apps use Ctrl/Cmd+U |
| Slack | None | mrkdwn has `*bold*`, `_italic_`, `~strike~` and nothing else ([Slack formatting](https://docs.slack.dev/messaging/formatting-message-text)) |
| WhatsApp | None | `*bold*`, `_italic_`, `~strike~`, `` `mono` `` only |
| Reddit | None | HTML is escaped and shown as text; the fancy editor has no underline button either |

The [Discord markdown sheet](/discord-markdown) and [Slack markdown sheet](/slack-markdown) cover the rest of each app's syntax.

## How do you underline in Obsidian, Notion and Jira?

Obsidian renders inline HTML in Reading view, so `<u>` and `<ins>` both work there; `<u>` is what its community plugins and themes expect. Notion has no markdown shortcut for underline but applies it with Ctrl/Cmd+U on selected text, per its [keyboard shortcuts](https://www.notion.com/help/keyboard-shortcuts); an `<ins>` tag pasted or imported from a `.md` file arrives as plain text. Jira Cloud's editor is the same: Ctrl/Cmd+U, no markdown form ([Jira shortcuts](https://support.atlassian.com/jira-software-cloud/docs/markdown-and-keyboard-shortcuts/)). Jira's legacy wiki markup (Jira Server and Data Center, and the `{noformat}` world of Confluence) underlines with plus signs: `+underlined+`. The [Notion markdown sheet](/notion-markdown) and [Jira markdown page](/jira-markdown) have the full mappings.

## How do you underline in Pandoc, MDX and docs generators?

| Tool | Syntax | Output |
|---|---|---|
| Pandoc | `[text]{.underline}` (bracketed spans) | Underline in HTML, LaTeX (`\underline`), docx and ODT; the [Pandoc manual](https://pandoc.org/MANUAL.html#underline) documents the `underline` extension |
| MDX (Docusaurus, Astro, Next.js) | `<u>text</u>` or `<ins>text</ins>` as JSX | Rendered; `style={{textDecoration: 'underline'}}` also works because MDX accepts JSX style objects |
| MkDocs (Python-Markdown) | `^^text^^` with the `pymdownx.caret` extension; otherwise `<ins>` | `<ins>` in both cases |
| Hugo, Jekyll (Goldmark, kramdown) | `<ins>` or `<u>` | Rendered; raw HTML is on by default in Jekyll and needs `unsafe = true` in Hugo's Goldmark config |
| Typora, Bear, iA Writer | `<u>text</u>` | Rendered; Typora also has Ctrl/Cmd+U |

Pandoc's form is the one worth memorising if you export to Word or PDF: HTML tags survive to HTML output only, while `[text]{.underline}` converts to a real underline in every output format.

## What about underlining headings?

Markdown's "setext" heading style puts `===` or `---` under a line of text, which looks like underlining in the source but creates an H1 or H2; the rendered heading is not underlined. It covers only two levels, so the `#` form is preferred ([headings guide](/guides/markdown-headings)). If you want a visible rule under a heading, that is a [horizontal rule](/guides/markdown-horizontal-rule) on the next line, or CSS in the site theme, not an underline.

## Where does underline work?

| Platform | Underline available | How |
|---|---|---|
| GitHub | Yes | `<ins>` only |
| GitLab | Yes | `<ins>` or `<u>` |
| Obsidian | Yes | `<u>` or `<ins>` |
| Notion | Yes | Ctrl/Cmd+U, no syntax |
| Discord | Yes | `__text__` |
| Telegram | Yes | `__text__` (bots), Ctrl/Cmd+U (apps) |
| Jira Cloud | Yes | Ctrl/Cmd+U; `+text+` in legacy wiki markup |
| MDX, Hugo, Jekyll, Typora | Yes | `<ins>` or `<u>` |
| Pandoc | Yes | `[text]{.underline}` |
| Slack, WhatsApp, Reddit | No | None; use bold or italic |
| Plain CommonMark with HTML disabled | No | Tags are escaped and printed |

## Why is my underline showing as `<u>` text or disappearing?

The underline is being removed by the platform or was never underline syntax to begin with; three causes cover nearly every report:

1. **GitHub removed the tag.** `<u>` is not allowed; the text stays but the underline goes. Switch to `<ins>`.
2. **The renderer escapes HTML.** Reddit, Slack, Discord and any site with raw HTML disabled print `<ins>text</ins>` literally. There is no markdown fallback.
3. **Underscores.** `_text_` and `__text__` are italic and bold in markdown; they only underline in Discord and Telegram.

Paste the snippet into the [markdown viewer](/markdown-viewer) to see what a GFM renderer does with it before posting.

## What should you use instead of underline?

Prefer the formatting that carries meaning in every renderer: **bold** for the thing the reader must not miss, *italic* for titles and a change of voice, `code` for identifiers, and a [highlight](/guides/markdown-highlight) when the text is quoted and you are pointing at part of it. For "this text changed", `<ins>` for additions and `<del>` (or `~~strikethrough~~`, see the [strikethrough guide](/guides/markdown-strikethrough)) for removals is the pair that screen readers and diff tools understand. The [markdown cheat sheet](/markdown-cheat-sheet) lists every inline style side by side.
