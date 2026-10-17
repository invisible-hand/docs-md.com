---
title: How to Copy a Web Page as Markdown (4 Methods)
h1: How do I copy a web page as Markdown?
description: Select the text, copy, and paste into an HTML-to-markdown converter. Or use a browser extension, a reader service, or a short Node script.
tool: html-to-markdown
updated: 2026-10-17
related: /guides/markdown-link, /guides/markdown-image, /html-to-markdown/html-to-markdown-for-llm, /html-to-markdown/google-docs-to-markdown
---
Select the part of the page you want, copy it, and paste it into an HTML-to-markdown converter. Browsers put copied page content on the clipboard as HTML, so the converter receives real headings, links, lists and tables and can turn them into markdown. For whole pages or many pages, use an extension or a script.

Browsers do not have a built-in "copy as markdown" command, so every method below adds one step. Which one fits depends on how often you do it and whether the page is public.

## Method 1: copy and paste into a converter

1. Select the content on the page. To get the main article without menus and sidebars, open the browser's reader view first (Firefox and Safari both have one) and select there.
2. Copy with Ctrl+C or Cmd+C.
3. Open the [HTML to markdown converter](/html-to-markdown) and paste into the source box.
4. Keep "Strip scripts, styles, nav" ticked to drop script and style tags, navigation, headers, footers and iframes before conversion.
5. Copy the markdown, or download it as a `.md` file.

The conversion runs in your browser with the turndown library, so the page content is not uploaded. This method also works for pages behind a login, because you are copying what your own browser already shows. If the page uses fake headings (big bold paragraphs rather than real heading tags), they arrive as plain paragraphs; add the `#` marks yourself, as the [headings guide](/guides/markdown-headings) shows.

## Method 2: a browser extension

Extensions save the select-copy-paste step and can grab the article automatically. [MarkDownload](https://github.com/deathau/markdownload) is an open-source example; its repository describes it as "A Firefox and Google Chrome extension to clip websites and download them into a readable markdown file." Check how recently an extension was updated before you install it, and what permissions it asks for: a clipping extension typically needs to read every page you visit, which is a lot of trust to hand out.

## Method 3: a reader service that returns markdown

Some hosted services fetch a URL and return markdown. Jina's Reader is one: put `https://r.jina.ai/` in front of the address.

```bash
curl -s "https://r.jina.ai/https://example.com"
```

In a test on 2026-10-17 this returned a short header (title, source URL) followed by a "Markdown Content:" section with the page text. Two limits apply to every service of this kind. The page is fetched by their server, so it only works for public pages, and you are sending every URL you convert to a third party. Do not use it for internal or private addresses.

## Method 4: a script with Readability and turndown

For repeatable conversion from the command line, combine Mozilla's Readability (the code behind Firefox's reader view) with turndown. Tested on 2026-10-17 with Node.js 22, `@mozilla/readability` 0.6.0, `turndown` 7.2.4, `turndown-plugin-gfm` 1.0.2 and `jsdom` 30.1.3:

```bash
npm install @mozilla/readability@0.6.0 turndown@7.2.4 turndown-plugin-gfm@1.0.2 jsdom@30.1.3
```

```js
// page-to-md.mjs — usage: node page-to-md.mjs https://example.com/article > article.md
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const url = process.argv[2];
const html = await (await fetch(url)).text();
const dom = new JSDOM(html, { url });
const article = new Readability(dom.window.document).parse();

const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
turndown.use(gfm);
console.log(`# ${article.title}\n\n${turndown.turndown(article.content)}`);
```

Passing the page `url` to JSDOM lets Readability turn relative links and image paths into absolute ones, so they still work outside the original site. The `gfm` plugin adds tables, strikethrough and task lists.

If you already have pandoc, it can fetch and convert a URL in one command, as the [pandoc manual](https://pandoc.org/MANUAL.html) documents under "Reading from the Web":

```bash
pandoc -f html -t gfm https://example.com -o page.md
```

pandoc converts the whole page, menus and footer included, so expect to delete more by hand than with the Readability script.

## Does the site already offer a markdown version?

Check before converting. The [llms.txt proposal](https://llmstxt.org/) suggests that sites publish a clean markdown copy of each page at the same URL with `.md` appended, and point to it with a `<link rel="alternate" type="text/markdown">` tag. Not every site follows it, but if the page source contains that link, fetch the `.md` file directly; it will be cleaner than anything you can convert.

## Why are some parts of the page missing?

Usually because the content is built by JavaScript after the page loads. The script and pandoc methods download the raw HTML and do not run the page's scripts, so anything the page renders later is not there. Copy and paste from the browser (Method 1) or an extension (Method 2) does not have this problem, because the browser has already run the scripts. Readability can also drop sections it judges to be clutter, such as comment threads or sidebars that held real content; if something important is missing, select it by hand instead.

## What happens to images and links?

Links become `[text](url)` and images become `![alt](url)`, pointing at the original site. The image files are not downloaded, so they disappear if the site removes them or blocks hotlinking. If you need a self-contained copy, download the images and change the paths; the [image guide](/guides/markdown-image) covers the syntax, and the [link guide](/guides/markdown-link) covers reference-style links if you want the URLs collected at the bottom.

## Why does a table come out broken?

A markdown table cell must fit on one line. When a web page puts lists, paragraphs or line breaks inside table cells, the converter cannot express that as a pipe table, and the row spills over several lines. In the script test above, a Wikipedia infobox with a bulleted list inside a cell produced exactly this. Fix it by hand, or keep that table as HTML, which most markdown renderers display.

## Which method should I use?

For one page now and then, copy and paste into a converter: it needs nothing installed, works on pages behind a login, and keeps the content on your machine. If you clip pages every day, an extension removes a step, at the cost of granting it access to the pages you visit. For batches of public pages, the Readability script gives you control and repeatable output, and pandoc is the quickest option if it is already installed. Use a hosted reader service only for public pages you are comfortable sharing with that service. Whatever you pick, skim the result once: headings, code blocks and tables are where conversions go wrong, and the [code block guide](/guides/markdown-code-block) shows how to add a missing language tag.

## Is it legal to copy a web page as markdown?

Converting a page for your own notes or research is the same as saving it. Republishing it is a separate question: changing the format does not change who owns the text. Keep a link to the source, and check the site's license or terms before you publish the converted content anywhere.

If you are converting pages to feed them into an AI model, the [guide on HTML to markdown for LLMs](/html-to-markdown/html-to-markdown-for-llm) explains what the conversion saves and what it loses.
