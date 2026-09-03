// Line and word diffs, dependency-free. Myers' O(ND) algorithm for lines
// (fast on multi-thousand-line inputs when the edit distance is small, which
// is the normal case for two versions of one document), and the same
// algorithm on tokens for the intra-line highlights.

export type Op = 'equal' | 'insert' | 'delete';

export interface DiffOp<T = string> {
  op: Op;
  value: T;
  /** 0-based index in A (for equal/delete). */
  a?: number;
  /** 0-based index in B (for equal/insert). */
  b?: number;
}

export interface DiffOptions {
  ignoreWhitespace?: boolean;
  ignoreCase?: boolean;
  ignoreBlankLines?: boolean;
}

function normalize(s: string, o: DiffOptions): string {
  let t = s;
  if (o.ignoreWhitespace) t = t.replace(/\s+/g, ' ').trim();
  if (o.ignoreCase) t = t.toLowerCase();
  return t;
}

/** Myers diff over two arrays of comparable keys; returns the edit script. */
export function myers<T>(a: T[], b: T[], key: (x: T) => string = String): DiffOp<T>[] {
  const n = a.length;
  const m = b.length;
  const ka = a.map(key);
  const kb = b.map(key);
  const max = n + m;
  if (max === 0) return [];
  const vs: Map<number, number>[] = [];
  let v = new Map<number, number>([[1, 0]]);
  let found = false;
  let dFinal = 0;
  outer: for (let d = 0; d <= max; d++) {
    const nv = new Map<number, number>();
    for (let k = -d; k <= d; k += 2) {
      let x: number;
      const down = k === -d || (k !== d && (v.get(k - 1) ?? -1) < (v.get(k + 1) ?? -1));
      x = down ? (v.get(k + 1) ?? 0) : (v.get(k - 1) ?? 0) + 1;
      let y = x - k;
      while (x < n && y < m && ka[x] === kb[y]) {
        x++;
        y++;
      }
      nv.set(k, x);
      if (x >= n && y >= m) {
        vs.push(nv);
        found = true;
        dFinal = d;
        break outer;
      }
    }
    vs.push(nv);
    v = nv;
  }
  if (!found) return [];
  // Backtrack
  const ops: DiffOp<T>[] = [];
  let x = n;
  let y = m;
  for (let d = dFinal; d > 0; d--) {
    const vd = vs[d];
    const vp = vs[d - 1];
    const k = x - y;
    const down = k === -d || (k !== d && (vp.get(k - 1) ?? -1) < (vp.get(k + 1) ?? -1));
    const kPrev = down ? k + 1 : k - 1;
    const xPrev = vp.get(kPrev) ?? 0;
    const yPrev = xPrev - kPrev;
    const xMid = down ? xPrev : xPrev + 1;
    const yMid = xMid - k;
    while (x > xMid && y > yMid) {
      x--;
      y--;
      ops.push({ op: 'equal', value: a[x], a: x, b: y });
    }
    if (down) {
      y--;
      ops.push({ op: 'insert', value: b[y], b: y });
    } else {
      x--;
      ops.push({ op: 'delete', value: a[x], a: x });
    }
    x = xPrev;
    y = yPrev;
    void vd;
  }
  while (x > 0 && y > 0) {
    x--;
    y--;
    ops.push({ op: 'equal', value: a[x], a: x, b: y });
  }
  ops.reverse();
  return ops;
}

export function diffLines(aText: string, bText: string, o: DiffOptions = {}): DiffOp[] {
  let a = aText.split('\n');
  let b = bText.split('\n');
  if (o.ignoreBlankLines) {
    a = a.filter((l) => l.trim() !== '');
    b = b.filter((l) => l.trim() !== '');
  }
  return myers(a, b, (s) => normalize(s, o));
}

export function tokenize(s: string): string[] {
  return s.match(/\s+|[A-Za-z0-9_]+|[^\sA-Za-z0-9_]/g) ?? [];
}

export function diffWords(a: string, b: string, o: DiffOptions = {}): DiffOp[] {
  return myers(tokenize(a), tokenize(b), (s) => normalize(s, o));
}

// ---------- side-by-side rows -------------------------------------------------

export type RowKind = 'equal' | 'insert' | 'delete' | 'change';

export interface Row {
  kind: RowKind;
  left?: string;
  right?: string;
  leftNo?: number;
  rightNo?: number;
  /** Word ops for changed rows. */
  words?: DiffOp[];
}

