'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { BTN_DARK, BTN_GHOST, downloadFile, useCopy } from '@/components/tools/toolkit';
import { EMPTY_FIELDS, SAMPLE_FIELDS, buildHandoff, type HandoffFields, type KeyFile } from '@/lib/handoff';

const DRAFT_KEY = 'docs-md:handoff-draft:v1';

const FIELD_CLASS =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none';
const MONO = `${FIELD_CLASS} font-mono`;
const LABEL_CLASS = 'mb-1 block text-xs font-semibold text-gray-700';
const HINT = 'mt-1 text-[11px] text-gray-500';
const GROUP = 'space-y-3 border-t border-gray-100 pt-4 first:border-t-0 first:pt-0';
const GROUP_TITLE = 'text-xs font-semibold uppercase tracking-wide text-gray-500';

function loadDraft(): HandoffFields | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<HandoffFields>;
    if (typeof parsed !== 'object' || parsed === null) return null;
    return { ...EMPTY_FIELDS, ...parsed, keyFiles: Array.isArray(parsed.keyFiles) && parsed.keyFiles.length ? parsed.keyFiles : EMPTY_FIELDS.keyFiles };
  } catch {
    return null;
  }
}

interface TextProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  mono?: boolean;
  hint?: string;
  placeholder?: string;
}

function Area({ label, value, onChange, rows = 3, mono, hint, placeholder }: TextProps) {
  return (
    <div>
      <label className={LABEL_CLASS}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={mono ? MONO : FIELD_CLASS}
        spellCheck={!mono}
      />
      {hint ? <p className={HINT}>{hint}</p> : null}
    </div>
  );
}

