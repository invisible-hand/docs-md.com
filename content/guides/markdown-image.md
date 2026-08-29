---
title: Markdown Images — Embed and Size Pictures
h1: How to add an image in markdown
description: Embed images in markdown with ![alt text](url). Local paths vs URLs, image links, sizing with HTML width attributes, and captions - with GitHub-specific tips.
updated: 2026-08-29
related: markdown-link, markdown-center-text
---
To add an image in markdown, use a link preceded by an exclamation mark: `![alt text](image-url)`:

```markdown
![A red panda sleeping on a branch](https://example.com/red-panda.jpg)
```

The **alt text** in the brackets is what screen readers announce and what shows if the image fails to load — describe the image, don't leave it empty.

## How do you use a local image file?

Use a relative path from the markdown file's location:

```markdown
![Build diagram](./docs/images/architecture.png)
```

In a GitHub README, paths resolve within the repo. In GitHub issues and PRs you don't write paths at all — drag the image in and GitHub uploads it and inserts the URL for you.

## How do you resize an image?

Pure markdown can't — there's no width syntax. Where HTML is allowed (GitHub included), swap the markdown for an `<img>` tag:

```markdown
<img src="./logo.png" alt="Logo" width="300">
```

Use `width` (in pixels) alone so the height scales proportionally. GitHub strips `style=` attributes, so CSS sizing won't work there.

## How do you make an image a clickable link?

Nest the image syntax inside a link's square brackets:

```markdown
[![Docs badge](https://img.shields.io/badge/docs-live-green)](https://docs-md.com)
```

That's exactly how README badge rows work — each badge is an image wrapped in a link.

## Can you add a caption?

Markdown has no caption syntax. The common conventions are an italic line directly under the image, or where HTML is allowed the semantic version:

```markdown
<figure>
  <img src="chart.png" alt="Revenue by quarter">
  <figcaption>Revenue grew 40% in Q3.</figcaption>
</figure>
```
