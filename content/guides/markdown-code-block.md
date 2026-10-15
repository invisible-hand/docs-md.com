---
title: Markdown Code Blocks — Fences, Highlighting, Inline Code
h1: How to write a code block in markdown
description: Make a code block with three backticks and a language tag for syntax highlighting. Inline code, backticks inside code, code in lists, diff and mermaid fences, and where fences render (GitHub, Slack, Discord, Notion, Obsidian).
updated: 2026-10-15
related: markdown-indent, markdown-escape-characters, markdown-table, markdown-nested-list, markdown-quote, markdown-alerts
---
To write a code block in markdown, put the code between two lines of three backticks (a *fence*) and name the language after the opening fence to get syntax highlighting:

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

Inside the fence nothing is interpreted: no bold, no links, no HTML, and whitespace is preserved exactly. The language tag is optional and the fence works without it. Everything else on this page is about the edges: inline code in a sentence, backticks inside code, fences inside lists, the special fences GitHub and GitLab turn into diagrams, and the apps that render fences without highlighting or not at all.

## How do you write inline code?

For a snippet inside a sentence, wrap it in single backticks: `` `npm install` `` renders as `npm install`. Inline code is for identifiers, commands, file names, keys and values in prose; it gets a monospace font and a light background but no syntax highlighting. A backtick inside inline code needs a double-backtick wrapper with a space inside: ``` `` a `tick` inside `` ``` renders as `` a `tick` inside ``. The [escaping guide](/guides/markdown-escape-characters) covers the other characters that need help in prose.

## Which language tags can you use?

Whatever the renderer's highlighter recognises. GitHub uses the [Linguist language list](https://github.com/github-linguist/linguist/blob/main/lib/linguist/languages.yml) and documents it in [creating and highlighting code blocks](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-and-highlighting-code-blocks); GitLab uses [Rouge](https://github.com/rouge-ruby/rouge/wiki/List-of-supported-languages-and-lexers); most web renderers use highlight.js or Prism. The common tags are safe in all of them:

| Tag | Also accepted | Notes |
|---|---|---|
| `js` | `javascript`, `jsx`, `ts`, `typescript`, `tsx` | |
| `python` | `py` | |
| `bash` | `sh`, `shell`, `zsh`, `console` | `console` highlights the `$` prompt in some highlighters |
| `json`, `yaml`, `toml`, `xml`, `html`, `css` | `yml` | |
| `sql`, `go`, `rust`, `c`, `cpp`, `java`, `csharp`, `ruby`, `php`, `swift`, `kotlin` | `rs`, `cs`, `rb` | |
| `markdown` | `md` | Use it for markdown examples, as on this page |
| `text` | `plaintext`, `txt`, nothing | Explicitly no highlighting |
| `diff` | | Lines starting with `+` and `-` are coloured green and red |

The `diff` tag is the most useful one people do not know about:

```diff
- const port = 3000;
+ const port = process.env.PORT ?? 3000;
```

Tags are case-insensitive on GitHub, but GitHub Pages (Jekyll) wants them lower case. An unknown tag never breaks the block; it just renders without colour.

## How do you show backticks inside a code block?

Use a longer fence than anything inside. A block that contains a three-backtick fence needs a four-backtick fence around it, which is how the first example on this page is written, and GitHub's docs give the same advice. Tildes work as fences too (`~~~`), so a tilde fence can wrap a backtick fence and vice versa:

`````markdown
````markdown
```js
console.log("nested")
```
````
`````

The opening and closing fences must match in character and the closing fence must be at least as long as the opening one. A closing fence indented by up to three spaces still closes the block, which matters when a fence sits inside a list.

## Should you use fenced or indented code blocks?

Fenced. Indenting a block by four spaces also makes a code block (the original markdown form), but fences take a language tag, need no re-indentation when you paste, cannot be created by accident, and work inside lists without the double-indent dance. Indented blocks are the cause of the most common markdown bug, prose that [turns into a code box](/guides/markdown-indent) because it was pasted with leading spaces, and MDX does not support them at all. The one place the indented form is still useful is a renderer that has no fences, which today is old Reddit.

## How do you put a code block inside a list item?

Indent the fence and the code to the list item's content column (2 spaces under `- `, 3 under `1. `), with a blank line before the fence:

````markdown
1. Install the dependencies:

   ```bash
   npm install
   ```

2. Start the server.
````

The code keeps its own indentation relative to the fence. If the fence sits at column 0 the list ends, and the next number restarts at 1. GitHub's docs note that a non-fenced block inside a list needs eight spaces of indentation, which is one more reason to fence. The [nested list guide](/guides/markdown-nested-list) covers the column rules for everything else that lives inside a list item.

## Where do code blocks render?

