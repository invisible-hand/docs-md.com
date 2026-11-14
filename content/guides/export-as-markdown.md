---
title: Export as Markdown — Meaning and What to Do
h1: What does "Export as Markdown" or "Copy as Markdown" mean?
description: Export as Markdown saves a document as plain text (.md) with its formatting written as Markdown symbols. Where it appears and what to do with the file.
updated: 2026-11-03
related: markdown-table, markdown-image, markdown-link, markdown-code-block, markdown-headings
---
"Export as Markdown" saves a document as a plain-text file, usually with the `.md` extension, in which the formatting is written out as Markdown symbols instead of being stored in a proprietary format. A heading becomes a line starting with `#`, bold text is wrapped in `**`, a bulleted list is lines starting with `-`, and a link is `[text](url)`. "Copy as Markdown" does the same thing to the clipboard instead of a file. The result opens in any text editor, renders in any Markdown viewer, and can be pasted into GitHub, Obsidian, Notion, a static site or an AI chat without losing structure.

```markdown
# Weekly plan

**Focus:** ship the importer.

- Monday: review the [spec](https://example.com/spec)
- Tuesday: write tests

> Carry-over: none
```

The example above is the entire content of a `.md` file. Nothing is hidden: what you see in a text editor is what the file contains, and a renderer such as the [markdown viewer](/markdown-viewer) turns it back into a heading, bold text, a list, a link and a quote.

## What does "Export as Markdown" mean?

