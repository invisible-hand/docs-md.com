---
title: How to Format a README.md: Syntax That Works on GitHub
h1: How do I format a README.md?
description: The markdown a README.md needs on GitHub: headings, code blocks, lists, tables, relative links and images, alerts, line breaks, and which HTML survives.
tool: github-readme-viewer
updated: 2026-10-17
related: /readme-generator/what-is-a-readme-file, /guides/markdown-code-block, /guides/markdown-image, /guides/markdown-alerts
---
Format a README.md with GitHub Flavored Markdown: `#` headings for sections, a blank line between paragraphs, fenced code blocks with a language name for commands, `-` for lists, pipes for tables, and relative paths for images and links to other files. GitHub renders the file on the repository's front page, so check the rendered result before you commit.

This page is about the formatting itself. What a README should contain (sections, order, length) is covered in [What is a README file?](/readme-generator/what-is-a-readme-file). Here, the question is how to write each part so it renders the way you expect on GitHub, which runs its own variant of markdown and its own cleanup step on the result.

## What markdown syntax does a README use?

Ordinary markdown plus the GitHub Flavored Markdown (GFM) extensions: tables, task lists, strikethrough and autolinks. These are the elements almost every README uses:

| Element | Syntax | Notes |
|---|---|---|
| Title | `# Project name` | One H1 at the top |
| Section | `## Installation` | H2 for sections, H3 for subsections |
| Bold, italic | `**bold**`, `_italic_` | |
| Inline code | `` `npm install` `` | For names, flags, file paths |
| Code block | three backticks plus a language | See the next section |
| Bulleted list | `- item` | Indent two spaces to nest |
| Numbered list | `1. step` | Good for setup steps |
| Link | `[docs](docs/setup.md)` | Relative paths for repo files |
| Image | `![alt text](docs/screenshot.png)` | Alt text is required in practice |
| Table | `\| a \| b \|` rows with a `\|---\|---\|` divider | GFM extension |
| Task list | `- [ ] todo`, `- [x] done` | GFM extension |

Use headings in order without skipping levels, because GitHub builds the file's outline menu and the anchor for every section link from them. The [headings guide](/guides/markdown-headings) covers the syntax and common mistakes.

## How should I format code and commands in a README?

Put every command and code sample in a fenced code block with a language name after the opening backticks, so GitHub applies syntax highlighting:

````markdown
```bash
npm install my-package
```

```js
import { convert } from 'my-package';
console.log(convert('# Hello'));
```
````

Keep one command per line and leave out the shell prompt (`$`), so readers can copy the block and run it. Use inline backticks for short names in a sentence, such as `--verbose` or `config.json`. The [code block guide](/guides/markdown-code-block) lists the language names and how to show backticks inside a block.

## Why does my README put two lines on one line?

Because a single line break inside a paragraph is ignored in `.md` files. GitHub's docs point out that issues and comments show a line break where you press Enter, but a README does not ([GitHub Docs, line breaks](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#line-breaks)). To force a break inside a paragraph, end the line with two spaces, a backslash (`\`), or `<br/>`. To start a new paragraph, leave a blank line. The backslash is the easiest to see when you read the source, so it is the safest choice; the [new line guide](/guides/markdown-new-line) compares all three.

## How do I add images, badges and links to other files?

Use paths relative to the README for anything inside the repository. GitHub's docs say it rewrites relative links and image paths "based on whatever branch you're currently on, so that the link or path always works", that paths starting with `/` resolve from the repository root, and that `./` and `../` work as usual ([GitHub Docs, relative links](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes#relative-links-and-image-paths-in-markdown-files)).

```markdown
![Screenshot of the dashboard](docs/images/dashboard.png)

See the [contribution guide](CONTRIBUTING.md) before opening a pull request.
```

Badges are images wrapped in links and usually sit in one line under the title. Keep the link text of any link on a single line; GitHub notes that link text split across lines does not work. Resizing, captions and dark-mode variants need HTML, which the [image guide](/guides/markdown-image) explains. If an image does not appear after you push, the [README images guide](/github-readme-viewer/readme-images-not-showing) goes through the causes.

## How do I add notes and warnings to a README?

Use GitHub's alert syntax, a blockquote whose first line is a type in brackets:

```markdown
> [!WARNING]
> Version 2 changes the config file format. Read the migration notes first.
```

GitHub supports five types: `NOTE`, `TIP`, `IMPORTANT`, `WARNING` and `CAUTION`. Its docs advise using alerts only when they are crucial and limiting them to one or two per article, and say alerts cannot be nested inside other elements. Other sites that display your README may show an alert as a plain quote with `[!WARNING]` in it; the [alerts guide](/guides/markdown-alerts) covers where they render and a portable alternative.

## What HTML can I use in a README on GitHub?

A limited set. GitHub converts the markdown and then sanitizes the HTML, "aggressively removing things that could harm you", including `script` tags, inline styles, and `class` or `id` attributes ([github/markup](https://github.com/github/markup#readme)). In practice that leaves layout to a few tags and attributes. When we sent a test file to GitHub's markdown rendering API on 2026-10-17, these survived: `align="center"` on a `<p>`, `width` on an `<img>`, `<details>` and `<summary>`, `<kbd>`, `<sub>` and `<picture>` with a dark-mode `<source>`. A `style` attribute was removed, a `<font color>` tag was dropped (its text kept), and an `id` was rewritten with a `user-content-` prefix.

So `<p align="center">` is the usual way to center a logo, colored text cannot be done with HTML, and collapsible sections work with `<details>`. To hide a note from the rendered page, use an HTML comment, `<!-- like this -->`. The [collapsible section guide](/guides/markdown-collapsible-section) shows the blank lines `<details>` needs for markdown inside it to render.

## Is there a size limit for a README on GitHub?

Yes. GitHub's docs say that when a README is viewed on GitHub, "any content beyond 500 KiB will be truncated". Very few READMEs come close, but generated ones (API references, long changelogs, embedded tables of data) can. Move long material to a `docs/` folder and link to it. GitHub also recognizes a README in the `.github` or `docs` folder, and picks `.github` first, then the root, then `docs` if there is more than one.

## How do I check the formatting before I commit?

Preview it. GitHub's file editor has a **Preview** tab, editors such as VS Code have a side-by-side preview, and once the file is pushed to a public repository you can read it in the [GitHub README viewer](/github-readme-viewer), which shows the README with the repository's other docs and resolves its relative links and images. Each method has gaps compared with GitHub's own rendering; the [README preview guide](/github-readme-viewer/preview-readme-before-push) compares them.
