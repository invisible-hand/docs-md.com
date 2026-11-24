'use client';

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { BTN_GHOST } from '@/components/tools/toolkit';
import {
  DEFAULT_LINK_STATE,
  MCP_CLIENTS,
  SCOPE_LABEL,
  decodeLinkState,
  encodeLinkState,
  splitArgs,
  validateInput,
  type LinkState,
  type McpClient,
  type OutputBlock,
  type ServerInput,
} from '@/lib/mcp-clients';

// ---- form state -------------------------------------------------------------------
// The form lives in a small module store read through useSyncExternalStore. The server
// render and hydration show the default example; after that the URL hash is read, so a
// link reproduces the form. Edits update the store at once and the hash a moment later
// (browsers limit how often history may be rewritten). No effect sets state.
//
// Header and variable VALUES never go into the hash: they are often credentials, and a
// URL ends up in history and in whatever the link is pasted into. Their names do.

interface Row {
  id: number;
  key: string;
  value: string;
}

interface FormState {
  name: string;
  transport: 'http' | 'stdio';
  url: string;
  command: string;
  /** The argument line as typed; split with splitArgs. */
  args: string;
  headers: Row[];
  env: Row[];
  /** Seconds, as typed. */
  timeout: string;
  clients: string[];
}

let nextRowId = 1;
const row = (key = '', value = ''): Row => ({ id: nextRowId++, key, value });

const DEFAULT_STATE: FormState = fromLink(DEFAULT_LINK_STATE);

function fromLink(l: LinkState): FormState {
  return {
    name: l.name,
    transport: l.transport,
    url: l.url,
    command: l.command,
    args: l.args,
    headers: l.headerNames.map((k) => row(k)),
    env: l.envNames.map((k) => row(k)),
    timeout: l.timeout,
    clients: l.clients,
  };
}

/** The hash for a form, without "#"; empty for the default example. Values of rows are left out. */
function encodeState(s: FormState): string {
  return encodeLinkState({
    name: s.name,
    transport: s.transport,
    url: s.url,
    command: s.command,
    args: s.args,
    headerNames: s.headers.map((h) => h.key),
    envNames: s.env.map((e) => e.key),
    timeout: s.timeout,
    clients: s.clients,
  });
}

const listeners = new Set<() => void>();
let current: FormState = DEFAULT_STATE;
/** The hash `current` was last read from or written to; null before the first read. */
let syncedHash: string | null = null;
let writeTimer: ReturnType<typeof setTimeout> | undefined;

function readHash(): void {
  const hash = window.location.hash;
  if (hash === syncedHash) return;
  const first = syncedHash === null;
  syncedHash = hash;
  const link = decodeLinkState(hash);
  // A hash that is not ours (a skip link, an anchor) or an empty one leaves an edited form alone.
  if (link) current = fromLink(link);
  else if (first) current = DEFAULT_STATE;
}

function writeHash(): void {
  if (listeners.size === 0) return;
  const encoded = encodeState(current);
  const hash = encoded ? `#${encoded}` : '';
  if (hash === window.location.hash) return;
  syncedHash = hash;
  try {
    window.history.replaceState(null, '', hash || window.location.pathname + window.location.search);
  } catch {
    /* history is rate-limited or unavailable: the form still works, the link is just stale */
  }
}

function setForm(next: FormState): void {
  current = next;
  listeners.forEach((notify) => notify());
  clearTimeout(writeTimer);
  writeTimer = setTimeout(writeHash, 400);
}

/** Applies a change to the latest state (not to the one a handler closed over). */
function patchForm(patch: Partial<FormState>): void {
  setForm({ ...current, ...patch });
}

function subscribe(notify: () => void): () => void {
  const onHashChange = () => {
    const before = current;
    readHash();
    if (current !== before) listeners.forEach((n) => n());
  };
  listeners.add(notify);
  window.addEventListener('hashchange', onHashChange);
  // A client-side navigation sets the URL after the first render, with no hashchange event.
  readHash();
  // Coming back to the page within one visit keeps the form; bring the address in line with it.
  clearTimeout(writeTimer);
  writeTimer = setTimeout(writeHash, 400);
  return () => {
    listeners.delete(notify);
    window.removeEventListener('hashchange', onHashChange);
    if (listeners.size === 0) clearTimeout(writeTimer);
  };
}

