---
title: Markdown Comments — Hide Text From the Rendered Output
h1: How to write a comment in markdown
description: Markdown has no comment syntax, but HTML comments <!-- like this --> stay hidden in rendered output on GitHub, GitLab and Obsidian. Where they leak (Slack, Discord, Reddit, MDX), Obsidian %% and MDX {/* */} forms, and tool directives.
updated: 2026-10-15
related: markdown-collapsible-section, markdown-code-block, markdown-escape-characters, markdown-new-line, markdown-quote, markdown-alerts
---
Markdown has no comment syntax of its own, but markdown passes HTML through, so an **HTML comment** stays out of the rendered page:

```markdown
Visible text.
<!-- This is a comment. Readers of the rendered page do not see it. -->
More visible text.
```

Rendered, that is two lines of visible text with nothing between them. The comment survives in the source file, in the raw view on GitHub and in a git diff; it only disappears from the HTML. That distinction, plus the handful of platforms that print the comment instead of hiding it, is what the rest of this guide covers.

## Are HTML comments really hidden?

Hidden from the rendered view, yes: GitHub, GitLab, Obsidian's Reading view and virtually every renderer that allows raw HTML omit them from the output. GitHub's docs call this [hiding content with comments](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#hiding-content-with-comments). But they remain in the **source**: anyone who opens the raw file, clicks "Edit" on a wiki page, reads the HTML source of a page built by a generator that keeps comments, or looks at a diff sees them. GitLab's [markdown docs](https://docs.gitlab.com/ee/user/markdown.html) state it plainly: HTML comments are visible to anyone who can view the markdown source. Never put credentials, internal URLs or anything you would not publish inside one.

The two uses where they earn their place:

- **Notes to future editors**: `<!-- TODO: replace screenshot after the v2 release -->`.
- **Template instructions**: GitHub issue and pull request templates wrap their guidance in comments so the author sees it in the editor and the submitted issue does not show it.

## Is there a comment that doesn't reach the HTML at all?

Yes. A link reference definition that is never used produces no output in any renderer, because the definition itself is not content:

```markdown
[//]: # (This never appears in the rendered output or in the page's HTML source)
[comment]: <> (A second, equally common spelling)
```

The label (`//` or `comment`) and the destination (`#` or `<>`) are dummies; the "comment" is the link title in parentheses. It needs a blank line before it, cannot contain an unbalanced `)` (or `"` if you use double quotes instead of parentheses), and must be the only thing on its line. The trade-off is readability: everyone recognises `<!-- -->`, and few people recognise a dummy link definition, so use this form only when the comment must not reach the HTML, for example in a page whose source is served to the public by a static-site generator that keeps comments.

## Where do markdown comments work?

| Platform | `<!-- comment -->` | Native form | Source |
|---|---|---|---|
| GitHub | Hidden in READMEs, issues, PRs, wikis | None | [GitHub docs](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#hiding-content-with-comments) |
| GitLab | Hidden | None | [GitLab docs](https://docs.gitlab.com/ee/user/markdown.html) |
| Obsidian | Hidden in Reading view, shown in Editing view | `%%comment%%`, also hidden in Reading view; inline or multi-line | [Obsidian syntax](https://obsidian.md/help/syntax) |
| MDX (Docusaurus, Astro, Next.js) | **Build error**; HTML comments are not valid MDX | `{/* comment */}` | [MDX docs](https://mdxjs.com/docs/what-is-mdx/) |
| Pandoc | Passed through to HTML output; dropped from docx, PDF, LaTeX | None; a comment is also the documented way to separate two adjacent lists | [Pandoc manual](https://pandoc.org/MANUAL.html#raw-html) |
| Hugo, Jekyll, MkDocs | Hidden (raw HTML on); appears in the page's HTML source unless the generator minifies | None | Check the theme's minifier |
| Notion | Printed as text when typed; dropped on `.md` import | Block comments via the sidebar (not in the text) | [Notion import](https://www.notion.com/help/import-data-into-notion) |
| Jira Cloud | Printed as text | None | [Jira shortcuts](https://support.atlassian.com/jira-software-cloud/docs/markdown-and-keyboard-shortcuts/) |
| Reddit | Printed as text (HTML is escaped) | None | — |
| Discord, Slack | Printed as text | None | [Slack formatting](https://docs.slack.dev/messaging/formatting-message-text) |

The rule of thumb: comments are a feature of document markdown (READMEs, wikis, docs sites, note apps), not chat markdown. The [Obsidian markdown sheet](/obsidian-markdown) and [markdown flavors comparison](/markdown-flavors) show where each platform diverges.

## How do you write a comment in MDX, Obsidian and Pandoc?

The three platforms with their own rules:

```markdown
%% Obsidian: hidden in Reading view, visible while editing. %%

{/* MDX: a JSX comment. An HTML comment here fails the build. */}

<!-- Pandoc: reaches HTML output only; use it to split two lists. -->
```

Obsidian's `%%` form is specific to Obsidian; in any other renderer the percent signs and the text print. Its help page recommends an HTML comment when the note will be read elsewhere. MDX treats `<` as the start of JSX, so `<!--` is a syntax error; the fix in a Docusaurus or Astro migration is a search-and-replace to `{/* */}`. Pandoc keeps HTML comments only when writing HTML, and a comment between two lists is its documented way to stop them merging into one.

## Can you comment out a block of markdown temporarily?

Yes. An HTML comment can span many lines, which is useful for parking a draft section:

```markdown
<!--
### Old section
This whole block is hidden until it is needed again.
- including lists
- and `code`
-->
```

Two catches. The block must not itself contain `-->`, which would end the comment early and print the rest; a code sample with an HTML comment in it needs to be escaped or moved. And text that *looks* like a comment inside a code fence or an indented code block is code, printed verbatim, not a comment. For a section that readers should be able to open rather than one that is hidden entirely, a [collapsible `<details>` block](/guides/markdown-collapsible-section) is the better tool.

## What are comments used for by linters and generators?

Several tools read HTML comments as instructions, which is the one case where a comment changes the output:

| Comment | Tool | Effect |
|---|---|---|
| `<!-- markdownlint-disable MD013 -->` | markdownlint | Turns a rule off until `<!-- markdownlint-enable -->` |
| `<!-- prettier-ignore -->` | Prettier | Leaves the next block unformatted (useful above a hand-aligned table) |
| `<!-- toc -->` ... `<!-- tocstop -->` | markdown-toc, doctoc | Marks where a generated table of contents is written |
| `<!-- omit in toc -->` | Markdown All in One (VS Code) | Keeps a heading out of the generated TOC |
| `<!-- textlint-disable -->` | textlint | Suspends prose linting |

These are conventions of each tool, not markdown, and they are invisible to readers like any other comment. The [markdown lint tool](/markdown-lint) on this site reports markdownlint rules so you can see which one a disable comment is suppressing.

## Why is my comment showing up in the output?

1. **The platform escapes HTML.** Reddit, Slack, Discord, Jira and Notion print the tags. There is no markdown fallback; delete the comment before posting.
2. **It is inside a code block.** A comment in a fence is code and is shown. Move it outside the fence.
3. **A `-->` inside the comment.** The comment ended early. Remove or escape the inner `-->`.
4. **Indented by four spaces.** Outside a list, that made it an indented code block. Remove the indentation.
5. **MDX.** The build fails rather than printing; switch to `{/* */}`.

Paste the file into the [markdown viewer](/markdown-viewer), which applies GFM rules, to confirm the comment disappears before relying on it.

## Should you put secrets or private notes in a markdown comment?

No. A comment hides text from a *rendered* page and nothing else. In a public repository the raw file is one click away and every commit that ever contained the comment stays in the history; in a docs site the comment may be shipped inside the page's HTML. Treat a markdown comment as "not shown", never as "not published". For notes that must stay private, keep them outside the file, and for text that should be present but tucked away, use a [collapsible section](/guides/markdown-collapsible-section). For the rest of the syntax see the [markdown cheat sheet](/markdown-cheat-sheet).
