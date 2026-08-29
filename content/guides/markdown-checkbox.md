---
title: Markdown Checkboxes — Task List Syntax
h1: How to make a checkbox in markdown
description: Create checkboxes in markdown with - [ ] for unchecked and - [x] for checked. Task list syntax for GitHub, GitLab, Obsidian, and Discord, with nesting and gotchas.
updated: 2026-08-29
related: markdown-indent, markdown-strikethrough
---
To make a checkbox in markdown, start a list item with `- [ ]` for an unchecked box or `- [x]` for a checked one. There must be a space between the brackets for an empty box, and a space after the closing bracket before your text.

```markdown
- [ ] Write the report
- [x] Send the invoice
- [ ] Book the flight
```

- [ ] Write the report
- [x] Send the invoice
- [ ] Book the flight

## Where do markdown checkboxes work?

Task lists are a **GitHub Flavored Markdown (GFM)** extension, not part of original markdown or CommonMark. They render in GitHub (issues, PRs, READMEs), GitLab, Obsidian, Notion, Discourse, and most modern editors. In GitHub issues and pull requests the checkboxes are even *clickable* — ticking one edits the underlying markdown for you.

They do **not** render in plain CommonMark processors, in Discord, or in classic email clients — there you'll just see the literal `- [ ]` characters.

## How do you nest checkboxes under each other?

Indent the child item to line up with the parent's text — two spaces works for `-` lists:

```markdown
- [ ] Launch the site
  - [x] Buy the domain
  - [ ] Set up DNS
```

- [ ] Launch the site
  - [x] Buy the domain
  - [ ] Set up DNS

## Why is my checkbox not rendering?

The four usual culprits:

1. **No space between the brackets** — `- []` is not a checkbox; it must be `- [ ]`.
2. **No space after the brackets** — `- [ ]Task` fails in many renderers; write `- [ ] Task`.
3. **Not a list item** — `[ ] Task` without the leading `-`, `*`, or `1.` is just text.
4. **The renderer doesn't support GFM** — see the compatibility list above.

Capital `X` works everywhere lowercase `x` does: `- [X]` renders checked.

## Can you make a checkbox outside a list?

No. The task-list syntax only exists as a list-item prefix. If you need a standalone checkbox symbol in prose, use the Unicode characters ☐ (U+2610) and ☑ (U+2611) instead — they're plain text and render anywhere.
