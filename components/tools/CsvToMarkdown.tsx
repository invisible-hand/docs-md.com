'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { BTN_DARK, BTN_GHOST, BTN_PRIMARY, downloadFile, useCopy } from '@/components/tools/toolkit';

const STARTER_CSV = `Name,Role,Location,Start date
"Ada Lovelace",Engineer,London,"2024-01-15"
"Grace Hopper","Rear Admiral, USN",Arlington,"2023-11-02"
Linus Torvalds,Maintainer,Portland,2022-06-30`;

const STARTER_MD = `| Name           | Role              | Location  |
| :------------- | :---------------: | --------: |
| Ada Lovelace   | Engineer          | London    |
| Grace Hopper   | Rear Admiral, USN | Arlington |
| Linus Torvalds | Maintainer \\| BDFL | Portland  |`;

type Align = 'left' | 'center' | 'right';
type Delim = 'auto' | ',' | '\t' | ';' | '|';

const LABEL = 'text-xs font-semibold uppercase tracking-wide text-gray-500';
const SELECT = 'rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 focus:border-indigo-400 focus:outline-none';

/** RFC-4180 parser: quoted fields, doubled quotes, newlines inside quotes, CRLF. */
function parseDelimited(text: string, delim: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }
    if (c === '"' && field === '') {
      inQuotes = true;
    } else if (c === delim) {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

function detectDelimiter(text: string): ',' | '\t' | ';' | '|' {
  const sample = text.split(/\r?\n/).slice(0, 10).join('\n');
  const candidates: (',' | '\t' | ';' | '|')[] = ['\t', ',', ';', '|'];
  let best: ',' | '\t' | ';' | '|' = ',';
  let bestScore = -1;
  for (const d of candidates) {
    const count = sample.split(d).length - 1;
    if (count > bestScore) {
      bestScore = count;
      best = d;
    }
  }
  return best;
}

function toMarkdownTable(
  rows: string[][],
  opts: { header: boolean; align: Align[]; pad: boolean; trim: boolean; boldHeader: boolean },
): string {
  if (rows.length === 0) return '';
  const width = Math.max(...rows.map((r) => r.length));
  const norm = rows.map((r) => Array.from({ length: width }, (_, i) => (r[i] ?? '')));
  const clean = (s: string) => (opts.trim ? s.trim() : s).replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
  const header = opts.header ? norm[0].map(clean) : Array.from({ length: width }, (_, i) => `Column ${i + 1}`);
  const body = (opts.header ? norm.slice(1) : norm).map((r) => r.map(clean));
  const headerCells = opts.boldHeader ? header.map((h) => (h ? `**${h}**` : h)) : header;
  const widths = Array.from({ length: width }, (_, i) =>
    Math.max(3, headerCells[i].length, ...body.map((r) => r[i].length)),
  );
  const cell = (s: string, i: number) => {
    if (!opts.pad) return s;
    const a = opts.align[i] ?? 'left';
    const gap = widths[i] - s.length;
    if (a === 'right') return ' '.repeat(gap) + s;
    if (a === 'center') return ' '.repeat(Math.floor(gap / 2)) + s + ' '.repeat(Math.ceil(gap / 2));
    return s + ' '.repeat(gap);
  };
  const sep = widths.map((w, i) => {
    const a = opts.align[i] ?? 'left';
    const n = opts.pad ? w : 3;
    if (a === 'center') return `:${'-'.repeat(Math.max(1, n - 2))}:`;
    if (a === 'right') return `${'-'.repeat(Math.max(1, n - 1))}:`;
    return `:${'-'.repeat(Math.max(1, n - 1))}`;
  });
  const line = (cells: string[]) => `| ${cells.map(cell).join(' | ')} |`;
  return [line(headerCells), `| ${sep.join(' | ')} |`, ...body.map(line)].join('\n');
}

/** Parse a GFM table (first table found) into rows; handles escaped pipes and optional outer pipes. */
function parseMarkdownTable(md: string): { rows: string[][]; align: Align[] } {
  const lines = md.split(/\r?\n/).filter((l) => l.trim() !== '');
  const splitRow = (line: string): string[] => {
    let s = line.trim();
    if (s.startsWith('|')) s = s.slice(1);
    if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1);
    const cells: string[] = [];
    let cur = '';
    for (let i = 0; i < s.length; i++) {
      if (s[i] === '\\' && s[i + 1] === '|') {
        cur += '|';
        i++;
      } else if (s[i] === '|') {
        cells.push(cur.trim());
        cur = '';
      } else {
        cur += s[i];
      }
    }
    cells.push(cur.trim());
    return cells.map((c) => c.replace(/<br\s*\/?>/gi, '\n'));
  };
  const isSep = (line: string) => /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)*\|?\s*$/.test(line);
  const start = lines.findIndex((l, i) => l.includes('|') && i + 1 < lines.length && isSep(lines[i + 1]));
  if (start === -1) {
    return { rows: lines.filter((l) => l.includes('|')).map(splitRow), align: [] };
  }
  const header = splitRow(lines[start]);
  const align: Align[] = splitRow(lines[start + 1]).map((c) =>
    c.startsWith(':') && c.endsWith(':') ? 'center' : c.endsWith(':') ? 'right' : 'left',
  );
  const body: string[][] = [];
  for (let i = start + 2; i < lines.length; i++) {
    if (!lines[i].includes('|')) break;
    body.push(splitRow(lines[i]));
  }
  return { rows: [header, ...body], align };
}

