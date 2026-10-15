// JSON ⇄ markdown table. Pure functions, no DOM, no dependencies.
//
// Forward: any JSON document that can reasonably be read as rows (an array of
// objects, an object of objects, an object of column arrays, an array of
// arrays, an array of primitives, or a single object as key/value pairs) is
// flattened into a column list plus string rows and written as a GFM table.
//
// Reverse: a GFM table is parsed back into an array of objects, optionally with
// scalar types inferred and dot-path headers expanded into nested objects.

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = { [key: string]: JsonValue };

export type Align = 'left' | 'center' | 'right';
export type ColumnOrder = 'seen' | 'alpha' | 'custom';
export type HeaderCase = 'as-is' | 'title' | 'upper' | 'lower' | 'snake';

export type Shape =
  | 'array-of-objects'
  | 'object-of-objects'
  | 'object-of-arrays'
  | 'array-of-arrays'
  | 'array-of-primitives'
  | 'single-object'
  | 'primitive'
  | 'empty';

export const SHAPE_LABEL: Record<Shape, string> = {
  'array-of-objects': 'array of objects',
  'object-of-objects': 'object of objects',
  'object-of-arrays': 'object of arrays',
  'array-of-arrays': 'array of arrays',
  'array-of-primitives': 'array of primitives',
  'single-object': 'single object',
  primitive: 'single value',
  empty: 'empty',
};

export interface JsonParseError {
  message: string;
  line: number;
  column: number;
  /** Zero-based character offset. */
  offset: number;
}

export class JsonSyntaxError extends Error {
  line: number;
  column: number;
  offset: number;
  constructor(err: JsonParseError) {
    super(`${err.message} (line ${err.line}, column ${err.column})`);
    this.name = 'JsonSyntaxError';
    this.line = err.line;
    this.column = err.column;
    this.offset = err.offset;
  }
}

export interface FlattenOptions {
  /** Nested objects are expanded into dot paths this many levels deep. 0 keeps them as JSON strings. */
  maxDepth?: number;
  /** Joiner for arrays of primitives. */
  arrayJoin?: string;
  /** Column name used for the key of an object-of-objects / the index column of an object-of-arrays. */
  keyColumn?: string;
  /** Column name for an array of primitives. */
  valueColumn?: string;
}

export interface TableOptions extends FlattenOptions {
  columnOrder?: ColumnOrder;
  /** Column names (flattened) in the wanted order; used when columnOrder is 'custom'. Unknown names are ignored; omitted columns go after, in seen order. */
  customOrder?: string[];
  /** Columns to leave out (flattened names). */
  exclude?: string[];
  /** Per-column alignment keyed by flattened name. Missing = left. */
  align?: Record<string, Align>;
  headerCase?: HeaderCase;
  /** Pad cells so the pipes line up in the source. Default true. */
  pad?: boolean;
  boldHeader?: boolean;
}

export interface Flattened {
  shape: Shape;
  /** Flattened column names in the order they were first seen. */
  columns: string[];
  /** One string per column per row; missing keys are ''. */
  rows: string[][];
  /** Source rows as objects (after flattening), for callers that want the raw cells. */
  records: Record<string, string>[];
}

export interface TableResult extends Flattened {
  /** Columns actually written, after exclusion and ordering. */
  outputColumns: string[];
  markdown: string;
}

// ---------------------------------------------------------------------------
// Parsing with positions
// ---------------------------------------------------------------------------

function lineCol(text: string, offset: number): { line: number; column: number } {
  let line = 1;
  let last = 0;
  for (let i = 0; i < offset && i < text.length; i++) {
    if (text.charCodeAt(i) === 10) {
      line++;
      last = i + 1;
    }
  }
  return { line, column: offset - last + 1 };
}

/**
 * Strict RFC 8259 parser whose only job is to say *where* a document breaks.
 * JSON.parse is used for the happy path; this runs only after it throws.
 */
