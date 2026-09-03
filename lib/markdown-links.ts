// Pure link-extraction and local verification for the markdown link checker.
// Runs in the browser; nothing here touches the network.

import GithubSlugger from 'github-slugger';

export type LinkKind = 'link' | 'image' | 'reference' | 'autolink' | 'bare' | 'html';
export type LinkTarget = 'external' | 'mailto' | 'anchor' | 'relative' | 'other';

export interface ExtractedLink {
  /** 1-based line number. */
  line: number;
  kind: LinkKind;
  /** Link text, alt text, or reference id. */
  text: string;
  url: string;
  target: LinkTarget;
  /** For reference-style uses: the id looked up, or undefined when inline. */
  refId?: string;
}

export type LocalVerdict =
  | { state: 'anchor-ok' }
  | { state: 'anchor-missing'; anchor: string }
  | { state: 'undefined-reference'; refId: string }
  | { state: 'relative' }
  | { state: 'unchecked' } // mailto/tel/other schemes
  | { state: 'external' };

export interface CheckedLink extends ExtractedLink {
  verdict: LocalVerdict;
  duplicate: boolean;
}

export interface ExtractionResult {
  links: CheckedLink[];
  anchors: string[];
  /** Reference ids defined with `[id]: url`. */
  definitions: Record<string, string>;
}

const SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;

export function classifyUrl(url: string): LinkTarget {
  const u = url.trim();
  if (u.startsWith('#')) return 'anchor';
  if (/^https?:\/\//i.test(u) || /^\/\//.test(u)) return 'external';
  if (/^(mailto|tel|sms):/i.test(u)) return 'mailto';
  if (SCHEME_RE.test(u)) return 'other';
  return 'relative';
}

/** Split a markdown document into lines, remembering which are inside code fences. */
function proseLines(content: string): { line: string; index: number }[] {
  const out: { line: string; index: number }[] = [];
  let inFence = false;
  content.split('\n').forEach((line, index) => {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      return;
    }
    if (!inFence) out.push({ line, index });
  });
  return out;
}

