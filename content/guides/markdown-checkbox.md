---
title: Markdown Checkboxes — Task List Syntax
h1: How to make a checkbox in markdown
description: Create checkboxes in markdown with - [ ] for unchecked and - [x] for checked. Task list syntax for GitHub, GitLab, Obsidian, Discord, nesting and gotchas.
updated: 2026-10-15
related: markdown-indent, markdown-nested-list, markdown-numbered-list, markdown-bullet-points, markdown-strikethrough
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

## Do task lists work in Notion, Obsidian and Slack?

Obsidian renders them, Notion converts them as you type, and Slack has no task-list syntax at all:

| App | `- [ ]` / `- [x]` | Interactive | Notes |
|---|---|---|---|
| Obsidian | Rendered | Yes, click the box in Reading view | Any character inside the brackets counts as complete (`[?]`, `[-]`), and task lists nest under any list type ([Obsidian syntax](https://obsidian.md/help/syntax)) |
| Notion | Typing `[]` then a space at the start of a line creates a to-do block | Yes, native block | No space inside the brackets, unlike markdown; `.md` import keeps standard markdown lists ([Notion shortcuts](https://www.notion.com/help/keyboard-shortcuts)) |
| Slack | Literal text | No | mrkdwn has no list or checkbox syntax ([Slack formatting](https://docs.slack.dev/messaging/formatting-message-text)); use ☐ / ☑ characters or `:white_check_mark:` |
| GitLab | Rendered, plus `[~]` for "inapplicable" | Yes, in issues, MRs, epics and comments | Native checkboxes in table cells from GitLab 18.9 ([GitLab task lists](https://docs.gitlab.com/ee/user/markdown.html#task-lists)) |
| Discord | Literal text | No | Not in [Markdown Text 101](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline) |

In Obsidian the box state is written back to the file, so a vault synced to GitHub shows the same ticks in both places. In Notion a pasted markdown checklist arrives as text; retype the `[]` shortcut per line or paste one item at a time to get real to-do blocks. For indentation rules when nesting tasks under numbered steps see the [nested list guide](/guides/markdown-nested-list).

## Why is my checkbox not rendering?

The four usual culprits:

1. **No space between the brackets** — `- []` is not a checkbox; it must be `- [ ]`.
2. **No space after the brackets** — `- [ ]Task` fails in many renderers; write `- [ ] Task`.
3. **Not a list item** — `[ ] Task` without the leading `-`, `*`, or `1.` is just text.
4. **The renderer doesn't support GFM** — see the compatibility list above.

Capital `X` works everywhere lowercase `x` does: `- [X]` renders checked.

## Can you make a checkbox outside a list?

No. The task-list syntax only exists as a list-item prefix. If you need a standalone checkbox symbol in prose, use the Unicode characters ☐ (U+2610) and ☑ (U+2611) instead — they're plain text and render anywhere.
