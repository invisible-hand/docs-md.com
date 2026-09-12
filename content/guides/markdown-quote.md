---
title: Markdown Blockquote Syntax — How to Quote Text
h1: Markdown blockquote: how to quote text
description: Markdown blockquote syntax: start a line with > to quote text. Multi-line, nested and attributed quotes, GitHub [!NOTE] alerts, Obsidian callouts, fixes.
updated: 2026-09-12
related: markdown-code-block, markdown-indent, markdown-comment
---
To quote text in markdown, start the line with a `>` character. The result is called a *blockquote* — the same element HTML renders as `<blockquote>`:

```markdown
> The best way to predict the future is to invent it.
```

> The best way to predict the future is to invent it.

That one character covers 90 % of real use. The rest of this guide is the other 10 %: multi-paragraph quotes, nesting, attribution, GitHub's coloured `[!NOTE]` alerts, Obsidian callouts, what each chat app does differently, and the handful of ways a quote silently fails to render.

## What is a blockquote in markdown?

A blockquote is a block of text set apart from the surrounding paragraphs to show that it comes from somewhere else — a person, a document, an earlier message — or to highlight a note. In markdown you create one by prefixing each line with `>`; the renderer turns it into an HTML `<blockquote>`, which most stylesheets show with a left border and a lighter or italic text colour.

The syntax comes from the email convention of quoting a reply with `>` lines, which is why it reads naturally in chat apps and issue trackers too. Blockquotes are part of the original markdown spec and CommonMark, so unlike tables or task lists they work in every renderer without an extension.

## What is the full markdown blockquote syntax?

Every blockquote form is a line that starts with `>`; the variations only change what follows it. This table is the whole syntax:

| You want | Markdown | Works in |
|---|---|---|
| One-line quote | `> text` | Everywhere |
| Multi-line quote (one paragraph) | `> line one` / `> line two` | Everywhere |
| Multi-paragraph quote | `> para` / `>` / `> para` | Everywhere |
| Nested quote (reply chain) | `>> text` or `> > text` | Everywhere |
| Quote with attribution | `> text` / `>` / `> — Name` | Everywhere |
| List, code or heading inside | `> - item`, `> ## Title` | Everywhere |
| Coloured alert / callout | `> [!NOTE]` | GitHub, GitLab, Obsidian, some docs tools |
| Foldable callout | `> [!TIP]-` | Obsidian |
| Literal `>` without quoting | `\>` | Everywhere |

A space after the `>` is optional in CommonMark (`>text` also works) but keep it — some editors and Slack-style chat apps require it, and it makes the source readable.

## How do you write a multi-line or multi-paragraph quote?

Consecutive `>` lines merge into one blockquote paragraph, and a `>` on an otherwise empty line separates paragraphs inside the same quote. So a quote with two paragraphs looks like this:

```markdown
> First paragraph of the quote.
>
> Second paragraph, same quote.
```

> First paragraph of the quote.
>
> Second paragraph, same quote.

Two details trip people up:

- **Lines in the same paragraph don't need a break.** `> line one` followed by `> line two` renders as one flowing paragraph, exactly like two lines of normal text. Add two trailing spaces or a `\` at the end of a line if you want a hard line break inside the quote.
- **Lazy continuation.** CommonMark lets you drop the `>` on continuation lines of the same paragraph — only the first line needs it. It renders fine but it is fragile: one blank line and the "continuation" becomes a normal paragraph outside the quote. Prefix every line.

## Can you nest quotes inside quotes?

Yes — stack `>` characters, one per level. This is the standard way to show a reply chain or a quote that itself contains a quote:

```markdown
> The report is ready.
>
> > Didn't we agree on Friday?
> >
> > > Friday was the original plan.
```

> The report is ready.
>
> > Didn't we agree on Friday?
> >
> > > Friday was the original plan.

To come back to the outer level after a nested quote, put a `>` line between them and continue with a single `>`. Without that separator most renderers keep the deeper level going. Discord is the exception that doesn't nest at all — see the platform section below.

## Can a blockquote contain lists, code, headings, or images?

Yes, everything works inside a blockquote as long as every line keeps the `> ` prefix. Lists, headings, emphasis, links, images, task lists, and fenced code blocks all render normally:

```markdown
> ## Steps to reproduce
>
> 1. Open the app
> 2. Run the tests:
>
> ```bash
> npm test
> ```
>
> Expected **all green**, got 3 failures. See [the log](https://example.com/log).
```

The one thing that is unreliable is a **table inside a quote**. GitHub and most GFM renderers handle it, but several editors and chat apps break the pipes. If a quoted table matters, put the table below the quote instead of inside it.

## How do you add attribution or a citation to a quote?

Markdown has no built-in attribution syntax. The convention is a final line inside the same blockquote, separated by an empty `>` line, that starts with an em dash:

```markdown
> Simplicity is prerequisite for reliability.
>
> — Edsger W. Dijkstra
```