It means the app rewrites your document as Markdown text and gives you the text as a file. Three things follow from that. The file is **plain text**: no fonts, no page layout, no embedded images, just characters. The formatting is **visible as symbols** (`#`, `**`, `-`, `[ ]( )`, `` ` ``), which is why a `.md` file is readable even without a renderer. And the file is **portable**: every Markdown tool, every code host and every AI assistant reads it, which is the reason apps added the option in the first place. Notion's help describes its Markdown export as files you "can open as plain text with Markdown syntax"; Google's announcement of the same feature in Docs calls it a way to "enhance Docs' interoperability with other Markdown supporting tools". For the syntax itself, see [what Markdown is](/what-is-markdown) and the [markdown cheat sheet](/markdown-cheat-sheet).

## What does "Copy as Markdown" mean?

The same conversion, aimed at the clipboard. You select formatted text, choose Copy as Markdown, and the clipboard receives Markdown source such as `## Title` and `**bold**` rather than rich text. Pasting it into a plain-text field (a GitHub issue, a code editor, a chat box, a Markdown note) keeps the structure; pasting it into a rich-text editor shows the symbols literally unless that editor has its own "Paste from Markdown" command. Google Docs has both commands in the right-click menu once Markdown is enabled in Tools → Preferences. AI chat apps commonly place a copy button under each answer that copies Markdown, because the answer was generated as Markdown; the exact behaviour differs by app and version, so paste into a plain-text field once to see what you get.

## Where does the Export as Markdown option appear?

In most writing and note apps, under Export, Download or Share. The rows below are the ones whose vendor documentation describes the option:

| App | Where the option is | What you get |
|---|---|---|
| Google Docs | File → Download → Markdown (.md); right-click → Copy as Markdown | One `.md` file; Copy as Markdown needs "Enable Markdown" in Tools → Preferences ([Google Docs Help](https://support.google.com/docs/answer/12014036)) |
| Notion | Page menu (···) → Export → Markdown & CSV | A ZIP with one `.md` per page, a `.csv` per database and the uploaded files; callouts are exported as HTML ([Notion Help](https://www.notion.com/help/export-your-content)) |
| Apple Notes (iOS 26 and later) | Share menu → Export as Markdown | A Markdown file of the note, to send or save ([Apple Support](https://support.apple.com/guide/iphone/iphdf551cfa2/ios)) |
| Bear | ··· menu on a note → export, or File → Export Notes… on Mac | `.md`, `.txt`, `.textbundle` and more; `.md` is in the free version ([Bear FAQ](https://bear.app/faq/export-your-notes)) |
| Craft | Share → Export As → Markdown (.md) | "Plain text that keeps structure and basic formatting"; TextBundle adds images ([Craft Help](https://support.craft.do/en/import-and-export/export/document)) |
| Dropbox Paper | ··· (more options) → Export → Markdown (.md) | One `.md`; embedded files may export as links ([Dropbox Help](https://help.dropbox.com/view-edit/paper-export-docs)) |
| Obsidian | No export needed | Every note already is a `.md` file in the vault folder on disk ([Obsidian Help](https://help.obsidian.md/data-storage)) |
| Confluence | Not available | Export is Word, PDF, HTML, CSV or XML; convert the HTML with [HTML to Markdown](/html-to-markdown) |

The platform sheets go deeper on the two office tools: [Google Docs Markdown](/google-docs-markdown) and [Notion Markdown](/notion-markdown).

## What is inside the exported file?

Plain text and nothing else. Open it in Notepad, TextEdit or any code editor and you will see your document with Markdown markers around the formatting. The main pieces:

| You had | The file contains |
|---|---|
| Heading | `# Title`, `## Section`, `### Subsection` |
| Bold, italic | `**bold**`, `*italic*` or `_italic_` |
| Bulleted or numbered list | Lines starting with `-` or `1.` |
| Checklist | `- [ ] open`, `- [x] done` |
| Link | `[text](https://example.com)` |
| Image | `![alt](path/or/url.png)` — a reference, not the picture |
| Table | Rows of cells separated by `\|`, with a `---` row under the header |
| Code | Backticks, or a fenced block between ``` lines |
| Quote | Lines starting with `>` |

Images are the thing to look for first. Markdown cannot embed a picture, so the exporter either writes a link to a copy of the file (Notion puts the images in a folder next to the `.md` files; Craft's TextBundle format bundles them) or writes a URL. If you move the `.md` file without its folder, the images break. The [image guide](/guides/markdown-image) explains the paths.

## What do you do with a .md file?

Open it in a Markdown viewer to read it, convert it to Word, PDF or HTML when another format is required, share it as a rendered link, or move it into any app that reads `.md` files — Obsidian, GitHub, VS Code, Google Docs and Notion all do. In order of how often each comes up:

1. **Read it rendered.** Drop it into the [markdown viewer](/markdown-viewer) to see headings, lists and tables as formatting, or open it in a code editor with a preview pane.
2. **Convert it.** [Markdown to Word](/markdown-to-word) makes a `.docx`, [Markdown to PDF](/markdown-to-pdf) a printable file, [Markdown to HTML](/markdown-to-html) a web page.
3. **Share it.** Ask your AI agent to [publish it to Docs MD](/agents) to get a link that renders the document for anyone, with no account needed to read it.
4. **Move it into another app.** Obsidian, GitHub, VS Code and most note apps open `.md` files directly; Google Docs opens one with File → Open → Upload; Notion imports it from Settings → Import.
5. **Feed it to an AI tool.** Markdown is the format chat assistants read and write most reliably; the [Markdown for AI output](/markdown-for-ai-output) sheet covers what comes back.

## What are the common surprises in an exported Markdown file?

Tables lose their styling, images turn into links, app-specific blocks become HTML or plain text, the strikethrough and checkbox spellings differ between apps, and file names carry ids or dates. In detail:

- **Tables lose their styling.** Merged cells, column widths and colours have no Markdown form; a complex table may come out as a plain grid or as HTML. The [table guide](/guides/markdown-table) shows what a Markdown table can and cannot hold.
- **Images turn into links.** The picture is a separate file or a URL; keep the exported folder together.
- **App-specific blocks become HTML or text.** Notion's help states that callouts are exported as HTML "as there is no Markdown equivalent"; toggles, columns, embeds and comments have no standard form either.
- **The strikethrough or checkbox spelling differs.** Google's help writes strikethrough with a single `~`, GitHub expects `~~`; Docs' checkbox shortcut is `[]`, GitHub's is `- [ ]`. A renderer that follows GitHub Flavored Markdown may show the single-tilde form literally.
- **File names carry ids or dates.** Notion appends a 32-character id to every file name; other apps add the export date. Rename before publishing.

Open the file in the [viewer](/markdown-viewer) right after exporting; anything that renders wrongly there will render wrongly everywhere else too, and the [formatter](/markdown-formatter) fixes most of the spacing and list issues in one pass.

## Is a .md file different from a .txt file?

Only in the extension. Both are plain text; `.md` tells editors, GitHub and viewers to treat the content as Markdown and render it, while `.txt` is shown as-is. Renaming `notes.txt` to `notes.md` changes nothing inside the file and makes Markdown-aware apps render it. The reverse also holds: if an app only accepts `.txt`, rename the export and the Markdown symbols stay readable. The [what is Markdown](/what-is-markdown) page covers the `.md`, `.markdown` and `.mdx` extensions in more detail.
