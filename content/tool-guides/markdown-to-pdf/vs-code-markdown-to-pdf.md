---
title: How to Export Markdown to PDF from VS Code
h1: How do I export Markdown to PDF from VS Code?
description: VS Code previews markdown but has no PDF export. Three ways that work: the Markdown PDF extension, a browser converter, or Pandoc in the terminal.
tool: markdown-to-pdf
updated: 2026-10-17
related: /guides/markdown-page-break, /guides/markdown-code-block, /markdown-to-pdf/markdown-table-to-pdf, /markdown-viewer
---
VS Code can preview markdown but has no built-in PDF export, so you need one extra step. Install an extension such as Markdown PDF and run its Export (pdf) command, paste the file into a browser converter and save as PDF, or run Pandoc from the integrated terminal. Which one fits depends on whether you can install things.

The built-in preview is still useful as a check before you export. According to the [VS Code Markdown documentation](https://code.visualstudio.com/docs/languages/markdown), you toggle the preview with Ctrl+Shift+V (Cmd+Shift+V on macOS) and open it side by side with Ctrl+K V (Cmd+K V), and the preview renders Mermaid diagrams in `mermaid` code fences and math with KaTeX. That documentation describes no PDF or print command, which is why every route below goes through something else.

## How do I export with the Markdown PDF extension?

Markdown PDF (extension ID `yzane.markdown-pdf`) is the most widely used option. The steps, from its [README](https://github.com/yzane/vscode-markdown-pdf):

1. Open the Extensions view (Ctrl+Shift+X, or Cmd+Shift+X on macOS), search for **Markdown PDF** and install it.
2. Open your `.md` file.
3. Press F1 or Ctrl+Shift+P to open the Command Palette, type `export`, and choose `markdown-pdf: Export (pdf)`. You can also right-click inside the editor and pick the same command.
4. Wait for the notification. The extension renders the file with a Chromium browser and writes the PDF.

It needs a Chromium-based browser to print. It uses an installed Chrome, Edge or Chromium if it finds one, and otherwise downloads one on first use, so the first export can take a while and needs a network connection.

Settings worth knowing go in `settings.json`:

```json
{
  "markdown-pdf.format": "A4",
  "markdown-pdf.orientation": "landscape",
  "markdown-pdf.outputDirectory": "output",
  "markdown-pdf.convertOnSave": true
}
```

`format` accepts paper sizes such as Letter, Legal, A3 and A4 (A4 is the default), `orientation` is `portrait` or `landscape`, `outputDirectory` chooses where the PDF goes, and `convertOnSave` re-exports every time you save (the README says to restart VS Code after turning it on). For a page break, the extension documents `<div class="page"/>` on its own line; the [page break guide](/guides/markdown-page-break) compares that with other tools.

## How do I export without installing an extension?

Use a browser converter. Open the file in VS Code, select all with Ctrl+A (Cmd+A), copy, and paste it into the [markdown to PDF converter](/markdown-to-pdf), or click **Open .md file** there and pick the file directly. Check the preview, click **Download PDF**, and choose **Save as PDF** in the print dialog. The conversion runs in your browser and the text is not uploaded, which matters on a locked-down work laptop where installing extensions needs approval.

This route keeps headings, tables, task lists, syntax-highlighted code blocks and Mermaid diagrams. It has limits that the extension does not share, because the converter only sees the text you paste, not your project folder:

- **Relative images do not load.** `![diagram](./img/flow.png)` points at a file on your disk, which a web page cannot read. Use an absolute `https://` image URL, or export with the extension instead.
- **Relative links become plain text.** A link to `../docs/setup.md` has nowhere to go in a PDF made on a web page, so it prints as its link text.
- **Raw HTML is shown as text.** A `<div>` page break or a `<br>` prints literally.
- **No math.** `$E = mc^2$` prints as typed, even though the VS Code preview renders it.

## How do I export Markdown to PDF from the VS Code terminal?

Open the integrated terminal (View > Terminal) and run Pandoc, if it is installed:

```bash
pandoc notes.md -o notes.pdf
```

The [Pandoc manual](https://pandoc.org/MANUAL.html#creating-a-pdf) explains that Pandoc makes PDFs through LaTeX by default, so you also need a LaTeX engine installed. If you do not have one, Pandoc can use other engines through the `--pdf-engine` option. Pandoc is the best choice for long documents with citations, numbered sections or a custom template, and the worst choice if you just want the file to look like the VS Code preview, because its LaTeX output has its own typography.

## Why does my PDF look different from the VS Code preview?

Because the preview and the PDF are produced by different renderers. The VS Code preview uses VS Code's own markdown engine and your editor theme; the extension uses its own renderer and stylesheet; a browser converter uses the site's styles; Pandoc goes through LaTeX. Fonts, code colours and spacing will differ between them. If you need a specific look, the extension accepts your own CSS files through its `markdown-pdf.styles` setting. The preview is reliable for structure (is the table a table, is the list nested) but not for page layout, since it shows no pages at all.

## Do Mermaid diagrams survive the export?

In all three routes they can, but each needs something. The Markdown PDF extension renders `mermaid` fences by loading the Mermaid library from a URL, which by default is a public CDN, so the export needs internet access for diagrams to appear. The browser converter renders them in the page and prints them as vector graphics. Pandoc has no Mermaid support of its own and prints the fence as a code block unless you pre-render the diagrams. The guide to [keeping Mermaid and code blocks in a PDF](/markdown-to-pdf/markdown-to-pdf-mermaid-code) covers each case.

## Which method should I use?

Use the extension if you export often, need local images, or want export on save. Use the browser converter for a one-off export, on a machine where you cannot install extensions, or when you want to see exactly what will print before printing it. Use Pandoc for long, structured documents or when the export runs in a script. If the goal is only to let someone read the file, a PDF may be unnecessary: a shared link to a rendered page, or the [markdown viewer](/markdown-viewer), shows the same content without the page-layout work.

## Can VS Code print Markdown directly?

Not from the built-in preview; the official documentation lists no print command for it. The Markdown PDF extension can also export HTML, PNG and JPEG with the same Export commands. Whichever route you take, check the first exported PDF for long code lines and wide tables, which are the two things most likely to run off the page; the [table to PDF guide](/markdown-to-pdf/markdown-table-to-pdf) covers fixes for the second.
