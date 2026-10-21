---
title: How to Open a .md File on Windows 10 and 11
h1: How do I open a .md file on Windows?
description: A .md file is plain text, so Notepad opens it. How to see it formatted on Windows 10 and 11: newer Notepad, VS Code's preview or a browser viewer.
tool: markdown-viewer
updated: 2026-10-20
related: /markdown-viewer/open-md-file-mac, /markdown-viewer/why-md-file-shows-symbols, /markdown-viewer/preview-markdown-in-vs-code, /readme-generator/how-to-open-readme-md
---
Right-click the file, choose Open with, and pick Notepad. A .md file is plain text, so it opens in any text editor, but you see the raw markdown symbols. To read it formatted, with headings, lists and tables, open it in a markdown viewer, in VS Code's preview, or in a recent version of Notepad.

The `.md` extension stands for markdown, a way of writing formatting with ordinary characters: `#` in front of a heading, `**` around bold text, `-` at the start of a list item. Nothing in the file is executable, so opening it in a text editor is safe. Windows just does not ship a program that is registered to show markdown as a formatted document on every machine, which is why a double-click often asks you to choose an app, or opens the file in something unexpected.

## How do I open a .md file with Notepad?

Right-click the file in File Explorer and choose **Open with**, then **Notepad**. On Windows 11 the right-click menu may show **Open with** directly; if it does not, choose **Show more options** first to get the classic menu. If Notepad is not in the short list, pick **Choose another app** and select it there. This always works because markdown is plain text. What you get depends on your Notepad version: older versions show every `#`, `*` and `|` exactly as typed, which is readable for short files and tiring for long ones.

## Can Notepad on Windows 11 show markdown formatted?

Recent versions of Notepad on Windows 11 can. Microsoft added lightweight formatting to Notepad in 2025, and it reads markdown files: headings, bold, italic, links and lists can be shown as formatting, with a switch between the formatted view and the raw syntax. Support grew over later updates, and tables arrived in newer builds than the first release. Notepad updates through the Microsoft Store, so if you do not see a formatting toolbar or a formatted view, check the Store for a Notepad update. If your organization manages updates, you may not have it yet, and Windows 10 Notepad does not have it.

Even where it works, Notepad covers the basic syntax. Fenced code blocks with syntax highlighting, footnotes, task lists and Mermaid diagrams are outside what it is built to show, so a technical README can still look partly raw.

## How do I see a .md file formatted without installing anything?

Use a browser-based viewer. Open the [markdown viewer](/markdown-viewer) in Edge or Chrome, then drag the `.md` file from File Explorer onto the viewer panel, or click **Open .md file** and pick it. The file is read by your browser and not uploaded, and it renders with GitHub's rules: headings, tables, task lists, footnotes, highlighted code and Mermaid diagrams. Click **Hide source** for a full-width reading view and use the outline to jump between sections. This is the quickest route on a work laptop where you cannot install software.

## How do I make .md files always open in the same program?

Set a default app for the extension. Right-click any `.md` file, choose **Open with**, then **Choose another app**, select the program and tick **Always use this app to open .md files** before clicking **OK**. You can also do it from **Settings**, **Apps**, **Default apps**: type `.md` in the box that sets a default by file type and pick the app. Good choices are Notepad for quick reading, VS Code if you edit markdown, or a dedicated markdown editor if you installed one. A browser cannot be set as a useful default here, because opening a local `.md` file in Edge or Chrome shows plain text unless an extension is installed.

## How do I open a .md file in VS Code on Windows?

Right-click the file and choose **Open with**, then **Visual Studio Code**, or choose **Open with Code** if you ticked that option during installation. The file opens as source. Press **Ctrl+Shift+V** to switch to the rendered preview, or **Ctrl+K** followed by **V** to open the preview beside the source, so you see changes as you type. The [VS Code markdown documentation](https://code.visualstudio.com/docs/languages/markdown) describes both shortcuts. The [guide to previewing markdown in VS Code](/markdown-viewer/preview-markdown-in-vs-code) covers preview locking, scroll sync and why some images do not appear.

## Why does double-clicking a .md file do nothing useful?

Windows opens a file with whatever app is registered for its extension, and `.md` often has no registration, or one you did not choose. On a fresh machine Windows asks which app to use. If you installed a developer tool, it may have claimed the extension. Some systems associate `.md` with unrelated software, because the same extension has been used by other file types in the past. Use **Open with** to choose deliberately, and set a default as described above if you open these files often.

## Is a .md file safe to open?

Opening it in a text editor or viewer is safe. A `.md` file is text; it does not run code when opened. A rendered markdown document can contain links and images that point to web addresses, so treat links in a file from an unknown sender as you would links in an email. Browser viewers do not run scripts embedded in the file, and VS Code's preview blocks scripts by default as well.

## What about .markdown, .mdx and README files?

They open the same way. `.markdown` is a longer spelling of the same format. `.mdx` is markdown with embedded JSX components, used by documentation sites; viewers render the markdown parts and show the components as text or skip them. A `README.md` from a downloaded project is an ordinary markdown file; if it came from GitHub, the [GitHub README viewer](/github-readme-viewer) reads it straight from the repository with its links and images working. For more on the README case specifically, see [how to open a README.md file](/readme-generator/how-to-open-readme-md).

## Which option should I pick?

For a one-off file, the browser viewer: nothing to install and the most complete rendering. If you only need to read short notes and your Notepad has formatting, Notepad is fine. If you write markdown regularly, VS Code with its side-by-side preview is the better daily tool. If you need to send the formatted document to someone else, see [how to share a rendered markdown file](/markdown-viewer/render-markdown-to-pdf-or-link).
