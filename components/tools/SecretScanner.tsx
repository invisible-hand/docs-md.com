'use client';

// The secret scanner tool. Everything happens in this component, in the browser: there is no
// fetch here and no analytics call, and the text never goes into the URL. Keep it that way,
// because the page says so.

import { useDeferredValue, useMemo, useRef, useState, type MouseEvent } from 'react';
import { BTN_DARK, BTN_GHOST, BTN_PRIMARY, downloadFile, useCopy } from '@/components/tools/toolkit';
import { SECRET_KINDS } from '@/lib/agent-policy';
import { highlightSegments, maskSecret, placeholderFor, redactAll, sampleText, scanText, type Segment } from '@/lib/secret-redact';

type Finding = Extract<Segment, { flagged: true }>;

/** One line of the marked view. A finding that spans lines (a key block) sits on the line where it starts. */
interface Row {
  line: number;
  parts: Array<{ text: string; finding?: Finding }>;
}

/** Built at run time from parts (see sampleText): this file holds no string in a live key's format. */
const SAMPLE = sampleText();

const MAX_FILE_BYTES = 5 * 1024 * 1024;
/** Findings listed. The redacted copy replaces every finding, listed or not. */
const LIST_MAX = 200;
/** Up to this many lines the marked view shows the whole text; beyond it, the lines around each finding. */
const FULL_VIEW_LINES = 1500;
const MAX_ROWS = 1500;
const CONTEXT_LINES = 2;

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';
const LABEL = 'text-sm font-semibold text-gray-900';
const SMALL = 'text-xs text-gray-600';
const INLINE_CODE = 'rounded bg-gray-100 px-1 py-0.5 font-mono text-[11px] text-gray-800';

const findingId = (index: number) => `secret-scanner-finding-${index}`;
const plural = (n: number, word: string) => `${n.toLocaleString('en-US')} ${word}${n === 1 ? '' : 's'}`;

function countLineBreaks(text: string): number {
  let n = 0;
  for (let i = text.indexOf('\n'); i !== -1; i = text.indexOf('\n', i + 1)) n++;
  return n;
}

/** The segments as numbered lines, with every flagged value masked. */
function buildRows(segments: Segment[]): { rows: Row[]; lineCount: number } {
  let line = 1;
  let row: Row = { line, parts: [] };
  const rows = [row];
  for (const segment of segments) {
    if (segment.flagged) {
      row.parts.push({ text: maskSecret(segment.text), finding: segment });
      line += countLineBreaks(segment.text);
      continue;
    }
    segment.text.split('\n').forEach((piece, i) => {
      if (i > 0) {
        line++;
        row = { line, parts: [] };
        rows.push(row);
      }
      if (piece) row.parts.push({ text: piece });
    });
  }
  // A line break at the very end closes the last line. It does not start another one.
  const last = segments[segments.length - 1];
  if (rows.length > 1 && last && !last.flagged && last.text.endsWith('\n')) {
    rows.pop();
    line--;
  }
  return { rows, lineCount: line };
}

/** The rows to draw: all of them for a short text, otherwise each finding with the lines around it (null marks a gap). */
function visibleRows(rows: Row[]): { shown: Array<Row | null>; excerpt: boolean } {
  if (rows.length <= FULL_VIEW_LINES) return { shown: rows, excerpt: false };
  const shown: Array<Row | null> = [];
  let last = -1;
  for (let i = 0; i < rows.length && shown.length < MAX_ROWS; i++) {
    if (!rows[i].parts.some((part) => part.finding)) continue;
    const from = Math.max(last + 1, i - CONTEXT_LINES);
    const to = Math.min(rows.length - 1, i + CONTEXT_LINES);
    if (from > last + 1) shown.push(null);
    for (let j = from; j <= to; j++) shown.push(rows[j]);
    last = Math.max(last, to);
  }
  if (last < rows.length - 1) shown.push(null);
  return { shown, excerpt: true };
}

