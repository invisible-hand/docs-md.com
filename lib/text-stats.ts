// Text statistics for markdown: counts on the prose (markdown syntax, code,
// URLs and HTML removed) next to counts on the raw source, structure totals,
// reading time, word frequency, and per-section word counts.

import type { Code, Heading, Html, Image, InlineCode, Link, List, ListItem, Root, RootContent, Table, Text } from 'mdast';

export interface CountSet {
  words: number;
  chars: number;
  charsNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  uniqueWords: number;
  avgWordsPerSentence: number;
  longestSentence: number;
}

export interface Structure {
  headings: number[]; // index 1..6
  links: number;
  images: number;
  codeBlocks: number;
  codeLines: number;
  listItems: number;
  tables: number;
  tasksDone: number;
  tasksTotal: number;
}

export interface Section {
  depth: number;
  title: string;
  words: number;
}

export interface TextStats {
  prose: CountSet;
  raw: CountSet;
  structure: Structure;
  topWords: { word: string; count: number }[];
  sections: Section[];
  /** The prose text used for counting (for density lookups). */
  proseText: string;
}

export interface StatsOptions {
  includeAltText?: boolean;
  removeStopWords?: boolean;
}

const STOP = new Set(
  'a an and are as at be but by for from has have he her his i if in into is it its of on or our she so than that the their them then there these they this to was we were what when where which who will with you your not can do does did no yes up down out over under more most some such only own same too very just also how all any each few both'.split(' '),
);

