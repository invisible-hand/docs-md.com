---
title: Markdown Math — LaTeX Equations in Markdown
h1: Markdown math: how to write equations with $ and $$
description: Markdown math syntax: $x^2$ for inline and $$ blocks for display equations, plus GitHub math fences. Support in GitHub, GitLab, Obsidian, Typora, Jupyter, with LaTeX examples.
updated: 2026-10-07
related: markdown-superscript, markdown-subscript, markdown-escape-characters, markdown-code-block, markdown-color-text
---
To write math in markdown, put a LaTeX expression between single dollar signs for inline math and between double dollar signs on their own lines for a display equation. Math is not part of CommonMark, but GitHub, GitLab, Obsidian, Typora, Jupyter and VS Code all support this convention:

```markdown
Inline: the area is $A = \pi r^2$.

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$
```

The first line renders as inline math inside the sentence, and the `$$` block as a centred equation: the integral of x squared from 0 to 1 equals one third. This page shows the source only, because the math rendering depends on the app that displays your file. The rest of the guide gives the support table, GitHub's extra math code fence, common LaTeX snippets and the problem of literal dollar signs.

## What is the markdown math syntax?

Markdown math uses LaTeX notation inside delimiters, and the renderer (KaTeX or MathJax) draws it. The forms in use:

| Form | Syntax | CommonMark | GitHub | GitLab | Obsidian | Discord | Slack | Notion | VS Code preview |
|---|---|---|---|---|---|---|---|---|---|
| Inline math | `$x^2$` | no | yes | yes | yes | no | no | `$$x^2$$` inline equation | yes (built-in KaTeX) |
| Display math | `$$` on its own lines | no | yes | yes | yes | no | no | `/math` block | yes |
| Math code fence | a fence labelled `math` | no | yes | yes | no | no | no | no | no |
| Backtick-wrapped inline | `` $`x^2`$ `` | no | yes | yes | no | no | no | no | no |
| Jupyter markdown cell | `$x^2$` and `$$...$$` | no | n/a | n/a | n/a | n/a | n/a | n/a | n/a |

Typora supports `$…$` and `$$…$$` but needs Inline Math enabled in its Markdown preferences. Jupyter notebooks use MathJax in markdown cells. Discord and Slack have no maths rendering at all; there you can send an image, a Unicode expression (`x² + y²`), or put the LaTeX in a code block.

## How do you write inline and display math?

Write inline math between single dollar signs with no space just inside the delimiters, and display math between `$$` lines. The no-space rule prevents the renderer from reading prices as maths:

```markdown
The solution is $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$ for each root.

$$
E = mc^2
$$
```

A `$$` block can also be written on a single line (`$$E = mc^2$$`), but separate lines are safer in every renderer. Display math is centred and larger and can contain multiple lines with `\\` line breaks and the `aligned` environment, shown below.

## How does GitHub render math?

GitHub renders `$…$`, `$$…$$` and a `math` code fence in READMEs, issues, pull requests, discussions and wikis, using MathJax. The code fence is useful when the maths contains characters markdown would otherwise interpret:

````markdown
```math
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
```
````

GitHub's extra rule for inline maths: when an expression contains characters such as `_` or `*` that markdown could read as emphasis, or sits next to ordinary dollar signs, wrap it as `` $`a_i * b_i`$ ``, with backticks inside the dollars. This keeps the contents verbatim. GitHub does not run maths inside ordinary code spans or code blocks; only the `math` fence is rendered. Rendering in other tools, such as `github.com` mirrors, npm and package registries, varies, so a README that relies on maths can look broken outside GitHub.

## Which other tools support markdown math?

Obsidian, Typora, VS Code, GitLab and Jupyter all support it, with small differences:

