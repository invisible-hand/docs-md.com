'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { BTN_DARK, BTN_GHOST, BTN_PRIMARY, downloadFile, useCopy } from '@/components/tools/toolkit';
import {
  JsonSyntaxError,
  SHAPE_LABEL,
  flattenJson,
  jsonValueToMarkdownTable,
  markdownTableToJson,
  parseJson,
  type Align,
  type ColumnOrder,
  type HeaderCase,
  type JsonValue,
} from '@/lib/json-table';

const STARTER_JSON = `[
  { "id": 1, "name": "Ada Lovelace", "role": "Engineer", "tags": ["math", "poetry"], "contact": { "city": "London", "email": "ada@example.com" }, "active": true },
  { "id": 2, "name": "Grace Hopper", "role": "Rear Admiral, USN", "tags": ["navy", "compilers"], "contact": { "city": "Arlington" }, "active": false },
  { "id": 3, "name": "Linus Torvalds", "role": "Maintainer | BDFL", "tags": [], "contact": { "city": "Portland", "email": null }, "active": true }
]`;

const STARTER_MD = `| id | name           | role              | contact.city |
| --: | :------------- | ----------------- | ------------ |
|  1 | Ada Lovelace   | Engineer          | London       |
|  2 | Grace Hopper   | Rear Admiral, USN | Arlington    |
|  3 | Linus Torvalds | Maintainer \\| BDFL | Portland     |`;

const LABEL = 'text-xs font-semibold uppercase tracking-wide text-gray-500';
const SELECT = 'rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 focus:border-indigo-400 focus:outline-none';
const TEXTAREA = 'flex-1 resize-none bg-transparent p-4 font-mono text-sm text-gray-900 focus:outline-none';

type Parsed = { value: JsonValue; error: null } | { value: null; error: { message: string; line: number; column: number } };

function parse(text: string): Parsed {
  try {
    return { value: parseJson(text), error: null };
  } catch (e) {
    if (e instanceof JsonSyntaxError) return { value: null, error: { message: e.message, line: e.line, column: e.column } };
    return { value: null, error: { message: e instanceof Error ? e.message : 'Invalid JSON', line: 1, column: 1 } };
  }
}

