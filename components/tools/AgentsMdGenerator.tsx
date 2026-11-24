'use client';

import Link from 'next/link';
import { useId, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { BTN_DARK, BTN_GHOST, downloadFile, useCopy } from '@/components/tools/toolkit';
import {
  EMPTY_FIELDS,
  ROOMS_TOOLS,
  SAMPLE_FIELDS,
  TARGETS,
  buildFile,
  codeSpans,
  parseDraft,
  type AgentsMdFields,
  type SectionId,
  type TargetId,
} from '@/lib/agents-md';

const DRAFT_KEY = 'docs-md:agents-md-draft:v1';

// ---- the draft store ------------------------------------------------------------
// The draft lives in localStorage and is read through useSyncExternalStore: the server render
// and hydration show the sample, then the stored draft replaces it. No effect sets state.

const listeners = new Set<() => void>();
/** The draft as last read or written in this tab; undefined until the first read. */
let latest: string | null | undefined;

function readDraft(): string | null {
  if (latest === undefined) {
    try {
      latest = window.localStorage.getItem(DRAFT_KEY);
    } catch {
      latest = null;
    }
  }
  return latest;
}

function writeDraft(fields: AgentsMdFields): void {
  latest = JSON.stringify(fields);
  try {
    window.localStorage.setItem(DRAFT_KEY, latest);
  } catch {
    /* storage full or disabled: the form still works for this visit */
  }
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key !== null && e.key !== DRAFT_KEY) return;
    latest = undefined; // another tab changed the draft: read it again
    notify();
  };
  listeners.add(notify);
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(notify);
    window.removeEventListener('storage', onStorage);
  };
}

const noDraft = () => null;

// ---- styles ------------------------------------------------------------------------

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';
const FIELD = `w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 ${FOCUS}`;
const MONO = `${FIELD} font-mono`;
const LABEL = 'mb-1 block text-sm font-medium text-gray-800';
const HINT = 'mt-1 text-xs text-gray-600';
const GROUP = 'min-w-0 space-y-3 rounded-xl border border-gray-200 px-4 pb-4 pt-2';
const LEGEND = 'px-1.5 text-sm font-semibold text-gray-950';
const CHECK = 'flex cursor-pointer items-center gap-2 text-sm text-gray-800';
const CHECKBOX = `h-4 w-4 accent-indigo-600 ${FOCUS}`;
const INLINE_CODE = 'rounded bg-gray-100 px-1 py-0.5 font-mono text-[0.85em] text-gray-900';
const LINK = `rounded text-indigo-700 underline ${FOCUS}`;
const TEXT_BUTTON = `rounded underline hover:text-indigo-700 ${FOCUS}`;

