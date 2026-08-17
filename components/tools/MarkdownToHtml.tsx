'use client';

import { useEffect, useRef, useState } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { BTN_DARK, BTN_GHOST, downloadFile, useCopy } from '@/components/tools/toolkit';
import type { HtmlConvertOptions } from '@/lib/markdown-pipeline';

const STARTER = `# Release Notes — v2.1

We shipped **three improvements** this week:

1. Faster cold starts
2. A new \`/raw\` endpoint
3. Better error messages

| Endpoint | Latency (p95) |
| -------- | ------------: |
| /api/share | 84 ms |
| /raw/:id | 12 ms |

> Full changelog on the [releases page](https://example.com/releases).
`;

export default function MarkdownToHtml() {
  const [markdown, setMarkdown] = useState(STARTER);
  const [html, setHtml] = useState('');
  const [fullDocument, setFullDocument] = useState(false);
  const [title, setTitle] = useState('Document');
  const [view, setView] = useState<'html' | 'preview'>('html');
  const [copied, copy] = useCopy();
  const seq = useRef(0);

  useEffect(() => {
    const id = ++seq.current;
    const timer = setTimeout(async () => {
      const options: HtmlConvertOptions = { fullDocument, title };
      const { markdownToHtml } = await import('@/lib/markdown-pipeline');
      const result = await markdownToHtml(markdown, options);
      if (seq.current === id) setHtml(result);
    }, 150);
    return () => clearTimeout(timer);
  }, [markdown, fullDocument, title]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <div className="mb-2 flex min-h-8 flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900">Markdown input</h3>
          <span className="text-xs text-gray-500">{markdown.length.toLocaleString()} chars</span>
        </div>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          spellCheck={false}
          className="h-[480px] w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-950 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="# Paste your markdown here..."
        />
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-700">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={fullDocument}
              onChange={(e) => setFullDocument(e.target.checked)}
              className="h-3.5 w-3.5 accent-indigo-600"
            />
            Wrap in a full HTML document (doctype, styles)
          </label>
          {fullDocument ? (
            <label className="flex items-center gap-2">
              Page title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-40 rounded-lg border border-gray-200 px-2 py-1 focus:border-indigo-400 focus:outline-none"
              />
            </label>
          ) : null}
        </div>
      </div>

      <div>
        <div className="mb-2 flex min-h-8 flex-wrap items-center justify-between gap-2">
          <div className="flex rounded-lg border border-gray-200 p-0.5 text-xs font-medium">
            <button
              onClick={() => setView('html')}
              className={`rounded-md px-3 py-1 transition ${view === 'html' ? 'bg-gray-950 text-white' : 'text-gray-600 hover:text-gray-950'}`}
            >
              HTML
            </button>
            <button
              onClick={() => setView('preview')}
              className={`rounded-md px-3 py-1 transition ${view === 'preview' ? 'bg-gray-950 text-white' : 'text-gray-600 hover:text-gray-950'}`}
            >
              Preview
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => copy(html)} className={BTN_DARK}>
              {copied ? '✓ Copied' : 'Copy HTML'}
            </button>
            <button
              onClick={() => downloadFile(`${title.trim() || 'document'}.html`, html, 'text/html')}
              className={BTN_GHOST}
            >
              Download .html
            </button>
          </div>
        </div>
        {view === 'html' ? (
          <pre className="h-[480px] overflow-auto whitespace-pre-wrap break-all rounded-2xl bg-gray-950 p-4 text-sm text-gray-200">
            <code>{html}</code>
          </pre>
        ) : (
          <div className="h-[480px] overflow-y-auto rounded-2xl border border-gray-200 bg-white px-6 py-5">
            <MarkdownRenderer content={markdown} />
          </div>
        )}
        <p className="mt-2 text-xs text-gray-500">
          Conversion runs entirely in your browser — nothing is uploaded. Inline HTML in your
          markdown passes through unchanged.
        </p>
      </div>
    </div>
  );
}
