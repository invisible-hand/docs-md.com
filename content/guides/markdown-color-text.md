---
title: Markdown Color Text — How to Change Text Color
h1: Markdown color text: how to change the color of text
description: Markdown has no color syntax. Use <span style> where HTML is allowed, the math color trick or diff blocks on GitHub, Discord ANSI code blocks, Obsidian and Notion options.
updated: 2026-10-07
related: markdown-math, markdown-code-block, markdown-collapsible-section, markdown-quote, markdown-underline
---
Markdown has no syntax for colored text. Where the renderer allows inline HTML and inline styles, wrap the text in a `<span>` with a `style` attribute:

```markdown
This is <span style="color:red">red text</span> in a sentence.
```

That works in Obsidian, Typora, Jekyll, Hugo and most static-site generators and in VS Code's preview, but not on GitHub, which strips `style` attributes, and not in Discord or Slack, which ignore HTML. The workarounds are different for each app: a math expression or a `diff` code block on GitHub, an `ansi` code block on Discord, the text color menu in Notion. This page gives the one that works in each place and says plainly when nothing does.

## Is there a markdown syntax for colored text?

No. Neither CommonMark nor GitHub Flavored Markdown defines color, because markdown describes structure and leaves appearance to CSS. Everything below is a workaround that depends on the renderer. This table lists the options:

| Method | Syntax | GitHub | GitLab | Obsidian | Discord | Slack | Notion | VS Code preview |
|---|---|---|---|---|---|---|---|---|
| Inline style | `<span style="color:red">text</span>` | no (style stripped) | no | yes | no | no | no | yes (usually) |
| Math color | `${\color{red}\textsf{text}}$` | yes | yes | yes | no | no | no | with a math extension |
| Diff code block | a fence labelled `diff`, lines starting `+` or `-` | yes (green, red) | yes | partly | yes (green, red) | no | no | yes |
| ANSI code block | a fence labelled `ansi` with escape codes | no | no | no | yes (desktop and web) | no | no | no |
| Color swatch | `` `#ff0000` `` | yes (issues, PRs, discussions) | yes | no | no | no | no | no |
| Menu or slash command | text color menu, `/red` | n/a | n/a | n/a | n/a | n/a | yes | n/a |

Typora can also color text through the same `<span style>`, and exports it into PDF and HTML.

## How do you color text with HTML in markdown?

Write the text inside a `<span>` and set the CSS `color` property in its `style` attribute. This is the most direct way where the renderer keeps inline styles:

```markdown
<span style="color:#d93025">Error:</span> the build failed.
<span style="color:green">Passed</span>, <span style="background:yellow">highlighted</span>.
```

Use a color name, a hex value or `rgb()`. This is plain HTML, so it also works for background color, font size and weight. Where it renders: Obsidian (reading view and Live Preview), Typora, Jekyll, Hugo, Docusaurus, MkDocs and most blog engines. Where it does not: GitHub and GitLab (the style attribute is removed, the text appears uncolored), Discord, Slack, and any sanitising comment field. The tag is also invisible to people who read the markdown source.

Two cautions. Colour alone should not carry meaning, because colour-blind readers and screen readers miss it, so pair it with a word or symbol. Also, hard-coded colours look wrong in dark mode; pick mid-tone colours or let your theme's CSS set them.

## How do you color text on GitHub?

GitHub does not allow the `style` attribute or `<font color>`, so the usual workarounds are LaTeX colour in maths, a `diff` block, or badges. The math trick uses GitHub's maths support, where the `\color` command sets the colour:

```markdown
${\color{red}\textsf{Red text}}$ and ${\color{#0969da}\textsf{blue text}}$
```

The `\textsf` part keeps normal letters instead of italic maths letters; `$$…$$` also works for a centred block. Limits: the text appears in a maths font, line wrapping is poor, and the trick fails anywhere that does not render math (npm, package pages, other sites that display a README). See the [markdown math guide](/guides/markdown-math).

A diff code block gives green and red lines inside code:

````markdown
```diff
+ This line is green
- This line is red
! This line may be orange or highlighted in some themes
```
````

Beyond those, GitHub offers color swatches (`` `#0969da` `` shows a small colour chip beside the code in issues, pull requests and discussions), coloured alert boxes (`> [!WARNING]`, covered in the [blockquote guide](/guides/markdown-quote)), and badge images from services such as shields.io, which can be any colour. The [badge generator](/markdown-badge-generator) builds them.

## How do you color text in Discord?

Discord has no color syntax in normal messages, but a code block labelled `ansi` shows coloured text. Inside the block, colour comes from ANSI escape sequences: the escape character followed by `[31m` for red, `[32m` for green, `[33m` for yellow, `[34m` for blue, and `[0m` to reset.

````markdown
```ansi
[31mRed[0m, [32mGreen[0m, [34mBlue[0m
```
````

The escape character is invisible and cannot be typed on a normal keyboard. Copy-paste it from a generator or a web tool, or insert it with a Discord-formatting helper. Coloured text is supported on the desktop and web clients; the iOS and Android apps have been inconsistent, so test on your target device. The `diff` block (`+` green, `-` red) works without escape codes and renders everywhere Discord does, as do the highlight-language blocks like `fix`, `css` and `yaml`, which colour parts of a line. See the [Discord markdown guide](/discord-markdown) for more.

## Can you color text in Obsidian, Typora and Notion?

Yes in all three, by different routes. Obsidian renders `<span style="color:red">` in notes and also supports CSS snippets and community plugins that add a colour command or highlight syntax (`==highlighted==` is native highlighting, which gives a yellow background, not a font colour). Typora accepts `<span style>`, and that is the usual method there. Notion has a built-in text and background colour menu: select text and choose a colour from the toolbar, or type `/red` for red text; this is not markdown, and colour has no markdown equivalent, so it is lost when you export to markdown.

## Why is my markdown text color not working?

When colour does not appear, the cause is nearly always that the renderer removed or ignored the style. Check:

1. **On GitHub or GitLab, the style attribute is stripped.** Use the math trick, a diff block, or a badge.
2. **In Discord or Slack, the HTML shows as text.** There is no HTML. Use an `ansi` block on Discord; Slack has none.
3. **A `<font color="red">` tag.** This old tag is also removed or ignored by most sanitisers. Prefer `<span style>` where styles are allowed.
4. **Markdown inside the span is not parsed** in some renderers: `**bold**` inside `<span>` may print asterisks. Put the markdown on the outside, or use `<b>`.
5. **The ANSI code has no escape character.** Pasted text shows `[31m` literally. The invisible ESC byte is required.
6. **The math colour works on GitHub but not in another viewer.** That viewer does not render maths.
7. **Colour disappears in the PDF export.** The exporter may drop inline styles; test the export path.

Use the [markdown viewer](/markdown-viewer) to compare how your markup looks under GitHub-style rendering.

## What are the best practices for coloured text in markdown?

Use colour sparingly and never as the only signal. Prefer semantic markup (bold, a blockquote alert, a code block) over colour where the destination might strip it, keep a plain-text fallback such as "Error:" in front of coloured text, and test the final destination (README, docs site, chat) rather than the editor preview. The [code block guide](/guides/markdown-code-block) covers `diff` and other language labels, and the [markdown cheat sheet](/markdown-cheat-sheet) lists the rest of the syntax.