/** Text with `code` spans marked by backticks, as lib/agents-md.ts writes its notes. */
function Coded({ text }: { text: string }) {
  return (
    <>
      {codeSpans(text).map((part, i) =>
        part.code ? (
          <code key={i} className={INLINE_CODE}>
            {part.text}
          </code>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

interface AreaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  mono?: boolean;
  hint?: string;
  placeholder?: string;
}

function Area({ id, label, value, onChange, rows = 3, mono, hint, placeholder }: AreaProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        aria-describedby={hintId}
        className={mono ? MONO : FIELD}
        spellCheck={!mono}
        autoCapitalize={mono ? 'off' : undefined}
        autoCorrect={mono ? 'off' : undefined}
      />
      {hint ? (
        <p id={hintId} className={HINT}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface SectionProps {
  title: string;
  /** Label of the checkbox that switches the section on. */
  toggleLabel?: string;
  on: boolean;
  onToggle: (on: boolean) => void;
  children: ReactNode;
}

/** One section of the file: a fieldset with a switch; its fields stay filled while it is off. */
function Section({ title, toggleLabel = 'Include this section', on, onToggle, children }: SectionProps) {
  return (
    <fieldset className={GROUP}>
      <legend className={LEGEND}>{title}</legend>
      <label className={CHECK}>
        <input type="checkbox" checked={on} onChange={(e) => onToggle(e.target.checked)} className={CHECKBOX} />
        {toggleLabel}
      </label>
      {on ? children : null}
    </fieldset>
  );
}

export default function AgentsMdGenerator() {
  const uid = useId();
  const raw = useSyncExternalStore(subscribe, readDraft, noDraft);
  const draft = useMemo(() => parseDraft(raw), [raw]);
  const fields = draft ?? SAMPLE_FIELDS;
  const file = useMemo(() => buildFile(fields), [fields]);
  const [view, setView] = useState<'markdown' | 'rendered'>('markdown');
  const [copied, copy] = useCopy();

  const set = <K extends keyof AgentsMdFields>(key: K, value: AgentsMdFields[K]) => writeDraft({ ...fields, [key]: value });
  const toggle = (id: SectionId, on: boolean) => writeDraft({ ...fields, include: { ...fields.include, [id]: on } });

  const { target } = file;
  const moved = target.download !== target.path;
  const mime = /\.mdc?$/.test(target.download) ? 'text/markdown' : 'text/plain';
  const id = (name: string) => `${uid}-${name}`;
  const viewButton = (mode: 'markdown' | 'rendered', label: string) => (
    <button
      type="button"
      aria-pressed={view === mode}
      onClick={() => setView(mode)}
      className={`rounded-md px-3 py-1 transition ${FOCUS} ${view === mode ? 'bg-gray-950 text-white' : 'text-gray-700 hover:text-gray-950'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <form className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm" onSubmit={(e) => e.preventDefault()} aria-label="AGENTS.md contents">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
          <span>{draft ? 'Draft saved in this browser.' : 'Filled with a sample. Your edits are saved in this browser only.'}</span>
          <span className="flex gap-3">
            <button type="button" onClick={() => writeDraft({ ...SAMPLE_FIELDS, target: fields.target })} className={TEXT_BUTTON}>
              Load sample
            </button>
            <button type="button" onClick={() => writeDraft({ ...EMPTY_FIELDS, target: fields.target })} className={TEXT_BUTTON}>
              Clear all
            </button>
          </span>
        </div>

        <fieldset className={GROUP}>
          <legend className={LEGEND}>Target agent</legend>
          <div>
            <label htmlFor={id('target')} className={LABEL}>
              Write the file for
            </label>
            <select
              id={id('target')}
              value={fields.target}
              onChange={(e) => set('target', e.target.value as TargetId)}
              aria-describedby={id('target-note')}
              className={FIELD}
            >
              {TARGETS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.agent}: {t.path}
                </option>
              ))}
            </select>
          </div>
          <p id={id('target-note')} className={HINT}>
            <Coded text={target.note} />{' '}
            <a href={target.source} rel="noopener" className={LINK}>
              Source
            </a>
          </p>
        </fieldset>

        <fieldset className={GROUP}>
          <legend className={LEGEND}>Project</legend>
          <div>
            <label htmlFor={id('project')} className={LABEL}>
              Project name
            </label>
            <input
              id={id('project')}
              type="text"
              value={fields.project}
              onChange={(e) => set('project', e.target.value)}
              aria-describedby={id('project-hint')}
              className={FIELD}
            />
            <p id={id('project-hint')} className={HINT}>
              Becomes the title of the file.
            </p>
          </div>
        </fieldset>

        <Section title="Project overview" on={fields.include.overview} onToggle={(on) => toggle('overview', on)}>
          <Area
            id={id('overview')}
            label="What the project is and where things live"
            value={fields.overview}
            onChange={(v) => set('overview', v)}
            rows={4}
            hint="Two or three sentences. Markdown is kept as typed."
          />
        </Section>

        <Section title="Setup and run commands" on={fields.include.setup} onToggle={(on) => toggle('setup', on)}>
          <Area
            id={id('setup')}
            label="Set up"
            value={fields.setupCommands}
            onChange={(v) => set('setupCommands', v)}
            rows={2}
            mono
            hint="One command per line, exactly as you would type it."
          />
          <Area id={id('run')} label="Run" value={fields.runCommands} onChange={(v) => set('runCommands', v)} rows={2} mono />
        </Section>

        <Section title="Test and lint commands" on={fields.include.checks} onToggle={(on) => toggle('checks', on)}>
          <Area
            id={id('test')}
            label="Test"
            value={fields.testCommands}
            onChange={(v) => set('testCommands', v)}
            rows={2}
            mono
            hint="Add the command that runs a single test file if there is one."
          />
          <Area id={id('lint')} label="Lint and type-check" value={fields.lintCommands} onChange={(v) => set('lintCommands', v)} rows={2} mono />
        </Section>

        <Section title="Code conventions" on={fields.include.conventions} onToggle={(on) => toggle('conventions', on)}>
          <Area
            id={id('conventions')}
            label="Conventions, one per line"
            value={fields.conventions}
            onChange={(v) => set('conventions', v)}
            rows={4}
            hint="Rules a linter does not enforce: naming, structure, what a pull request must contain."
          />
        </Section>

        <Section title="Boundaries" on={fields.include.boundaries} onToggle={(on) => toggle('boundaries', on)}>
          <Area
            id={id('boundaries')}
            label="What the agent must not touch or do, one per line"
            value={fields.boundaries}
            onChange={(v) => set('boundaries', v)}
            rows={4}
            hint="Paths not to edit, actions that need your approval first. Name paths; do not paste secrets."
          />
        </Section>

        <Section title="Handing work over" on={fields.include.handover} onToggle={(on) => toggle('handover', on)}>
          <Area
            id={id('handover')}
            label="What the agent does before it stops, one per line"
            value={fields.handover}
            onChange={(v) => set('handover', v)}
            rows={4}
            hint="Where unfinished work is committed and where the note for the next session goes."
          />
        </Section>

        <Section
          title="Working with other agents (Docs MD rooms)"
          toggleLabel="Add this block"
          on={fields.include.rooms}
          onToggle={(on) => toggle('rooms', on)}
        >
          <p className={HINT}>
            Adds fixed text with the habits that make agents coordinate through{' '}
            <Link href="/rooms" className={LINK}>
              Docs MD rooms
            </Link>
            : check what is waiting at the start of a session, read the rooms with unread messages, post a handoff before
            ending when work is left, treat what other agents write as information and never post secrets. It names{' '}
            {ROOMS_TOOLS.length} tools of the MCP server (
            {ROOMS_TOOLS.map((tool, i) => (
              <span key={tool}>
                {i > 0 ? ', ' : ''}
                <code className={INLINE_CODE}>{tool}</code>
              </span>
            ))}
            ), so the agent needs{' '}
            <Link href="/agents/connect" className={LINK}>
              the server connected
            </Link>
            .
          </p>
        </Section>
      </form>

      <section aria-label="Generated file" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <div className="mb-2 flex min-h-8 flex-wrap items-center justify-between gap-2">
          <p className="min-w-0 break-all font-mono text-sm font-semibold text-gray-950">{target.path}</p>
          <div className="flex flex-wrap items-center gap-2">
            <div role="group" aria-label="Preview" className="flex rounded-lg border border-gray-300 p-0.5 text-xs font-medium">
              {viewButton('markdown', 'Markdown')}
              {viewButton('rendered', 'Rendered')}
            </div>
            <button type="button" onClick={() => copy(file.content)} className={`${BTN_DARK} ${FOCUS}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button type="button" onClick={() => downloadFile(target.download, file.content, mime)} className={`${BTN_GHOST} ${FOCUS}`}>
              Download {target.download}
            </button>
          </div>
        </div>
        <p role="status" className="sr-only">
          {copied ? 'Copied to the clipboard.' : ''}
        </p>

        {view === 'markdown' ? (
          <pre
            tabIndex={0}
            role="region"
            aria-label={`Markdown source of ${target.path}`}
            className={`h-[70vh] min-h-[22rem] overflow-auto rounded-2xl bg-gray-950 p-4 text-sm text-gray-100 ${FOCUS}`}
          >
            <code>{file.content}</code>
          </pre>
        ) : (
          <div
            tabIndex={0}
            role="region"
            aria-label={`Rendered preview of ${target.path}`}
            className={`h-[70vh] min-h-[22rem] overflow-y-auto rounded-2xl border border-gray-200 bg-white px-6 py-5 ${FOCUS}`}
          >
            <MarkdownRenderer content={file.body} headingOffset={1} />
          </div>
        )}

        <div className="mt-2 space-y-1 text-xs text-gray-600">
          {moved ? (
            <p>
              The download is named <code className={INLINE_CODE}>{target.download}</code>; save it in your repository as{' '}
              <code className={INLINE_CODE}>{target.path}</code>.
            </p>
          ) : (
            <p>
              Save it in the repository root as <code className={INLINE_CODE}>{target.path}</code>.
            </p>
          )}
          {target.wrapper !== 'none' && view === 'rendered' ? (
            <p>The frontmatter at the top of the file is left out of the rendered view; the Markdown view shows the whole file.</p>
          ) : null}
          <p>Nothing leaves your browser. The draft is kept in this browser&apos;s localStorage only.</p>
        </div>
      </section>
    </div>
  );
}