function getSnapshot(): FormState {
  if (syncedHash === null) readHash();
  return current;
}

const getServerSnapshot = (): FormState => DEFAULT_STATE;

function toRecord(rows: Row[]): Record<string, string> {
  return Object.fromEntries(rows.filter((r) => r.key.trim()).map((r) => [r.key.trim(), r.value]));
}

function toInput(s: FormState): ServerInput {
  const seconds = Number(s.timeout);
  const timeoutSeconds = s.timeout.trim() && Number.isFinite(seconds) && seconds >= 1 ? seconds : undefined;
  return s.transport === 'http'
    ? { name: s.name, url: s.url, headers: toRecord(s.headers), timeoutSeconds }
    : { name: s.name, command: s.command, args: splitArgs(s.args), env: toRecord(s.env), timeoutSeconds };
}

// ---- styles -----------------------------------------------------------------------

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';
// 16px on small screens so iOS does not zoom the page when a field takes focus.
const FIELD = `w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-base text-gray-900 md:text-sm ${FOCUS}`;
const LABEL = 'mb-1 block text-xs font-semibold text-gray-700';
const HINT = 'mt-1 min-h-5 text-xs text-gray-600';
const SMALL_BTN = `${BTN_GHOST} ${FOCUS}`;

// ---- pieces -----------------------------------------------------------------------

/**
 * Copies `text`. Unlike the shared useCopy hook it also reports a failed copy, and it
 * announces the result through a status region that sits outside the button. The button
 * keeps a fixed width so its label can change without moving anything.
 */
function CopyButton({ text, what }: { text: string; what: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const report = (next: 'copied' | 'failed') => {
    setStatus(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), 2000);
  };
  const copy = () => {
    try {
      navigator.clipboard.writeText(text).then(
        () => report('copied'),
        () => report('failed'),
      );
    } catch {
      report('failed'); // no clipboard API: an insecure context or an old browser
    }
  };

  return (
    <span className="flex-none">
      <button
        type="button"
        onClick={copy}
        className={`min-w-[5.5rem] rounded-lg border px-3 py-1.5 text-xs font-medium transition ${FOCUS} ${
          status === 'copied'
            ? 'border-emerald-700 bg-emerald-700 text-white'
            : status === 'failed'
              ? 'border-red-700 bg-white text-red-700'
              : 'border-gray-300 bg-white text-gray-700 hover:border-indigo-400 hover:text-indigo-700'
        }`}
      >
        {status === 'copied' ? '✓ Copied' : status === 'failed' ? 'Not copied' : 'Copy'}
        <span className="sr-only"> {what}</span>
      </button>
      <span role="status" className="sr-only">
        {status === 'copied' ? `Copied ${what}` : status === 'failed' ? `Could not copy ${what}. Select the text and copy it by hand.` : ''}
      </span>
    </span>
  );
}

const WRAP = 'whitespace-pre-wrap [overflow-wrap:anywhere]';

function Block({ block, clientName }: { block: OutputBlock; clientName: string }) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 text-xs text-gray-600">
          <p className="text-sm font-semibold text-gray-900">{block.label}</p>
          {block.locations ? (
            <p className="mt-0.5">
              {block.locations.map((l, i) => (
                <span key={l.path}>
                  {i > 0 ? ', or ' : ''}
                  <code className="rounded bg-gray-100 px-1 py-0.5 text-gray-900 [overflow-wrap:anywhere]">{l.path}</code> ({SCOPE_LABEL[l.scope]})
                </span>
              ))}
            </p>
          ) : null}
          {block.where ? <p className="mt-0.5">{block.where}</p> : null}
        </div>
        <CopyButton text={block.code} what={`${clientName}: ${block.label}`} />
      </div>
      <pre className={`mt-2 rounded-xl bg-gray-950 p-3 text-xs leading-relaxed text-gray-100 ${WRAP}`}>
        <code>{block.code}</code>
      </pre>
      {block.kind === 'link' ? (
        <p className="mt-1 text-xs">
          <a href={block.code} className={`rounded text-indigo-700 underline ${FOCUS}`}>
            Open this link<span className="sr-only"> ({clientName})</span>
          </a>
        </p>
      ) : null}
      {block.note ? <p className="mt-1 text-xs text-gray-600">{block.note}</p> : null}
    </div>
  );
}

