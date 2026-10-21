---
title: Why a .md File Shows # and * Instead of Formatting
h1: Why does my .md file show # and * symbols instead of formatting?
description: A .md file is the source; the # and * are formatting instructions that only a markdown renderer turns into headings and bold. How to fix it.
tool: markdown-viewer
updated: 2026-10-20
related: /guides/markdown-headings, /guides/markdown-escape-characters, /guides/markdown-bold-italic, /markdown-viewer/open-md-file-windows
---
Because you are looking at the source, not the rendered document. A .md file is plain text in which # marks a heading and * marks emphasis; a program has to read those marks and turn them into formatting. Text editors and phones do not, so they show the symbols. Open the file in a markdown viewer to see the formatting.

Markdown works like a recipe rather than a finished dish. The file holds instructions written in ordinary characters, and a renderer follows them to produce a formatted page, usually HTML. When GitHub shows a README with real headings, it has run a renderer on the server. When you open the same file in Notepad or TextEdit, nothing runs, so you see the instructions themselves.

## What do the symbols mean?

Each one is a formatting instruction. `#` at the start of a line makes a heading, and more of them make smaller headings (`##`, `###`). Asterisks or underscores around words make emphasis: one pair for italic, two for bold. A `-`, `*` or `1.` at the start of a line begins a list item. Vertical bars `|` separate table columns, `>` starts a quotation, and three backticks open and close a block of code. `[text](https://…)` is a link. The [markdown cheat sheet](/markdown-cheat-sheet) lists the rest on one page, and the [headings guide](/guides/markdown-headings) covers the `#` levels in detail.

## Why is markdown designed so the symbols stay visible?

So the file stays readable without any software. John Gruber, who created the format, wrote in the [original syntax documentation](https://daringfireball.net/projects/markdown/syntax) that a markdown document "should be publishable as-is, as plain text, without looking like it's been marked up with tags or formatting instructions." That is why a `.md` file opened in a text editor is usable at all: a `#` line looks like a title and a hyphen list looks like a list. The cost is that the symbols are still there until something renders them.

## How do I make the file show its formatting?

Open it in something that renders markdown. The quickest is a browser viewer: open the [markdown viewer](/markdown-viewer), drag the file onto it or click **Open .md file**, and it renders with headings, tables, code highlighting and diagrams, without uploading the file. Other options are VS Code's built-in preview (**Ctrl+Shift+V**, or **Cmd+Shift+V** on a Mac), a markdown editor such as Obsidian or Typora, or, for a file in a GitHub repository, the repository page on github.com. Step-by-step instructions for each platform are in the guides for [Windows](/markdown-viewer/open-md-file-windows), [Mac](/markdown-viewer/open-md-file-mac) and [phones](/markdown-viewer/open-md-file-iphone-android).

## Why do some symbols still show in a markdown viewer?

Usually because the markdown is slightly off, and the renderer treats those characters as plain text. Common causes:

- **No space after `#`.** CommonMark, the specification most renderers follow, requires a space between the `#` characters and the heading text, so `#Title` stays as text while `# Title` becomes a heading.
- **Unclosed emphasis.** `**bold` without the closing `**` shows the asterisks. So does a space just inside the markers, as in `** bold **`.
- **A missing blank line.** A list or table directly after a paragraph line sometimes needs a blank line before it to be recognized, depending on the renderer.
- **An unclosed code fence.** Three backticks with no matching closing line turn everything after them into a code block, so the rest of the document shows raw.
- **Indentation.** A line indented by four spaces is a code block in standard markdown, and shows its symbols literally.

Fix the line and render again; the change is immediate in a live preview.

## Why does it show symbols in Word, email or chat?

Those programs either do not render markdown or render a different variant. Microsoft Word opens a `.md` file as plain text; [what Word does with a .md file](/markdown-to-word/can-word-open-md-file) explains the conversion route. Email clients send HTML or plain text, so markdown pasted into a message arrives with its symbols. Chat apps support their own subsets: Slack, for example, uses single asterisks for bold, so `**bold**` from a markdown file shows extra asterisks there. The [Slack formatting reference](/slack-markdown) lists what each app accepts.

## How do I show a literal # or * on purpose?

Put a backslash in front of it: `\#` and `\*` are displayed as the characters themselves, not read as formatting. This is useful for hashtags at the start of a line or for multiplication signs. Inside inline code (single backticks) or a code block, no escaping is needed, because everything there is shown as typed. The [escape characters guide](/guides/markdown-escape-characters) lists every character that can be escaped.

## Is something wrong with my file?

Almost never. Seeing `#` and `*` in a text editor is exactly what a healthy `.md` file looks like. The file is only broken if a markdown renderer also fails to format it, and then the cause is usually one of the syntax slips above, not corruption. If a file shows strange characters such as `Ã©` instead of accented letters, that is a different problem: a text encoding mismatch, which you fix by reopening the file as UTF-8.

## Should I convert the file instead of viewing it?

Only if someone else needs to read it in a format they can open. Viewing is enough for reading it yourself. For a colleague without a markdown app, a PDF or a shared link is easier than the raw file; [sharing a rendered markdown file](/markdown-viewer/render-markdown-to-pdf-or-link) compares both. For a Word document, convert to `.docx`. Keep the `.md` file as the source either way, since it is the version that is easy to edit and compare.
