// Markdown → chat/wiki dialect converters. The markdown is parsed once with
// remark (GFM on), then the mdast tree is walked and every node is emitted by
// a per-dialect emitter table. Anything a target cannot express is
// approximated and reported as a warning the UI can list next to the output.
//
// Syntax references (checked 2026-10-15):
//   Slack mrkdwn      https://docs.slack.dev/messaging/formatting-message-text
//   Discord markdown  https://support.discord.com/hc/en-us/articles/210298617
//   Jira wiki markup  https://jira.atlassian.com/secure/WikiRendererHelpAction.jspa?section=all

import type {
  AlignType,
  Blockquote,
  Code,
  Heading,
  List,
  ListItem,
  PhrasingContent,
  Root,
  RootContent,
  Table,
} from 'mdast';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

export type Dialect = 'slack' | 'discord' | 'jira' | 'plain';

export interface DialectWarning {
  /** 1-based source line of the element. */
  line: number;
  /** Markdown element that had no exact equivalent. */
  element: string;
  /** What the converter did instead. */
  action: string;
}

export interface ConvertOptions {
  /** plain: write links as "text (url)" instead of dropping the URL. */
  keepLinkUrls?: boolean;
  /** slack: 'api' emits <url|text> and escapes & < > as the API requires; 'composer' emits plain "text: url". */
  slackTarget?: 'api' | 'composer';
  /** discord: 'masked' emits [text](url); 'plain' emits "text (url)". */
  discordLinks?: 'masked' | 'plain';
}

export interface ConvertResult {
  output: string;
  warnings: DialectWarning[];
}

// ---------------------------------------------------------------------------
// Emitter contract
// ---------------------------------------------------------------------------

interface Ctx {
  opts: Required<ConvertOptions>;
  warn: (line: number, element: string, action: string) => void;
}

interface ListItemParts {
  /** Inline content of the item's first paragraph (already emitted). */
  text: string;
  /** Rendered nested lists / extra blocks (already emitted), or ''. */
  nested: string;
  ordered: boolean;
  /** 1-based number of this item when ordered. */
  number: number;
  /** 0 for a top-level list. */
  depth: number;
  /** Ordered/unordered flags from the outermost list down to this one. */
  path: boolean[];
  /** GFM task-list state; null when not a task. */
  checked: boolean | null;
  line: number;
}

interface TableParts {
  /** Cells emitted with the dialect's inline rules. */
  rich: string[][];
  /** Cells as plain text (for code-block fallbacks). */
  plain: string[][];
  align: AlignType[];
  line: number;
}

interface Emitter {
  /** Escape a run of literal text. */
  text(s: string): string;
  strong(inner: string): string;
  emphasis(inner: string): string;
  strike(inner: string, line: number, ctx: Ctx): string;
  inlineCode(code: string): string;
  code(code: string, lang: string | null, line: number, ctx: Ctx): string;
  link(text: string, url: string, line: number, ctx: Ctx): string;
  image(alt: string, url: string, line: number, ctx: Ctx): string;
  heading(text: string, depth: number, line: number, ctx: Ctx): string;
  listItem(item: ListItemParts, ctx: Ctx): string;
  blockquote(inner: string, line: number, ctx: Ctx): string;
  table(t: TableParts, ctx: Ctx): string;
  thematicBreak(line: number, ctx: Ctx): string;
  html(raw: string, line: number, ctx: Ctx): string;
  lineBreak(): string;
  unsupported(element: string, fallbackText: string, line: number, ctx: Ctx): string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

/** Strip HTML tags, keeping <br> as a newline and decoding common entities. */
export function stripHtml(raw: string): string {
  const out = raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, code: string) => {
      if (code[0] === '#') {
        const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
        return Number.isFinite(n) ? String.fromCodePoint(n) : m;
      }
      return ENTITIES[code.toLowerCase()] ?? m;
    })
    .replace(/\n{3,}/g, '\n\n');
  // A lone <br> must survive as a line break rather than being trimmed away.
  return out.trim() === '' ? (out.includes('\n') ? '\n' : '') : out.trim();
}