function summarise(findings: Finding[], lineCount: number, empty: boolean): string {
  if (empty) return 'Nothing to scan yet. Paste text or open a file.';
  if (findings.length === 0) {
    return `No known key format found in ${plural(lineCount, 'line')}. This is not proof that the text is safe to share: passwords, connection strings and personal data are not detected.`;
  }
  const named = findings.slice(0, 4).map((f) => `${f.kind} on line ${f.line}`);
  const more = findings.length - named.length;
  return `${plural(findings.length, 'finding')} in ${plural(lineCount, 'line')}: ${named.join(', ')}${more > 0 ? `, and ${more.toLocaleString('en-US')} more` : ''}.`;
}

function redactedName(fileName: string | null): string {
  if (!fileName) return 'redacted.txt';
  const dot = fileName.lastIndexOf('.');
  return dot > 0 ? `${fileName.slice(0, dot)}.redacted${fileName.slice(dot)}` : `${fileName}.redacted.txt`;
}

function Icon({ name, className = 'h-4 w-4' }: { name: 'warning' | 'info' | 'key'; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      {name === 'warning' ? (
        <>
          <path d="M12 4 2.5 20h19L12 4z" />
          <path d="M12 10v4.5M12 17.5h.01" />
        </>
      ) : name === 'info' ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5.5M12 7.5h.01" />
        </>
      ) : (
        <>
          <circle cx="8" cy="15.5" r="4.5" />
          <path d="m11.5 12.5 8-8M16 8l2.5 2.5M13.5 10.5 15 12" />
        </>
      )}
    </svg>
  );
}

