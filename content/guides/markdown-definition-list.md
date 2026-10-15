---
title: Markdown Definition List — Syntax, GitHub Fallback, When to Use
h1: How to make a definition list in markdown
description: Definition list syntax (term on one line, : definition on the next) in Markdown Extra, Pandoc, kramdown and GitLab. GitHub has none: use a bold term with an indented paragraph or an HTML <dl>. When a table is better.
updated: 2026-10-15
related: markdown-table, markdown-bullet-points, markdown-indent, markdown-nested-list, markdown-bold-italic, markdown-footnotes
---
To make a definition list in markdown, write the term on its own line and the definition on the next line, starting with a colon and a space. This works in Markdown Extra, Pandoc, kramdown (Jekyll), Python-Markdown, MkDocs and GitLab, but not on GitHub:

```markdown
Term
: Definition of the term.

Another term
: First definition.
: Second definition of the same term.
```

The output is an HTML `<dl>` with `<dt>` terms and `<dd>` definitions, the element HTML has always had for glossaries and metadata lists. Because the syntax is an extension rather than part of CommonMark, the second half of this guide is about what to do on GitHub and the other renderers that print the colons literally.

## What is the definition list syntax in Markdown Extra and Pandoc?

The term is a plain paragraph line; each definition is a line that starts with `:` (indented up to three spaces), then one or more spaces, then the text. The main implementations agree on that core and differ on the details:

| Rule | Markdown Extra | Pandoc | kramdown |
|---|---|---|---|
| Definition marker | `:` | `:` or `~` | `:` |
| Blank line between term and definition | Optional; present makes the definition a `<p>` | Optional; present gives a loose (spaced) list | Optional |
| Blank line before a new term | Required | Required | Not required |
| Several definitions per term | Yes, repeat the `:` lines | Yes | Yes |
| Several terms per definition | Yes, consecutive term lines | Yes | Yes, each line of the paragraph is a term |
| Multi-paragraph definitions | Indent continuation blocks under the definition | Indent to the content column (or four spaces) | Indent to the content column |
| Lazy wrapping | Yes | Yes | Yes |
| Source | [Markdown Extra](https://michelf.ca/projects/php-markdown/extra/#def-list) | [Pandoc manual](https://pandoc.org/MANUAL.html#definition-lists) | [kramdown syntax](https://kramdown.gettalong.org/syntax.html#definition-lists) |

A definition can contain other blocks (a second paragraph, a code block, a nested list) as long as they are indented so they sit under the definition's text. GitLab adds its own support in version 17.7 with the same term-then-colon shape, with the note that its rich text editor cannot insert one, so you write it in the plain text editor ([GitLab docs](https://docs.gitlab.com/ee/user/markdown.html#description-lists)).

## Does GitHub support definition lists?

No. GitHub Flavored Markdown has no definition list extension, so the text above renders as paragraphs with a leading colon. GitHub's HTML sanitiser does keep `<dl>`, `<dt>` and `<dd>`, so the HTML form renders:

```html
<dl>
  <dt>Term</dt>
  <dd>Definition of the term.</dd>
  <dt>Another term</dt>
  <dd>First definition.</dd>
  <dd>Second definition.</dd>
</dl>
```

GitHub's default stylesheet indents `<dd>` and bolds `<dt>`, so it looks like a definition list should. Markdown inside the tags is not parsed (write plain text or inline HTML), and the block needs a blank line before and after it. Where HTML is also unavailable, use the plain-markdown pattern in the next section.

## What is the portable fallback for a definition list?

A bold term followed by an indented paragraph. It is plain CommonMark, so it renders everywhere, and it reads like a definition list without being one:

```markdown
**Term**
: Definition in apps that support it, literal colon elsewhere.

**Term**  
Definition on the next line after a hard break (two trailing spaces).

- **Term** — definition in the same bullet.
```

**Term**  
Definition on the next line after a hard break (two trailing spaces).

- **Term** — definition in the same bullet.

The bulleted form is the most common in READMEs because it survives every renderer, including Slack and Discord, and keeps term and definition on one line. The hard-break form puts the definition on its own line in CommonMark renderers but collapses to one line where trailing spaces are stripped (see the [new line guide](/guides/markdown-new-line)). A trick that works in both camps is to write `**Term**` then `: definition`: Markdown Extra tools produce a `<dl>`, and GitHub shows a bold term followed by a colon and the text, which is still readable.

## How do you write a definition with several paragraphs or code?

Indent the extra blocks so they line up with the first character after the colon marker. Both Markdown Extra and Pandoc treat the content column as the indent that continues the definition; four spaces is the safe choice because it satisfies every implementation:

```markdown
`--verbose`
:   Print every file as it is processed.

    Combine with `--dry-run` to see what would change:

        tool --verbose --dry-run
```

Pandoc also accepts the `~` marker and, like Markdown Extra, treats a blank line before the definition as a request for paragraph spacing. Keep the pattern consistent within a list: mixing compact (`Term` directly followed by `: def`) and loose (blank line between) items produces uneven spacing in Pandoc's output.

## When should you use a table instead of a definition list?

Use a definition list when each term has one free-form definition that may run to several sentences, and a table when every term has the same two or three short attributes. The decision in practice:

| Situation | Use | Why |
|---|---|---|
| Glossary, CLI flags with prose explanations | Definition list (or bold-term fallback) | Definitions wrap and can hold code blocks |
| Config keys with type, default and description | [Table](/guides/markdown-table) | Three aligned columns scan faster than prose |
| Metadata (Author, Version, License) | Definition list in Markdown Extra tools; bold-term bullets on GitHub | Short pairs, no need for a header row |
| Content that must render on GitHub, Slack and Discord | Bulleted list with bold terms | Only form that renders everywhere |
| Content that must be sortable or sortable later | Table | Rows are data; definitions are prose |

The [markdown table generator](/markdown-table-generator) builds the table version from a pasted list of pairs. If you are converting an existing `<dl>` from HTML, the [HTML to markdown converter](/html-to-markdown) turns it into the bold-term form.

## Why does my definition list render as plain text?

Because the renderer does not support the extension (GitHub, Obsidian, Discord, Slack, Reddit, Notion, Hugo's default Goldmark), or because the syntax is off by one line. Check these:

1. **Platform.** GitHub is the usual answer; use `<dl>` or the bold-term pattern.
2. **No space after the colon.** `:Definition` is not a marker; write `: Definition`.
3. **Term and definition separated by more than one blank line.** One is allowed, two end the paragraph.
4. **Colon indented four spaces.** That is a code block. Up to three spaces are fine.
5. **Extension not enabled.** Python-Markdown and MkDocs need `def_list` in the extensions list; Hugo needs the `definitionList` Goldmark extension (on by default in recent versions, off in some themes' configs).

The [markdown viewer](/markdown-viewer) uses GitHub's rules, so a definition list that shows colons there is behaving as GitHub will. For the full syntax reference see the [markdown cheat sheet](/markdown-cheat-sheet).
