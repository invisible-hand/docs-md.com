'use client';

import { useMemo, useRef, useState } from 'react';
import { BTN_GHOST, BTN_PRIMARY, useCopy } from '@/components/tools/toolkit';
import { analyzeLinks, externalUrls, type CheckedLink } from '@/lib/markdown-links';

const STARTER = `# Release notes

See the [installation guide](#installation) and the [API reference](#api-reference).

## Installation

Download from [GitHub](https://github.com/vercel/next.js) or read the
[docs](https://nextjs.org/docs). The old wiki lives at
<https://example.com/this-page-does-not-exist-404>.

Short link that redirects: http://github.com/vercel/next.js

## Usage

Config lives in [config.md](./docs/config.md#options). Questions? Email <mailto:team@example.com>.

Related: the [changelog][changelog] and the [roadmap][roadmap].

![Architecture](./images/architecture.png)

Docs again: [Next.js docs](https://nextjs.org/docs)

[changelog]: https://github.com/vercel/next.js/releases
`;

interface RemoteResult {
  url: string;
  status: number;
  ok: boolean;
  finalUrl: string;
  redirected: boolean;
  ms: number;
  error?: string;
}

type Filter = 'all' | 'problems';

const KIND_LABEL: Record<CheckedLink['kind'], string> = {
  link: 'link',
  image: 'image',
  reference: 'reference',
  autolink: 'autolink',
  bare: 'bare URL',
  html: 'HTML',
};

