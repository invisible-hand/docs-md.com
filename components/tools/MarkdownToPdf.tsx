'use client';

import { useDeferredValue, useRef, useState } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { BTN_GHOST, BTN_PRIMARY, wordCount } from '@/components/tools/toolkit';

const STARTER = `# Quarterly Report

## Summary

Paste your **markdown** on the left — the preview on the right is exactly what your PDF will look like.

## Details

| Metric | Q2 | Q3 |
| ------ | -- | -- |
| Users  | 1,204 | 1,890 |
| Uptime | 99.9% | 99.95% |

\`\`\`js
console.log("code blocks keep their highlighting");
\`\`\`
`;

export default function MarkdownToPdf() {
  const [content, setContent] = useState(STARTER);
  const [filename, setFilename] = useState('document');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Defer the preview (and the hidden print copy) so keystrokes never wait on
  // a full markdown re-render of a large document.
  const deferredContent = useDeferredValue(content);
  const stats = wordCount(content);

  const handleDownload = () => {
    const originalTitle = document.title;
    document.title = filename.trim() || 'document';
    window.print();
    document.title = originalTitle;
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const text = await file.text();
    setContent(text);
    setFilename(file.name.replace(/\.(md|markdown|txt)$/i, ''));
  };

  return (
    <div>
      <div className="no-print grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex min-h-8 flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-900">Markdown input</h3>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">
                {stats.words.toLocaleString()} words
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.markdown,.txt"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <button onClick={() => fileInputRef.current?.click()} className={BTN_GHOST}>
                Open .md file
              </button>
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            rows={22}
            spellCheck={false}
            className={`h-[480px] w-full resize-none rounded-2xl border bg-gray-50 px-4 py-3 font-mono text-sm text-gray-950 transition-colors focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              dragging ? 'border-indigo-400 bg-indigo-50/50' : 'border-gray-200'
            }`}
            placeholder="# Paste your markdown here, or drop a .md file..."
          />
        </div>
        <div>
          <div className="mb-2 flex min-h-8 flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-900">Preview (this becomes the PDF)</h3>
            <div className="flex items-center gap-2">
              <input
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-36 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-800 focus:border-indigo-400 focus:outline-none"
                aria-label="PDF filename"
              />
              <span className="text-xs text-gray-500">.pdf</span>
              <button onClick={handleDownload} className={BTN_PRIMARY}>
                Download PDF
              </button>
            </div>
          </div>
          <div className="h-[480px] overflow-y-auto rounded-2xl border border-gray-200 bg-white px-6 py-5">
            <MarkdownRenderer content={deferredContent} />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Your browser&apos;s print dialog opens — choose <strong>Save as PDF</strong> as the
            destination. Output is real selectable text, not a screenshot.
          </p>
        </div>
      </div>

      {/* Print-only rendering: expands to full width when the print dialog opens */}
      <div className="print-only hidden">
        <MarkdownRenderer content={deferredContent} />
      </div>
    </div>
  );
}
