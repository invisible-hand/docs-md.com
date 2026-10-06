---
title: Markdown Link Syntax: Hyperlinks, Anchors, References
h1: Markdown links: how to add a hyperlink in markdown
description: Markdown link syntax: [text](url) makes a hyperlink. Reference-style links, autolinks, relative links, links to headings, image links, titles, escaping, fixes.
updated: 2026-10-05
related: markdown-image, markdown-code-block, markdown-quote
---
To make a link in markdown, put the link text in square brackets and the URL in parentheses straight after it — `[text](url)`. That is the whole hyperlink syntax:

```markdown
Read the [markdown cheat sheet](/markdown-cheat-sheet).
```

Read the [markdown cheat sheet](/markdown-cheat-sheet).

No space between `]` and `(` — that gap is the most common reason a markdown link doesn't render. Everything else on this page is a variation on the same pattern: reference-style links that keep long URLs out of your prose, autolinks for bare URLs and email addresses, relative links between files in a repo, links to a heading on the same page, images that are links, hover titles, and the escaping rules for URLs with spaces or parentheses.

## What is the markdown link syntax?

A markdown link (also called a hyperlink or md link) has two parts: the visible text in `[ ]` and the destination URL in `( )`. The renderer turns it into an HTML `<a href="…">` element. This table is the complete syntax, from CommonMark plus the GitHub Flavored Markdown (GFM) extensions:

| You want | Markdown | Works in |
|---|---|---|
| Inline link | `[text](https://example.com)` | Everywhere |
| Link with hover title | `[text](https://example.com "Title")` | Everywhere |
| Reference-style link | `[text][label]` + `[label]: https://example.com` | Everywhere |
| Collapsed / shortcut reference | `[label][]` or `[label]` | Everywhere |
| Autolink (URL in angle brackets) | `<https://example.com>` | Everywhere |
| Email link | `<name@example.com>` or `[mail me](mailto:name@example.com)` | Everywhere |
| Bare URL, no brackets | `https://example.com` or `www.example.com` | GFM (GitHub, GitLab, most editors) |
| Link to a heading on the page | `[text](#heading-anchor)` | GitHub, GitLab, most renderers |
| Relative link to another file | `[text](docs/setup.md)` | GitHub, GitLab, static site generators |
| Image that is a link | `[![alt](image.png)](https://example.com)` | Everywhere |
| URL with spaces | `[text](<my file.md>)` or `my%20file.md` | Everywhere |
| Literal brackets, no link | `\[text\](url)` | Everywhere |

The output of an inline link is plain HTML — `[docs](https://example.com "Docs")` becomes `<a href="https://example.com" title="Docs">docs</a>`.

## How do you add a hyperlink in markdown?

Write the text you want readers to click inside square brackets, then the full URL inside parentheses directly after it, with no space in between. The link text can contain emphasis or inline code; the URL must not contain unescaped spaces:

```markdown
Install with [**npm**](https://www.npmjs.com/), then see the [`code block` guide](/guides/markdown-code-block).
```

