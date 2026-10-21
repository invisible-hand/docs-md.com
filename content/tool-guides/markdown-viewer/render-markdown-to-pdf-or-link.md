---
title: How to Share a Rendered Markdown File: PDF or Link
h1: How do I share a rendered markdown file with someone who has no markdown app?
description: Send a PDF when the document is final, or a link when it may change. How to make each from a .md file in a browser, and what each one keeps or loses.
tool: markdown-viewer
updated: 2026-10-20
related: /markdown-to-pdf, /markdown-to-word, /markdown-to-pdf/markdown-to-pdf-mermaid-code, /markdown-viewer/open-md-file-iphone-android
---
Send it as a PDF or as a link to a rendered web page. A PDF suits a finished document that should look the same everywhere and work offline. A link suits a document you may update, or one with wide tables and diagrams. Both open on any computer or phone without a markdown app.

Sending the `.md` file itself is the option to avoid when the reader is not technical. Their computer or phone will most likely show it as plain text, full of `#`, `*` and `|` characters, or ask them which app to use. The two routes below turn the markdown into something every device already knows how to open.

## How do I turn a markdown file into a PDF?

Render it and print it to PDF from your browser. In the [markdown viewer](/markdown-viewer), open or drop the `.md` file, check that it renders the way you expect, then click **Print / PDF** and choose **Save as PDF** as the destination in the print dialog. The viewer's controls are hidden and only the rendered document prints. For more control, the [markdown to PDF converter](/markdown-to-pdf) is built for this one job: it keeps code blocks with syntax highlighting, renders tables as real tables, and avoids leaving a heading alone at the bottom of a page. Either way the PDF is produced by the browser's print engine, so the text stays selectable and searchable, and the file is never uploaded.

For a cleaner result, set margins to **Default** and turn off **Headers and footers** in the print dialog, so the PDF does not carry the date and page address in its corners.

## How do I share a markdown file as a link?

Publish it and send the address. In the viewer, click **Share as link**: the document is published at a short URL that renders as a formatted page, diagrams included, and expires after 30 days. Anyone who opens the link sees the formatted document in their browser, on a computer or a phone, with nothing to install. If you need a different lifetime, use the [main sharing page](/), where you paste the markdown and choose an expiry of 1 day, 7 days, 30 days or never. That page also gives you an edit token, which lets you update the content behind the same URL later, or delete it.

## Should I send a PDF or a link?

Pick by what happens after you send it.

| Need | PDF | Link |
|---|---|---|
| Reader opens it offline or archives it | Yes | No |
| You will update the document after sending | Send a new file | Same URL, new content (with an edit token) |
| Looks identical on every device | Yes, fixed pages | Adapts to the screen |
| Wide tables and large diagrams | Can be cut at the page edge | Scroll horizontally |
| Attach to an email or upload to a portal | Yes | Paste the URL |
| Reader can copy text and code | Yes | Yes |
| Stops being available | Never, once sent | When it expires or you delete it |

In short, a PDF is a copy and a link is a window. Contracts, reports and anything that has to be filed should be PDFs. Drafts under review, plans that will change and documents mostly read on phones work better as links.

## Who can see a shared markdown link?

Anyone who has the URL. The links are unlisted rather than private: they are not protected by a password or tied to the recipient's account, so a forwarded link works for whoever receives it. Do not publish documents with passwords, keys, personal data or anything confidential this way. For sensitive material, send a PDF through a channel you already trust, or use a document system that controls access per person.

## What does each format keep from the markdown?

Both keep headings, lists, links, emphasis, tables, block quotes and code blocks with syntax highlighting. Mermaid diagrams render in the viewer and in shared links; in a PDF they appear as they render in the browser before printing, so check the print preview for diagrams cut across a page break. The [guide to keeping Mermaid and code blocks in a PDF](/markdown-to-pdf/markdown-to-pdf-mermaid-code) covers that in detail. Links stay clickable in both. In both, the text stays real text that readers can select and search, not an image of it.

## What if the reader needs to edit the document?

Then neither PDF nor link is ideal, because both are for reading. If they use Microsoft Word, convert the markdown to a `.docx` file with the [markdown to Word converter](/markdown-to-word) and send that; headings, lists and tables become native Word formatting they can change. If they are comfortable with markdown, send the `.md` file itself along with a link to a viewer, so they can read it formatted and still edit the source.

## Can I share a README from a GitHub repository?

If the repository is public, send the github.com address of the file: GitHub renders markdown for every visitor, with no account needed to read it. If the repository is private, the reader needs access to it, so publish a copy instead: paste the README into the viewer and share it as a link, or print it to PDF. Relative links to other files in the repository will not work in either copy, because those files are not included.

## How do I check the document before sending it?

Open the PDF or the link yourself, ideally on a phone as well as a computer. Look for tables that run off the edge, code blocks with very long lines, images that did not load and diagrams that failed to render. Images must use full `https` URLs to appear in a shared link or a PDF made in the browser, because a relative path such as `images/chart.png` only resolves next to the original file. Fix the markdown, render again, and only then send it. If the reader still has trouble, the guide to [opening a .md file on a phone](/markdown-viewer/open-md-file-iphone-android) shows the steps they would need.
