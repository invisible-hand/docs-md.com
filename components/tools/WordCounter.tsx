'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { BTN_DARK, BTN_GHOST, useCopy } from '@/components/tools/toolkit';
import { computeStats, density, readingTime, statsAsMarkdown, type TextStats } from '@/lib/text-stats';

const STARTER = `---
title: Shipping the new editor
tags: [release, editor]
---

# Shipping the new editor

We rebuilt the editor from scratch. It is faster, it handles **large documents** without stutter, and it finally gets tables right.

## What changed

- Rendering moved off the main thread.
- Tables are edited in a grid instead of raw pipes.
- [x] Mermaid diagrams render inline
- [ ] Collaborative cursors (next release)

\`\`\`ts
const editor = createEditor({ worker: true });
\`\`\`

## Why it matters

Most of our users write documents longer than a screen. The old editor re-parsed the whole file on every keystroke; the new one parses only the changed block. See the [benchmarks](https://example.com/bench) and the ![before/after chart](chart.png).

## Next

Collaboration is next. Tell us what you need at https://example.com/feedback.
`;

const STAT = 'rounded-xl border border-gray-200 bg-white p-3';
const NUM = 'text-2xl font-semibold tabular-nums text-gray-950';
const LBL = 'text-[11px] font-semibold uppercase tracking-wide text-gray-500';