/** Mask inline code spans so URLs inside backticks are not extracted. */
function maskInlineCode(line: string): string {
  return line.replace(/(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/g, (m) => ' '.repeat(m.length));
}

const HEADING_RE = /^(#{1,6})\s+(.+?)\s*#*\s*$/;

/** Heading anchors (GitHub slugs) plus explicit HTML ids and named anchors. */
export function extractAnchors(content: string): string[] {
  const slugger = new GithubSlugger();
  const anchors = new Set<string>();
  for (const { line } of proseLines(content)) {
    const h = HEADING_RE.exec(line);
    if (h) {
      const text = h[2]
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[*_`~]/g, '')
        .trim();
      if (text) anchors.add(slugger.slug(text));
    }
    for (const m of line.matchAll(/\b(?:id|name)\s*=\s*["']([^"']+)["']/gi)) {
      anchors.add(m[1]);
    }
  }
  return [...anchors];
}

/** Everything that looks like a link, with line numbers. Fenced code is skipped. */
export function extractLinks(content: string): { links: ExtractedLink[]; definitions: Record<string, string> } {
  const links: ExtractedLink[] = [];
  const definitions: Record<string, string> = {};
  const lines = proseLines(content);

  // Pass 1: reference definitions `[id]: url "title"`.
  for (const { line } of lines) {
    const def = /^\s{0,3}\[([^\]]+)\]:\s*<?([^\s>]+)>?(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*$/.exec(line);
    if (def) definitions[def[1].toLowerCase()] = def[2];
  }

  for (const { line: raw, index } of lines) {
    const lineNo = index + 1;
    if (/^\s{0,3}\[[^\]]+\]:\s*\S/.test(raw)) continue; // definitions are not uses
    const line = maskInlineCode(raw);
    const consumed: [number, number][] = [];
    const take = (start: number, end: number) => {
      consumed.push([start, end]);
    };
    const free = (i: number) => !consumed.some(([s, e]) => i >= s && i < e);

    // Inline links and images: [text](url "title") / ![alt](src)
    for (const m of line.matchAll(/(!?)\[([^\]]*)\]\(\s*<?([^\s<>()]+(?:\([^\s()]*\))?)>?(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/g)) {
      const start = m.index ?? 0;
      take(start, start + m[0].length);
      const url = m[3];
      links.push({ line: lineNo, kind: m[1] ? 'image' : 'link', text: m[2], url, target: classifyUrl(url) });
    }

    // Reference uses: [text][id], [id][], [id]
    for (const m of line.matchAll(/(!?)\[([^\]]+)\](?:\[([^\]]*)\])?/g)) {
      const start = m.index ?? 0;
      if (!free(start)) continue;
      // Skip footnotes and task-list checkboxes.
      if (/^\^/.test(m[2]) || /^[ xX]$/.test(m[2])) continue;
      const after = line.slice(start + m[0].length, start + m[0].length + 1);
      if (after === '(' || after === ':') continue;
      const id = (m[3] === undefined || m[3] === '' ? m[2] : m[3]).toLowerCase();
      // A bare [text] with no definition and no second bracket is just brackets, not a link.
      if (m[3] === undefined && !(id in definitions)) continue;
      take(start, start + m[0].length);
      const url = definitions[id] ?? '';
      links.push({
        line: lineNo,
        kind: 'reference',
        text: m[2],
        url,
        target: url ? classifyUrl(url) : 'other',
        refId: id,
      });
    }

    // Autolinks <https://…> / <mailto:…>
    for (const m of line.matchAll(/<((?:https?:\/\/|mailto:)[^\s<>]+)>/gi)) {
      const start = m.index ?? 0;
      if (!free(start)) continue;
      take(start, start + m[0].length);
      links.push({ line: lineNo, kind: 'autolink', text: m[1], url: m[1], target: classifyUrl(m[1]) });
    }

    // HTML <a href> / <img src>
    for (const m of line.matchAll(/<(a|img)\b[^>]*?\b(?:href|src)\s*=\s*["']([^"']+)["'][^>]*>/gi)) {
      const start = m.index ?? 0;
      if (!free(start)) continue;
      take(start, start + m[0].length);
      const textMatch = m[1].toLowerCase() === 'a' ? /<a\b[^>]*>([^<]*)/i.exec(line.slice(start)) : /\balt\s*=\s*["']([^"']*)["']/i.exec(m[0]);
      links.push({
        line: lineNo,
        kind: 'html',
        text: textMatch?.[1]?.trim() || `<${m[1].toLowerCase()}>`,
        url: m[2],
        target: classifyUrl(m[2]),
      });
    }

    // Bare URLs (GFM autolink literals)
    for (const m of line.matchAll(/(?<![\w"'=(<\[/])(https?:\/\/[^\s<>)\]"']+)/gi)) {
      const start = m.index ?? 0;
      if (!free(start)) continue;
      const url = m[1].replace(/[.,;:!?]+$/, '');
      take(start, start + m[0].length);
      links.push({ line: lineNo, kind: 'bare', text: url, url, target: 'external' });
    }
  }

  links.sort((a, b) => a.line - b.line);
  return { links, definitions };
}

/** Normalize a URL for duplicate detection. */
function dupKey(url: string): string {
  return url.trim().replace(/\/+$/, '').toLowerCase();
}

/** Extract every link and give each a local verdict (no network). */
export function analyzeLinks(content: string): ExtractionResult {
  const { links, definitions } = extractLinks(content);
  const anchors = extractAnchors(content);
  const anchorSet = new Set(anchors.map((a) => a.toLowerCase()));
  const seen = new Map<string, number>();

  const checked: CheckedLink[] = links.map((link) => {
    let verdict: LocalVerdict;
    if (link.kind === 'reference' && !link.url) {
      verdict = { state: 'undefined-reference', refId: link.refId ?? link.text };
    } else if (link.target === 'anchor') {
      const anchor = link.url.slice(1);
      verdict = anchorSet.has(decodeURIComponent(anchor).toLowerCase()) ? { state: 'anchor-ok' } : { state: 'anchor-missing', anchor };
    } else if (link.target === 'external') {
      verdict = { state: 'external' };
    } else if (link.target === 'relative') {
      verdict = { state: 'relative' };
    } else {
      verdict = { state: 'unchecked' };
    }

    const key = link.url ? dupKey(link.url) : '';
    const count = key ? (seen.get(key) ?? 0) : 0;
    if (key) seen.set(key, count + 1);
    return { ...link, verdict, duplicate: count > 0 };
  });

  return { links: checked, anchors, definitions };
}

/** Unique external http(s) URLs, protocol-relative ones resolved to https. */
export function externalUrls(links: ExtractedLink[]): string[] {
  const out = new Set<string>();
  for (const l of links) {
    if (l.target !== 'external' || !l.url) continue;
    out.add(l.url.startsWith('//') ? `https:${l.url}` : l.url);
  }
  return [...out];
}
