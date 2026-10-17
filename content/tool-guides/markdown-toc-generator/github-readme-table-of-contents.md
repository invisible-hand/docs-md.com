---
title: How to Add a Table of Contents to a GitHub README
h1: How do I add a table of contents to a GitHub README?
description: Write a nested list of links to your headings' anchors under the title, or rely on GitHub's built-in Outline menu. Exact syntax, slug rules and upkeep.
tool: markdown-toc-generator
updated: 2026-10-17
related: /guides/markdown-anchor-link, /guides/markdown-headings, /guides/markdown-nested-list, /github-readme-viewer
---
Add a nested bullet list near the top of the README in which every item links to a heading's anchor, for example `#installation` for the Installation section. GitHub gives every heading an anchor automatically, so you only write the list. GitHub's own generated outline sits in a menu, not in the page.

Here is what a finished table of contents looks like in the markdown source, placed under the project title:

```markdown
# my-project

A command-line tool that converts logs to CSV.

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
  - [Options](#options)
  - [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Installation
...
```

Each link target is the heading text turned into a slug: lower case, spaces replaced by hyphens, punctuation removed. Indent child items by two spaces (or to line up under the parent's text) so that H3 headings nest under their H2.

## Does GitHub generate a table of contents automatically?

Yes, but not inside the file. For any rendered markdown file in a repository, including READMEs, GitHub builds a table of contents from the headings and shows it behind the "Outline" icon in the top corner of the file view ([GitHub Docs, About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes#auto-generated-table-of-contents-for-markdown-files)). You do not have to write anything to get it. Its limits are that a reader has to find and open the menu, and it exists only in GitHub's interface, so it does not travel with the file to package registries, documentation sites, or a clone opened in an editor. A written TOC appears wherever the markdown is rendered.

## How do I build the list without typing every anchor?

Paste the README into the [markdown TOC generator](/markdown-toc-generator). It reads the headings, creates the anchors with the same slug rules GitHub uses, and gives you a list you can copy or insert under the H1. You can limit the depth (H2 and H3 is usually enough for a README), choose a numbered or bulleted list, and leave the H1 out so the project name does not link to itself. The tool runs in the browser and does not upload the file.

If you prefer to write it by hand, GitHub documents the rules it uses to turn a heading into an anchor ([section links](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#section-links)):

- Letters are converted to lower case.
- Spaces become hyphens; other whitespace and punctuation are removed.
- Leading and trailing whitespace is removed.
- Markup is removed, so `_italics_` becomes `italics`.
- A heading whose anchor matches an earlier one gets `-1`, `-2` and so on appended.

So `## What's new in v2?` links as `#whats-new-in-v2`, and a second `## Examples` heading links as `#examples-1`. Non-English letters are kept rather than removed; GitHub's own example turns a heading ending in "Θ!" into an anchor ending in `-θ`. The [anchor link guide](/guides/markdown-anchor-link) covers the edge cases (emoji, dots in version numbers, links into other files) in more detail.

## Where should the table of contents go in a README?

Directly after the title and the one- or two-sentence description, before the first real section. Readers decide in the first screen whether the project is for them, so the description should stay above the TOC rather than be pushed down by it. A heading such as `## Table of contents` or `## Contents` above the list makes it easy to find and gives it its own anchor, which you can use for "back to top" links in very long files.

Only add one if the README needs it. A file with four short sections scrolls faster than it can be navigated, and the TOC becomes noise. A practical threshold is when the README runs past two or three screens or has more than five or six H2 sections.

## Why do some links in my README table of contents not work?

Almost always because the anchor no longer matches the heading. Common causes:

1. **The heading was renamed.** GitHub notes that if you edit a heading, links to it must be updated too, because the anchor changes.
2. **Punctuation was kept in the link.** `#what's-new` does not match; the apostrophe is dropped, so it is `#whats-new`.
3. **Capital letters.** `#Installation` may appear to work in some places but the generated anchor is `#installation`; use lower case.
4. **A duplicate heading.** The second `## Examples` is `#examples-1`, not `#examples`.
5. **The link text spans two lines.** GitHub's docs say link text should be on a single line, or the link breaks.

To check every link at once, open the repository in the [GitHub README viewer](/github-readme-viewer) or run the [markdown link checker](/markdown-link-checker) on the file. Regenerating the list from the current headings with the TOC generator is usually faster than hunting for the one stale link.

## Can I hide a heading from the table of contents?

In a hand-written or generated list, simply delete that item; nothing links to a heading unless you write the link. GitHub's automatic Outline is different: it lists every heading and cannot be configured from the file. If you need a jump target that is not a heading, GitHub supports a custom HTML anchor such as `<a name="faq-billing"></a>`, and its docs note that custom anchors are not included in the document outline. Keep these to a minimum, since a plain [heading](/guides/markdown-headings) is easier to maintain.

## How do I keep the table of contents up to date?

The list is plain text, so it does not update itself when headings change. Three habits keep it accurate. Regenerate it whenever you add, remove or rename an H2 or H3 rather than editing single lines. Keep headings short and free of punctuation that matters, so anchors stay stable across edits. And if you edit the README in VS Code, an editor extension can rewrite the TOC on save; the [VS Code TOC guide](/markdown-toc-generator/vs-code-markdown-toc) explains how and what to configure so its anchors match GitHub's.

## Should the TOC be a numbered or bulleted list?

Bulleted is the usual choice and the safer one, because adding a section does not renumber the list. A numbered list makes sense when the README is a sequence, such as setup steps that must happen in order. Either way, nesting uses the same indentation rules as any other list; the [nested list guide](/guides/markdown-nested-list) shows how far to indent child items so they render as a sub-list instead of a paragraph.
