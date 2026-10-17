---
title: Why Are My README Images Not Showing on GitHub?
h1: Why are my README images not showing on GitHub?
description: The causes of broken README images on GitHub, in order of likelihood: not pushed, wrong case, wrong relative path, spaces, private hosts, Camo.
tool: github-readme-viewer
updated: 2026-10-17
related: /guides/markdown-image, /github-readme-viewer/preview-readme-before-push, /github-readme-viewer/how-to-format-readme-md, /markdown-link-checker
---
Usually the image is not on GitHub at the path the README gives: it was never committed or pushed, the letter case differs, or the relative path starts from the wrong folder. Less often, an external host blocks GitHub's image proxy. Open the image path on GitHub directly; a 404 there means a path problem.

The syntax itself is rarely the issue, since `![alt text](path/to/image.png)` is hard to get wrong; the [image guide](/guides/markdown-image) covers it, along with resizing and dark-mode variants. This page is the GitHub-specific checklist, roughly in order of how often each cause turns out to be the answer.

## Is the image file actually in the repository?

Check this first, because it is the most common cause. An image that shows in your local preview is being read from your disk. GitHub can only show files that were committed and pushed to the branch you are looking at. Run these from the repository root:

```bash
git ls-files docs/images/          # tracked files in that folder
git status --short docs/images/    # untracked or changed files
git check-ignore -v docs/images/screenshot.png   # is a .gitignore rule hiding it?
```

If `git ls-files` does not list the image, it was never committed. If `git check-ignore` prints a line, a `.gitignore` pattern (often a broad one like `*.png` or `docs/`) is excluding the file, and it names the rule. Commit the file, push, and reload the README. Also make sure you are viewing the branch you pushed to; the repository page shows the default branch.

## Could the letter case of the file name be wrong?

Yes, and it is the cause that is hardest to spot, because the image works on your computer. Paths on GitHub are case-sensitive: in our check, a raw file URL ending in `README.md` returned 200 and the same URL ending in `readme.md` returned 404. Common file systems on macOS and Windows are not case-sensitive, a fact Git's own documentation notes when it lists APFS, HFS+, FAT and NTFS ([git-config, core.ignoreCase](https://git-scm.com/docs/git-config#Documentation/git-config.txt-coreignoreCase)). So `![Logo](images/Logo.png)` finds `images/logo.png` locally and fails on GitHub.

Compare the path in the README with the output of `git ls-files`, letter by letter, including folder names. Renaming only the case of a file needs `git mv` (for example `git mv images/Logo.png images/logo.png`) so that Git records the change on a case-insensitive disk.

## Is the relative path starting from the right folder?

A relative image path is resolved from the folder of the markdown file, not from the repository root. GitHub's docs describe the rules: paths are "relative to the current file", links starting with `/` are relative to the repository root, and `./` and `../` work as usual ([GitHub Docs, relative links and image paths](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes#relative-links-and-image-paths-in-markdown-files)).

| README location | Image location | Path that works |
|---|---|---|
| `README.md` | `docs/img/a.png` | `docs/img/a.png` or `/docs/img/a.png` |
| `docs/README.md` | `docs/img/a.png` | `img/a.png` |
| `docs/README.md` | `assets/a.png` | `../assets/a.png` or `/assets/a.png` |
| `.github/README.md` | `assets/a.png` | `../assets/a.png` or `/assets/a.png` |

The last row catches people out: GitHub shows a README from the `.github` folder on the repository's front page, but relative paths still start from `.github/`. A path starting with `/` avoids the question, at the cost of not working in some other renderers.

## Does the file name contain spaces or special characters?

A space ends the image destination, so `![Diagram](docs/my diagram.png)` is not read as an image at all and shows up as text. Either rename the file (the simplest fix), write the space as `%20`, or wrap the path in angle brackets, which CommonMark allows for destinations that contain spaces ([CommonMark spec, link destination](https://spec.commonmark.org/0.31.2/#link-destination)):

```markdown
![Diagram](docs/my%20diagram.png)
![Diagram](<docs/my diagram.png>)
```

Parentheses, `#` and `?` in file names cause similar trouble because they have meaning in a URL. Lower-case names with hyphens avoid all of it.

## Why does an image from another website not load?

GitHub does not load external images directly in your reader's browser. It sends them through an image proxy called Camo, which fetches the image and serves it from a `githubusercontent.com` address ([GitHub Docs, About anonymized URLs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-anonymized-urls)). That causes three kinds of failure:

1. **The host requires a login or is on a private network.** GitHub's docs say such an image "can't be viewed by GitHub" and advise moving it to a publicly available service.
2. **The server sends an unexpected content type.** Check with `curl -I https://example.com/image.png` and look at `Content-Type`; Camo only proxies the image types on its list.
3. **The image changed but GitHub shows the old one.** Camo caches images. The docs suggest serving them with `Cache-Control: no-cache` and describe how to purge one cached URL with `curl -X PURGE` as a last resort.

Hosts that refuse requests from other sites (hotlink protection) or delete files after a while also break images over time. Storing images in the repository and using relative paths avoids these problems entirely.

## Why do the images show on GitHub but not on npm or another site?

Because GitHub rewrites relative image paths for its own pages, and other sites that display your README may not. GitHub's docs say it transforms relative paths "based on whatever branch you're currently on"; a package registry or documentation site reading the same file has no such rule, so `docs/img/a.png` points nowhere. If the README is published elsewhere, use full URLs to the raw file, as the [image guide](/guides/markdown-image) shows. Images stored in a private repository fail there as well, since outside readers have no access to them; even on GitHub, its docs note that relative links to images in a private repository work only for viewers with at least read access.

## How can I check every image link at once?

For a public repository, open it in the [GitHub README viewer](/github-readme-viewer), which renders the README with the repository's relative images resolved; any image that is broken there is very likely broken on GitHub too, and the viewer links back to the file on GitHub. To list broken links and images in a markdown file, run it through the [markdown link checker](/markdown-link-checker). Before you push, the [README preview guide](/github-readme-viewer/preview-readme-before-push) explains which previews show unpushed images and which do not.

## Can a long README hide images?

Yes, at the very end. GitHub's docs say that when a README is viewed on GitHub, "any content beyond 500 KiB will be truncated", so images referenced after that point are not shown. Only very long READMEs reach that size; if yours does, move reference material into a `docs/` folder and link to it.