function locateError(text: string): JsonParseError {
  let i = 0;
  const fail = (message: string, at = i): never => {
    const { line, column } = lineCol(text, at);
    throw new JsonSyntaxError({ message, line, column, offset: at });
  };
  const ws = () => {
    while (i < text.length) {
      const c = text[i];
      if (c === ' ' || c === '\t' || c === '\n' || c === '\r') i++;
      else break;
    }
  };
  const describe = (at: number): string => {
    if (at >= text.length) return 'end of input';
    const c = text[at];
    if (c === '\n') return 'end of line';
    return `"${c}"`;
  };
  const parseValue = (): void => {
    ws();
    if (i >= text.length) fail('Unexpected end of input, expected a value');
    const c = text[i];
    if (c === '{') return parseObject();
    if (c === '[') return parseArray();
    if (c === '"') return parseString();
    if (c === '-' || (c >= '0' && c <= '9')) return parseNumber();
    if (text.startsWith('true', i)) { i += 4; return; }
    if (text.startsWith('false', i)) { i += 5; return; }
    if (text.startsWith('null', i)) { i += 4; return; }
    if (c === "'") fail('Strings must use double quotes, not single quotes');
    if (/[A-Za-z_$]/.test(c)) {
      const m = /^[A-Za-z_$][\w$]*/.exec(text.slice(i));
      const word = m === null ? c : m[0];
      if (word === 'undefined' || word === 'NaN' || word === 'Infinity') fail(`${word} is not valid JSON`);
      fail(`Unexpected token "${word}" — keys and strings must be in double quotes`);
    }
    fail(`Unexpected ${describe(i)}, expected a value`);
  };
  const parseObject = (): void => {
    i++; // {
    ws();
    if (text[i] === '}') { i++; return; }
    for (;;) {
      ws();
      if (i >= text.length) fail('Unexpected end of input inside object, expected a key or "}"');
      if (text[i] === '}') fail('Trailing comma before "}"');
      if (text[i] !== '"') {
        if (text[i] === "'") fail('Keys must use double quotes, not single quotes');
        if (/[A-Za-z_$]/.test(text[i])) fail('Keys must be in double quotes');
        fail(`Unexpected ${describe(i)}, expected a quoted key`);
      }
      parseString();
      ws();
      if (text[i] !== ':') fail(`Expected ":" after key, found ${describe(i)}`);
      i++;
      parseValue();
      ws();
      if (text[i] === ',') { i++; continue; }
      if (text[i] === '}') { i++; return; }
      if (i >= text.length) fail('Unexpected end of input inside object, expected "," or "}"');
      fail(`Expected "," or "}" after a value, found ${describe(i)}`);
    }
  };
  const parseArray = (): void => {
    i++; // [
    ws();
    if (text[i] === ']') { i++; return; }
    for (;;) {
      ws();
      if (text[i] === ']') fail('Trailing comma before "]"');
      parseValue();
      ws();
      if (text[i] === ',') { i++; continue; }
      if (text[i] === ']') { i++; return; }
      if (i >= text.length) fail('Unexpected end of input inside array, expected "," or "]"');
      fail(`Expected "," or "]" after a value, found ${describe(i)}`);
    }
  };
  const parseString = (): void => {
    const start = i;
    i++; // opening quote
    while (i < text.length) {
      const c = text[i];
      if (c === '"') { i++; return; }
      if (c === '\\') {
        const n = text[i + 1];
        if (n === undefined) fail('Unexpected end of input inside string');
        if ('"\\/bfnrt'.includes(n)) { i += 2; continue; }
        if (n === 'u') {
          if (!/^[0-9a-fA-F]{4}$/.test(text.slice(i + 2, i + 6))) fail('Invalid \\u escape, expected 4 hex digits');
          i += 6;
          continue;
        }
        fail(`Invalid escape "\\${n}" in string`);
      }
      if (c === '\n') fail('Unterminated string (newline inside a string — use \\n)', start);
      if (c.charCodeAt(0) < 0x20) fail('Control character inside string must be escaped');
      i++;
    }
    fail('Unterminated string', start);
  };
  const parseNumber = (): void => {
    const m = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/.exec(text.slice(i));
    const len = m === null ? 0 : m[0].length;
    if (len === 0 || text.slice(i, i + len) === '-') fail('Invalid number');
    const next = text[i + len];
    if (next === '.') fail('Invalid number: a digit must follow the decimal point', i + len);
    if (next !== undefined && /[0-9A-Za-z_]/.test(next)) fail('Invalid number', i + len);
    i += len;
  };

  ws();
  if (i >= text.length) fail('Empty input: paste some JSON');
  parseValue();
  ws();
  if (i < text.length) fail(`Unexpected ${describe(i)} after the end of the document`);
  // Should be unreachable if JSON.parse threw, but keep a sane fallback.
  return { message: 'Invalid JSON', line: 1, column: 1, offset: 0 };
}

