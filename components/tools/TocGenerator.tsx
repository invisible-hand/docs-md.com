'use client';

import { useMemo, useState } from 'react';
import GithubSlugger from 'github-slugger';
import { BTN_GHOST, BTN_PRIMARY, useCopy } from '@/components/tools/toolkit';

const STARTER = `# Project Handbook

## Getting started

### Prerequisites

### Installation

## Configuration

### Environment variables

## Deployment

## FAQ
`;

interface Entry {
  depth: number;
  text: string;
  slug: string;
}

function extract(content: string, maxDepth: number): Entry[] {
  const slugger = new GithubSlugger();
  const entries: Entry[] = [];
  let inFence = false;
  for (const line of content.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = m[2]
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_`~]/g, '')
      .trim();
    if (!text || m[1].length > maxDepth) continue;
    entries.push({ depth: m[1].length, text, slug: slugger.slug(text) });
  }
  return entries;
}

export default function TocGenerator() {
  const [content, setContent] = useState(STARTER);
  const [maxDepth, setMaxDepth] = useState(3);
  const [ordered, setOrdered] = useState(false);
  const [skipH1, setSkipH1] = useState(true);
  const [copied, copy] = useCopy();

  const toc = useMemo(() => {
    const entries = extract(content, maxDepth).filter((e) => !skipH1 || e.depth > 1);
    if (!entries.length) return '';
    const minDepth = Math.min(...entries.map((e) => e.depth));
    const counters: number[] = [];
    return entries
      .map((e) => {
        const level = e.depth - minDepth;
        const indent = '  '.repeat(level);
        let marker = '-';
        if (ordered) {
          counters[level] = (counters[level] ?? 0) + 1;
          counters.length = level + 1;
          marker = `${counters[level]}.`;
        }
        return `${indent}${marker} [${e.text}](#${e.slug})`;
      })
      .join('\n');
  }, [content, maxDepth, ordered, skipH1]);

  const insert = () => {
    if (!toc) return;
    const block = `## Table of contents\n\n${toc}\n`;
    const lines = content.split('\n');
    // Insert after the H1 (and its immediate blank line) if present, else at top.
    const h1 = lines.findIndex((l) => /^#\s/.test(l));
    const at = h1 === -1 ? 0 : h1 + 1;
    lines.splice(at, 0, '', block);
    setContent(lines.join('\n'));
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-xl md:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          Depth up to
          <select
            value={maxDepth}
            onChange={(e) => setMaxDepth(Number(e.target.value))}
            className="rounded-lg border border-gray-300 px-2 py-1"
          >
            {[2, 3, 4, 5, 6].map((d) => (
              <option key={d} value={d}>
                H{d}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={ordered} onChange={(e) => setOrdered(e.target.checked)} />
          Numbered list
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={skipH1} onChange={(e) => setSkipH1(e.target.checked)} />
          Skip the H1 title
        </label>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          spellCheck={false}
          aria-label="Markdown input"
          className="h-96 w-full resize-y rounded-2xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm text-gray-900 focus:border-indigo-400 focus:outline-none"
        />
        <div className="flex h-96 flex-col rounded-2xl border border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Generated TOC
            </span>
            <div className="flex gap-2">
              <button type="button" className={BTN_GHOST} onClick={insert} disabled={!toc}>
                Insert into document
              </button>
              <button type="button" className={BTN_PRIMARY} onClick={() => copy(toc)} disabled={!toc}>
                {copied ? 'Copied!' : 'Copy TOC'}
              </button>
            </div>
          </div>
          <pre className="flex-1 overflow-auto p-4 font-mono text-sm text-gray-800">
            {toc || 'Add some ## headings on the left…'}
          </pre>
        </div>
      </div>
    </div>
  );
}
