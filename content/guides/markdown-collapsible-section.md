---
title: Markdown Collapsible Section — Details and Summary
h1: Markdown collapsible section: how to hide and expand text
description: Markdown collapsible section: wrap content in <details><summary> for an expandable block on GitHub and GitLab. Open by default, nesting, code inside, Obsidian folds, Notion toggles.
updated: 2026-10-07
related: markdown-code-block, markdown-quote, markdown-bullet-points, markdown-comment, markdown-escape-characters
---
To make a collapsible section in markdown, wrap the hidden content in an HTML `<details>` element with a `<summary>` line for the clickable title. Markdown has no native syntax for it, but GitHub, GitLab and most renderers pass this HTML through:

```markdown
<details>
<summary>Click to expand</summary>

Hidden text goes here, and **markdown works** once you leave a blank line.

</details>
```

The blank line after `</summary>` is the part people miss: without it, GitHub shows the contents as raw text. This guide covers the exact rules, how to open a section by default, nesting, code blocks inside, the Obsidian and Notion equivalents, and the Discord spoiler, which hides text but is a different feature.

## What is the markdown collapsible section syntax?

A collapsible section is a `<details>` block containing one `<summary>` and the content, and it relies on the browser's built-in disclosure widget, so no JavaScript is needed. This table lists every form and where it works:

| Method | Syntax | CommonMark | GitHub | GitLab | Obsidian | Discord | Slack | Notion | VS Code preview |
|---|---|---|---|---|---|---|---|---|---|
| HTML details | `<details><summary>Title</summary>` ... `</details>` | if HTML allowed | yes | yes | yes | no | no | no (imports as text) | yes |
| Open by default | `<details open>` | if HTML allowed | yes | yes | yes | no | no | no | yes |
| Foldable callout | `> [!tip]- Title` | no | no | no | yes (`-` closed, `+` open) | no | no | no | no |
| Toggle block | `> ` then space in the editor, or `/toggle` | no | no | no | no | no | no | yes | no |
| Spoiler (hidden text) | `\|\|text\|\|` | no | no | no | no | yes | no | no | no |

HTML details is the portable choice for documentation. The others only work in the one app listed, and the spoiler hides a phrase rather than a section.

## How do you write the details and summary tags correctly?

Put `<details>` on its own line, a `<summary>` line directly under it, a blank line, the content, another blank line, then `</details>`. The summary is the visible title; the rest appears when a reader clicks it.

```markdown
<details>
<summary>Environment variables</summary>

| Name | Purpose |
|---|---|
| `API_KEY` | Auth token |
| `PORT` | Server port |

</details>
```

Rules that fix most failures:

- **Blank line after `</summary>`.** It switches the parser from HTML back to markdown. Without it, lists, tables and code blocks print as plain text.
- **Blank line before `</details>`** for the same reason.
- **Markdown inside `<summary>` is not parsed.** Use HTML there: `<summary><b>Bold title</b></summary>` rather than `**Bold**`. Inline code needs `<code>`.
- **Content does not need indentation.** Indenting four spaces would turn it into a code block.
- **Put a blank line before `<details>`** if it follows a paragraph, so it starts its own HTML block.

## How do you make a section open by default?

Add the `open` attribute to the opening tag: `<details open>`. The section starts expanded and readers can still collapse it. It is useful for "most readers should see this, but advanced readers can hide it" content, and for pull request templates where the checklist should be visible.

```markdown
<details open>
<summary>Changelog</summary>

- Fixed the export bug
- Added dark mode

</details>
```

There is no markdown way to remember whether a reader opened it: the state resets on every page load.

## Can you nest collapsible sections or put code blocks inside?

Yes to both, with the same blank-line rule at every level. A nested `<details>` goes inside the content of the parent; a fenced code block goes in the content after a blank line, and the fence works as normal:

````markdown
<details>
<summary>Outer section</summary>

Some text.

<details>
<summary>Inner section</summary>

```bash
npm test
```

</details>

</details>
````

The most common failure is a code fence directly under `<summary>` with no blank line, which makes GitHub print the backticks literally. A related trap is a `<details>` block inside a list item: indent the whole block to the list text column, and keep the blank lines. GitHub renders the nested sections with the same disclosure triangle. See the [code block guide](/guides/markdown-code-block) for fence rules.

## How do you make a collapsible callout in Obsidian?

Add a dash or plus after the callout type: `> [!tip]- Title` starts the callout folded and `> [!tip]+ Title` starts it open. The body follows on `>` lines, and a click on the title toggles it.

```markdown
> [!faq]- Why is this folded?
> Because the dash after the type collapses it by default.
```

This is Obsidian-only. GitHub and GitLab show the same text as a plain blockquote or alert with the marker visible and cannot fold it. Obsidian also renders `<details>` in reading view and Live Preview, so a vault that has to publish to GitHub should use `<details>`. See the [blockquote guide](/guides/markdown-quote) for the alert and callout syntax.

## How do toggles work in Notion?

A Notion toggle is a block type, not markdown: type `/toggle` or start a line with `>` followed by a space to create one, then press Tab to nest content under it. Notion exports a toggle to markdown as a plain list item, and pasting `<details>` into Notion does not create a toggle; it arrives as text. If you need the section on both a Notion page and in a README, maintain two versions.

## What is the Discord spoiler, and is it the same thing?

A Discord spoiler hides a phrase or message until clicked, written as `||text||`, and it is a different feature from a collapsible section. It works inline within a sentence, in Discord messages only, and the hidden text shows a blur box. It cannot hold headings, lists or tables, and it does not exist in GitHub markdown. Slack has no spoiler or collapse syntax in messages (long messages get a "Show more" link automatically). For Discord details see the [Discord markdown guide](/discord-markdown).

## Why is my collapsible section not working?

Most failures are blank-line or renderer problems. Check, in order:

1. **Contents show as raw markdown.** Add a blank line after `</summary>` and before `</details>`.
2. **Tags show as literal text.** The renderer strips HTML (Discord, Slack, many comment fields, markdown rendered through `react-markdown` without raw HTML support). Use that app's own feature instead.
3. **The title is not bold or formatted.** Markdown is not parsed inside `<summary>`. Use `<b>` or `<code>`.
4. **Code block displays the backticks.** The fence is directly under `<summary>` or is indented by four spaces. Blank line, no indent.
5. **The section does not collapse when printed or exported.** PDF and print output usually expand every `<details>`; that is expected.
6. **Links to a heading inside the section do not open it.** Anchor links do not expand a closed `<details>` in every browser. Use `<details open>` for sections you link into.
7. **Missing `</details>`.** An unclosed tag swallows the rest of the page into the section.

To preview your section, paste it into the [markdown viewer](/markdown-viewer) (it follows GitHub rules, but check there whether your own app strips raw HTML).

## What are the best practices for collapsible sections?

Use them for long, optional material such as logs, full config files, large tables and FAQs, not for content readers must see. Give the summary a descriptive title (not "Click here"), leave a blank line inside each block, keep nesting to two levels, and remember that the hidden text is still in the page source and is still indexed by search engines. The [markdown cheat sheet](/markdown-cheat-sheet) lists the other syntax, and the [comment guide](/guides/markdown-comment) covers text that is hidden from every reader.
