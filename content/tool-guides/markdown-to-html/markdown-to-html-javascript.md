---
title: Markdown to HTML in JavaScript: marked, markdown-it, remark
h1: How do I convert Markdown to HTML in JavaScript?
description: Install a parser such as marked or markdown-it and call it on your string. Tested code for Node and the browser, how the libraries differ, and sanitizing.
tool: markdown-to-html
updated: 2026-10-17
related: /markdown-to-html/is-markdown-html-safe, /guides/markdown-code-block, /guides/markdown-table, /markdown-to-html/markdown-in-email
---
Install a Markdown parser from npm and call it on your string. With marked, `marked.parse(text)` returns an HTML string; with markdown-it, `new MarkdownIt().render(text)` does the same. Both work in Node.js and in the browser. If the Markdown comes from users, sanitize the HTML before putting it on a page.

JavaScript has no built-in markdown support, so a library is unavoidable. The three most used options are marked, markdown-it and the unified ecosystem (remark and rehype). The examples below were run on 2026-10-17 with Node.js 22 and these versions: marked 18.1.1, markdown-it 15.0.3, unified 11.0.5, remark-parse 11.0.0, remark-gfm 4.0.1, remark-rehype 11.1.2, rehype-sanitize 6.0.0, rehype-stringify 10.0.1 and dompurify 3.4.17. All of them are ES modules, so save the examples as `.mjs` files or set `"type": "module"` in `package.json`.

## Option 1: marked

marked is small and has GitHub Flavored Markdown (tables, task lists, strikethrough, autolinks) on by default.

```bash
npm install marked@18.1.1
```

```js
import { marked } from 'marked';

const html = marked.parse('# Hello\n\n```js\nconst a = 1;\n```\n');
console.log(html);
```

Output:

```html
<h1>Hello</h1>
<pre><code class="language-js">const a = 1;
</code></pre>
```

The `language-js` class comes from the fence's language tag, which is what highlight.js, Prism and Shiki look for; the [code block guide](/guides/markdown-code-block) covers the fence syntax. marked's package declares Node.js 20 or later.

## Option 2: markdown-it

markdown-it follows the CommonMark spec, has a large plugin ecosystem, and is safe by default: raw HTML in the input is escaped rather than passed through.

```bash
npm install markdown-it@15.0.3
```

```js
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ linkify: true });
console.log(md.render('# Hello\n\nSee https://example.com\n'));
```

`linkify: true` turns bare URLs into links; without it they stay plain text. markdown-it renders GFM tables and strikethrough out of the box, but not task lists. In our test, `- [x] done` came out as the literal text `[x] done`, so add a task-list plugin if you need checkboxes.

## Option 3: unified (remark and rehype)

unified turns markdown into a syntax tree, lets plugins change the tree, and then writes HTML. It is the most flexible option and the most verbose. remark-gfm adds the GitHub extensions, and rehype-sanitize cleans the output inside the same pipeline.

```bash
npm install unified@11.0.5 remark-parse@11.0.0 remark-gfm@4.0.1 remark-rehype@11.1.2 rehype-sanitize@6.0.0 rehype-stringify@10.0.1
```

```js
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

const file = await unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeStringify)
  .process('# Hello\n\n- [ ] todo\n');

console.log(String(file));
```

