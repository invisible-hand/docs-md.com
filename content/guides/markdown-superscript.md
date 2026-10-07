---
title: Markdown Superscript — How to Write x² and 1st
h1: Markdown superscript: how to write text above the line
description: Markdown superscript syntax: ^text^ in Pandoc and Typora, <sup>text</sup> on GitHub and GitLab, Unicode ² characters in chat apps. Support table and fixes.
updated: 2026-10-07
related: markdown-subscript, markdown-footnotes, markdown-math, markdown-escape-characters, markdown-strikethrough
---
Standard markdown has no superscript syntax, so the answer depends on where the text will render. The one form that works almost everywhere HTML is allowed, including GitHub and GitLab, is the `<sup>` tag:

```markdown
E = mc<sup>2</sup> and the 1<sup>st</sup> of May
```

On GitHub that renders as E = mc² and the 1st of May, with the 2 and the "st" raised. (This page shows only the source, because the Unicode version `E = mc²` is what chat apps need.)

The shorter `^text^` form (`E = mc^2^`) works in Pandoc, Typora (when enabled) and a few other extended flavours, but not in CommonMark, GitHub, Discord or Slack. This guide gives the syntax for each renderer, the Unicode fallback for chat apps, and the difference between a superscript and a footnote mark. For the opposite direction see the [subscript guide](/guides/markdown-subscript).

## What is the markdown superscript syntax?

There are three ways to get superscript text, and which one works depends on the renderer rather than on markdown itself. This table lists each form and where it renders:

| Method | Syntax | CommonMark | GitHub | GitLab | Obsidian | Discord | Slack | Notion | VS Code preview |
|---|---|---|---|---|---|---|---|---|---|
| HTML tag | `x<sup>2</sup>` | if HTML allowed | yes | yes | yes | no | no | no | yes |
| Caret syntax | `x^2^` | no | no | no | no (plugin) | no | no | no | no (extension needed) |
| Math notation | `$x^2$` | no | yes | yes | yes | no | no | inline equation | no (extension needed) |
| Unicode characters | `x²` | yes | yes | yes | yes | yes | yes | yes | yes |

Pandoc and Typora also support the caret form; Typora needs Syntax Support turned on in its preferences. Notion has no sup tag, but its inline equation (`/equation` or `$$`) renders `x^2` as superscript. "Needs plugin" means the base app ignores it and an extension adds it. If you publish to several places, the Unicode characters or a math expression are the only forms that never break.

## How do you write superscript with the HTML sup tag?

Wrap the text in `<sup>` and `</sup>`. The tag is inline HTML, so it works inside a sentence, a heading, a list item or a table cell, and it needs no blank lines around it:

```markdown
Area is measured in m<sup>2</sup>, and footnote-style marks look like this<sup>1</sup>.
```

GitHub, GitLab, Bitbucket, Jekyll, Hugo, Docusaurus and the Obsidian reader accept it. The tag does not work in chat apps (Discord and Slack print the tag literally) and in sanitised comment boxes that strip HTML. Inside a table on GitHub it works. Inside a code span or a code block it is shown as literal text, which is what you want when you are documenting the syntax itself.

## How does the caret ^text^ superscript syntax work?

In Pandoc markdown and Typora, text between two carets becomes superscript: `H^2^` has a superscript 2. The text between the carets cannot contain spaces. To include a space, escape it with a backslash, `x^a\ b^`, or use `<sup>` instead.

```markdown
The 2^nd^ and 3^rd^ places. Area: 5 m^2^.
```

Pandoc converts that to HTML `<sup>`, LaTeX `\textsuperscript`, or the Word superscript style depending on output format, so it is the best choice if you convert with Pandoc to PDF or .docx. Check your renderer first: GitHub and CommonMark show the carets as plain characters. Some wikis (MultiMarkdown 6) use the same syntax; PHP Markdown Extra does not.

A caret has other meanings elsewhere: in Obsidian `^block-id` at the end of a line creates a block reference, and in Pandoc and many renderers `^[text]` is an inline footnote. Mixing the syntaxes causes surprises, as the footnote section below explains.

## Can you write superscript with Unicode characters?

Yes: paste the Unicode superscript characters `⁰ ¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ⁺ ⁻ ⁿ`, and `m²`, `x³` or `10⁻⁶` render in every app that displays Unicode text, including Discord, Slack, WhatsApp, email and plain-text fields. Letters are partial: lowercase `ⁿ`, `ⁱ`, and the ordinal marks `ª º` exist, along with several others like `ᵃ ᵇ ᶜ ᵈ ᵉ`, but the alphabet is incomplete, so `1ˢᵗ`, `2ⁿᵈ` and `3ʳᵈ` work and arbitrary words will not.

The trade-offs: Unicode superscripts are text, not formatting. They cannot be nested, they may appear with different weight or size in some fonts, search treats `m²` and `m2` as different strings, and screen readers read `m²` as "m squared" but may read other characters oddly. For maths of any complexity use [math notation](/guides/markdown-math); for an occasional exponent in chat, the Unicode form is the best option.

## How do you write superscript on GitHub?

Use `<sup>text</sup>` or, for a number or formula, GitHub's math support: `$x^2$` inline. GitHub README, issues, pull requests and wikis all render `<sup>`. Its footnote syntax `[^1]` also produces a superscript number, but it adds a footnote section at the bottom of the page. For a chemical formula or a unit, `$m^2$` and `m<sup>2</sup>` look different (math italic versus normal font); choose the tag for prose and units. GitHub removes `style` and `class` attributes, so you cannot restyle the superscript.

## What is the difference between superscript and a footnote?

A superscript is formatting that raises any text; a footnote mark is a link to a note at the end of the page, and renderers display it as a superscript number automatically. Use real footnotes when you want a reference, and `<sup>` when the raised text is the content, such as an exponent or an ordinal.

```markdown
Markdown was created in 2004.[^1]

[^1]: By John Gruber, with Aaron Swartz.
```

Footnotes are covered in the [footnotes guide](/guides/markdown-footnotes). Do not fake a footnote with `<sup>1</sup>`: it is not a link, it will not jump to the note, and readers cannot get back.

## Why is my markdown superscript not working?

When superscript fails, the cause is almost always that the renderer does not support the form you used. Work through these checks:

1. **Carets show as literal `^`.** The renderer is CommonMark or GFM. Switch to `<sup>` or math.
2. **`<sup>` shows as literal text.** The app strips HTML (Discord, Slack, many comment boxes). Use Unicode characters.
3. **Caret syntax breaks on a space.** `x^a b^` does not work in Pandoc; write `x^a\ b^` or use `<sup>`.
4. **Superscript inside a code span.** Code is literal. Move the tag out of the backticks.
5. **Superscript renders in the editor but not in the exported PDF.** The preview and the exporter use different parsers. Pandoc handles `^` but not every PDF converter does; test the export path.
6. **Obsidian shows nothing special.** Obsidian has no caret superscript natively. Use `<sup>` or a plugin.

You can check how any form renders in the [markdown viewer](/markdown-viewer), which uses GFM rules.

## What are the best practices for superscript in markdown?

Choose the form for the destination, not for convenience: `<sup>` for GitHub and static sites, caret syntax for Pandoc workflows, Unicode for chat, and `$…$` for real mathematics. Keep superscripts short, never use them as a substitute for footnotes, and avoid them in headings if the heading is used for anchors. The [markdown cheat sheet](/markdown-cheat-sheet) summarises every other inline format, and the [escape characters guide](/guides/markdown-escape-characters) shows how to print a literal `^`.
