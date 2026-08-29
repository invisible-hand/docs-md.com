---
title: Markdown Code Blocks — Fenced Syntax Highlighting
h1: How to write a code block in markdown
description: Make code blocks with triple-backtick fences and a language tag for syntax highlighting. Inline code, escaping backticks, nesting fences, and diff highlighting.
updated: 2026-08-29
related: markdown-quote, markdown-comment
---
To write a code block in markdown, wrap the code in a *fence* — a line of three backticks before and after — and name the language after the opening fence for syntax highlighting:

````markdown
```python
def greet(name):
    return f"Hello, {name}"
```
````

```python
def greet(name):
    return f"Hello, {name}"
```

## How do you write inline code?

For a snippet inside a sentence, use single backticks: `` `npm install` `` renders as `npm install`. Inline code doesn't get highlighting — it's for identifiers, commands, and filenames in prose.

## Which language tags can you use?

Whatever the renderer's highlighter knows — the common ones are safe everywhere: `js`/`javascript`, `ts`, `python`, `bash`/`sh`, `json`, `yaml`, `html`, `css`, `sql`, `go`, `rust`, `c`, `cpp`, `java`. Two useful special ones:

- `text` — explicitly no highlighting.
- `diff` — lines starting with `+` render green and `-` render red, ideal for showing changes:

```diff
- const port = 3000;
+ const port = process.env.PORT ?? 3000;
```

## How do you show backticks inside code?

Use more backticks on the outside than anything inside. A fence containing triple backticks needs a four-backtick fence (that's how the first example on this page is written). For inline code containing a backtick, double the outer ones: ``` ``a `backtick` inside`` ```.

## Fenced vs indented code blocks — which should you use?

Indenting a block by 4 spaces also makes a code block (the original markdown way), but fences won: they need no re-indenting when pasting, support language tags, and can't be triggered accidentally... whereas 4-space indentation regularly creates [accidental code boxes](/guides/markdown-indent). Tildes work as fences too (`~~~`), which helps when the code itself contains backtick fences.

## Why is my code block not highlighting?

Usually one of: a typo'd or unsupported language tag, text on the same line *after* the opening fence where the renderer expects only the language, an unclosed fence swallowing the rest of the document, or a renderer (like Slack) that supports fences but not highlighting at all.