export default function JsonToMarkdownTable() {
  const [dir, setDir] = useState<'json2md' | 'md2json'>('json2md');
  const [json, setJson] = useState(STARTER_JSON);
  const [md, setMd] = useState(STARTER_MD);
  const [maxDepth, setMaxDepth] = useState(3);
  const [order, setOrder] = useState<ColumnOrder>('seen');
  const [customOrder, setCustomOrder] = useState('');
  const [excluded, setExcluded] = useState<string[]>([]);
  const [align, setAlign] = useState<Record<string, Align>>({});
  const [headerCase, setHeaderCase] = useState<HeaderCase>('as-is');
  const [pad, setPad] = useState(true);
  const [boldHeader, setBoldHeader] = useState(false);
  const [view, setView] = useState<'markdown' | 'preview'>('markdown');
  const [inferTypes, setInferTypes] = useState(true);
  const [unflatten, setUnflatten] = useState(true);
  const [indent, setIndent] = useState<2 | 0>(2);
  const [dragging, setDragging] = useState(false);
  const [fileNote, setFileNote] = useState('');
  const [copied, copy] = useCopy();
  const fileInput = useRef<HTMLInputElement>(null);

  const parsed = useMemo(() => parse(json), [json]);
  const flat = useMemo(() => (parsed.value === null ? null : flattenJson(parsed.value, { maxDepth })), [parsed, maxDepth]);
  const customList = useMemo(() => customOrder.split(/[,\n]/).map((s) => s.trim()).filter(Boolean), [customOrder]);

  const result = useMemo(() => {
    if (parsed.value === null) return null;
    return jsonValueToMarkdownTable(parsed.value, {
      maxDepth,
      columnOrder: order,
      customOrder: customList,
      exclude: excluded,
      align,
      headerCase,
      pad,
      boldHeader,
    });
  }, [parsed, maxDepth, order, customList, excluded, align, headerCase, pad, boldHeader]);

  const markdownOut = result?.markdown ?? '';

  const jsonOut = useMemo(() => {
    const rows = markdownTableToJson(md, { inferTypes, unflatten });
    return rows.length ? JSON.stringify(rows, null, indent || undefined) : '';
  }, [md, inferTypes, unflatten, indent]);

  const cycleAlign = (col: string) =>
    setAlign((prev) => {
      const cur = prev[col] ?? 'left';
      return { ...prev, [col]: cur === 'left' ? 'center' : cur === 'center' ? 'right' : 'left' };
    });
  const toggleExclude = (col: string) =>
    setExcluded((prev) => (prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]));

  const loadFile = useCallback((file: File | undefined) => {
    if (!file) return;
    file.text().then((text) => {
      setJson(text);
      setFileNote(`Loaded ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    });
  }, []);

  const toggle = (
    <div className="mb-5 inline-flex rounded-full border border-gray-200 p-1">
      {(
        [
          ['json2md', 'JSON → Markdown'],
          ['md2json', 'Markdown → JSON'],
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

  if (dir === 'md2json') {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-xl md:p-6">
        {toggle}
        <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-700">
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={inferTypes} onChange={(e) => setInferTypes(e.target.checked)} /> Infer numbers, booleans, null
          </label>
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={unflatten} onChange={(e) => setUnflatten(e.target.checked)} /> Expand dot.paths into nested objects
          </label>
          <label className="flex items-center gap-1.5">
            <span className={LABEL}>Output</span>
            <select value={indent} onChange={(e) => setIndent(Number(e.target.value) as 2 | 0)} className={SELECT}>
              <option value={2}>Pretty (2 spaces)</option>
              <option value={0}>Minified</option>
            </select>
          </label>
        </div>
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
              className={TEXTAREA}
            />
          </div>
          <div className="flex h-96 flex-col rounded-2xl border border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-4 py-2">
              <span className={LABEL}>JSON array</span>
              <div className="flex gap-2">
                <button type="button" className={BTN_PRIMARY} onClick={() => copy(jsonOut)} disabled={!jsonOut}>
                  {copied ? 'Copied ✓' : 'Copy JSON'}
                </button>
                <button
                  type="button"
                  className={BTN_DARK}
                  disabled={!jsonOut}
                  onClick={() => downloadFile('table.json', `${jsonOut}\n`, 'application/json')}
                >
                  Download .json
                </button>
              </div>
            </div>
            <textarea value={jsonOut} readOnly spellCheck={false} aria-label="JSON output" className={TEXTAREA} />
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          {jsonOut ? 'Each body row becomes one object keyed by the header cells.' : 'No table found — the first line with pipes needs a |---| separator line under it.'}{' '}
          Escaped pipes become plain pipes; <code className="rounded bg-gray-100 px-1">&lt;br&gt;</code> becomes a newline. Nothing is uploaded.
        </p>
      </div>
    );
  }

  const columns = flat?.columns ?? [];

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-xl md:p-6">
      {toggle}
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-700">
        <label className="flex items-center gap-1.5">
          <span className={LABEL}>Flatten depth</span>
          <select value={maxDepth} onChange={(e) => setMaxDepth(Number(e.target.value))} className={SELECT}>
            <option value={0}>0 (keep nested JSON)</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </label>
        <label className="flex items-center gap-1.5">
          <span className={LABEL}>Columns</span>
          <select value={order} onChange={(e) => setOrder(e.target.value as ColumnOrder)} className={SELECT}>
            <option value="seen">As first seen</option>
            <option value="alpha">Alphabetical</option>
            <option value="custom">Custom order</option>
          </select>
        </label>
        <label className="flex items-center gap-1.5">
          <span className={LABEL}>Header</span>
          <select value={headerCase} onChange={(e) => setHeaderCase(e.target.value as HeaderCase)} className={SELECT}>
            <option value="as-is">As in JSON</option>
            <option value="title">Title Case</option>
            <option value="upper">UPPER</option>
            <option value="lower">lower</option>
            <option value="snake">snake_case</option>
          </select>
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={pad} onChange={(e) => setPad(e.target.checked)} /> Pad columns
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={boldHeader} onChange={(e) => setBoldHeader(e.target.checked)} /> Bold header
        </label>
      </div>

      {order === 'custom' && (
        <div className="mb-4">
          <label className="flex flex-col gap-1">
            <span className={LABEL}>Column order — comma-separated names; unlisted columns follow in their original order</span>
            <input
              type="text"
              value={customOrder}
              onChange={(e) => setCustomOrder(e.target.value)}
              placeholder={columns.slice(0, 3).join(', ')}
              spellCheck={false}
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 font-mono text-xs text-gray-900 focus:border-indigo-400 focus:outline-none"
            />
          </label>
        </div>
      )}

      {columns.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className={LABEL}>Columns (click to cycle alignment, × to hide)</span>
          {columns.map((col) => {
            const a = align[col] ?? 'left';
            const off = excluded.includes(col);
            return (
              <span
                key={col}
                className={`inline-flex items-center rounded-full border text-xs font-medium transition ${off ? 'border-dashed border-gray-300 text-gray-400' : 'border-gray-200 text-gray-700 hover:border-indigo-300'}`}
              >
                <button
                  type="button"
                  onClick={() => cycleAlign(col)}
                  disabled={off}
                  className="py-1 pl-3 pr-1 hover:text-indigo-700 disabled:cursor-default disabled:hover:text-gray-400"
                  title={off ? `${col} is hidden` : `${col}: ${a}`}
                >
                  {a === 'left' ? '⇤' : a === 'center' ? '↔' : '⇥'} {col.length > 22 ? `${col.slice(0, 22)}…` : col}
                </button>
                <button
                  type="button"
                  onClick={() => toggleExclude(col)}
                  className="py-1 pl-1 pr-2.5 text-gray-400 hover:text-indigo-700"
                  title={off ? `Show ${col}` : `Hide ${col}`}
                  aria-label={off ? `Show column ${col}` : `Hide column ${col}`}
                >
                  {off ? '+' : '×'}
                </button>
              </span>
            );
          })}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div
          className={`flex h-96 flex-col rounded-2xl border ${dragging ? 'border-indigo-400 bg-indigo-50/40' : parsed.error ? 'border-red-300 bg-red-50/30' : 'border-gray-200 bg-gray-50'}`}
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
            <span className={LABEL}>JSON — array, object, or API response</span>
            <div className="flex gap-2">
              <button type="button" className={BTN_GHOST} onClick={() => fileInput.current?.click()}>
                Open file
              </button>
              <button
                type="button"
                className={BTN_GHOST}
                onClick={() => {
                  setJson('');
                  setFileNote('');
                }}
              >
                Clear
              </button>
              <input
                ref={fileInput}
                type="file"
                accept=".json,.txt,application/json,text/plain"
                className="hidden"
                onChange={(e) => loadFile(e.target.files?.[0])}
              />
            </div>
          </div>
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            spellCheck={false}
            aria-label="JSON input"
            placeholder='Paste JSON, e.g. [{"name": "Ada", "born": 1815}]'
            className={TEXTAREA}
          />
          {parsed.error ? (
            <p role="alert" className="border-t border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700">
              Line {parsed.error.line}, column {parsed.error.column}: {parsed.error.message.replace(/ \(line \d+, column \d+\)$/, '')}
            </p>
          ) : (
            fileNote && <p className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500">{fileNote}</p>
          )}
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
            <textarea value={markdownOut} readOnly spellCheck={false} aria-label="Markdown table output" className={TEXTAREA} />
          ) : (
            <div className="flex-1 overflow-auto p-4">
              {markdownOut ? <MarkdownRenderer content={markdownOut} /> : <p className="text-sm text-gray-400">Nothing to preview yet.</p>}
            </div>
          )}
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-500">
        {result
          ? `${SHAPE_LABEL[result.shape]} · ${result.rows.length} rows × ${result.outputColumns.length} columns${excluded.length ? ` (${excluded.length} hidden)` : ''}`
          : 'Fix the JSON to see the table'}{' '}
        · nested keys become <code className="rounded bg-gray-100 px-1">a.b.c</code>, arrays join with commas, null is an empty cell, pipes are escaped as{' '}
        <code className="rounded bg-gray-100 px-1">\|</code>. Nothing is uploaded.
      </p>
    </div>
  );
}
