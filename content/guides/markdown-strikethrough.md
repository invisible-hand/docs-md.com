---
title: Markdown Strikethrough — Cross Out Text
h1: How to strikethrough text in markdown
description: Cross out text in markdown by wrapping it in double tildes, like ~~this~~. Where it works (GitHub, Discord, Slack), single vs double tilde, HTML fallbacks.
updated: 2026-09-06
related: markdown-underline, markdown-checkbox
---
To strike through text in markdown, wrap it in double tildes: `~~like this~~` renders as ~~like this~~.

```markdown
The meeting is on ~~Tuesday~~ Wednesday.
```

The meeting is on ~~Tuesday~~ Wednesday.

## Is strikethrough part of standard markdown?

No — original markdown and the CommonMark spec have no strikethrough. The `~~tildes~~` form comes from **GitHub Flavored Markdown (GFM)** and is now supported almost everywhere developers write markdown: GitHub, GitLab, Discord, Reddit, Obsidian, Notion, Discourse, and this site.

If your renderer is strict CommonMark and tildes stay visible, fall back to HTML, which any markdown processor that allows inline HTML will render:

```markdown
<del>deleted text</del> or <s>no longer accurate</s>
```

Use `<del>` for "this was removed/changed" (screen readers announce it as deleted) and `<s>` for "no longer accurate".

## Does a single tilde work?

Sometimes — and that's the problem. GitHub renders single-tilde `~text~` as strikethrough too, but Discord, Obsidian and most other processors don't, and Pandoc uses single tildes for ~subscript~. Always use double tildes; they work everywhere the feature exists.

## How do you strikethrough in Slack?

Slack's message box isn't real markdown — it uses its own formatting where a **single tilde** does strikethrough: `~like this~`. Double tildes in Slack render as literal characters. (Same trap in WhatsApp: single tilde.)

## Which strikethrough syntax does each app use?

The `~~double tilde~~` form covers almost every markdown renderer; chat apps and a few work tools use their own markers:

| App | Strikethrough syntax | Notes |
|---|---|---|
| GitHub, GitLab, Bitbucket | `~~text~~` | GFM; GitHub also accepts `~text~` |
| Discord | `~~text~~` | Single tilde does nothing |
| Slack | `~text~` | Double tildes show literally |
| WhatsApp | `~text~` | Same as Slack |
| Reddit | `~~text~~` | Both the markdown and fancy editors |
| Trello | `~~text~~` | In card descriptions and comments |
| Obsidian, Notion, Typora, Bear | `~~text~~` | Notion also has ⌘/Ctrl+Shift+S |
| Jira, Confluence (wiki markup) | `-text-` | Not markdown; tildes stay literal |
| Google Docs, Word | no markdown | Use ⌘/Ctrl+Shift+X (Docs) or the toolbar |

## How do you strikethrough in Trello?

Trello's card descriptions, checklists and comments accept markdown, so wrap the text in double tildes: `~~done~~`. There is no toolbar button for it — type the tildes. Checklist items that you tick off are struck through automatically, so you rarely need it there.

## Why isn't my strikethrough working?

Four causes account for nearly every case:

1. **A space inside the tildes** — `~~ text ~~` doesn't render. The tildes must touch the text: `~~text~~`.
2. **Single tildes** in an app that needs two (Discord, Obsidian), or double tildes in one that needs a single (Slack, WhatsApp).
3. **Strict CommonMark renderer** (some static-site generators, Pandoc by default) — strikethrough is a GFM extension. Enable the extension or use `<del>text</del>`.
4. **Inside a code span or code block** — markdown is never parsed there, so `` `~~text~~` `` shows the tildes on purpose.

## Does strikethrough work in tables, headings and links?

Yes — it's inline formatting, so it works anywhere inline text does: table cells (`| ~~old price~~ $9 |`), headings (`## ~~Draft~~ Final`), link text (`[~~old page~~](/new)`) and list items. It doesn't span across paragraphs; open and close the tildes inside each one.

## Can you combine strikethrough with bold or italic?

Yes — nest the markers, keeping them symmetrical:

```markdown
~~**bold and struck**~~ and ~~*italic and struck*~~
```

~~**bold and struck**~~ and ~~*italic and struck*~~

A common real-world pattern is striking through completed items in a task list: `- [x] ~~Ship v1~~`.