export default function SecretScanner() {
  const [text, setText] = useState(SAMPLE);
  const [fileName, setFileName] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showRedacted, setShowRedacted] = useState(false);
  const [copied, copy] = useCopy();
  const fileInput = useRef<HTMLInputElement>(null);

  // Everything below is derived from the text. The deferred value keeps typing responsive on a long paste.
  const scanned = useDeferredValue(text);
  const segments = useMemo(() => highlightSegments(scanned, scanText(scanned)), [scanned]);
  const findings = useMemo(() => segments.filter((s): s is Finding => s.flagged), [segments]);
  const { rows, lineCount } = useMemo(() => buildRows(segments), [segments]);
  const view = useMemo(() => visibleRows(rows), [rows]);
  const hasFindings = findings.length > 0;
  const redacted = useMemo(() => (showRedacted && hasFindings ? redactAll(scanned) : ''), [showRedacted, hasFindings, scanned]);
  const leftInCopy = useMemo(() => (redacted ? scanText(redacted).length : 0), [redacted]);

  const load = (next: string, name: string | null) => {
    setText(next);
    setFileName(name);
    setNotice(null);
    setShowRedacted(false);
  };

  const openFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setNotice(`${file.name} is larger than 5 MB. Open a smaller file, or paste the part you mean to share.`);
      return;
    }
    file.text().then(
      (content) => {
        if (content.includes('\u0000')) setNotice(`${file.name} does not look like a text file.`);
        else load(content, file.name);
      },
      () => setNotice(`${file.name} could not be read.`),
    );
  };

  const jumpTo = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    const mark = document.getElementById(findingId(index));
    if (!mark) return;
    event.preventDefault();
    mark.scrollIntoView({ block: 'center' });
    mark.focus({ preventScroll: true });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div>
          <div className="mb-2 flex min-h-8 flex-wrap items-center justify-between gap-2">
            <label htmlFor="secret-scanner-text" className={LABEL}>
              Text to scan
            </label>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={`${BTN_GHOST} ${FOCUS}`} onClick={() => fileInput.current?.click()}>
                Open a file
              </button>
              <input
                ref={fileInput}
                type="file"
                className="hidden"
                onChange={(e) => {
                  openFile(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
              <button type="button" className={`${BTN_GHOST} ${FOCUS}`} onClick={() => load(SAMPLE, null)}>
                Load the sample
              </button>
              <button type="button" className={`${BTN_GHOST} ${FOCUS}`} onClick={() => load('', null)} disabled={text === ''}>
                Clear
              </button>
            </div>
          </div>
          <textarea
            id="secret-scanner-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onDragOver={(e) => {
              if (e.dataTransfer.types.includes('Files')) e.preventDefault();
            }}
            onDrop={(e) => {
              const file = e.dataTransfer.files?.[0];
              if (!file) return; // dragged text: the browser inserts it
              e.preventDefault();
              openFile(file);
            }}
            aria-describedby="secret-scanner-privacy"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            className={`block h-[420px] w-full resize-y rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 font-mono text-sm leading-6 text-gray-950 ${FOCUS}`}
          />
          <p id="secret-scanner-privacy" className={`mt-2 ${SMALL}`}>
            Runs in your browser. The text is not uploaded: this page makes no network request with it.
            {fileName ? ` Open file: ${fileName}.` : ''}
          </p>
          {notice ? (
            <p role="alert" className="mt-2 flex items-start gap-2 text-sm text-red-800">
              <Icon name="warning" className="mt-0.5 h-4 w-4" />
              {notice}
            </p>
          ) : null}
        </div>

        <div>
          <div className="mb-2 flex min-h-8 items-center">
            <p className={LABEL}>Findings{hasFindings ? ` (${findings.length.toLocaleString('en-US')})` : ''}</p>
          </div>
          <div
            role="status"
            className={`flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm ${
              hasFindings ? 'border-red-300 bg-red-50 text-red-950' : 'border-gray-200 bg-gray-50 text-gray-700'
            }`}
          >
            <Icon name={hasFindings ? 'warning' : 'info'} className="mt-0.5 h-4 w-4" />
            <p>{summarise(findings, lineCount, scanned.trim() === '')}</p>
          </div>
          {hasFindings ? (
            <ol className="mt-3 max-h-[340px] divide-y divide-gray-100 overflow-auto rounded-2xl border border-gray-200 bg-white">
              {findings.slice(0, LIST_MAX).map((f) => {
                const lines = countLineBreaks(f.text) + 1;
                return (
                  <li key={f.index} className="flex items-start gap-3 px-4 py-3">
                    <span className="mt-0.5 min-w-6 rounded bg-red-700 px-1.5 py-0.5 text-center text-[11px] font-semibold text-white">
                      {f.index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                        <Icon name="key" className="h-3.5 w-3.5 text-red-700" />
                        {f.kind}
                      </p>
                      <p className="mt-1 break-all font-mono text-xs text-gray-800">{maskSecret(f.text)}</p>
                      <p className={`mt-1 ${SMALL}`}>
                        {plural(f.text.length, 'character')}
                        {lines > 1 ? ` on ${lines} lines` : ''}. Becomes <code className={INLINE_CODE}>{placeholderFor(f.kind)}</code>
                      </p>
                    </div>
                    <a
                      href={`#${findingId(f.index)}`}
                      onClick={(e) => jumpTo(e, f.index)}
                      className={`shrink-0 rounded text-xs font-medium text-indigo-700 underline ${FOCUS}`}
                    >
                      Line {f.line}
                      <span className="sr-only">: go to finding {f.index + 1} in the text</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          ) : null}
          {findings.length > LIST_MAX ? (
            <p className={`mt-2 ${SMALL}`}>
              The first {LIST_MAX} of {findings.length.toLocaleString('en-US')} findings are listed. The redacted copy replaces all of them.
            </p>
          ) : null}
        </div>
      </div>

      {hasFindings ? (
        <div>
          <p id="secret-scanner-view" className={LABEL}>
            Your text with the findings marked
          </p>
          <p className={`mb-2 mt-1 ${SMALL}`}>
            Flagged values are masked here too. The rest of the text is shown as it is.
            {view.excerpt ? ' The text is long, so only the lines around each finding are shown.' : ''}
          </p>
          <div
            role="region"
            aria-labelledby="secret-scanner-view"
            tabIndex={0}
            className={`max-h-[420px] overflow-auto rounded-2xl border border-gray-200 bg-white py-2 font-mono text-sm leading-6 ${FOCUS}`}
          >
            {view.shown.map((row, i) =>
              row ? (
                <div key={row.line} className="flex">
                  <span aria-hidden="true" className="w-14 shrink-0 select-none border-r border-gray-200 pr-2 text-right text-xs leading-6 text-gray-500">
                    {row.line}
                  </span>
                  <span className="min-w-0 flex-1 whitespace-pre-wrap break-all px-3 text-gray-800">
                    {row.parts.map((part, j) =>
                      part.finding ? (
                        <mark
                          key={j}
                          id={findingId(part.finding.index)}
                          tabIndex={-1}
                          className="rounded border border-red-400 bg-red-100 px-1 py-0.5 text-red-950 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600"
                        >
                          <span className="sr-only">
                            Finding {part.finding.index + 1}, {part.finding.kind}:{' '}
                          </span>
                          <span aria-hidden="true" className="mr-1.5 rounded bg-red-700 px-1 text-[11px] font-semibold text-white">
                            {part.finding.index + 1}
                          </span>
                          {part.text}
                        </mark>
                      ) : (
                        part.text
                      ),
                    )}
                  </span>
                </div>
              ) : (
                <div key={`gap-${i}`} aria-hidden="true" className="flex text-gray-400">
                  <span className="w-14 shrink-0 select-none border-r border-gray-200 pr-2 text-right">⋮</span>
                </div>
              ),
            )}
          </div>
        </div>
      ) : null}

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className={`${BTN_PRIMARY} ${FOCUS}`}
            aria-expanded={showRedacted && hasFindings}
            aria-controls="secret-scanner-redacted"
            disabled={!hasFindings}
            onClick={() => setShowRedacted((shown) => !shown)}
          >
            {showRedacted && hasFindings ? 'Hide the redacted copy' : 'Make a redacted copy'}
          </button>
          <p className={SMALL}>
            {hasFindings
              ? `Replaces each finding with a placeholder such as ${placeholderFor(findings[0].kind)}. Your text above is not changed.`
              : 'There is no finding to replace.'}
          </p>
        </div>
        {showRedacted && hasFindings ? (
          <div id="secret-scanner-redacted" className="mt-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="secret-scanner-redacted-text" className={LABEL}>
                Redacted copy
              </label>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={`${BTN_DARK} ${FOCUS}`} onClick={() => copy(redacted)}>
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
                <button type="button" className={`${BTN_GHOST} ${FOCUS}`} onClick={() => downloadFile(redactedName(fileName), redacted)}>
                  Download
                </button>
              </div>
            </div>
            <textarea
              id="secret-scanner-redacted-text"
              readOnly
              value={redacted}
              aria-describedby="secret-scanner-redacted-note"
              spellCheck={false}
              className={`block h-[320px] w-full resize-y rounded-2xl border border-gray-300 bg-white px-4 py-3 font-mono text-sm leading-6 text-gray-950 ${FOCUS}`}
            />
            <p id="secret-scanner-redacted-note" className={`mt-2 ${SMALL}`}>
              {leftInCopy === 0
                ? 'The scanner finds nothing in this copy. That is not proof that it is safe to share: read it before you send it.'
                : `The scanner still finds ${plural(leftInCopy, 'value')} in this copy. Do not share it.`}
            </p>
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-700 md:grid-cols-2">
        <div>
          <p className={LABEL}>What it recognises</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {SECRET_KINDS.map((kind) => (
              <li key={kind} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-800">
                {kind}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={LABEL}>What it does not recognise</p>
          <p className="mt-3">
            Passwords, connection strings and personal data. Keys in a format that is not in the list. Obvious placeholders, such as{' '}
            <code className={INLINE_CODE}>sk-ant-xxxxxxxx</code> or a value that contains <code className={INLINE_CODE}>EXAMPLE</code>, are
            let through. A result with no findings does not prove that the text is safe to share.
          </p>
        </div>
      </div>
    </div>
  );
}
