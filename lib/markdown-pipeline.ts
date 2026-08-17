// Lazy-loaded markdown processing pipelines, shared by the browser tools.
// Everything here is imported dynamically from client components so unified
// and its plugins never land in the initial page bundle.

export interface HtmlConvertOptions {
  fullDocument: boolean;
  title: string;
}

export interface FormatOptions {
  bullet: '-' | '*' | '+';
  emphasis: '*' | '_';
  fence: '`' | '~';
}

// A minimal, GitHub-ish stylesheet embedded when the user asks for a full document.
const DOCUMENT_CSS = `
  body { max-width: 760px; margin: 2rem auto; padding: 0 1rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2328; }
  h1, h2 { border-bottom: 1px solid #d1d9e0; padding-bottom: .3em; }
  code { background: #f0f1f2; padding: .2em .4em; border-radius: 6px; font-size: 85%; }
  pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
  pre code { background: none; padding: 0; }
  table { border-collapse: collapse; }
  th, td { border: 1px solid #d1d9e0; padding: 6px 13px; }
  blockquote { border-left: .25em solid #d1d9e0; margin-left: 0; padding-left: 1em; color: #59636e; }
  img { max-width: 100%; }
`;

export async function markdownToHtml(
  markdown: string,
  options: HtmlConvertOptions,
): Promise<string> {
  const [{ unified }, { default: remarkParse }, { default: remarkGfm }, { default: remarkRehype }, { default: rehypeStringify }] =
    await Promise.all([
      import('unified'),
      import('remark-parse'),
      import('remark-gfm'),
      import('remark-rehype'),
      import('rehype-stringify'),
    ]);

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  const body = String(file).trim();
  if (!options.fullDocument) return body;

  const title = options.title.trim() || 'Document';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title.replace(/</g, '&lt;')}</title>
<style>${DOCUMENT_CSS}</style>
</head>
<body>
${body}
</body>
</html>`;
}

export async function formatMarkdown(markdown: string, options: FormatOptions): Promise<string> {
  const [{ unified }, { default: remarkParse }, { default: remarkGfm }, { default: remarkStringify }] =
    await Promise.all([
      import('unified'),
      import('remark-parse'),
      import('remark-gfm'),
      import('remark-stringify'),
    ]);

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkStringify, {
      bullet: options.bullet,
      emphasis: options.emphasis,
      fence: options.fence,
      strong: options.emphasis,
      rule: '-',
      listItemIndent: 'one',
      tightDefinitions: true,
    })
    .process(markdown);

  return String(file).replace(/\n+$/, '\n');
}
