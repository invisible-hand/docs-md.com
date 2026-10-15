---
title: Center Text in Markdown — align="center" and Where It Works
h1: How to center text in markdown
description: Markdown has no centering syntax. Use <div align="center"> or <p align="center"> on GitHub (style= is stripped), center images and headings, table columns with :---:, and see which apps ignore it.
updated: 2026-10-15
related: markdown-image, markdown-table, markdown-headings, markdown-underline, markdown-color-text, markdown-highlight
---
Markdown cannot center text; it has no alignment syntax at all. Where inline HTML is allowed (GitHub READMEs, GitLab, Obsidian, most documentation generators), wrap the content in a block with the `align` attribute:

```markdown
<div align="center">

This paragraph is centered, and **markdown inside it still renders** because of the blank lines.

</div>
```

On GitHub the paragraph sits in the middle of the page with the bold text rendered. That is the whole technique. What varies is which attribute each platform keeps (`align` survives on GitHub, `style` does not), whether markdown inside the block is still parsed, and which apps strip the HTML entirely so that centering is simply unavailable. Those are the questions below.

## What's the most compatible way to center on GitHub?

The legacy `align="center"` attribute, not CSS. GitHub's sanitizer removes `style=` from every element, so `<div style="text-align: center">` renders left-aligned, while `align` is on the attribute allowlist of the [html-pipeline sanitizer](https://github.com/gjtorikian/html-pipeline/blob/main/lib/html_pipeline/sanitization_filter.rb) GitHub uses and is kept on any element:

```markdown
<p align="center">
  <img src="logo.png" alt="Project logo" width="200">
</p>

<p align="center">
  <a href="https://example.com/docs">Docs</a> ·
  <a href="https://example.com/discord">Community</a> ·
  <a href="LICENSE">License</a>
</p>
```

That pattern, a centered logo followed by a centered link or badge row, opens a large share of popular READMEs. Note the content inside `<p align="center">` is HTML, not markdown: `[Docs](url)` inside it would print literally on GitHub, which is why the links above are `<a>` tags. The `align` attribute is obsolete in HTML5 but every browser still honours it, and that obsolescence is exactly why it slips through sanitizers that strip CSS.

## Does markdown inside a centered block still render?

Only if you leave a blank line after the opening tag and before the closing tag. CommonMark's [HTML block rule](https://spec.commonmark.org/0.31.2/#html-blocks) says a `<div>` starts a raw HTML block that continues until a blank line; everything before that blank line is passed through as HTML, so `**bold**` on the line right after `<div align="center">` prints with its asterisks. Put the blank line in and the markdown between the tags is parsed normally:

```markdown
<div align="center">
**Not bold on GitHub** (no blank line)
</div>

<div align="center">

**Bold on GitHub** (blank lines around the content)

</div>
```

GitLab follows the same rule. Obsidian does not render markdown inside HTML blocks at all, blank lines or not, so inside a `<div>` write HTML (`<b>`, `<a>`, `<img>`). MDX is the opposite case: everything inside a JSX element is still MDX, so markdown works without the blank lines.

## Can you center a heading?

Yes, with the attribute directly on an HTML heading, because markdown `#` headings cannot take attributes:

```markdown
<h1 align="center">Project Name</h1>
<p align="center"><em>A short tagline under the title</em></p>
```

The trade-off is anchors: GitHub generates `#project-name` for a markdown heading but not for a raw `<h1>`, so links to the section from a table of contents break, and Obsidian leaves HTML headings out of its outline. If the heading needs to be linkable, give it an explicit id (`<h1 id="project-name" align="center">`), which GitHub keeps, or center only the logo and keep the title as a markdown H1. The [headings guide](/guides/markdown-headings) and [anchor link guide](/guides/markdown-anchor-link) cover how anchors are generated.

## Can you center an image?

Yes, and it is the most common reason to center anything. Wrap the `<img>` in `<p align="center">` as above, or on platforms with their own image attributes use those:

| Platform | Center an image |
|---|---|
| GitHub, GitLab | `<p align="center"><img src="x.png" width="200"></p>` |
| Obsidian | `<p align="center"><img src="x.png"></p>`; a CSS snippet can also center all `img` |
| Pandoc (HTML, docx, PDF) | An image alone in a paragraph becomes a figure, which is centered by default in LaTeX and Word output |
| MDX / Docusaurus | `<p style={{textAlign: 'center'}}><img src="x.png" width={200} /></p>` or `align="center"` |
| Notion | Click the image block, choose the alignment icon; no syntax |