/** JSON.parse with a line/column error. Throws JsonSyntaxError. */
export function parseJson(text: string): JsonValue {
  try {
    return JSON.parse(text) as JsonValue;
  } catch {
    const err = locateError(text);
    throw new JsonSyntaxError(err);
  }
}

// ---------------------------------------------------------------------------
// Shape detection + flattening
// ---------------------------------------------------------------------------

const isObj = (v: JsonValue | undefined): v is JsonObject => typeof v === 'object' && v !== null && !Array.isArray(v);
const isPrim = (v: JsonValue | undefined): boolean => v === null || v === undefined || typeof v !== 'object';

/** `{ "data": [ {...}, ... ] }` — a single wrapper key around the real rows is unwrapped. */
export function unwrapRoot(value: JsonValue): JsonValue {
  if (isObj(value)) {
    const keys = Object.keys(value);
    if (keys.length === 1) {
      const inner = value[keys[0]];
      if (Array.isArray(inner) && inner.length > 0 && inner.every(isObj)) return inner;
    }
  }
  return value;
}

export function detectShape(value: JsonValue): Shape {
  value = unwrapRoot(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return 'empty';
    if (value.every(isObj)) return 'array-of-objects';
    if (value.every((v) => Array.isArray(v))) return 'array-of-arrays';
    if (value.every(isPrim)) return 'array-of-primitives';
    return 'array-of-objects'; // mixed: objects become rows, primitives land in a "value" column
  }
  if (isObj(value)) {
    const vals = Object.values(value);
    if (vals.length === 0) return 'empty';
    if (vals.every(isObj)) return 'object-of-objects';
    if (vals.length > 1 && vals.every((v) => Array.isArray(v))) return 'object-of-arrays';
    return 'single-object';
  }
  return 'primitive';
}

/** Scalar → cell text. null/undefined → ''. */
export function cellText(v: JsonValue | undefined, arrayJoin = ', '): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) {
    if (v.every(isPrim)) return v.map((x) => cellText(x, arrayJoin)).join(arrayJoin);
    return JSON.stringify(v);
  }
  return JSON.stringify(v);
}

/** Flatten one object into { "a.b.c": "text" } up to maxDepth levels. */
export function flattenObject(obj: JsonObject, opts: FlattenOptions = {}): Record<string, string> {
  const maxDepth = opts.maxDepth ?? 3;
  const join = opts.arrayJoin ?? ', ';
  const out: Record<string, string> = {};
  const walk = (o: JsonObject, prefix: string, depth: number) => {
    for (const [k, v] of Object.entries(o)) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (isObj(v) && depth < maxDepth && Object.keys(v).length > 0) walk(v, key, depth + 1);
      else if (isObj(v) && Object.keys(v).length === 0) out[key] = '{}';
      else out[key] = cellText(v, join);
    }
  };
  walk(obj, '', 0);
  return out;
}

/** Turn any JSON value into columns + string rows. */
export function flattenJson(value: JsonValue, opts: FlattenOptions = {}): Flattened {
  value = unwrapRoot(value);
  const shape = detectShape(value);
  const keyColumn = opts.keyColumn ?? 'key';
  const valueColumn = opts.valueColumn ?? 'value';
  const join = opts.arrayJoin ?? ', ';
  const columns: string[] = [];
  const seen = new Set<string>();
  const addCols = (rec: Record<string, string>) => {
    for (const k of Object.keys(rec)) {
      if (!seen.has(k)) {
        seen.add(k);
        columns.push(k);
      }
    }
  };
  const records: Record<string, string>[] = [];
  const push = (rec: Record<string, string>) => {
    addCols(rec);
    records.push(rec);
  };

  switch (shape) {
    case 'array-of-objects':
      for (const item of value as JsonValue[]) {
        if (isObj(item)) push(flattenObject(item, opts));
        else push({ [valueColumn]: cellText(item, join) });
      }
      break;
    case 'object-of-objects':
      for (const [k, item] of Object.entries(value as JsonObject)) {
        push({ [keyColumn]: k, ...flattenObject(item as JsonObject, opts) });
      }
      break;
    case 'object-of-arrays': {
      const entries = Object.entries(value as JsonObject) as [string, JsonValue[]][];
      const len = Math.max(...entries.map(([, arr]) => arr.length));
      for (const [k] of entries) addCols({ [k]: '' });
      for (let r = 0; r < len; r++) {
        const rec: Record<string, string> = {};
        for (const [k, arr] of entries) {
          const v = arr[r];
          rec[k] = isObj(v) ? JSON.stringify(v) : cellText(v, join);
        }
        push(rec);
      }
      break;
    }
    case 'array-of-arrays': {
      const arr = value as JsonValue[][];
      const width = Math.max(...arr.map((r) => r.length));
      const header = Array.from({ length: width }, (_, i) => `column${i + 1}`);
      for (const row of arr) {
        const rec: Record<string, string> = {};
        header.forEach((h, i) => {
          const v = row[i];
          rec[h] = isObj(v) ? JSON.stringify(v) : cellText(v, join);
        });
        push(rec);
      }
      break;
    }
    case 'array-of-primitives':
      for (const item of value as JsonValue[]) push({ [valueColumn]: cellText(item, join) });
      break;
    case 'single-object': {
      const flat = flattenObject(value as JsonObject, opts);
      for (const [k, v] of Object.entries(flat)) push({ [keyColumn]: k, [valueColumn]: v });
      break;
    }
    case 'primitive':
      push({ [valueColumn]: cellText(value, join) });
      break;
    case 'empty':
      break;
  }

  const rows = records.map((rec) => columns.map((c) => rec[c] ?? ''));
  return { shape, columns, rows, records };
}

