'use client';

import { useCallback, useMemo, useRef, useState, type DragEvent } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { BTN_DARK, BTN_GHOST, BTN_PILL, BTN_PRIMARY, downloadFile, useCopy } from '@/components/tools/toolkit';
import { diffLines, stats, toHunks, toRows, toUnified, type DiffOp, type DiffOptions, type Row } from '@/lib/diff';

const BEFORE = `# Acme CLI

A command-line tool for managing Acme deployments.

## Installation

\`\`\`bash
npm install -g acme-cli
\`\`\`

## Usage

Run \`acme deploy\` from your project root.
Configuration lives in \`acme.json\`.

## Options

- \`--env\` — target environment
- \`--dry-run\` — print the plan without applying it

## License

MIT
`;

const AFTER = `# Acme CLI

A command-line tool for managing Acme deployments and rollbacks.

## Installation

\`\`\`bash
npm install -g @acme/cli
\`\`\`

## Usage

Run \`acme deploy\` from your project root.
Configuration lives in \`acme.config.json\`.

## Options

- \`--env\` — target environment
- \`--dry-run\` — print the plan without applying it
- \`--yes\` — skip the confirmation prompt

## Rollback

Run \`acme rollback <deployment-id>\` to revert.

## License

MIT
`;

type View = 'split' | 'unified' | 'rendered';

const TEXTAREA =
  'h-56 w-full resize-y rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-950 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200';

function WordSpans({ ops, side }: { ops: DiffOp[]; side: 'left' | 'right' }) {
  return (
    <>
      {ops.map((op, i) => {
        if (op.op === 'equal') return <span key={i}>{op.value}</span>;
        if (side === 'left' && op.op === 'delete') return <mark key={i} className="rounded bg-red-200/80 text-red-900">{op.value}</mark>;
        if (side === 'right' && op.op === 'insert') return <mark key={i} className="rounded bg-emerald-200/80 text-emerald-900">{op.value}</mark>;
        return null;
      })}
    </>
  );
}

