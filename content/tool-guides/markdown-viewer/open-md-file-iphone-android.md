---
title: How to Open a .md File on iPhone or Android
h1: How do I open a .md file on iPhone or Android?
description: Phones show a .md file as plain text or not at all. How to read it formatted on iPhone, iPad and Android: a browser viewer or a markdown app, step by step.
tool: markdown-viewer
updated: 2026-10-20
related: /markdown-viewer/open-md-file-windows, /markdown-viewer/open-md-file-mac, /markdown-viewer/why-md-file-shows-symbols, /markdown-viewer/render-markdown-to-pdf-or-link
---
Save the file to your phone, open a browser-based markdown viewer and pick the file there. Neither iOS nor Android renders markdown on its own: the iPhone Files app shows a .md file as plain text, and Android opens it in whatever text app you have, if any. A viewer or a markdown app shows it formatted.

A `.md` file is markdown, plain text in which `#` marks a heading, `**` marks bold and `-` starts a list item. On a computer, opening it in a text editor is a reasonable fallback. On a phone, raw markdown is harder to read: long lines of pipes and dashes in a table wrap across the narrow screen, and code blocks lose their alignment. Getting a rendered view is worth the extra step.

## What happens when I tap a .md file on an iPhone?

The Files app opens a preview that shows the text, not the formatting. You see the `#` and `*` characters, and tables appear as rows of pipes. The same happens with a `.md` attachment in Mail or a file in a chat app: iOS previews it as text. Nothing is wrong with the file. iOS simply has no markdown renderer built in, so you need a viewer page or an app that understands the format.

## How do I read a .md file formatted on iPhone or iPad?

Use a browser viewer through Safari, which can pick files from the Files app.

1. If the file is an attachment in Mail, Messages or another app, open it, tap the share button and choose **Save to Files**. Pick a folder you will find again.
2. Open the [markdown viewer](/markdown-viewer) in Safari.
3. Tap **Open .md file**. iOS shows a file picker; browse to the file and tap it.
4. The document renders with headings, tables, lists, code highlighting and Mermaid diagrams. Tap **Hide source** to give the rendered view the full width of the screen.

The file is read by Safari on the phone and is not uploaded. On an iPad you can also drag a file from the Files app in Split View onto the viewer.

## How do I open a .md file on Android?

Tapping a `.md` file in a file manager or download notification opens it in an app that has registered for text files, or Android asks you to choose one, or reports that no app can open it. Which of these you see depends on the phone maker and the apps you have installed. To read it formatted, open the [markdown viewer](/markdown-viewer) in Chrome, tap **Open .md file**, and pick the file from the system file picker; downloads are usually in the **Downloads** folder. The rendering is the same as on a desktop, and the file stays on the phone.

## Which markdown apps work on phones?

If you read markdown on your phone often, an app saves the save-then-open step. [Obsidian](https://obsidian.md) has free iOS and Android apps that open folders of markdown notes and show them formatted. On Android, [Markor](https://github.com/gsantner/markor) is an open-source markdown editor with a preview mode, available from Google Play and F-Droid. Many other viewers and editors exist in both app stores; check the reviews, the date of the last update, and which permissions the app asks for before you install, because some read every file in your storage.

## How do I read a README from GitHub on my phone?

Open the repository on github.com in your browser; GitHub renders `README.md` and other markdown files on the repository page, on mobile as well. The GitHub mobile app does the same for repositories you browse there. If you only have a link to the raw file, the [GitHub README viewer](/github-readme-viewer) loads it from the repository and renders it with relative links and images working, which raw links lose.

## Why does the rendered document look cramped on a phone?

Wide content does not fit a phone screen. Tables with many columns, long code lines and large diagrams have to scroll sideways or shrink. In the viewer, turn the phone to landscape, hide the source panel and lower the type size. If the document is yours and is mainly read on phones, keep tables to a few columns and break long code lines; the [markdown table guide](/guides/markdown-table) has tips on keeping tables narrow.

## Can I send someone a .md file to read on their phone?

You can, but they will probably see raw text, for the reasons above. If the reader is not technical, send something their phone renders on its own: a PDF, or a link to a rendered web page. The viewer's **Share as link** button publishes the document to a short address that opens as a formatted page in any mobile browser. Treat that link as public to anyone who has it. The [guide to sharing a rendered markdown file](/markdown-viewer/render-markdown-to-pdf-or-link) compares the PDF and link routes.

## Is it safe to open a .md file on my phone?

Yes. A markdown file is text and does not run code when it is opened or rendered. Links and images inside it can point to websites, so treat links in a file from a stranger the same way you treat links in a message. The browser viewer does not run scripts from the file, and it does not upload the file; only **Share as link** sends the content to a server, and only when you tap it.

## What about .markdown and .txt files?

They work the same way. `.markdown` is a longer extension for the same format, and the viewer also opens `.mdx` and `.txt` files and renders any markdown inside them. If a file chooser greys out a `.md` file, change the filter to all files, or rename a copy to `.txt` in the Files app and open that; the markdown inside renders identically.

## Which option should I pick?

For a single file, the browser viewer: nothing to install on either platform, and the rendering matches GitHub. For a folder of notes you read every day, a markdown app such as Obsidian. For a repository README, the GitHub website. On a computer the steps are different; see the guides for [Windows](/markdown-viewer/open-md-file-windows) and [Mac](/markdown-viewer/open-md-file-mac).