// ---------------------------------------------------------------------------
// Markdown writer
// ---------------------------------------------------------------------------

export function applyHeaderCase(name: string, mode: HeaderCase): string {
  if (mode === 'as-is') return name;
  if (mode === 'upper') return name.toUpperCase();
  if (mode === 'lower') return name.toLowerCase();
  // split camelCase, snake_case, kebab-case and dot paths into words
  const words = name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_\-.]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (mode === 'snake') return words.map((w) => w.toLowerCase()).join('_');
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

/** Escape a cell for a GFM table: pipes become \|, newlines become <br>. */
export function escapeCell(s: string): string {
  return s.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

export function orderColumns(columns: string[], order: ColumnOrder, custom: string[] = []): string[] {
  if (order === 'alpha') return [...columns].sort((a, b) => a.localeCompare(b));
  if (order === 'custom') {
    const set = new Set(columns);
    const picked = custom.map((c) => c.trim()).filter((c) => c && set.has(c));
    const pickedSet = new Set(picked);
    return [...picked, ...columns.filter((c) => !pickedSet.has(c))];
  }
  return columns;
}

/** Visible width of a cell in a monospace editor; counts code points so emoji and CJK do not skew padding. */
const width = (s: string) => Array.from(s).length;

export function writeMarkdownTable(
  columns: string[],
  rows: string[][],
  opts: { align?: Align[]; pad?: boolean; boldHeader?: boolean } = {},
): string {
  if (columns.length === 0) return '';
  const pad = opts.pad ?? true;
  const header = columns.map((c) => {
    const e = escapeCell(c);
    return opts.boldHeader && e ? `**${e}**` : e;
  });
  const body = rows.map((r) => columns.map((_, i) => escapeCell(r[i] ?? '')));
  const widths = columns.map((_, i) => Math.max(3, width(header[i]), ...body.map((r) => width(r[i]))));
  const cell = (s: string, i: number) => {
    if (!pad) return s;
    const a = opts.align?.[i] ?? 'left';
    const gap = widths[i] - width(s);
    if (a === 'right') return ' '.repeat(gap) + s;
    if (a === 'center') return ' '.repeat(Math.floor(gap / 2)) + s + ' '.repeat(Math.ceil(gap / 2));
    return s + ' '.repeat(gap);
  };
  const sep = widths.map((w, i) => {
    const a = opts.align?.[i] ?? 'left';
    const n = pad ? w : 3;
    if (a === 'center') return `:${'-'.repeat(Math.max(1, n - 2))}:`;
    if (a === 'right') return `${'-'.repeat(Math.max(1, n - 1))}:`;
    return '-'.repeat(n);
  });
  const line = (cells: string[]) => `| ${cells.map(cell).join(' | ')} |`;
  return [line(header), `| ${sep.join(' | ')} |`, ...body.map(line)].join('\n');
}

/** Parsed JSON value → markdown table, with every option applied. */
export function jsonValueToMarkdownTable(value: JsonValue, opts: TableOptions = {}): TableResult {
  const flat = flattenJson(value, opts);
  const excluded = new Set(opts.exclude ?? []);
  const ordered = orderColumns(flat.columns, opts.columnOrder ?? 'seen', opts.customOrder).filter((c) => !excluded.has(c));
  const idx = ordered.map((c) => flat.columns.indexOf(c));
  const rows = flat.rows.map((r) => idx.map((i) => r[i] ?? ''));
  const headerCase = opts.headerCase ?? 'as-is';
  const header = ordered.map((c) => applyHeaderCase(c, headerCase));
  const align = ordered.map((c) => opts.align?.[c] ?? 'left');
  const markdown = writeMarkdownTable(header, rows, { align, pad: opts.pad, boldHeader: opts.boldHeader });
  return { ...flat, outputColumns: ordered, markdown };
}

/** JSON text → markdown table. Throws JsonSyntaxError with line/column on bad input. */
export function jsonToMarkdownTable(text: string, opts: TableOptions = {}): TableResult {
  return jsonValueToMarkdownTable(parseJson(text), opts);
}

// ---------------------------------------------------------------------------
// Reverse: markdown table → JSON
// ---------------------------------------------------------------------------

export interface ReverseOptions {
  /** "42" → 42, "true" → true, "null" and "" → null. Default true. */
  inferTypes?: boolean;
  /** "a.b" headers become nested objects. Default true. */
  unflatten?: boolean;
  /** Split "x, y" cells into arrays. Default false (only safe when you know the data). */
  splitArrays?: boolean;
}

export interface ParsedTable {
  columns: string[];
  align: Align[];
  rows: string[][];
}

function splitRow(line: string): string[] {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1);
  const cells: string[] = [];
  let cur = '';
  let inCode = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '\\' && s[i + 1] === '|') {
      cur += '|';
      i++;
    } else if (c === '`') {
      inCode = !inCode;
      cur += c;
    } else if (c === '|' && !inCode) {
      cells.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  cells.push(cur.trim());
  return cells.map((c) => c.replace(/<br\s*\/?>/gi, '\n'));
}

