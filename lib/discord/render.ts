// A small parser for Discord's message markdown, used to preview what a message looks like in
// the Discord client. It covers what Discord documents in "Markdown Text 101": bold, italic,
// underline, strikethrough, spoilers, inline code, code blocks (including ```ansi colours),
// headers (#, ##, ###), subtext (-#), block quotes (> and >>>), lists, masked links and
// <t:unix:STYLE> timestamps. It is a preview, not Discord's own parser: edge cases may differ.

export type Inline =
  | { kind: 'text'; text: string }
  | { kind: 'bold' | 'italic' | 'underline' | 'strike' | 'spoiler'; children: Inline[] }
  | { kind: 'code'; text: string }
  | { kind: 'link'; href: string; children: Inline[] }
  | { kind: 'url'; href: string }
  | { kind: 'timestamp'; unix: number; style: string; raw: string };

export type Block =
  | { kind: 'paragraph'; inline: Inline[] }
  | { kind: 'header'; level: 1 | 2 | 3; inline: Inline[] }
  | { kind: 'subtext'; inline: Inline[] }
  | { kind: 'codeblock'; lang: string; text: string }
  | { kind: 'quote'; blocks: Block[] }
  | { kind: 'list'; ordered: boolean; start: number; items: { depth: number; inline: Inline[] }[] };

const PAIRED: Array<{ marker: string; kind: 'bold' | 'italic' | 'underline' | 'strike' | 'spoiler' }> = [
  { marker: '**', kind: 'bold' },
  { marker: '__', kind: 'underline' },
  { marker: '~~', kind: 'strike' },
  { marker: '||', kind: 'spoiler' },
  { marker: '*', kind: 'italic' },
  { marker: '_', kind: 'italic' },
];

