---
title: Can a Scanned PDF Be Converted to Markdown?
h1: Can a scanned PDF be converted to Markdown?
description: Yes, after OCR adds a text layer. How to tell if a PDF is scanned, how to run OCR with OCRmyPDF, then convert, and what OCR gets wrong.
tool: pdf-to-markdown
updated: 2026-10-17
related: /pdf-to-markdown/pdf-to-markdown-for-llm, /pdf-to-markdown/pdf-tables-to-markdown, /markdown-formatter, /markdown-lint
---
Yes, but only after optical character recognition (OCR) turns the page images into text. A scanned PDF is a set of photographs of pages with no text inside, so a text-based converter finds nothing to extract. Run OCR first, which adds an invisible text layer, then convert that PDF to markdown and proofread it.

The distinction is between how a PDF was made, not how it looks. A PDF exported from Word, Google Docs, LaTeX or a design tool contains the actual characters with their fonts and positions; a converter can read them directly. A PDF made by a scanner, a phone scanning app or a fax contains one image per page. To a computer it is no different from a photo of a page, and getting words out of it means recognising the shapes of letters, which is what OCR does.

## How do I know if my PDF is scanned?

Open it in any PDF viewer and try to select a sentence with the cursor. If you can highlight individual words, there is a text layer. If the cursor draws a box over the whole page, or nothing happens, the page is an image. A second check is search: press Ctrl+F (Cmd+F on macOS) and look for a word you can see on the page; no match means no text. On the command line, the Poppler utility `pdffonts` lists the fonts a PDF uses, and a purely scanned file lists none:

```bash
pdffonts scan.pdf
```

Some PDFs are mixed: typed pages with a few scanned pages inserted, such as a signed form. Check a page of each kind.

## What does the PDF to Markdown converter do with a scan?

The [PDF to markdown converter](/pdf-to-markdown) reads only the text layer, in your browser, and does not perform OCR. That is a deliberate trade: OCR engines are large and slow, and keeping the tool to text extraction means the file never leaves your computer and conversion takes seconds. When a PDF has no text at all, it says so, with a message that the file is probably a scan and needs OCR.

With a mixed PDF, there is no error. The typed pages convert and the scanned pages contribute nothing, so the markdown can look complete while missing pages. Compare the page count shown above the result with the content, or OCR the whole file first so every page has text.

## How do I add a text layer with OCR?

[OCRmyPDF](https://github.com/ocrmypdf/OCRmyPDF) is a free command-line tool that adds a searchable text layer to a scanned PDF using the Tesseract OCR engine, while the scanned page images stay visible as before. Its README lists installs such as `brew install ocrmypdf` on macOS and `apt install ocrmypdf` on Debian and Ubuntu. Then:

```bash
ocrmypdf -l eng scan.pdf scan-ocr.pdf
```

`-l` sets the language, and several can be combined, for example `-l eng+fra`; other languages need their Tesseract language packs installed. The README also shows `--rotate-pages` to fix pages scanned sideways and `--deskew` to straighten crooked ones, both of which help recognition. For a mixed PDF where some pages already have text, the documentation describes a skip mode that leaves those pages alone: `--mode skip` in version 17 and later, `--skip-text` in earlier versions.

Once you have `scan-ocr.pdf`, drop it into the converter. Headings, paragraphs and lists are inferred from the OCR text the same way as from any other PDF.

## Are there other ways to OCR a PDF?

Several, depending on what you have:

- **Desktop PDF software.** Many PDF editors include an OCR or "recognise text" command that saves a searchable copy; feed that copy to the converter.
- **Python libraries.** [PyMuPDF4LLM](https://pypi.org/project/pymupdf4llm/) converts PDFs to markdown and documents OCR options such as `force_ocr=True` and `ocr_language="eng+fra"`. Microsoft's MarkItDown has an OCR plugin that sends page images to a vision-capable language model.
- **An AI model directly.** Claude and OpenAI's models accept PDFs and look at an image of each page, so you can upload a scan and ask for markdown. Treat the result as a draft: models can silently skip or rephrase text, which is harder to spot than an OCR typo.

## How accurate is OCR?

It depends mostly on the scan. Clean, straight, high-resolution pages of printed text in a common font come out with few errors; faint photocopies, skewed phone photos, small print, unusual fonts and handwriting come out much worse. The Tesseract documentation on [improving quality](https://tesseract-ocr.github.io/tessdoc/ImproveQuality.html) says it works best on images of at least 300 DPI, so if you are scanning the paper yourself, scan at 300 DPI or higher rather than trying to fix a low-resolution file later.

Typical errors to look for when proofreading: `0` and `O`, `1`, `l` and `I`, `rn` read as `m`, missing or extra spaces, broken words at line ends, and stray characters from stamps, staples or punch holes. Numbers deserve the most care, because a wrong digit looks perfectly plausible.

## What about tables and multi-column pages in scans?

OCR recognises characters, not structure. Table cells come out as text in reading order and columns of a two-column page can be interleaved, the same problems that text-based PDFs have, plus recognition errors on top. Rebuild important tables by hand or with a table-extraction tool; the [PDF tables guide](/pdf-to-markdown/pdf-tables-to-markdown) covers the options. For newspapers and academic papers with complex layouts, expect to reorder paragraphs.

## How do I clean up the Markdown after OCR?

Read it against the original, page by page, for anything you will rely on. Then tidy the structure: fix heading levels, delete running headers and page numbers that came through as text, and rejoin paragraphs split at page breaks. The [markdown formatter](/markdown-formatter) normalises spacing and list markers, and the [markdown linter](/markdown-lint) points out structural problems such as skipped heading levels. If the markdown is going to a language model, the guide to [preparing PDFs for ChatGPT, Claude or RAG](/pdf-to-markdown/pdf-to-markdown-for-llm) covers the remaining steps.

## Can handwriting be converted to Markdown?

Not reliably with standard OCR. Engines such as Tesseract are built for printed text, and handwritten notes usually come out as fragments. Vision-capable AI models do better on clear handwriting, but they guess at unclear words without marking them, so check every line. For a few pages, typing them out may be faster than correcting the output.
