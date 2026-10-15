---
title: Markdown Emoji — :shortcode: Syntax and Where It Works
h1: How to add emoji in markdown
description: Add emoji in markdown by typing :shortcode: (GitHub, GitLab, Slack, Discord, Obsidian plugins) or pasting the Unicode character, which works everywhere. Support matrix, top-50 shortcode table, accessibility.
updated: 2026-10-15
related: markdown-escape-characters, markdown-headings, markdown-anchor-link, markdown-checkbox, markdown-bold-italic
---
To add an emoji in markdown, either paste the Unicode character (🚀) or type its shortcode between colons (`:rocket:`). The character works in every renderer because it is plain text; the shortcode only works where the app converts it:

```markdown
Ship it :rocket: — or just paste 🚀
```

Ship it :rocket: — or just paste 🚀

Markdown itself has no emoji syntax. CommonMark does not mention emoji, and the `:shortcode:` form is an extension that GitHub popularised and other apps copied with slightly different name lists. The practical rule: shortcodes in GitHub, GitLab, Slack and Discord; Unicode everywhere else.

## Does markdown support emoji shortcodes?

Only as a platform extension. GitHub's [basic syntax docs](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#using-emojis) describe the form as `:EMOJICODE:`, "a colon followed by the name of the emoji", with autocomplete when you type the first colon. GitLab's [emoji docs](https://docs.gitlab.com/ee/user/markdown.html#emoji) use the same `:shortcode:` syntax everywhere GitLab Flavored Markdown is rendered. Outside those two, support is uneven:

| App | `:shortcode:` | Unicode emoji | Notes |
|---|---|---|---|
| GitHub | Yes, in issues, PRs, comments, `.md` files | Yes | Names from the [gemoji](https://github.com/github/gemoji) list; custom `:octocat:`, `:shipit:` |
| GitLab | Yes | Yes | Falls back to images where the OS lacks the glyph; custom emoji per group |
| Slack | Yes, in the composer | Yes | Converts `:tada:` as you type; workspace custom emoji and aliases ([Slack emoji help](https://slack.com/help/articles/202931348-Use-emoji-and-reactions)) |
| Discord | Composer autocomplete | Yes | `:name:` is an input shortcut, not markdown; server custom emoji use the same form |
| Obsidian | No (community plugin needed) | Yes | `==` highlights accept colour emoji after the opening marker ([Obsidian syntax](https://obsidian.md/help/syntax)) |
| Notion | `:name` picker in the editor | Yes | Typing `:` then a name opens the emoji picker ([Notion shortcuts](https://www.notion.com/help/keyboard-shortcuts)) |
| Reddit | No | Yes | Shortcodes print literally |
| Docusaurus, MkDocs, Hugo, Jekyll | Plugin or extension (`remark-emoji`, `pymdownx.emoji`, `jemoji`) | Yes | Off by default in each |
| Typora | Yes, with autocomplete | Yes | [Typora reference](https://support.typora.io/Markdown-Reference/#emoji-smile) |

"Yes" for Unicode means the character is passed through, which is true of any text renderer. The only way to break a pasted emoji is a font without the glyph, which shows as an empty box.

## What are the most common emoji shortcodes?

These fifty cover most of what appears in READMEs, changelogs, issues and chat. The names are from GitHub's gemoji database, and Slack and GitLab share them except where noted:

| Shortcode | Emoji | Shortcode | Emoji |
|---|---|---|---|
| `:smile:` | 😄 | `:thumbsup:` / `:+1:` | 👍 |
| `:grinning:` | 😀 | `:thumbsdown:` / `:-1:` | 👎 |
| `:joy:` | 😂 | `:clap:` | 👏 |
| `:rofl:` | 🤣 | `:wave:` | 👋 |
| `:sweat_smile:` | 😅 | `:pray:` | 🙏 |
| `:wink:` | 😉 | `:muscle:` | 💪 |
| `:blush:` | 😊 | `:ok_hand:` | 👌 |
| `:heart_eyes:` | 😍 | `:raised_hands:` | 🙌 |
| `:thinking:` | 🤔 | `:eyes:` | 👀 |
| `:neutral_face:` | 😐 | `:point_right:` | 👉 |
| `:sob:` | 😭 | `:heart:` | ❤️ |
| `:angry:` | 😠 | `:broken_heart:` | 💔 |
| `:sunglasses:` | 😎 | `:fire:` | 🔥 |
| `:star:` | ⭐ | `:sparkles:` | ✨ |
| `:tada:` | 🎉 | `:rocket:` | 🚀 |
| `:100:` | 💯 | `:boom:` | 💥 |
| `:zap:` | ⚡ | `:bulb:` | 💡 |
| `:warning:` | ⚠️ | `:no_entry:` | ⛔ |
| `:white_check_mark:` | ✅ | `:x:` | ❌ |
| `:heavy_check_mark:` | ✔️ | `:question:` | ❓ |
| `:exclamation:` | ❗ | `:construction:` | 🚧 |
| `:memo:` | 📝 | `:pushpin:` | 📌 |
| `:bug:` | 🐛 | `:wrench:` | 🔧 |
| `:hammer:` | 🔨 | `:lock:` | 🔒 |
| `:key:` | 🔑 | `:link:` | 🔗 |
| `:mag:` | 🔍 | `:chart_with_upwards_trend:` | 📈 |
| `:calendar:` | 📆 | `:hourglass:` | ⌛ |
| `:bell:` | 🔔 | `:recycle:` | ♻️ |
| `:coffee:` | ☕ | `:cake:` | 🍰 |
| `:arrow_right:` | ➡️ | `:octocat:` | GitHub only |

Shortcodes are case-sensitive and lower case. Names with spaces in the Unicode standard use underscores (`:heart_eyes:`), and a few have aliases (`:+1:` and `:thumbsup:` are the same emoji). GitHub's full list is the `emoji.json` file in the gemoji repository, and the autocomplete in any GitHub text box searches it.

## Why does my emoji shortcode show as text?

Because the renderer does not convert shortcodes, or the name is wrong. Work through these:

1. **The app has no shortcode support.** Obsidian, Reddit, plain CommonMark and most static-site generators print `:rocket:` literally. Paste the Unicode character instead.
2. **The name is a Slack or Discord name, not a GitHub one.** The lists overlap but are not identical; a custom Slack emoji (`:party_parrot:`) is only known to that workspace.
3. **The shortcode is inside a code span or code block.** Backticks disable all conversion, which is what you want when documenting the syntax.
4. **A character is adjacent.** `word:rocket:word` does not convert on some renderers; put a space on each side.
5. **Capital letters.** `:Rocket:` is not `:rocket:` on GitHub.

The [markdown viewer](/markdown-viewer) renders with the same GFM rules as GitHub, so a shortcode that converts there will convert in a README.

## Should you use Unicode emoji or shortcodes?

Use Unicode when the document might be read anywhere other than GitHub, GitLab or a chat app; use shortcodes when the source is what people edit and they need to search or review it. Unicode is portable and renders in every browser, editor and terminal with an emoji font, but it is invisible to a diff reviewer who does not know which 🎉 variant was used, and it can be stripped by tools that normalise text. Shortcodes are readable in source, diff cleanly and never depend on the author's keyboard, but fall back to literal colons outside the apps that support them. READMEs on GitHub are the one place where either choice is fine; shortcodes are more common there because of autocomplete.

## Can you use emoji in headings and links?

Yes, emoji are ordinary inline text, so they work in headings, links, tables and list items. The thing to know is what happens to the heading's anchor. GitHub drops punctuation and emoji when it builds the slug, so `## 🚀 Getting started` links as `#-getting-started` (the emoji leaves a leading hyphen behind). GitLab turns the shortcode name into text, so `## :thumbsup: Thanks` becomes `#thumbsup-thanks`. If you link to headings, keep emoji out of them or check the generated anchor with the [TOC generator](/markdown-toc-generator); the [anchor link guide](/guides/markdown-anchor-link) has the full slug rules.

## Are emoji accessible to screen readers?

A Unicode emoji is read aloud by its Unicode name ("rocket", "party popper"), which is fine for one emoji that carries meaning and tedious for five in a row. A shortcode converted to an image on GitHub gets the shortcode as alt text, so it is announced similarly. Three habits keep emoji from hurting accessibility: put the emoji after the words rather than before, so the sentence is read first; never use an emoji as the only indicator of status (write "Done ✅", not just "✅"); and do not use emoji as bullet points, because a screen reader announces each one instead of the list structure. Decorative emoji in headings are the worst case: they are read on every navigation and they break anchor links.

## How do you show a literal :shortcode: without converting it?

Wrap it in backticks. Inside inline code (`` `:rocket:` ``) nothing is converted on any platform, which is why every table on this page can show the syntax. If you need the colons outside code, a backslash before the first colon (`\:rocket:`) works on GitHub, and a zero-width space between the colon and the name works everywhere but is invisible in the source and annoying later. Prefer the code span. The [escape characters guide](/guides/markdown-escape-characters) covers the other characters that need escaping, and the [cheat sheet](/markdown-cheat-sheet) has the rest of the syntax.
