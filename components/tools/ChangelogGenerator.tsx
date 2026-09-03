'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { BTN_DARK, BTN_GHOST, BTN_PILL, downloadFile, useCopy } from '@/components/tools/toolkit';

const CATEGORIES = ['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'] as const;
type Category = (typeof CATEGORIES)[number];

interface Release {
  id: number;
  version: string;
  date: string;
  notes: Record<Category, string>;
}

const FIELD_CLASS =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none';
const LABEL_CLASS = 'mb-1 block text-xs font-semibold text-gray-700';
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyNotes(): Record<Category, string> {
  return { Added: '', Changed: '', Deprecated: '', Removed: '', Fixed: '', Security: '' };
}

let nextId = 3;
const DEFAULT_RELEASES: Release[] = [
  {
    id: 1,
    version: '1.1.0',
    date: today(),
    notes: { ...emptyNotes(), Added: 'Dark mode toggle in settings\n`--json` flag for machine-readable output', Fixed: 'Crash when the config file is empty (#42)' },
  },
  {
    id: 2,
    version: '1.0.0',
    date: '2026-06-01',
    notes: { ...emptyNotes(), Added: 'Initial public release' },
  },
];

const PREAMBLE = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).`;

function bullets(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim().replace(/^[-*+]\s+/, ''))
    .filter(Boolean);
}

function normalizeRepo(url: string): string {
  return url.trim().replace(/\/+$/, '').replace(/\.git$/, '');
}

function buildChangelog(releases: Release[], repoUrl: string, unreleased: boolean, unreleasedNotes: Record<Category, string>): string {
  const parts: string[] = [PREAMBLE];
  const repo = normalizeRepo(repoUrl);
  const ordered = releases.filter((r) => r.version.trim());

  const section = (notes: Record<Category, string>): string[] =>
    CATEGORIES.filter((c) => bullets(notes[c]).length).map((c) => `### ${c}\n\n${bullets(notes[c]).map((b) => `- ${b}`).join('\n')}`);

  if (unreleased) parts.push(['## [Unreleased]', ...section(unreleasedNotes)].join('\n\n'));

  for (const r of ordered) {
    parts.push([`## [${r.version.trim()}] - ${r.date || today()}`, ...section(r.notes)].join('\n\n'));
  }

  if (repo) {
    const links: string[] = [];
    const latest = ordered[0]?.version.trim();
    if (unreleased && latest) links.push(`[Unreleased]: ${repo}/compare/v${latest}...HEAD`);
    ordered.forEach((r, i) => {
      const v = r.version.trim();
      const prev = ordered[i + 1]?.version.trim();
      links.push(prev ? `[${v}]: ${repo}/compare/v${prev}...v${v}` : `[${v}]: ${repo}/releases/tag/v${v}`);
    });
    parts.push(links.join('\n'));
  }
  return parts.join('\n\n') + '\n';
}

// ---- conventional commits --------------------------------------------------

const CC_TYPES = ['feat', 'fix', 'perf', 'refactor', 'revert', 'docs', 'style', 'chore', 'build', 'ci', 'test'] as const;
type CcType = (typeof CC_TYPES)[number];
const CC_LINE = /^(?:[0-9a-f]{7,40}\s+)?(\w+)(?:\(([^)]*)\))?(!)?:\s*(.+)$/;

interface ParsedCommit {
  type: CcType;
  scope: string;
  breaking: boolean;
  subject: string;
}