function toDelimited(rows: string[][], delim: string): string {
  const q = (s: string) => {
    const needs = s.includes(delim) || s.includes('"') || /[\r\n]/.test(s);
    return needs ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return rows.map((r) => r.map(q).join(delim)).join('\n');
}

const DELIM_LABEL: Record<string, string> = { ',': 'Comma', '\t': 'Tab', ';': 'Semicolon', '|': 'Pipe' };

export default function CsvToMarkdown() {
  const [dir, setDir] = useState<'csv2md' | 'md2csv'>('csv2md');
  const [csv, setCsv] = useState(STARTER_CSV);
  const [md, setMd] = useState(STARTER_MD);
  const [delim, setDelim] = useState<Delim>('auto');
  const [outDelim, setOutDelim] = useState<',' | '\t' | ';'>(',');
  const [header, setHeader] = useState(true);
  const [pad, setPad] = useState(true);
  const [trim, setTrim] = useState(true);
  const [boldHeader, setBoldHeader] = useState(false);
  const [align, setAlign] = useState<Align[]>([]);
  const [view, setView] = useState<'markdown' | 'preview'>('markdown');
  const [dragging, setDragging] = useState(false);
  const [fileNote, setFileNote] = useState('');
  const [copied, copy] = useCopy();
  const fileInput = useRef<HTMLInputElement>(null);

  const detected = useMemo(() => detectDelimiter(csv), [csv]);
  const activeDelim = delim === 'auto' ? detected : delim;
  const rows = useMemo(() => parseDelimited(csv, activeDelim), [csv, activeDelim]);
  const columnCount = rows.length ? Math.max(...rows.map((r) => r.length)) : 0;
  const headerLabels = useMemo(
    () =>
      Array.from({ length: columnCount }, (_, i) =>
        header && rows[0]?.[i]?.trim() ? rows[0][i].trim() : `Column ${i + 1}`,
      ),
    [rows, header, columnCount],
  );

  const markdownOut = useMemo(
    () => toMarkdownTable(rows, { header, align, pad, trim, boldHeader }),
    [rows, header, align, pad, trim, boldHeader],
  );

  const parsedMd = useMemo(() => parseMarkdownTable(md), [md]);
  const csvOut = useMemo(() => toDelimited(parsedMd.rows, outDelim), [parsedMd, outDelim]);

  const cycleAlign = (i: number) =>
    setAlign((prev) => {
      const next = [...prev];
      const cur = next[i] ?? 'left';
      next[i] = cur === 'left' ? 'center' : cur === 'center' ? 'right' : 'left';
      return next;
    });

  const loadFile = useCallback((file: File | undefined) => {
    if (!file) return;
    file.text().then((text) => {
      setCsv(text);
      setFileNote(`Loaded ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      if (file.name.endsWith('.tsv')) setDelim('\t');
    });
  }, []);

  const toggle = (
    <div className="mb-5 inline-flex rounded-full border border-gray-200 p-1">
      {(
        [
          ['csv2md', 'CSV → Markdown'],
          ['md2csv', 'Markdown → CSV'],
        ] as const
      ).map(([k, label]) => (
        <button
          key={k}
          type="button"
          onClick={() => setDir(k)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${dir === k ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-indigo-700'}`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  if (dir === 'md2csv') {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-xl md:p-6">
        {toggle}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex h-96 flex-col rounded-2xl border border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
              <span className={LABEL}>Markdown table</span>
              <button type="button" className={BTN_GHOST} onClick={() => setMd('')}>
                Clear
              </button>
            </div>
            <textarea
              value={md}
              onChange={(e) => setMd(e.target.value)}
              spellCheck={false}
              aria-label="Markdown table input"
              placeholder="Paste a markdown table."
              className="flex-1 resize-none bg-transparent p-4 font-mono text-sm text-gray-900 focus:outline-none"
            />
          </div>
          <div className="flex h-96 flex-col rounded-2xl border border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-4 py-2">
              <label className="flex items-center gap-1.5">
                <span className={LABEL}>Delimiter</span>
                <select value={outDelim} onChange={(e) => setOutDelim(e.target.value as ',' | '\t' | ';')} className={SELECT}>
                  <option value=",">Comma (CSV)</option>
                  <option value={'\t'}>Tab (TSV)</option>
                  <option value=";">Semicolon</option>
                </select>
              </label>
              <div className="flex gap-2">
                <button type="button" className={BTN_PRIMARY} onClick={() => copy(csvOut)} disabled={!csvOut}>
                  {copied ? 'Copied ✓' : 'Copy'}
                </button>
                <button
                  type="button"
                  className={BTN_DARK}
                  disabled={!csvOut}
                  onClick={() =>
                    downloadFile(outDelim === '\t' ? 'table.tsv' : 'table.csv', csvOut, outDelim === '\t' ? 'text/tab-separated-values' : 'text/csv')
                  }
                >
                  Download
                </button>
              </div>
            </div>
            <textarea
              value={csvOut}
              readOnly
              spellCheck={false}
              aria-label="CSV output"
              className="flex-1 resize-none bg-transparent p-4 font-mono text-sm text-gray-900 focus:outline-none"
            />
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          {parsedMd.rows.length ? `${parsedMd.rows.length} rows × ${Math.max(...parsedMd.rows.map((r) => r.length))} columns` : 'No table found'} — escaped
          pipes become plain pipes, and fields that need it are quoted. Paste the result straight into a spreadsheet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-xl md:p-6">
      {toggle}
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-700">
        <label className="flex items-center gap-1.5">
          <span className={LABEL}>Delimiter</span>
          <select value={delim} onChange={(e) => setDelim(e.target.value as Delim)} className={SELECT}>
            <option value="auto">Auto ({DELIM_LABEL[detected]})</option>
            <option value=",">Comma</option>
            <option value={'\t'}>Tab</option>
            <option value=";">Semicolon</option>
            <option value="|">Pipe</option>
          </select>
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={header} onChange={(e) => setHeader(e.target.checked)} /> First row is header
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={pad} onChange={(e) => setPad(e.target.checked)} /> Pad columns
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} /> Trim whitespace
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={boldHeader} onChange={(e) => setBoldHeader(e.target.checked)} /> Bold header
        </label>
      </div>

      {columnCount > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className={LABEL}>Alignment (click to cycle)</span>
          {headerLabels.map((label, i) => {
            const a = align[i] ?? 'left';
            return (
              <button
                key={i}
                type="button"
                onClick={() => cycleAlign(i)}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700"
                title={`Column ${i + 1}: ${a}`}
              >
                {a === 'left' ? '⇤' : a === 'center' ? '↔' : '⇥'} {label.length > 18 ? `${label.slice(0, 18)}…` : label}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div
          className={`flex h-96 flex-col rounded-2xl border ${dragging ? 'border-indigo-400 bg-indigo-50/40' : 'border-gray-200 bg-gray-50'}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            loadFile(e.dataTransfer.files[0]);
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-4 py-2">
            <span className={LABEL}>CSV / TSV — or paste a spreadsheet range</span>
            <div className="flex gap-2">
              <button type="button" className={BTN_GHOST} onClick={() => fileInput.current?.click()}>
                Open file
              </button>
              <button
                type="button"
                className={BTN_GHOST}
                onClick={() => {
                  setCsv('');
                  setFileNote('');
                }}
              >
                Clear
              </button>
              <input
                ref={fileInput}
                type="file"
                accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain"
                className="hidden"
                onChange={(e) => loadFile(e.target.files?.[0])}
              />
            </div>
          </div>
          <textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            spellCheck={false}
            aria-label="CSV input"
            placeholder="Paste CSV, TSV, or cells copied from Excel / Google Sheets (those arrive tab-separated)."
            className="flex-1 resize-none bg-transparent p-4 font-mono text-sm text-gray-900 focus:outline-none"
          />
          {fileNote && <p className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500">{fileNote}</p>}
        </div>

        <div className="flex h-96 flex-col rounded-2xl border border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-4 py-2">
            <div className="inline-flex rounded-full border border-gray-200 p-0.5 text-xs">
              {(['markdown', 'preview'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={`rounded-full px-3 py-1 font-medium capitalize transition ${view === v ? 'bg-gray-950 text-white' : 'text-gray-600 hover:text-gray-950'}`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" className={BTN_PRIMARY} onClick={() => copy(markdownOut)} disabled={!markdownOut}>
                {copied ? 'Copied ✓' : 'Copy markdown'}
              </button>
              <button
                type="button"
                className={BTN_DARK}
                disabled={!markdownOut}
                onClick={() => downloadFile('table.md', `${markdownOut}\n`, 'text/markdown')}
              >
                Download .md
              </button>
            </div>
          </div>
          {view === 'markdown' ? (
            <textarea
              value={markdownOut}
              readOnly
              spellCheck={false}
              aria-label="Markdown table output"
              className="flex-1 resize-none bg-transparent p-4 font-mono text-sm text-gray-900 focus:outline-none"
            />
          ) : (
            <div className="flex-1 overflow-auto p-4">
              {markdownOut ? <MarkdownRenderer content={markdownOut} /> : <p className="text-sm text-gray-400">Nothing to preview yet.</p>}
            </div>
          )}
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-500">
        {rows.length ? `${rows.length} rows × ${columnCount} columns` : 'No rows parsed'} · delimiter: {DELIM_LABEL[activeDelim]} · pipes in cells are
        escaped as <code className="rounded bg-gray-100 px-1">\|</code>, newlines become <code className="rounded bg-gray-100 px-1">&lt;br&gt;</code>. Nothing is uploaded.
      </p>
    </div>
  );
}
