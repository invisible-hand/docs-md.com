---
title: Markdown Formatter vs Linter: What's the Difference?
h1: What is the difference between a markdown formatter and a linter?
description: A formatter rewrites markdown into one style without asking. A linter reports rule violations and fixes only some. Most projects use both.
tool: markdown-formatter
updated: 2026-10-20
related: /markdown-lint, /markdown-formatter/format-markdown-with-prettier, /markdown-formatter/format-markdown-in-vs-code, /guides/markdown-headings
---
A formatter rewrites your markdown into one consistent style without asking: bullets, emphasis, table padding, blank lines. A linter reads the file, checks it against rules and reports problems, some of which a formatter could never fix, such as skipped heading levels or missing alt text. Use a formatter for layout and a linter for structure.

The two are often confused because their outputs overlap. Both care that a file uses one bullet marker, and both can fix trailing spaces. The difference is in how they work and what they are allowed to decide. A formatter parses the file into a syntax tree and prints a new file from that tree, so it controls every byte of the output. A linter looks at the file you wrote and points at lines; it changes text only when a rule has a safe, mechanical fix.

## What does a markdown formatter do?

It reprints the whole document in a fixed house style, so the rendered output stays the same and the source becomes predictable. Our [Markdown Formatter](/markdown-formatter) is built this way on remark: it parses the markdown, then prints it back with remark-stringify using the style you pick in three drop-downs, for list marker (`-`, `*` or `+`), emphasis (`*` or `_`) and code fence (backticks or tildes).

In a single pass it will:

- make every bullet use the chosen marker and indent nested lists consistently;
- use one character for both emphasis and strong emphasis;
- turn setext headings (underlined with `===` or `---`) into `#` headings;
- pad table cells so the pipes line up;
- collapse runs of blank lines so blocks are separated by exactly one.

Prettier works the same way with fewer choices and a few extra behaviours, such as formatting code inside fenced blocks. Neither of them will tell you that your document has two H1 headings, because two H1 headings are valid markdown and print back perfectly. A formatter has no opinion about content, only about how it is written.

## What does a markdown linter do?

It checks the document against a list of named rules and reports each violation with a line number. The best-known markdown linter is markdownlint, whose rules have IDs such as MD001 (heading levels should only increase by one), MD025 (a single top-level heading), MD034 (no bare URLs) and MD045 (images need alt text) ([markdownlint rules](https://github.com/DavidAnson/markdownlint#rules--aliases)). Our [Markdown Lint](/markdown-lint) tool implements 19 of these rules in the browser under the same IDs.

Some rules overlap with formatting: MD004 checks list marker style, MD049 and MD050 check emphasis and strong style, MD012 flags multiple blank lines. A formatter fixes all of these as a side effect. But many rules are about meaning or accessibility, and no printer can fix them, because the fix needs a human decision:

| Problem | Formatter | Linter |
|---|---|---|
| Mixed `*` and `-` bullets | Fixes it | Reports it (MD004), can often fix it |
| Table pipes out of line | Fixes it | Reports inconsistent column style (MD060) |
| Heading jumps from `##` to `####` | Leaves it | Reports it (MD001) |
| Two `#` headings in one file | Leaves it | Reports it (MD025) |
| Image without alt text | Leaves it | Reports it (MD045) |
| Bare URL in a sentence | Leaves it | Reports it (MD034) |
| Fenced code block without a language | Leaves it | Reports it (MD040) |

A linter can suggest that an image needs alt text. It cannot write the alt text for you.

## Do I need both a formatter and a linter?

On a project with more than a handful of markdown files, yes. The formatter removes every style argument in one command, and the linter catches the structural problems that are left. Running only a linter means people spend review time fixing bullet characters by hand. Running only an md formatter means a beautifully consistent file can still have broken heading hierarchy.

The usual setup is Prettier, or another formatter, run on save in the editor and checked in CI, plus markdownlint run in CI with formatting-related rules either aligned to the formatter's style or turned off. See [How do I format markdown files with Prettier?](/markdown-formatter/format-markdown-with-prettier) for the formatter half and [How do I format markdown in VS Code?](/markdown-formatter/format-markdown-in-vs-code) for the editor setup.

For a single document, such as a README you are about to publish or a block of text an AI assistant generated, you can do both steps in the browser: format it, then paste the result into the linter and fix what remains.

## Can a formatter and a linter conflict?

Yes, when they enforce different choices for the same thing. Prettier writes italic text with underscores, so a markdownlint config that requires asterisks for emphasis (MD049 set to `asterisk`) will flag every file Prettier touches. The same applies to bullet style and line length.

The fix is to decide which tool owns each style choice. Let the formatter own anything it can rewrite, and configure the linter to agree or disable those rules. markdownlint's default for MD004, MD049 and MD050 is `consistent`, meaning one style per file, which any formatter's output satisfies. Line length is the usual exception: MD013 flags lines over 80 characters by default, while Prettier keeps your existing line breaks unless you set `proseWrap: always`. Either turn on wrapping in Prettier or turn off MD013.

## Can a linter fix problems automatically?

Partly. markdownlint marks some rules as fixable, and its command-line tool `markdownlint-cli2` applies those fixes with `--fix`; the VS Code extension applies them with Format Document or its fix-all command. Fixable rules are the mechanical ones, such as trailing spaces, missing blank lines around headings or a missing space after `#`.

That is still different from formatting. A fix touches the lines that broke a rule and leaves everything else as you wrote it. A formatter rewrites the whole file, including lines that broke no rule. If you want a file that looks the same no matter who wrote it, you need the formatter. If you want to keep your own style and only remove mistakes, a linter with fixes may be enough.

## Which should I run first?

Run the formatter first, then the linter. Formatting removes every finding that is purely about style, so the linter's report shrinks to the problems that need a person: heading order, alt text, bare URLs, empty links. Running them the other way round means fixing style warnings by hand that the formatter would have fixed anyway.

In CI the order matters less, because both run as checks, not rewrites. Put the formatter check first so a contributor who forgot to format sees that message before a list of lint warnings that formatting would partly resolve. The [headings guide](/guides/markdown-headings) is a useful reference for the most common linter finding that formatting cannot fix.
