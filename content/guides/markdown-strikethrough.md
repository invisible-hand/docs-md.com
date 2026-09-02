---
title: Markdown Strikethrough — Cross Out Text
h1: How to strikethrough text in markdown
description: Cross out text in markdown by wrapping it in double tildes, like ~~this~~. Where it works (GitHub, Discord, Slack), single vs double tilde, HTML fallbacks.
updated: 2026-08-29
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

Sometimes — and that's the problem. GitHub and Discord render single-tilde `~text~` as strikethrough too, but many other processors don't, and Pandoc uses single tildes for ~subscript~. Always use double tildes; they work everywhere the feature exists.

## How do you strikethrough in Slack?

Slack's message box isn't real markdown — it uses its own formatting where a **single tilde** does strikethrough: `~like this~`. Double tildes in Slack render as literal characters. (Same trap in WhatsApp: single tilde.)

## Can you combine strikethrough with bold or italic?

Yes — nest the markers, keeping them symmetrical:

```markdown
~~**bold and struck**~~ and ~~*italic and struck*~~
```

~~**bold and struck**~~ and ~~*italic and struck*~~

A common real-world pattern is striking through completed items in a task list: `- [x] ~~Ship v1~~`.