function indent(block: string, pad: string): string {
  return block
    .split('\n')
    .map((l) => (l ? pad + l : l))
    .join('\n');
}

/** Pad columns so a table reads as a grid in a monospace code block. */
function gridTable(rows: string[][], align: AlignType[]): string {
  const cols = Math.max(...rows.map((r) => r.length));
  const widths = Array.from({ length: cols }, (_, c) => Math.max(...rows.map((r) => (r[c] ?? '').length)));
  const pad = (s: string, c: number) => {
    const w = widths[c];
    const a = align[c];
    if (a === 'right') return s.padStart(w);
    if (a === 'center') {
      const left = Math.floor((w - s.length) / 2);
      return ' '.repeat(left) + s + ' '.repeat(w - s.length - left);
    }
    return s.padEnd(w);
  };
  const line = (r: string[]) => widths.map((_, c) => pad(r[c] ?? '', c)).join('  ').trimEnd();
  const [head, ...body] = rows;
  const rule = widths.map((w) => '-'.repeat(w)).join('  ');
  return [line(head), rule, ...body.map(line)].join('\n');
}

const JIRA_LANGS = new Set([
  'actionscript', 'ada', 'applescript', 'bash', 'c', 'c#', 'c++', 'css', 'erlang', 'go', 'groovy', 'haskell',
  'html', 'javascript', 'json', 'lua', 'nyan', 'objc', 'perl', 'php', 'python', 'r', 'ruby', 'scala', 'sql',
  'swift', 'visualbasic', 'xml', 'yaml', 'java',
]);
const JIRA_ALIASES: Record<string, string> = {
  js: 'javascript', jsx: 'javascript', mjs: 'javascript', sh: 'bash', shell: 'bash', zsh: 'bash', yml: 'yaml',
  py: 'python', rb: 'ruby', cs: 'c#', csharp: 'c#', cpp: 'c++', 'objective-c': 'objc', objectivec: 'objc',
  htm: 'html', vb: 'visualbasic', golang: 'go', pl: 'perl',
};

// ---------------------------------------------------------------------------
// Emitters
// ---------------------------------------------------------------------------

function markerLine(item: ListItemParts, marker: string, pad: string): string {
  const box = item.checked === null ? '' : item.checked ? '[x] ' : '[ ] ';
  const first = `${pad}${marker} ${box}${item.text}`;
  return item.nested ? `${first}\n${item.nested}` : first;
}

const slack: Emitter = {
  text: (s) => s, // escaping for API mode is applied in textNode() via ctx
  strong: (i) => `*${i}*`,
  emphasis: (i) => `_${i}_`,
  strike: (i) => `~${i}~`,
  inlineCode: (c) => `\`${c}\``,
  code(code, lang, line, ctx) {
    if (lang) ctx.warn(line, 'code block', `language "${lang}" dropped: mrkdwn code blocks have no language tag or highlighting`);
    return `\`\`\`\n${code}\n\`\`\``;
  },
  link(text, url, line, ctx) {
    if (ctx.opts.slackTarget === 'composer') {
      return text && text !== url ? `${text}: ${url}` : url;
    }
    return text && text !== url ? `<${url}|${text}>` : `<${url}>`;
  },
  image(alt, url, line, ctx) {
    ctx.warn(line, 'image', 'no inline images in mrkdwn: wrote the URL (Slack unfurls it, or use an image block)');
    return alt ? `${alt}: ${url}` : url;
  },
  heading(text, depth, line, ctx) {
    ctx.warn(line, `heading h${depth}`, 'mrkdwn has no headings: written as a bold line');
    return `*${text}*`;
  },
  listItem(item, ctx) {
    if (item.depth === 0 && item.number === 1) {
      ctx.warn(item.line, 'list', 'mrkdwn has no list syntax: written as • / 1. lines with spaces for nesting');
    }
    const marker = item.ordered ? `${item.number}.` : item.depth === 0 ? '•' : '◦';
    return markerLine(item, marker, '    '.repeat(item.depth));
  },
  blockquote: (inner) => indent(inner, '> ').replace(/^> $/gm, '>'),
  table(t, ctx) {
    ctx.warn(t.line, 'table', 'mrkdwn has no tables: written as an aligned grid inside a code block');
    return `\`\`\`\n${gridTable(t.plain, t.align)}\n\`\`\``;
  },
  thematicBreak(line, ctx) {
    ctx.warn(line, 'horizontal rule', 'mrkdwn has no rule: written as a line of dashes (use a divider block in Block Kit)');
    return '———';
  },
  html(raw, line, ctx) {
    ctx.warn(line, 'HTML', 'tags stripped: Slack shows HTML literally');
    return stripHtml(raw);
  },
  lineBreak: () => '\n',
  unsupported(element, fallback, line, ctx) {
    ctx.warn(line, element, 'not supported in mrkdwn: kept as plain text');
    return fallback;
  },
};

