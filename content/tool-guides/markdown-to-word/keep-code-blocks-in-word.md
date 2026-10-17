---
title: Keep Code Blocks Formatted When Converting Markdown to Word
h1: How do I keep code blocks formatted when converting Markdown to Word?
description: Convert with a tool that maps fenced code to a monospaced block style, tag the language for highlighting, and stop Word's AutoCorrect from changing quotes.
tool: markdown-to-word
updated: 2026-10-17
related: /guides/markdown-code-block, /markdown-to-pdf, /markdown-to-word/can-word-open-md-file, /markdown-to-word/markdown-table-to-word-table
---
Use fenced code blocks in the Markdown and convert with a tool that maps them to a monospaced block style, such as Pandoc or a converter that writes preformatted text. Indentation and line breaks then survive. Pasting code as plain text into Word loses them, because Word's normal paragraph style uses a proportional font and AutoCorrect rewrites quotes.

Code is the part of a document that breaks most easily on the way into Word. Prose can reflow freely; code cannot. A changed quote mark, a collapsed indent or a wrapped line can turn a working example into one that fails when a reader copies it. The steps below keep the code exact and readable.

## Why do code blocks lose their formatting in Word?

Three separate things go wrong, and they have different fixes.

- **The font.** Word's body text is proportional, so columns of code stop lining up. Code needs a monospaced font.
- **Whitespace.** Leading spaces, tabs and blank lines inside a block matter in code, especially in Python and YAML. Plain paragraphs in Word do not protect them.
- **AutoCorrect.** Word's [AutoFormat As You Type](https://support.microsoft.com/en-us/word/autoformat-as-you-type) options replace straight quotes with curly ones and can apply formatting to text wrapped in asterisks or underscores. Inside code, that silently changes the characters.

A converter fixes the first two by writing each code block as a dedicated preformatted block. The third only happens when someone types in Word, so it matters when you edit the code after conversion.

## How do I convert Markdown code blocks to Word in the browser?

Paste the document into the [Markdown to Word converter](/markdown-to-word) and download the `.doc`. Each fenced code block becomes a preformatted block set in Consolas (falling back to Courier New) at 10 pt, on a light grey background with a thin border, and inline code in sentences gets the same monospaced font. Spaces, indentation and blank lines inside the block are kept as written. Open the file in desktop Word and use File > Save As > Word Document (.docx) to make it a standard Word file.

The limit is color. The browser converter does not apply syntax highlighting, so keywords and strings come out in one color. For many documents (runbooks, procedures, handover notes) that is fine and easier to print. If you need colored code, use Pandoc.

## How do I keep syntax highlighting with Pandoc?

Pandoc highlights code in `.docx` output by default, using its internal highlighter and the `pygments` style, as described under `--syntax-highlighting` in the [Pandoc manual](https://pandoc.org/MANUAL.html#option--syntax-highlighting). It needs to know the language, so write the tag after the opening fence:

````markdown
```python
def total(items):
    return sum(i.price for i in items)
```
````

Then convert:

```bash
pandoc guide.md -o guide.docx
```

To pick a different color scheme, pass a style name. The manual lists `pygments`, `kate`, `monochrome`, `breezeDark`, `espresso`, `zenburn`, `haddock` and `tango`, and `pandoc --list-highlight-styles` prints the list for your installed version:

```bash
pandoc guide.md --syntax-highlighting=tango -o guide.docx
pandoc guide.md --syntax-highlighting=none -o guide.docx
```

If your pandoc rejects `--syntax-highlighting`, it is an older release: use `--highlight-style=tango` instead, which the current manual lists as the deprecated spelling of the same option. Dark styles such as `breezeDark` and `zenburn` assume a dark background, so check that the result is legible on a white page before you send it.

## How do I change the font or size of code in the Word file?

With Pandoc, change the styles in a reference document rather than fixing each block by hand. Pandoc writes code blocks with the paragraph style `Source Code` and inline code with the character style `Verbatim Char`; both are in the list of styles the [reference-doc option](https://pandoc.org/MANUAL.html#option--reference-doc) uses. Create the reference file once, edit those two styles in Word (font, size, shading, spacing), save it, and pass it on every conversion:

```bash
pandoc -o custom-reference.docx --print-default-data-file reference.docx
pandoc guide.md --reference-doc=custom-reference.docx -o guide.docx
```

With the browser converter's output, select one code block in Word, set the font and shading you want, then use Styles > Create a Style so you can apply the same look to the other blocks in one click each.

## What do I do about long lines in code blocks?

Word has no horizontal scrolling, so a line wider than the page wraps onto the next line. The wrapped part is not a new line in the code, but a reader cannot tell. Your options, in order of preference:

1. Shorten the lines in the source. Most languages allow breaking a long call or command across lines (a trailing backslash in shell, open brackets in Python and JavaScript).
2. Reduce the code font size by a point in the code style. Do it in the style, not block by block.
3. Put the section in landscape orientation in Word for very wide output such as logs or tables printed by a tool.

If the document is going to be read rather than edited, a PDF is often the better target: the [Markdown to PDF converter](/markdown-to-pdf) keeps the same monospaced blocks with fixed page layout.

## How do I stop Word changing quotes inside code?

Turn off the smart quotes option before you edit any code in Word. Microsoft's [smart quotes page](https://support.microsoft.com/en-us/office/smart-quotes-in-word-702fc92e-b723-4e3d-b2cc-71dedaf2f343) gives the path: File > Options > Proofing > AutoCorrect Options > AutoFormat As You Type, then clear "Straight quotes" with "smart quotes". The setting only affects text as you type, so code that came in through conversion keeps its straight quotes until someone edits it.

Spelling and grammar marks are the other annoyance: Word underlines variable names and keywords. Select the code (or modify the code style) and choose [Do not check spelling or grammar](https://support.microsoft.com/en-us/word/set-up-or-change-the-languages-used-to-check-spelling-and-grammar) in the proofing language settings, so the red lines go away without switching proofing off for the whole document.

## What happens to inline code, tables of commands and diagrams?

Inline code in a sentence keeps its monospaced font with both converters. Code inside a table cell has to be inline code in Markdown in the first place, because a GitHub Flavored Markdown cell cannot hold a fenced block; the [code block guide](/guides/markdown-code-block) and [Markdown table to Word table](/markdown-to-word/markdown-table-to-word-table) cover both sides of that. Diagram fences such as `mermaid` are not drawn by either converter: they arrive in Word as code, showing the diagram source. Render the diagram to an image first and reference the image in the Markdown if the reader needs to see it.

## How do I check the code survived?

Copy one block back out of the Word file and compare it with the original, or run it. A diff tool shows any changed character: curly quotes, a non-breaking space, a dash where a hyphen was. For documents where readers will copy commands, do this check on every block, not only the first one.
