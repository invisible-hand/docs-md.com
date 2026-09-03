'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { BTN_DARK, BTN_GHOST, BTN_PRIMARY, downloadFile, useCopy, wordCount } from '@/components/tools/toolkit';
import { extractToc } from '@/lib/toc';

const STARTER = `# Markdown viewer

Drop a \`.md\` file onto this page, paste markdown, or load a file from a URL — it renders here with tables, highlighted code, task lists, and mermaid diagrams.

## What you can do

- [x] Read a README without cloning the repo
- [x] Print it or save as PDF from the browser
- [ ] Share the rendered page as a link (30-day expiry)

| Control | Effect |
| ------- | ------ |
| Font size | S / M / L |
| Width | Narrow for reading, wide for tables |
| Outline | Jump between headings |

\`\`\`mermaid
flowchart LR
  A[.md file] --> B{Viewer}
  B --> C[Print]
  B --> D[Share link]
\`\`\`

> Tip: link straight to a rendered file with \`?url=https://raw.githubusercontent.com/...\`
`;

const LABEL = 'text-xs font-semibold uppercase tracking-wide text-gray-500';

function toRawUrl(input: string): string {
  const m = input.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/);
  if (m) return `https://raw.githubusercontent.com/${m[1]}/${m[2]}/${m[3]}`;
  return input;
}

function formatSize(bytes: number): string {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}

