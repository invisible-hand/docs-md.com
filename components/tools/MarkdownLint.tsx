'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BTN_DARK, BTN_GHOST, BTN_PRIMARY, downloadFile, useCopy } from '@/components/tools/toolkit';
import { RULES, fixAll, fixFinding, lintMarkdown, type Finding, type RuleMeta } from '@/lib/markdown-lint';

const STARTER = `Welcome to the project handbook.
#Getting started
##  Prerequisites:
You need Node 20 and pnpm.
#### Install
Run the installer, then read https://example.com/docs before continuing.


Configuration
-------------
- copy .env.example
* fill in DATABASE_URL
+ run \`pnpm db:init\`
\`\`\`
pnpm dev
\`\`\`
Open the app and check the [dashboard]().
![](screenshot.png)

## Prerequisites
Trailing spaces hide here.
# Deployment
`;

const GUTTER = 'w-12 shrink-0 select-none pr-2 text-right font-mono text-xs leading-5 text-gray-400';

export default function MarkdownLint() {
  const [text, setText] = useState(STARTER);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [disabled, setDisabled] = useState<Set<string>>(new Set());
  const [allowBr, setAllowBr] = useState(true);
  const [active, setActive] = useState<Finding | null>(null);
  const [busy, setBusy] = useState(false);
  const [lastFix, setLastFix] = useState<number | null>(null);
  const [copied, copy] = useCopy();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const seq = useRef(0);

  // Lint (debounced)
  useEffect(() => {
    const id = ++seq.current;
    const timer = setTimeout(async () => {
      const result = await lintMarkdown(text, { disabled, allowHardBreakSpaces: allowBr });
      if (seq.current === id) setFindings(result);
    }, 200);
    return () => clearTimeout(timer);
  }, [text, disabled, allowBr]);

  const lines = useMemo(() => text.split('\n'), [text]);
  const lineHasIssue = useMemo(() => {
    const m = new Map<number, 'error' | 'warning'>();
    for (const f of findings) {
      const prev = m.get(f.line);
      if (prev !== 'error') m.set(f.line, f.severity);
    }
    return m;
  }, [findings]);

  const errors = findings.filter((f) => f.severity === 'error').length;
  const warnings = findings.length - errors;
  const fixable = findings.filter((f) => f.fixable).length;

  const grouped = useMemo(() => {
    const map = new Map<string, Finding[]>();
    for (const f of findings) map.set(f.rule, [...(map.get(f.rule) ?? []), f]);
    return [...map.entries()]
      .map(([id, list]) => ({ meta: RULES.find((r) => r.id === id)!, list }))
      .sort((a, b) => (a.meta.severity === b.meta.severity ? b.list.length - a.list.length : a.meta.severity === 'error' ? -1 : 1));
  }, [findings]);

  const jumpTo = useCallback(
    (f: Finding) => {
      setActive(f);
      const ta = textareaRef.current;
      if (!ta) return;
      const ls = text.split('\n');
      let start = 0;
      for (let i = 0; i < f.line - 1 && i < ls.length; i++) start += ls[i].length + 1;
      const end = start + (ls[f.line - 1]?.length ?? 0);
      ta.focus();
      ta.setSelectionRange(start, end);
      const lineHeight = 20;
      ta.scrollTop = Math.max(0, (f.line - 4) * lineHeight);
    },
    [text],
  );

  const applyOne = (f: Finding) => {
    setText((t) => fixFinding(t, f));
    setActive(null);
  };

  const applyAll = async () => {
    setBusy(true);
    try {
      const { text: fixed, fixed: n } = await fixAll(text, { disabled, allowHardBreakSpaces: allowBr });
      setText(fixed);
      setLastFix(n);
      setActive(null);
    } finally {
      setBusy(false);
    }
  };

  const toggleRule = (id: string) =>
    setDisabled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const onScroll = () => {
    if (gutterRef.current && textareaRef.current) gutterRef.current.scrollTop = textareaRef.current.scrollTop;
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    file.text().then(setText);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-xs text-gray-700">
        <span
          className={`rounded-full px-3 py-1 font-semibold ${
            findings.length === 0 ? 'bg-emerald-50 text-emerald-700' : errors ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-800'
          }`}
        >
          {findings.length === 0 ? 'Clean ✓' : `${errors} error${errors === 1 ? '' : 's'} · ${warnings} warning${warnings === 1 ? '' : 's'}`}
        </span>
        <span className="text-gray-500">{lines.length} lines</span>
        {lastFix !== null ? <span className="text-emerald-700">Applied {lastFix} fix{lastFix === 1 ? '' : 'es'}</span> : null}
        <div className="ml-auto flex flex-wrap gap-2">
          <label className={`${BTN_GHOST} cursor-pointer`}>
            Open .md
            <input type="file" accept=".md,.markdown,.txt,text/markdown" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
          <button type="button" className={BTN_PRIMARY} onClick={applyAll} disabled={busy || fixable === 0}>
            {busy ? 'Fixing…' : `Fix all fixable (${fixable})`}
          </button>
          <button type="button" className={BTN_DARK} onClick={() => copy(text)}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button type="button" className={BTN_GHOST} onClick={() => downloadFile('document.md', text, 'text/markdown')}>
            Download .md
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div>
          <div className="mb-2 flex min-h-8 items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Document</h3>
            <label className="flex items-center gap-2 text-xs text-gray-600">
              <input type="checkbox" checked={allowBr} onChange={(e) => setAllowBr(e.target.checked)} />
              Allow two trailing spaces (hard line break)
            </label>
          </div>
          <div className="flex h-[520px] overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-200">
            <div ref={gutterRef} className={`${GUTTER} overflow-hidden border-r border-gray-200 bg-gray-100 py-3`} aria-hidden="true">
              {lines.map((_, i) => {
                const sev = lineHasIssue.get(i + 1);
                const isActive = active?.line === i + 1;
                return (
                  <div
                    key={i}
                    className={`${sev === 'error' ? 'bg-red-100 font-semibold text-red-700' : sev === 'warning' ? 'bg-amber-100 text-amber-800' : ''} ${isActive ? 'ring-1 ring-inset ring-indigo-400' : ''}`}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setLastFix(null);
              }}
              onScroll={onScroll}
              onDrop={(e) => {
                e.preventDefault();
                onFile(e.dataTransfer.files?.[0]);
              }}
              onDragOver={(e) => e.preventDefault()}
              spellCheck={false}
              wrap="off"
              aria-label="Markdown to lint"
              className="h-full w-full resize-none bg-transparent px-3 py-3 font-mono text-sm leading-5 text-gray-950 focus:outline-none"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Click a finding to select its line. Fixes edit only that line (or add a blank line next to it) — nothing
            is reflowed. Runs entirely in your browser.
          </p>
        </div>

        <div>
          <div className="mb-2 flex min-h-8 items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Findings</h3>
            <span className="text-xs text-gray-500">{RULES.length - disabled.size} of {RULES.length} rules on</span>
          </div>
          <div className="h-[520px] space-y-3 overflow-auto rounded-2xl border border-gray-200 bg-white p-3">
            {grouped.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-gray-500">
                <span className="text-3xl">✓</span>
                No problems with the enabled rules.
              </div>
            ) : (
              grouped.map(({ meta, list }) => (
                <RuleGroup
                  key={meta.id}
                  meta={meta}
                  list={list}
                  active={active}
                  onJump={jumpTo}
                  onFix={applyOne}
                  onDisable={() => toggleRule(meta.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <details className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
        <summary className="cursor-pointer font-semibold text-gray-900">
          Rules ({RULES.length}) — toggle any off
        </summary>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {RULES.map((r) => (
            <li key={r.id} className="flex items-start gap-2">
              <input
                type="checkbox"
                id={`rule-${r.id}`}
                checked={!disabled.has(r.id)}
                onChange={() => toggleRule(r.id)}
                className="mt-1"
              />
              <label htmlFor={`rule-${r.id}`} className="cursor-pointer">
                <span className="font-mono text-xs text-gray-500">{r.id}</span>{' '}
                <span className="font-medium text-gray-900">{r.description}</span>
                {r.fixable ? <span className="ml-1 rounded bg-emerald-50 px-1 text-[10px] font-semibold text-emerald-700">fixable</span> : null}
                <span className="block text-xs text-gray-500">{r.why}</span>
              </label>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

function RuleGroup({
  meta,
  list,
  active,
  onJump,
  onFix,
  onDisable,
}: {
  meta: RuleMeta;
  list: Finding[];
  active: Finding | null;
  onJump: (f: Finding) => void;
  onFix: (f: Finding) => void;
  onDisable: () => void;
}) {
  const tone = meta.severity === 'error' ? 'text-red-700 bg-red-50 border-red-100' : 'text-amber-800 bg-amber-50 border-amber-100';
  return (
    <div className="rounded-xl border border-gray-200">
      <div className="flex items-start gap-2 px-3 py-2">
        <span className={`mt-0.5 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${tone}`}>{meta.id}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">
            {meta.description} <span className="text-gray-400">×{list.length}</span>
          </p>
          <p className="text-xs text-gray-500">{meta.why}</p>
        </div>
        <button type="button" onClick={onDisable} className="text-[11px] text-gray-400 hover:text-gray-700" title="Turn this rule off">
          mute
        </button>
      </div>
      <ul className="divide-y divide-gray-100 border-t border-gray-100">
        {list.map((f, i) => (
          <li
            key={`${f.rule}-${f.line}-${f.column}-${i}`}
            className={`flex items-center gap-3 px-3 py-1.5 text-xs ${active === f ? 'bg-indigo-50' : ''}`}
          >
            <button type="button" onClick={() => onJump(f)} className="font-mono text-indigo-700 hover:underline">
              L{f.line}:{f.column}
            </button>
            <button type="button" onClick={() => onJump(f)} className="min-w-0 flex-1 truncate text-left text-gray-700" title={f.message}>
              {f.message}
            </button>
            {f.fixable ? (
              <button type="button" onClick={() => onFix(f)} className="rounded border border-gray-200 px-2 py-0.5 text-[11px] font-medium text-gray-700 hover:border-indigo-300 hover:text-indigo-700">
                Fix
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