export default function HandoffGenerator() {
  const [fields, setFields] = useState<HandoffFields>(SAMPLE_FIELDS);
  const [draftState, setDraftState] = useState<'loading' | 'sample' | 'restored' | 'saved'>('loading');
  const [view, setView] = useState<'preview' | 'markdown'>('preview');
  const [copied, copy] = useCopy();
  const [shareState, setShareState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [shareUrl, setShareUrl] = useState('');
  const [rawUrl, setRawUrl] = useState('');

  // Restore the draft after mount so the server-rendered sample never mismatches.
  useEffect(() => {
    const draft = loadDraft();
    if (draft) setFields(draft);
    setDraftState(draft ? 'restored' : 'sample');
  }, []);

  // Autosave every change once the draft has been restored.
  useEffect(() => {
    if (draftState === 'loading') return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(fields));
    } catch {
      /* storage full or disabled: the form still works */
    }
  }, [fields, draftState]);

  const markdown = useMemo(() => buildHandoff(fields), [fields]);

  const set = <K extends keyof HandoffFields>(key: K, value: HandoffFields[K]) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setDraftState((s) => (s === 'loading' ? s : 'saved'));
  };

  const setFile = (i: number, patch: Partial<KeyFile>) =>
    set(
      'keyFiles',
      fields.keyFiles.map((k, idx) => (idx === i ? { ...k, ...patch } : k)),
    );
  const addFile = () => set('keyFiles', [...fields.keyFiles, { path: '', note: '' }]);
  const removeFile = (i: number) =>
    set('keyFiles', fields.keyFiles.length > 1 ? fields.keyFiles.filter((_, idx) => idx !== i) : [{ path: '', note: '' }]);

  const reset = (to: HandoffFields) => {
    setFields(to);
    setDraftState('saved');
    setShareState('idle');
  };

  const handleShare = async () => {
    setShareState('loading');
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: markdown, filename: 'HANDOFF.md', expiry: '30d' }),
      });
      if (!response.ok) throw new Error('share failed');
      const data = await response.json();
      setShareUrl(data.url);
      setRawUrl(data.rawUrl ?? '');
      setShareState('done');
    } catch (err) {
      console.error(err);
      setShareState('error');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
          <span>
            {draftState === 'restored'
              ? 'Draft restored from this browser.'
              : draftState === 'saved'
                ? 'Draft saved in this browser.'
                : 'Pre-filled with a sample; your edits autosave in this browser.'}
          </span>
          <span className="flex gap-3">
            <button type="button" onClick={() => reset(SAMPLE_FIELDS)} className="underline hover:text-indigo-700">
              Load sample
            </button>
            <button type="button" onClick={() => reset(EMPTY_FIELDS)} className="underline hover:text-indigo-700">
              Clear all
            </button>
          </span>
        </div>

        <div className={GROUP}>
          <p className={GROUP_TITLE}>Project</p>
          <div>
            <label className={LABEL_CLASS}>Project or task name</label>
            <input value={fields.project} onChange={(e) => set('project', e.target.value)} className={FIELD_CLASS} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={LABEL_CLASS}>Repo</label>
              <input value={fields.repo} onChange={(e) => set('repo', e.target.value)} placeholder="owner/name" className={MONO} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Branch</label>
              <input value={fields.branch} onChange={(e) => set('branch', e.target.value)} placeholder="feat/thing" className={MONO} />
            </div>
          </div>
          <div>
            <label className={LABEL_CLASS}>Goal in one sentence</label>
            <input value={fields.goal} onChange={(e) => set('goal', e.target.value)} className={FIELD_CLASS} />
            <p className={HINT}>What &quot;done&quot; means. The next reader judges every step against this line.</p>
          </div>
        </div>

        <div className={GROUP}>
          <p className={GROUP_TITLE}>Current state — one item per line</p>
          <Area label="Done" value={fields.done} onChange={(v) => set('done', v)} />
          <Area label="In progress" value={fields.inProgress} onChange={(v) => set('inProgress', v)} rows={2} />
          <Area label="Blocked" value={fields.blocked} onChange={(v) => set('blocked', v)} rows={2} />
        </div>

        <div className={GROUP}>
          <p className={GROUP_TITLE}>How to run and test — one command per line</p>
          <Area label="Run" value={fields.runCommands} onChange={(v) => set('runCommands', v)} rows={3} mono />
          <Area label="Test" value={fields.testCommands} onChange={(v) => set('testCommands', v)} rows={2} mono />
        </div>

        <div className={GROUP}>
          <p className={GROUP_TITLE}>Key files</p>
          <div className="space-y-2">
            {fields.keyFiles.map((k, i) => (
              <div key={i} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] gap-2">
                <input
                  value={k.path}
                  onChange={(e) => setFile(i, { path: e.target.value })}
                  placeholder="src/path.ts"
                  aria-label={`File ${i + 1} path`}
                  className={MONO}
                />
                <input
                  value={k.note}
                  onChange={(e) => setFile(i, { note: e.target.value })}
                  placeholder="what it does"
                  aria-label={`File ${i + 1} description`}
                  className={FIELD_CLASS}
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  aria-label={`Remove file ${i + 1}`}
                  className="rounded-lg border border-gray-200 px-2 text-xs text-gray-500 hover:border-red-300 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addFile} className={BTN_GHOST}>
            + Add file
          </button>
        </div>

        <div className={GROUP}>
          <p className={GROUP_TITLE}>Decisions and open questions</p>
          <Area
            label="Decisions made — one per line"
            value={fields.decisions}
            onChange={(v) => set('decisions', v)}
            hint="Write “decision — why”. The part after the dash becomes the Why column."
          />
          <Area label="Open questions — one per line" value={fields.openQuestions} onChange={(v) => set('openQuestions', v)} rows={2} />
        </div>

        <div className={GROUP}>
          <p className={GROUP_TITLE}>What happens next</p>
          <Area
            label="Next steps — one per line, in order"
            value={fields.nextSteps}
            onChange={(v) => set('nextSteps', v)}
            rows={4}
            hint="Rendered as a numbered list; the first line is what the next reader should do first."
          />
          <Area label="Constraints and gotchas — one per line" value={fields.constraints} onChange={(v) => set('constraints', v)} />
        </div>

        <div className={GROUP}>
          <p className={GROUP_TITLE}>People and links</p>
          <Area label="Owners and contacts — one per line" value={fields.owners} onChange={(v) => set('owners', v)} rows={2} placeholder="Role: name" />
          <Area label="Links — one per line" value={fields.links} onChange={(v) => set('links', v)} rows={2} mono placeholder="Label: https://…" />
        </div>

        <div className={GROUP}>
          <p className={GROUP_TITLE}>Options</p>
          <div className="flex flex-wrap gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-700">
              <input type="checkbox" checked={fields.agentPreamble} onChange={(e) => set('agentPreamble', e.target.checked)} className="h-3.5 w-3.5 accent-indigo-600" />
              &quot;For an AI agent&quot; preamble
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-700">
              <input type="checkbox" checked={fields.statusTable} onChange={(e) => set('statusTable', e.target.checked)} className="h-3.5 w-3.5 accent-indigo-600" />
              Status table
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-700">
              <input type="checkbox" checked={fields.timestamps} onChange={(e) => set('timestamps', e.target.checked)} className="h-3.5 w-3.5 accent-indigo-600" />
              Timestamps
            </label>
          </div>
          {fields.agentPreamble ? (
            <div className="space-y-3 rounded-xl bg-gray-50 p-3">
              <Area label="Context budget" value={fields.contextBudget} onChange={(v) => set('contextBudget', v)} rows={2} hint="What the agent should read, and what it should not load." />
              <Area label="Do-not-touch paths — one per line" value={fields.doNotTouch} onChange={(v) => set('doNotTouch', v)} rows={2} mono />
              <Area label="Verification commands — one per line" value={fields.verifyCommands} onChange={(v) => set('verifyCommands', v)} rows={3} mono />
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <div className="mb-2 flex min-h-8 flex-wrap items-center justify-between gap-2">
          <div className="flex rounded-lg border border-gray-200 p-0.5 text-xs font-medium">
            <button
              onClick={() => setView('preview')}
              className={`rounded-md px-3 py-1 transition ${view === 'preview' ? 'bg-gray-950 text-white' : 'text-gray-600 hover:text-gray-950'}`}
            >
              Preview
            </button>
            <button
              onClick={() => setView('markdown')}
              className={`rounded-md px-3 py-1 transition ${view === 'markdown' ? 'bg-gray-950 text-white' : 'text-gray-600 hover:text-gray-950'}`}
            >
              Markdown
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => copy(markdown)} className={BTN_DARK}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
            <button onClick={() => downloadFile('HANDOFF.md', markdown, 'text/markdown')} className={BTN_GHOST}>
              Download HANDOFF.md
            </button>
            <button onClick={handleShare} disabled={shareState === 'loading'} className={BTN_GHOST}>
              {shareState === 'loading' ? 'Sharing…' : 'Share as link'}
            </button>
          </div>
        </div>
        {view === 'preview' ? (
          <div className="h-[760px] overflow-y-auto rounded-2xl border border-gray-200 bg-white px-6 py-5">
            <MarkdownRenderer content={markdown} />
          </div>
        ) : (
          <pre className="h-[760px] overflow-auto rounded-2xl bg-gray-950 p-4 text-sm text-gray-200">
            <code>{markdown}</code>
          </pre>
        )}
        {shareState === 'done' ? (
          <p className="mt-2 text-sm text-gray-600">
            Live at{' '}
            <Link href={shareUrl} className="text-indigo-700 underline">
              {shareUrl}
            </Link>{' '}
            (expires in 30 days).
            {rawUrl ? (
              <>
                {' '}Raw markdown for agents:{' '}
                <Link href={rawUrl} className="text-indigo-700 underline">
                  {rawUrl}
                </Link>
              </>
            ) : null}
          </p>
        ) : null}
        {shareState === 'error' ? (
          <p className="mt-2 text-sm text-red-600">Sharing failed. Copy or download the file instead.</p>
        ) : null}
        <p className="mt-2 text-xs text-gray-500">
          Nothing leaves your browser unless you click <em>Share as link</em>. The draft is kept in this browser&apos;s localStorage only.
        </p>
      </div>
    </div>
  );
}
