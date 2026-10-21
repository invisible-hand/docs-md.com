---
title: How to Preview Markdown in VS Code (Shortcuts and Fixes)
h1: How do I preview markdown in VS Code?
description: Press Ctrl+Shift+V (Cmd+Shift+V on Mac) for the preview, or Ctrl+K V side by side. Preview locking, scroll sync, blocked images and styling.
tool: markdown-viewer
updated: 2026-10-20
related: /markdown-to-pdf/vs-code-markdown-to-pdf, /markdown-toc-generator/vs-code-markdown-toc, /github-readme-viewer/preview-readme-before-push, /markdown-viewer/md-file-reader-vs-editor
---
Open the .md file and press Ctrl+Shift+V (Cmd+Shift+V on a Mac) to switch to the rendered preview. To see source and preview side by side, press Ctrl+K, release, then press V (Cmd+K V on a Mac). The preview is built into VS Code, so no extension is needed, and it updates as you type.

Both shortcuts come from the [VS Code Markdown documentation](https://code.visualstudio.com/docs/languages/markdown), which is the reference for everything below. The preview is a separate editor tab, so you can drag it to another group, split it, or put it on a second monitor like any other tab. It renders CommonMark with common extensions, Mermaid diagrams in `mermaid` code fences, and math with KaTeX.

## What are the ways to open the markdown preview?

There are four, and they open the same preview. Press **Ctrl+Shift+V** (**Cmd+Shift+V**) to replace the current view with the preview. Press **Ctrl+K V** (**Cmd+K V**) to open it beside the source. Right-click the file's editor tab and choose **Open Preview**. Or open the Command Palette with **Ctrl+Shift+P** (**Cmd+Shift+P**) and run **Markdown: Open Preview** or **Markdown: Open Preview to the Side**. There is also a preview icon in the editor title bar, at the top right of a markdown tab, which opens the side-by-side preview with one click.

## Why does the preview change when I switch files?

By default the preview follows the active markdown file: click another `.md` tab and the preview shows that file instead. To pin it to one document, make the preview the active tab and run **Markdown: Toggle Preview Locking** from the Command Palette. A locked preview shows **[Preview]** in its title and stays on its file while you edit others. The documentation notes the command only appears when the preview is the active tab, which is the usual reason people cannot find it.

## How do I keep the editor and preview scrolled together?

They already are. VS Code syncs scrolling in both directions, and marks the line your cursor is on with a light gray bar in the preview's left margin. Double-clicking an element in the preview jumps the editor to the matching line. If you prefer to scroll them independently, turn off `markdown.preview.scrollPreviewWithEditor` and `markdown.preview.scrollEditorWithPreview` in Settings.

```json
{
  "markdown.preview.scrollPreviewWithEditor": false,
  "markdown.preview.scrollEditorWithPreview": false
}
```

## Why are images or content missing from the preview?

The preview runs under a security policy. Its default level, **Strict**, disables scripts and only loads content over `https`, so an image with an `http://` URL is blocked. When something is blocked, an alert appears at the top right of the preview; click it, or run **Markdown: Change preview security settings**, to choose **Allow insecure content** (scripts stay off, `http` loads) or **Disable** (no extra restrictions). The setting applies to the whole workspace, and the VS Code documentation recommends staying on Strict unless you trust every markdown file in the workspace. For local images, check that the relative path in the markdown matches the file's location; paths are resolved from the markdown file's folder.

## Can I make .md files open in the preview by default?

Yes, through editor associations. Add this to your `settings.json`, and opening a markdown file from the Explorer shows the rendered preview first:

```json
{
  "workbench.editorAssociations": {
    "*.md": "vscode.markdown.preview.editor"
  }
}
```

Use **View: Reopen Editor With...** from the Command Palette to switch a single file back to the text editor. The same documentation describes a `workbench.diffEditorAssociations` setting that renders markdown diffs from Source Control as a preview, with changes highlighted, which is useful when reviewing a documentation pull request.

## Does the VS Code preview look like GitHub?

Close, but not identical. VS Code uses its own stylesheet and its own markdown parser configuration, so spacing, fonts and some extensions differ from what GitHub shows. If you need to know how a README will look on GitHub, render it with GitHub's rules: the [markdown viewer](/markdown-viewer) renders GitHub Flavored Markdown in the browser, and [previewing a README before pushing](/github-readme-viewer/preview-readme-before-push) covers the README case in detail. Inside VS Code, the Markdown Preview GitHub Styling extension by Matt Bierner restyles the preview to resemble GitHub; it changes the look, not the parser.

## How do I change how the preview looks?

Point the `markdown.styles` setting at one or more CSS files. The setting accepts `https` URLs or paths relative to the workspace root, and your rules are applied on top of the built-in preview styles:

```json
{
  "markdown.styles": ["preview.css"]
}
```

If single line breaks in your source should appear as line breaks in the preview, set `markdown.preview.breaks` to `true`; by default the preview follows CommonMark, where a single newline inside a paragraph is a space. Math rendering can be turned off with `"markdown.math.enabled": false` if dollar signs in your text are being read as formulas.

## Can I export or share the preview?

VS Code's preview has no export or share command. To get a PDF, see [exporting markdown to PDF from VS Code](/markdown-to-pdf/vs-code-markdown-to-pdf), which compares an extension, a browser converter and Pandoc. To send a rendered page to someone without VS Code, copy the file's content into the [markdown viewer](/markdown-viewer) and click **Share as link**, which publishes it at a short address that opens in any browser.

## What if I do not have VS Code?

You do not need it just to read markdown. A browser viewer renders a file in a few seconds with nothing to install. VS Code makes sense when you also write or edit markdown, because the side-by-side preview shows the effect of every change as you type. The difference between tools for reading and tools for writing is covered in [markdown reader vs editor](/markdown-viewer/md-file-reader-vs-editor).
