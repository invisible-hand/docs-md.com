---
title: How to Open a .md File on a Mac (Formatted or Raw)
h1: How do I open a .md file on a Mac?
description: TextEdit and Quick Look show a .md file as raw text. How to read it formatted on macOS: a browser viewer, a Quick Look extension or VS Code's preview.
tool: markdown-viewer
updated: 2026-10-20
related: /markdown-viewer/open-md-file-windows, /markdown-viewer/why-md-file-shows-symbols, /markdown-viewer/preview-markdown-in-vs-code, /readme-generator/how-to-open-readme-md
---
Control-click the file, choose Open With, and pick TextEdit. A .md file is plain text, so it opens, but you see the raw markdown symbols. macOS has no built-in markdown renderer, so to read it formatted use a browser viewer, a Quick Look extension, or an editor with a preview such as VS Code.

Markdown writes formatting with ordinary characters: `#` before a heading, `**` around bold text, `-` in front of a list item, pipes for tables. The format was designed to stay readable as plain text, so TextEdit is enough for a short note. For a long README with tables and code, the symbols get in the way, and a rendered view is much easier to read. None of the options below change the file, and none of them need an account. Which one fits depends on whether you only want to read the file once or work with markdown regularly.

## How do I open a .md file in TextEdit?

Control-click (or right-click) the file in Finder, choose **Open With**, then **TextEdit**. TextEdit shows the markdown source as typed. If **TextEdit** is not in the list, choose **Other…** and pick it from Applications. If you edit and save the file, keep it as plain text: in TextEdit, **Format**, **Make Plain Text** ensures it does not turn the file into rich text. TextEdit does not interpret markdown, so headings stay as lines starting with `#`.

## Why does Quick Look show raw markdown?

Quick Look, the preview you get by selecting a file in Finder and pressing the Space bar, treats a `.md` file as plain text. It shows the content but not the formatting, so you see the `#` and `*` characters. To get a rendered preview in Quick Look you need a third-party Quick Look extension that handles markdown.

One open-source option is [QLMarkdown](https://github.com/sbarex/QLMarkdown), a macOS Quick Look extension for markdown files. Its README offers a downloadable release and a Homebrew install:

```bash
brew install --cask qlmarkdown
```

After installing, open the app once so macOS registers the extension, then check that it is enabled under the Quick Look section of extensions in System Settings. Older Quick Look plugins in the `.qlgenerator` format are not supported by recent macOS versions, so prefer a project that ships as an app extension and has recent releases.

## How do I read a .md file formatted without installing anything?

Use a browser viewer. Open the [markdown viewer](/markdown-viewer) in Safari, Chrome or Firefox, then drag the `.md` file from Finder onto the viewer panel, or click **Open .md file** and choose it. The file is read locally by the browser, not uploaded, and it renders with GitHub's rules: headings, tables, task lists, footnotes, highlighted code and Mermaid diagrams. **Hide source** gives a full-width reading view and the outline lets you jump between headings. Opening the file directly in Safari instead, with **File**, **Open File**, shows plain text, because browsers do not render markdown on their own.

## How do I preview a .md file in VS Code on a Mac?

Open the file in Visual Studio Code and press **Cmd+Shift+V** to switch to the rendered preview, or **Cmd+K** then **V** to open the preview beside the source. Both shortcuts are listed in the [VS Code markdown documentation](https://code.visualstudio.com/docs/languages/markdown). The preview updates as you type, scrolls along with the editor and renders Mermaid diagrams and math. If you do not have VS Code, it is a free download, and the [VS Code preview guide](/markdown-viewer/preview-markdown-in-vs-code) covers the rest of its options.

## How do I make .md files always open in one app?

Select a `.md` file in Finder and press **Cmd+I** to open **Get Info**. Under **Open with**, choose the app, then click **Change All…** and confirm. Every `.md` file now opens in that app on double-click. Pick a markdown editor or VS Code if you want formatting; TextEdit if you only need the text. A browser is not a good default for local files, because without an extension it shows plain text. You can undo the change the same way by choosing a different app and clicking **Change All…** again.

## Which markdown apps exist for the Mac?

Several native editors render markdown, including Typora, Obsidian and iA Writer, along with many smaller ones on the Mac App Store. They differ in price, in which extensions they support (tables, footnotes, math, Mermaid) and in whether they show source and preview side by side or blend them in one view. For reading a file you received, an app is optional; for writing notes every day, one of these is worth trying. Check the developer's current website for pricing and supported macOS versions before you install, because those change.

## Can I read a .md file from the Terminal?

Yes, as text: `cat README.md` or `less README.md` prints the source. There are command-line tools that render markdown for the terminal, such as Glow, which you can install with Homebrew, but they are only worth it if you already live in the Terminal. Pandoc can convert a file to HTML that you then open in a browser:

```bash
pandoc README.md -s -o README.html && open README.html
```

## Which option should I pick?

For a file someone sent you, the browser viewer: no install, complete rendering, nothing uploaded. If you preview markdown files in Finder all day, install a Quick Look extension. If you edit markdown, use VS Code or a dedicated editor. If the file is a README from a GitHub project, the [GitHub README viewer](/github-readme-viewer) reads it from the repository with its relative links and images working, and [the Windows version of this guide](/markdown-viewer/open-md-file-windows) covers the same steps for a PC.
