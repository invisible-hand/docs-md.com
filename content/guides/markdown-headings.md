---
title: Markdown Headings — H1 to H6 Syntax, Anchors and Rules
h1: How to make headings in markdown
description: Make a heading with # for H1 through ###### for H6, a space after the hashes. Anchor links, custom IDs, the one-H1 rule, setext underlines, accessibility, and where headings break in GitHub, Discord, Slack, Jira and Obsidian.
updated: 2026-10-15
related: markdown-anchor-link, markdown-table, markdown-bold-italic, markdown-horizontal-rule, markdown-alerts, markdown-nested-list
---
To make a heading in markdown, start a line with one to six `#` characters, a space, then the text. One `#` is the top-level heading (H1), two is H2, and so on down to six.

```markdown
# Title of the document
## A section
### A subsection
#### Smaller still
```

# Title of the document
## A section
### A subsection
#### Smaller still

The space after the hashes is not optional in CommonMark and GitHub: `#Title` renders as the literal text "#Title". Closing hashes are allowed (`## A section ##`) and ignored.

## How many heading levels does markdown have?

Six, matching HTML's `<h1>` to `<h6>`. In practice three are plenty: a document title (H1), sections (H2) and subsections (H3). Deeper than that, the hierarchy stops being visible on a phone and readers lose track of where they are. If you find yourself at `####`, the section probably wants to become its own page or the structure wants a list instead.

## Should a markdown document have only one H1?

Yes, by convention, and for two practical reasons. Renderers that build a table of contents (GitHub, Docusaurus, Obsidian's outline, this site's viewer) treat the H1 as the document's name. And on a website the H1 is what search engines and screen readers read as the page title; two of them is a contradiction. Use the H1 once, at the top, and start sections at H2. A README that opens with the project name as H1 and uses H2 for "Install", "Usage" and "License" is the shape everyone recognises.

## What is the underline (setext) heading syntax?

Original markdown also allows two underline styles: a line of `=` under text makes an H1, a line of `-` makes an H2. Only those two levels exist.

```markdown
Title of the document
=====================

A section
---------
```

Title of the document
=====================

A section
---------

Any number of `=` or `-` works (one is enough). Setext headings survive in every renderer, but most style guides, linters (markdownlint rule MD003) and editors prefer the `#` form because it is one line, supports all six levels, and does not get confused with a horizontal rule: `---` on its own line is a rule, `---` directly under text is an H2.

## How do you link to a heading?

Every renderer turns a heading into an anchor you can link to with `#`. GitHub's rule: lowercase the text, drop punctuation except hyphens and spaces, replace spaces with hyphens, and add `-1`, `-2` for duplicates.

```markdown
## Getting started
...
See [Getting started](#getting-started).
```

So `## How do you link to a heading?` becomes `#how-do-you-link-to-a-heading`. Numbers, emoji and accented letters survive (`## 2. Setup` is `#2-setup`). The exact slug rules differ slightly between GitHub, GitLab, Obsidian and static-site generators; the [anchor link guide](/guides/markdown-anchor-link) covers the differences and the [TOC generator](/markdown-toc-generator) produces GitHub-exact anchors for a whole document.

## Can you put formatting, links or code inside a heading?

Yes. Inline markdown works in headings: `## Install with \`npm\``, `## **Important** notes`, `## See [the docs](https://example.com)`. GitHub also renders emoji in headings and keeps them in the anchor. Two things do not belong in a heading: a trailing colon (looks like a label, reads badly in a TOC) and a full sentence that ends in a period.

## Where do headings not work?