function parseGitLog(text: string): { commits: ParsedCommit[]; skipped: number } {
  const commits: ParsedCommit[] = [];
  let skipped = 0;
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const m = CC_LINE.exec(line);
    if (!m || !(CC_TYPES as readonly string[]).includes(m[1].toLowerCase())) {
      skipped += 1;
      continue;
    }
    let subject = m[4].trim();
    const breaking = m[3] === '!' || /BREAKING CHANGE/i.test(subject);
    subject = subject.replace(/\s*BREAKING CHANGE:?\s*/i, ' ').trim();
    // Keep PR refs as a trailing "(#123)", drop bare hashes.
    const pr = /\(#(\d+)\)\s*$/.exec(subject);
    subject = subject.replace(/\s*\(#\d+\)\s*$/, '').replace(/\s+[0-9a-f]{7,40}$/, '');
    subject = subject.charAt(0).toUpperCase() + subject.slice(1);
    if (pr) subject += ` (#${pr[1]})`;
    commits.push({ type: m[1].toLowerCase() as CcType, scope: m[2]?.trim() ?? '', breaking, subject });
  }
  return { commits, skipped };
}

function commitsToNotes(commits: ParsedCommit[], include: Set<CcType>): Record<Category, string> {
  const notes = emptyNotes();
  const push = (c: Category, line: string) => {
    notes[c] = notes[c] ? `${notes[c]}\n${line}` : line;
  };
  for (const c of commits) {
    if (!include.has(c.type)) continue;
    const scoped = c.scope ? `**${c.scope}:** ${c.subject}` : c.subject;
    const line = c.breaking ? `**BREAKING** ${scoped}` : scoped;
    if (c.type === 'revert') push('Removed', line);
    else if (c.breaking) push('Changed', line);
    else if (c.type === 'feat') push('Added', line);
    else if (c.type === 'fix') push('Fixed', line);
    else push('Changed', line);
  }
  return notes;
}

const GIT_LOG_EXAMPLE = `a1b2c3d feat(cli): add --json flag for machine-readable output (#51)
b2c3d4e fix: crash when the config file is empty (#42)
c3d4e5f perf(parser): cache compiled patterns
d4e5f6a refactor!: drop Node 16 support
e5f6a7b docs: update install instructions
f6a7b8c chore: bump dependencies`;

// ---- component ---------------------------------------------------------------

function Seg({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button onClick={onClick} className={`rounded-md px-3 py-1 transition ${active ? 'bg-gray-950 text-white' : 'text-gray-600 hover:text-gray-950'}`}>
      {children}
    </button>
  );
}

export default function ChangelogGenerator() {
  const [mode, setMode] = useState<'form' | 'gitlog'>('form');
  const [name, setName] = useState('my-project');
  const [repoUrl, setRepoUrl] = useState('https://github.com/you/my-project');
  const [unreleased, setUnreleased] = useState(true);
  const [unreleasedNotes, setUnreleasedNotes] = useState<Record<Category, string>>(emptyNotes());
  const [releases, setReleases] = useState<Release[]>(DEFAULT_RELEASES);
  const [open, setOpen] = useState<number | null>(1);

  const [gitLog, setGitLog] = useState(GIT_LOG_EXAMPLE);
  const [gitVersion, setGitVersion] = useState('1.2.0');
  const [include, setInclude] = useState<Set<CcType>>(new Set(['feat', 'fix', 'perf', 'refactor', 'revert']));

  const [view, setView] = useState<'preview' | 'markdown'>('markdown');
  const [copied, copy] = useCopy();
  const [shareState, setShareState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [shareUrl, setShareUrl] = useState('');

  const markdown = useMemo(
    () => buildChangelog(releases, repoUrl, unreleased, unreleasedNotes),
    [releases, repoUrl, unreleased, unreleasedNotes],
  );

  const parsed = useMemo(() => parseGitLog(gitLog), [gitLog]);

  const updateRelease = (id: number, patch: Partial<Release>) =>
    setReleases((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const updateNote = (id: number, cat: Category, value: string) =>
    setReleases((prev) => prev.map((r) => (r.id === id ? { ...r, notes: { ...r.notes, [cat]: value } } : r)));
  const move = (index: number, dir: -1 | 1) =>
    setReleases((prev) => {
      const next = [...prev];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  const addRelease = (notes = emptyNotes(), version = '') => {
    const id = nextId++;
    setReleases((prev) => [{ id, version, date: today(), notes }, ...prev]);
    setOpen(id);
  };

  const importGitLog = () => {
    addRelease(commitsToNotes(parsed.commits, include), gitVersion.trim());
    setMode('form');
  };

  const handleShare = async () => {
    setShareState('loading');
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: markdown, filename: 'CHANGELOG.md', expiry: '30d' }),
      });
      if (!response.ok) throw new Error('share failed');
      const data = await response.json();
      setShareUrl(data.url);
      setShareState('done');
    } catch (err) {
      console.error(err);
      setShareState('idle');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="space-y-4">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 text-xs font-medium">
          <Seg active={mode === 'form'} onClick={() => setMode('form')}>Releases</Seg>
          <Seg active={mode === 'gitlog'} onClick={() => setMode('gitlog')}>From git log</Seg>
        </div>

        {mode === 'form' ? (
          <>
            <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={LABEL_CLASS} htmlFor="cl-name">Project name</label>
                  <input id="cl-name" value={name} onChange={(e) => setName(e.target.value)} className={FIELD_CLASS} />
                </div>
                <div>
                  <label className={LABEL_CLASS} htmlFor="cl-repo">Repository URL (for compare links)</label>
                  <input id="cl-repo" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/owner/repo" className={`${FIELD_CLASS} font-mono`} />
                </div>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-700">
                <input type="checkbox" checked={unreleased} onChange={(e) => setUnreleased(e.target.checked)} className="h-3.5 w-3.5 accent-indigo-600" />
                Include an <code className="rounded bg-gray-100 px-1">[Unreleased]</code> section
              </label>
              {unreleased ? (
                <details className="rounded-xl border border-dashed border-gray-200 p-3">
                  <summary className="cursor-pointer text-xs font-semibold text-gray-700">Unreleased notes</summary>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {CATEGORIES.map((c) => (
                      <div key={c}>
                        <label className={LABEL_CLASS}>{c}</label>
                        <textarea value={unreleasedNotes[c]} onChange={(e) => setUnreleasedNotes((p) => ({ ...p, [c]: e.target.value }))} rows={2} className={`${FIELD_CLASS} font-mono text-xs`} spellCheck={false} />
                      </div>
                    ))}
                  </div>
                </details>
              ) : null}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-700">Releases (newest first)</p>
              <button onClick={() => addRelease()} className={BTN_PILL}>+ Add release</button>
            </div>

            {releases.map((r, i) => {
              const valid = SEMVER.test(r.version.trim());
              const isOpen = open === r.id;
              return (
                <div key={r.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex items-center gap-2 p-3">
                    <button onClick={() => setOpen(isOpen ? null : r.id)} className="flex flex-1 items-center gap-2 text-left text-sm" aria-expanded={isOpen}>
                      <span className="text-gray-400">{isOpen ? '▾' : '▸'}</span>
                      <span className="font-mono font-semibold text-gray-900">{r.version || '0.0.0'}</span>
                      <span className="text-xs text-gray-500">{r.date}</span>
                      {!valid && r.version ? <span className="text-xs text-amber-600">not semver</span> : null}
                    </button>
                    <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="rounded px-1.5 text-xs text-gray-500 hover:text-gray-950 disabled:opacity-30">↑</button>
                    <button onClick={() => move(i, 1)} disabled={i === releases.length - 1} aria-label="Move down" className="rounded px-1.5 text-xs text-gray-500 hover:text-gray-950 disabled:opacity-30">↓</button>
                    <button onClick={() => setReleases((p) => p.filter((x) => x.id !== r.id))} aria-label="Remove release" className="rounded px-1.5 text-xs text-gray-500 hover:text-red-600">✕</button>
                  </div>
                  {isOpen ? (
                    <div className="space-y-3 border-t border-gray-100 p-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className={LABEL_CLASS}>Version</label>
                          <input value={r.version} onChange={(e) => updateRelease(r.id, { version: e.target.value })} placeholder="1.2.0" className={`${FIELD_CLASS} font-mono ${!valid && r.version ? 'border-amber-400' : ''}`} />
                          {!valid && r.version ? <p className="mt-1 text-xs text-amber-600">Expected MAJOR.MINOR.PATCH, e.g. 1.2.0 or 2.0.0-beta.1</p> : null}
                        </div>
                        <div>
                          <label className={LABEL_CLASS}>Date</label>
                          <input type="date" value={r.date} onChange={(e) => updateRelease(r.id, { date: e.target.value })} className={FIELD_CLASS} />
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {CATEGORIES.map((c) => (
                          <div key={c}>
                            <label className={LABEL_CLASS}>{c} — one per line</label>
                            <textarea value={r.notes[c]} onChange={(e) => updateNote(r.id, c, e.target.value)} rows={2} className={`${FIELD_CLASS} font-mono text-xs`} spellCheck={false} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </>
        ) : (
          <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div>
              <label className={LABEL_CLASS} htmlFor="cl-gitlog">
                Paste <code className="rounded bg-gray-100 px-1">git log --oneline v1.1.0..HEAD</code>
              </label>
              <textarea id="cl-gitlog" value={gitLog} onChange={(e) => setGitLog(e.target.value)} rows={10} className={`${FIELD_CLASS} font-mono text-xs`} spellCheck={false} />
              <p className="mt-1 text-xs text-gray-500">
                {parsed.commits.length} conventional commit{parsed.commits.length === 1 ? '' : 's'} recognized
                {parsed.skipped ? `, ${parsed.skipped} line${parsed.skipped === 1 ? '' : 's'} skipped (no type prefix)` : ''}.
              </p>
            </div>
            <div>
              <p className={LABEL_CLASS}>Include commit types</p>
              <div className="flex flex-wrap gap-1.5">
                {CC_TYPES.map((t) => {
                  const on = include.has(t);
                  return (
                    <button
                      key={t}
                      onClick={() => setInclude((p) => { const n = new Set(p); if (n.has(t)) n.delete(t); else n.add(t); return n; })}
                      className={`rounded-full border px-2.5 py-1 font-mono text-xs transition ${on ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500 hover:text-gray-900'}`}
                      aria-pressed={on}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                feat → Added · fix → Fixed · perf/refactor → Changed · revert → Removed · <code>!</code> or BREAKING CHANGE → Changed with a <strong>BREAKING</strong> marker.
              </p>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className={LABEL_CLASS} htmlFor="cl-gitver">New version</label>
                <input id="cl-gitver" value={gitVersion} onChange={(e) => setGitVersion(e.target.value)} className={`${FIELD_CLASS} w-32 font-mono`} />
              </div>
              <button onClick={importGitLog} disabled={!parsed.commits.length} className={BTN_DARK}>
                Add as release →
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="mb-2 flex min-h-8 flex-wrap items-center justify-between gap-2">
          <div className="flex rounded-lg border border-gray-200 bg-white p-0.5 text-xs font-medium">
            <Seg active={view === 'preview'} onClick={() => setView('preview')}>Preview</Seg>
            <Seg active={view === 'markdown'} onClick={() => setView('markdown')}>Markdown</Seg>
          </div>
          <div className="flex gap-2">
            <button onClick={() => copy(markdown)} className={BTN_DARK}>{copied ? '✓ Copied' : 'Copy'}</button>
            <button onClick={() => downloadFile('CHANGELOG.md', markdown, 'text/markdown')} className={BTN_GHOST}>Download CHANGELOG.md</button>
            <button onClick={handleShare} disabled={shareState === 'loading'} className={BTN_GHOST}>
              {shareState === 'loading' ? 'Sharing…' : 'Share as link'}
            </button>
          </div>
        </div>
        {view === 'preview' ? (
          <div className="h-[640px] overflow-y-auto rounded-2xl border border-gray-200 bg-white px-6 py-5">
            <MarkdownRenderer content={markdown} />
          </div>
        ) : (
          <pre className="h-[640px] overflow-auto rounded-2xl bg-gray-950 p-4 text-sm text-gray-200">
            <code>{markdown}</code>
          </pre>
        )}
        {shareState === 'done' ? (
          <p className="mt-2 text-sm text-gray-600">
            Live at <Link href={shareUrl} className="text-indigo-700 underline">{shareUrl}</Link> (expires in 30 days)
          </p>
        ) : null}
        <p className="mt-2 text-xs text-gray-500">{name ? `${name} · ` : ''}{releases.length} release{releases.length === 1 ? '' : 's'} · Keep a Changelog 1.1.0</p>
      </div>
    </div>
  );
}