export default function WordCounter() {
  const [text, setText] = useState(STARTER);
  const [stats, setStats] = useState<TextStats | null>(null);
  const [wpm, setWpm] = useState(238);
  const [includeAlt, setIncludeAlt] = useState(false);
  const [stopWords, setStopWords] = useState(true);
  const [phrase, setPhrase] = useState('editor');
  const [goal, setGoal] = useState(500);
  const [copied, copy] = useCopy();
  const seq = useRef(0);

  useEffect(() => {
    const id = ++seq.current;
    const t = setTimeout(async () => {
      const s = await computeStats(text, { includeAltText: includeAlt, removeStopWords: stopWords });
      if (seq.current === id) setStats(s);
    }, 150);
    return () => clearTimeout(t);
  }, [text, includeAlt, stopWords]);

  const dens = useMemo(() => (stats ? density(stats.proseText, phrase) : { count: 0, percent: 0 }), [stats, phrase]);
  const progress = stats && goal > 0 ? Math.min(100, Math.round((stats.prose.words / goal) * 100)) : 0;

  const onFile = (f: File | undefined) => {
    if (f) f.text().then(setText);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]">
      <div>
        <div className="mb-2 flex min-h-8 items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Document</h3>
          <div className="flex gap-2">
            <label className={`${BTN_GHOST} cursor-pointer`}>
              Open .md
              <input type="file" accept=".md,.markdown,.txt,text/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
            <button type="button" className={BTN_GHOST} onClick={() => setText('')}>
              Clear
            </button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onDrop={(e) => {
            e.preventDefault();
            onFile(e.dataTransfer.files?.[0]);
          }}
          onDragOver={(e) => e.preventDefault()}
          spellCheck={false}
          aria-label="Markdown text"
          placeholder="Paste markdown here, or drop a .md file…"
          className="h-[560px] w-full resize-y rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-950 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
        <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-gray-700">
              Target length
              <input
                type="number"
                min={0}
                value={goal}
                onChange={(e) => setGoal(Number(e.target.value) || 0)}
                className="w-24 rounded-lg border border-gray-200 px-2 py-1 text-right tabular-nums"
              />
              words
            </label>
            <span className="tabular-nums text-gray-600">
              {stats?.prose.words ?? 0} / {goal} · {progress}%
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
            <div className={`h-full rounded-full transition-all ${progress >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-xs text-gray-700">
          <label className="flex items-center gap-2">
            Reading speed
            <input type="number" min={60} max={1000} value={wpm} onChange={(e) => setWpm(Number(e.target.value) || 238)} className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-right tabular-nums" />
            wpm
          </label>
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={includeAlt} onChange={(e) => setIncludeAlt(e.target.checked)} />
            Count image alt text
          </label>
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={stopWords} onChange={(e) => setStopWords(e.target.checked)} />
            Hide stop words
          </label>
          <button type="button" className={`${BTN_DARK} ml-auto`} onClick={() => stats && copy(statsAsMarkdown(stats, wpm))} disabled={!stats}>
            {copied ? '✓ Copied' : 'Copy stats as table'}
          </button>
        </div>

        {stats ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className={`${STAT} col-span-2 sm:col-span-1 border-indigo-200 bg-indigo-50/60`}>
                <p className={LBL}>Words (prose)</p>
                <p className={NUM}>{stats.prose.words.toLocaleString()}</p>
                <p className="text-[11px] text-gray-500">{stats.raw.words.toLocaleString()} in raw source</p>
              </div>
              <div className={STAT}>
                <p className={LBL}>Reading time</p>
                <p className={NUM}>{readingTime(stats.prose.words, wpm)}</p>
                <p className="text-[11px] text-gray-500">speaking {readingTime(stats.prose.words, 150)}</p>
              </div>
              <div className={STAT}>
                <p className={LBL}>Characters</p>
                <p className={NUM}>{stats.prose.chars.toLocaleString()}</p>
                <p className="text-[11px] text-gray-500">{stats.prose.charsNoSpaces.toLocaleString()} without spaces</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-2">Metric</th>
                    <th className="px-4 py-2 text-right">Prose</th>
                    <th className="px-4 py-2 text-right">Raw</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 tabular-nums">
                  {(
                    [
                      ['Sentences', 'sentences'],
                      ['Paragraphs', 'paragraphs'],
                      ['Lines', 'lines'],
                      ['Unique words', 'uniqueWords'],
                      ['Avg words / sentence', 'avgWordsPerSentence'],
                      ['Longest sentence (words)', 'longestSentence'],
                    ] as const
                  ).map(([label, key]) => (
                    <tr key={key}>
                      <td className="px-4 py-1.5 text-gray-700">{label}</td>
                      <td className="px-4 py-1.5 text-right text-gray-950">{stats.prose[key].toLocaleString()}</td>
                      <td className="px-4 py-1.5 text-right text-gray-500">{stats.raw[key].toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className={LBL}>Structure</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {stats.structure.headings.slice(1).map((n, i) =>
                  n ? (
                    <span key={i} className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">
                      H{i + 1} <b>{n}</b>
                    </span>
                  ) : null,
                )}
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">links <b>{stats.structure.links}</b></span>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">images <b>{stats.structure.images}</b></span>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">
                  code blocks <b>{stats.structure.codeBlocks}</b> ({stats.structure.codeLines} lines)
                </span>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">list items <b>{stats.structure.listItems}</b></span>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">tables <b>{stats.structure.tables}</b></span>
                {stats.structure.tasksTotal ? (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">
                    tasks <b>{stats.structure.tasksDone}/{stats.structure.tasksTotal}</b> done
                  </span>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <p className={LBL}>Top words</p>
                {stats.topWords.length ? (
                  <ol className="mt-2 space-y-1 text-sm">
                    {stats.topWords.map((w) => (
                      <li key={w.word} className="flex items-center gap-2">
                        <span className="w-24 truncate text-gray-800">{w.word}</span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                          <span className="block h-full rounded-full bg-indigo-400" style={{ width: `${(w.count / stats.topWords[0].count) * 100}%` }} />
                        </span>
                        <span className="w-6 text-right text-xs tabular-nums text-gray-500">{w.count}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-2 text-xs text-gray-500">No words yet.</p>
                )}
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <p className={LBL}>Keyword density</p>
                  <input
                    value={phrase}
                    onChange={(e) => setPhrase(e.target.value)}
                    placeholder="word or phrase"
                    className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-indigo-300 focus:outline-none"
                  />
                  <p className="mt-2 text-sm text-gray-700">
                    <b className="tabular-nums">{dens.count}</b> occurrence{dens.count === 1 ? '' : 's'} · <b className="tabular-nums">{dens.percent}%</b> of words
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <p className={LBL}>Words per section</p>
                  {stats.sections.length ? (
                    <ul className="mt-2 max-h-40 space-y-1 overflow-auto text-xs">
                      {stats.sections.map((s, i) => (
                        <li key={i} className="flex items-center gap-2" style={{ paddingLeft: `${Math.max(0, s.depth - 1) * 10}px` }}>
                          <span className="truncate text-gray-800">{s.title || '(untitled)'}</span>
                          <span className="ml-auto shrink-0 tabular-nums text-gray-500">{s.words}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-xs text-gray-500">Add headings to see a per-section breakdown.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">Counting…</div>
        )}
        <p className="text-xs text-gray-500">
          Prose counts exclude markdown syntax, code blocks, inline code, URLs, HTML, and front matter. Runs in your browser.
        </p>
      </div>
    </div>
  );
}