export function countWords(text: string): string[] {
  return text.match(/[\p{L}\p{N}][\p{L}\p{N}'’\-]*/gu) ?? [];
}

export function countSet(text: string): CountSet {
  const words = countWords(text);
  const sentences = text
    .split(/(?<=[.!?])\s+|\n{2,}/)
    .map((s) => s.trim())
    .filter((s) => countWords(s).length > 0);
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim() !== '').length;
  const sentenceLens = sentences.map((s) => countWords(s).length);
  return {
    words: words.length,
    chars: text.length,
    charsNoSpaces: text.replace(/\s/g, '').length,
    sentences: sentences.length,
    paragraphs,
    lines: text === '' ? 0 : text.split('\n').length,
    uniqueWords: new Set(words.map((w) => w.toLowerCase())).size,
    avgWordsPerSentence: sentences.length ? Math.round((words.length / sentences.length) * 10) / 10 : 0,
    longestSentence: sentenceLens.length ? Math.max(...sentenceLens) : 0,
  };
}

async function parse(text: string): Promise<Root> {
  const [{ unified }, { default: remarkParse }, { default: remarkGfm }] = await Promise.all([
    import('unified'),
    import('remark-parse'),
    import('remark-gfm'),
  ]);
  return unified().use(remarkParse).use(remarkGfm).parse(text) as Root;
}

function stripFrontMatter(text: string): string {
  if (!text.startsWith('---\n')) return text;
  const end = text.indexOf('\n---', 4);
  if (end === -1) return text;
  return text.slice(end + 4).replace(/^\n/, '');
}

export async function computeStats(source: string, options: StatsOptions = {}): Promise<TextStats> {
  const text = stripFrontMatter(source);
  const tree = await parse(text);
  const structure: Structure = { headings: [0, 0, 0, 0, 0, 0, 0], links: 0, images: 0, codeBlocks: 0, codeLines: 0, listItems: 0, tables: 0, tasksDone: 0, tasksTotal: 0 };
  const sections: Section[] = [];
  const proseParts: string[] = [];
  let current: Section | null = null;
  let preamble = 0;

  const addWords = (s: string) => {
    const n = countWords(s).length;
    if (current) current.words += n;
    else preamble += n;
  };

  const visitInline = (node: RootContent, parts: string[]): void => {
    switch (node.type) {
      case 'text':
        parts.push((node as Text).value);
        return;
      case 'inlineCode':
        void (node as InlineCode);
        return;
      case 'image':
        structure.images++;
        if (options.includeAltText && (node as Image).alt) parts.push((node as Image).alt as string);
        return;
      case 'link': {
        structure.links++;
        const l = node as Link;
        const label = l.children.map((c) => (c.type === 'text' ? (c as Text).value : '')).join('');
        if (label === l.url || label.replace(/^mailto:/, '') === l.url.replace(/^mailto:/, '')) return; // autolink: the URL is not prose
        break;
      }
      case 'html':
        void (node as Html);
        return;
      case 'break':
        parts.push('\n');
        return;
      default:
        break;
    }
    if ('children' in node) for (const c of node.children as RootContent[]) visitInline(c, parts);
  };

  const visitBlock = (node: RootContent): void => {
    switch (node.type) {
      case 'heading': {
        const h = node as Heading;
        structure.headings[h.depth]++;
        const parts: string[] = [];
        for (const c of h.children) visitInline(c, parts);
        const title = parts.join('').trim();
        current = { depth: h.depth, title, words: 0 };
        sections.push(current);
        proseParts.push(title);
        addWords(title);
        return;
      }
      case 'code': {
        const c = node as Code;
        structure.codeBlocks++;
        structure.codeLines += c.value === '' ? 0 : c.value.split('\n').length;
        return;
      }
      case 'html':
        return;
      case 'table': {
        structure.tables++;
        const t = node as Table;
        for (const row of t.children) {
          const parts: string[] = [];
          for (const cell of row.children) for (const c of cell.children) visitInline(c, parts);
          const s = parts.join(' ');
          proseParts.push(s);
          addWords(s);
        }
        return;
      }
      case 'list': {
        const l = node as List;
        for (const item of l.children as ListItem[]) {
          structure.listItems++;
          if (item.checked !== null && item.checked !== undefined) {
            structure.tasksTotal++;
            if (item.checked) structure.tasksDone++;
          }
          for (const c of item.children) visitBlock(c);
        }
        return;
      }
      case 'paragraph': {
        const parts: string[] = [];
        for (const c of node.children) visitInline(c, parts);
        const s = parts.join('');
        proseParts.push(s);
        addWords(s);
        return;
      }
      case 'blockquote':
      case 'listItem':
      case 'footnoteDefinition':
        for (const c of (node as { children: RootContent[] }).children) visitBlock(c);
        return;
      default:
        return;
    }
  };

  for (const child of tree.children) visitBlock(child);

  const proseText = proseParts.join('\n\n');
  const words = countWords(proseText).map((w) => w.toLowerCase());
  const freq = new Map<string, number>();
  for (const w of words) {
    if (options.removeStopWords !== false && (STOP.has(w) || w.length < 2)) continue;
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }
  const topWords = [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  if (preamble > 0) sections.unshift({ depth: 0, title: '(before first heading)', words: preamble });

  return { prose: countSet(proseText), raw: countSet(source), structure, topWords, sections, proseText };
}

export function readingTime(words: number, wpm: number): string {
  if (words === 0) return '0 min';
  const minutes = words / wpm;
  if (minutes < 1) return `${Math.max(1, Math.round(minutes * 60))} sec`;
  const m = Math.floor(minutes);
  const s = Math.round((minutes - m) * 60);
  return s ? `${m} min ${s} sec` : `${m} min`;
}

/** How often a phrase occurs and what share of the words it represents. */
export function density(proseText: string, phrase: string): { count: number; percent: number } {
  const p = phrase.trim().toLowerCase();
  if (!p) return { count: 0, percent: 0 };
  const words = countWords(proseText).map((w) => w.toLowerCase());
  const pw = countWords(p).map((w) => w.toLowerCase());
  if (!pw.length || !words.length) return { count: 0, percent: 0 };
  let count = 0;
  for (let i = 0; i + pw.length <= words.length; i++) {
    let ok = true;
    for (let j = 0; j < pw.length; j++) if (words[i + j] !== pw[j]) { ok = false; break; }
    if (ok) count++;
  }
  return { count, percent: Math.round(((count * pw.length) / words.length) * 1000) / 10 };
}

export function statsAsMarkdown(s: TextStats, wpm: number): string {
  const row = (k: string, a: number | string, b: number | string) => `| ${k} | ${a} | ${b} |`;
  return [
    '| Metric | Prose | Raw source |',
    '| --- | ---: | ---: |',
    row('Words', s.prose.words, s.raw.words),
    row('Characters', s.prose.chars, s.raw.chars),
    row('Characters (no spaces)', s.prose.charsNoSpaces, s.raw.charsNoSpaces),
    row('Sentences', s.prose.sentences, s.raw.sentences),
    row('Paragraphs', s.prose.paragraphs, s.raw.paragraphs),
    row('Unique words', s.prose.uniqueWords, s.raw.uniqueWords),
    row('Reading time', readingTime(s.prose.words, wpm), readingTime(s.raw.words, wpm)),
    '',
    `Headings: ${s.structure.headings.slice(1).map((n, i) => `H${i + 1}=${n}`).join(' ')} · Links: ${s.structure.links} · Images: ${s.structure.images} · Code blocks: ${s.structure.codeBlocks} · List items: ${s.structure.listItems} · Tables: ${s.structure.tables}`,
  ].join('\n');
}