function ClientCard({ client, input }: { client: McpClient; input: ServerInput }) {
  const titleId = useId();
  const blocks = client.generate(input);
  const caveats = client.caveats(input);
  return (
    <article aria-labelledby={titleId} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <header className="space-y-1">
        <h3 id={titleId} className="text-base font-semibold text-gray-950">
          {client.name}
          {client.formerName ? <span className="font-normal text-gray-600"> (formerly {client.formerName})</span> : null}
        </h3>
        {client.covers ? <p className="text-xs text-gray-600">Covers {client.covers}.</p> : null}
        <p className="text-xs text-gray-600">
          Source:{' '}
          <a href={client.docUrl} className={`rounded text-indigo-700 underline ${FOCUS}`}>
            {client.docTitle}
          </a>
          {client.moreDocs?.map((d) => (
            <span key={d.url}>
              ,{' '}
              <a href={d.url} className={`rounded text-indigo-700 underline ${FOCUS}`}>
                {d.title}
              </a>
            </span>
          ))}
          . Checked <time dateTime={client.checked}>{client.checked}</time>.
        </p>
      </header>

      {caveats.length > 0 ? (
        <ul className="space-y-1 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950">
          {caveats.map((c) => (
            <li key={c}>
              <span className="font-semibold">Note: </span>
              {c}
            </li>
          ))}
        </ul>
      ) : null}

      {blocks.map((b) => (
        <Block key={`${b.kind}:${b.label}`} block={b} clientName={client.name} />
      ))}

      <dl className="space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-700">
        <div>
          <dt className="inline font-semibold text-gray-900">Tool-call timeout: </dt>
          <dd className="inline">
            {client.timeout.summary}
            {client.timeout.setting ? ` To change it: ${client.timeout.setting}.` : ''}
          </dd>
        </div>
        <div>
          <dt className="inline font-semibold text-gray-900">Check the connection: </dt>
          <dd className="inline">{client.verify ?? 'Not documented. Ask the agent which tools the server offers.'}</dd>
        </div>
      </dl>

      <details className="text-xs text-gray-700">
        <summary className={`cursor-pointer rounded font-semibold text-gray-900 ${FOCUS}`}>
          Before you paste: {client.notes.length} {client.notes.length === 1 ? 'note' : 'notes'} on {client.name}
        </summary>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {client.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </details>
    </article>
  );
}

function Rows({
  legend,
  noun,
  rows,
  keyPlaceholder,
  valuePlaceholder,
  onChange,
}: {
  legend: string;
  noun: string;
  rows: Row[];
  keyPlaceholder: string;
  valuePlaceholder: string;
  onChange: (rows: Row[]) => void;
}) {
  const edit = (id: number, patch: Partial<Row>) => onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  return (
    <fieldset>
      <legend className={LABEL}>{legend}</legend>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={r.id} className="flex items-center gap-2">
            <input
              value={r.key}
              onChange={(e) => edit(r.id, { key: e.target.value })}
              aria-label={`${noun} ${i + 1} name`}
              placeholder={keyPlaceholder}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className={`${FIELD} min-w-0 flex-[2]`}
            />
            <input
              value={r.value}
              onChange={(e) => edit(r.id, { value: e.target.value })}
              aria-label={`${noun} ${i + 1} value`}
              placeholder={valuePlaceholder}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className={`${FIELD} min-w-0 flex-[3]`}
            />
            <button
              type="button"
              onClick={() => onChange(rows.filter((x) => x.id !== r.id))}
              aria-label={`Remove ${noun.toLowerCase()} ${i + 1}`}
              className={`min-h-8 min-w-8 flex-none rounded-lg border border-gray-300 text-sm text-gray-600 hover:border-red-400 hover:text-red-700 ${FOCUS}`}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <button type="button" onClick={() => onChange([...rows, row()])} className={SMALL_BTN}>
          + Add {noun.toLowerCase()}
        </button>
        <p className="text-xs text-gray-600">Values stay in this tab. A copied link keeps the names only.</p>
      </div>
    </fieldset>
  );
}

// ---- the tool -----------------------------------------------------------------------

export default function McpConfigGenerator() {
  const form = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const uid = useId();
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [linkStatus, setLinkStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const linkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (linkTimer.current) clearTimeout(linkTimer.current);
    },
    [],
  );

  const set = patchForm;
  const blur = (field: string) => setTouched((t) => (t[field] ? t : { ...t, [field]: true }));

  const input = useMemo(() => toInput(form), [form]);
  const problems = useMemo(() => validateInput(input), [input]);
  const problem = (field: 'name' | 'url' | 'command') => problems.find((p) => p.field === field);
  const invalid = (field: 'name' | 'url' | 'command') => (touched[field] && problem(field)?.level === 'error' ? true : undefined);
  const hintClass = (field: 'name' | 'url' | 'command') => `${HINT} ${touched[field] && problem(field)?.level === 'error' ? 'font-medium text-red-700' : ''}`;

  const selected = MCP_CLIENTS.filter((c) => form.clients.includes(c.id));
  const toggle = (id: string) =>
    set({ clients: MCP_CLIENTS.map((c) => c.id).filter((x) => (x === id ? !form.clients.includes(id) : form.clients.includes(x))) });

  const copyLink = () => {
    const encoded = encodeState(form);
    const url = `${window.location.origin}${window.location.pathname}${encoded ? `#${encoded}` : ''}`;
    const report = (next: 'copied' | 'failed') => {
      setLinkStatus(next);
      if (linkTimer.current) clearTimeout(linkTimer.current);
      linkTimer.current = setTimeout(() => setLinkStatus('idle'), 2000);
    };
    try {
      navigator.clipboard.writeText(url).then(
        () => report('copied'),
        () => report('failed'),
      );
    } catch {
      report('failed');
    }
  };

  const timeoutBad = form.timeout.trim() !== '' && !(Number(form.timeout) >= 1);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <form
        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        aria-label="MCP server"
      >
        <div>
          <label className={LABEL} htmlFor={`${uid}-name`}>
            Server name
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
            onBlur={() => blur('name')}
            aria-describedby={`${uid}-name-hint`}
            aria-invalid={invalid('name')}
            required
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className={FIELD}
          />
          <p id={`${uid}-name-hint`} className={hintClass('name')}>
            {problem('name')?.message ?? 'The name each client lists the server under.'}
          </p>
        </div>

        <fieldset>
          <legend className={LABEL}>How the client reaches the server</legend>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-900">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name={`${uid}-transport`}
                checked={form.transport === 'http'}
                onChange={() => set({ transport: 'http' })}
                className={`h-4 w-4 accent-indigo-600 ${FOCUS}`}
              />
              Remote URL (Streamable HTTP)
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name={`${uid}-transport`}
                checked={form.transport === 'stdio'}
                onChange={() => set({ transport: 'stdio' })}
                className={`h-4 w-4 accent-indigo-600 ${FOCUS}`}
              />
              Local command (stdio)
            </label>
          </div>
        </fieldset>

        {form.transport === 'http' ? (
          <div>
            <label className={LABEL} htmlFor={`${uid}-url`}>
              Server URL
            </label>
            <input
              id={`${uid}-url`}
              name="url"
              type="url"
              inputMode="url"
              value={form.url}
              onChange={(e) => set({ url: e.target.value })}
              onBlur={() => blur('url')}
              aria-describedby={`${uid}-url-hint`}
              aria-invalid={invalid('url')}
              required
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="https://example.com/mcp"
              className={FIELD}
            />
            <p id={`${uid}-url-hint`} className={hintClass('url')}>
              {problem('url')?.message ?? 'The Streamable HTTP endpoint, usually ending in /mcp.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-x-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div>
              <label className={LABEL} htmlFor={`${uid}-command`}>
                Command
              </label>
              <input
                id={`${uid}-command`}
                name="command"
                value={form.command}
                onChange={(e) => set({ command: e.target.value })}
                onBlur={() => blur('command')}
                aria-describedby={`${uid}-command-hint`}
                aria-invalid={invalid('command')}
                required
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="npx"
                className={FIELD}
              />
              <p id={`${uid}-command-hint`} className={hintClass('command')}>
                {problem('command')?.message ?? 'The executable only.'}
              </p>
            </div>
            <div>
              <label className={LABEL} htmlFor={`${uid}-args`}>
                Arguments
              </label>
              <input
                id={`${uid}-args`}
                name="args"
                value={form.args}
                onChange={(e) => set({ args: e.target.value })}
                aria-describedby={`${uid}-args-hint`}
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="-y @scope/server"
                className={FIELD}
              />
              <p id={`${uid}-args-hint`} className={HINT}>
                Separated by spaces. Put quotes around one that contains a space.
              </p>
            </div>
          </div>
        )}

        {form.transport === 'http' ? (
          <Rows
            legend="HTTP headers (optional)"
            noun="Header"
            rows={form.headers}
            keyPlaceholder="Authorization"
            valuePlaceholder="Bearer …"
            onChange={(headers) => set({ headers })}
          />
        ) : (
          <Rows
            legend="Environment variables (optional)"
            noun="Variable"
            rows={form.env}
            keyPlaceholder="API_KEY"
            valuePlaceholder="value"
            onChange={(env) => set({ env })}
          />
        )}

        <div>
          <label className={LABEL} htmlFor={`${uid}-timeout`}>
            Tool-call timeout in seconds (optional)
          </label>
          <input
            id={`${uid}-timeout`}
            name="timeout"
            inputMode="numeric"
            value={form.timeout}
            onChange={(e) => set({ timeout: e.target.value.replace(/[^0-9]/g, '').slice(0, 6) })}
            aria-describedby={`${uid}-timeout-hint`}
            aria-invalid={timeoutBad ? true : undefined}
            autoComplete="off"
            placeholder="120"
            className={`${FIELD} max-w-40`}
          />
          <p id={`${uid}-timeout-hint`} className={HINT}>
            {timeoutBad ? 'Enter 1 or more, or leave it empty.' : 'Written only for clients that document a per-server timeout setting.'}
          </p>
        </div>

        <fieldset>
          <legend className={LABEL}>
            Clients ({selected.length} of {MCP_CLIENTS.length} selected)
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {MCP_CLIENTS.map((c) => {
              const on = form.clients.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(c.id)}
                  className={`inline-flex items-center gap-1 rounded-full border py-1.5 pl-2 pr-3 text-xs font-medium transition ${FOCUS} ${
                    on ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-300 bg-white text-gray-700 hover:border-indigo-400 hover:text-indigo-700'
                  }`}
                >
                  <span aria-hidden="true" className="inline-block w-3 text-center">
                    {on ? '✓' : ''}
                  </span>
                  {c.name}
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" onClick={() => set({ clients: MCP_CLIENTS.map((c) => c.id) })} className={SMALL_BTN}>
              Select all
            </button>
            <button type="button" onClick={() => set({ clients: [] })} className={SMALL_BTN}>
              Clear
            </button>
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
          <button type="button" onClick={copyLink} className={`min-w-[9.5rem] ${SMALL_BTN}`}>
            {linkStatus === 'copied' ? '✓ Link copied' : linkStatus === 'failed' ? 'Link not copied' : 'Copy link to this setup'}
          </button>
          <button
            type="button"
            onClick={() => {
              setTouched({});
              setForm(DEFAULT_STATE);
            }}
            className={SMALL_BTN}
          >
            Reset to the example
          </button>
          <span role="status" className="sr-only">
            {linkStatus === 'copied' ? 'Link copied' : linkStatus === 'failed' ? 'The link could not be copied. Copy the address from the address bar.' : ''}
          </span>
        </div>
      </form>

      <section aria-labelledby={`${uid}-out`} className="min-w-0 space-y-4">
        <h2 id={`${uid}-out`} className="sr-only">
          Setup for each selected client
        </h2>
        {selected.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gray-300 p-6 text-sm text-gray-600">
            No client is selected. Choose one or more under Clients to see its command and config.
          </p>
        ) : (
          selected.map((c) => <ClientCard key={c.id} client={c} input={input} />)
        )}
      </section>
    </div>
  );
}
