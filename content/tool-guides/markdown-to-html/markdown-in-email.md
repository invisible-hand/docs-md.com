---
title: Can I Use Markdown in Email? What Works and What Doesn't
h1: Can I use Markdown in email?
description: Not directly: email clients render HTML or plain text, not Markdown. Write in Markdown, convert to HTML, then paste or send the HTML. Steps and pitfalls.
tool: markdown-to-html
updated: 2026-10-17
related: /markdown-to-html/markdown-to-html-javascript, /guides/markdown-link, /guides/markdown-image, /markdown-to-plain-text
---
Not directly. Email messages are sent as HTML or plain text, and mail clients do not turn Markdown into formatting, so `**bold**` arrives as two asterisks on each side. You can still write in Markdown: convert it to HTML first, then paste the formatted result into your email or send the HTML from code.

There is one case where raw markdown works fine: a plain-text email. Markdown was designed so that the source reads well without being rendered. John Gruber's [syntax documentation](https://daringfireball.net/projects/markdown/syntax) says a Markdown document "should be publishable as-is, as plain text, without looking like it's been marked up with tags or formatting instructions." A short list with hyphens, or a word in asterisks, is perfectly readable in a plain-text message. What you do not get is bold text, clickable link text or a rendered table.

## How do I send Markdown-formatted email from Gmail or Outlook?

Convert first, then paste the rendered result, not the HTML source.

1. Write the message in markdown.
2. Paste it into the [markdown to HTML converter](/markdown-to-html) and look at the preview.
3. Select the rendered preview and copy it. The browser puts formatted text on the clipboard.
4. Paste into the compose window of your mail client. Headings, bold, lists and links arrive as formatting.
5. Send yourself a test message first and read it on your phone as well as on your computer.

Do not paste the HTML code itself into a normal compose window: it will be sent as visible tags. The HTML source is for tools that accept HTML directly, such as a newsletter service's HTML editor or code that sends email.

## Is there an extension that does this inside the email client?

Yes. [Markdown Here](https://github.com/adam-p/markdown-here) is an open-source extension; its repository describes it as a "Google Chrome, Firefox, and Thunderbird extension that lets you write email in Markdown and render it before sending." You write markdown in the compose window, then trigger the extension to convert it in place before you press send. As with any extension that reads your compose window, check the permissions it asks for and how recently it was updated.

## Is there a Markdown email format, like text/markdown?

There is a registered media type. [RFC 7763](https://www.rfc-editor.org/rfc/rfc7763) registers `text/markdown` for markdown content. Registration only defines the label; it does not require mail clients to render markdown as formatting, so do not rely on it for messages to other people. HTML is the format that mail clients actually render.

## How do I send Markdown as email from code?

Convert the markdown to HTML on your side and send a message with two parts: the markdown as the plain-text version and the HTML as the rich version. MIME's `multipart/alternative` type exists for this; [RFC 2046, section 5.1.4](https://www.rfc-editor.org/rfc/rfc2046#section-5.1.4) defines it as alternative versions of the same information, ordered from plainest to richest, with the client picking the best one it can show. Because markdown reads well as text, the source makes a good plain-text part with no extra work.

To produce the HTML, use pandoc on the command line or a JavaScript library. Tested with pandoc 3.12.1:

```bash
pandoc -f gfm -t html message.md -o message.html
```

In JavaScript, `marked.parse(text)` or markdown-it do the same; the [guide to converting Markdown to HTML in JavaScript](/markdown-to-html/markdown-to-html-javascript) compares them with tested code. Most email-sending services and libraries accept a text body and an HTML body as separate fields and build the multipart message for you.

## Why does my converted email look different in each client?

Email clients support much less HTML and CSS than browsers do, and each one differs. The [caniemail.com entry for the `<style>` element](https://www.caniemail.com/features/html-style/) lists partial or buggy support in several clients; one of its notes reads "Not supported with non Google accounts", and another records a 16 KB size limit on the `<style>` tag. A converter's output with a stylesheet in the head may therefore lose its styling.

The usual fix is to move the CSS onto each element as inline `style` attributes. The juice library does this; tested with juice 12.2.0:

```js
import juice from 'juice';

const html = juice('<style>h1 { color: #333; }</style><h1>Weekly update</h1>');
// '<h1 style="color: #333;">Weekly update</h1>'
```

Keep the markup simple: headings, paragraphs, lists, links, bold and italic hold up well. Wide tables, fenced code blocks and task-list checkboxes are where rendering differs most, so test them in the clients your readers use, or replace them with simpler formatting.

## What about images and links?

Links work as normal `[text](https://…)` links; write full URLs, because a relative link such as `/pricing` has nothing to resolve against inside an email. The [link guide](/guides/markdown-link) covers the syntax. Images need absolute URLs as well, pointing at a server the reader can reach, and many clients block remote images until the reader allows them. Always write alt text, since that is what readers see while images are blocked; the [image guide](/guides/markdown-image) shows where it goes.

## How do I keep a Markdown email readable as plain text?

Write it so the source looks like a normal message. Use short paragraphs and hyphen bullets, which read naturally in any client. Put long URLs in reference-style links, so the sentence reads `see the [release notes][1]` and the address sits at the bottom of the message rather than in the middle of a line; the [link guide](/guides/markdown-link) shows the syntax. Avoid pipe tables in the text part, because they only line up in a monospaced font, and many clients show plain text in a proportional one. Skip heading marks beyond one level, or replace them with a line of capital letters. A message written this way works as the plain-text part of a multipart email without any changes.

## Should I just send plain text instead?

For personal messages and short replies, often yes. Markdown source is readable as it is, it renders the same in every client, and it avoids the HTML pitfalls above. If your markdown has more symbols than a reader should see, such as tables, links with long URLs or nested emphasis, the [markdown to plain text converter](/markdown-to-plain-text) strips the syntax and leaves clean text. Use HTML when the formatting carries meaning: a newsletter with sections, a message with several links, or anything that has to match a brand.
