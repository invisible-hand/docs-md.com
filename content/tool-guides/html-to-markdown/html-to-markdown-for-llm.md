---
title: Why Convert HTML to Markdown Before Sending to an LLM?
h1: Why convert HTML to Markdown before sending it to an LLM?
description: Markdown keeps headings, lists, links and tables but drops tags, scripts and styling, so the same page costs far fewer tokens. A measured example.
tool: html-to-markdown
updated: 2026-10-17
related: /html-to-markdown/copy-web-page-as-markdown, /guides/markdown-table, /markdown-word-counter, /markdown-table-generator/markdown-table-vs-csv-for-llm
---
Because most of a web page's HTML is not content. Tags, attributes, scripts, styles and navigation all cost tokens, and the model has to read past them. Converting to Markdown keeps the structure that carries meaning (headings, lists, links, tables, code) and drops the rest, so the same text fits in far fewer tokens.

Tokens matter in three ways: they are what you pay for on most model APIs, they fill the context window, and a long input takes longer to process. The [llms.txt proposal](https://llmstxt.org/) puts the problem plainly: "An HTML page wraps its information in navigation, ads, and JavaScript, and converting it back into clean text is difficult and imprecise," and "every wasted token costs time and money." Its answer is for sites to publish markdown versions of their pages. When a site does not, you convert.

## How many tokens does the conversion save?

It depends on the page, so here is one measurement rather than a rule. On 2026-10-17 we downloaded MDN's reference page for the HTML `<table>` element and counted tokens with OpenAI's `tiktoken` library (version 0.14.0, `o200k_base` encoding):

| Version of the page | Tokens |
|---|---|
| Raw HTML as downloaded | 69,710 |
| Whole page converted with turndown 7.2.4 | 22,545 |
| Whole page converted with pandoc 3.12.1 (`-t gfm-raw_html`) | 16,868 |
| Main article extracted with Readability 0.6.0, then turndown | 13,839 |

Converting the whole page cut the count to about a third. Extracting the article first and then converting cut it to about a fifth. Other models use other tokenizers, so the exact numbers will differ, but the reason for the gap does not change: the HTML spent most of its tokens on markup the reader never sees. A page with little markup, such as a plain blog post, will show a smaller saving; a page heavy with navigation, inline SVG or embedded scripts, a larger one.

## What does the conversion keep?

The parts of HTML that carry meaning have a direct markdown form:

- `<h1>` to `<h6>` become `#` to `######`, so the model still sees the outline of the page.
- Lists stay lists, including nesting.
- Links become `[text](url)`, keeping both the anchor text and the destination.
- Tables become pipe tables, which keep rows and columns readable. The [markdown table guide](/guides/markdown-table) shows the format.
- `<pre><code>` becomes a fenced code block, so code is clearly separated from prose.
- Emphasis, block quotes and images (as `![alt](url)`) carry over.

These marks cost a character or two each, where the HTML equivalent is an opening tag, a closing tag, and usually a class attribute.

## What does the conversion lose?

Be honest about the trade, because some of it matters:

- **Layout and visual cues.** Sidebars, callout colors, column layouts and anything expressed only through CSS disappear. If a warning was marked only by a red box, the model no longer knows it was a warning.
- **Complex tables.** Merged cells (colspan, rowspan), multi-row headers and cells containing lists cannot be expressed as a pipe table. Converters either flatten them or leave HTML behind.
- **Code language labels.** turndown reads the language from a `language-…` class on the `<code>` element. MDN marks its code blocks differently (`class="brush: html"` on the `<pre>`), so in our test every fenced block came out without a language tag. A custom turndown rule can fix that for a given site.
- **Attributes.** IDs, `data-` attributes, ARIA labels and form fields are dropped. If the task needs them, markdown is the wrong input.
- **Content the extractor discards.** Readability decides what counts as the main article. It can drop comments, related links or a sidebar that actually held the answer.

## When should I send HTML instead?

When the structure of the HTML is the subject of the task. Asking a model to write CSS selectors, find accessibility problems, extract a value from a specific attribute, fill in a form, or explain why a page renders oddly all need the real markup. In those cases, trim the HTML instead of converting it: remove `<script>`, `<style>` and inline SVG, and send only the part of the DOM that matters. For tables with merged cells, sending that one table as HTML inside an otherwise markdown document is a reasonable middle ground.

## How do I convert a page for an LLM?

For a single page, copy it in your browser and paste into the [HTML to markdown converter](/html-to-markdown), with "Strip scripts, styles, nav" ticked; it runs locally, so the content is not uploaded. For many pages, use a script: the [guide to copying a web page as Markdown](/html-to-markdown/copy-web-page-as-markdown) has a tested Node.js script that combines Readability and turndown, and the equivalent pandoc command. Before converting, check whether the site already publishes a `.md` version of the page, as the llms.txt proposal suggests; a version written by the site will be cleaner than any conversion.

## Is Markdown better than plain text for an LLM?

Usually, because plain text throws away the structure too. Without `#` marks the model cannot tell a heading from a sentence; without pipes a table becomes a run of values with no columns; without fences code merges into prose. Markdown keeps those boundaries for a small cost in tokens. Plain text is reasonable when the content really is just prose, such as a novel chapter or a transcript, where markdown adds almost nothing.

## Does the conversion change what the model understands?

It can, in both directions. Removing navigation, cookie notices and repeated footers means the model is less likely to quote boilerplate or confuse a menu item with page content. Losing a table's merged cells, or a warning that was only expressed by color, can lead to a wrong answer that looks confident. Spot-check converted pages the first time you use a new source, especially pages with complex tables, and compare the output with what you see in the browser.

## How can I check the token count myself?

Use the tokenizer of the model you will send the text to, since counts differ between tokenizers. For OpenAI models, `tiktoken` counts locally; Anthropic's API has a token-counting endpoint for Claude models. Count the raw HTML and the markdown version of a few typical pages from your source, and you will know the saving for your own data rather than for our example. For a quick sense of length before any of that, the [markdown word counter](/markdown-word-counter) gives words and characters for pasted text.
