---
title: What Should a README Contain? Sections and Checklist
h1: What should a README contain?
description: The sections a README needs, what good looks like in each, what to leave out, and how the list changes for a library, a CLI, an app or a dataset.
tool: readme-generator
updated: 2026-10-17
related: /readme-generator/what-is-a-readme-file, /github-readme-viewer, /markdown-badge-generator, /markdown-toc-generator
---
A README should contain the project's name and a one-line description, what it does and who it is for, how to install it, a short usage example, how to get help or contribute, and the license. Those six parts answer a newcomer's first questions. Everything else, such as badges, screenshots and configuration, is optional and depends on the project.

GitHub's own [documentation on READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) puts it as five questions: what the project does, why it is useful, how users can get started, where they can get help, and who maintains and contributes to it. The same page adds that a README should hold only what people need to start using and contributing, with longer documentation kept elsewhere. If you are new to the file itself, start with [what a README file is](/readme-generator/what-is-a-readme-file); this page goes section by section.

## What is the minimum a README needs?

A title, one sentence saying what the project does, an install command and one example of use. A reader who gets those four things can decide whether the project fits and try it within a minute. A license line is the fifth item for anything public, because without a license other people have no clear permission to use the code. Everything beyond that is there to save the reader time, not to fill space.

```markdown
# csvtrim

Removes empty rows and trailing spaces from CSV files.

## Install

    pip install csvtrim

## Usage

    csvtrim input.csv -o clean.csv

## License

MIT
```

## What goes in each section?

Here is what good looks like in each common section, in the order most READMEs use:

- **Title and one-liner.** The project name as the only H1, then a plain sentence: "Removes empty rows and trailing spaces from CSV files." Not "a blazing-fast next-generation data tool." Say what it does, not how you feel about it.
- **Badges.** Optional. Build status, latest version and license are the useful ones, because they answer real questions (does it build, is it current, can I use it). The [badge generator](/markdown-badge-generator) writes the markdown for shields.io badges. Remove badges that point at services you no longer use.
- **Description.** Two to four sentences: the problem, who has it, and how this project handles it. A screenshot or a short animated capture belongs here for anything with a user interface.
- **Installation.** Prerequisites first (runtime version, system packages), then the exact command in a fenced code block that can be copied as it is. If there are several ways to install, give the most common one first.
- **Usage.** The smallest example that does something real, ideally with its output. Use realistic names, not `foo` and `bar`, so the example also shows what the project is for.
- **Configuration.** Only the options most people change, in a short table of name, default and meaning. Link to the full list.
- **Documentation and help.** Where the full docs live, where to ask questions, and where to report bugs.
- **Contributing.** How to set up a development copy, run the tests and open a pull request, or a link to `CONTRIBUTING.md`.
- **License.** The license name and a link to the `LICENSE` file.

## How does a README change by project type?

The core stays the same, but the weight shifts:

| Project type | Put first | Usually needs | Usually skip |
|---|---|---|---|
| Library | Install command, API example | Supported versions, link to API docs | Screenshots |
| Command-line tool | Install, one command with output | Common flags, exit codes if scripted | Long API reference |
| Web or desktop app | Screenshot, download or live link | System requirements, how to build from source | Package badges |
| Dataset | Source, schema, size | License and citation, how it was collected | Install steps |
| Internal service | Owner, how to run locally | Environment variables, deploy process, on-call contact | Marketing description |

A team's internal repository needs different answers from an open-source one: who owns it, how to run it, and what breaks if it goes down matter more than badges.

## What should a README leave out?

Leave out anything that has a better home. The full API reference belongs in documentation, release history in `CHANGELOG.md`, the contribution process in `CONTRIBUTING.md`, and vulnerability reporting in `SECURITY.md`. Leave out secrets, internal hostnames and real credentials, including in examples. Leave out instructions you have not tested, since a wrong install command costs more trust than a missing one. Also leave out walls of badges, long tables of contributors' avatars and sections that only say "coming soon".

On GitHub there is a practical limit too: the README documentation says content beyond 500 KiB is truncated when the file is viewed on the site. Few READMEs come close, but generated tables and embedded data can.

## How long should each section be?

Short enough that the install command is visible without much scrolling. The opening (title, one-liner, description) should fit in the first screen. Installation and usage are best at a few lines each. If any section needs subheadings of its own, it is probably documentation and should move to a `docs/` folder or a wiki with a link from the README. Long READMEs are easier to use with a table of contents; GitHub already shows an outline menu built from your headings, and the [TOC generator](/markdown-toc-generator) adds one inside the file for other sites and for raw text readers.

## How do I write a README quickly?

Fill in the [README generator](/readme-generator): it has fields for the name, tagline, description, features, install command, a usage example with its language, the license and author, optional badges from an npm package name or GitHub repository, and an optional contributing section. It shows a live preview and lets you copy or download `README.md`. It produces a solid general-purpose skeleton, not a finished file: it has no fields for screenshots, configuration tables or dataset details, so add those by hand. The [README templates](/readme-templates) page has longer starting points for specific project types.

## Is there an official README standard?

No. There is no required format or section list; GitHub, GitLab and package registries display whatever the file contains. What exists are conventions: the file name `README.md`, markdown formatting, the section order above, and community files such as `LICENSE` and `CONTRIBUTING.md` that code hosts link to automatically. Some ecosystems add expectations of their own, for example registries that show the README as the package description, so the opening sentence doubles as the package summary.

## How do I know if my README is good enough?

Hand it to someone who has never seen the project and watch them. If they can say what it does after the first paragraph and reach a working result using only the README, it is good enough. Any question they have to ask you is a missing sentence. Repeat the test after big changes, and run the install and usage commands yourself before each release so they do not drift out of date.