> Simplicity is prerequisite for reliability.
>
> — Edsger W. Dijkstra

Make the name a link if the source is online: `> — [Dijkstra, 1975](https://example.com/source)`. If you need a machine-readable source for a blog engine or a docs site that renders raw HTML, drop to `<blockquote cite="https://example.com">…</blockquote>` — but the `cite` attribute is invisible to readers, so keep the visible dash line as well.

## How do you end a blockquote or put two quotes back to back?

A blockquote ends at the first line that doesn't start with `>` and isn't a lazy continuation of the previous line. In practice: leave one blank line, then write normal text.

Two quotes separated only by a blank line usually **merge into one** on GitHub and most CommonMark renderers, because the blank line is absorbed into the same quote. To keep them separate, put something between them — a sentence, a heading, or an invisible HTML comment:

```markdown
> First quote.

<!-- -->

> Second quote, rendered as its own block.
```

## What are GitHub's [!NOTE] and [!WARNING] alerts?

GitHub turns a blockquote whose first line is `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]` or `[!CAUTION]` into a coloured **alert** with an icon. The syntax is a plain blockquote with the marker on its own line:

```markdown
> [!NOTE]
> Useful information users should know, even when skimming.

> [!TIP]
> Helpful advice for doing things better.

> [!IMPORTANT]
> Key information users need to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.
```

Rules that decide whether it renders as an alert or as a plain quote:

- The marker must be the **first line** of the blockquote, alone, in upper case, with the square brackets and exclamation mark.
- Only those five types exist. `[!INFO]` or `[!DANGER]` render as a normal quote containing the literal text.
- Alerts work in READMEs, issues, pull requests, discussions and wikis. They do **not** work inside another alert, inside a list item, or in a `<details>` block on older GitHub versions.
- GitLab supports the same five markers (since 17.x); Obsidian and Docusaurus render them through their own callout systems. Every other renderer degrades gracefully to a normal quote with the marker text visible — harmless, but ugly.

## How do Obsidian callouts work?

Obsidian uses the same `> [!type]` syntax as GitHub but with a much larger set of types, an optional custom title, and folding. The title goes on the marker line:

```markdown
> [!tip] Keyboard shortcut
> Press Ctrl+E to toggle preview.

> [!warning]- Folded by default
> The dash after the type collapses the callout; a plus (+) expands it.

> [!question] Nested callouts
> > [!example]
> > Callouts can contain other callouts.
```

Types Obsidian ships with: `note`, `abstract` (also `summary`, `tldr`), `info`, `todo`, `tip` (also `hint`, `important`), `success` (also `check`, `done`), `question` (also `help`, `faq`), `warning` (also `caution`, `attention`), `failure` (also `fail`, `missing`), `danger` (also `error`), `bug`, `example`, `quote` (also `cite`). Types are case-insensitive, unlike GitHub's. A type Obsidian doesn't know falls back to the `note` style rather than a plain quote.

Because both systems share the `> [!TYPE]` shape, a vault note with `[!NOTE]`, `[!TIP]`, `[!WARNING]` and `[!CAUTION]` callouts renders correctly on GitHub too — only `[!IMPORTANT]` and the Obsidian-only types differ.

## When should you use a blockquote?

Use a blockquote when the text is not yours or needs to stand apart from the flow. The five common cases:

1. **Quoting someone else** — a source, a spec, a customer, a tweet. This is what the element is for; add attribution.
2. **Replying to part of a message** — quote the sentence you are answering, then answer below it. Issue trackers, mailing lists and Discord all read this naturally.
3. **Notes and callouts** — a warning or tip that the reader should not skim past. On GitHub, use the alert markers so it gets colour; elsewhere a bold first word (`> **Note:**`) does the job.
4. **Pull quotes** in long documents — a key sentence repeated as a visual anchor.
5. **Citing a definition or an error message** verbatim, so readers know the wording is exact and not paraphrased.

Don't use blockquotes for **indentation**. It looks similar in some themes, but it carries the semantic meaning "this is quoted", screen readers announce it, and the left border shows up wherever the markdown is rendered. For plain indentation see the [markdown indent guide](/guides/markdown-indent).

## Does the > quote syntax work in Discord, Slack, Reddit, Notion and other apps?

Yes — the `>` prefix works nearly everywhere, but chat apps add their own rules for multi-line quotes and drop nesting. The differences that matter:

| App | One line | Rest of message | Nesting | Alerts / callouts |
|---|---|---|---|---|
| GitHub, GitLab | `> text` | prefix every line | `>>` | `[!NOTE]` … 5 types |
| Obsidian | `> text` | prefix every line | `>>` | `[!type]` callouts, foldable |
| Notion | `"` + space, or `/quote` | Shift+Enter inside the block | no | use `/callout` |
| Discord | `> text` | `>>> text` | no | no |
| Slack | `> text` | `>>> text` | no | no |
| Reddit | `> text` | prefix every line | `>>` | no |
| VS Code preview, pandoc, Hugo, Jekyll | `> text` | prefix every line | `>>` | plugin-dependent |
| Microsoft Teams, WhatsApp | no markdown quotes | — | — | — |

