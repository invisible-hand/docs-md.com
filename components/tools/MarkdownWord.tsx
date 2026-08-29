'use client';

import { useState } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { BTN_GHOST, BTN_PRIMARY, useCopy } from '@/components/tools/toolkit';

const STARTER = `# Status Report

## Summary

Everything is **on track** for the *September* release.

| Workstream | Status |
| ---------- | ------ |
| Backend    | Done   |
| Frontend   | In QA  |

1. Finish QA sign-off
2. Update the runbook
`;

/** Word opens .doc files that are really HTML — the classic interop path. */
function buildWordDoc(bodyHtml: string): string {
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head><meta charset="utf-8"><title>Document</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->
<style>
body{font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.4}
h1{font-size:20pt}h2{font-size:15pt}h3{font-size:13pt}
code,pre{font-family:Consolas,'Courier New',monospace;font-size:10pt}
pre{background:#f3f3f3;padding:8pt;border:1pt solid #ddd}
table{border-collapse:collapse}td,th{border:1pt solid #999;padding:4pt 8pt}
blockquote{border-left:3pt solid #ccc;margin-left:0;padding-left:10pt;color:#555}
</style></head><body>${bodyHtml}</body></html>`;
}

export default function MarkdownWord() {
  const [dir, setDir] = useState<'md2word' | 'word2md'>('md2word');
  const [markdown, setMarkdown] = useState(STARTER);
  const [pasted, setPasted] = useState('');
  const [converted, setConverted] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, copy] = useCopy();

  const downloadDoc = async () => {
    setBusy(true);
    try {
      const { markdownToHtml } = await import('@/lib/markdown-pipeline');
      const html = await markdownToHtml(markdown, { fullDocument: false, title: 'document' });
      const blob = new Blob([buildWordDoc(html)], { type: 'application/msword' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'document.doc';
      a.click();
      URL.revokeObjectURL(a.href);
    } finally {
      setBusy(false);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');
    e.preventDefault();
    if (!html && !text) return;
    setPasted(text.slice(0, 400));
    if (!html) {
      setConverted(text);
      return;
    }
    const [{ default: TurndownService }, gfm] = await Promise.all([
      import('turndown'),
      import('turndown-plugin-gfm'),
    ]);
    const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' });
    td.use(gfm.gfm);
    setConverted(td.turndown(html).replace(/\n{3,}/g, '\n\n').trim());
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-xl md:p-6">
      <div className="mb-5 inline-flex rounded-full border border-gray-200 p-1">
        <button
          type="button"
          onClick={() => setDir('md2word')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${dir === 'md2word' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-indigo-700'}`}
        >
          Markdown → Word
        </button>
        <button
          type="button"
          onClick={() => setDir('word2md')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${dir === 'word2md' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-indigo-700'}`}
        >
          Word → Markdown
        </button>
      </div>

      {dir === 'md2word' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            spellCheck={false}
            aria-label="Markdown input"
            className="h-96 w-full resize-y rounded-2xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm text-gray-900 focus:border-indigo-400 focus:outline-none"
          />
          <div className="flex h-96 flex-col rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Preview (what Word will show)
              </span>
              <button type="button" className={BTN_PRIMARY} onClick={downloadDoc} disabled={busy}>
                {busy ? 'Building…' : 'Download .doc'}
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <MarkdownRenderer content={markdown} />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div
            role="textbox"
            aria-label="Paste from Word here"
            tabIndex={0}
            onPaste={handlePaste}
            className="flex h-96 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center focus:border-indigo-400 focus:outline-none"
          >
            <p className="text-base font-medium text-gray-900">Click here, then paste from Word</p>
            <p className="mt-1 max-w-xs text-sm text-gray-500">
              Copy in Word (Ctrl/Cmd+C), click this box, paste (Ctrl/Cmd+V). The formatting arrives
              as HTML and is converted locally — nothing is uploaded.
            </p>
            {pasted && <p className="mt-4 line-clamp-3 max-w-sm text-xs text-gray-400">Received: {pasted}…</p>}
          </div>
          <div className="flex h-96 flex-col rounded-2xl border border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Markdown</span>
              <button type="button" className={BTN_GHOST} onClick={() => copy(converted)} disabled={!converted}>
                {copied ? 'Copied!' : 'Copy markdown'}
              </button>
            </div>
            <textarea
              value={converted}
              onChange={(e) => setConverted(e.target.value)}
              spellCheck={false}
              aria-label="Converted markdown"
              className="flex-1 resize-none bg-transparent p-4 font-mono text-sm text-gray-900 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
