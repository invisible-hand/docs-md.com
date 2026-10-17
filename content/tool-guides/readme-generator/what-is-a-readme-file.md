---
title: What Is a README File? Purpose, Contents, Format
h1: What is a README file?
description: A README is the plain-text file that introduces a project: what it does, how to install and use it, and where to go next. Where it lives, what goes in it.
tool: readme-generator
updated: 2026-10-17
related: /github-readme-viewer, /markdown-toc-generator, /guides/markdown-headings, /guides/markdown-code-block
---
A README file is a plain-text introduction to a project, kept in its top folder. It tells a newcomer what the project is, why it exists, how to install and run it, and where to find help. Today it is usually `README.md`, written in markdown, and code hosts like GitHub show it on the project's front page.

The name is literal: it is the file you are meant to read first. The convention is decades older than GitHub. Software distributed on tapes, floppy disks and FTP servers shipped with a file called `README` so that whoever unpacked the archive had an obvious starting point, and the GNU coding standards still ask every package to include one with a general overview. What changed is where people read it. A README used to be opened in a terminal after downloading; now it is the landing page of a repository, a package page on npm or PyPI, and often the first thing an AI coding assistant reads when it is pointed at a codebase.

## What does a README file do?

A README answers the questions a stranger has in the first minute: what is this, is it for me, and how do I start? Everything else in a project (the source, the tests, the full documentation) assumes the reader already decided to engage. The README is where that decision is made.

In practice it does four jobs:

- **Orientation.** One or two sentences that say what the project does and for whom. If a reader cannot tell from the opening whether this solves their problem, the rest of the file does not get read.
- **Getting started.** The shortest path from nothing to a working result: requirements, the install command, and one example of real use.
- **Navigation.** Links to the places the README does not cover in depth, such as full documentation, the changelog, the issue tracker and the contribution guide.
- **Terms.** The license, and for many projects the support status (maintained, experimental, archived) so nobody builds on something that is abandoned.

A README is not a manual. Its job is to get someone to the second step, not to answer every question they will ever have.

## What should a README contain?

There is no required structure, but most good READMEs share the same skeleton, in roughly this order:

1. **Project name and a one-line description.** Plain language, no slogans.
2. **Badges (optional).** Build status, latest version, license. Useful when they are live; noise when they are not.
3. **What it does and why.** A short paragraph, sometimes a screenshot or a diagram.
4. **Installation.** Exact commands in a code block, plus prerequisites such as the runtime version.
5. **Usage.** The smallest example that does something real, with its output if that helps.
6. **Configuration.** Only the options most people need; link to the rest.
7. **Contributing.** How to report a bug, run the tests and open a pull request, or a link to `CONTRIBUTING.md`.
8. **License.** The license name and a link to the `LICENSE` file.

Commands and example code belong in fenced code blocks with a language tag so they get syntax highlighting; the [code block guide](/guides/markdown-code-block) covers the syntax. Long READMEs benefit from a table of contents near the top, which the [markdown TOC generator](/markdown-toc-generator) can build from your headings.

Which sections matter depends on the project. A library needs an installation command and an API example. An application needs a screenshot and a download link. A dataset needs its source, its schema and its license more than any install step. A course or a notes repository may need nothing more than what it is and how it is organised. If you would rather fill in a form than start from a blank file, the [README generator](/readme-generator) produces this skeleton with a live preview, and the [README templates](/readme-templates) page has copyable starting points for libraries, apps, CLIs and data projects.

## Where does a README file go?

Put it in the root folder of the project, next to the code it describes. That is where people look and where tools look. GitHub also recognises a README in a `.github` or `docs` folder and shows it on the repository's front page, and a README inside any subfolder is displayed when someone browses into that folder, which is a handy way to explain what a directory is for.

Package registries read the same file. npm includes the README in the published package and displays it on the package page; Python projects usually point their packaging metadata at the README so PyPI shows it as the project description. Writing one good README therefore covers the repository and the package listing at once.

## What format should a README be in?

Markdown, in a file named `README.md`, unless your ecosystem has a different habit. Markdown reads cleanly as raw text in a terminal and renders as formatted headings, lists, tables and links on every major code host. Other formats you will meet:

| File | Format | Where it is common |
|---|---|---|
| `README.md` | Markdown | GitHub, GitLab, npm, most new projects |
| `README.rst` | reStructuredText | Older Python projects, Sphinx-based docs |
| `README.txt` or `README` | Plain text | Older Unix software, archives, some C projects |
| `README.adoc` | AsciiDoc | Some Java and documentation-heavy projects |

The uppercase name is a convention, not a rule. One commonly cited reason for it is that in a plain ASCII sort, capital letters come before lowercase ones, so `README` floats to the top of a directory listing on systems that sort that way. Code hosts match the name case-insensitively, but `README.md` is what everyone expects to see. Use [headings](/guides/markdown-headings) to structure it, because many renderers turn them into anchor links and an outline.

## How do you open a README.md file?

A `.md` file is plain text, so any text editor opens it: Notepad, TextEdit, VS Code, vim. You will see the markdown symbols (`#` for headings, `*` for emphasis) rather than formatting, which is still readable by design. To see it rendered, open the repository on GitHub or GitLab, use the preview in an editor such as VS Code (the preview command opens it side by side), or paste a repository URL into the [GitHub README viewer](/github-readme-viewer) to read its README and docs folder as formatted pages.

## Is a README the same as documentation?

It is the front door of the documentation, not the whole house. Small projects can fit everything they need in the README. Once a project has many options, several audiences or a long API, the README should stay short and link out to a documentation site or a `docs/` folder. A useful test: if a section is something only an existing user would look up, it probably belongs in the full docs rather than the README.

Other conventional files take some load off it as well. `CONTRIBUTING.md` holds the contribution process, `CHANGELOG.md` the release history, `LICENSE` the legal text, `CODE_OF_CONDUCT.md` the community rules and `SECURITY.md` how to report vulnerabilities. GitHub links several of these automatically from the repository page, so the README only needs a line pointing to each.

## How long should a README be?

As long as it takes to get a new reader to a first working result, and no longer. For a small library that might be a screen and a half. Signs a README has grown too long: the install command is far below the fold, sections repeat what the full docs say, or the changelog lives inside it. Signs it is too short: no example of real use, no install instructions, or no indication of what the project actually does. Keep it current, because an outdated README with commands that no longer work does more harm than a brief one.
