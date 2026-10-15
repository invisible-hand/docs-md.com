---
title: Markdown Image Syntax — Embed, Resize, Link, Alt Text
h1: How to add an image in markdown
description: Add an image in markdown with ![alt text](url). Local paths, resizing with <img width> or {width=}, clickable images, captions, dark-mode logos, alt text rules, and where the syntax works.
updated: 2026-10-15
related: markdown-link, markdown-embed-video, markdown-center-text, markdown-table, markdown-anchor-link, markdown-escape-characters
---
To add an image in markdown, write a link with an exclamation mark in front of it: `![alt text](image-url)`. The text in square brackets is the alt text, the part in parentheses is the path or URL of the image file:

```markdown
![A red panda sleeping on a branch](https://example.com/red-panda.jpg)
![Build pipeline diagram](./docs/images/pipeline.png "Optional tooltip title")
```

The image renders inline, at its natural size, wherever the line sits. That is the entire syntax: there is no width, alignment, caption or lazy-loading option in markdown itself, and every one of those needs either HTML or a platform-specific attribute, which is what the rest of this guide covers. For video, which markdown cannot embed at all, see the [embed video guide](/guides/markdown-embed-video).

## What are the parts of the markdown image syntax?

Four pieces, three of them required, as defined by the [CommonMark spec](https://spec.commonmark.org/0.31.2/#images):

| Part | Example | Required | What it does |
|---|---|---|---|
| `!` | `!` | Yes | Turns a link into an image. Without it you get a text link to the file |
| `[alt text]` | `[Pipeline diagram]` | Yes (can be empty) | Becomes the `alt` attribute: read by screen readers, shown if the file fails to load, indexed by search engines |
| `(url)` | `(./img/pipeline.png)` | Yes | Relative path, absolute path or full URL. Spaces must be encoded as `%20` or the URL wrapped in `<...>` |
| `"title"` | `("Click to enlarge")` | No | A tooltip on hover in most browsers. Single quotes work too |

Reference-style images work exactly like reference links: `![Logo][logo]` in the text and `[logo]: ./assets/logo.png` anywhere in the file, which keeps long URLs out of the prose. The [markdown link guide](/guides/markdown-link) covers reference definitions in detail.

## How do you use a local image file?

Use a path relative to the markdown file, not to the repository root:

```markdown
![Build diagram](./docs/images/architecture.png)
![Same file, from a page inside docs/](../images/architecture.png)
```

In a GitHub README, relative paths resolve inside the repository and GitHub's [docs recommend them](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#relative-links-and-image-paths-in-readme-files) because they keep working when the repo is forked or renamed. In GitHub issues, pull requests and discussions you do not write paths at all: drag the file in, paste it, or pick it from the file browser, and GitHub uploads it and inserts the markdown for you. The alt text it generates is the file name, so edit it.

One trap with absolute GitHub URLs: a `github.com/user/repo/blob/main/logo.png` link points at the HTML page that shows the image, not the file. GitHub rewrites it when it renders your markdown, but npm, PyPI and other sites that display your README do not, and the image breaks there. Use the `raw.githubusercontent.com/user/repo/main/logo.png` form (or add `?raw=true` to the blob URL) when the README is published outside GitHub.

## How do you resize an image in markdown?

Not with the markdown syntax; `![alt](url)` has no size. Each platform adds its own way, and the only one that works across GitHub, GitLab, Obsidian and most docs generators is the HTML `<img>` tag with a `width` attribute:

```markdown
<img src="./logo.png" alt="Project logo" width="300">
```

Set `width` alone so the height scales proportionally. GitHub removes `style=` attributes, so `style="width: 300px"` does nothing there, while the plain `width` attribute survives its sanitizer.

| Platform | Resize syntax | Source |
|---|---|---|
| GitHub | `<img src="x.png" width="300">` only; `style` is stripped | [GitHub HTML sanitization](https://github.com/gjtorikian/html-pipeline/blob/main/lib/html_pipeline/sanitization_filter.rb) |
| GitLab | `![alt](x.png){width=300 height=200}` or `{width=50%}`; `<img width>` also works | [GitLab image dimensions](https://docs.gitlab.com/ee/user/markdown.html#change-the-image-or-video-dimensions) |
| Obsidian | `![[x.png\|300]]` for a vault file, `![300](https://.../x.png)` for an external one; `\|640x480` sets both | [Obsidian embeds](https://obsidian.md/help/embeds) |
| Pandoc | `![Caption](x.png){width=50%}` via `link_attributes` | [Pandoc manual](https://pandoc.org/MANUAL.html#extension-link_attributes) |
| MDX / Docusaurus | `<img src="x.png" width={300} />` (JSX: self-closing, numeric width in braces) | [MDX docs](https://mdxjs.com/docs/what-is-mdx/) |
| Notion | Drag the handles on the image block; no syntax | [Notion import](https://www.notion.com/help/import-data-into-notion) for `.md` files |
| Reddit, Discord, Slack | No resizing; image syntax is not rendered at all (see below) | — |

## How do you make an image a clickable link?

Put the whole image inside the square brackets of a link:

```markdown
[![Docs badge](https://img.shields.io/badge/docs-live-green)](https://docs-md.com)
```

That is how README badge rows are built: each badge is an image wrapped in a link. The alt text of the image doubles as the link text for screen readers, so make it say where the link goes ("Documentation", not "badge"). The [markdown badge generator](/markdown-badge-generator) produces the full `[![...](...)](...)` line.

## How do you add a caption to an image?

Markdown has no caption syntax. Three conventions, in order of portability:

```markdown
![Revenue by quarter](chart.png)
*Figure 1: Revenue grew in Q3.*

<figure>
  <img src="chart.png" alt="Revenue by quarter" width="600">
  <figcaption>Figure 1: Revenue grew in Q3.</figcaption>
</figure>
```

An italic line under the image works everywhere. The `<figure>` and `<figcaption>` tags are the semantic version and are on GitHub's allowlist. Pandoc is the one tool that makes a caption from markdown alone: with its `implicit_figures` extension, an image that sits alone in a paragraph becomes a figure whose caption is the alt text, which is how LaTeX and Word exports get numbered figures.

## How do you write good alt text?

Describe what the image shows and why it is there, in a sentence, without "image of" or "picture of" (screen readers already announce it as an image). The [WAI alt text decision tree](https://www.w3.org/WAI/tutorials/images/decision-tree/) is the standard reference, and these rules cover documentation:

| Image type | Alt text |
|---|---|
| Screenshot of a UI | What the user should notice: `Settings page with the Export button highlighted` |
| Diagram or chart | The conclusion, not the shape: `Request latency fell from 400 ms to 120 ms after caching` |
| Logo or badge that is a link | Where the link goes: `Documentation` |
| Purely decorative divider | Empty: `![](divider.png)`. Screen readers then skip it |
| Code screenshot | Do not use one; paste the code in a [code block](/guides/markdown-code-block) instead |

Keep it under about 125 characters; some screen readers break longer alt text into chunks. If the image needs a longer explanation, put it in the paragraph next to it.

## How do you show a different image in dark mode on GitHub?

GitHub renders the HTML `<picture>` element, so you can supply a light and a dark version of a logo and let the viewer's theme pick:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./logo-dark.png">
  <img alt="Project logo" src="./logo-light.png" width="200">
</picture>
```

The `<img>` inside is the fallback for every renderer that ignores `<picture>`, so the markdown still shows the light logo on npm or in a docs generator. GitHub's [basic syntax page](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#images) confirms `<picture>` support; the older `#gh-dark-mode-only` URL suffix is no longer documented and should not be used for new READMEs.

## Where does markdown image syntax work?

In every document renderer and in none of the chat apps:

| App | `![alt](url)` | `<img width>` | Notes |
|---|---|---|---|
| GitHub | Yes | Yes | `<picture>`, `<figure>` allowed; `style` stripped; drag-and-drop upload in issues and PRs |
| GitLab | Yes | Yes | `{width= height=}` attributes on the markdown form |
| Obsidian | Yes, plus `![[file.png]]` | Yes | Size via `\|300`; vault paths resolve to attachments |
| Notion | On `.md` import; typing it in the editor leaves text | No | Use the `/image` block or paste an image URL |
| Jira Cloud | Yes, `![alt text](url)` is listed in Jira's shortcuts | No | Legacy wiki markup is `!image.png\|width=300!` ([Jira markdown shortcuts](https://support.atlassian.com/jira-software-cloud/docs/markdown-and-keyboard-shortcuts/)) |
| MDX | Yes | Yes, as JSX (`<img ... />`) | Unclosed `<img>` is a build error |
| Pandoc | Yes | Yes | `{width=}` attributes; lone image becomes a figure |
| Reddit | No in comments; images go through the editor's upload | No | A bare image URL shows a link preview in some clients |
| Discord | No | No | Paste or upload the file; a bare image URL embeds a preview |
| Slack | No | No | Upload the file; mrkdwn has no image syntax ([Slack formatting](https://docs.slack.dev/messaging/formatting-message-text)) |

The [GitHub Flavored Markdown sheet](/github-flavored-markdown) and [Obsidian markdown sheet](/obsidian-markdown) list the rest of each platform's syntax.

## Why is my image not showing?

A missing image is almost always a path problem, and the fix is one of these six, in rough order of frequency:

1. **Wrong relative path.** The path is relative to the markdown file, not the repo root. A README in `docs/` needs `../img/x.png` for a file in `img/`.
2. **A space or special character in the file name.** Write `my%20image.png` or rename the file; `![alt](my image.png)` is parsed as text.
3. **The URL points at an HTML page.** A GitHub `blob` URL or a Google Drive share link returns a page, not the image. Use the raw file URL.
4. **The repository is private.** Images in a private repo are not visible to anyone outside it, including on npm and in embeds.
5. **No `!`.** `[alt](x.png)` is a link to the file, not an image.
6. **The renderer does not support images.** Slack, Discord and Reddit comments show the syntax as text.

Paste the markdown into the [markdown viewer](/markdown-viewer) to check the syntax with GitHub's rules; if it renders there, the remaining problem is the path or the host.

## Can you put an image in a table, a heading or a list?

Yes; an image is inline content, so it goes anywhere text goes: `| ![icon](ok.svg) Ready |` in a [table cell](/guides/markdown-table), `## ![logo](logo.png) Project name` in a heading (GitHub keeps the heading anchor based on the text only), and `- ![](check.png) Done` in a list. Two limits: an image cannot be the only content of a table header on some renderers that need text for the anchor, and images inside a code block or code span are shown as the raw `![alt](url)` text by design. To center an image on GitHub, wrap it in `<p align="center">`, which the [center text guide](/guides/markdown-center-text) explains. For the full syntax reference see the [markdown cheat sheet](/markdown-cheat-sheet).
