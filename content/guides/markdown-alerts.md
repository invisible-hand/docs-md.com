---
title: Markdown Alerts — GitHub [!NOTE] Syntax and Callout Equivalents
h1: How to make alerts and callouts in markdown
description: GitHub alerts use > [!NOTE], [!TIP], [!IMPORTANT], [!WARNING], [!CAUTION] on a blockquote. Rendered meaning of each, the GitLab, Obsidian and Docusaurus equivalents, and where they show as plain quotes.
updated: 2026-10-15
related: markdown-quote, markdown-collapsible-section, markdown-color-text, markdown-highlight, markdown-horizontal-rule
---
To make an alert in markdown on GitHub, start a blockquote with `> [!NOTE]` (or TIP, IMPORTANT, WARNING, CAUTION) on its own line and put the message on the following `>` lines. GitHub renders it as a coloured box with an icon and a title:

```markdown
> [!NOTE]
> Alerts need a blank line above them and the marker on its own line.

> [!WARNING]
> Running this command deletes the local database.
```

> [!NOTE]
> Alerts need a blank line above them and the marker on its own line.

> [!WARNING]
> Running this command deletes the local database.

There is no alert syntax in CommonMark. Every tool that has alerts (also called callouts or admonitions) built them on top of blockquotes or fences, and they agree on the idea but not on the spelling. This guide covers GitHub's five types, the equivalents in GitLab, Obsidian, Docusaurus and MkDocs, and what happens to each when the markdown is rendered somewhere else.

## What are the five GitHub alert types?

GitHub's [alert docs](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts) define five, each with a colour, an icon and a stated purpose:

