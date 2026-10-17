---
title: How to Open a README.md File on Any Computer
h1: How do I open a README.md file?
description: A README.md is plain text, so any text editor opens it. How to see it formatted instead, on Windows, macOS, Linux, in VS Code, the terminal or a browser.
tool: readme-generator
updated: 2026-10-17
related: /markdown-viewer, /github-readme-viewer, /readme-generator/what-is-a-readme-file, /guides/markdown-headings
---
Open it with any text editor, because a README.md is plain text: Notepad on Windows, TextEdit on macOS, or any editor on Linux. You will see the markdown symbols as typed. To see it formatted, with real headings, lists and links, open it in a markdown viewer, in VS Code's preview, or on the project's GitHub page.

The `.md` extension means markdown, a way of writing formatting with ordinary characters: `#` before a heading, `*` around emphasis, `-` at the start of a list item. It was designed to read well even unformatted, so the raw file is usable. Nothing in it is executable or needs a special program, and opening it in a text editor is safe. The question is only whether you want to see the symbols or the formatted result. If you are not sure what the file is for, [what a README file is](/readme-generator/what-is-a-readme-file) explains the convention.

## How do I open a README.md file on Windows?

Right-click the file, choose **Open with**, and pick **Notepad**. If Windows asks how you want to open the file, choose Notepad and, if you like, tick the option to always use it for `.md` files. Any code editor you already have, such as VS Code or Notepad++, also works. Double-clicking may do nothing useful if no program is associated with `.md`, which is why the right-click route is more reliable the first time.

## How do I open a README.md file on a Mac?

Control-click the file, choose **Open With**, and pick **TextEdit**. TextEdit shows the raw markdown. If it opens the file in rich-text mode or the characters look wrong, it is still the same text; nothing is lost. For a formatted view, use one of the viewers below.

## How do I open a README.md file on Linux or in a terminal?

Any editor opens it (gedit, Kate, nano, vim). On Linux and macOS, these print the raw text or page through it in a terminal:

```bash
cat README.md
less README.md
```

On Windows, `type README.md` does the same in Command Prompt and `Get-Content README.md` in PowerShell.

For a formatted view inside the terminal, [Glow](https://github.com/charmbracelet/glow) renders markdown with styled headings, lists and code. Its README lists installs such as `brew install glow` and `winget install charmbracelet.glow`, and then:

```bash
glow README.md
```

## How do I see a README.md formatted instead of as raw text?

You have four options, from no installation to most control:

1. **In your browser.** Open the [markdown viewer](/markdown-viewer), click **Open .md file** (or drop the file on the panel, or paste its text), and it renders the file with headings, tables, code highlighting and Mermaid diagrams. You can also paste a raw or GitHub file URL to load it.
2. **On GitHub or GitLab.** If the README belongs to a repository, the project's front page already shows it formatted. GitHub's [README documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) says it looks for the file in the `.github` folder, the root and the `docs` folder, in that order, and also adds an outline menu built from the headings. To read a repository's README and its docs folder as formatted pages, paste the repository URL into the [GitHub README viewer](/github-readme-viewer).
3. **In VS Code.** Open the file and press Ctrl+Shift+V (Cmd+Shift+V on macOS) to switch to the preview, or Ctrl+K V (Cmd+K V) to open the preview beside the text, per the [VS Code documentation](https://code.visualstudio.com/docs/languages/markdown).
4. **As an HTML file.** With Pandoc installed, convert it and open the result in any browser:

```bash
pandoc -s README.md -o README.html
```

## Why does my README look different in different places?

Because "markdown" covers several dialects. GitHub uses GitHub Flavored Markdown, which adds tables, task lists, strikethrough and alerts; a basic viewer may show those as plain text. Relative links and images such as `![logo](docs/logo.png)` only work where the viewer can see the rest of the repository, so they break when you open a single downloaded file in a browser tool. HTML inside the file is shown, stripped or escaped depending on the viewer. If something looks broken in one place, check it on the code host where the project lives, since that is what the author tested against.

## Can I edit a README.md file?

Yes, in the same text editor you opened it with. Save it as plain text with the `.md` extension, not as `.rtf` or `.docx`; TextEdit in particular may try to save rich text, so use **Format > Make Plain Text** first if it offers. Keep the markdown symbols intact, and preview the result before you commit it. If you are writing one from scratch, the [README generator](/readme-generator) fills in a standard layout from a form, shows a live preview and downloads a ready `README.md`; [headings](/guides/markdown-headings) and the other syntax guides cover the formatting by hand.

## What if the file is called README without .md, or README.rst?

`README` with no extension and `README.txt` are plain text; open them exactly the same way. `README.rst` is reStructuredText, a different markup language common in older Python projects: it is also readable as plain text, and GitHub renders it formatted, but markdown viewers will not interpret its syntax. `README.adoc` is AsciiDoc, which likewise reads fine raw. On the command line, Pandoc can convert reStructuredText to HTML in the same way as markdown.

## Is it safe to open a README.md file?

Yes. A markdown file is text and cannot run anything when you open it, in a text editor or in a viewer. The care needed is with what it tells you to do. A README often contains install commands and links, and those are only as trustworthy as the project. Before pasting a command such as `curl ... | sh` from the README of a project you do not know, read what it downloads and where from. Links in a rendered README can point anywhere, exactly like links on a web page, so check the address before you follow one that asks for a login.

## Why won't my README.md open on my phone?

Phones often have no app associated with `.md` files. The simplest fix is to open the repository page in your phone's browser, where the README is shown formatted. If you have only the file, a text-editor app opens it as plain text, or you can open the browser-based markdown viewer and choose the file from your device. Large READMEs with wide tables are easier to read in landscape.
