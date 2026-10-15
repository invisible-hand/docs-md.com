---
title: Markdown Checkboxes — Task List Syntax
h1: How to make a checkbox in markdown
description: Create checkboxes in markdown with - [ ] for unchecked and - [x] for checked. Task list syntax for GitHub, GitLab, Obsidian, Notion, Jira, Pandoc and MDX, nesting, progress tracking, accessibility and gotchas.
updated: 2026-10-15
related: markdown-nested-list, markdown-numbered-list, markdown-bullet-points, markdown-indent, markdown-strikethrough, markdown-table
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

Task lists are a [GitHub Flavored Markdown (GFM) extension](https://github.github.com/gfm/#task-list-items-extension-), not part of original markdown or CommonMark. They render in GitHub (issues, PRs, READMEs), GitLab, Obsidian, Discourse, Pandoc and most modern editors. In GitHub issues, pull requests, discussions and comments the checkboxes are *clickable*: ticking one edits the underlying markdown for you, per GitHub's [task list docs](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/about-task-lists). In a README the boxes render but are read-only.

They do **not** render in plain CommonMark processors, in Discord, Slack or Reddit, or in email; there you see the literal `- [ ]` characters.

| Platform | `- [ ]` renders | Clickable | Notes |
|---|---|---|---|
| GitHub | Yes | In issues, PRs, discussions, comments; not in `.md` files | Progress shown on the issue list; a task that references an issue is ticked when that issue closes |
| GitLab | Yes, plus `[~]` inapplicable | Yes | [GitLab task lists](https://docs.gitlab.com/ee/user/markdown.html#task-lists) |
| Obsidian | Yes | Yes | Any character in the brackets counts as done |
| Notion | Via the `[]` + space shortcut; `.md` import converts | Yes | Pasted markdown stays text |
| Jira Cloud | `[]` + space creates an action item | Yes | [Jira shortcuts](https://support.atlassian.com/jira-software-cloud/docs/markdown-and-keyboard-shortcuts/); not in legacy wiki markup |
| Reddit | No | No | Literal text in both editors |
| Discord, Slack | No | No | Use ☐ / ☑ or `:white_check_mark:` |
| MDX | With `remark-gfm` | Static | Docusaurus and Astro enable it by default |
| Pandoc | Yes (`task_lists` extension, on by default) | Static | Converts to checkbox characters in docx and LaTeX ([Pandoc manual](https://pandoc.org/MANUAL.html#extension-task_lists)) |

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

A checkbox that shows as `- [ ]` text is nearly always a spacing error or an unsupported renderer; the four usual culprits:

1. **No space between the brackets** — `- []` is not a checkbox; it must be `- [ ]`.
2. **No space after the brackets** — `- [ ]Task` fails in many renderers; write `- [ ] Task`.
3. **Not a list item** — `[ ] Task` without the leading `-`, `*`, or `1.` is just text.
4. **The renderer doesn't support GFM** — see the compatibility list above.

Capital `X` works everywhere lowercase `x` does: `- [X]` renders checked.

## Can you put a checkbox in a numbered list or a table?

In a numbered list, yes: `1. [ ] First step` renders a numbered item with a box on GitHub, GitLab and Obsidian, since the task marker is allowed after any list marker. Indent nested tasks under a number by three spaces (the width of `1. `), as the [numbered list guide](/guides/markdown-numbered-list) explains.

In a table, no, on most platforms. A [table cell](/guides/markdown-table) holds inline content only and `[ ]` is a list-item prefix, so GitHub shows the brackets as text. GitLab is the exception and renders native checkboxes inside cells from version 18.9. The portable workaround is a column of ☐ / ☑ characters or a word (Done / Open), which also reads better in a screen reader.

## How does GitHub track task progress?

GitHub counts the boxes. An issue or pull request that contains a task list shows "2 of 5 tasks" in the issue list and on the PR's conversation tab, updated as boxes are ticked. If a task line contains a reference to another issue (`- [ ] #42` or a full URL), GitHub shows that issue's title and state inline and ticks the box automatically when the referenced issue is closed. Tasks can be dragged to reorder within a single comment, and from a task's `...` menu you can convert it into its own issue. All of this applies to issues, pull requests and discussions; a task list in a README is static text with rendered boxes.

## Are markdown checkboxes accessible?

Rendered task lists are real `<input type="checkbox">` elements with the list item as their label, so screen readers announce "checkbox, checked" or "not checked" followed by the task text, and in GitHub issues the box is keyboard-operable. That makes the checkbox state the right place to record completion, rather than [striking the text](/guides/markdown-strikethrough), which is not announced. Two things to keep accessible: write the task text so it stands alone ("Deploy the API to staging", not "Do it"), and avoid using Unicode ☐ / ☑ where a real task list renders, because the characters are announced by name ("ballot box with check") rather than as a control.

## Can you make a checkbox outside a list?

No. The task-list syntax only exists as a list-item prefix. If you need a standalone checkbox symbol in prose, use the Unicode characters ☐ (U+2610) and ☑ (U+2611) instead; they're plain text and render anywhere, including Slack and Discord, where the [emoji guide](/guides/markdown-emoji) lists the `:white_check_mark:` alternatives. For the rest of the list syntax see the [bullet points guide](/guides/markdown-bullet-points) and the [markdown cheat sheet](/markdown-cheat-sheet).
