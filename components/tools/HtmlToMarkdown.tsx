'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { BTN_DARK, BTN_GHOST, BTN_PRIMARY, downloadFile, useCopy, wordCount } from '@/components/tools/toolkit';

const STARTER = `<article>
  <h1>Release notes</h1>
  <p>Version <strong>2.4</strong> ships the <em>long-requested</em> export options. See the <a href="https://example.com/docs" title="Documentation">docs</a> for details.</p>
  <h2>Highlights</h2>
  <ul>
    <li>Export to PDF and Word</li>
    <li>Nested lists
      <ul><li>work too</li></ul>
    </li>
    <li><input type="checkbox" checked disabled> Task lists are preserved</li>
  </ul>
  <table>
    <thead><tr><th>Format</th><th>Status</th></tr></thead>
    <tbody>
      <tr><td>PDF</td><td>Done</td></tr>
      <tr><td>Word</td><td><del>Planned</del> Shipped</td></tr>
    </tbody>
  </table>
  <pre><code class="language-js">npm install docs-md@2.4</code></pre>
  <blockquote><p>Thanks to everyone who tested the beta.</p></blockquote>
</article>`;

interface Options {
  headingStyle: 'atx' | 'setext';
  bullet: '-' | '*' | '+';
  linkStyle: 'inlined' | 'referenced';
  stripImages: boolean;
  stripChrome: boolean;
  richPaste: boolean;
}

const LABEL = 'text-xs font-semibold uppercase tracking-wide text-gray-500';
const SELECT = 'rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 focus:border-indigo-400 focus:outline-none';

function stripChromeFromHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script, style, noscript, nav, header, footer, iframe, template').forEach((n) => n.remove());
  return doc.body.innerHTML;
}

async function convert(html: string, opts: Options): Promise<string> {
  const [{ default: TurndownService }, plugin] = await Promise.all([import('turndown'), import('turndown-plugin-gfm')]);
  const td = new TurndownService({
    headingStyle: opts.headingStyle,
    bulletListMarker: opts.bullet,
    codeBlockStyle: 'fenced',
    linkStyle: opts.linkStyle,
    emDelimiter: '*',
  });
  td.use(plugin.gfm);
  if (opts.stripImages) td.remove('img');
  const source = opts.stripChrome ? stripChromeFromHtml(html) : html;
  return td.turndown(source).replace(/\n{3,}/g, '\n\n').trim();
}

