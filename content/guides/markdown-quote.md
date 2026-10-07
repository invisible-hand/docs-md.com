---
title: Markdown Blockquote Syntax — How to Quote Text in Markdown
h1: Markdown blockquote: how to quote text in markdown
description: Markdown blockquote syntax: start a line with > to quote text. Multi-line, nested and cited quotes, author attribution, code in quotes, Discord and Slack quotes, callouts.
updated: 2026-10-07
related: markdown-code-block, markdown-indent, markdown-comment, markdown-link, markdown-footnotes, markdown-escape-characters, markdown-collapsible-section
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

## How do I quote code or a code block inside a blockquote?

Put the `> ` prefix on every line of the fence, including the opening and closing backticks, and the code block renders inside the quote. For one word of code, use a normal code span (backticks) inside the quoted text.

````markdown
> The installer prints:
>
> ```bash
> npm install docs-md
> ```
>
> Run it from the project root.
````

The same rule applies when the quote itself must be shown as code. To display a blockquote's raw syntax in a document, wrap it in a fenced block, and use four backticks on the outside if the example contains a three-backtick fence, as above. Things that go wrong:

- **A fence line missing its `> `.** The code block ends the quote and the rest renders as unquoted text. Check the opening and closing lines first.
- **Code that itself starts with `>`** (shell prompts, diff output, comparison operators) is fine inside a fence. Outside a fence it starts a quote, so wrap it in backticks.
- **Indented code inside a quote** needs five spaces after the `>` (the `> ` plus four), which is easy to miscount. Prefer fences. See the [code block guide](/guides/markdown-code-block).
- **Syntax highlighting** still works inside the quote: `> ```python` highlights as Python on GitHub.

## How do I add an author or citation to a markdown quote?

Markdown has no attribution syntax, so put the author on a final line inside the same blockquote, separated by an empty `>` line, starting with an em dash. This is the pattern readers recognise everywhere:

```markdown
> Simplicity is prerequisite for reliability.
>
> — Edsger W. Dijkstra
```

> Simplicity is prerequisite for reliability.
>
> — Edsger W. Dijkstra

There are four common ways to cite a source, from simplest to most formal:

| Pattern | Markdown | Notes |
|---|---|---|
| Dash line | `> — Name` | Works in every renderer. Use `--` or `-` if you can't type an em dash. |
| Linked source | `> — [Name, 1975](https://example.com/source)` | Makes the citation clickable. See the [markdown link guide](/guides/markdown-link). |
| Footnote | `> Quote text.[^1]` plus `[^1]: Name, *Title*, p. 12.` | GitHub, Obsidian, Pandoc. Not CommonMark. See the [footnotes guide](/guides/markdown-footnotes). |
| HTML `<cite>` | `> Quote text.` / `>` / `> — <cite>Title</cite>` | Only where inline HTML is allowed; marks the title of a work. |

Two cautions. First, markdown renderers do not treat the dash line specially: it is just a paragraph inside the quote, so style it yourself with italics if you want (`> — *Name*`). Second, the em dash must be real text, not a list marker: starting the line with `- Name` turns it into a bullet. If a line has to begin with a hyphen, use the dash character or escape it (see the [escape characters guide](/guides/markdown-escape-characters)).

For a machine-readable source on a site that passes raw HTML through, write `<blockquote cite="https://example.com">`. The `cite` attribute is invisible to readers, so keep the visible dash line too.

## What are the HTML blockquote and cite equivalents?

Markdown `>` compiles to the HTML `<blockquote>` element, and the `<cite>` element marks the title of the work being quoted. When a renderer allows raw HTML you can write them directly, which gives you things markdown cannot express:

```html
<blockquote cite="https://example.com/essay">
  <p>Simplicity is prerequisite for reliability.</p>
  <footer>— <cite>Edsger W. Dijkstra</cite></footer>
</blockquote>
```

Markdown falls back to HTML in three situations: you need the machine-readable `cite` URL, you need a `<footer>` or `<cite>` element for semantics or styling, or you need a custom class or style on the quote. Raw HTML works in Jekyll, Hugo, Docusaurus, Obsidian and most static site generators. GitHub allows `<blockquote>` and `<cite>` but strips `style` and `class`. Discord, Slack and most chat apps ignore HTML completely and print the tags as text. Rule of thumb: use `>` unless you have a concrete reason to need the HTML.

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

## How do quotes work in Discord, Slack, Teams, Mattermost, Reddit, WhatsApp and Google Docs?

The `>` prefix works in most chat and forum apps, but each app differs on multi-line quotes and nesting, and two (WhatsApp and Google Docs) have no markdown quote at all. This table summarises the current behaviour:

| App | Syntax | Multi-line | Nested | Notes |
|---|---|---|---|---|
| GitHub, GitLab | `> text` | prefix every line | yes, `>>` | `[!NOTE]` alerts on top |
| Obsidian | `> text` | prefix every line | yes | `[!type]` callouts, foldable |
| Discord | `> text` | `>>> text` quotes everything after it | no | The space after `>` is required. Nested `>>` is not supported. |
| Slack | `> text` | `>>> text` for a multi-line block | no | In the message box, typing `> ` converts to a quote. Slack's own mrkdwn uses `>` per line in the API. |
| Microsoft Teams | quote button in the formatting toolbar; `> ` at line start in the compose box | Shift+Enter keeps the quote going | limited | Teams formatting is mostly toolbar-driven, so typed markdown is inconsistent between old and new clients. Test in yours. |
| Mattermost | `> text` | prefix every line | yes, `>>` | Full CommonMark-style markdown, no `>>>` shortcut. |
| Reddit | `> text` | prefix every line | yes, `>>` | The rich-text editor has a quote button; switch to Markdown mode to type `>`. |
| WhatsApp | none | none | none | Uses reply-to-message quoting instead. WhatsApp does format `*bold*`, `_italic_`, `~strike~` and backticks, but has no quote syntax in the composer. |
| Google Docs | none | none | none | No markdown blockquote. Use a paragraph indent and italics, or paste markdown after enabling Tools, Preferences, "Automatically detect Markdown". |
| Notion | `"` then space, or `/quote` | Shift+Enter inside the block | no | Callouts are a separate block type. |

Practical notes per app:

- **Discord**: `> ` quotes one line; `>>> ` at the start of a message quotes everything after it, including later lines. Details in the [Discord markdown guide](/discord-markdown).
- **Slack**: use `>>> ` for several lines, because a plain `> ` quotes only its own line. See the [Slack markdown guide](/slack-markdown).
- **Reddit**: leave a blank line before and after a quote, or the next paragraph is pulled into it.
- **WhatsApp**: hold a message and choose Reply to quote it. Nothing you type at the start of a line creates a quote.
- **Google Docs**: its markdown import is limited and does not give you a styled quote block. Format the paragraph with an indent and a left border, or use a table cell.

Apps change their editors often, so treat the Teams row in particular as a starting point and verify in your own client.

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

## What is the difference between a blockquote and a callout/admonition?

A blockquote is the semantic element for quoted text; a callout (also called an alert or admonition) is a highlighted box for notes and warnings. Plain markdown and CommonMark have no callout, so each tool adds its own marker, usually on top of blockquote syntax or a fence:

| Tool | Syntax |
|---|---|
| GitHub, GitLab | `> [!NOTE]` on its own line, then quoted text (5 types, upper case) |
| Obsidian | `> [!tip] Title` (many types, foldable with `-` or `+`) |
| MkDocs Material | `!!! note "Title"` then an indented body |
| Docusaurus | `:::note` ... `:::` fence |
| Plain markdown, portable | `> **Note:** text` |

Only the GitHub and Obsidian forms are blockquotes underneath. MkDocs and Docusaurus use their own block syntax, which prints as literal text anywhere else. If a document must render in more than one tool, use `> **Note:**`: it is a plain quote everywhere and reads as a callout anyway. For the foldable variants see the [collapsible section guide](/guides/markdown-collapsible-section).

## How long should a blockquote be?

Keep a quote to a sentence or a short paragraph unless the quoted text itself is the point of the document. Long quotes lose the visual "aside" effect, and on GitHub a multi-screen alert box is hard to scan. If you need to reproduce a long passage, quote it in full and add a one-line summary above it in your own words so readers can skip it.

## Does LaTeX have a blockquote?

LaTeX has no blockquote in the markdown sense because LaTeX is a typesetting language, not markdown, but it has two equivalent environments: `quote` for short quotations and `quotation` for longer, multi-paragraph ones (which indent the first line of each paragraph). Write `\begin{quote} ... \end{quote}`. If you convert markdown to PDF with Pandoc, a `>` blockquote is output as a LaTeX `quote` environment automatically. For quotations with a source, the `csquotes` package adds `\blockquote[Source]{text}`.

## What are the best practices for markdown blockquotes?

Prefix every line with `> ` (with the space), keep one idea per quote, add attribution when the words are someone else's, and use the platform's alert markers rather than emoji or bold shouting for notes. Keep quotes short, don't use them for indentation, and test them in the renderer you actually publish to — the platform table above lists the cases where `>` behaves differently.

For everything else in markdown — headings, lists, tables, code, footnotes — see the [markdown cheat sheet](/markdown-cheat-sheet).
