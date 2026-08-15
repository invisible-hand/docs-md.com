'use client';

import { useRef, useState } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-900">Markdown input</h3>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.markdown,.txt"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-gray-300 px-4 py-1.5 text-xs font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700"
              >
                Open .md file
              </button>
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={22}
            className="h-[480px] w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-950 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="# Paste your markdown here..."
          />
        </div>
        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-900">Preview (this becomes the PDF)</h3>
            <div className="flex items-center gap-2">
              <input
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-36 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-800 focus:border-indigo-400 focus:outline-none"
                aria-label="PDF filename"
              />
              <span className="text-xs text-gray-500">.pdf</span>
              <button
                onClick={handleDownload}
                className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
              >
                Download PDF
              </button>
            </div>
          </div>
          <div className="h-[480px] overflow-y-auto rounded-2xl border border-gray-200 bg-white px-6 py-5">
            <MarkdownRenderer content={content} />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Your browser&apos;s print dialog opens — choose <strong>Save as PDF</strong> as the
            destination. Output is real selectable text, not a screenshot.
          </p>
        </div>
      </div>

      {/* Print-only rendering: expands to full width when the print dialog opens */}
      <div className="print-only hidden">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
}
