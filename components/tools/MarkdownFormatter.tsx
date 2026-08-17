'use client';

import { useEffect, useRef, useState } from 'react';
import { BTN_DARK, BTN_GHOST, downloadFile, useCopy } from '@/components/tools/toolkit';
import type { FormatOptions } from '@/lib/markdown-pipeline';

const STARTER = `#    Messy Document
Some *emphasis* mixed with _underscores_ and    extra   spaces.

*   inconsistent
+ list
- markers

|Name|Score|
|---|---|
|Ada|99|
|Grace|97|

    Indented code that stays put.
`;

const SELECT_CLASS =
  'rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-800 focus:border-indigo-400 focus:outline-none';

export default function MarkdownFormatter() {
  const [input, setInput] = useState(STARTER);
  const [output, setOutput] = useState('');
  const [error, setError] = useState(false);
  const [bullet, setBullet] = useState<FormatOptions['bullet']>('-');
  const [emphasis, setEmphasis] = useState<FormatOptions['emphasis']>('*');
  const [fence, setFence] = useState<FormatOptions['fence']>('`');
  const [copied, copy] = useCopy();
  const seq = useRef(0);

  useEffect(() => {
    const id = ++seq.current;
    const timer = setTimeout(async () => {
      try {
        const { formatMarkdown } = await import('@/lib/markdown-pipeline');
        const result = await formatMarkdown(input, { bullet, emphasis, fence });
        if (seq.current === id) {
          setOutput(result);
          setError(false);
        }
      } catch {
        if (seq.current === id) setError(true);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [input, bullet, emphasis, fence]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-xs text-gray-700">
        <span className="font-semibold text-gray-900">Style</span>
        <label className="flex items-center gap-2">
          List marker
          <select value={bullet} onChange={(e) => setBullet(e.target.value as FormatOptions['bullet'])} className={SELECT_CLASS}>
            <option value="-">- dash</option>
            <option value="*">* asterisk</option>
            <option value="+">+ plus</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          Emphasis
          <select value={emphasis} onChange={(e) => setEmphasis(e.target.value as FormatOptions['emphasis'])} className={SELECT_CLASS}>
            <option value="*">*asterisks*</option>
            <option value="_">_underscores_</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          Code fence
          <select value={fence} onChange={(e) => setFence(e.target.value as FormatOptions['fence'])} className={SELECT_CLASS}>
            <option value="`">``` backticks</option>
            <option value="~">~~~ tildes</option>
          </select>
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex min-h-8 items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Input</h3>
            <span className="text-xs text-gray-500">{input.split('\n').length} lines</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="h-[440px] w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-950 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="Paste messy markdown here..."
          />
        </div>
        <div>
          <div className="mb-2 flex min-h-8 flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-900">Formatted</h3>
            <div className="flex gap-2">
              <button onClick={() => copy(output)} className={BTN_DARK}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <button onClick={() => downloadFile('formatted.md', output, 'text/markdown')} className={BTN_GHOST}>
                Download .md
              </button>
              <button onClick={() => setInput(output)} className={BTN_GHOST} title="Replace the input with the formatted output">
                Use as input
              </button>
            </div>
          </div>
          {error ? (
            <div className="flex h-[440px] items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 px-6 text-sm text-amber-800">
              Could not parse this markdown — check for an unclosed code fence.
            </div>
          ) : (
            <pre className="h-[440px] overflow-auto rounded-2xl bg-gray-950 p-4 text-sm text-gray-200">
              <code>{output}</code>
            </pre>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Formatting is semantic: the document is parsed and re-printed, so the rendered result is
            identical — only the source style changes. Runs fully in your browser.
          </p>
        </div>
      </div>
    </div>
  );
}