`process` is asynchronous, so it needs `await`. By default remark-rehype drops raw HTML from the input; the [remark-rehype readme](https://github.com/remarkjs/remark-rehype) documents the `allowDangerousHtml` option for keeping it, which you should only combine with sanitizing. The [markdown to HTML converter](/markdown-to-html) on this site uses this remark and rehype pipeline.

## How do the libraries differ?

The same input, run through each library with default options (markdown-it also with `linkify: true` for the autolink row):

| Input | marked 18.1.1 | markdown-it 15.0.3 | remark + remark-gfm |
|---|---|---|---|
| Pipe table | `<table>` | `<table>` | `<table>` |
| `- [x] done` | checkbox | literal `[x]` | checkbox |
| `~~old~~` | `<del>` | `<s>` | `<del>` |
| Bare URL | link | link only with `linkify` | link |
| Raw `<img onerror=…>` | passed through | escaped as text | dropped |
| `[a](javascript:…)` | link kept | not turned into a link | `href` removed by rehype-sanitize |

The table syntax itself is covered in the [markdown table guide](/guides/markdown-table). Pick marked for a quick, GitHub-like result; markdown-it when you want strict CommonMark, safe defaults and plugins; unified when you need to transform the document (add heading IDs, rewrite links, extract a table of contents) before it becomes HTML.

## Do I need to sanitize the HTML?

Yes, whenever the markdown comes from someone you do not fully trust. marked's own readme carries the warning "Marked does not sanitize the output HTML" and recommends running the output through DOMPurify. In our test, marked passed an `<img onerror>` tag and a `javascript:` link straight into the HTML. In the browser:

```js
import { marked } from 'marked';
import DOMPurify from 'dompurify';

element.innerHTML = DOMPurify.sanitize(marked.parse(userText));
```

On a server, DOMPurify needs a DOM; its readme recommends jsdom (`DOMPurify(new JSDOM('').window)`). The [guide on whether Markdown to HTML is safe](/markdown-to-html/is-markdown-html-safe) explains the attacks and the options in detail.

## How do I convert a .md file instead of a string?

Read the file, convert the text, and write the result. With marked in Node.js:

```js
import { readFile, writeFile } from 'node:fs/promises';
import { marked } from 'marked';

const markdown = await readFile('README.md', 'utf8');
await writeFile('README.html', marked.parse(markdown));
```

The output is an HTML fragment: headings, paragraphs and lists, with no `<html>`, `<head>` or stylesheet. Wrap it in your own page template if it has to open as a standalone document. marked also ships a command-line interface, so `npx marked -i README.md -o README.html` does the same without a script; `npx marked --help` lists the options. For a batch of files, loop over them with `readdir` and run the same three lines for each.

Front matter (the `---` block at the top of many markdown files) is not part of markdown. In our test, marked and markdown-it both rendered it as a horizontal rule followed by an `<h2>` containing the metadata lines, because the closing `---` turns the lines above it into a heading. Strip it first, or use a front matter parser and pass only the body to the converter.

## Can I use it in the browser without a build step?

Yes. Load the ES module from a CDN in a module script:

```html
<script type="module">
  import { marked } from 'https://cdn.jsdelivr.net/npm/marked@18.1.1/lib/marked.esm.js';
  import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.4.17/dist/purify.es.mjs';

  const source = document.querySelector('#source').value;
  document.querySelector('#output').innerHTML = DOMPurify.sanitize(marked.parse(source));
</script>
```

Pin the version in the URL, as above, so an upstream release cannot change your page without notice. For production sites, bundling the library is usually better than relying on a third-party CDN at runtime.

## Which library is fastest?

All three are fast enough that conversion time rarely matters for documents of normal length, and published benchmarks depend heavily on the input. If you convert very large volumes, measure with your own documents. The bigger practical differences are the defaults in the table above, bundle size if the code ships to browsers, and how easily you can extend the parser.

## How do I add syntax highlighting?

All three libraries tag fenced code with a `language-…` class but do not color it. Either load a client-side highlighter such as highlight.js or Prism on the page, or highlight at build time: markdown-it accepts a `highlight` function in its options, marked does it through the separate `marked-highlight` extension (version 2.2.4 at the time of writing), and unified has rehype plugins for it. Build-time highlighting sends ready-colored HTML and needs no JavaScript in the reader's browser.

## Should I convert in React with dangerouslySetInnerHTML?

You can, but a React-specific renderer is usually cleaner. [react-markdown](https://github.com/remarkjs/react-markdown) (version 10.1.0 at the time of writing) is built on the same remark ecosystem and builds React elements instead of an HTML string; its readme describes this as "no `dangerouslySetInnerHTML` or XSS attacks". If you do insert an HTML string, sanitize it first, exactly as in the browser example. For one-off conversions with no code at all, paste the text into the [markdown to HTML converter](/markdown-to-html) and copy the result.
