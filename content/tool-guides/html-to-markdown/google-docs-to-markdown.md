---
title: Google Docs to Markdown: Built-In Export and Other Ways
h1: How do I convert a Google Doc to Markdown?
description: Turn on Enable Markdown, then use File, Download, Markdown (.md) or right-click, Copy as Markdown. Other routes: paste into a converter, or pandoc.
tool: html-to-markdown
updated: 2026-10-17
related: /guides/markdown-headings, /guides/markdown-image, /html-to-markdown/copy-web-page-as-markdown, /markdown-to-word
---
Google Docs exports Markdown directly. Open the document and choose File, Download, Markdown (.md) to save the whole file, or select some text, right-click and choose Copy as Markdown. The copy option appears only after you turn on Tools, Preferences, Enable Markdown. No add-on is needed, and it works with personal Google accounts.

Google added these options in July 2024. Its [announcement on the Workspace Updates blog](https://workspaceupdates.googleblog.com/2024/07/import-and-export-markdown-in-google-docs.html) lists four features: convert Markdown to Docs content on paste, copy Docs content as Markdown, export a Doc as Markdown from File, Download, and import a Markdown file as a Doc. It says the copy and paste options are off by default and are switched on under Tools, Preferences, Enable Markdown, and that the features are available to Workspace customers and to users with personal Google accounts. The current steps are in Google's help article [Use Markdown in Google Docs, Slides, and Drawings](https://support.google.com/docs/answer/12014036).

## Method 1: download the whole document as .md

1. Open the document in Google Docs on a computer.
2. Click **File**, then **Download**, then **Markdown (.md)**.
3. Open the downloaded file in any text editor, or in a markdown preview.

This is the best route for a full document, because nothing depends on what you selected. Check the result before you publish it: the conversion can only map what Docs knows about. Text that looks like a heading but uses the Normal text style with a large font is a paragraph to Docs, so it comes out as a paragraph. Apply real heading styles (Heading 1, Heading 2) in Docs before exporting, and the [headings guide](/guides/markdown-headings) explains how they map to `#` levels.

A short checklist before exporting saves most of the cleanup afterwards:

- **Headings:** use the paragraph styles from the toolbar, not bold text at a bigger size.
- **Lists:** use the bulleted and numbered list buttons. Lines that start with a typed hyphen are plain paragraphs to Docs, not list items.
- **Links:** insert them with **Insert**, **Link** so they become `[text](url)` rather than bare text.
- **Tables:** keep one value per cell and a single header row, because a markdown table has no merged cells and no multi-line header.
- **Code:** put code in a monospaced block of its own, and add a language tag to the fence after export, as the [code block guide](/guides/markdown-code-block) shows.

## Method 2: copy part of a document as Markdown

1. In Docs, open **Tools**, then **Preferences**, and tick **Enable Markdown**.
2. Select the text you want.
3. Right-click and choose **Copy as Markdown**.
4. Paste into your editor, README or issue.

The same preference also turns on markdown shortcuts while you type, such as `#` plus a space for a heading, and the reverse menu item, **Paste from Markdown**, which converts markdown on your clipboard into formatted Docs content.

## Method 3: paste into an HTML-to-markdown converter

If the menu options are not available to you, for example because you only have view access to someone else's document and cannot change preferences, copy normally and paste into the [HTML to markdown converter](/html-to-markdown). Copied Docs content reaches the clipboard as HTML, so headings, links, lists and tables come through. The conversion runs in your browser. This route also lets you choose the output style: `#` or underlined headings, `-`, `*` or `+` bullets, and inline or reference links.

## Method 4: download as .docx and convert with pandoc

For batches, or when you want control over images, download the document as **Microsoft Word (.docx)** and convert it with [pandoc](https://pandoc.org/MANUAL.html). Tested with pandoc 3.12.1:

```bash
pandoc -f docx -t gfm --extract-media=. report.docx -o report.md
```

`--extract-media=.` saves embedded images into a `media` folder next to the output and points the markdown at them. In our test, pandoc wrote the images as HTML `<img>` tags, and an image with a caption as a `<figure>` block, rather than as `![alt](path)` syntax. GitHub renders both, but if you need pure markdown, rewrite them by hand using the [image guide](/guides/markdown-image). Add `--wrap=none` if you do not want pandoc to wrap long lines at 72 characters.

## Can I convert Google Docs to Markdown automatically?

Yes, with the Drive API. Google's [list of export MIME types](https://developers.google.com/workspace/drive/api/guides/ref-export-formats) includes Markdown (`text/markdown`, `.md`) for Documents, so a script with access to the file can call the files export method with that MIME type and save the result. This suits a pipeline that publishes documentation from Docs on a schedule. It needs a Google Cloud project and OAuth credentials, so for a handful of documents the File, Download route is faster.

## Why is Copy as Markdown missing from the right-click menu?

The option appears only after you turn on **Tools**, **Preferences**, **Enable Markdown**, and the preference is off by default. Google's help article describes the features for Google Docs on a computer. If you cannot change preferences, use **File**, **Download**, **Markdown (.md)** if you can download the file, or copy normally and paste into an HTML-to-markdown converter.

## What does not survive the conversion?

Anything markdown has no syntax for. Text color, highlighting, fonts and font sizes are dropped. Comments and suggested edits are not part of the document text, so resolve or accept them first. Merged table cells cannot be expressed in a markdown table. Page breaks, headers and footers have no markdown equivalent. Drawings and charts are not text either, so check how they come out, or export them separately as images. Plan to review any document that relies on layout rather than structure.

## Can I go the other way, from Markdown to Google Docs?

Yes. With Enable Markdown on, copy markdown text and use **Paste from Markdown** in the right-click menu. For a whole file, upload it from **File**, **Open**, **Upload**, or upload it to Drive and choose **Open with**, **Google Docs**. Both routes are described in Google's help article. If the destination is Word rather than Docs, the [markdown to Word converter](/markdown-to-word) produces a file Word opens directly.

## Which method should I use?

Use **File**, **Download**, **Markdown (.md)** for a whole document you own or can download. Use **Copy as Markdown** for a section you are pasting into a README, a wiki or a chat. Use the HTML-to-markdown converter when the built-in options are unavailable or you want to control the output style. Use pandoc on a `.docx` export when you need the images saved as files, and the Drive API when the conversion has to run without a person. Whichever you use, compare the headings and tables in the output against the original before publishing, and see the [guide to copying a web page as Markdown](/html-to-markdown/copy-web-page-as-markdown) if your source is a published page rather than a document.
