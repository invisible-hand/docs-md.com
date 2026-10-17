---
title: Can Microsoft Word Open a .md File? What Happens
h1: Can Microsoft Word open a .md file?
description: Word has no Markdown reader. Desktop Word shows a .md file as plain text; Word for the web will not open it. How to get a formatted Word document.
tool: markdown-to-word
updated: 2026-10-17
related: /markdown-viewer, /markdown-to-pdf, /guides/markdown-headings, /markdown-to-word/markdown-table-to-word-table
---
Not as Markdown. Desktop Word can open a `.md` file only as plain text, so you see the raw `#`, `**` and `|` characters instead of headings, bold and tables. Word for the web does not open it at all. To get a formatted Word document, convert the Markdown to `.docx` (or a Word-readable `.doc`) first.

That answer surprises people because a `.md` file looks so close to a document. It is one, structurally: headings, lists, emphasis, tables. But the structure is written as punctuation in plain text, and turning that punctuation into formatting is the job of a Markdown parser. Word ships without one.

## Which file formats does Word actually support?

Microsoft's [file format reference for Word](https://learn.microsoft.com/en-us/office/compatibility/office-file-format-reference) lists .doc, .docm, .docx, .dot, .dotm, .dotx, .htm and .html, .mht, .odt, .pdf, .rtf, .txt, .wps, .xml and .xps. Markdown is not on the list. The browser version is narrower still: according to Microsoft's page on [differences between Word for the web and the desktop app](https://support.microsoft.com/en-us/office/differences-between-using-a-document-in-the-browser-and-in-word-90fac46c-2b8e-4fa1-b997-4e55ce4ed754), Word for the web opens .docx, .dotx, .docm, .dotm, .doc, .dot and, from a SharePoint library, .odt, and it "can't open documents in other file formats".

So there are two different situations:

| Where | Opens a .md file? | What you see |
|---|---|---|
| Word for Windows or Mac | Yes, as plain text | The Markdown source, symbols and all |
| Word for the web | No | Nothing; the format is not supported |
| Word with a Markdown add-in | Yes, converted | Formatted headings, lists, tables |

## How do I open a .md file in desktop Word anyway?

In File > Open, change the file-type filter from Word documents to All Files, then pick the `.md` file. Word reads it as text. If accented letters or non-Latin characters come out garbled, Word guessed the wrong encoding; Microsoft's [text encoding page](https://support.microsoft.com/en-us/office/choose-text-encoding-when-you-open-and-save-files-60d59c21-88b5-4006-831c-d536d42fd861) explains how to choose one on open. Markdown files are almost always UTF-8.

This is useful when you only want to proofread the words or run Word's spelling and grammar check over the text. It is not useful for sharing a formatted document: the reader sees `## Results` and `**important**` rather than a heading and bold text. If you edit and save the file from Word, keep the encoding as UTF-8 and watch Word's AutoCorrect as you type: it can turn straight quotes into curly ones and double hyphens into dashes, which breaks code samples and some Markdown syntax.

## What is the best way to get a .md file into Word with formatting?

Convert it. There are three common routes, and each produces a real Word document with styles.

1. **In the browser.** Paste the Markdown into the [Markdown to Word converter](/markdown-to-word) and click Download .doc. Headings, lists, tables, links, blockquotes and code blocks come through. The file is HTML in a Word-compatible wrapper; desktop Word opens it, and File > Save As > Word Document (.docx) turns it into a standard `.docx`. Do that before uploading it to Word for the web, which does not accept HTML.
2. **On the command line.** [Pandoc](https://pandoc.org/MANUAL.html) converts directly: `pandoc notes.md -o notes.docx`. Add `-f gfm` for GitHub-flavored files, and `--reference-doc=your-template.docx` to apply your own styles.
3. **Inside Word.** A third-party add-in such as [Writage](https://www.writage.com/docs/introduction/) adds Markdown open and save to Word on Windows and macOS. Check the vendor's license and pricing before you rely on it.

Whichever you choose, headings become Word's Heading 1, Heading 2 and so on, so the navigation pane, the table of contents feature and PDF bookmarks work. That only holds if the Markdown uses real headings; lines of bold text stay bold text. The [headings guide](/guides/markdown-headings) covers the syntax.

## Why does my .md file open in Notepad or another app instead of Word?

Double-clicking runs whatever app your operating system has associated with the `.md` extension, which is often a text editor or a code editor. That is the right default: Markdown is designed to be read and edited as plain text. Changing the association to Word only changes which program shows you the raw text; it does not make Word render it. If you just want to read a Markdown file with formatting, open it in a [Markdown viewer](/markdown-viewer) instead, which renders headings, tables and code without converting anything.

## Can Word save a document as a .md file?

Not natively. Word's save formats include .docx, .rtf, .txt, .htm and PDF, not Markdown. Saving as .txt keeps the words and drops every bit of formatting, so you lose the structure you would want in Markdown. To go from Word to Markdown, copy the content and paste it into the Word to Markdown side of the [Markdown to Word converter](/markdown-to-word), which reads the formatted clipboard and writes `#` headings, `**bold**`, lists and pipe tables. Pandoc also reads `.docx`: `pandoc report.docx -t gfm -o report.md`.

## Do tables and images survive the conversion to Word?

Tables do, when you use a converter: each pipe table becomes a real Word table, as explained in [turning a Markdown table into a Word table](/markdown-to-word/markdown-table-to-word-table). Images depend on where they live. An image referenced by a relative path such as `./img/chart.png` only resolves if the converter can see that folder. Pandoc, run from the folder the paths are relative to, embeds local images in the `.docx`. A browser-based converter cannot read your disk, so the file carries only the image address: local images come through as broken references, and remote ones depend on Word fetching the URL. Check every image after opening and insert any missing ones in Word.

## Is converting better than sending the .md file as it is?

It depends on the reader. A developer, a static-site generator or an AI assistant reads the `.md` directly, and converting would only lose the plain-text advantages: clean diffs, version control, and no hidden formatting. A reviewer who works in Word with tracked changes, or a client who expects a document, needs the converted file. If the reader only needs to look at it, a PDF is often simpler than either; the [Markdown to PDF converter](/markdown-to-pdf) produces one with the same headings and tables.
