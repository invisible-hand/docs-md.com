// Single source of truth for the free tools: the /tools hub, the footer, the
// sitemap, tool page headers, JSON-LD and "more tools" cross-links all read
// from here. Add a tool once and every surface picks it up.

export type ToolCategory = 'convert' | 'generate' | 'check' | 'edit' | 'reference';

export interface Tool {
  /** URL path without the leading slash. */
  slug: string;
  /** Short label for nav/footers. */
  name: string;
  /** Card / H1 title. */
  title: string;
  /** Card body, one or two sentences. */
  description: string;
  /** <title> for the page (the site suffix is added by the layout template). */
  metaTitle: string;
  /** Meta description, ≤155 chars. */
  metaDescription: string;
  category: ToolCategory;
  /** YYYY-MM-DD of the last substantive change; shown as "Updated" and as dateModified. */
  updated: string;
}

export const TOOL_CATEGORIES: { id: ToolCategory; label: string; blurb: string }[] = [
  { id: 'convert', label: 'Convert', blurb: 'Move documents between markdown and other formats.' },
  { id: 'generate', label: 'Generate', blurb: 'Build correct markdown from a form instead of by hand.' },
  { id: 'check', label: 'Check & compare', blurb: 'Find problems in a document before you publish it.' },
  { id: 'edit', label: 'Edit & share', blurb: 'Write, preview, tidy, and publish.' },
  { id: 'reference', label: 'Reference', blurb: 'Look up the syntax.' },
];

