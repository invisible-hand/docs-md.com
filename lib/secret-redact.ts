// Helpers for the secret scanner tool (/secret-scanner): masking, placeholders, redaction and the
// segments the page highlights. Detection is not here. It is findSecrets in agent-policy.ts, the
// scan the server applies to documents and room messages, used as it is. Pure functions, no I/O.

import { findSecrets, type SecretMatch } from './agent-policy';

/** One stretch of text to mask, highlight and replace: a match, or several matches that overlap. */
export interface SecretSpan {
  /** The kind of the match that starts first (for a tie, the first in the scanner's own order). */
  kind: string;
  /** Line of the first character, counted from 1. */
  line: number;
  start: number;
  end: number;
}

export type Segment =
  | { flagged: false; text: string; start: number; end: number }
  | { flagged: true; text: string; start: number; end: number; kind: string; line: number; index: number };

// ---------------------------------------------------------------------------
// Scanning

/**
 * findSecrets over the whole text, run on chunks that end at a line break. No pattern matches
 * across a line break, so the result equals one call on the whole text. The cost differs:
 * findSecrets numbers the line of every match by reading the text from its start, which takes
 * seconds on a log of a few megabytes with a key on every line.
 */
export function scanText(text: string, chunkChars = 8_192): SecretMatch[] {
  if (text.length <= chunkChars) return findSecrets(text);
  const found: SecretMatch[] = [];
  let offset = 0;
  let linesBefore = 0;
  while (offset < text.length) {
    const lineBreak = offset + chunkChars >= text.length ? -1 : text.indexOf('\n', offset + chunkChars);
    const end = lineBreak === -1 ? text.length : lineBreak + 1;
    const chunk = text.slice(offset, end);
    for (const m of findSecrets(chunk)) {
      found.push({ kind: m.kind, line: m.line + linesBefore, start: m.start + offset, end: m.end + offset });
    }
    for (let i = chunk.indexOf('\n'); i !== -1; i = chunk.indexOf('\n', i + 1)) linesBefore++;
    offset = end;
  }
  return found;
}

// ---------------------------------------------------------------------------
// Spans

// The scanner reports a private key by its BEGIN line alone. Replacing only that line would
// leave the key itself in the "redacted" copy, so a span that starts at such a line is extended
// over the block it opens. This finds nothing new: it only decides how far a finding reaches.
const PEM_HEADER = /^-----BEGIN [A-Z0-9 ]*PRIVATE KEY(?: BLOCK)?-----/;
const PEM_FOOTER = /-----END [A-Z0-9 ]*PRIVATE KEY(?: BLOCK)?-----/g;
/** Key material that continues on the BEGIN line: a key kept as one JSON string, base64 with "\n" escapes between its lines. */
const INLINE_BODY = /[A-Za-z0-9+/=\\]+/y;
const BODY_LINE = /^[A-Za-z0-9+/=]+$/;

/** Where a block with no END line stops: after the lines that follow the header and hold only base64. */
function unterminatedBlockEnd(text: string, from: number, limit: number): number {
  let end = from;
  INLINE_BODY.lastIndex = from;
  const inline = INLINE_BODY.exec(text);
  if (inline) end = Math.min(limit, from + inline[0].length);
  while (end < limit) {
    const lineEnd = text.indexOf('\n', end);
    if (lineEnd === -1 || lineEnd >= limit) break;
    if (text.slice(end, lineEnd).trim() !== '') break; // something else follows on this line
    const next = text.indexOf('\n', lineEnd + 1);
    const nextEnd = next === -1 || next > limit ? limit : next;
    if (!BODY_LINE.test(text.slice(lineEnd + 1, nextEnd).trim())) break;
    end = nextEnd;
  }
  return end;
}

/** Extends every span that starts at a private key BEGIN line to the end of its block. `spans` is sorted by start. */
function extendKeyBlocks(text: string, spans: SecretSpan[]): void {
  const headers = spans.filter((s) => text.startsWith('-----BEGIN ', s.start));
  if (headers.length === 0) return;
  const footers = [...text.matchAll(PEM_FOOTER)].map((m) => ({ start: m.index ?? 0, end: (m.index ?? 0) + m[0].length }));
  let f = 0;
  headers.forEach((header, i) => {
    // A block ends before the next BEGIN line, so a header quoted in prose does not swallow the text after it.
    const limit = i + 1 < headers.length ? headers[i + 1].start : text.length;
    while (f < footers.length && footers[f].start < header.end) f++;
    const footer = footers[f];
    header.end = footer && footer.end <= limit ? footer.end : unterminatedBlockEnd(text, header.end, limit);
  });
}

/**
 * The matches as spans in text order: private key blocks extended to their END line, overlapping
 * matches merged into one span. Matches that only touch stay separate.
 */
export function secretSpans(text: string, matches: readonly SecretMatch[]): SecretSpan[] {
  const clamp = (n: number) => Math.max(0, Math.min(text.length, n));
  const sorted: SecretSpan[] = matches
    .map((m) => ({ kind: m.kind, line: m.line, start: clamp(m.start), end: clamp(m.end) }))
    .filter((s) => s.end > s.start)
    .sort((a, b) => a.start - b.start);
  extendKeyBlocks(text, sorted);

  const spans: SecretSpan[] = [];
  for (const s of sorted) {
    const last = spans[spans.length - 1];
    if (last && s.start < last.end) last.end = Math.max(last.end, s.end);
    else spans.push(s);
  }
  return spans;
}