export default function MarkdownViewer() {
  const [content, setContent] = useState(STARTER);
  const [fileName, setFileName] = useState('untitled.md');
  const [editing, setEditing] = useState(true);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fontSize, setFontSize] = useState<'S' | 'M' | 'L'>('M');
  const [wide, setWide] = useState(false);
  const [paper, setPaper] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [shareState, setShareState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, copy] = useCopy();
  const fileInput = useRef<HTMLInputElement>(null);

  const loadFromUrl = useCallback(async (raw: string) => {
    const target = toRawUrl(raw.trim());
    if (!target) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(target);
      if (!res.ok) throw new Error(`Server answered ${res.status}`);
      const text = await res.text();
      setContent(text);
      setFileName(target.split('/').pop() || 'document.md');
      setEditing(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(
        msg.includes('fetch')
          ? 'Could not fetch that URL from the browser — the host does not allow cross-origin reads (CORS). Download the file and drop it here instead. GitHub raw and gist URLs work.'
          : `Could not load: ${msg}`,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('url');
    if (param) {
      setUrl(param);
      loadFromUrl(param);
    }
  }, [loadFromUrl]);

  const loadFile = useCallback((file: File | undefined) => {
    if (!file) return;
    file.text().then((text) => {
      setContent(text);
      setFileName(file.name);
      setEditing(false);
      setError('');
    });
  }, []);

  const handleShare = async () => {
    setShareState('loading');
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, filename: fileName, expiry: '30d' }),
      });
      if (!response.ok) throw new Error('share failed');
      const data = (await response.json()) as { url: string };
      setShareUrl(data.url);
      setShareState('done');
    } catch {
      setShareState('idle');
      setError('Sharing failed — please try again.');
    }
  };

  const toc = useMemo(() => extractToc(content), [content]);
  const stats = useMemo(() => wordCount(content), [content]);
  const size = useMemo(() => new TextEncoder().encode(content).length, [content]);
  const fontClass = fontSize === 'S' ? 'text-sm' : fontSize === 'L' ? 'text-lg' : 'text-base';

  return (
    <div
      className={`rounded-3xl border bg-white p-4 shadow-xl md:p-6 ${dragging ? 'border-indigo-400' : 'border-gray-200'} print:border-0 print:p-0 print:shadow-none`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        loadFile(e.dataTransfer.files[0]);
      }}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2 print:hidden">
        <button type="button" className={BTN_PRIMARY} onClick={() => fileInput.current?.click()}>
          Open .md file
        </button>
        <input
          ref={fileInput}
          type="file"
          accept=".md,.markdown,.txt,.mdx,text/markdown,text/plain"
          className="hidden"
          onChange={(e) => loadFile(e.target.files?.[0])}
        />
        <form
          className="flex min-w-0 flex-1 items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            loadFromUrl(url);
          }}
        >
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/owner/repo/blob/main/README.md"
            aria-label="Load markdown from URL"
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-indigo-400 focus:outline-none"
          />
          <button type="submit" className={BTN_GHOST} disabled={loading || !url.trim()}>
            {loading ? 'Loading…' : 'Load from URL'}
          </button>
        </form>
        <button type="button" className={BTN_GHOST} onClick={() => setEditing((v) => !v)}>
          {editing ? 'Hide source' : 'Edit source'}
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-700 print:hidden">
        <div className="flex items-center gap-1.5">
          <span className={LABEL}>Size</span>
          <div className="inline-flex rounded-full border border-gray-200 p-0.5">
            {(['S', 'M', 'L'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFontSize(s)}
                className={`rounded-full px-2.5 py-0.5 font-medium transition ${fontSize === s ? 'bg-gray-950 text-white' : 'text-gray-600 hover:text-gray-950'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={wide} onChange={(e) => setWide(e.target.checked)} /> Wide
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={paper} onChange={(e) => setPaper(e.target.checked)} /> Paper
        </label>
        <span className="ml-auto text-gray-500">
          {fileName} · {formatSize(size)} · {stats.words.toLocaleString()} words
        </span>
        <button type="button" className={BTN_GHOST} onClick={() => window.print()}>
          Print / PDF
        </button>
        <button type="button" className={BTN_GHOST} onClick={() => copy(content)}>
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
        <button type="button" className={BTN_GHOST} onClick={() => downloadFile(fileName.endsWith('.md') ? fileName : `${fileName}.md`, content, 'text/markdown')}>
          Download
        </button>
        <button type="button" className={BTN_DARK} onClick={handleShare} disabled={shareState === 'loading' || !content.trim()}>
          {shareState === 'loading' ? 'Sharing…' : 'Share as link'}
        </button>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700 print:hidden">{error}</p>}
      {shareState === 'done' && (
        <p className="mb-4 text-sm text-gray-600 print:hidden">
          Live at{' '}
          <Link href={shareUrl} className="text-indigo-700 underline">
            {shareUrl}
          </Link>{' '}
          (expires in 30 days)
        </p>
      )}

      <div className={`grid gap-4 ${editing ? 'lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]' : toc.length > 1 ? 'lg:grid-cols-[200px_minmax(0,1fr)]' : ''}`}>
        {editing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
            aria-label="Markdown source"
            placeholder="Paste markdown here, or drop a .md file anywhere on this panel."
            className="h-[70vh] w-full resize-y rounded-2xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm text-gray-900 focus:border-indigo-400 focus:outline-none print:hidden"
          />
        ) : toc.length > 1 ? (
          <nav aria-label="Outline" className="hidden lg:block print:hidden">
            <p className={`${LABEL} mb-2`}>Outline</p>
            <ul className="sticky top-24 max-h-[70vh] space-y-1 overflow-auto text-xs">
              {toc.map((h, i) => (
                <li key={`${h.slug}-${i}`} style={{ paddingLeft: `${(h.depth - 1) * 10}px` }}>
                  <a href={`#${h.slug}`} className="text-gray-600 hover:text-indigo-700">
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
        <article
          className={`min-w-0 overflow-auto rounded-2xl ${paper ? 'border border-gray-200 bg-white shadow-sm' : 'bg-transparent'} ${fontClass} px-6 py-6 md:px-10 print:border-0 print:shadow-none ${editing ? 'h-[70vh]' : ''}`}
        >
          <div className={`mx-auto ${wide ? 'max-w-none' : 'max-w-3xl'}`}>
            {content.trim() ? (
              <MarkdownRenderer content={content} />
            ) : (
              <p className="text-sm text-gray-400">Nothing to show yet — paste markdown or open a file.</p>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