const SEP_RE = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;

/** First GFM table in the text → header, alignment, rows. */
export function parseMarkdownTable(md: string): ParsedTable {
  const lines = md.split(/\r?\n/).filter((l) => l.trim() !== '');
  const start = lines.findIndex((l, i) => l.includes('|') && i + 1 < lines.length && SEP_RE.test(lines[i + 1]));
  if (start === -1) return { columns: [], align: [], rows: [] };
  const columns = splitRow(lines[start]).map((c) => c.replace(/^\*\*(.*)\*\*$/, '$1'));
  const align: Align[] = splitRow(lines[start + 1]).map((c) =>
    c.startsWith(':') && c.endsWith(':') ? 'center' : c.endsWith(':') ? 'right' : 'left',
  );
  const rows: string[][] = [];
  for (let i = start + 2; i < lines.length; i++) {
    if (!lines[i].includes('|')) break;
    const cells = splitRow(lines[i]);
    rows.push(columns.map((_, j) => cells[j] ?? ''));
  }
  return { columns, align, rows };
}

const NUM_RE = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/;

export function inferScalar(s: string): JsonValue {
  const t = s.trim();
  if (t === '' || t === 'null') return null;
  if (t === 'true') return true;
  if (t === 'false') return false;
  if (NUM_RE.test(t) && Number.isFinite(Number(t)) && Math.abs(Number(t)) < Number.MAX_SAFE_INTEGER) return Number(t);
  return s;
}

function setPath(target: JsonObject, path: string, value: JsonValue): void {
  const parts = path.split('.');
  let cur: JsonObject = target;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    const next = cur[p];
    if (!isObj(next)) cur[p] = {};
    cur = cur[p] as JsonObject;
  }
  cur[parts[parts.length - 1]] = value;
}

/** Markdown table → array of objects. */
export function markdownTableToJson(md: string, opts: ReverseOptions = {}): JsonObject[] {
  const infer = opts.inferTypes ?? true;
  const unflatten = opts.unflatten ?? true;
  const { columns, rows } = parseMarkdownTable(md);
  return rows.map((cells) => {
    const obj: JsonObject = {};
    columns.forEach((col, i) => {
      const raw = cells[i] ?? '';
      let v: JsonValue;
      if (opts.splitArrays && raw.includes(', ')) v = raw.split(', ').map((x) => (infer ? inferScalar(x) : x));
      else v = infer ? inferScalar(raw) : raw;
      const key = col || `column${i + 1}`;
      if (unflatten && key.includes('.') && !/^\.|\.$|\.\./.test(key)) setPath(obj, key, v);
      else obj[key] = v;
    });
    return obj;
  });
}