| App | Fences | Highlighting | Indented blocks | Inline code | Source |
|---|---|---|---|---|---|
| GitHub | Yes; also `~~~` | Yes, Linguist | Yes | Yes | [GitHub code blocks](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-and-highlighting-code-blocks) |
| GitLab | Yes; also `~~~` | Yes, Rouge | Yes | Yes | [GitLab code spans and blocks](https://docs.gitlab.com/ee/user/markdown.html#code-spans-and-blocks) |
| Obsidian | Yes; also `~~~` | Yes | Yes | Yes | [Obsidian syntax](https://obsidian.md/help/syntax) |
| Notion | `/code` block (or Cmd/Ctrl+Option/Shift+8) with a language picker; pasted fences convert on `.md` import | Yes | No | Yes | [Notion shortcuts](https://www.notion.com/help/keyboard-shortcuts) |
| Discord | Yes, with a language tag | Yes, for common languages | No | Yes | [Discord Markdown Text 101](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline) |
| Slack | Yes; no language tag | No | No | Yes | [Slack formatting](https://docs.slack.dev/messaging/formatting-message-text) |
| Reddit | New Reddit markdown mode and rich editor | No | Yes (old Reddit needs this) | Yes | [Reddit markdown sheet](/reddit-markdown) |
| Jira Cloud | Typing ```` ``` ```` converts to a code block; `{code:java}` in legacy wiki markup | Yes | No | Yes | [Jira shortcuts](https://support.atlassian.com/jira-software-cloud/docs/markdown-and-keyboard-shortcuts/) |
| MDX | Yes | Via the site's plugin (Prism, Shiki) | **No** | Yes | [MDX docs](https://mdxjs.com/docs/what-is-mdx/) |
| Pandoc | Yes, plus attributes like `{.python .numberLines}` | In HTML, LaTeX and docx output | Yes | Yes | [Pandoc fenced code](https://pandoc.org/MANUAL.html#fenced-code-blocks) |

A code block is the usual fallback for a [table](/guides/markdown-table) in Slack and Discord, where tables do not render but monospace columns line up. The [Slack](/slack-markdown) and [Discord](/discord-markdown) sheets cover each app's remaining syntax.

## Which special fences do GitHub and GitLab render?

Some language tags turn the block into something other than code:

| Tag | GitHub | GitLab | What it renders |
|---|---|---|---|
| `mermaid` | Yes | Yes | Flowcharts, sequence diagrams, Gantt charts from text |
| `math` | Yes | Yes | LaTeX math, see the [math guide](/guides/markdown-math) |
| `geojson`, `topojson` | Yes | No | An interactive map |
| `stl` | Yes | No | A 3D model viewer (ASCII STL) |
| `plantuml` | No | Yes (with a PlantUML server configured) | UML diagrams |
| `suggestion` | In PR review comments | In MR comments | A one-click applicable code change |

Everywhere else these are plain code blocks with an unknown language, which is harmless: the text shows, uncoloured.

## Can you add line numbers, a title or highlighted lines?

Not in GFM. GitHub and GitLab show no line numbers in rendered markdown and have no title syntax; the file name goes in the sentence before the block or in a comment on the first line of the code. Docs generators add their own extensions, all of which print literally on GitHub:

| Tool | Line numbers | Title | Highlight lines |
|---|---|---|---|
| Docusaurus | `showLineNumbers` after the tag | `title="file.js"` | `{2,4-6}` after the tag, or `// highlight-next-line` |
| MkDocs Material | `linenums="1"` | `title="file.js"` | `hl_lines="2 3"` |
| Pandoc | `{.python .numberLines startFrom="10"}` | No | No |
| Hugo | `{linenos=true}` | No | `{hl_lines=[2,3]}` |

If a README will also be built by one of these tools, keep the GitHub form in the README and the extended form in the docs source.

## Why is my code block not highlighting or not closing?

1. **Unsupported or misspelled tag.** `javascrip` or `c#` (use `csharp`) gives no colour; the block still renders.
2. **Text after the language.** Most renderers want only the tag on the opening fence line; `js (example)` disables highlighting on some.
3. **Unclosed fence.** Everything to the end of the document becomes code. Count your fences; the closing one must be as long as the opening one.
4. **Fence inside a list at the wrong column.** It either ended the list or became part of the previous paragraph. Indent it to the item's content column.
5. **The app has no highlighting.** Slack renders the block but ignores the tag; Reddit likewise.
6. **Backticks that are not backticks.** Text pasted from a word processor often has curly quotes or acute accents (´) in place of `` ` ``.

Run the file through the [markdown viewer](/markdown-viewer) to see the fence structure as GitHub parses it, or the [markdown formatter](/markdown-formatter), which normalises fence lengths. For the rest of the syntax see the [markdown cheat sheet](/markdown-cheat-sheet).