export const TOOLS: Tool[] = [
  // ---- convert -------------------------------------------------------------
  {
    slug: 'html-to-markdown',
    name: 'HTML to markdown',
    title: 'HTML to markdown converter',
    description:
      'Paste HTML or rich text from any web page and get clean GitHub-flavored markdown — tables, code blocks, and nested lists included.',
    metaTitle: 'HTML to Markdown Converter — Free Online Tool',
    metaDescription:
      'Convert HTML to clean markdown in your browser: paste HTML source or copied web content, get GFM with tables, code blocks, and lists. Nothing uploaded.',
    category: 'convert',
    updated: '2026-09-03',
  },
  {
    slug: 'markdown-to-html',
    name: 'Markdown to HTML',
    title: 'Markdown to HTML converter',
    description:
      'Turn markdown into clean semantic HTML as you type — copy the fragment, or download a complete styled document. GFM supported.',
    metaTitle: 'Markdown to HTML Converter — Free Online Tool',
    metaDescription:
      'Convert markdown to clean HTML in your browser: GFM tables, task lists, and code blocks supported. Copy the HTML or download a complete styled document.',
    category: 'convert',
    updated: '2026-08-16',
  },
  {
    slug: 'markdown-to-pdf',
    name: 'Markdown to PDF',
    title: 'Markdown to PDF converter',
    description:
      'Paste or open a .md file and download a PDF with real selectable text, highlighted code, and rendered tables. Fully client-side.',
    metaTitle: 'Markdown to PDF Converter — Free Online Tool',
    metaDescription:
      'Convert markdown to PDF in your browser: paste or open a .md file, preview with syntax highlighting and tables, download a PDF with selectable text. Free.',
    category: 'convert',
    updated: '2026-08-16',
  },
  {
    slug: 'pdf-to-markdown',
    name: 'PDF to markdown',
    title: 'PDF to markdown converter',
    description:
      'Drop a PDF, get editable markdown — headings, lists, and paragraphs inferred from the layout. Nothing is uploaded.',
    metaTitle: 'PDF to Markdown Converter — Free Online Tool',
    metaDescription:
      'Convert a PDF to markdown free in your browser: drop the file, get editable markdown with headings, lists, and paragraphs inferred from layout. No upload.',
    category: 'convert',
    updated: '2026-08-29',
  },
  {
    slug: 'markdown-to-word',
    name: 'Markdown to Word',
    title: 'Markdown to Word converter',
    description:
      'Markdown to a .doc that opens in Word — or paste from Word and get clean markdown back. Both directions, in-browser.',
    metaTitle: 'Markdown to Word Converter — Free Online Tool',
    metaDescription:
      'Convert markdown to a Word document with headings, tables, and code preserved, or paste from Word and get clean markdown back. Free, both ways, in-browser.',
    category: 'convert',
    updated: '2026-08-29',
  },
  {
    slug: 'csv-to-markdown',
    name: 'CSV to markdown',
    title: 'CSV to markdown table converter',
    description:
      'Paste CSV, TSV, or a spreadsheet range and get an aligned markdown table — or paste a markdown table and get CSV back.',
    metaTitle: 'CSV to Markdown Table Converter — Free Online Tool',
    metaDescription:
      'Convert CSV or TSV to a markdown table, or a markdown table back to CSV. Delimiter auto-detect, header row, column alignment, padding. Runs in your browser.',
    category: 'convert',
    updated: '2026-09-03',
  },

  // ---- generate ------------------------------------------------------------
  {
    slug: 'markdown-table-generator',
    name: 'Table generator',
    title: 'Markdown table generator',
    description:
      'Build tables in a visual grid — set column alignment, paste CSV/TSV from a spreadsheet, and copy clean padded markdown.',
    metaTitle: 'Markdown Table Generator — Free Online Tool',
    metaDescription:
      'Build markdown tables visually: edit cells, set column alignment, paste CSV or TSV data, and copy clean padded markdown. Free, no signup, works in your browser.',
    category: 'generate',
    updated: '2026-09-01',
  },
  {
    slug: 'readme-generator',
    name: 'README generator',
    title: 'README generator',
    description:
      'Fill in a form, get a professional README.md with live badges, install and usage sections, and a live preview.',
    metaTitle: 'README Generator — Free Online Tool',
    metaDescription:
      'Generate a professional README.md: fill in a form, get badges, install instructions, usage examples, and license sections with a live preview. Free, no signup.',
    category: 'generate',
    updated: '2026-09-01',
  },
  {
    slug: 'markdown-toc-generator',
    name: 'TOC generator',
    title: 'Table of contents generator',
    description:
      'Paste a document, get a linked TOC with GitHub-exact anchor slugs — choose depth, insert it under your title.',
    metaTitle: 'Markdown Table of Contents Generator — Free TOC Tool',
    metaDescription:
      'Generate a markdown table of contents from your headings with correct GitHub anchor links. Choose depth, numbered or bulleted, and insert it in the doc.',
    category: 'generate',
    updated: '2026-08-29',
  },
  {
    slug: 'markdown-link-generator',
    name: 'Link & image generator',
    title: 'Link, image & code block generator',
    description:
      'Fill in a form, get correct markdown for links (with tooltips and reference style), sized images, and fenced code.',
    metaTitle: 'Markdown Link, Image & Code Block Generator — Free Tool',
    metaDescription:
      'Generate correct markdown for links, images, and fenced code blocks: fill in the fields, preview live, copy the snippet. Tooltips and reference links too.',
    category: 'generate',
    updated: '2026-08-29',
  },
  {
    slug: 'markdown-badge-generator',
    name: 'Badge generator',
    title: 'Markdown badge generator',
    description:
      'Design shields.io badges with a live preview — label, message, color, style, logo — and copy them as markdown, HTML, or reStructuredText.',
    metaTitle: 'Markdown Badge Generator — shields.io Badges for READMEs',
    metaDescription:
      'Generate README badges with a live preview: static or dynamic shields.io badges for version, license, CI, downloads, and stars. Copy as markdown, HTML, or RST.',
    category: 'generate',
    updated: '2026-09-03',
  },
  {
    slug: 'changelog-generator',
    name: 'Changelog generator',
    title: 'Changelog generator',
    description:
      'Build a CHANGELOG.md in Keep a Changelog format — or paste your git log and let conventional commits sort themselves into Added, Fixed, and Changed.',
    metaTitle: 'Changelog Generator — Keep a Changelog Markdown, Free',
    metaDescription:
      'Generate a CHANGELOG.md in Keep a Changelog format: versions, dates, Added/Changed/Fixed sections, compare links. Paste a git log to group conventional commits.',
    category: 'generate',
    updated: '2026-09-03',
  },
  {
    slug: 'front-matter-generator',
    name: 'Front matter generator',
    title: 'Front matter generator',
    description:
      'Generate valid YAML, TOML, or JSON front matter for Jekyll, Hugo, Astro, Docusaurus, or Obsidian — dates, tags, slugs, and custom fields, escaped correctly.',
    metaTitle: 'Front Matter Generator — YAML for Jekyll, Hugo, Astro',
    metaDescription:
      'Generate YAML, TOML, or JSON front matter for Jekyll, Hugo, Astro, Docusaurus, and Obsidian notes: title, date, slug, tags, draft, and custom fields, quoted right.',
    category: 'generate',
    updated: '2026-09-03',
  },

  // ---- check & compare -----------------------------------------------------
  {
    slug: 'markdown-lint',
    name: 'Markdown linter',
    title: 'Markdown linter',
    description:
      'Find heading, list, spacing, and link problems in a document — every finding explained, most of them fixable with one click.',
    metaTitle: 'Markdown Linter — Check and Fix Markdown Online, Free',
    metaDescription:
      'Lint markdown in your browser: heading levels, list markers, trailing spaces, hard tabs, bare URLs, missing alt text, duplicate headings. One-click fixes.',
    category: 'check',
    updated: '2026-09-03',
  },
  {
    slug: 'markdown-diff',
    name: 'Markdown diff',
    title: 'Markdown diff checker',
    description:
      'Compare two versions of a document side by side or as a unified patch, with word-level highlights inside changed lines.',
    metaTitle: 'Markdown Diff — Compare Two Markdown Files Online, Free',
    metaDescription:
      'Compare two markdown or text documents in your browser: side-by-side or unified view, word-level highlights, change counts, and a copyable patch.',
    category: 'check',
    updated: '2026-09-03',
  },
  {
    slug: 'markdown-link-checker',
    name: 'Link checker',
    title: 'Markdown link checker',
    description:
      'Extract every link from a document and check it — dead pages, redirects, and broken #anchors — with the line each one is on.',
    metaTitle: 'Markdown Link Checker — Find Broken Links in a README',
    metaDescription:
      'Check every link in a markdown document: HTTP status for external URLs, broken heading anchors, duplicate links, and where each one sits. Free, no signup.',
    category: 'check',
    updated: '2026-09-03',
  },
  {
    slug: 'markdown-word-counter',
    name: 'Word counter',
    title: 'Markdown word counter',
    description:
      'Word, character, sentence, and paragraph counts that ignore markdown syntax and code — plus reading time and heading, link, and image totals.',
    metaTitle: 'Markdown Word Counter — Words, Characters, Reading Time',
    metaDescription:
      'Count words, characters, sentences, and paragraphs in markdown without the syntax and code blocks skewing the numbers. Reading time and structure stats.',
    category: 'check',
    updated: '2026-09-03',
  },

  // ---- edit & share --------------------------------------------------------
  {
    slug: 'markdown-viewer',
    name: 'Markdown viewer',
    title: 'Markdown viewer',
    description:
      'Open a .md file — drag it in, paste, or load from a URL — and read it rendered with tables, code highlighting, and mermaid diagrams. Print or share it.',
    metaTitle: 'Markdown Viewer — Open and Read .md Files Online, Free',
    metaDescription:
      'View any markdown file in your browser: drag in a .md file or paste text to read it rendered with tables, highlighted code, and diagrams. Print or share.',
    category: 'edit',
    updated: '2026-09-03',
  },
  {
    slug: 'markdown-formatter',
    name: 'Formatter',
    title: 'Markdown formatter',
    description:
      'Prettify messy markdown: uniform list markers, one emphasis style, aligned tables. Semantic — rendered output never changes.',
    metaTitle: 'Markdown Formatter — Prettify Markdown Online, Free',
    metaDescription:
      'Format and prettify markdown online: normalize list markers, emphasis style, table alignment, and spacing. Semantic formatting that never changes output.',
    category: 'edit',
    updated: '2026-08-16',
  },

  // ---- reference -----------------------------------------------------------
  {
    slug: 'markdown-cheat-sheet',
    name: 'Cheat sheet',
    title: 'Markdown cheat sheet',
    description:
      'Every element of markdown and GFM with side-by-side syntax and rendered output — headings to footnotes to mermaid diagrams.',
    metaTitle: 'Markdown Cheat Sheet — Complete Syntax Reference',
    metaDescription:
      'Every markdown element with live rendered examples: headings, emphasis, lists, links, images, code, tables, task lists, footnotes, mermaid. Copy a snippet.',
    category: 'reference',
    updated: '2026-09-01',
  },
];

export function getTool(slug: string): Tool {
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  return tool;
}

export function toolsInCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((t) => t.category === category);
}

/** A few tools to cross-link from a page: same category first, then others. */
export function relatedTools(slug: string, count = 5): Tool[] {
  const me = getTool(slug);
  const same = TOOLS.filter((t) => t.slug !== slug && t.category === me.category);
  const rest = TOOLS.filter((t) => t.slug !== slug && t.category !== me.category);
  return [...same, ...rest].slice(0, count);
}

export const TOOL_ROUTES = TOOLS.map((t) => `/${t.slug}`);
