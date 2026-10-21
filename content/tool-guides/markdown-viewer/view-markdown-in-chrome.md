---
title: How to View a Markdown File in Chrome
h1: How do I view a markdown file in Chrome?
description: Chrome shows .md files as plain text. Render them with an online viewer or a Markdown extension, and why extensions need file URL access for local files.
tool: markdown-viewer
updated: 2026-10-20
related: /github-readme-viewer, /markdown-viewer/open-md-file-windows, /markdown-viewer/open-md-file-mac, /markdown-viewer/why-md-file-shows-symbols
---
Chrome has no markdown renderer, so a .md file opened in it shows as plain text. To see it formatted, open an online markdown viewer in Chrome and drop the file onto it, or install a markdown extension and allow it to access file URLs. The viewer needs no install; the extension renders files you open directly.

Both routes end in the same place, a formatted document with headings, lists, tables and code, but they work differently. An online viewer is a web page that reads the file you give it. An extension changes how Chrome displays `.md` addresses, so it also works when you open a file from your disk or follow a link to a raw markdown file. The rest of this page covers each route and the permission that trips people up.

## What does Chrome do with a .md file by default?

It treats it as text. If you drag a local `.md` file into a Chrome tab, or open it with **Ctrl+O** (**Cmd+O** on a Mac), you usually get the raw source in a plain monospaced page, with every `#`, `*` and `|` visible. Depending on your system and how the file was served, Chrome may download the file instead of showing it. Links to raw files on the web, such as a `raw.githubusercontent.com` address, also display as plain text. None of this is a fault in the file: Chrome only renders HTML, and markdown has to be converted to HTML first.

## How do I view a markdown file in Chrome without installing anything?

Use an online viewer. Open the [markdown viewer](/markdown-viewer) in a tab, then drag the `.md` file from your file manager onto the viewer panel, or click **Open .md file** and pick it. The page reads the file with the browser's File API and does not upload it. It renders GitHub Flavored Markdown: tables, task lists, footnotes, highlighted code blocks and Mermaid diagrams. You can also paste markdown text into the editor, or paste a GitHub file URL and click **Load from URL**; that fetch happens in your browser, so it works for hosts that allow cross-origin requests, which GitHub raw files and gists do. This route works in managed Chrome profiles where extensions are blocked.

## How do I render markdown with a Chrome extension?

Install a markdown viewer extension from the Chrome Web Store, then open `.md` files or links in Chrome as usual; the extension replaces the plain text with a rendered page. One long-running open-source option is [Markdown Viewer by simov](https://github.com/simov/markdown-viewer), which supports several markdown parsers, themes and syntax highlighting. Before installing any extension, check its permissions, its number of users and when it was last updated, because a viewer extension asks to read the pages it renders. Microsoft Edge can install extensions from the Chrome Web Store, so the same extensions work there.

## Why does the extension not work on local files?

Chrome does not let extensions read `file://` addresses unless you allow it per extension. Until you do, a local `.md` file stays as plain text even with the extension installed. To turn it on:

1. Go to `chrome://extensions` in the address bar.
2. Find the markdown extension and click **Details**.
3. Turn on **Allow access to file URLs**.
4. Reload the tab with the `.md` file.

The Markdown Viewer project's [setup instructions](https://github.com/simov/markdown-viewer) describe the same switch. It applies to the one extension you enable it for. Only grant it to extensions you trust, because it lets them read local files you open in Chrome.

## Why does an extension not render some markdown links?

The extension only acts on addresses it is allowed to run on. Many extensions start with local files and a few known hosts, and ask you to allow other origins one by one. A server can also send a `.md` file with a content type that makes Chrome download it rather than display it, and an extension cannot render a page Chrome never opens. In those cases, download the file and use a viewer, or use **Load from URL** on the viewer page if the host permits cross-origin reads.

## Should I use the online viewer or an extension?

Use the online viewer when you read a markdown file now and then, when you cannot install extensions, or on a shared computer. Use an extension when you click through many markdown files or raw links every day and want them to render in place. The viewer has a few things extensions usually lack: **Share as link** to send the rendered page to someone, and **Print / PDF** for a clean printout. For whole repositories, with relative links between files and images that resolve, the [GitHub README viewer](/github-readme-viewer) is the better fit.

## How do I view markdown on a Chromebook?

Use the online viewer. Opening a `.md` file from the ChromeOS Files app shows its text, not the formatting. Open the viewer in Chrome and click **Open .md file**; the picker shows your Downloads folder and Google Drive. Extensions behave the same as on other platforms, including the **Allow access to file URLs** switch.

## Can Chrome print a markdown file as a PDF?

Not usefully from the raw text tab: you would get a PDF of the source with every symbol. Render it first. In the viewer, click **Print / PDF** and choose **Save as PDF** as the destination in Chrome's print dialog; only the rendered document prints. For page size and margin options, the [markdown to PDF converter](/markdown-to-pdf) is built for it.

## Why does a page say it is markdown but look normal in Chrome?

Because the site converted it before sending it. GitHub, GitLab, documentation sites and wikis store pages as markdown and turn them into HTML on their servers, so Chrome receives ordinary HTML and displays it. You only see raw markdown when Chrome gets the `.md` file itself, from your disk or a raw link. If you are not sure why the symbols appear in the first place, [why a .md file shows # and * symbols](/markdown-viewer/why-md-file-shows-symbols) explains it in a few paragraphs.