- **Discord**: `> ` quotes one line; `>>> ` at the start of the message quotes everything after it. Nested `>>` does not work. Details in the [Discord markdown guide](/discord-markdown).
- **Slack**: same `> ` / `>>> ` pair; the space after `>` is required. Slack renders the quote bar only in its own message box, not in code blocks. See the [Slack markdown guide](/slack-markdown).
- **Reddit**: standard `> ` per line; `>>` nests in the markdown editor. Reddit's rich-text editor has its own quote button and can mangle pasted `>` lines — switch to markdown mode.
- **Notion**: typing `"` followed by a space converts the block to a quote; `>` is not used. A callout is a separate block type.

## How do you style a blockquote with CSS or HTML?

Markdown produces a bare `<blockquote>` and leaves the look to the site's stylesheet, so styling means either changing the CSS on your own site or falling back to inline HTML where the renderer allows it. On your own site the classic border-left style is a few lines:

```css
blockquote {
  border-left: 4px solid #6366f1;
  margin: 1.5em 0;
  padding: 0.5em 1em;
  color: #4b5563;
  background: #f5f5ff;
}
blockquote p:last-child { margin-bottom: 0; }
```

Where you cannot touch the CSS — GitHub, most wikis, chat apps — you cannot change quote colours at all; GitHub strips `style` attributes. The workarounds are the alert markers (which give you five preset colours) or plain emphasis inside the quote (`> **Warning:** …`). Renderers that pass raw HTML through (Hugo, Jekyll, most static site generators) accept an inline `<blockquote style="…">`, but it stops being portable markdown at that point.

## Why isn't my blockquote rendering? Common errors and fixes

Almost every broken blockquote is one of six mistakes. Check them in this order:

1. **The `>` isn't at the start of the line.** Leading spaces are fine (up to three), but a tab, a bullet, or text before the `>` turns it into a literal character. Fix: put `>` in column one.
2. **Multi-paragraph quote splits in two.** You left a truly blank line between paragraphs. Fix: put a lone `>` on the blank line so the quote continues.
3. **GitHub alert shows as a plain quote with `[!NOTE]` text.** The marker isn't on the first line by itself, is lower case, or the quote is nested inside a list or another quote. Fix: `> [!NOTE]` on its own line, upper case, top level.
4. **Nested quote collapses to one level.** Some renderers need a space between the arrows: use `> > text` instead of `>> text`, and put a `>` line before the nested block.
5. **Code block inside the quote breaks out.** The fence lines are missing their `> ` prefix. Every line of the fence — opening, code, closing — needs it.
6. **Two quotes merged into one.** Only a blank line separated them. Fix: put any non-quote content between them (a sentence or `<!-- -->`).

If none of those match, paste the text into the [markdown viewer](/markdown-viewer) — it renders with the same CommonMark + GFM rules as GitHub, so you can see whether the problem is your syntax or the app you are pasting into.

## How do you show a literal > sign without making a quote?

Escape it with a backslash: `\> not a quote`. That only matters at the start of a line — a `>` in the middle of a sentence is always literal. Inside a code span or a code block a `>` is literal too, so `` `a > b` `` and comparison operators in code need no escape.

## Can you have an empty blockquote?

Yes — a line with only `>` renders an empty blockquote (a bare left border), and CommonMark allows it. There is rarely a reason to want one; it usually appears by accident when a `>` line is left behind after editing. Delete the stray line to remove the empty box.

## What is the difference between a blockquote and a callout?

A blockquote is the semantic HTML element for quoted text; a callout (or alert, admonition) is a highlighted box for notes and warnings that many tools *build on top of* blockquote syntax. In portable markdown there is no callout — GitHub, Obsidian, Docusaurus and MkDocs each add their own marker inside a blockquote (`[!NOTE]`, `[!tip]`, `:::note`, `!!! note`). If your document must render in more than one of those, use `> **Note:**` — it is a plain quote everywhere and reads as a callout anyway.

## How long should a blockquote be?

Keep a quote to a sentence or a short paragraph unless the quoted text itself is the point of the document. Long quotes lose the visual "aside" effect, and on GitHub a multi-screen alert box is hard to scan. If you need to reproduce a long passage, quote it in full and add a one-line summary above it in your own words so readers can skip it.

## What are the best practices for markdown blockquotes?

Prefix every line with `> ` (with the space), keep one idea per quote, add attribution when the words are someone else's, and use the platform's alert markers rather than emoji or bold shouting for notes. Keep quotes short, don't use them for indentation, and test them in the renderer you actually publish to — the platform table above lists the cases where `>` behaves differently.

For everything else in markdown — headings, lists, tables, code, footnotes — see the [markdown cheat sheet](/markdown-cheat-sheet).
