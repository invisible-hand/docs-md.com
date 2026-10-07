---
title: Markdown Subscript — How to Write H₂O
h1: Markdown subscript: how to write text below the line
description: Markdown subscript syntax: <sub>text</sub> on GitHub, ~text~ in Pandoc and Typora, Unicode H₂O in chat apps. Why ~ clashes with strikethrough, with a support table.
updated: 2026-10-07
related: markdown-superscript, markdown-math, markdown-strikethrough, markdown-footnotes, markdown-escape-characters
---
Standard markdown has no subscript syntax, so the portable answer is the HTML `<sub>` tag, which works on GitHub, GitLab and most static-site generators:

```markdown
Water is H<sub>2</sub>O and carbon dioxide is CO<sub>2</sub>.
```

On GitHub that renders with the 2 lowered: water is H₂O and carbon dioxide is CO₂. (This page shows only the source; the Unicode digits in that sentence work in chat apps.)

The short form `H~2~O` works in Pandoc, Typora and MultiMarkdown, but it collides with strikethrough on GitHub, where single tildes mean something else. This guide covers each renderer, the Unicode digits that work in chat apps, and chemistry and maths formulas. The reverse effect is in the [superscript guide](/guides/markdown-superscript).

## What is the markdown subscript syntax?

There are four ways to write subscript, and the right one depends on the renderer rather than on markdown itself. This table shows each form and where it renders:

| Method | Syntax | CommonMark | GitHub | GitLab | Obsidian | Discord | Slack | Notion | VS Code preview |
|---|---|---|---|---|---|---|---|---|---|
| HTML tag | `H<sub>2</sub>O` | if HTML allowed | yes | yes | yes | no | no | no | yes |
| Tilde syntax | `H~2~O` | no | no (strikethrough) | no (strikethrough) | no | no | no | no | no (extension needed) |
| Math notation | `H$_2$O` | no | yes | yes | yes | no | no | inline equation | no (extension needed) |
| Unicode characters | `H₂O` | yes | yes | yes | yes | yes | yes | yes | yes |

Pandoc, Typora (with the option enabled) and MultiMarkdown 6 support the tilde form. If you publish in more than one place, the Unicode characters or math notation are the only forms that never fail.

## How do you write subscript with the HTML sub tag?

Wrap the text in `<sub>` and `</sub>`; it is inline HTML, so it works inside sentences, headings, list items and table cells. Write `H<sub>2</sub>O` with no spaces around the tag. GitHub, GitLab, Bitbucket, Jekyll, Hugo, Docusaurus and the Obsidian reader accept it, but chat apps such as Discord and Slack show the tags as literal text, and sanitised comment boxes may strip them.

```markdown
x<sub>i</sub> + x<sub>i+1</sub> = y<sub>i</sub>
```

GitHub strips `style` and `class` attributes, so you cannot adjust the offset. Inside a code span the tag is literal.

## Why does ~ subscript clash with strikethrough?

The tilde has two meanings in markdown flavours, so `~text~` is subscript in one renderer and strikethrough in another. GitHub Flavored Markdown renders `~~text~~` as strikethrough, and the GFM spec also accepts a single-tilde pair `~text~` as strikethrough, so `H~2~O` on GitHub gives you H with a struck-through 2. In Pandoc, `~text~` is subscript and `~~text~~` is strikethrough, and Typora follows the same split when both options are enabled.

```markdown
Pandoc:  H~2~O      -> H₂O (subscript)
GitHub:  H~2~O      -> H with struck-through 2
```

Practical consequences: never use the tilde form in a document that could be read on GitHub, and Obsidian uses only `~~` for strikethrough and shows single tildes literally. Pandoc also disallows spaces inside the tildes, so write `x~a\ b~` with an escaped space. See the [strikethrough guide](/guides/markdown-strikethrough) for the full story on the tilde.

## Can you write subscript with Unicode characters?

Yes: paste the Unicode subscript digits `₀ ₁ ₂ ₃ ₄ ₅ ₆ ₇ ₈ ₉`, the signs `₊ ₋ ₌ ₍ ₎`, and a limited set of letters (`ₐ ₑ ₒ ₓ ₕ ₖ ₗ ₘ ₙ ₚ ₛ ₜ`). They render in every app that displays Unicode, including Discord, Slack, WhatsApp, email and plain fields, so `H₂O`, `CO₂`, `x₁` and `a₍ₙ₎` all work. Unicode has no subscript for most letters, so a subscript like `x_max` cannot be written this way.

Trade-offs: the characters are text, not formatting, so some fonts draw them smaller or lighter, search treats `H₂O` and `H2O` as different words, and screen readers may pronounce them oddly. For formulas used in documents that people search, `H<sub>2</sub>O` or the plain `H2O` is safer; for chat, Unicode is the best option.

## How do you write chemical formulas and maths subscripts?

For chemistry, use `<sub>` in documents (`C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>`) or Unicode in chat (`C₆H₁₂O₆`). For maths on GitHub, GitLab, Obsidian, Typora and Jupyter, write the formula in LaTeX math with an underscore for subscript:

```markdown
Inline: $x_i$, $a_{n+1}$, and $\mathrm{H_2O}$

$$
\sum_{i=1}^{n} x_i
$$
```

The braces group more than one character: `a_{n+1}` subscripts all of `n+1`, while `a_n+1` only subscripts `n`. The [markdown math guide](/guides/markdown-math) covers the delimiters and where each works. On GitHub, `H$_2$O` also gives a subscript inside running text, though the math font differs slightly from the body font.

## What is the difference between subscript and a footnote or index?

A subscript lowers the text and carries meaning in the formula, such as the 2 in H₂O; a footnote mark is a link to a note, and renderers display it as a raised number. They look different and are not interchangeable. Footnotes are in the [footnotes guide](/guides/markdown-footnotes), and raised text is in the [superscript guide](/guides/markdown-superscript).

## Why is my markdown subscript not working?

When subscript fails, the renderer almost always does not support the form you used. Check in this order:

1. **Tildes show up as strikethrough or as literal `~`.** GitHub and CommonMark do not do tilde subscripts. Switch to `<sub>`.
2. **`<sub>` appears literally.** The app strips HTML (Discord, Slack, many comment fields). Use Unicode digits.
3. **A space inside Pandoc tildes.** `H~a b~` fails; escape the space as `\ ` or use the tag.
4. **The subscript is inside backticks.** Code spans are literal. Take the tag out of the backticks.
5. **An underscore in plain text turns into italics.** In `x_i y_j` on some renderers the text between underscores is emphasised. Use `<sub>`, math notation, or escape the underscore with a backslash (see the [escape guide](/guides/markdown-escape-characters)).
6. **Math subscript displays raw `$` signs.** The renderer lacks math support; the app may need KaTeX or MathJax turned on.

The [markdown viewer](/markdown-viewer) renders GFM, so you can see what GitHub would do.

## What are the best practices for subscript in markdown?

Pick the form for the destination: `<sub>` for GitHub and static sites, Pandoc tildes only in a Pandoc workflow, Unicode for chat, and `$…$` for real maths. Never rely on single tildes in a document that others may open elsewhere, keep subscripts short, and test in the final renderer. The [markdown cheat sheet](/markdown-cheat-sheet) lists every other inline format.