export default function MarkdownDiff() {
  const [a, setA] = useState(BEFORE);
  const [b, setB] = useState(AFTER);
  const [view, setView] = useState<View>('split');
  const [opts, setOpts] = useState<DiffOptions>({});
  const [collapse, setCollapse] = useState(true);
  const [cursorRaw, setCursor] = useState(0);
  const [copied, copy] = useCopy();
  const rowsRef = useRef<HTMLDivElement>(null);

  const ops = useMemo(() => diffLines(a, b, opts), [a, b, opts]);
  const rows = useMemo(() => toRows(ops, opts), [ops, opts]);
  const st = useMemo(() => stats(rows), [rows]);
  const unified = useMemo(() => toUnified(ops, 'a/before.md', 'b/after.md'), [ops]);
  const hunks = useMemo(() => toHunks(ops), [ops]);
  const changeIdx = useMemo(() => rows.map((r, i) => (r.kind === 'equal' ? -1 : i)).filter((i) => i >= 0), [rows]);
  const cursor = changeIdx.length ? Math.min(cursorRaw, changeIdx.length - 1) : 0;

  const goto = useCallback(
    (n: number) => {
      if (!changeIdx.length) return;
      const next = ((n % changeIdx.length) + changeIdx.length) % changeIdx.length;
      setCursor(next);
      const el = rowsRef.current?.querySelector<HTMLElement>(`[data-row="${changeIdx[next]}"]`);
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    },
    [changeIdx],
  );

  const onDrop = (setter: (s: string) => void) => (e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) f.text().then(setter);
  };
  const onFile = (setter: (s: string) => void) => (f: File | undefined) => {
    if (f) f.text().then(setter);
  };

  // Split view: hide long equal runs when collapse is on
  const displayRows = useMemo(() => {
    if (!collapse) return rows.map((r, i) => ({ r, i, hidden: 0 }));
    const out: { r: Row; i: number; hidden: number }[] = [];
    let i = 0;
    while (i < rows.length) {
      if (rows[i].kind !== 'equal') {
        out.push({ r: rows[i], i, hidden: 0 });
        i++;
        continue;
      }
      let j = i;
      while (j < rows.length && rows[j].kind === 'equal') j++;
      const run = j - i;
      const keepStart = i === 0 ? 0 : 3;
      const keepEnd = j === rows.length ? 0 : 3;
      if (run > keepStart + keepEnd + 2) {
        for (let k = i; k < i + keepStart; k++) out.push({ r: rows[k], i: k, hidden: 0 });
        out.push({ r: rows[i + keepStart], i: -1, hidden: run - keepStart - keepEnd });
        for (let k = j - keepEnd; k < j; k++) out.push({ r: rows[k], i: k, hidden: 0 });
      } else for (let k = i; k < j; k++) out.push({ r: rows[k], i: k, hidden: 0 });
      i = j;
    }
    return out;
  }, [rows, collapse]);

  const rowTone = (kind: Row['kind']) =>
    kind === 'insert' ? 'bg-emerald-50' : kind === 'delete' ? 'bg-red-50' : kind === 'change' ? 'bg-amber-50' : '';

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {(
          [
            ['Before', a, setA, 'before.md'],
            ['After', b, setB, 'after.md'],
          ] as const
        ).map(([label, val, set, name]) => (
          <div key={label}>
            <div className="mb-2 flex min-h-8 items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {val.split('\n').length} lines
                <label className={`${BTN_GHOST} cursor-pointer`}>
                  Open file
                  <input type="file" accept=".md,.markdown,.txt,text/*" className="hidden" onChange={(e) => onFile(set)(e.target.files?.[0])} />
                </label>
              </div>
            </div>
            <textarea
              value={val}
              onChange={(e) => set(e.target.value)}
              onDrop={onDrop(set)}
              onDragOver={(e) => e.preventDefault()}
              spellCheck={false}
              aria-label={`${label} text`}
              placeholder={`Paste the ${label.toLowerCase()} version, or drop ${name} here`}
              className={TEXTAREA}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-xs text-gray-700">
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {(['split', 'unified', 'rendered'] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`rounded-md px-3 py-1 font-medium transition ${view === v ? 'bg-gray-950 text-white' : 'text-gray-600 hover:text-gray-950'}`}
            >
              {v === 'split' ? 'Side by side' : v === 'unified' ? 'Unified' : 'Rendered'}
            </button>
          ))}
        </div>
        <span className="font-mono">
          <span className="text-emerald-700">+{st.added}</span> <span className="text-red-700">−{st.removed}</span>{' '}
          <span className="text-amber-700">~{st.changed}</span> · {st.similarity}% similar
        </span>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={!!opts.ignoreWhitespace} onChange={(e) => setOpts((o) => ({ ...o, ignoreWhitespace: e.target.checked }))} />
          Ignore whitespace
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={!!opts.ignoreCase} onChange={(e) => setOpts((o) => ({ ...o, ignoreCase: e.target.checked }))} />
          Ignore case
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={!!opts.ignoreBlankLines} onChange={(e) => setOpts((o) => ({ ...o, ignoreBlankLines: e.target.checked }))} />
          Ignore blank lines
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={collapse} onChange={(e) => setCollapse(e.target.checked)} />
          Collapse unchanged
        </label>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button type="button" className={BTN_PILL} onClick={() => goto(cursor - 1)} disabled={!changeIdx.length}>
            ↑ Prev
          </button>
          <span className="text-gray-500">
            {changeIdx.length ? `${cursor + 1} / ${changeIdx.length}` : '0 changes'}
          </span>
          <button type="button" className={BTN_PILL} onClick={() => goto(cursor + 1)} disabled={!changeIdx.length}>
            ↓ Next
          </button>
          <button
            type="button"
            className={BTN_GHOST}
            onClick={() => {
              setA(b);
              setB(a);
            }}
          >
            ⇄ Swap
          </button>
          <button
            type="button"
            className={BTN_GHOST}
            onClick={() => {
              setA('');
              setB('');
            }}
          >
            Clear
          </button>
          <button type="button" className={BTN_DARK} onClick={() => copy(unified)} disabled={!unified}>
            {copied ? '✓ Copied' : 'Copy patch'}
          </button>
          <button type="button" className={BTN_PRIMARY} onClick={() => downloadFile('changes.patch', unified, 'text/x-patch')} disabled={!unified}>
            Download .patch
          </button>
        </div>
      </div>

      {view === 'split' ? (
        <div ref={rowsRef} className="overflow-auto rounded-2xl border border-gray-200 bg-white">
          {rows.length === 0 || (rows.length === 1 && a === '' && b === '') ? (
            <p className="p-8 text-center text-sm text-gray-500">Paste two versions above to compare them.</p>
          ) : (
            <table className="w-full table-fixed border-collapse font-mono text-xs leading-5">
              <colgroup>
                <col className="w-10" />
                <col />
                <col className="w-10" />
                <col />
              </colgroup>
              <tbody>
                {displayRows.map(({ r, i, hidden }, k) =>
                  hidden ? (
                    <tr key={`h${k}`}>
                      <td colSpan={4} className="bg-gray-50 px-3 py-1 text-center text-[11px] text-gray-500">
                        <button type="button" className="hover:text-indigo-700" onClick={() => setCollapse(false)}>
                          ⋯ {hidden} unchanged lines hidden — show
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr
                      key={k}
                      data-row={i}
                      className={`${rowTone(r.kind)} ${changeIdx[cursor] === i ? 'outline outline-2 -outline-offset-2 outline-indigo-400' : ''}`}
                    >
                      <td className="select-none border-r border-gray-100 px-2 text-right text-gray-400">{r.leftNo ?? ''}</td>
                      <td className={`whitespace-pre-wrap break-words border-r border-gray-200 px-3 ${r.kind === 'delete' ? 'bg-red-100/70' : ''}`}>
                        {r.kind === 'change' && r.words ? <WordSpans ops={r.words} side="left" /> : r.left ?? ''}
                      </td>
                      <td className="select-none border-r border-gray-100 px-2 text-right text-gray-400">{r.rightNo ?? ''}</td>
                      <td className={`whitespace-pre-wrap break-words px-3 ${r.kind === 'insert' ? 'bg-emerald-100/70' : ''}`}>
                        {r.kind === 'change' && r.words ? <WordSpans ops={r.words} side="right" /> : r.right ?? ''}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          )}
        </div>
      ) : view === 'unified' ? (
        <div className="overflow-auto rounded-2xl bg-gray-950 p-4 font-mono text-xs leading-5 text-gray-200">
          {hunks.length === 0 ? (
            <p className="text-gray-400">No differences.</p>
          ) : (
            <>
              <div className="text-gray-400">--- a/before.md</div>
              <div className="mb-2 text-gray-400">+++ b/after.md</div>
              {hunks.map((h, hi) => (
                <div key={hi} className="mb-3">
                  <div className="text-sky-400">
                    @@ -{h.aStart},{h.aLen} +{h.bStart},{h.bLen} @@
                  </div>
                  {h.lines.map((l, li) => (
                    <div
                      key={li}
                      className={`whitespace-pre-wrap break-words ${
                        l.op === 'insert' ? 'bg-emerald-900/50 text-emerald-200' : l.op === 'delete' ? 'bg-red-900/50 text-red-200' : ''
                      }`}
                    >
                      {l.op === 'insert' ? '+' : l.op === 'delete' ? '-' : ' '}
                      {l.value}
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {[
            ['Before', a],
            ['After', b],
          ].map(([label, val]) => (
            <div key={label} className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">{label}, rendered</p>
              <MarkdownRenderer content={val} />
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-500">
        Line diff by Myers&apos; algorithm with word-level highlights inside changed lines. Nothing leaves your browser.
      </p>
    </div>
  );
}