const DISCORD_ESCAPE = /([\\*_~`])/g;

const discord: Emitter = {
  text: (s) => s.replace(DISCORD_ESCAPE, '\\$1'),
  strong: (i) => `**${i}**`,
  emphasis: (i) => `*${i}*`,
  strike: (i) => `~~${i}~~`,
  inlineCode: (c) => `\`${c}\``,
  code: (code, lang) => `\`\`\`${lang ?? ''}\n${code}\n\`\`\``,
  link(text, url, line, ctx) {
    if (!text || text === url) return url;
    if (ctx.opts.discordLinks === 'plain') {
      ctx.warn(line, 'link', 'masked link written as "text (url)" because plain links were requested');
      return `${text} (${url})`;
    }
    return `[${text}](${url})`;
  },
  image(alt, url, line, ctx) {
    ctx.warn(line, 'image', 'no inline image syntax: wrote the URL (Discord embeds direct image links)');
    return alt ? `${alt}: ${url}` : url;
  },
  heading(text, depth, line, ctx) {
    if (depth <= 3) return `${'#'.repeat(depth)} ${text}`;
    ctx.warn(line, `heading h${depth}`, 'Discord supports headers # to ### only: written as a bold line');
    return `**${text}**`;
  },
  listItem(item) {
    const marker = item.ordered ? `${item.number}.` : '-';
    return markerLine(item, marker, '  '.repeat(item.depth));
  },
  blockquote: (inner) => indent(inner, '> ').replace(/^> $/gm, '>'),
  table(t, ctx) {
    ctx.warn(t.line, 'table', 'Discord has no tables: written as an aligned grid inside a code block');
    return `\`\`\`\n${gridTable(t.plain, t.align)}\n\`\`\``;
  },
  thematicBreak(line, ctx) {
    ctx.warn(line, 'horizontal rule', 'Discord has no rule: written as a line of dashes');
    return '———';
  },
  html(raw, line, ctx) {
    ctx.warn(line, 'HTML', 'tags stripped: Discord shows HTML literally');
    return stripHtml(raw);
  },
  lineBreak: () => '\n',
  unsupported(element, fallback, line, ctx) {
    ctx.warn(line, element, 'not supported in Discord markdown: kept as plain text');
    return fallback;
  },
};

const jira: Emitter = {
  text: (s) => s.replace(/([{[])/g, '\\$1'),
  strong: (i) => `*${i}*`,
  emphasis: (i) => `_${i}_`,
  strike: (i) => `-${i}-`,
  inlineCode: (c) => `{{${c}}}`,
  code(code, lang, line, ctx) {
    if (!lang) return `{noformat}\n${code}\n{noformat}`;
    const key = lang.toLowerCase();
    const mapped = JIRA_ALIASES[key] ?? key;
    if (JIRA_LANGS.has(mapped)) return `{code:${mapped}}\n${code}\n{code}`;
    ctx.warn(line, 'code block', `language "${lang}" is not in Jira's highlighter list: written as {code} without a language`);
    return `{code}\n${code}\n{code}`;
  },
  link: (text, url) => (text && text !== url ? `[${text}|${url}]` : `[${url}]`),
  image(alt, url, line, ctx) {
    if (alt) ctx.warn(line, 'image', 'alt text dropped: Jira image markup carries only the URL');
    return `!${url}!`;
  },
  heading: (text, depth) => `h${depth}. ${text}`,
  listItem(item) {
    const marker = item.path.map((ordered) => (ordered ? '#' : '*')).join('');
    return markerLine(item, marker, '');
  },
  blockquote: (inner) => `{quote}\n${inner}\n{quote}`,
  table(t, ctx) {
    const esc = (row: string[]) =>
      row.map((c) => {
        if (c.includes('|')) ctx.warn(t.line, 'table cell', 'pipe inside a cell replaced with ¦ (Jira cannot escape it)');
        return c.replace(/\|/g, '¦').replace(/^\s*$/, ' ');
      });
    const [head, ...body] = t.rich;
    const lines = [`||${esc(head).join('||')}||`, ...body.map((r) => `|${esc(r).join('|')}|`)];
    return lines.join('\n');
  },
  thematicBreak: () => '----',
  html(raw, line, ctx) {
    ctx.warn(line, 'HTML', 'tags stripped: the {html} macro is disabled on most Jira sites');
    return stripHtml(raw);
  },
  lineBreak: () => ' \\\\\n',
  unsupported(element, fallback, line, ctx) {
    ctx.warn(line, element, 'not supported in Jira wiki markup: kept as plain text');
    return fallback;
  },
};

const plain: Emitter = {
  text: (s) => s,
  strong: (i) => i,
  emphasis: (i) => i,
  strike: (i) => i,
  inlineCode: (c) => c,
  code: (code) => code,
  link: (text, url, line, ctx) => (ctx.opts.keepLinkUrls && text && text !== url ? `${text} (${url})` : text || url),
  image: (alt, url, line, ctx) => (ctx.opts.keepLinkUrls ? (alt ? `${alt} (${url})` : url) : alt || url),
  heading: (text) => text,
  listItem(item) {
    const marker = item.ordered ? `${item.number}.` : '-';
    return markerLine(item, marker, '  '.repeat(item.depth));
  },
  blockquote: (inner) => inner,
  table: (t) => gridTable(t.plain, t.align),
  thematicBreak: () => '',
  html: (raw) => stripHtml(raw),
  lineBreak: () => '\n',
  unsupported: (element, fallback) => fallback,
};

export const EMITTERS: Record<Dialect, Emitter> = { slack, discord, jira, plain };

// ---------------------------------------------------------------------------
// Tree walk
// ---------------------------------------------------------------------------

const lineOf = (n: { position?: { start: { line: number } } }): number => n.position?.start.line ?? 0;

function textNode(value: string, em: Emitter, ctx: Ctx): string {
  const out = em.text(value);
  if (em === slack && ctx.opts.slackTarget === 'api') {
    return out.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  return out;
}

function inline(nodes: PhrasingContent[], em: Emitter, ctx: Ctx): string {
  return nodes.map((n) => inlineNode(n, em, ctx)).join('');
}

function inlineNode(n: PhrasingContent, em: Emitter, ctx: Ctx): string {
  switch (n.type) {
    case 'text':
      return textNode(n.value, em, ctx);
    case 'strong':
      return em.strong(inline(n.children, em, ctx));
    case 'emphasis':
      return em.emphasis(inline(n.children, em, ctx));
    case 'delete':
      return em.strike(inline(n.children, em, ctx), lineOf(n), ctx);
    case 'inlineCode':
      return em.inlineCode(n.value);
    case 'link':
      return em.link(inline(n.children, em, ctx), n.url, lineOf(n), ctx);
    case 'image':
      return em.image(n.alt ?? '', n.url, lineOf(n), ctx);
    case 'break':
      return em.lineBreak();
    case 'html':
      return em.html(n.value, lineOf(n), ctx);
    case 'linkReference':
      return em.unsupported('reference-style link', inline(n.children, em, ctx), lineOf(n), ctx);
    case 'imageReference':
      return em.unsupported('reference-style image', n.alt ?? '', lineOf(n), ctx);
    case 'footnoteReference':
      return em.unsupported('footnote', `[^${n.identifier}]`, lineOf(n), ctx);
    default:
      return '';
  }
}

function plainInline(nodes: PhrasingContent[]): string {
  const ctx: Ctx = { opts: { keepLinkUrls: false, slackTarget: 'api', discordLinks: 'masked' }, warn: () => {} };
  return inline(nodes, plain, ctx);
}

function listNode(list: List, em: Emitter, ctx: Ctx, depth: number, path: boolean[]): string {
  const ordered = Boolean(list.ordered);
  const start = list.start ?? 1;
  const myPath = [...path, ordered];
  return list.children
    .map((item: ListItem, i) => {
      const [first, ...rest] = item.children;
      let text = '';
      let restNodes = item.children;
      if (first?.type === 'paragraph') {
        text = inline(first.children, em, ctx);
        restNodes = rest;
      }
      const nested = restNodes
        .map((child) =>
          child.type === 'list' ? listNode(child, em, ctx, depth + 1, myPath) : indent(blockNode(child, em, ctx), '  '),
        )
        .filter(Boolean)
        .join('\n');
      if (item.checked !== null && item.checked !== undefined && depth === 0 && i === 0) {
        ctx.warn(lineOf(item), 'task list', 'checkbox written as [x] / [ ] text');
      }
      return em.listItem(
        {
          text,
          nested,
          ordered,
          number: start + i,
          depth,
          path: myPath,
          checked: item.checked ?? null,
          line: lineOf(item),
        },
        ctx,
      );
    })
    .join('\n');
}

function tableNode(t: Table, em: Emitter, ctx: Ctx): string {
  const rich = t.children.map((row) => row.children.map((cell) => inline(cell.children, em, ctx)));
  const plainRows = t.children.map((row) => row.children.map((cell) => plainInline(cell.children)));
  return em.table({ rich, plain: plainRows, align: (t.align ?? []) as AlignType[], line: lineOf(t) }, ctx);
}

function blockNode(n: RootContent, em: Emitter, ctx: Ctx): string {
  switch (n.type) {
    case 'paragraph':
      return inline(n.children, em, ctx);
    case 'heading':
      return em.heading(inline((n as Heading).children, em, ctx), n.depth, lineOf(n), ctx);
    case 'code':
      return em.code((n as Code).value, n.lang ?? null, lineOf(n), ctx);
    case 'blockquote':
      return em.blockquote(blocks((n as Blockquote).children, em, ctx), lineOf(n), ctx);
    case 'list':
      return listNode(n, em, ctx, 0, []);
    case 'table':
      return tableNode(n, em, ctx);
    case 'thematicBreak':
      return em.thematicBreak(lineOf(n), ctx);
    case 'html':
      return em.html(n.value, lineOf(n), ctx);
    case 'definition':
      return '';
    case 'footnoteDefinition':
      return em.unsupported('footnote definition', `[^${n.identifier}]: ${blocks(n.children, em, ctx)}`, lineOf(n), ctx);
    default:
      return 'children' in n ? blocks(n.children as RootContent[], em, ctx) : 'value' in n ? String(n.value) : '';
  }
}

function blocks(nodes: RootContent[], em: Emitter, ctx: Ctx): string {
  return nodes
    .map((n) => blockNode(n, em, ctx))
    .filter((s) => s !== '')
    .join('\n\n');
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function parseMarkdown(markdown: string): Root {
  return unified().use(remarkParse).use(remarkGfm).parse(markdown) as Root;
}

export function convertMarkdown(markdown: string, dialect: Dialect, options: ConvertOptions = {}): ConvertResult {
  const warnings: DialectWarning[] = [];
  const ctx: Ctx = {
    opts: {
      keepLinkUrls: options.keepLinkUrls ?? false,
      slackTarget: options.slackTarget ?? 'api',
      discordLinks: options.discordLinks ?? 'masked',
    },
    warn: (line, element, action) => warnings.push({ line, element, action }),
  };
  const tree = parseMarkdown(markdown);
  const output = blocks(tree.children, EMITTERS[dialect], ctx).replace(/\n{3,}/g, '\n\n').trim();
  return { output, warnings };
}

export const DIALECT_LABELS: Record<Dialect, string> = {
  slack: 'Slack mrkdwn',
  discord: 'Discord markdown',
  jira: 'Jira wiki markup',
  plain: 'Plain text',
};