Install with [**npm**](https://www.npmjs.com/), then see the [`code block` guide](/guides/markdown-code-block).

A few rules from the CommonMark spec that explain most surprises:

- **The URL can't contain a plain space.** Encode it as `%20`, or wrap the whole destination in angle brackets: `[notes](<meeting notes.md>)`.
- **Parentheses in the URL must be balanced.** `[Markdown](https://en.wikipedia.org/wiki/Markdown_(disambiguation))` works because the `(` and `)` pair up; a lone `)` must be escaped as `\)` or encoded as `%29`.
- **Links can't contain other links.** In `[a [b](x) c](y)` only `b` becomes a link; the outer brackets and `(y)` print as text.
- **Line breaks are allowed in the link text**, so a long label can wrap in the source.

## How do you add a title (tooltip) to a markdown link?

Add a quoted title after the URL, separated by a space. It becomes the HTML `title` attribute, which browsers show as a tooltip on hover:

```markdown
[Docs MD](/ "Share markdown as a link")
```

[Docs MD](/ "Share markdown as a link")

CommonMark accepts the title in double quotes, single quotes, or parentheses — `"Title"`, `'Title'`, `(Title)`. Keep titles short and don't put essential information in them: touch screens and screen readers often never show the tooltip.

## What are reference-style links in markdown?

Reference-style links split a link into a label in your text and a definition elsewhere in the document, so long URLs don't interrupt the prose. The definition is a line of its own — label in brackets, a colon, the URL, and an optional title — and it never appears in the rendered output:

```markdown
See the [CommonMark spec][cm] and the [GFM extensions][gfm].

[cm]: https://spec.commonmark.org "CommonMark"
[gfm]: https://github.github.com/gfm/
```

There are three forms, all defined by the CommonMark spec:

| Form | Markdown | Link text shown |
|---|---|---|
| Full | `[the spec][cm]` | the spec |
| Collapsed | `[cm][]` | cm |
| Shortcut | `[cm]` | cm |

Labels are **case-insensitive** (`[CM]` matches `[cm]:`), definitions may come before or after the links that use them, and one definition can serve any number of links — which is why long READMEs and changelogs put all their URLs in a block at the bottom. If a label has no matching definition, the text renders literally with its brackets, so a typo shows up as `[the spec][cn]` on the page rather than failing silently.

## How do you make a bare URL clickable in markdown?

Wrap it in angle brackets: `<https://example.com>`. That form is called an *autolink* and works in every CommonMark renderer; the visible text is the URL itself. Email addresses work the same way — `<name@example.com>` becomes a `mailto:` link.

Pasting a URL with no brackets at all depends on the renderer. GitHub Flavored Markdown has an *autolink extension* that links bare `https://…`, `http://…` and `www.…` addresses and plain email addresses, and it drops trailing punctuation such as a full stop at the end of a sentence. Strict CommonMark renderers leave the bare URL as plain text. So:

```markdown
Docs: <https://docs-md.com>         ← portable, always a link
Docs: https://docs-md.com           ← link on GitHub, plain text in strict CommonMark
```

If you want a visible URL that is *not* clickable on GitHub, put it in inline code: `` `https://example.com` ``.

## How do you link to an email address or phone number?

Use an autolink for an address — `<name@example.com>` — or a normal link with a `mailto:` URL when you want different text:

```markdown
Questions? [Email the team](mailto:team@example.com?subject=Docs%20question).
```

Anything after `?` follows the mailto URL format, so the subject (and body) must be URL-encoded — spaces become `%20`. Phone links use the same idea with `tel:` (`[Call us](tel:+15555550100)`), but sanitizing renderers may strip schemes other than `http`, `https` and `mailto`, so test it where you publish.

## How do you link to a heading or section on the same page?

Link to the heading's anchor with `#`: `[text](#anchor)`. GitHub, GitLab and most documentation tools give every heading an id automatically, generated from its text. GitHub documents the rules: letters are lower-cased, spaces become hyphens, other punctuation is removed, markup like `_italics_` is reduced to its text, and if two headings would produce the same anchor the later one gets `-1`, `-2` and so on.

```markdown
### Install the CLI
### FAQ & troubleshooting

[Jump to the install steps](#install-the-cli)
[Read the FAQ](#faq--troubleshooting)
```

Note the double hyphen in the second anchor: the `&` is removed but the spaces on either side each become a hyphen. Try it here — [this link jumps to the common mistakes section](#why-is-my-markdown-link-not-working) of this page.

That is how README tables of contents are built; the [TOC generator](/markdown-toc-generator) writes the whole list of anchor links for you from a document's headings. If an anchor doesn't work, open the rendered page, click the link icon next to the heading, and copy the `#…` part of the address — that's the real anchor.

## How do you link to a heading in another markdown file?

Add the anchor after the file path: `[text](docs/setup.md#install-the-cli)`. The path part follows the relative-link rules below and the `#` part follows the heading rules above. For a full URL, the same thing works on GitHub's file view: `https://github.com/owner/repo/blob/main/docs/setup.md#install-the-cli`.

GitHub file URLs also accept line anchors for code — `#L10` for one line, `#L10-L20` for a range — which is handy for linking from an issue or a README to the exact lines you're describing.

## How do you create a custom anchor for a link?

Insert an empty HTML anchor where you want to land and link to its name. GitHub documents this form, and it works in any renderer that allows inline HTML:

```markdown
<a name="pricing-notes"></a>
The prices below are for annual plans.

[See the pricing notes](#pricing-notes)
```

Some renderers also accept an explicit id on the heading itself — `## Pricing {#pricing}` in Pandoc, kramdown (Jekyll), PHP Markdown Extra, and MkDocs with the `attr_list` extension. GitHub does not support that syntax and will print `{#pricing}` as text, so use the `<a name>` form in READMEs.

## How do relative links work in markdown?

A relative link points to another file by its path instead of a full URL: `[contributing guide](CONTRIBUTING.md)` or `[setup](docs/setup.md)`. On GitHub the path is resolved relative to the file the link is in, and a path that starts with `/` is resolved from the repository root:

| Link in `docs/guide.md` | Resolves to |
|---|---|
| `[a](setup.md)` | `docs/setup.md` |
| `[b](../README.md)` | `README.md` |
| `[c](/src/index.ts)` | `src/index.ts` (repo root) |
| `[d](images/flow.png)` | `docs/images/flow.png` |

GitHub recommends relative links over absolute `github.com/…/blob/main/…` URLs because they keep working on other branches, in forks, and in clones. They only work where the linked file exists, though: a README rendered on npm, PyPI or a docs-sharing site has no repository behind it, so relative links there are dead. If a file will be read outside the repo, use absolute URLs for the links that matter.

## How do you make an image a link in markdown?

Put the image syntax inside the link text: `[![alt text](image-url)](link-url)`. The outer `[ … ](link-url)` is an ordinary link and the inner `![ … ]( … )` is the image it wraps:

```markdown
[![Build status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/owner/repo/actions)
```

That nesting is how README badge rows work — each badge is an image wrapped in a link. The [image guide](/guides/markdown-image) covers alt text, sizing and paths, and the [badge generator](/markdown-badge-generator) writes linked badges for you.

## How do you make a markdown link open in a new tab?

Markdown has no syntax for it — opening in a new tab is an HTML attribute (`target="_blank"`), not part of the markdown spec. Where raw HTML is allowed, write the link as HTML:

```markdown
<a href="https://example.com" target="_blank" rel="noopener">example</a>
```

GitHub strips the `target` attribute from READMEs and comments, so links there always open in the same tab. Some generators have their own syntax — kramdown (Jekyll) accepts `[text](url){:target="_blank"}` — and many documentation sites open external links in a new tab through a config option or plugin rather than per link.

## How do you write square brackets or a URL without making a link?

Escape the brackets with a backslash: `\[not a link\](example.com)` prints the characters as typed. Inside inline code or a code block nothing is a link, so `` `[text](url)` `` shows the syntax itself — which is how this page displays its examples.

Other characters that need care:

- **Brackets inside link text** are fine when balanced — `[array[0] docs](url)` — but a lone `[` or `]` must be escaped.
- **Underscores and asterisks in URLs** are safe inside `( )`; in a bare GFM autolink they can occasionally be read as emphasis, so wrap such URLs in `< >`.
- **A `|` inside a link in a table cell** splits the cell; escape it as `\|`.

## Can markdown links contain bold, code or emoji?

Yes. Link text is ordinary inline markdown, so `[**bold link**](url)`, `` [`code` link](url) ``, and emoji all work. The reverse also works — you can make part of a bold sentence a link: `**Read the [docs](url) first.**` The one thing that doesn't work is a link inside another link.

## How do markdown links work in Discord, Slack, Reddit and Obsidian?

Most apps that take markdown accept the standard `[text](url)` form, but chat apps are the exception. How each one handles the inline syntax:

| App | `[text](url)` | Notes |
|---|---|---|
| GitHub, GitLab | ✅ | Plus bare-URL autolinks, relative links, heading anchors |
| Reddit | ✅ | Bare URLs are linked automatically too |
| Discord | ✅ masked link | Wrap the URL in `< >` to suppress the embed preview — see [Discord formatting](/discord-markdown) |
| Slack | ❌ stays literal | Paste the URL or use the link button; the API uses `<url\|text>` — see [Slack formatting](/slack-markdown) |
| Obsidian | ✅ | Internal notes use wiki-links: `[[Note]]`, `[[Note#Heading]]`, `[[Note\|shown text]]` |
| Jira (wiki markup) | ❌ | Uses `[text\|url]` |

GitHub wikis also accept the wiki-link form `[[Link text|Page name]]`. Wiki-links are not part of CommonMark or GFM, so they don't work in regular README files.

## Why is my markdown link not working?

Almost every broken markdown link is one of these mistakes. Check them in order:

1. **A space between `]` and `(`.** `[text] (url)` renders literally. Remove the space.
2. **A space inside the URL.** `[notes](my notes.md)` breaks. Use `my%20notes.md` or `<my notes.md>`.
3. **Unbalanced parentheses in the URL.** A Wikipedia-style `_(disambiguation)` URL is fine; a lone `)` cuts the URL short. Escape it as `\)` or `%29`.
4. **Missing scheme.** `[site](example.com)` is treated as a relative path, so the browser looks for a file called `example.com` next to the current page. Write `https://example.com`.
5. **Reference label with no definition.** `[text][label]` shows the brackets when `[label]:` is missing or misspelled.
6. **Anchor doesn't match the heading.** Copy the real anchor from the rendered heading's link icon; punctuation and duplicate headings are the usual cause.
7. **Relative link outside its repository.** On npm, PyPI, or a shared copy of a README, relative paths have nothing to resolve to. Use absolute URLs there.
8. **The app doesn't support markdown links.** Slack and many plain-text fields show `[text](url)` literally.

To find the dead ones in a long document — 404s, redirects, and anchors that point at no heading — paste it into the [markdown link checker](/markdown-link-checker). To see how a document renders before you publish it, use the [markdown viewer](/markdown-viewer).

## What is the difference between a link and an image in markdown?

One character: an image is a link with `!` in front — `![alt text](image.png)` displays the file, `[text](page.html)` links to it. The bracket part means *link text* for a link and *alt text* for an image. Both accept reference-style definitions and titles. Details are in the [image guide](/guides/markdown-image).

## What are the best practices for markdown links?

Use descriptive link text (`the [installation guide](…)`, not `click [here](…)`) — screen readers often list links out of context, and search engines use the text to understand the target. Prefer relative links inside a repository and absolute links in anything that will be copied elsewhere, keep long or repeated URLs in reference definitions, and wrap bare URLs in `< >` so they link in every renderer. Before publishing, run the document through a link checker.

The [link generator](/markdown-link-generator) builds inline, titled, and reference-style links from a form if you'd rather not type the brackets, and the [markdown cheat sheet](/markdown-cheat-sheet) covers every other element — headings, lists, tables, code, and footnotes.