// ---------------------------------------------------------------------------
// Masking and placeholders

const DOT = '•';
const MAX_DOTS = 12;

/**
 * A value that is safe to show: its first four and last four characters with dots between them.
 * Shorter values show less (never more than half), the run of dots is capped, and a private key
 * block shows its BEGIN line, which is not secret, and none of the key.
 */
export function maskSecret(value: string): string {
  const header = PEM_HEADER.exec(value);
  if (header) return value.length > header[0].length ? `${header[0]} ${DOT.repeat(MAX_DOTS)}` : header[0];
  const keep = Math.min(4, Math.floor(value.length / 4));
  const hidden = value.length - 2 * keep;
  return value.slice(0, keep) + DOT.repeat(Math.min(hidden, MAX_DOTS)) + value.slice(value.length - keep);
}

/** Kinds that have one conventional environment variable: the placeholder is that name. */
const VARIABLE_NAMES = new Map<string, string>([
  ['Anthropic API key', 'ANTHROPIC_API_KEY'],
  ['OpenAI API key', 'OPENAI_API_KEY'],
  ['AWS access key id', 'AWS_ACCESS_KEY_ID'],
  ['Google API key', 'GOOGLE_API_KEY'],
]);

/** What a finding of this kind is replaced with: `<ANTHROPIC_API_KEY>`, or `<REDACTED: GitHub token>`. */
export function placeholderFor(kind: string): string {
  const name = VARIABLE_NAMES.get(kind);
  return name ? `<${name}>` : `<REDACTED: ${kind}>`;
}

// ---------------------------------------------------------------------------
// Redaction and highlighting

/** The text with every span replaced by its placeholder. Works from the end, so the offsets of the spans still to do stay valid. */
export function redact(text: string, matches: readonly SecretMatch[]): string {
  const spans = secretSpans(text, matches);
  const pieces: string[] = [];
  let tail = text.length;
  for (let i = spans.length - 1; i >= 0; i--) {
    pieces.push(text.slice(spans[i].end, tail), placeholderFor(spans[i].kind));
    tail = spans[i].start;
  }
  pieces.push(text.slice(0, tail));
  return pieces.reverse().join('');
}

/**
 * Scans and redacts until the scanner finds nothing. One pass is nearly always enough. A second
 * is needed when removing a finding uncovers another: the scanner passes over a long run that
 * contains a placeholder word, and the run can stop being a placeholder once part of it is replaced.
 */
export function redactAll(text: string, maxPasses = 5): string {
  let out = text;
  for (let pass = 0; pass < maxPasses; pass++) {
    const matches = scanText(out);
    if (matches.length === 0) break;
    out = redact(out, matches);
  }
  return out;
}

/** The text cut into plain and flagged segments, in order. Joined, the segments give the text back. */
export function highlightSegments(text: string, matches: readonly SecretMatch[]): Segment[] {
  const segments: Segment[] = [];
  let pos = 0;
  secretSpans(text, matches).forEach((span, index) => {
    if (span.start > pos) segments.push({ flagged: false, text: text.slice(pos, span.start), start: pos, end: span.start });
    segments.push({ flagged: true, text: text.slice(span.start, span.end), start: span.start, end: span.end, kind: span.kind, line: span.line, index });
    pos = span.end;
  });
  if (pos < text.length) segments.push({ flagged: false, text: text.slice(pos), start: pos, end: text.length });
  return segments;
}

// ---------------------------------------------------------------------------
// Sample

const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/** The same made-up characters on every call (and on the server and in the browser). */
function filler(length: number, seed: number): string {
  let out = '';
  let x = seed;
  for (let i = 0; i < length; i++) {
    x = (x * 48271) % 2147483647;
    out += ALPHANUMERIC[x % ALPHANUMERIC.length];
  }
  return out;
}

/**
 * The text the tool starts with. Its two flagged values are built here at run time from a prefix
 * and generated filler, so no file of this repository holds a string in a live key's format, and
 * they belong to no account. The other values are placeholders the scanner lets through, and a
 * connection string, which it does not detect.
 */
export function sampleText(): string {
  const anthropicKey = 'sk-ant-' + 'api03-' + filler(48, 20261124);
  const githubToken = 'gh' + 'p_' + filler(36, 4711);
  const databaseUrl = ['postgres://app', 'correct-horse-battery@db.example.com:5432/orders'].join(':');
  return [
    '# Handoff: staging worker',
    '',
    'The worker starts with `npm run worker`. This is the .env I tested with:',
    '',
    '```',
    `ANTHROPIC_API_KEY=${anthropicKey}`,
    `GITHUB_TOKEN=${githubToken}`,
    'OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE',
    `DATABASE_URL=${databaseUrl}`,
    '```',
    '',
    'Every value above is made up by this page. Lines 6 and 7 have the format of a real key,',
    'so the scanner flags them. Lines 8 and 9 are placeholders and pass. Line 10 holds a',
    'password inside a connection string, and the scanner does not detect it.',
  ].join('\n');
}
