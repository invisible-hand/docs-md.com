---
title: Generate a Markdown Table of Contents in VS Code
h1: How do I generate a Markdown table of contents in VS Code?
description: VS Code has no built-in TOC command. Use the Markdown All in One extension, header link completions, or paste the file into a TOC generator.
tool: markdown-toc-generator
updated: 2026-10-17
related: /markdown-toc-generator/github-readme-table-of-contents, /guides/markdown-anchor-link, /guides/markdown-headings, /markdown-viewer
---
VS Code cannot generate a table of contents on its own: its built-in Markdown support shows an outline of your headings but never writes one into the file. Install the Markdown All in One extension and run "Create Table of Contents" from the Command Palette, or paste the file into a browser TOC generator.

The difference matters because the two things look similar. VS Code's Outline view, at the bottom of the Explorer sidebar, shows "the Markdown file's header hierarchy" so you can jump around while editing ([VS Code docs, Markdown](https://code.visualstudio.com/docs/languages/markdown#_document-outline)). That outline lives in the editor. Readers of the rendered file on GitHub or elsewhere never see it. A table of contents is markdown text inside the file: a list of links to each heading's anchor.

## How do I create a TOC with Markdown All in One?

Install the extension, open the markdown file, and run its command. Step by step:

1. Open the Extensions view, search for **Markdown All in One** (identifier `yzhang.markdown-all-in-one`) and install it.
2. Put the cursor where the table of contents should go, usually on a blank line under the H1 title.
3. Open the Command Palette (Ctrl+Shift+P on Windows and Linux, Cmd+Shift+P on macOS) and run **Markdown All in One: Create Table of Contents**.

The extension inserts a nested list of links. By default it updates that list every time you save the file, so renamed or added headings are picked up without another command; turn this off with the `markdown.extension.toc.updateOnSave` setting. There is also an **Update Table of Contents** command for manual control. These commands and settings are documented in the extension's README ([Markdown All in One](https://github.com/yzhang-gh/vscode-markdown#table-of-contents)).

## Which settings control the generated TOC?

All of them are under `markdown.extension.toc` in `settings.json`. The ones most people change:

| Setting | Default | What it does |
|---|---|---|
| `markdown.extension.toc.levels` | `1..6` | Which heading levels are included; `2..3` suits most READMEs |
| `markdown.extension.toc.slugifyMode` | `github` | How anchors are built: `github`, `gitlab`, `gitea` or `vscode` |
| `markdown.extension.toc.orderedList` | `false` | Numbered list instead of bullets |
| `markdown.extension.toc.unorderedList.marker` | `-` | Bullet character: `-`, `*` or `+` |
| `markdown.extension.toc.updateOnSave` | `true` | Rewrite the TOC on every save |
| `markdown.extension.toc.omittedFromToc` | `{}` | Headings to leave out, per file |

```json
{
  "markdown.extension.toc.levels": "2..3",
  "markdown.extension.toc.slugifyMode": "github"
}
```

Set `slugifyMode` to match where the file will be read. The anchor rules differ slightly between platforms, and a TOC built with the wrong rules has links that work in one place and not in another. The [anchor link guide](/guides/markdown-anchor-link) lists how GitHub, GitLab and others turn headings into anchors.

## How do I leave a heading out of the TOC in VS Code?

Add the comment `<!-- omit from toc -->` at the end of the heading line (or on the line above it), and Markdown All in One skips that heading. You can also narrow the levels with `markdown.extension.toc.levels`, or list headings to skip for a given file in `markdown.extension.toc.omittedFromToc`. If the extension mistakes an ordinary list of links for a table of contents and starts rewriting it, its README says to put `<!-- no toc -->` above that list. Both comments are invisible in the rendered output on GitHub, as explained in the [markdown comment guide](/guides/markdown-comment).

## Can I write a TOC in VS Code without an extension?

Yes, by hand with the help of built-in link completions. In a markdown file, type `[Installation](#` and VS Code suggests every heading in the current file; picking one inserts its anchor. Typing `##` inside a link's target suggests headings from all markdown files in the workspace and inserts the full path, such as `docs/setup.md#requirements` (controlled by `markdown.suggest.paths.includeWorkspaceHeaderCompletions`). This works well for a short TOC, but you have to edit it yourself whenever a heading changes.

A faster route without installing anything is to copy the file into the [markdown TOC generator](/markdown-toc-generator), choose the depth and list style, and paste the result back. It builds anchors with GitHub's rules and runs in the browser, so nothing is uploaded. The trade-off is that it is a one-off copy: the TOC will not update on save.

## How do I check that the TOC links work?

Open the preview and click through them. **Markdown: Open Preview to the Side** (Ctrl+K V, or Cmd+K V on macOS) shows the rendered file next to the source; **Markdown: Open Preview** toggles to it with Ctrl+Shift+V or Cmd+Shift+V. For a check that does not involve clicking, turn on link validation with `"markdown.validate.enabled": true`. VS Code then reports links to headers that do not exist in the current file and in other markdown files. The docs note that it checks local links only, not external URLs.

One caveat: the VS Code preview is not GitHub. Its docs say it targets CommonMark using the markdown-it library rather than GitHub Flavored Markdown, so a link that works in the preview can still fail on GitHub if the anchor rules differ. If GitHub is the destination, keep `slugifyMode` on `github` and do a final check there, or in the [GitHub README viewer](/github-readme-viewer) once the file is pushed.

## Why did my TOC links break after renaming a heading?

Because the anchor is derived from the heading text, so a new heading means a new anchor. If Markdown All in One updates the TOC on save, the list is fixed for you, but links to that heading elsewhere in the file or in other files are not. VS Code's built-in **Rename Symbol** command helps here: run it on a heading and, according to the VS Code docs, it "updates the header and automatically updates all links to that header" across the workspace. Use it instead of retyping the heading when other files link to the section.

## Does the TOC work the same on GitHub?

Yes, if the anchors were built with GitHub's rules, which is the extension's default. GitHub also offers its own generated outline from a menu on every rendered markdown file, so a README there has two kinds of navigation. The [GitHub README TOC guide](/markdown-toc-generator/github-readme-table-of-contents) explains when the written list is still worth having and where to place it.
