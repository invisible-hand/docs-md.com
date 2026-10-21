---
title: How to Format Markdown in VS Code (Prettier, markdownlint)
h1: How do I format markdown in VS Code?
description: VS Code has no built-in markdown formatter. Install Prettier or markdownlint, set it as the default formatter, then run Format Document.
tool: markdown-formatter
updated: 2026-10-20
related: /markdown-lint, /markdown-formatter/format-markdown-with-prettier, /markdown-toc-generator/vs-code-markdown-toc, /markdown-to-pdf/vs-code-markdown-to-pdf
---
VS Code does not ship a formatter for markdown, so Format Document does nothing until you install one. Add the Prettier extension (or markdownlint), make it the default formatter for markdown files, and run Format Document with Shift+Alt+F on Windows, Shift+Option+F on macOS or Ctrl+Shift+I on Linux. Format on save is one setting more.

VS Code has two built-in format actions, **Format Document** and **Format Selection**, but each language needs a formatter extension behind them ([VS Code docs, Formatting](https://code.visualstudio.com/docs/editing/codebasics#_formatting)). For markdown, VS Code's own extension gives you preview, outline, link completions and optional link validation, not formatting. If you run Format Document on a `.md` file with nothing installed, VS Code tells you there is no formatter for markdown files and offers to search the Marketplace.

## Which extension should I use to format markdown in VS Code?

Use Prettier if you want the whole file reprinted in one consistent style, and markdownlint if you want rule-based warnings that can also fix some problems. Prettier is the closest thing to a standard md formatter: it parses the file and prints it back with fixed choices for bullets, emphasis, tables and spacing. markdownlint is a linter first, but it registers itself as a formatter too.

The two extensions are:

- **Prettier - Code formatter**, identifier `esbenp.prettier-vscode`. It uses the Prettier version installed in your project's `node_modules` if there is one, and otherwise the copy bundled with the extension ([prettier-vscode README](https://github.com/prettier/prettier-vscode#readme)).
- **markdownlint**, identifier `DavidAnson.vscode-markdownlint`. It underlines rule violations as you type and, per its README, "registers itself as a source code formatter for Markdown files", so Format Document applies its automatic fixes ([vscode-markdownlint README](https://github.com/DavidAnson/vscode-markdownlint#readme)).

Many people install both: Prettier for layout, markdownlint for things a printer cannot decide for you, such as a skipped heading level or an image without alt text. The difference is explained in more detail in [What is the difference between a markdown formatter and a linter?](/markdown-formatter/markdown-formatter-vs-linter).

## How do I set Prettier as the default formatter for markdown?

Install the extension, then add a language-specific entry to your `settings.json`. Open the Command Palette (Ctrl+Shift+P, or Cmd+Shift+P on macOS), run **Preferences: Open User Settings (JSON)**, and add:

```json
{
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

The Prettier extension's README notes that VS Code does not support combined language syntax for this setting, so markdown needs its own block even if you already set Prettier for JavaScript. To set it for one project only, put the same block in `.vscode/settings.json` in the repository instead of your user settings, and commit it so everyone on the project gets the same formatter.

If you have both Prettier and markdownlint installed and have not chosen a default, VS Code asks which one to use the first time you format. You can also run **Format Document With...** from the Command Palette to pick a formatter for a single run without changing the default.

## How do I format markdown on save in VS Code?

Turn on `editor.formatOnSave`, either globally or only for markdown. The markdown-only version keeps the behaviour from surprising you in other languages:

```json
{
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```

With this in place, every save reprints the file. If you also want markdownlint to apply its fixes on save, its README shows the setting `editor.codeActionsOnSave` with `"source.fixAll.markdownlint": "explicit"`, which runs the fixes when you save explicitly rather than on auto-save. The extension also adds a **markdownlint: Fix all supported markdownlint violations in the document** command (`markdownlint.fixAll`) if you prefer to run fixes by hand.

Format on save is convenient but has one cost in shared repositories: the first save of an old file can produce a large diff that has nothing to do with your change. Format the whole repository once in a separate commit, then turn on format on save, so later diffs only show real edits.

## What will Prettier change in my markdown file?

Prettier rewrites style, not content. On the files we tested with Prettier 3 it changed `*` and `+` bullets to `-`, `__bold__` to `**bold**`, `*italic*` to `_italic_`, padded table cells so the pipes line up, and reformatted code inside fenced blocks whose language it knows, such as JavaScript or JSON. It left long lines of prose alone.

That last point surprises people. Prettier's `proseWrap` option defaults to `preserve`, which keeps your existing line breaks as they are, because some renderers treat a line break inside a paragraph as a visible break ([Prettier options, Prose Wrap](https://prettier.io/docs/options#prose-wrap)). If you want hard-wrapped paragraphs at 80 characters, set `"proseWrap": "always"` in a `.prettierrc` file. The full set of options and the command line are covered in [How do I format markdown files with Prettier?](/markdown-formatter/format-markdown-with-prettier).

To keep Prettier away from part of a file, put `<!-- prettier-ignore -->` on the line before a block, or wrap a range in `<!-- prettier-ignore-start -->` and `<!-- prettier-ignore-end -->`. Prettier's docs say the range form needs a blank line before each comment to be recognised.

## Can I format markdown without installing anything?

Yes. Paste the text into the [Markdown Formatter](/markdown-formatter), pick a list marker, emphasis character and code fence style, and copy or download the result. It parses the document with remark and prints it back, so the rendered output stays the same while the source becomes consistent. It runs in the browser, which makes it a quick md formatter for a single file on a machine where you cannot install extensions.

It is not a substitute for an editor setup on a project you work on every day. A browser tool does not know your repository's config, and you have to paste the result back by hand. For a team, the durable answer is Prettier in `.vscode/settings.json` plus the same Prettier version in `package.json`, so the editor and your CI agree.

## Why does Format Document not change my markdown?

Usually because no formatter is set for markdown, or a different one is winning. Check these in order:

1. **No default formatter.** Run **Format Document With...** and see what is listed. If only "None" or nothing useful appears, install an extension as described above.
2. **Wrong default.** The status bar shows the language mode; make sure the file is recognised as Markdown, not plain text. A `.markdown` or `.mdx` file may be mapped differently from `.md`.
3. **Ignored file.** Prettier skips files listed in `.prettierignore`. The Prettier output channel (View, Output, then choose Prettier) shows when a file was ignored.
4. **Nothing to change.** If the file already matches the formatter's style, the format runs and produces no edits. Try it on a file with mixed `*` and `-` bullets to confirm it works.

When you also want to check the result for structural problems, such as duplicate headings or bare URLs, run the file through the [Markdown Lint](/markdown-lint) tool or keep the markdownlint extension enabled alongside Prettier.