The [image guide](/guides/markdown-image) covers sizing and dark-mode variants, which usually go in the same block.

## Can you center table columns?

Table columns are the one thing markdown aligns natively. Put a colon on both sides of the hyphens in the delimiter row:

```markdown
| Left | Center | Right |
| :--- | :----: | ----: |
| a    |   b    |     c |
```

| Left | Center | Right |
| :--- | :----: | ----: |
| a    |   b    |     c |

This is GFM syntax and works on GitHub, GitLab, Obsidian, Reddit and every docs generator that renders tables; see the [table guide](/guides/markdown-table) for escaping and line breaks inside cells. The [markdown table generator](/markdown-table-generator) sets the alignment colons for you. A one-cell table with `:---:` is also a crude way to center a short line of text where HTML is stripped but tables render, such as Reddit.

## Where does centering work?

| Platform | `align="center"` | `style="text-align:center"` | Column `:---:` | Source |
|---|---|---|---|---|
| GitHub | Yes | Stripped | Yes | [GitHub sanitizer allowlist](https://github.com/gjtorikian/html-pipeline/blob/main/lib/html_pipeline/sanitization_filter.rb) |
| GitLab | Yes | Stripped | Yes | [GitLab markdown](https://docs.gitlab.com/ee/user/markdown.html#inline-html) |
| Obsidian | Yes (HTML inside is not parsed as markdown) | Yes | Yes | [Obsidian HTML notes](https://obsidian.md/help/syntax) |
| MDX, Docusaurus, Astro | Yes | Yes, as `style={{textAlign: 'center'}}` | Yes with remark-gfm | [MDX docs](https://mdxjs.com/docs/what-is-mdx/) |
| Hugo, Jekyll, MkDocs | Yes | Yes | Yes | Raw HTML must be enabled (Hugo: Goldmark `unsafe = true`) |
| Pandoc | HTML output only | HTML output only | Yes | Use `::: {.center}` fenced divs plus CSS or a LaTeX filter for other formats |
| Notion | No | No | No; table cells align via the block menu | Pasted HTML becomes text |
| Jira Cloud | No | No | Yes in the table toolbar | Legacy wiki markup has no alignment either |
| Reddit | No | No | Yes | HTML is escaped |
| Slack, Discord | No | No | No tables | No HTML, no tables |

The [markdown flavors comparison](/markdown-flavors) shows the full feature grid across these platforms.

## How do you center in Pandoc, MDX and docs generators?

Pandoc has no alignment syntax, but its `fenced_divs` extension (`::: {.center}` ... `:::`) attaches a class you can style in HTML output; for LaTeX or docx output the class does nothing unless a Lua filter maps it to `\begin{center}` or a paragraph style. MDX accepts JSX, so both `align="center"` and `style={{textAlign: 'center'}}` work and markdown inside the element is parsed. Docusaurus and MkDocs additionally let you drop a CSS class in the site theme (`<div className="text--center">` in Docusaurus) which is the cleanest option when you control the site. Hugo and Jekyll render raw HTML from markdown as long as it is enabled in the renderer settings.

## Why doesn't centering work in my renderer?

The HTML is being stripped, or the markdown inside it is being passed through raw; it is one of four reasons:

1. **The platform strips HTML.** Reddit, Slack, Discord, Notion and strict-mode CommonMark drop or escape the tags, and there is no markdown fallback.
2. **You used `style` on GitHub or GitLab.** Both remove CSS; use `align="center"`.
3. **No blank lines around the content.** The markdown inside the block is being passed through as raw HTML. Add a blank line after the opening tag and before the closing one.
4. **A `<center>` tag.** The old `<center>` element is not on GitHub's allowlist and is removed; `<div align="center">` is the replacement.

Check the structure in the [markdown viewer](/markdown-viewer), which renders with GFM rules; if it centers there, it will on GitHub.

## What are the alternatives when HTML is stripped?

Restructure instead of aligning. A short title can become a heading, which most themes already style distinctly; a tagline can go in a [blockquote](/guides/markdown-quote); a value that needs to sit in the middle of the page can be a single-column table with `:---:`, which renders on Reddit and in every docs tool. Centering is presentation, and in chat apps and note tools the reader's client controls presentation; fighting it costs more than it returns. For the rest of the syntax see the [markdown cheat sheet](/markdown-cheat-sheet).
