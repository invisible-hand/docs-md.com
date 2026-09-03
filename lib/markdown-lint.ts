// A small markdown linter in the spirit of markdownlint: a fixed set of rules
// with markdownlint-style ids, each with an explanation and, where safe, an
// autofix. Pure functions — no DOM — so they can be unit-tested.

import type { Heading, Image, Link, List, ListItem, Root, RootContent } from 'mdast';

export type Severity = 'error' | 'warning';

export interface RuleMeta {
  id: string;
  name: string;
  description: string;
  why: string;
  severity: Severity;
  fixable: boolean;
}

export interface Finding {
  rule: string;
  /** 1-based line */
  line: number;
  /** 1-based column */
  column: number;
  message: string;
  severity: Severity;
  fixable: boolean;
  /** Extra data a fixer may need (e.g. the url to wrap, the marker to use). */
  detail?: string;
}

export interface LintOptions {
  /** Rule ids to skip. */
  disabled?: Set<string>;
  /** Allow exactly two trailing spaces (markdown hard line break). Default true. */
  allowHardBreakSpaces?: boolean;
}

export const RULES: RuleMeta[] = [
  { id: 'MD001', name: 'heading-increment', description: 'Heading levels should only increment by one level at a time', why: 'Skipping from H1 to H3 breaks the document outline that screen readers, TOC generators, and search engines rely on.', severity: 'warning', fixable: false },
  { id: 'MD003', name: 'heading-style', description: 'Use one heading style (ATX # headings, not setext underlines)', why: 'Mixing # headings with underlined headings makes a document harder to scan and to edit with tooling.', severity: 'warning', fixable: true },
  { id: 'MD004', name: 'ul-style', description: 'Use one unordered list marker throughout', why: 'Some renderers treat a change of marker as a new list, which breaks numbering, nesting, and spacing.', severity: 'warning', fixable: true },
  { id: 'MD009', name: 'no-trailing-spaces', description: 'No trailing spaces at the end of lines', why: 'Two trailing spaces are an invisible hard line break; any other count is noise that shows up in diffs.', severity: 'warning', fixable: true },
  { id: 'MD010', name: 'no-hard-tabs', description: 'Use spaces instead of tab characters', why: 'Tab width varies by editor, so list nesting and indented code render differently for different people.', severity: 'warning', fixable: true },
  { id: 'MD012', name: 'no-multiple-blanks', description: 'No more than one consecutive blank line', why: 'Extra blank lines do nothing in rendered markdown and make the source inconsistent.', severity: 'warning', fixable: true },
  { id: 'MD018', name: 'no-missing-space-atx', description: 'A space is required after # in a heading', why: 'Without the space, "#Heading" is rendered as a literal paragraph starting with #, not as a heading.', severity: 'error', fixable: true },
  { id: 'MD019', name: 'no-multiple-space-atx', description: 'Only one space after # in a heading', why: 'Extra spaces are ignored by renderers but make headings misalign in the source.', severity: 'warning', fixable: true },
  { id: 'MD022', name: 'blanks-around-headings', description: 'Headings should be surrounded by blank lines', why: 'Some parsers will not recognise a heading that directly follows a paragraph line.', severity: 'warning', fixable: true },
  { id: 'MD024', name: 'no-duplicate-heading', description: 'Headings should not repeat the same text', why: 'Duplicate headings produce duplicate anchors (GitHub appends -1, -2), so table-of-contents links become fragile.', severity: 'warning', fixable: false },
  { id: 'MD025', name: 'single-h1', description: 'Only one top-level H1 per document', why: 'The H1 is the document title; multiple H1s confuse outlines, search engines, and README renderers.', severity: 'error', fixable: false },
  { id: 'MD026', name: 'no-trailing-punctuation', description: 'No trailing punctuation in headings', why: 'Headings are labels, not sentences; a trailing period or colon looks accidental and ends up in anchor slugs on some platforms.', severity: 'warning', fixable: true },
  { id: 'MD031', name: 'blanks-around-fences', description: 'Fenced code blocks should be surrounded by blank lines', why: 'Without blank lines some parsers merge the fence into the preceding paragraph or list item.', severity: 'warning', fixable: true },
  { id: 'MD034', name: 'no-bare-urls', description: 'Bare URLs should be wrapped in angle brackets or a link', why: 'Bare URLs are only clickable in GFM; CommonMark renderers show them as plain text and trailing punctuation is often swallowed into the link.', severity: 'warning', fixable: true },
  { id: 'MD040', name: 'fenced-code-language', description: 'Fenced code blocks should declare a language', why: 'The language tag enables syntax highlighting and tells readers and tooling what the snippet is.', severity: 'warning', fixable: false },
  { id: 'MD041', name: 'first-line-heading', description: 'The first line should be a top-level heading', why: 'Renderers and READMEs use the first H1 as the document title.', severity: 'warning', fixable: false },
  { id: 'MD042', name: 'no-empty-links', description: 'Links must have a destination', why: 'An empty destination renders as a link that goes nowhere — almost always a forgotten URL.', severity: 'error', fixable: false },
  { id: 'MD045', name: 'no-alt-text', description: 'Images should have alternate text', why: 'Alt text is what screen readers announce and what shows when the image fails to load.', severity: 'warning', fixable: false },
  { id: 'MD047', name: 'single-trailing-newline', description: 'The file should end with exactly one newline', why: 'POSIX tools, git diffs, and concatenation all expect a final newline; more than one is noise.', severity: 'warning', fixable: true },
];