| Renderer | Headings | Source |
| --- | --- | --- |
| GitHub, GitLab, Bitbucket | All six levels, anchors generated, H1 shown large | [GitHub headings](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#headings), [GitLab headings](https://docs.gitlab.com/ee/user/markdown.html#headings) |
| Obsidian | All six; the outline pane is built from them; `[[Note#Heading]]` links to one; HTML `<h2>` is left out of the outline | [Obsidian syntax](https://obsidian.md/help/syntax) |
| Notion | `#`, `##`, `###` typed at the start of a block convert to Notion headings (three levels only) | [Notion shortcuts](https://www.notion.com/help/keyboard-shortcuts) |
| Jira Cloud | `#` to `######` convert as you type; legacy wiki markup uses `h1.` to `h6.` | [Jira shortcuts](https://support.atlassian.com/jira-software-cloud/docs/markdown-and-keyboard-shortcuts/) |
| Discord | **Yes since 2023**: `#`, `##`, `###` render as three heading sizes in messages; four or more hashes render as text; `-#` makes small subtext | [Discord Markdown Text 101](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline) |
| Slack | **No.** Slack's mrkdwn has no headings; `# Title` posts as literal text. Use bold on its own line | [Slack formatting](https://docs.slack.dev/messaging/formatting-message-text) |
| Reddit | Yes, all six levels, in markdown mode | [Reddit markdown sheet](/reddit-markdown) |
| MDX | All six; the site's remark plugins generate anchors; a heading inside JSX is still a heading | [MDX docs](https://mdxjs.com/docs/what-is-mdx/) |
| Pandoc | All six, with `{#id .class}` attributes; becomes Word heading styles and LaTeX sections | [Pandoc headings](https://pandoc.org/MANUAL.html#headings) |
| Email (plain) | No; recipients see the hashes | — |

The [Discord](/discord-markdown), [Slack](/slack-markdown), [Notion](/notion-markdown) and [Obsidian](/obsidian-markdown) sheets cover each platform's remaining syntax.

## What are the common heading mistakes?

- **Missing space**: `#Title` is text, not a heading, in CommonMark and GitHub.
- **Skipping levels**: jumping from H1 to H3 is allowed but trips accessibility checkers and markdownlint (MD001). Go one level at a time.
- **Blank lines**: put an empty line before and after a heading. Some renderers (old Markdown.pl, some wikis) need it; all of them read better with it, and markdownlint (MD022) expects it.
- **Trailing spaces or tabs** after the text are fine; a tab *between* the hashes and the text is not, in strict CommonMark.
- **Two H1s** in one document: see above; keep one.
- **Headings inside lists or blockquotes** work (`> ## Quoted heading`), but a heading cannot span two lines; a line break ends it.

## How do you give a heading a custom ID?

Not on GitHub, which always derives the anchor from the text. Several other tools accept an attribute after the heading, and the syntax is the same in all of them:

```markdown
### Installation {#install}
```

| Tool | `{#custom-id}` | Notes |
|---|---|---|
| Pandoc | Yes | Also classes and key=value attributes; `{-}` or `{.unnumbered}` removes the section number |
| MkDocs (Python-Markdown) | Yes, with the `attr_list` or `toc` extension | Material enables it in most starter configs |
| Docusaurus | Yes | Documented as "explicit heading IDs"; also used to keep anchors stable across translations |
| Jekyll (kramdown) | Yes | kramdown's inline attribute list |
| Hugo (Goldmark) | Yes | Goldmark heading attributes |
| GitHub, GitLab, Obsidian, Notion | No | The braces print as text; on GitHub use an `<a id="install"></a>` line above the heading instead |

The HTML anchor fallback works everywhere raw HTML is allowed and is the only way to get a stable ID on GitHub when the heading text may change.

## Are heading levels an accessibility requirement?

Yes. Screen reader users navigate by heading (jumping between H2s is the most common way to scan a page), so headings need to form a real outline: one H1, H2s for sections, H3s only under an H2, no skipped levels, and no heading used for its font size alone. The [WAI headings tutorial](https://www.w3.org/WAI/tutorials/page-structure/headings/) describes the expected structure, and markdownlint's MD001 (increment by one) and MD025 (single H1) check it. Two markdown-specific traps: bold text on its own line looks like a heading but is announced as plain text, so a section that deserves navigation deserves a `#`; and an image-only heading (`## ![logo](logo.png)`) is announced using the image's alt text, so give it a real one.

## How do headings look in different styles?

Three habits that keep large documents readable: sentence case for headings ("Getting started", not "Getting Started"), which most style guides now prefer and which makes anchors predictable; one idea per heading, so the TOC reads as an outline; and a heading only when at least two paragraphs follow it, otherwise bold text on its own line does the job without fragmenting the page. A heading followed directly by a [table](/guides/markdown-table) or a [GitHub alert](/guides/markdown-alerts) is fine; a heading followed by another heading is a sign the outline is one level too deep. For the rest of the syntax see the [markdown cheat sheet](/markdown-cheat-sheet).
