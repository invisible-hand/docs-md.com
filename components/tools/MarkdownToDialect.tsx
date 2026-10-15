'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ConvertOptions, ConvertResult, Dialect } from '@/lib/markdown-dialects';
import { BTN_DARK, BTN_GHOST, BTN_PRIMARY, downloadFile, useCopy } from '@/components/tools/toolkit';

const STARTER = `# Release notes

Version **2.4** ships the _long-requested_ export options. See the [docs](https://example.com/docs) for details; the old flag is ~~deprecated~~ removed.

## Highlights

- Export to PDF and Word
- Nested lists
  - work too
- [x] Task lists are preserved

| Format | Status |
|--------|--------|
| PDF    | Done   |
| Word   | Shipped |

\`\`\`js
npm install docs-md@2.4
\`\`\`

> Thanks to everyone who tested the beta.
`;

const LABEL = 'text-xs font-semibold uppercase tracking-wide text-gray-500';
const SELECT = 'rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 focus:border-indigo-400 focus:outline-none';

const FILE: Record<Dialect, { name: string; label: string }> = {
  slack: { name: 'message.slack.txt', label: 'Slack mrkdwn' },
  discord: { name: 'message.discord.md', label: 'Discord markdown' },
  jira: { name: 'description.jira.txt', label: 'Jira wiki markup' },
  plain: { name: 'document.txt', label: 'Plain text' },
};

interface Props {
  dialect: Dialect;
}

export default function MarkdownToDialect({ dialect }: Props) {
  const [markdown, setMarkdown] = useState(STARTER);
  const [result, setResult] = useState<ConvertResult>({ output: '', warnings: [] });
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [note, setNote] = useState('');
  const [opts, setOpts] = useState<ConvertOptions>({ keepLinkUrls: true, slackTarget: 'api', discordLinks: 'masked' });
  const [copied, copy] = useCopy();
  const fileInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof ConvertOptions>(key: K, value: ConvertOptions[K]) => setOpts((p) => ({ ...p, [key]: value }));

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      if (!markdown.trim()) {
        setResult({ output: '', warnings: [] });
        setError('');
        return;
      }
      try {
        const { convertMarkdown } = await import('@/lib/markdown-dialects');
        const out = convertMarkdown(markdown, dialect, opts);
        if (!cancelled) {
          setResult(out);
          setError('');
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Conversion failed');
      }
    }, 120);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [markdown, dialect, opts]);

  const loadFile = (file: File | undefined) => {
    if (!file) return;
    file.text().then((text) => {
      setMarkdown(text);
      setNote(`Loaded ${file.name} (${(file.size / 1024).toFixed(1)} KB).`);
    });
  };

  const stats = useMemo(
    () => `${markdown.length.toLocaleString()} characters of markdown → ${result.output.length.toLocaleString()} characters of ${FILE[dialect].label}`,
    [markdown, result.output, dialect],
  );

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-xl md:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-700">
        {dialect === 'slack' && (
          <label className="flex items-center gap-1.5">
            <span className={LABEL}>Target</span>
            <select value={opts.slackTarget} onChange={(e) => set('slackTarget', e.target.value as ConvertOptions['slackTarget'])} className={SELECT}>
              <option value="api">API / Block Kit (&lt;url|text&gt;, escaped &amp; &lt; &gt;)</option>
              <option value="composer">Message composer (plain URLs)</option>
            </select>
          </label>
        )}
        {dialect === 'discord' && (
          <label className="flex items-center gap-1.5">
            <span className={LABEL}>Links</span>
            <select value={opts.discordLinks} onChange={(e) => set('discordLinks', e.target.value as ConvertOptions['discordLinks'])} className={SELECT}>
              <option value="masked">Masked [text](url)</option>
              <option value="plain">Plain text (url)</option>
            </select>
          </label>
        )}
        {dialect === 'plain' && (
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={Boolean(opts.keepLinkUrls)} onChange={(e) => set('keepLinkUrls', e.target.checked)} />
            Keep link URLs as &quot;text (url)&quot;
          </label>
        )}
        {dialect === 'jira' && <span className="text-gray-500">Wiki markup for the description and comment fields of Jira, and for Confluence wiki editors.</span>}
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
            <span className={LABEL}>Markdown</span>
            <div className="flex gap-2">
              <button type="button" className={BTN_GHOST} onClick={() => fileInput.current?.click()}>
                Open .md
              </button>
              <button
                type="button"
                className={BTN_GHOST}
                onClick={() => {
                  setMarkdown('');
                  setNote('');
                }}
              >
                Clear
              </button>
              <input ref={fileInput} type="file" accept=".md,.markdown,.txt,text/markdown,text/plain" className="hidden" onChange={(e) => loadFile(e.target.files?.[0])} />
            </div>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            spellCheck={false}
            aria-label="Markdown input"
            placeholder="Paste markdown here or drop a .md file."
            className="flex-1 resize-none bg-transparent p-4 font-mono text-sm text-gray-900 focus:outline-none"
          />
          {note && <p className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500">{note}</p>}
        </div>

        <div className="flex h-[520px] flex-col rounded-2xl border border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-4 py-2">
            <span className={LABEL}>{FILE[dialect].label}</span>
            <div className="flex gap-2">
              <button type="button" className={BTN_PRIMARY} onClick={() => copy(result.output)} disabled={!result.output}>
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
              <button type="button" className={BTN_DARK} onClick={() => downloadFile(FILE[dialect].name, result.output, 'text/plain')} disabled={!result.output}>
                Download
              </button>
            </div>
          </div>
          {error ? (
            <p className="p-4 text-sm text-red-600">{error}</p>
          ) : (
            <textarea
              value={result.output}
              readOnly
              spellCheck={false}
              aria-label={`${FILE[dialect].label} output`}
              placeholder="Converted text appears here."
              className="flex-1 resize-none bg-transparent p-4 font-mono text-sm text-gray-900 focus:outline-none"
            />
          )}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" aria-live="polite">
        <p className="font-semibold">
          {result.warnings.length === 0
            ? 'No approximations: every element has a direct equivalent.'
            : `${result.warnings.length} approximation${result.warnings.length === 1 ? '' : 's'} — elements ${FILE[dialect].label} cannot express exactly:`}
        </p>
        {result.warnings.length > 0 && (
          <ul className="mt-2 space-y-1">
            {result.warnings.map((w, i) => (
              <li key={`${w.line}-${w.element}-${i}`} className="flex gap-2">
                <span className="shrink-0 font-mono text-xs text-amber-700">line {w.line}</span>
                <span>
                  <span className="font-medium">{w.element}</span>: {w.action}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-3 text-xs text-gray-500">{stats}. Everything runs in your browser; nothing is uploaded.</p>
    </div>
  );
}