const RULE_BY_ID = new Map(RULES.map((r) => [r.id, r]));

function finding(rule: string, line: number, column: number, message: string, detail?: string): Finding {
  const meta = RULE_BY_ID.get(rule)!;
  return { rule, line, column, message, severity: meta.severity, fixable: meta.fixable, detail };
}

// ---------- raw-line scanning helpers ----------------------------------------

/** Which lines are inside fenced code blocks (0-based index → true). */
export function fencedLines(lines: string[]): boolean[] {
  const inside = new Array<boolean>(lines.length).fill(false);
  let open: { char: string; len: number } | null = null;
  for (let i = 0; i < lines.length; i++) {
    const m = /^\s{0,3}(`{3,}|~{3,})/.exec(lines[i]);
    if (open) {
      inside[i] = true;
      if (m && m[1][0] === open.char && m[1].length >= open.len && /^\s{0,3}(`{3,}|~{3,})\s*$/.test(lines[i])) open = null;
    } else if (m) {
      inside[i] = true;
      open = { char: m[1][0], len: m[1].length };
    }
  }
  return inside;
}

function frontMatterEnd(lines: string[]): number {
  if (lines[0] !== '---') return 0;
  for (let i = 1; i < lines.length; i++) if (lines[i] === '---') return i + 1;
  return 0;
}

// ---------- mdast ------------------------------------------------------------

async function parse(text: string): Promise<Root> {
  const [{ unified }, { default: remarkParse }, { default: remarkGfm }] = await Promise.all([
    import('unified'),
    import('remark-parse'),
    import('remark-gfm'),
  ]);
  return unified().use(remarkParse).use(remarkGfm).parse(text) as Root;
}

function walk(node: RootContent | Root, fn: (n: RootContent) => void): void {
  if ('children' in node) {
    for (const child of node.children as RootContent[]) {
      fn(child);
      walk(child, fn);
    }
  }
}