export default function HtmlToMarkdown() {
  const [html, setHtml] = useState(STARTER);
  const [markdown, setMarkdown] = useState('');
  const [error, setError] = useState('');
  const [view, setView] = useState<'markdown' | 'preview'>('markdown');
  const [dragging, setDragging] = useState(false);
  const [pasteNote, setPasteNote] = useState('');
  const [opts, setOpts] = useState<Options>({
    headingStyle: 'atx',
    bullet: '-',
    linkStyle: 'inlined',
    stripImages: false,
    stripChrome: true,
    richPaste: true,
  });
  const [copied, copy] = useCopy();
  const fileInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Options>(key: K, value: Options[K]) => setOpts((p) => ({ ...p, [key]: value }));

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      if (!html.trim()) {
        setMarkdown('');
        setError('');
        return;
      }
      try {
        const out = await convert(html, opts);
        if (!cancelled) {
          setMarkdown(out);
          setError('');
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Conversion failed');
      }
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [html, opts]);

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!opts.richPaste) return;
    const rich = e.clipboardData.getData('text/html');
    if (!rich) return;
    e.preventDefault();
    setHtml(rich);
    setPasteNote('Pasted rich text as HTML (turn off "rich-text clipboard" to paste raw source).');
  };

  const loadFile = useCallback((file: File | undefined) => {
    if (!file) return;
    file.text().then((text) => {
      setHtml(text);
      setPasteNote(`Loaded ${file.name} (${(file.size / 1024).toFixed(1)} KB).`);
    });
  }, []);

  const stats = useMemo(() => {
    const inBytes = new TextEncoder().encode(html).length;
    const { words } = wordCount(markdown);
    return `${inBytes.toLocaleString()} bytes of HTML → ${words.toLocaleString()} words, ${markdown.length.toLocaleString()} characters of markdown`;
  }, [html, markdown]);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-xl md:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-700">
        <label className="flex items-center gap-1.5">
          <span className={LABEL}>Headings</span>
          <select value={opts.headingStyle} onChange={(e) => set('headingStyle', e.target.value as Options['headingStyle'])} className={SELECT}>
            <option value="atx"># ATX</option>
            <option value="setext">Setext (underlined)</option>
          </select>
        </label>
        <label className="flex items-center gap-1.5">
          <span className={LABEL}>Bullets</span>
          <select value={opts.bullet} onChange={(e) => set('bullet', e.target.value as Options['bullet'])} className={SELECT}>
            <option value="-">-</option>
            <option value="*">*</option>
            <option value="+">+</option>
          </select>
        </label>
        <label className="flex items-center gap-1.5">
          <span className={LABEL}>Links</span>
          <select value={opts.linkStyle} onChange={(e) => set('linkStyle', e.target.value as Options['linkStyle'])} className={SELECT}>
            <option value="inlined">Inline</option>
            <option value="referenced">Reference style</option>
          </select>
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={opts.stripChrome} onChange={(e) => set('stripChrome', e.target.checked)} />
          Strip scripts, styles, nav
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={opts.stripImages} onChange={(e) => set('stripImages', e.target.checked)} />
          Drop images
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={opts.richPaste} onChange={(e) => set('richPaste', e.target.checked)} />
          Use rich-text clipboard
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div
          className={`flex h-[520px] flex-col rounded-2xl border ${dragging ? 'border-indigo-400 bg-indigo-50/40' : 'border-gray-200 bg-gray-50'}`}
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
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-4 py-2">
            <span className={LABEL}>HTML source — or paste copied web content</span>
            <div className="flex gap-2">
              <button type="button" className={BTN_GHOST} onClick={() => fileInput.current?.click()}>
                Open .html
              </button>
              <button
                type="button"
                className={BTN_GHOST}
                onClick={() => {
                  setHtml('');
                  setPasteNote('');
                }}
              >
                Clear
              </button>
              <input
                ref={fileInput}
                type="file"
                accept=".html,.htm,text/html"
                className="hidden"
                onChange={(e) => loadFile(e.target.files?.[0])}
              />
            </div>
          </div>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            onPaste={handlePaste}
            spellCheck={false}
            aria-label="HTML input"
            placeholder="Paste HTML source here, paste content copied from a web page, or drop an .html file."
            className="flex-1 resize-none bg-transparent p-4 font-mono text-sm text-gray-900 focus:outline-none"
          />
          {pasteNote && <p className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500">{pasteNote}</p>}
        </div>

        <div className="flex h-[520px] flex-col rounded-2xl border border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-4 py-2">
            <div className="inline-flex rounded-full border border-gray-200 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setView('markdown')}
                className={`rounded-full px-3 py-1 font-medium transition ${view === 'markdown' ? 'bg-gray-950 text-white' : 'text-gray-600 hover:text-gray-950'}`}
              >
                Markdown
              </button>
              <button
                type="button"
                onClick={() => setView('preview')}
                className={`rounded-full px-3 py-1 font-medium transition ${view === 'preview' ? 'bg-gray-950 text-white' : 'text-gray-600 hover:text-gray-950'}`}
              >
                Preview
              </button>
            </div>
            <div className="flex gap-2">
              <button type="button" className={BTN_PRIMARY} onClick={() => copy(markdown)} disabled={!markdown}>
                {copied ? 'Copied ✓' : 'Copy markdown'}
              </button>
              <button
                type="button"
                className={BTN_DARK}
                onClick={() => downloadFile('converted.md', markdown, 'text/markdown')}
                disabled={!markdown}
              >
                Download .md
              </button>
            </div>
          </div>
          {error ? (
            <p className="p-4 text-sm text-red-600">{error}</p>
          ) : view === 'markdown' ? (
            <textarea
              value={markdown}
              readOnly
              spellCheck={false}
              aria-label="Markdown output"
              placeholder="Markdown appears here."
              className="flex-1 resize-none bg-transparent p-4 font-mono text-sm text-gray-900 focus:outline-none"
            />
          ) : (
            <div className="flex-1 overflow-auto p-4">
              {markdown ? <MarkdownRenderer content={markdown} /> : <p className="text-sm text-gray-400">Nothing to preview yet.</p>}
            </div>
          )}
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-500">{stats}. Everything runs in your browser.</p>
    </div>
  );
}