| Marker | Colour | Meaning (GitHub's wording) | Use it for |
|---|---|---|---|
| `> [!NOTE]` | Blue | Useful information that users should know, even when skimming content | Background, context, a link to more detail |
| `> [!TIP]` | Green | Helpful advice for doing things better or more easily | Shortcuts, optional improvements |
| `> [!IMPORTANT]` | Purple | Key information users need to know to achieve their goal | Prerequisites, must-read steps |
| `> [!WARNING]` | Yellow | Urgent info that needs immediate user attention to avoid problems | Breaking changes, data loss risks |
| `> [!CAUTION]` | Red | Advises about risks or negative outcomes of certain actions | Irreversible or dangerous operations |

The marker is upper case, in square brackets with a leading `!`, alone on the first line of the quote. There is no custom title on GitHub: the title is always the type name. The docs also set usage limits worth following: alerts cannot be nested inside other elements (lists, other quotes, tables), one or two per article, and never two in a row.

## Where do GitHub alerts render?

In every GitHub surface that renders markdown: READMEs and other `.md` files, issues, pull requests, discussions, wikis and release notes. GitLab added the same five markers in version 17.10, in lower case or upper case, with an optional title after the marker. Outside those two the markers are unknown and the quote renders as a plain blockquote with the literal text `[!NOTE]` on the first line:

| Renderer | `> [!NOTE]` result |
|---|---|
| GitHub | Coloured alert box with icon |
| GitLab 17.10+ | Alert box; title can be overridden: `> [!warning] Data deletion` ([GitLab docs](https://docs.gitlab.com/ee/user/markdown.html#alerts)) |
| Obsidian | Callout. `note`, `tip`, `important`, `warning` and `caution` are all recognised types |
| Typora, Markdown Extra, Pandoc | Plain blockquote with `[!NOTE]` as text |
| Docusaurus, MkDocs, Hugo, Jekyll | Plain blockquote unless a plugin adds support |
| Slack, Discord, Reddit | Plain quote; Discord shows `[!NOTE]` as text |
| Notion | Pasted as a quote block with the marker as text |

Because the fallback is a visible but harmless quote, GitHub alerts are safe to use in a README that is also published elsewhere; the message still reads correctly, just without the colour.

## What is the Obsidian callout equivalent?

Obsidian uses the same blockquote-plus-marker shape with a lower-case type, an optional title on the first line, and many more types. Its [callout docs](https://obsidian.md/help/callouts) list thirteen, several with aliases:

```markdown
> [!tip] Faster builds
> Cache `node_modules` between runs.

> [!faq]- Why is this collapsed?
> Because a `-` after the type makes the callout foldable and closed by default.
```

The full type list is `note`, `abstract` (`summary`, `tldr`), `info`, `todo`, `tip` (`hint`, `important`), `success` (`check`, `done`), `question` (`help`, `faq`), `warning` (`caution`, `attention`), `failure` (`fail`, `missing`), `danger` (`error`), `bug`, `example` and `quote` (`cite`). The type is case-insensitive, so a GitHub `> [!WARNING]` renders as an Obsidian warning callout too, and an unknown type falls back to `note`. Two Obsidian features have no GitHub equivalent: the custom title and the `+`/`-` fold markers, which make a callout expanded or collapsed by default. For GitHub, the [collapsible section guide](/guides/markdown-collapsible-section) shows the `<details>` alternative.

## How do you write the same alert in Docusaurus, MkDocs and other generators?

Each docs generator has its own admonition syntax, and none of them use the blockquote form. The mapping from GitHub's five types:

| GitHub | Docusaurus | MkDocs (Material) | Obsidian | GitLab |
|---|---|---|---|---|
| `> [!NOTE]` | `:::note` | `!!! note` | `> [!note]` | `> [!note]` |
| `> [!TIP]` | `:::tip` | `!!! tip` | `> [!tip]` | `> [!tip]` |
| `> [!IMPORTANT]` | `:::info` | `!!! info` | `> [!important]` (alias of tip) | `> [!important]` |
| `> [!WARNING]` | `:::warning` | `!!! warning` | `> [!warning]` | `> [!warning]` |
| `> [!CAUTION]` | `:::danger` | `!!! danger` | `> [!danger]` | `> [!caution]` |

Docusaurus's [admonitions](https://docusaurus.io/docs/markdown-features/admonitions) are three-colon fences (`:::note[Custom title]` ... `:::`) with the types `note`, `tip`, `info`, `warning` and `danger`; they need blank lines around the fences. MkDocs Material uses `!!! note "Title"` followed by a four-space-indented body. Both print as literal text on GitHub, which is the reason to keep GitHub's form in a README and reserve the generator syntax for files only the generator builds.

## Can you put code, lists or images inside an alert?

Yes. Everything that works in a blockquote works in an alert, as long as every line keeps the `> ` prefix: lists, code fences, links, images, bold text. Only the marker line is special:

```markdown
> [!IMPORTANT]
> Before upgrading:
>
> 1. Back up `config.yml`
> 2. Run the check:
>
> ```bash
> tool check --strict
> ```
```

The things that do not work are nesting an alert inside a list item or another quote (GitHub ignores the marker and shows a plain quote), a second marker line inside the same quote, and a blank line without a `>` in the middle (it ends the quote, and the rest becomes a paragraph). The [blockquote guide](/guides/markdown-quote) covers the general rules for multi-paragraph and nested quotes.

## Why is my GitHub alert showing as a plain quote?

One of five reasons, usually the first:

1. **The marker is not alone on the first line.** `> [!NOTE] Text` on one line is not an alert on GitHub (it is on GitLab and Obsidian, where that text becomes the title). Put the message on the next `>` line.
2. **Lower case.** GitHub requires `[!NOTE]`; `[!note]` renders as text. GitLab and Obsidian accept either.
3. **Nested.** The quote is inside a list, a table cell or another blockquote. Alerts only work at the top level.
4. **No blank line above.** Like any blockquote, the alert needs to start a new block.
5. **Wrong platform.** You are looking at it in a tool that has no alert support (see the table above).

Paste the block into the [markdown viewer](/markdown-viewer) to see the GFM rendering of the quote structure; if the structure is right there, the remaining difference is the host.

## What is a portable alternative to alerts?

A plain blockquote with a bold label: `> **Note:** text`. It is a valid quote in every renderer, reads as a callout without colour, and never prints stray brackets. It is the right choice for documentation that is rendered by several tools (a README that is also built by a docs generator, a changelog pasted into Slack). If you want the colour on GitHub and the portable form elsewhere, write the GitHub form; its fallback is a quote with `[!NOTE]` as its first word, which is less tidy than the bold label but still readable. Colour outside alerts is not available in markdown at all; the [colour text guide](/guides/markdown-color-text) explains the limits and the [highlight guide](/guides/markdown-highlight) covers `==text==` and `<mark>`. For the rest of the syntax see the [markdown cheat sheet](/markdown-cheat-sheet).