function headingText(node: Heading, source: string): string {
  const start = node.position?.start.offset ?? 0;
  const end = node.position?.end.offset ?? 0;
  return source
    .slice(start, end)
    .replace(/^#{1,6}\s*/, '')
    .replace(/\s*#+\s*$/, '')
    .replace(/\n[=-]+\s*$/, '')
    .trim();
}

// ---------- the linter -------------------------------------------------------

export async function lintMarkdown(text: string, options: LintOptions = {}): Promise<Finding[]> {
  const disabled = options.disabled ?? new Set<string>();
  const allowBr = options.allowHardBreakSpaces ?? true;
  const on = (id: string) => !disabled.has(id);
  const out: Finding[] = [];
  const lines = text.split('\n');
  const fenced = fencedLines(lines);
  const fmEnd = frontMatterEnd(lines);

  // --- raw line rules ---
  let blankRun = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const n = i + 1;
    if (i < fmEnd) continue;

    if (on('MD009')) {
      const m = /[ \t]+$/.exec(line);
      if (m && line.trim() !== '') {
        const count = m[0].length;
        if (!(allowBr && count === 2 && !fenced[i])) out.push(finding('MD009', n, line.length - count + 1, `${count} trailing space${count === 1 ? '' : 's'}`));
      }
    }
    if (on('MD010') && !fenced[i] && line.includes('\t')) out.push(finding('MD010', n, line.indexOf('\t') + 1, 'Hard tab character'));

    if (line.trim() === '' && !fenced[i]) {
      blankRun++;
      if (on('MD012') && blankRun === 2) out.push(finding('MD012', n, 1, 'Multiple consecutive blank lines'));
    } else blankRun = 0;

    if (fenced[i]) continue;

    if (on('MD018') && /^#{1,6}[^#\s]/.test(line)) out.push(finding('MD018', n, 1, 'No space after # in heading'));
    if (on('MD019') && /^#{1,6}\s{2,}\S/.test(line)) out.push(finding('MD019', n, 1, 'Multiple spaces after # in heading'));

    if (on('MD022') && /^#{1,6}\s+\S/.test(line)) {
      const prev = i > 0 ? lines[i - 1] : '';
      const next = i + 1 < lines.length ? lines[i + 1] : '';
      if (i > fmEnd && prev.trim() !== '') out.push(finding('MD022', n, 1, 'Heading is not preceded by a blank line', 'above'));
      if (i + 1 < lines.length && next.trim() !== '') out.push(finding('MD022', n, 1, 'Heading is not followed by a blank line', 'below'));
    }
    if (on('MD026') && /^#{1,6}\s+\S/.test(line)) {
      const title = line.replace(/^#{1,6}\s+/, '').replace(/\s*#+\s*$/, '');
      if (/[.,;:!]$/.test(title) && !/^\s*$/.test(title)) out.push(finding('MD026', n, line.length, `Trailing punctuation "${title.slice(-1)}" in heading`));
    }
  }

  // MD031 / MD040: fences
  for (let i = 0; i < lines.length; i++) {
    const m = /^\s{0,3}(`{3,}|~{3,})(.*)$/.exec(lines[i]);
    if (!m || !fenced[i]) continue;
    // An opener is the first fenced line of a run; a closer is the last one.
    const opener = i === 0 || !fenced[i - 1];
    if (opener) {
      if (on('MD040') && m[2].trim() === '') out.push(finding('MD040', i + 1, 1, 'Fenced code block without a language'));
      if (on('MD031') && i > 0 && lines[i - 1].trim() !== '' && i - 1 >= fmEnd) out.push(finding('MD031', i + 1, 1, 'Code fence is not preceded by a blank line', 'above'));
    } else if (i + 1 < lines.length && !fenced[i + 1]) {
      // closer
      if (on('MD031') && lines[i + 1].trim() !== '') out.push(finding('MD031', i + 1, 1, 'Code fence is not followed by a blank line', 'below'));
    }
  }

  // MD041 first line heading
  if (on('MD041')) {
    const first = lines.findIndex((l, idx) => idx >= fmEnd && l.trim() !== '');
    if (first !== -1 && !/^#\s+\S/.test(lines[first]) && !(lines[first + 1] && /^=+\s*$/.test(lines[first + 1])))
      out.push(finding('MD041', first + 1, 1, 'First line is not a top-level heading'));
  }

  // MD047 trailing newline
  if (on('MD047') && text.length > 0) {
    if (!text.endsWith('\n')) out.push(finding('MD047', lines.length, lines[lines.length - 1].length + 1, 'File does not end with a newline'));
    else if (text.endsWith('\n\n')) out.push(finding('MD047', lines.length, 1, 'File ends with more than one newline'));
  }

  // --- mdast rules ---
  let tree: Root | null = null;
  try {
    tree = await parse(text);
  } catch {
    tree = null;
  }
  if (tree) {
    const headings: Heading[] = [];
    let ulMarker: string | null = null;
    walk(tree, (node) => {
      if (node.type === 'heading') headings.push(node as Heading);
      if (node.type === 'list' && !(node as List).ordered) {
        for (const item of (node as List).children as ListItem[]) {
          const off = item.position?.start.offset ?? -1;
          const marker = off >= 0 ? text[off] : '';
          if (!'-*+'.includes(marker) || marker === '') continue;
          if (ulMarker === null) ulMarker = marker;
          else if (on('MD004') && marker !== ulMarker) out.push(finding('MD004', item.position!.start.line, item.position!.start.column, `List marker "${marker}" differs from "${ulMarker}" used earlier`, ulMarker));
        }
      }
      if (node.type === 'link') {
        const l = node as Link;
        const off = l.position?.start.offset ?? -1;
        const raw = off >= 0 ? text.slice(off, l.position!.end.offset) : '';
        if (on('MD042') && l.url.trim() === '' && raw.startsWith('[')) out.push(finding('MD042', l.position!.start.line, l.position!.start.column, 'Link with an empty destination'));
        if (on('MD034') && /^https?:\/\//i.test(raw) && !fenced[l.position!.start.line - 1]) out.push(finding('MD034', l.position!.start.line, l.position!.start.column, `Bare URL ${raw}`, raw));
      }
      if (node.type === 'image' && on('MD045')) {
        const img = node as Image;
        if (!img.alt || img.alt.trim() === '') out.push(finding('MD045', img.position!.start.line, img.position!.start.column, 'Image without alt text'));
      }
    });

    let prevDepth = 0;
    let h1Count = 0;
    const seen = new Map<string, number>();
    let style: 'atx' | 'setext' | null = null;
    for (const h of headings) {
      const line = h.position!.start.line;
      const off = h.position!.start.offset ?? 0;
      const isAtx = text[off] === '#';
      if (on('MD003')) {
        if (style === null) style = isAtx ? 'atx' : 'setext';
        if (!isAtx) out.push(finding('MD003', line, 1, 'Setext (underlined) heading; use # style', String(h.depth)));
        else if (style === 'setext') {
          /* the first heading was setext; we still recommend atx, so only setext ones are flagged */
        }
      }
      if (on('MD001') && prevDepth > 0 && h.depth > prevDepth + 1) out.push(finding('MD001', line, 1, `Heading level jumps from H${prevDepth} to H${h.depth}`));
      prevDepth = h.depth;
      if (h.depth === 1) {
        h1Count++;
        if (on('MD025') && h1Count > 1) out.push(finding('MD025', line, 1, 'More than one top-level H1'));
      }
      const t = headingText(h, text).toLowerCase();
      if (on('MD024')) {
        const first = seen.get(t);
        if (first !== undefined) out.push(finding('MD024', line, 1, `Duplicate heading "${headingText(h, text)}" (first on line ${first})`));
        else seen.set(t, line);
      }
    }
  }

  out.sort((a, b) => a.line - b.line || a.column - b.column || a.rule.localeCompare(b.rule));
  return out;
}

// ---------- fixers -----------------------------------------------------------

/** Apply the fix for one finding. Returns the new text (unchanged when the rule has no fixer). */
export function fixFinding(text: string, f: Finding): string {
  const lines = text.split('\n');
  const i = f.line - 1;
  if (i < 0 || i >= lines.length) return text;
  const line = lines[i];
  switch (f.rule) {
    case 'MD009':
      lines[i] = line.replace(/[ \t]+$/, '');
      break;
    case 'MD010':
      lines[i] = line.replace(/\t/g, '  ');
      break;
    case 'MD012': {
      // remove this blank line (the second in a run)
      lines.splice(i, 1);
      break;
    }
    case 'MD018':
      lines[i] = line.replace(/^(#{1,6})(\S)/, '$1 $2');
      break;
    case 'MD019':
      lines[i] = line.replace(/^(#{1,6})\s{2,}/, '$1 ');
      break;
    case 'MD022':
    case 'MD031':
      if (f.detail === 'above') lines.splice(i, 0, '');
      else lines.splice(i + 1, 0, '');
      break;
    case 'MD026':
      lines[i] = line.replace(/^(#{1,6}\s+.*?)[.,;:!]+(\s*#*\s*)$/, '$1$2');
      break;
    case 'MD034':
      if (f.detail) {
        const col = f.column - 1;
        if (line.slice(col, col + f.detail.length) === f.detail) lines[i] = line.slice(0, col) + `<${f.detail}>` + line.slice(col + f.detail.length);
        else lines[i] = line.replace(f.detail, `<${f.detail}>`);
      }
      break;
    case 'MD004':
      if (f.detail) lines[i] = line.replace(/^(\s*)[-*+](\s)/, `$1${f.detail}$2`);
      break;
    case 'MD003': {
      const under = lines[i + 1];
      if (under && /^\s{0,3}(=+|-+)\s*$/.test(under)) {
        const depth = /^\s{0,3}=+/.test(under) ? 1 : 2;
        lines[i] = `${'#'.repeat(depth)} ${line.trim()}`;
        lines.splice(i + 1, 1);
      }
      break;
    }
    case 'MD047':
      return text.replace(/\n*$/, '\n');
    default:
      return text;
  }
  return lines.join('\n');
}

/** Fix everything fixable, re-linting between passes until nothing changes. */
export async function fixAll(text: string, options: LintOptions = {}): Promise<{ text: string; fixed: number }> {
  let current = text;
  let fixed = 0;
  for (let pass = 0; pass < 6; pass++) {
    const findings = (await lintMarkdown(current, options)).filter((f) => f.fixable);
    if (!findings.length) break;
    // Apply bottom-up so earlier line numbers stay valid within a pass; only one
    // structural (line-inserting/removing) fix per line per pass.
    const touched = new Set<number>();
    let next = current;
    for (const f of [...findings].sort((a, b) => b.line - a.line || b.column - a.column)) {
      if (touched.has(f.line)) continue;
      const after = fixFinding(next, f);
      if (after !== next) {
        next = after;
        fixed++;
        touched.add(f.line);
      }
    }
    if (next === current) break;
    current = next;
  }
  return { text: current, fixed };
}

export function ruleMeta(id: string): RuleMeta | undefined {
  return RULE_BY_ID.get(id);
}