function Pill({ tone, children, title }: { tone: 'green' | 'amber' | 'red' | 'gray' | 'blue'; children: React.ReactNode; title?: string }) {
  const cls = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    gray: 'bg-gray-100 text-gray-600 border-gray-200',
    blue: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  }[tone];
  return (
    <span title={title} className={`inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}

function externalKey(url: string): string {
  return url.startsWith('//') ? `https:${url}` : url;
}

export default function LinkChecker() {
  const [content, setContent] = useState(STARTER);
  const [remote, setRemote] = useState<Record<string, RemoteResult>>({});
  const [checking, setChecking] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [copiedReport, copyReport] = useCopy();
  const [copiedBroken, copyBroken] = useCopy();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const analysis = useMemo(() => analyzeLinks(content), [content]);
  const external = useMemo(() => externalUrls(analysis.links), [analysis]);

  const isProblem = (link: CheckedLink): boolean => {
    if (link.verdict.state === 'anchor-missing' || link.verdict.state === 'undefined-reference') return true;
    if (link.duplicate) return true;
    if (link.verdict.state === 'external') {
      const r = remote[externalKey(link.url)];
      return !!r && (!r.ok || r.redirected);
    }
    return false;
  };

  const rows = filter === 'all' ? analysis.links : analysis.links.filter(isProblem);

  const stats = useMemo(() => {
    let ok = 0, redirected = 0, broken = 0, skipped = 0, pending = 0;
    for (const link of analysis.links) {
      switch (link.verdict.state) {
        case 'anchor-ok':
          ok++;
          break;
        case 'anchor-missing':
        case 'undefined-reference':
          broken++;
          break;
        case 'relative':
        case 'unchecked':
          skipped++;
          break;
        case 'external': {
          const r = remote[externalKey(link.url)];
          if (!r) pending++;
          else if (!r.ok) broken++;
          else if (r.redirected) redirected++;
          else ok++;
        }
      }
    }
    return { ok, redirected, broken, skipped, pending };
  }, [analysis, remote]);

  const runCheck = async () => {
    if (!external.length) return;
    setChecking(true);
    setError('');
    setRemote({});
    setProgress({ done: 0, total: external.length });
    const merged: Record<string, RemoteResult> = {};
    try {
      for (let i = 0; i < external.length; i += 25) {
        const batch = external.slice(i, i + 25);
        const res = await fetch('/api/check-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: batch }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `Check failed (${res.status})`);
        }
        const data = (await res.json()) as { results: RemoteResult[] };
        for (const r of data.results) merged[r.url] = r;
        setRemote({ ...merged });
        setProgress({ done: Math.min(i + 25, external.length), total: external.length });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Check failed');
    } finally {
      setChecking(false);
    }
  };

  const selectLine = (line: number) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const lines = content.split('\n');
    const start = lines.slice(0, line - 1).reduce((n, l) => n + l.length + 1, 0);
    const end = start + (lines[line - 1]?.length ?? 0);
    ta.focus();
    ta.setSelectionRange(start, end);
    // Scroll the selection roughly into view.
    const lineHeight = 20;
    ta.scrollTop = Math.max(0, (line - 3) * lineHeight);
  };

  const describe = (link: CheckedLink): { tone: 'green' | 'amber' | 'red' | 'gray' | 'blue'; label: string; detail?: string } => {
    switch (link.verdict.state) {
      case 'anchor-ok':
        return { tone: 'green', label: 'anchor found' };
      case 'anchor-missing':
        return { tone: 'red', label: 'anchor missing', detail: `no heading produces #${link.verdict.anchor}` };
      case 'undefined-reference':
        return { tone: 'red', label: 'undefined reference', detail: `no [${link.verdict.refId}]: url line` };
      case 'relative':
        return { tone: 'gray', label: "relative — can't check from here" };
      case 'unchecked':
        return { tone: 'gray', label: 'not checked' };
      case 'external': {
        const r = remote[externalKey(link.url)];
        if (!r) return { tone: 'blue', label: checking ? 'checking…' : 'pending' };
        if (r.error) return { tone: 'gray', label: r.error === 'timeout' ? 'timeout' : 'error', detail: r.error };
        if (!r.ok) return { tone: 'red', label: String(r.status), detail: `${r.ms} ms` };
        if (r.redirected) return { tone: 'amber', label: `${r.status} → redirect`, detail: `→ ${r.finalUrl} · ${r.ms} ms` };
        return { tone: 'green', label: String(r.status), detail: `${r.ms} ms` };
      }
    }
  };

  const reportMarkdown = () => {
    const header = '| Line | Kind | Text | URL | Result |\n| ---: | --- | --- | --- | --- |';
    const body = analysis.links
      .map((l) => {
        const d = describe(l);
        const result = `${d.label}${l.duplicate ? ' (duplicate)' : ''}${d.detail ? ` — ${d.detail}` : ''}`;
        const esc = (s: string) => s.replace(/\|/g, '\\|');
        return `| ${l.line} | ${KIND_LABEL[l.kind]} | ${esc(l.text)} | ${esc(l.url)} | ${esc(result)} |`;
      })
      .join('\n');
    return `${header}\n${body}\n`;
  };

  const brokenList = () =>
    analysis.links
      .filter((l) => {
        if (l.verdict.state === 'anchor-missing' || l.verdict.state === 'undefined-reference') return true;
        const r = l.verdict.state === 'external' ? remote[externalKey(l.url)] : undefined;
        return !!r && !r.ok;
      })
      .map((l) => `- line ${l.line}: ${l.url || `[${l.text}]`}`)
      .join('\n');

  const selectClass = 'rounded-lg border border-gray-300 px-2 py-1 text-sm';

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-xl md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Pill tone="green">{stats.ok} ok</Pill>
          <Pill tone="amber">{stats.redirected} redirected</Pill>
          <Pill tone="red">{stats.broken} broken</Pill>
          <Pill tone="gray">{stats.skipped} skipped</Pill>
          {stats.pending ? <Pill tone="blue">{stats.pending} unchecked</Pill> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)} className={selectClass} aria-label="Filter rows">
            <option value="all">All links ({analysis.links.length})</option>
            <option value="problems">Problems only ({analysis.links.filter(isProblem).length})</option>
          </select>
          <button type="button" className={BTN_PRIMARY} onClick={runCheck} disabled={checking || !external.length}>
            {checking && progress
              ? `Checking ${progress.done}/${progress.total}…`
              : `Check ${external.length} external link${external.length === 1 ? '' : 's'}`}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          spellCheck={false}
          aria-label="Markdown input"
          className="h-[32rem] w-full resize-y rounded-2xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm leading-5 text-gray-900 focus:border-indigo-400 focus:outline-none"
        />
        <div className="flex h-[32rem] flex-col rounded-2xl border border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Links found: {analysis.links.length}
            </span>
            <div className="flex gap-2">
              <button type="button" className={BTN_GHOST} onClick={() => copyBroken(brokenList())} disabled={!stats.broken}>
                {copiedBroken ? 'Copied!' : 'Copy broken links'}
              </button>
              <button type="button" className={BTN_GHOST} onClick={() => copyReport(reportMarkdown())} disabled={!analysis.links.length}>
                {copiedReport ? 'Copied!' : 'Copy report as markdown'}
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {rows.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">
                {analysis.links.length === 0 ? 'Paste markdown with some links on the left…' : 'No problems found.'}
              </p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-gray-100 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-3 py-2">Line</th>
                    <th className="px-3 py-2">Kind</th>
                    <th className="px-3 py-2">Text</th>
                    <th className="px-3 py-2">URL</th>
                    <th className="px-3 py-2">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((link, i) => {
                    const d = describe(link);
                    return (
                      <tr
                        key={`${link.line}-${i}`}
                        onClick={() => selectLine(link.line)}
                        className="cursor-pointer border-t border-gray-200 align-top hover:bg-indigo-50/50"
                        title="Click to select this line in the editor"
                      >
                        <td className="px-3 py-2 font-mono text-xs text-gray-500">{link.line}</td>
                        <td className="px-3 py-2 text-xs text-gray-600">{KIND_LABEL[link.kind]}</td>
                        <td className="max-w-[10rem] truncate px-3 py-2 text-gray-800" title={link.text}>
                          {link.text}
                        </td>
                        <td className="max-w-[14rem] truncate px-3 py-2 font-mono text-xs text-gray-700" title={link.url}>
                          {link.url || <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap items-center gap-1">
                            <Pill tone={d.tone} title={d.detail}>
                              {d.label}
                            </Pill>
                            {link.duplicate ? <Pill tone="amber">duplicate</Pill> : null}
                          </div>
                          {d.detail ? (
                            <p className="mt-1 max-w-[16rem] truncate text-xs text-gray-500" title={d.detail}>
                              {d.detail}
                            </p>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      <p className="mt-4 text-xs text-gray-500">
        Parsing and anchor checks run in your browser. Only the external http(s) URLs are sent
        to docs-md.com&apos;s server, which fetches them on your behalf — your document text is
        never uploaded. Relative paths and mailto links are listed but not fetched.
      </p>
    </div>
  );
}
