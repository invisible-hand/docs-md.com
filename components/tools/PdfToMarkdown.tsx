'use client';

import { useRef, useState } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { BTN_GHOST, BTN_PRIMARY, downloadFile, useCopy, wordCount } from '@/components/tools/toolkit';

interface Line {
  y: number;
  size: number;
  text: string;
}

/** Reconstruct markdown from positioned pdf.js text items. */
function pageToLines(items: Array<{ str: string; transform: number[]; height: number }>): Line[] {
  const lines: Line[] = [];
  const sorted = items
    .filter((it) => it.str !== undefined)
    .map((it) => ({ str: it.str, x: it.transform[4], y: it.transform[5], size: it.height || Math.abs(it.transform[3]) }))
    .sort((a, b) => b.y - a.y || a.x - b.x);

  for (const it of sorted) {
    const last = lines[lines.length - 1];
    if (last && Math.abs(last.y - it.y) < Math.max(2, it.size * 0.35)) {
      // Same visual line — append, inserting a space unless one is present.
      const needsSpace = last.text && it.str && !last.text.endsWith(' ') && !it.str.startsWith(' ');
      last.text += (needsSpace ? ' ' : '') + it.str;
      last.size = Math.max(last.size, it.size);
    } else {
      lines.push({ y: it.y, size: it.size, text: it.str });
    }
  }
  return lines.map((l) => ({ ...l, text: l.text.replace(/\s+/g, ' ').trim() })).filter((l) => l.text);
}

function linesToMarkdown(pages: Line[][]): string {
  // Body size = most common rounded size across the document.
  const freq = new Map<number, number>();
  for (const page of pages)
    for (const l of page) {
      const s = Math.round(l.size);
      freq.set(s, (freq.get(s) ?? 0) + l.text.length);
    }
  const body = [...freq.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 12;

  const out: string[] = [];
  for (const page of pages) {
    let prev: Line | null = null;
    let paragraph: string[] = [];
    const flush = () => {
      if (paragraph.length) out.push(paragraph.join(' '));
      paragraph = [];
    };
    for (const line of page) {
      const ratio = line.size / body;
      const bullet = line.text.match(/^([•◦▪●‣·–—-])\s+(.*)$/);
      const isHeading = ratio >= 1.15 && line.text.length < 90 && !bullet;
      const bigGap = prev && prev.y - line.y > Math.max(prev.size, line.size) * 1.8;

      if (isHeading) {
        flush();
        const level = ratio >= 1.7 ? '#' : ratio >= 1.35 ? '##' : '###';
        out.push(`${level} ${line.text}`);
      } else if (bullet) {
        flush();
        out.push(`- ${bullet[2]}`);
      } else {
        if (bigGap) flush();
        // Undo end-of-line hyphenation when joining wrapped lines.
        if (paragraph.length && paragraph[paragraph.length - 1].endsWith('-')) {
          paragraph[paragraph.length - 1] = paragraph[paragraph.length - 1].slice(0, -1) + line.text;
        } else {
          paragraph.push(line.text);
        }
      }
      prev = line;
    }
    flush();
  }
  // Consecutive bullets belong to one tight list, not paragraph-separated ones.
  const merged: string[] = [];
  for (const block of out) {
    const last = merged[merged.length - 1];
    if (block.startsWith('- ') && last?.startsWith('- ')) merged[merged.length - 1] = `${last}\n${block}`;
    else merged.push(block);
  }
  return merged.join('\n\n').trim() + '\n';
}

export default function PdfToMarkdown() {
  const [markdown, setMarkdown] = useState('');
  const [filename, setFilename] = useState('document');
  const [status, setStatus] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, copy] = useCopy();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!/\.pdf$/i.test(file.name)) {
      setError('Please choose a .pdf file.');
      setStatus('error');
      return;
    }
    setStatus('working');
    setError('');
    try {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      const doc = await pdfjs.getDocument({
        data: await file.arrayBuffer(),
        standardFontDataUrl: '/standard_fonts/',
      }).promise;
      const pages: Line[][] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        pages.push(pageToLines(content.items as Array<{ str: string; transform: number[]; height: number }>));
      }
      const md = linesToMarkdown(pages);
      if (!md.trim()) {
        setError(
          'No extractable text found — this PDF is probably a scan (images of text). OCR is needed for those, which this tool intentionally does not do.',
        );
        setStatus('error');
        return;
      }
      setMarkdown(md);
      setPageCount(doc.numPages);
      setFilename(file.name.replace(/\.pdf$/i, ''));
      setStatus('done');
    } catch (e) {
      console.error(e);
      setError('Could not read that PDF. If it is password-protected, remove the password first.');
      setStatus('error');
    }
  };

  const stats = wordCount(markdown);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-xl md:p-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          dragging ? 'border-indigo-400 bg-indigo-50/60' : 'border-gray-300 bg-gray-50'
        }`}
      >
        <p className="text-base font-medium text-gray-900">Drop a PDF here</p>
        <p className="mt-1 text-sm text-gray-500">
          Converted entirely in your browser — the file never leaves your machine.
        </p>
        <button type="button" className={`${BTN_PRIMARY} mt-4`} onClick={() => fileInputRef.current?.click()}>
          Choose PDF
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {status === 'working' && <p className="mt-4 text-sm text-indigo-700">Extracting text…</p>}
        {status === 'error' && <p className="mt-4 max-w-md text-sm text-red-600">{error}</p>}
      </div>

      {status === 'done' && (
        <div className="mt-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              {pageCount} page{pageCount === 1 ? '' : 's'} → {stats.words.toLocaleString()} words of markdown. Headings,
              bullets, and paragraphs are inferred — skim the result and adjust where needed.
            </p>
            <div className="flex gap-2">
              <button type="button" className={BTN_GHOST} onClick={() => copy(markdown)}>
                {copied ? 'Copied!' : 'Copy markdown'}
              </button>
              <button
                type="button"
                className={BTN_PRIMARY}
                onClick={() => downloadFile(`${filename}.md`, markdown, 'text/markdown')}
              >
                Download .md
              </button>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              spellCheck={false}
              className="h-[28rem] w-full resize-y rounded-2xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm text-gray-900 focus:border-indigo-400 focus:outline-none"
            />
            <div className="h-[28rem] overflow-auto rounded-2xl border border-gray-200 p-4">
              <MarkdownRenderer content={markdown} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
