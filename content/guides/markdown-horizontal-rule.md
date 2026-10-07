---
title: Markdown Horizontal Rule — Divider Line Syntax
h1: Markdown horizontal rule: how to add a divider line
description: Markdown horizontal rule syntax: three or more hyphens, asterisks or underscores on a line of their own. Fix the --- heading and front matter pitfall, spacing and styling.
updated: 2026-10-07
related: markdown-page-break, markdown-bullet-points, markdown-new-line, markdown-escape-characters, markdown-quote
---
To add a horizontal rule in markdown, put three or more hyphens, asterisks or underscores on a line of their own, with a blank line above it:

```markdown
Above the line

---

Below the line
```

Above the line

---

Below the line

The renderer turns this into an HTML `<hr>` element, a thematic break that most stylesheets draw as a thin line across the page. The blank line before the rule matters more than the characters you choose: directly under a line of text, `---` does not draw a line, it turns that text into a heading. This guide covers the syntax, that pitfall, the front-matter confusion, spacing rules, styling and support in each app.

## What is the markdown horizontal rule syntax?

A horizontal rule is a line containing only three or more of the same character (`-`, `*` or `_`), optionally separated by spaces. The CommonMark spec calls it a thematic break. This table shows the accepted forms and where each works:

| Syntax | Result | CommonMark | GitHub | GitLab | Obsidian | Discord | Slack | Notion | VS Code preview |
|---|---|---|---|---|---|---|---|---|---|
| `---` | rule | yes | yes | yes | yes | no | no | yes (converts to divider) | yes |
| `***` | rule | yes | yes | yes | yes | no | no | yes | yes |
| `___` | rule | yes | yes | yes | yes | no | no | yes | yes |
| `- - -` | rule | yes | yes | yes | yes | no | no | n/a | yes |
| `<hr>` | rule | if HTML allowed | yes | yes | yes | no | no | no | yes |
| `----------` (longer) | rule | yes | yes | yes | yes | no | no | n/a | yes |
| `--` (two) | text | not a rule | text | text | text | text | text | text | text |

Discord and Slack do not support horizontal rules at all; a line of `---` shows as plain text. Notion turns `---` into its divider block as you type. Use at least three characters, do not mix them (`-*-` is not a rule), and keep up to three leading spaces at most: four spaces make it a code block.

## What is the difference between ---, *** and ___?

There is none in output: all three produce the same `<hr>`. The differences are habit and risk. `---` is the most common, but it is also the Setext heading underline and the YAML front matter delimiter, so it is the one that can misfire. `***` and `___` have no other meaning (apart from `***` being bold italics when wrapped around text), so some writers prefer them for safety. Many style guides standardise on `---` and require a blank line around it; a linter such as the [markdown lint tool](/markdown-lint) can enforce the choice.

## Why does --- under my text make a heading instead of a line?

Because in markdown a line of hyphens directly under a paragraph is the Setext heading syntax: the paragraph above becomes an `<h2>`. The fix is a blank line between the text and the dashes.

```markdown
This becomes a heading
---

This stays text

---
```

The first block renders as a large H2 with no line; the second renders as text followed by a rule. A line of equals signs (`===`) does the same for an H1. `***` directly after text does not create a heading, so it is a safe alternative when you cannot add a blank line. This is the most common reason that "my horizontal line doesn't work" or "my text turned big".

## How does --- interact with front matter?

At the very top of a file, `---` starts YAML front matter in Jekyll, Hugo, Docusaurus, Obsidian and many other tools, and it must be closed by a second `---`. Everything between is metadata, not content. If the first line of your markdown is `---` and the next lines are not valid YAML, those tools may swallow your text or report an error:

```markdown
---
title: My page
---

First paragraph. This is the body.

---

A rule inside the body is fine.
```

Rules that avoid the clash: never start a document with `---` unless you mean front matter, put a blank line before every later `---`, and use `***` for the first element if you need a rule at the top. GitHub renders front matter in `.md` files as a small table at the top, rather than a rule, so a stray `---` at the start of a README may show up as an odd box. In the [front matter generator](/front-matter-generator) you can build valid blocks.

## Do you need blank lines and spaces around a horizontal rule?

Put a blank line before and after the rule in every case. Before: it avoids the Setext heading problem. After: some renderers pull the next line into the rule's block. Beyond that, CommonMark is relaxed about the characters themselves: you can use spaces or tabs between them (`* * *`, `- - -`), up to three spaces of indentation in front, and any number of extra characters, so `----------` is still a rule. In a list, a rule needs to be at the list text indentation to stay inside the item; otherwise it ends the list.

The rule also needs to be on its own line. `text --- text` is plain text, and in a table cell it is not a rule at all (use `<hr>` in HTML-friendly renderers or a plain row instead).

## How do you style a horizontal rule?

In markdown you cannot: the output is a bare `<hr>` and the look comes from CSS. On your own site, target the element:

```css
hr {
  border: 0;
  height: 1px;
  background: #d1d5db;
  margin: 2rem 0;
}
```

In places where you do not control CSS (GitHub, GitLab, chat tools) the rule has the app's default style, and `style` or `class` on an `<hr>` is removed. For a heavier divider on GitHub, use a heading, a blockquote or an image. Pandoc draws a horizontal line in each output format (HTML `<hr>`, a LaTeX rule in PDF, a line in Word) and you can customise it with a template or filter.

## Is a horizontal rule the same as a page break?

No. A horizontal rule draws a line on the screen; it does not start a new page in a PDF or Word export. For page breaks see the [page break guide](/guides/markdown-page-break), which covers the HTML, Pandoc and editor options.

## Why is my horizontal rule not working?

When a rule does not appear, one of these is the reason. Check them in order:

1. **No blank line above it**, so `---` became a Setext heading. Add the blank line or use `***`.
2. **Fewer than three characters.** `--` is text.
3. **Mixed characters or other text on the line.** `-*-` and `--- x` are not rules.
4. **Four or more leading spaces**, making a code block. Remove the indentation.
5. **The app has no horizontal rule.** Discord and Slack show the dashes literally. Use a line of Unicode box characters (`────────`) or a blank line.
6. **The `---` is at the top of the file** and a tool reads it as front matter.
7. **Inside a table.** GFM tables have no rules; use a separate paragraph.
8. **A very long `---` line wraps** in a narrow viewer and looks broken, but the rule is fine.

Paste your document into the [markdown viewer](/markdown-viewer) to check how a GFM renderer reads it.

## What are the best practices for horizontal rules in markdown?

Use `---` with a blank line before and after it, use rules to separate topic changes and not as decoration between every section (headings already do that), and avoid them in the first line of a file. Do not use a rule to create vertical space or a page break. The [markdown cheat sheet](/markdown-cheat-sheet) lists all the block elements.