/** Pair up runs of deletes and inserts into "change" rows for side-by-side display. */
export function toRows(ops: DiffOp[], o: DiffOptions = {}): Row[] {
  const rows: Row[] = [];
  let i = 0;
  while (i < ops.length) {
    const op = ops[i];
    if (op.op === 'equal') {
      rows.push({ kind: 'equal', left: op.value, right: op.value, leftNo: op.a! + 1, rightNo: op.b! + 1 });
      i++;
      continue;
    }
    const dels: DiffOp[] = [];
    const ins: DiffOp[] = [];
    while (i < ops.length && ops[i].op !== 'equal') {
      if (ops[i].op === 'delete') dels.push(ops[i]);
      else ins.push(ops[i]);
      i++;
    }
    const pairs = Math.min(dels.length, ins.length);
    for (let j = 0; j < pairs; j++) {
      rows.push({
        kind: 'change',
        left: dels[j].value,
        right: ins[j].value,
        leftNo: dels[j].a! + 1,
        rightNo: ins[j].b! + 1,
        words: diffWords(dels[j].value, ins[j].value, o),
      });
    }
    for (let j = pairs; j < dels.length; j++) rows.push({ kind: 'delete', left: dels[j].value, leftNo: dels[j].a! + 1 });
    for (let j = pairs; j < ins.length; j++) rows.push({ kind: 'insert', right: ins[j].value, rightNo: ins[j].b! + 1 });
  }
  return rows;
}

// ---------- unified patch ---------------------------------------------------

export interface Hunk {
  aStart: number;
  aLen: number;
  bStart: number;
  bLen: number;
  lines: { op: Op; value: string; a?: number; b?: number }[];
}

export function toHunks(ops: DiffOp[], context = 3): Hunk[] {
  const hunks: Hunk[] = [];
  let i = 0;
  while (i < ops.length) {
    if (ops[i].op === 'equal') {
      i++;
      continue;
    }
    // start of a change; back up `context` equals
    const start = Math.max(0, i - context);
    let end = i;
    // extend end while changes are within 2*context of each other
    let j = i;
    while (j < ops.length) {
      if (ops[j].op !== 'equal') {
        end = j + 1;
        j++;
        continue;
      }
      // count equal run
      let k = j;
      while (k < ops.length && ops[k].op === 'equal') k++;
      if (k >= ops.length || k - j > context * 2) break;
      j = k;
    }
    end = Math.min(ops.length, end + context);
    const slice = ops.slice(start, end);
    const firstA = slice.find((s) => s.a !== undefined)?.a ?? 0;
    const firstB = slice.find((s) => s.b !== undefined)?.b ?? 0;
    const aLen = slice.filter((s) => s.op !== 'insert').length;
    const bLen = slice.filter((s) => s.op !== 'delete').length;
    hunks.push({ aStart: aLen ? firstA + 1 : firstA, aLen, bStart: bLen ? firstB + 1 : firstB, bLen, lines: slice.map((s) => ({ op: s.op, value: s.value, a: s.a, b: s.b })) });
    i = end;
  }
  return hunks;
}

export function toUnified(ops: DiffOp[], aName = 'a/document.md', bName = 'b/document.md', context = 3): string {
  const hunks = toHunks(ops, context);
  if (!hunks.length) return '';
  const out = [`--- ${aName}`, `+++ ${bName}`];
  for (const h of hunks) {
    out.push(`@@ -${h.aStart},${h.aLen} +${h.bStart},${h.bLen} @@`);
    for (const l of h.lines) out.push((l.op === 'equal' ? ' ' : l.op === 'insert' ? '+' : '-') + l.value);
  }
  return out.join('\n') + '\n';
}

export interface DiffStats {
  added: number;
  removed: number;
  changed: number;
  unchanged: number;
  similarity: number;
}

export function stats(rows: Row[]): DiffStats {
  let added = 0;
  let removed = 0;
  let changed = 0;
  let unchanged = 0;
  for (const r of rows) {
    if (r.kind === 'insert') added++;
    else if (r.kind === 'delete') removed++;
    else if (r.kind === 'change') changed++;
    else unchanged++;
  }
  const total = rows.length || 1;
  return { added, removed, changed, unchanged, similarity: Math.round((unchanged / total) * 1000) / 10 };
}
