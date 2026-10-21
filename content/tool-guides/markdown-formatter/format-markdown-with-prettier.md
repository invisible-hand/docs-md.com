---
title: How to Format Markdown Files with Prettier (CLI + Config)
h1: How do I format markdown files with Prettier?
description: Run npx prettier --write "**/*.md" to format every markdown file. What Prettier changes, the proseWrap option, ignore comments and CI checks.
tool: markdown-formatter
updated: 2026-10-20
related: /markdown-formatter/format-markdown-in-vs-code, /markdown-formatter/markdown-formatter-vs-linter, /markdown-lint, /guides/markdown-table
---
Prettier formats markdown out of the box, with no plugin. Run `npx prettier --write "**/*.md"` from the project root to rewrite every markdown file in place, or `npx prettier --check "**/*.md"` to only report which files would change. Set `proseWrap` in a `.prettierrc` file if you want long paragraphs wrapped at a fixed width.

Prettier picks its parser from the file extension, so `.md` and `.markdown` files go through its markdown printer automatically ([Prettier docs, Configuration](https://prettier.io/docs/configuration)). Unlike a linter, it has few options: you get its style, and the point is that nobody on the team argues about it again.

## How do I run Prettier on markdown from the command line?

Install Prettier as a dev dependency so everyone uses the same version, then run it against your files. The Prettier docs recommend installing an exact version, because a minor release can change output.

```bash
npm install --save-dev --save-exact prettier

# format every markdown file in place
npx prettier --write "**/*.md"

# report files that are not formatted, change nothing
npx prettier --check "**/*.md"

# format a single file and print the result instead of saving
npx prettier README.md
```

Keep the quotes around the glob. Without them your shell expands `**/*.md` before Prettier sees it, and in shells where `**` is not recursive you silently format only the top-level files. With quotes, Prettier expands the pattern itself. Prettier's CLI docs warn that `--write` overwrites files, so commit or stash your work first ([Prettier CLI](https://prettier.io/docs/cli)).

`--check` exits with a non-zero status when any file needs formatting and prints a line such as "Code style issues found in the above file. Run Prettier with --write to fix." That makes it the command to put in CI. If you want just the file names, for piping to another command, use `--list-different` instead.

To skip folders such as `node_modules`, generated docs or vendored content, list them in a `.prettierignore` file at the project root. It uses the same pattern syntax as `.gitignore`.

## What does Prettier change in a markdown file?

It reprints the file from a parsed syntax tree, so the content stays the same and the source style becomes uniform. Running Prettier 3 on a deliberately messy test file, we saw these changes:

- `*` and `+` bullets became `-`. Two separate lists placed next to each other get `-` and `*` alternately, so they do not merge into one list.
- `__bold__` became `**bold**` and `*italic*` became `_italic_`.
- Table cells were padded so the pipes line up, including the delimiter row. Alignment colons such as `:-:` were kept.
- Code inside fenced blocks with a language Prettier knows, such as `js` or `json`, was formatted with Prettier's rules for that language. The `embeddedLanguageFormatting` option set to `"off"` disables this.
- Ordered lists numbered `1. 1. 1.` stayed that way; lists numbered `1. 2. 3.` stayed incrementing.

What it left alone matters as much. A setext heading (a title underlined with `=====`) stayed setext, and a long paragraph kept its original line breaks. That second point is controlled by `proseWrap`.

## What does the proseWrap option do?

`proseWrap` decides whether Prettier rewraps paragraphs. It has three values, and the default is `preserve` ([Prettier options, Prose Wrap](https://prettier.io/docs/options#prose-wrap)):

| Value | Effect |
|---|---|
| `preserve` | Keeps your line breaks exactly as written. This is the default. |
| `always` | Wraps prose at `printWidth`, which defaults to 80 characters. |
| `never` | Joins each paragraph onto a single line and leaves wrapping to the editor or viewer. |

The docs explain why the default is hands-off: some services, such as GitHub comments, render a line break inside a paragraph as a visible break, so rewrapping could change how the text looks there. In README files and documentation sites, a single newline inside a paragraph is normally ignored and `always` is safe.

There is a practical reason to choose `never` too. One line per paragraph means an edit to one sentence shows up as a one-line change in a diff, but the whole paragraph is that line, so reviewers see more. Some teams prefer `always` with a narrow width, others one sentence per line written by hand with `preserve`. Pick one and set it in config so it is not left to each editor.

## How do I configure Prettier only for markdown files?

Use `overrides` in a `.prettierrc` file. This keeps your code settings untouched and applies markdown settings only to markdown:

```json
{
  "overrides": [
    {
      "files": ["*.md"],
      "options": {
        "proseWrap": "always",
        "printWidth": 80
      }
    }
  ]
}
```

`printWidth` only affects prose when `proseWrap` is `always`; with the default `preserve` it has no visible effect on paragraphs. Tables are always printed aligned unless `proseWrap` is `never` and the aligned table would be wider than `printWidth`, in which case Prettier falls back to a compact table with single spaces around each cell.

## How do I stop Prettier from formatting part of a file?

Put `<!-- prettier-ignore -->` on the line before the block you want left alone, such as a hand-aligned table or a list whose odd numbering is intentional. For a longer range, usually something another tool generates, wrap it:

```markdown
<!-- prettier-ignore-start -->
<!-- generated by all-contributors, do not edit -->

| Name | Role |
|-|-|
| Ada | Maintainer |

<!-- prettier-ignore-end -->
```

Prettier's docs say there must be a blank line before both the start and the end comment for them to be recognised, and that the range form only works at the top level of the document ([Prettier, Ignoring Code](https://prettier.io/docs/ignore)).

## Is there a way to format markdown like this without Node?

Yes, for a quick one-off. The [Markdown Formatter](/markdown-formatter) on this site is a browser md formatter built on remark, the parser and printer used throughout the unified ecosystem. Paste the file, choose `-`, `*` or `+` for bullets, `*` or `_` for emphasis and backticks or tildes for code fences, and copy the result. It also aligns table pipes and converts setext headings to `#` headings, which Prettier does not.

Its output will not match Prettier byte for byte. The two printers make different default choices, and the browser tool does not format code inside fences or wrap prose. If your repository runs `prettier --check` in CI, run Prettier itself before committing so the check passes. For editor integration, see [How do I format markdown in VS Code?](/markdown-formatter/format-markdown-in-vs-code).

## Should I use Prettier with markdownlint?

Yes, they solve different problems, and they work together if you avoid rules that fight. Prettier decides layout. markdownlint reports things a printer cannot fix, such as a heading level that jumps from `##` to `####`, duplicate headings, bare URLs or images without alt text. You can check those in the browser with [Markdown Lint](/markdown-lint) before setting up `markdownlint-cli2`.

The one conflict to watch is line length. markdownlint's MD013 rule flags long lines, while Prettier with the default `proseWrap: preserve` will not shorten them. Either set `proseWrap: always` so Prettier wraps for you, or disable MD013 in your markdownlint config.
