---
title: How to Preview a README Before Pushing to GitHub
h1: How do I preview a README before pushing to GitHub?
description: Four ways to see a README.md as GitHub will render it before it reaches main: editor preview, GitHub's Preview tab, a branch, or the markdown API.
tool: github-readme-viewer
updated: 2026-10-17
related: /github-readme-viewer/how-to-format-readme-md, /markdown-viewer, /guides/markdown-alerts, /guides/markdown-image
---
Open the README in your editor's markdown preview for quick checks, paste it into the Preview tab of GitHub's file editor to see GitHub's own rendering without committing, or push it to a separate branch and read it there before merging. Only the branch method shows images and relative links exactly as they will appear on the repository page.

The reason there is no single perfect answer is that GitHub renders a README with its own pipeline: GitHub Flavored Markdown, then a sanitizing step, then GitHub-specific features such as alerts and rewritten relative links. Any preview outside GitHub reproduces some of that, not all of it. The useful question is which differences matter for your file. The table summarizes the trade-offs before the details.

| Method | Uses GitHub's renderer | Unpushed images show | Needs a push |
|---|---|---|---|
| VS Code preview | No (CommonMark, markdown-it) | Yes, from disk | No |
| GitHub editor Preview tab | Yes | No | No |
| A separate branch | Yes | Yes, once pushed | Yes, not to main |
| GitHub markdown API | Yes, with gaps | No | No |

## How do I preview a README in VS Code?

Open the file and press Ctrl+Shift+V (Cmd+Shift+V on macOS) to switch to the preview, or Ctrl+K V (Cmd+K V) to open it beside the source, where it updates as you type ([VS Code docs, Markdown preview](https://code.visualstudio.com/docs/languages/markdown#_markdown-preview)). Images load from your disk, so screenshots you have not committed yet appear, and scrolling stays in sync between the two panes.

Know the gap. The VS Code docs state that it targets the CommonMark specification using the markdown-it library, not GitHub Flavored Markdown. In practice, check GitHub-only features such as [alerts](/guides/markdown-alerts) on GitHub itself. The preview also blocks scripts and, under its default "Strict" security setting, images served over plain `http`. Other editors and IDEs have similar previews with similar limits.

## How do I use GitHub's Preview tab without committing?

Open any markdown file in the repository on GitHub, click the pencil icon to edit it, paste your new README text into the editor, and click **Preview** above the content ([GitHub Docs, editing files](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files)). This is GitHub's own renderer, so headings, tables, task lists, alerts and allowed HTML look as they will on the repository page. When you are done, cancel the edit instead of clicking **Commit changes**, and nothing is saved.

Two limits. Images and files that exist only on your computer are missing, because GitHub cannot see them yet. And pasting into a browser editor is fine for checking the text but easy to get wrong for a long file, so treat it as a check, not the place you edit. Pressing `.` on a repository page opens github.dev, a web version of VS Code, but its markdown preview is VS Code's, with the same gap described above.

## Why push the README to a branch first?

Because a branch is the only preview that is exactly what readers will see. Create a branch, commit the README and its images, push, and open the branch on GitHub. GitHub's docs say relative links and image paths are rewritten "based on whatever branch you're currently on, so that the link or path always works", so images in the branch resolve to the branch's files ([GitHub Docs, About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes#relative-links-and-image-paths-in-markdown-files)).

```bash
git switch -c readme-update
git add README.md docs/images/
git commit -m "Rewrite README"
git push -u origin readme-update
```

If you open a pull request from the branch, GitHub can show the change as a rendered "rich diff" of the markdown, with added and removed text highlighted, which makes review easier ([GitHub Docs, prose diffs](https://docs.github.com/en/repositories/working-with-files/using-files/working-with-non-code-files#rendering-differences-in-prose-documents)). For a public repository you can also read the branch in the [GitHub README viewer](/github-readme-viewer) at an address like `docs-md.com/gh/owner/repo?ref=readme-update`, which shows the README together with the other markdown files in the repo and its `docs/` folder. The viewer does not read private repositories. Merge when it looks right.

## Can I render a README with GitHub's API?

Yes. GitHub's REST API has a `POST /markdown` endpoint that returns the HTML for any markdown you send ([GitHub Docs, Markdown API](https://docs.github.com/en/rest/markdown/markdown)). It works without a token for public use, within the unauthenticated limit of 60 requests per hour:

```bash
jq -Rs '{text: ., mode: "markdown"}' README.md \
  | curl -s -X POST https://api.github.com/markdown -d @- > preview.html
```

Open `preview.html` in a browser to see the output, unstyled. In our tests on 2026-10-17 the endpoint did not match a repository README exactly. In `markdown` mode it left task lists and alerts as plain text. In `gfm` mode it rendered them but treated every single line break as a break, the way GitHub comments do, which READMEs do not. Relative image paths came back unchanged, so repository images do not load. The API is useful for scripts and checks in CI, less so as a visual preview.

## Which preview should I use for a quick check?

For most edits, the editor preview while you write, then one look at the branch or the Preview tab before you merge. If you only need to confirm the syntax of a single file, paste it into the [markdown viewer](/markdown-viewer), which renders GitHub Flavored Markdown in the browser without uploading anything. When you drop a local file in, only that file is read, so its relative images will not load; check those on GitHub.

## What usually looks different after the README is pushed?

The same handful of things, so check them first in any preview:

- **Line breaks.** A single newline does not break a line in a README; use a blank line, a trailing backslash or `<br/>`.
- **Images.** Paths are case-sensitive on GitHub and relative to the README's folder; see [why README images are not showing](/github-readme-viewer/readme-images-not-showing).
- **HTML.** GitHub strips `style` attributes and scripts, so styled HTML that looked fine locally can lose its styling.
- **Alerts and task lists.** Non-GitHub previews may show them as plain quotes or bracketed text.
- **Mermaid and math.** VS Code's preview renders both, and GitHub documents support for [Mermaid diagrams](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams) and math in markdown files, but the two use separate renderers, so look at diagrams on GitHub too.

The [README formatting guide](/github-readme-viewer/how-to-format-readme-md) covers the syntax for each of these.

## Does the README preview show the same thing on npm or PyPI?

No. GitHub's preview shows GitHub's rendering, and package registries render the README with their own rules. Relative image paths are the usual casualty, because they are rewritten by GitHub but not necessarily by other sites. If the README will also be shown on a registry, use full image URLs that point at the raw file, as the [image guide](/guides/markdown-image) explains, and check the package page after publishing.
