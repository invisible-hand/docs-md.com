---
title: PDF to Markdown for ChatGPT, Claude and RAG
h1: How do I convert a PDF to Markdown for ChatGPT, Claude or a RAG pipeline?
description: Extract the PDF's text layer as markdown, clean headers and page numbers, then paste, upload or chunk it by heading. When to send the PDF itself instead.
tool: pdf-to-markdown
updated: 2026-10-17
related: /pdf-to-markdown/scanned-pdf-to-markdown, /pdf-to-markdown/pdf-tables-to-markdown, /guides/markdown-headings, /markdown-word-counter
---
Extract the PDF's text into markdown, check it, remove page furniture such as running headers and page numbers, then paste or upload the `.md` file. For a RAG pipeline, split it on its headings. This works for PDFs with a text layer; scans need OCR first, and charts or complex tables are better sent as the PDF itself.

Markdown suits language models because it is plain text that still carries structure. A heading marked with `##` tells the model, and your chunking code, where a section starts; a `-` list stays a list. You also get to see and edit exactly what the model will read, which you cannot do with a PDF that the service parses for you.

## Why convert to Markdown instead of uploading the PDF?

Three reasons: control, cost and reuse. Both major APIs read PDFs by looking at the text and a picture of every page. Anthropic's [PDF support documentation](https://platform.claude.com/docs/en/build-with-claude/pdf-support) says each page is converted into an image and its text is extracted and provided alongside it, and that image tokens are charged in addition to text tokens. OpenAI's [file input guide](https://platform.openai.com/docs/guides/pdf-files) likewise says PDF parsing puts both extracted text and page images into context, which can increase token usage. Markdown sends only the text, so a long text-heavy document costs less to process and leaves more of the context window for your question.

Control matters as much. In markdown you can delete the cover page, the table of contents, the legal boilerplate and every repetition of the running header before the model sees any of it. And a markdown file can be versioned, diffed, searched and reused across tools, which a one-off upload cannot.

## When should I send the PDF itself?

When the meaning is in the layout or the pictures. Charts, diagrams, photos, signatures, forms with checkboxes and pages where position matters (an invoice, a floor plan) lose information as text. Complex tables are also safer as a PDF unless you rebuild them as markdown tables first. Scanned documents with no text layer cannot be converted by text extraction at all. In those cases the page images the APIs create are exactly what you want, and the extra cost buys real information.

## How do I convert the PDF in the browser?

1. Open the [PDF to markdown converter](/pdf-to-markdown) and drop the PDF on it, or click **Choose PDF**. The file is read in your browser and is not uploaded.
2. Read the result in the editor on the left against the preview on the right. Larger text has become headings (`#`, `##`, `###`), bullet characters have become list items, wrapped lines have been joined into paragraphs, and words hyphenated across line ends have been rejoined.
3. Clean up in the editor (see below).
4. Click **Copy markdown** to paste into a chat, or **Download .md** to upload the file or feed it to a script.

If the converter reports that no text was found, the PDF is a scan; see [whether a scanned PDF can be converted](/pdf-to-markdown/scanned-pdf-to-markdown).

## What should I clean up before giving it to a model?

Remove the things that repeat on every page and carry no meaning: running headers, footers, page numbers, and "Confidential" stamps. They come through as stray lines between paragraphs and can confuse both the model and a chunker. Then check:

- **Heading levels.** Headings are guessed from font size, so a large pull quote may have become a heading and a small bold heading may have stayed a paragraph. Fix them, because the headings are what your chunks will be built on. The [headings guide](/guides/markdown-headings) covers the levels.
- **Paragraphs split at page breaks.** Each page is processed on its own, so a paragraph that runs from one page to the next comes out as two. Join them where it matters.
- **Multi-column pages.** Two-column layouts, common in papers and newsletters, can come out with lines from both columns interleaved. Check these pages first.
- **Tables.** The converter does not rebuild tables; their cells come out as runs of text. Rebuild the important ones as markdown tables, following the [PDF tables guide](/pdf-to-markdown/pdf-tables-to-markdown).

To see how long the result is before you paste it, the [word counter](/markdown-word-counter) gives word and character counts.

## How do I chunk the Markdown for a RAG pipeline?

Split on headings rather than on a fixed number of characters, so that each chunk is one coherent section. A common pattern is to split at `##` and, if a section is still too long for your embedding model, again at `###`, then by paragraph. Keep the heading path with each chunk, for example "Annual report > Risks > Currency", either at the top of the chunk text or in its metadata, so a chunk retrieved on its own still says what it is about. Store the source file name and page or section with every chunk so answers can cite where they came from. Whatever sizes you choose, test retrieval on real questions; good chunking is checked, not assumed.

## How do I convert many PDFs automatically?

The browser converter handles one file at a time and has no API, so for a pipeline use a library. Two open-source options with markdown output: Microsoft's [MarkItDown](https://github.com/microsoft/markitdown) runs as `markitdown file.pdf -o file.md` after `pip install 'markitdown[all]'`, and [PyMuPDF4LLM](https://pypi.org/project/pymupdf4llm/) provides `pymupdf4llm.to_markdown("file.pdf")` in Python, with options for tables and OCR. PyMuPDF4LLM is licensed under the AGPL, with a commercial licence also offered, which matters if you ship it inside a closed product. Whichever you use, spot-check the output the same way you would check a manual conversion.

## Does the converter keep links, images or bold text?

No. It reads the characters on each page and their sizes, so it keeps text, headings, lists and paragraphs, but not hyperlinks, images, bold or italic, footnote markers as footnotes, or colours. For most question-answering use that loss is acceptable, because the words carry the meaning. If a document depends on its figures, describe them in a sentence where they appeared, or send the relevant pages as a PDF alongside the markdown.

## Is it safe to convert confidential PDFs this way?

The conversion step is: the PDF is processed in your browser and the file is not sent to a server. What happens next is up to you. Pasting the markdown into a chat service sends it to that service under its terms, the same as uploading the PDF would. Removing names, account numbers and other personal data from the markdown before you send it is easier than redacting a PDF, which is one more reason to convert first.