const TIMESTAMP = /^<t:(-?\d{1,13})(?::([tTdDfFsSR]))?>/;
const MASKED = /^\[([^\]\n]+)\]\(<?(https?:\/\/[^\s)>]+)>?\)/;
const BARE_URL = /^<?(https?:\/\/[^\s<>]+[^\s<>.,:;"')\]])>?/;
const ESCAPABLE = '\\*_~`|>#-[]()<:@';

/** Parses inline markdown. `depth` stops runaway recursion on hostile input. */
export function parseInline(src: string, depth = 0): Inline[] {
  const out: Inline[] = [];
  let buf = '';
  const flush = () => {
    if (buf) out.push({ kind: 'text', text: buf });
    buf = '';
  };
  let i = 0;
  while (i < src.length) {
    const rest = src.slice(i);
    const c = src[i];

    if (c === '\\' && i + 1 < src.length && ESCAPABLE.includes(src[i + 1])) {
      buf += src[i + 1];
      i += 2;
      continue;
    }
    if (c === '`') {
      const ticks = rest.startsWith('``') ? '``' : '`';
      const end = src.indexOf(ticks, i + ticks.length);
      if (end > i + ticks.length - 1) {
        flush();
        out.push({ kind: 'code', text: src.slice(i + ticks.length, end).trim() || src.slice(i + ticks.length, end) });
        i = end + ticks.length;
        continue;
      }
    }
    if (c === '<') {
      const ts = TIMESTAMP.exec(rest);
      if (ts) {
        flush();
        out.push({ kind: 'timestamp', unix: Number(ts[1]), style: ts[2] ?? 'f', raw: ts[0] });
        i += ts[0].length;
        continue;
      }
    }
    if (c === '[') {
      const m = MASKED.exec(rest);
      if (m) {
        flush();
        out.push({ kind: 'link', href: m[2], children: depth < 8 ? parseInline(m[1], depth + 1) : [{ kind: 'text', text: m[1] }] });
        i += m[0].length;
        continue;
      }
    }
    if (c === 'h' || c === '<') {
      const m = BARE_URL.exec(rest);
      if (m && (c === '<' || /^https?:\/\//.test(rest))) {
        flush();
        out.push({ kind: 'url', href: m[1] });
        i += m[0].length;
        continue;
      }
    }
    // ***text*** is bold and italic at once; handle it before the paired markers split it wrongly.
    if (depth < 8 && rest.startsWith('***') && !/^\s/.test(src.slice(i + 3))) {
      const end = src.indexOf('***', i + 3);
      if (end > i + 3 && !/\s/.test(src[end - 1])) {
        flush();
        out.push({ kind: 'bold', children: [{ kind: 'italic', children: parseInline(src.slice(i + 3, end), depth + 2) }] });
        i = end + 3;
        continue;
      }
    }
    let matched = false;
    if (depth < 8) {
      for (const p of PAIRED) {
        if (!rest.startsWith(p.marker)) continue;
        const inner = src.slice(i + p.marker.length);
        if (!inner || /^\s/.test(inner)) continue;
        // Single * or _ must not be the first half of ** or __.
        if (p.marker.length === 1 && rest.startsWith(p.marker + p.marker)) continue;
        const end = findClose(inner, p.marker);
        if (end > 0) {
          flush();
          out.push({ kind: p.kind, children: parseInline(inner.slice(0, end), depth + 1) });
          i += p.marker.length + end + p.marker.length;
          matched = true;
          break;
        }
      }
    }
    if (matched) continue;
    buf += c;
    i++;
  }
  flush();
  return out;
}

/** Index of the closing marker in `s`, skipping escapes and inline code; -1 if none. */
function findClose(s: string, marker: string): number {
  for (let j = 0; j < s.length; j++) {
    if (s[j] === '\\') {
      j++;
      continue;
    }
    if (s[j] === '`') {
      const end = s.indexOf('`', j + 1);
      if (end > j) {
        j = end;
        continue;
      }
    }
    if (s.startsWith(marker, j) && !/\s/.test(s[j - 1] ?? '')) {
      if (marker.length === 1 && s.startsWith(marker + marker, j)) {
        j++;
        continue;
      }
      return j;
    }
  }
  return -1;
}

/** Parses a whole message into blocks. */
export function parseMessage(src: string): Block[] {
  const lines = src.replace(/\r\n?/g, '\n').split('\n');
  const blocks: Block[] = [];
  let para: string[] = [];
  const flushPara = () => {
    if (para.length) blocks.push({ kind: 'paragraph', inline: parseInline(para.join('\n')) });
    para = [];
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fence = /^```([\w+-]*)\s*$/.exec(line) ?? /^```([\w+-]*)\s*(.*)$/.exec(line);
    if (line.startsWith('```')) {
      flushPara();
      const lang = fence?.[1] ?? '';
      const body: string[] = [];
      const firstRest = fence?.[2];
      if (firstRest && firstRest.endsWith('```')) {
        blocks.push({ kind: 'codeblock', lang: '', text: line.slice(3, -3) });
        continue;
      }
      let j = i + 1;
      while (j < lines.length && !lines[j].startsWith('```')) body.push(lines[j++]);
      blocks.push({ kind: 'codeblock', lang, text: body.join('\n') });
      i = j;
      continue;
    }
    if (line.startsWith('>>> ')) {
      flushPara();
      const rest = [line.slice(4), ...lines.slice(i + 1)].join('\n');
      blocks.push({ kind: 'quote', blocks: parseMessage(rest) });
      break;
    }
    if (line.startsWith('> ')) {
      flushPara();
      const quoted: string[] = [];
      let j = i;
      while (j < lines.length && lines[j].startsWith('> ')) quoted.push(lines[j++].slice(2));
      blocks.push({ kind: 'quote', blocks: parseMessage(quoted.join('\n')) });
      i = j - 1;
      continue;
    }
    const h = /^(#{1,3}) (.+)$/.exec(line);
    if (h) {
      flushPara();
      blocks.push({ kind: 'header', level: h[1].length as 1 | 2 | 3, inline: parseInline(h[2]) });
      continue;
    }
    const sub = /^-# (.+)$/.exec(line);
    if (sub) {
      flushPara();
      blocks.push({ kind: 'subtext', inline: parseInline(sub[1]) });
      continue;
    }
    const li = /^( *)([-*]|(\d+)\.) (.+)$/.exec(line);
    if (li) {
      flushPara();
      const ordered = Boolean(li[3]);
      const items: { depth: number; inline: Inline[] }[] = [];
      const start = ordered ? Number(li[3]) : 1;
      let j = i;
      while (j < lines.length) {
        const m = /^( *)([-*]|(\d+)\.) (.+)$/.exec(lines[j]);
        if (!m || Boolean(m[3]) !== ordered) break;
        items.push({ depth: Math.min(2, Math.floor(m[1].length / 2)), inline: parseInline(m[4]) });
        j++;
      }
      blocks.push({ kind: 'list', ordered, start, items });
      i = j - 1;
      continue;
    }
    if (line.trim() === '') {
      flushPara();
      continue;
    }
    para.push(line);
  }
  flushPara();
  return blocks;
}

// ── ANSI (```ansi code blocks) ────────────────────────────────────────────────

/** Colours Discord's desktop client uses for ANSI codes in ```ansi blocks (foreground 30–37, background 40–47). */
export const ANSI_FG: Record<number, { name: string; hex: string }> = {
  30: { name: 'Gray', hex: '#4f545c' },
  31: { name: 'Red', hex: '#dc322f' },
  32: { name: 'Green', hex: '#859900' },
  33: { name: 'Yellow', hex: '#b58900' },
  34: { name: 'Blue', hex: '#268bd2' },
  35: { name: 'Pink', hex: '#d33682' },
  36: { name: 'Cyan', hex: '#2aa198' },
  37: { name: 'White', hex: '#ffffff' },
};
export const ANSI_BG: Record<number, { name: string; hex: string }> = {
  40: { name: 'Dark blue', hex: '#002b36' },
  41: { name: 'Orange', hex: '#cb4b16' },
  42: { name: 'Slate', hex: '#586e75' },
  43: { name: 'Gray teal', hex: '#657b83' },
  44: { name: 'Gray', hex: '#839496' },
  45: { name: 'Indigo', hex: '#6c71c4' },
  46: { name: 'Light gray', hex: '#93a1a1' },
  47: { name: 'Cream', hex: '#fdf6e3' },
};

export type AnsiSpan = { text: string; fg?: string; bg?: string; bold: boolean; underline: boolean };

/** Splits ```ansi text on ESC[...m sequences into styled spans. Accepts a real ESC or the literal "\u001b". */
export function parseAnsi(text: string): AnsiSpan[] {
  const src = text.replace(/\\u001b|\\x1b|\\e/g, '\u001b');
  const spans: AnsiSpan[] = [];
  let state = { fg: undefined as string | undefined, bg: undefined as string | undefined, bold: false, underline: false };
  const re = /\u001b\[([\d;]*)m/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m.index > last) spans.push({ text: src.slice(last, m.index), ...state });
    for (const code of (m[1] || '0').split(';').map(Number)) {
      if (code === 0) state = { fg: undefined, bg: undefined, bold: false, underline: false };
      else if (code === 1) state = { ...state, bold: true };
      else if (code === 4) state = { ...state, underline: true };
      else if (ANSI_FG[code]) state = { ...state, fg: ANSI_FG[code].hex };
      else if (ANSI_BG[code]) state = { ...state, bg: ANSI_BG[code].hex };
    }
    last = re.lastIndex;
  }
  if (last < src.length) spans.push({ text: src.slice(last), ...state });
  return spans;
}

// ── Timestamps ────────────────────────────────────────────────────────────────

/** Discord's timestamp styles as its developer reference lists them (docs.discord.com/developers/reference, "Timestamp Styles"). */
export const TIMESTAMP_STYLES: Array<{ style: string; name: string }> = [
  { style: 't', name: 'Short time' },
  { style: 'T', name: 'Medium time' },
  { style: 'd', name: 'Short date' },
  { style: 'D', name: 'Long date' },
  { style: 'f', name: 'Long date, short time (default)' },
  { style: 'F', name: 'Full date, short time' },
  { style: 's', name: 'Short date, short time' },
  { style: 'S', name: 'Short date, medium time' },
  { style: 'R', name: 'Relative time' },
];

/** Formats a unix time the way a Discord timestamp style reads in `locale`. The client may differ in punctuation. */
export function formatTimestamp(unix: number, style: string, locale = 'en-US', now = Date.now(), timeZone?: string): string {
  const d = new Date(unix * 1000);
  const opt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { ...o, timeZone }).format(d);
  const shortDate: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  switch (style) {
    case 't':
      return opt({ timeStyle: 'short' });
    case 'T':
      return opt({ timeStyle: 'medium' });
    case 'd':
      return opt(shortDate);
    case 'D':
      return opt({ dateStyle: 'long' });
    case 'F':
      return opt({ dateStyle: 'full', timeStyle: 'short' });
    case 's':
      return opt({ ...shortDate, hour: 'numeric', minute: '2-digit' });
    case 'S':
      return opt({ ...shortDate, hour: 'numeric', minute: '2-digit', second: '2-digit' });
    case 'R':
      return relativeTime(unix * 1000 - now, locale);
    case 'f':
    default:
      return opt({ dateStyle: 'long', timeStyle: 'short' });
  }
}

function relativeTime(diffMs: number, locale: string): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'always' });
  const s = Math.round(diffMs / 1000);
  const abs = Math.abs(s);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];
  for (const [unit, size] of units) {
    if (abs >= size || unit === 'second') return rtf.format(Math.round(s / size), unit);
  }
  return rtf.format(0, 'second');
}
