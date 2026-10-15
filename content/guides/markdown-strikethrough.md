---
title: Markdown Strikethrough — ~~Double Tildes~~ and Where They Work
h1: How to strikethrough text in markdown
description: Cross out text in markdown with double tildes, ~~like this~~. Single vs double tilde, Slack and Notion's single-tilde forms, <del> vs <s> fallbacks, accessibility, and a per-app table (GitHub, Discord, Obsidian, Jira, Pandoc).
updated: 2026-10-15
related: markdown-bold-italic, markdown-underline, markdown-highlight, markdown-checkbox, markdown-escape-characters, markdown-table
---
To strike through text in markdown, wrap it in double tildes: `~~like this~~` renders as ~~like this~~.

```markdown
The meeting is on ~~Tuesday~~ Wednesday.
```

The meeting is on ~~Tuesday~~ Wednesday.

## Is strikethrough part of standard markdown?

No — original markdown and the CommonMark spec have no strikethrough. The `~~tildes~~` form is the [GFM strikethrough extension](https://github.github.com/gfm/#strikethrough-extension-) and is now supported almost everywhere developers write markdown: GitHub, GitLab, Discord, Reddit, Obsidian, Discourse, Pandoc, and this site.

If your renderer is strict CommonMark and tildes stay visible, fall back to HTML, which any markdown processor that allows inline HTML will render:

```markdown
<del>deleted text</del> or <s>no longer accurate</s>
```

Use `<del>` for "this was removed/changed" (screen readers announce it as deleted) and `<s>` for "no longer accurate".

## Does a single tilde work?

Sometimes — and that's the problem. The GFM spec allows one or two tildes, so GitHub renders single-tilde `~text~` as strikethrough too, but Discord, Obsidian and most other processors don't, and Pandoc uses single tildes for ~subscript~ (see the [subscript guide](/guides/markdown-subscript)). Always use double tildes; they work everywhere the feature exists. The only places single tildes are *required* are the apps with their own syntax: Slack, WhatsApp, Telegram and Notion.

## How do you strikethrough in Slack?

Slack's message box isn't real markdown — it uses its own formatting where a **single tilde** does strikethrough: `~like this~`. Double tildes in Slack render as literal characters. (Same trap in WhatsApp: single tilde.)

## Which strikethrough syntax does each app use?

The `~~double tilde~~` form covers almost every markdown renderer; chat apps and a few work tools use their own markers:

| App | Strikethrough syntax | Notes | Source |
|---|---|---|---|
| GitHub, GitLab, Bitbucket | `~~text~~` | GFM; GitHub also accepts `~text~` | [GitHub styling text](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#styling-text) |
| Discord | `~~text~~` | Single tilde does nothing | [Discord Markdown Text 101](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline) |
| Slack | `~text~` | Double tildes show literally | [Slack formatting](https://docs.slack.dev/messaging/formatting-message-text) |
| WhatsApp | `~text~` | Same as Slack | [WhatsApp formatting sheet](/whatsapp-formatting) |
| Telegram | `~text~` (MarkdownV2, bots) | Apps use the format menu | [Telegram markdown sheet](/telegram-markdown) |
| Reddit | `~~text~~` | Both the markdown and fancy editors | [Reddit markdown sheet](/reddit-markdown) |
| Obsidian | `~~text~~` | Shown struck in Reading view; `<s>` and `<del>` also render | [Obsidian syntax](https://obsidian.md/help/syntax) |
| Notion | `~text~` while typing, single tilde | Also ⌘/Ctrl+Shift+S; `~~text~~` in an imported `.md` file converts correctly | [Notion shortcuts](https://www.notion.com/help/keyboard-shortcuts) |
| Jira Cloud | `~~text~~` converts as you type | Legacy wiki markup (Jira Server, Confluence) is `-text-` | [Jira shortcuts](https://support.atlassian.com/jira-software-cloud/docs/markdown-and-keyboard-shortcuts/) |
| Trello, Typora, Bear | `~~text~~` | Card descriptions, checklists and comments in Trello | — |
| MDX (Docusaurus, Astro) | `~~text~~` with `remark-gfm`; `<del>` always | Plain MDX has no strikethrough | [MDX docs](https://mdxjs.com/docs/what-is-mdx/) |
| Pandoc | `~~text~~` | The `strikeout` extension, on by default; converts to real strikethrough in docx, LaTeX and ODT | [Pandoc manual](https://pandoc.org/MANUAL.html#strikeout) |
| Google Docs, Word | no markdown | Use ⌘/Ctrl+Shift+X (Docs) or the toolbar | — |

The [Slack](/slack-markdown), [Discord](/discord-markdown) and [Notion](/notion-markdown) sheets cover the rest of each app's syntax.

## How do you strikethrough in Trello?

Trello's card descriptions, checklists and comments accept markdown, so wrap the text in double tildes: `~~done~~`. There is no toolbar button for it — type the tildes. Checklist items that you tick off are struck through automatically, so you rarely need it there.

## Why isn't my strikethrough working?

Four causes account for nearly every case:

1. **A space inside the tildes** — `~~ text ~~` doesn't render. The tildes must touch the text: `~~text~~`.
2. **Single tildes** in an app that needs two (Discord, Obsidian), or double tildes in one that needs a single (Slack, WhatsApp).
3. **Strict CommonMark renderer** (some static-site generators, Pandoc by default) — strikethrough is a GFM extension. Enable the extension or use `<del>text</del>`.
4. **Inside a code span or code block** — markdown is never parsed there, so `` `~~text~~` `` shows the tildes on purpose.

## What is the difference between `<del>` and `<s>`?

Both render as a line through the text, and both are on GitHub's HTML allowlist, but they mean different things. `<del>` marks text that was *removed* in an edit (its pair is `<ins>` for additions), and it can carry `cite` and `datetime` attributes recording why and when. `<s>` marks text that is *no longer accurate or relevant* but was never "edited out": an old price, a sold-out item. Markdown's `~~tildes~~` compile to `<del>` on GitHub and in most GFM renderers, and to `<s>` in some (Obsidian, Pandoc's HTML writer), which is a detail only stylesheets and assistive tech notice.

| Tag | Meaning | GitHub | Pairs with |
|---|---|---|---|
| `<del>` | Deleted in a revision | Rendered | `<ins>` |
| `<s>` | No longer accurate | Rendered | nothing |
| `<strike>` | Obsolete HTML; same look as `<s>` | Rendered | avoid |
| `~~text~~` | GFM; renders as `<del>` on GitHub | Rendered | `**`, `*`, links |

## Is strikethrough accessible?

Not by default. Most screen readers do not announce `<del>`, `<s>` or a struck-through span unless the user turns on verbose formatting, so a reader who cannot see the line hears "The meeting is on Tuesday Wednesday" and has to guess. Three habits fix that: keep the replacement next to the struck text and make the sentence read correctly without the strike ("~~Tuesday~~ Wednesday" is fine; a struck paragraph with no replacement is not); say what changed in words when it matters ("Update: moved to Wednesday"); and in task lists, rely on the checkbox rather than striking the text, since the `[x]` state *is* announced. The WAI guidance on [text-level semantics](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html) covers why visual-only formatting needs a textual backup.

## Does strikethrough work in tables, headings and links?

Yes — it's inline formatting, so it works anywhere inline text does: table cells (`| ~~old price~~ $9 |`), headings (`## ~~Draft~~ Final`), link text (`[~~old page~~](/new)`) and list items. It doesn't span across paragraphs; open and close the tildes inside each one.

## Can you combine strikethrough with bold or italic?

Yes — nest the markers, keeping them symmetrical:

```markdown
~~**bold and struck**~~ and ~~*italic and struck*~~
```

~~**bold and struck**~~ and ~~*italic and struck*~~

A common real-world pattern is striking through completed items in a task list: `- [x] ~~Ship v1~~`. The [bold and italic guide](/guides/markdown-bold-italic) covers the marker-nesting rules, and the [highlight guide](/guides/markdown-highlight) is the counterpart when you want to draw attention to text rather than cross it out. For the rest of the syntax see the [markdown cheat sheet](/markdown-cheat-sheet).
