# Tool guides

A tool guide is a question page nested under the tool that answers it:
`/<tool>/<question>`, e.g. `/readme-generator/what-is-a-readme-file`.

## How it fits together

| Piece | File |
|---|---|
| Content | `content/tool-guides/<tool>/<question>.md` |
| Registry + validator | `lib/tool-guides.ts` (`listToolGuides`, `getToolGuide`, `toolGuidesFor`, `validateToolGuide`) |
| Page template | `components/ToolGuidePage.tsx` (also exports `ToolGuideLinks`, the "Questions about …" list on tool pages) |
| Route | `lib/tool-guide-route.tsx` → `makeToolGuideRoute('<tool>')`, used by `app/<tool>/[question]/page.tsx` |
| Discovery | `app/sitemap.ts`, `app/llms.txt/route.ts` (nested under the tool's row), `scripts/indexnow-ping.mjs` |
| Check | `npm run check:tool-guides` (also the first step of `npm run build`) |

The share viewer owns the top-level dynamic segment (`app/[id]`), so there is no
catch-all: each tool with guides needs its own `app/<tool>/[question]/page.tsx`.
Routes exist for markdown-to-pdf, readme-generator, pdf-to-markdown,
markdown-to-word, markdown-table-generator, csv-to-markdown, html-to-markdown,
markdown-to-html, markdown-toc-generator and github-readme-viewer. To add another
tool, copy one of those five-line files, change the slug, and add
`<ToolGuideLinks tool="<slug>" />` to the tool page.

## Writer contract

Frontmatter (flat `key: value`, one per line, no quotes needed):

```markdown
---
title: What Is a README File? Purpose, Contents, Format
h1: What is a README file?
description: One or two sentences, at most 155 characters.
tool: readme-generator
updated: 2026-10-17
related: /github-readme-viewer, /guides/markdown-headings
---
```

| Rule | Enforced |
|---|---|
| `title` ≤ 60 characters (the layout appends "\| Docs MD") | yes |
| `h1` is the question and ends with `?` | yes |
| `description` present, ≤ 155 characters | yes |
| `tool` is a slug in `TOOLS` and matches the folder name | yes |
| `app/<tool>/[question]/page.tsx` exists | yes |
| `updated` is `YYYY-MM-DD` and not in the future | yes |
| `related` (optional): comma-separated site paths, each a syntax guide, a tool or another tool guide | yes |
| File name is lowercase kebab-case and unique across all tool guides | yes |
| `h1` differs from every syntax guide H1, every tool title and every other tool guide H1 | yes |
| No `# ` H1 in the body (the page renders the frontmatter `h1`) | yes |
| Body ≥ 900 words, excluding code blocks (aim for ~1,100) | yes |
| ≥ 4 FAQ entries: H2s ending in `?`, each followed by a paragraph that answers it on its own | yes |
| The body opens with a plain paragraph of ≤ 60 words that answers the H1 | yes |
| No link in the first sentence (the answer comes before any link) | yes |
| ≥ 2 internal links, one of them to `/<tool>`; every internal link resolves to a page | yes |
| Honest, specific, no hype; claims you can check; no invented numbers | review |
| Before writing, grep `content/guides` and the tool pages for the same question so the new page does not compete with an existing one | review |

The FAQ answers come from the first paragraph under each question H2 (the same
parser as `content/guides`), and become FAQPage JSON-LD, so write that paragraph
to stand alone. `updated` is shown on the page and used as `dateModified`.