- **GitLab**: `$…$`, `$$…$$` and a `math` fence in wikis, issues and merge requests, drawn with KaTeX.
- **Obsidian**: MathJax; `$…$` inline and `$$…$$` blocks work in notes without plugins.
- **Typora**: enable Inline Math under Preferences, Markdown; block `$$` works by default.
- **VS Code**: the built-in markdown preview renders KaTeX math; the setting is `markdown.math.enabled`.
- **Jupyter and Quarto**: MathJax in markdown cells, including `\begin{align}` environments.
- **Pandoc and Hugo**: convert with the `--mathjax` or `--katex` flag, or enable passthrough markup in the site config.
- **Notion**: type `$$expression$$` for an inline equation and `/math` for a block equation.

Because KaTeX and MathJax support slightly different LaTeX commands, a formula that works in one may fail in another; keep to common commands for portable documents.

## What are some common LaTeX snippets for markdown math?

These are the snippets most people need, all valid in KaTeX and MathJax:

```markdown
Fraction:        $\frac{a}{b}$
Square root:     $\sqrt{x}$, $\sqrt[3]{x}$
Superscript:     $x^{2}$, $e^{-x}$
Subscript:       $x_{i}$, $a_{n+1}$
Sum:             $\sum_{i=1}^{n} x_i$
Integral:        $\int_{a}^{b} f(x)\,dx$
Greek letters:   $\alpha, \beta, \gamma, \pi, \Omega$
Not equal, <=:   $\neq$, $\leq$, $\geq$
Text in maths:   $\text{speed} = \frac{d}{t}$

Matrix (display block):
$$
\begin{pmatrix} a & b \\ c & d \end{pmatrix}
$$

Aligned equations (display block):
$$
\begin{aligned}
y &= mx + b \\
  &= 2x + 1
\end{aligned}
$$
```

Use braces to group more than one character in a superscript or subscript: `x^{10}` is correct, `x^10` raises only the 1. For the plain-text alternatives, see the [superscript guide](/guides/markdown-superscript) and the [subscript guide](/guides/markdown-subscript).

## How do you write a literal dollar sign in a markdown math document?

Escape it as `\$` or put it in a code span. In a renderer with maths enabled, two unescaped dollar signs in one paragraph can capture the text between them as an equation, so "costs $5 and $10" turns into a mangled formula. Write "costs \$5 and \$10", or put the amounts in backticks, which is the safest option. Pandoc also refuses to open a maths span when the opening `$` is followed by a space, but do not rely on that elsewhere. Details of backslash escapes are in the [escape characters guide](/guides/markdown-escape-characters).

## Why is my markdown math not rendering?

When maths shows as raw dollar signs or code, one of these is the cause:

1. **The renderer has no maths support.** CommonMark, Discord, Slack and many comment fields print `$x^2$` literally.
2. **Space just inside the dollars.** `$ x^2 $` is not recognised in Pandoc and GitHub; write `$x^2$`.
3. **Math inside a code span or code block.** Code is verbatim. The exception is GitHub's `math` fence.
4. **Underscores and asterisks consumed by markdown.** `a_i * b_i` can become italics before the math parser sees it. Use the `` $`...`$ `` form on GitHub, or escape with backslashes in other renderers.
5. **A command KaTeX does not support**, shown as a red error. Replace it or switch to MathJax.
6. **A blank line inside a `$$` block** splits it in some renderers. Remove blank lines inside.
7. **Dollar amounts elsewhere in the paragraph** are paired as delimiters. Escape them.
8. **A line break in an inline expression** does not render in some editors; keep inline maths on one line.

## What are the best practices for math in markdown?

Use `$…$` for short expressions and `$$` blocks for anything with a fraction, sum or matrix; keep delimiters tight against the maths; escape real dollar signs; and avoid fancy LaTeX packages. Test in the renderer you publish to, and keep an image or plain-text fallback when the document goes to apps with no maths support. The [markdown cheat sheet](/markdown-cheat-sheet) has the rest of the syntax, and the [color text guide](/guides/markdown-color-text) shows a way to use maths to colour text on GitHub.
