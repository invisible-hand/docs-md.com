---
title: Markdown Reader vs Markdown Editor: What's the Difference?
h1: What is the difference between a markdown reader and a markdown editor?
description: A markdown reader shows a .md file formatted; an editor lets you write and change it, usually with a preview. Which you need, and examples of each.
tool: markdown-viewer
updated: 2026-10-20
related: /markdown-viewer/preview-markdown-in-vs-code, /markdown-viewer/why-md-file-shows-symbols, /github-readme-viewer, /markdown-formatter
---
A markdown reader, also called a viewer, opens a .md file and shows it formatted so you can read it. A markdown editor is for writing and changing the file, usually with a live preview next to the source. Readers need no setup. Editors add saving, file management and writing aids. Many tools do a bit of both.

The two words get mixed up because most editors include a preview and many viewers let you type. The useful question is what you are doing with the file. If someone sent you a README, release notes or a document exported from an AI chat and you want to read it, you need a reader. If you maintain the file, you need an editor.

## What does a markdown reader do?

It turns markdown source into a formatted document and gets out of the way. A good reader renders headings, lists, tables, links, images, code blocks with syntax highlighting, and the extensions people actually use, such as task lists, footnotes and Mermaid diagrams. It offers reading comforts: a table of contents or outline, adjustable type size, a print layout. It does not need to save anything. Browser-based readers like the [markdown viewer](/markdown-viewer) open a file you drop in, render it locally, and are done; there is nothing to install or configure. Quick Look extensions on macOS and browser extensions that render `.md` links are readers too.

## What does a markdown editor do?

It is where you write. An editor saves the file, manages folders of files, and helps with the writing itself: shortcuts that insert bold or link syntax, auto-continuing lists, spell checking, search across files. Most show a preview, either side by side with the source (VS Code, many code editors) or blended into one view where the symbols disappear as you type (Typora, and Obsidian's live preview mode). Some add structure on top of markdown, such as links between notes, tags or publishing to a website. VS Code's [built-in preview](/markdown-viewer/preview-markdown-in-vs-code) is a common example of the side-by-side approach.

## Do I need an editor just to read a .md file?

No. Opening a file in an editor works, but it is more than you need, and editors open the source by default, so you still see `#` and `*` until you switch to the preview. A reader shows the formatted version immediately. If the symbols are what put you off, [why a .md file shows # and * symbols](/markdown-viewer/why-md-file-shows-symbols) explains where they come from. Installing an editor makes sense once you start writing or changing markdown files yourself.

## Can a plain text editor be a markdown editor?

Yes. Markdown is plain text, so Notepad, TextEdit, nano or any code editor can create and change a `.md` file. What they lack is the preview and the writing aids. Many people write markdown in a plain editor and check the result in a separate reader, which works well: write in the tool you know, then drop the file into a viewer to make sure the tables and code blocks render the way you expect. Recent versions of Windows 11 Notepad can also show basic markdown formatting, which blurs the line further.

## How do I choose between them?

Match the tool to the task.

- **Reading a file someone sent you:** a reader. No install, and a browser viewer works on any computer or phone.
- **Checking a README before you publish it:** a reader that uses the same rules as the destination. GitHub uses GitHub Flavored Markdown, so render with GFM; the [GitHub README viewer](/github-readme-viewer) also resolves the repository's relative links and images.
- **Writing documentation in a code project:** an editor with a side-by-side preview, usually the code editor you already use.
- **Keeping notes:** a note-taking editor built on markdown files, such as Obsidian.
- **Cleaning up messy markdown:** a formatter, which rewrites spacing and list markers consistently; the [markdown formatter](/markdown-formatter) does this in the browser.

## Do readers and editors render markdown the same way?

Not always. Markdown has several flavors. CommonMark is the strict core; GitHub Flavored Markdown adds tables, task lists, strikethrough and autolinks; other tools add footnotes, math, callouts or wiki-style links. An editor may support syntax that a reader does not, or the reverse, so a document can look right in one and partly raw in the other. When the final destination matters, preview with a tool that uses the destination's flavor. The [markdown viewer](/markdown-viewer) renders GitHub Flavored Markdown with footnotes and Mermaid, which matches GitHub, GitLab and most documentation sites.

## Is a markdown reader safer than an editor?

Both are safe for ordinary files, because markdown is text and does not run when opened. The difference is about access. A browser reader that works with the File API only sees the one file you give it, which is a reasonable choice for a file from someone you do not know. A desktop editor usually has access to your whole disk and may run extensions. Neither needs network access to render, though images in a document load from wherever their URLs point.

## Can one tool do both?

Many do. Editors include previews, and some readers let you edit. The markdown viewer here has an editable source panel, so you can fix a typo and see the result, but it does not save back to your disk; you would copy the corrected text back into your file. That is the practical line between the two: a reader is complete without saving, an editor is not.
