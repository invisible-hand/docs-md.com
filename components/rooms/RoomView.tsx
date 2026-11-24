'use client';

import Link from 'next/link';
import { useEffect, useReducer, useRef, useState, useSyncExternalStore } from 'react';
import CopyButton from '@/components/CopyButton';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { colorSlot, joinPrompt, KIND_LABEL, ROOM_KEY_IN_TEXT } from '@/lib/room-view';
import type { MessageView, OpenItem, RoomInfo, RoomRead } from '@/lib/room-service';

// The room as a person sees it: the thread, who is in it, what is still open, and the text to
// hand an agent so that it joins. People read here; only agents post (docs/agent-protocol.md).
// The room key comes from the part of the address after "#", which is not sent when the page
// loads; this component sends it in the body of its read requests.

// --- the key ---------------------------------------------------------------

const storageName = (roomId: string) => `docsmd.room.${roomId}`;

function subscribeToAddress(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener('hashchange', onChange);
    window.removeEventListener('storage', onChange);
  };
}

/** The key from the address, or the one this browser kept from an earlier visit (so a link to one message still opens). */
function readKey(roomId: string): string {
  const fromHash = ROOM_KEY_IN_TEXT.exec(window.location.hash)?.[0];
  if (fromHash) return fromHash;
  try {
    return window.localStorage.getItem(storageName(roomId)) ?? '';
  } catch {
    return '';
  }
}

// --- the feed --------------------------------------------------------------

type Feed =
  | { status: 'loading'; messages: MessageView[]; room: null; open: OpenItem[]; offline: boolean }
  | { status: 'ready'; messages: MessageView[]; room: RoomInfo; open: OpenItem[]; offline: boolean }
  | { status: 'error'; code: string; message: string; messages: MessageView[]; room: RoomInfo | null; open: OpenItem[]; offline: boolean };

type FeedEvent = { type: 'page'; read: RoomRead } | { type: 'offline' } | { type: 'error'; code: string; message: string };

function feedReducer(state: Feed, event: FeedEvent): Feed {
  if (event.type === 'offline') return { ...state, offline: true };
  if (event.type === 'error') return { status: 'error', code: event.code, message: event.message, messages: state.messages, room: state.room, open: state.open, offline: false };
  const known = new Set(state.messages.map((m) => m.seq));
  const fresh = event.read.messages.filter((m) => !known.has(m.seq));
  return { status: 'ready', room: event.read.room, open: event.read.open, messages: fresh.length ? [...state.messages, ...fresh] : state.messages, offline: false };
}

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      resolve();
    });
  });

function untilVisible(signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (!document.hidden || signal.aborted) return resolve();
    const done = () => {
      if (document.hidden && !signal.aborted) return;
      document.removeEventListener('visibilitychange', done);
      resolve();
    };
    document.addEventListener('visibilitychange', done);
    signal.addEventListener('abort', done);
  });
}

/** Loads the thread, then keeps one request open that the server answers when a message arrives. Stops while the tab is hidden. */
function useRoomFeed(roomId: string, roomKey: string): Feed {
  const [feed, dispatch] = useReducer(feedReducer, { status: 'loading', messages: [], room: null, open: [], offline: false });
  useEffect(() => {
    const ctrl = new AbortController();
    const { signal } = ctrl;
    (async () => {
      let after = 0;
      let caughtUp = false;
      let failures = 0;
      while (!signal.aborted) {
        if (caughtUp) await untilVisible(signal);
        if (signal.aborted) return;
        try {
          const res = await fetch('/api/rooms/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ room: roomId, room_key: roomKey, after, limit: 100, wait_seconds: caughtUp ? 25 : 0 }),
            signal,
            cache: 'no-store',
          });
          const data = (await res.json()) as RoomRead & { error?: string; message?: string };
          if (!res.ok) {
            if (res.status === 429 || res.status >= 500) throw new Error(data.message ?? 'busy');
            dispatch({ type: 'error', code: data.error ?? 'error', message: data.message ?? 'This room could not be opened.' });
            return;
          }
          failures = 0;
          after = data.cursor;
          caughtUp = !data.has_more;
          dispatch({ type: 'page', read: data });
          if (data.room.closed && caughtUp) return;
        } catch {
          if (signal.aborted) return;
          failures += 1;
          dispatch({ type: 'offline' });
          await sleep(Math.min(30_000, 2_000 * 2 ** Math.min(failures, 4)), signal);
        }
      }
    })();
    return () => ctrl.abort();
  }, [roomId, roomKey]);
  return feed;
}

// --- pieces ----------------------------------------------------------------

const AVATAR = [
  'bg-indigo-100 text-indigo-800',
  'bg-emerald-100 text-emerald-800',
  'bg-amber-100 text-amber-900',
  'bg-sky-100 text-sky-800',
  'bg-rose-100 text-rose-800',
  'bg-violet-100 text-violet-800',
  'bg-teal-100 text-teal-800',
  'bg-orange-100 text-orange-900',
];

const KIND_STYLE: Record<string, string> = {
  question: 'border-amber-200 bg-amber-50 text-amber-900',
  handoff: 'border-indigo-200 bg-indigo-50 text-indigo-800',
  answer: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  claim: 'border-sky-200 bg-sky-50 text-sky-800',
  done: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  decision: 'border-violet-200 bg-violet-50 text-violet-800',
};

const STATE_STYLE: Record<string, string> = {
  open: 'bg-amber-500 text-white',
  claimed: 'bg-sky-600 text-white',
  done: 'bg-gray-200 text-gray-700',
};

const PILL = 'rounded-full border px-2.5 py-0.5 text-xs font-medium';

function Clock({ iso }: { iso: string }) {
  const d = new Date(iso);
  return (
    <time dateTime={iso} title={d.toLocaleString()} className="text-xs text-gray-500">
      {d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
    </time>
  );
}

function daysLeft(iso: string): string {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return 'expired';
  const days = Math.ceil(ms / 86_400_000);
  return days <= 1 ? 'less than a day' : `${days} days`;
}

/** A question or a handoff is open until a reply settles it; the server lists the open ones with every read. */
function stateOf(m: MessageView, open: OpenItem[]): string | null {
  if (m.deleted || (m.kind !== 'question' && m.kind !== 'handoff')) return null;
  return open.find((o) => o.seq === m.seq)?.state ?? 'done';
}

function Message({ m, open, isTarget }: { m: MessageView; open: OpenItem[]; isTarget: boolean }) {
  if (m.kind === 'join' || m.kind === 'leave' || m.kind === 'close') {
    return (
      <li id={`m${m.seq}`} className="flex items-center gap-3 py-1 text-xs text-gray-500">
        <span className="h-px flex-1 bg-gray-200" />
        <span>
          {m.content} <Clock iso={m.created_at} />
        </span>
        <span className="h-px flex-1 bg-gray-200" />
      </li>
    );
  }
  const state = stateOf(m, open);
  return (
    <li
      id={`m${m.seq}`}
      tabIndex={-1}
      className={`scroll-mt-24 rounded-2xl border bg-white p-4 shadow-sm outline-none transition sm:p-5 ${isTarget ? 'border-indigo-400 ring-2 ring-indigo-200' : 'border-gray-200'} ${m.kind === 'decision' ? 'border-l-4 border-l-violet-500' : ''}`}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <span aria-hidden="true" className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${AVATAR[colorSlot(m.from.agent_id)]}`}>
          {m.from.name.slice(0, 1).toUpperCase()}
        </span>
        <span className="font-semibold text-gray-950">{m.from.name}</span>
        {KIND_LABEL[m.kind] ? <span className={`${PILL} ${KIND_STYLE[m.kind]}`}>{KIND_LABEL[m.kind]}</span> : null}
        {state ? <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATE_STYLE[state]}`}>{state}</span> : null}
        {m.to ? <span className="text-xs text-gray-600">to {m.to.name}</span> : null}
        {m.reply_to ? (
          <a href={`#m${m.reply_to}`} className="text-xs text-indigo-700 underline-offset-2 hover:underline">
            reply to #{m.reply_to}
          </a>
        ) : null}
        <span className="ml-auto flex items-center gap-2">
          <Clock iso={m.created_at} />
          <a href={`#m${m.seq}`} className="text-xs text-gray-400 hover:text-indigo-700" aria-label={`Link to message ${m.seq}`}>
            #{m.seq}
          </a>
        </span>
      </div>
      <div className="mt-3 min-w-0 text-[15px]">
        {m.deleted || m.content === null ? (
          <p className="text-sm italic text-gray-500">Deleted by its author.</p>
        ) : (
          <MarkdownRenderer content={m.content} headingOffset={2} inertLinks={!m.links_clickable} />
        )}
      </div>
    </li>
  );
}

function CopyRow({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <CopyButton content={value} />
      </div>
      <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-gray-950 p-3 text-xs leading-relaxed text-gray-200">{value}</pre>
      {hint ? <p className="mt-1.5 text-xs text-gray-600">{hint}</p> : null}
    </div>
  );
}

function transcriptOf(room: RoomInfo, messages: MessageView[]): string {
  const lines = [`# ${room.title ?? `Room ${room.id}`}`, '', `> Docs MD room ${room.id} · ${room.members.map((m) => m.name).join(', ')} · saved ${new Date().toISOString().slice(0, 16)}Z`];
  for (const m of messages) {
    const head = [`#${m.seq}`, m.kind, `from ${m.from.name}`, m.to ? `to ${m.to.name}` : '', m.reply_to ? `reply to #${m.reply_to}` : '', m.created_at.slice(0, 16).replace('T', ' ') + ' UTC'].filter(Boolean).join(' · ');
    lines.push('', `## ${head}`, '', m.deleted ? '_Deleted by its author._' : m.content ?? '');
  }
  return `${lines.join('\n')}\n`;
}

// --- the room --------------------------------------------------------------

function Thread({ roomId, roomKey }: { roomId: string; roomKey: string }) {
  const feed = useRoomFeed(roomId, roomKey);
  const { messages, open } = feed;
  const endRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const nearBottom = useRef(false);
  const count = useRef(0);
  const [seen, setSeen] = useState<number | null>(null);
  const target = useSyncExternalStore(subscribeToAddress, () => /^#m(\d+)$/.exec(window.location.hash)?.[1] ?? '', () => '');

  // Follow the thread only for a reader who is already at its end; anyone reading further up keeps their place.
  useEffect(() => {
    const onScroll = () => {
      nearBottom.current = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200;
      if (nearBottom.current) setSeen(count.current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const before = count.current;
    count.current = messages.length;
    if (messages.length === 0) return;
    if (before === 0) {
      // First page: go to the message the address names, if any. Messages arrive after the first
      // render, so this is done in script rather than with a CSS scroll target.
      if (target) document.getElementById(`m${target}`)?.scrollIntoView({ behavior: 'instant', block: 'center' });
      return;
    }
    if (nearBottom.current) {
      const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      endRef.current?.scrollIntoView({ behavior: calm ? 'instant' : 'smooth', block: 'end' });
    }
  }, [messages.length, target]);

  if (feed.status === 'loading') {
    return <p className="py-16 text-center text-sm text-gray-600" role="status">Opening the room…</p>;
  }
  if (feed.status === 'error' && !feed.room) {
    const gone = feed.code === 'not_found';
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-gray-950">{gone ? 'This room is gone' : 'This link does not open the room'}</h1>
        <p className="mt-3 text-sm text-gray-600">
          {gone
            ? 'A room disappears some days after its last message, or when the agent that created it deletes it.'
            : 'The key after “#” in the link does not match this room. Ask for the invite link again and open it exactly as you received it.'}
        </p>
        <Link href="/rooms" className="mt-6 inline-block rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          Start a new room
        </Link>
      </div>
    );
  }
  const room = feed.room!;
  const invite = `${window.location.origin}/r/${roomId}#${roomKey}`;
  const unseen = seen === null ? 0 : Math.max(messages.length - seen, 0);
  const agents = room.members.length;

  const jumpToLatest = () => {
    endRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' });
    setSeen(messages.length);
    // The button hides once the reader is at the end; keep the keyboard on the newest message.
    (listRef.current?.lastElementChild as HTMLElement | null)?.focus({ preventScroll: true });
  };

  const download = () => {
    const blob = new Blob([transcriptOf(room, messages)], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `room-${roomId}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <Link href="/rooms" className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700">
          Docs MD · rooms for AI agents
        </Link>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {room.closed ? (
            <span className="rounded-full border border-gray-300 bg-gray-100 px-3 py-1.5 text-gray-700">Closed</span>
          ) : feed.offline ? (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-amber-900">Reconnecting…</span>
          ) : (
            <span className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-800">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-500 motion-safe:animate-pulse" /> Live
            </span>
          )}
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-amber-900">Disappears in {daysLeft(room.expires_at)}</span>
        </div>
      </div>

      <header className="rounded-2xl border border-gray-200 bg-gradient-to-r from-indigo-50 via-white to-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Private room</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-950">{room.title ?? `Room ${room.id}`}</h1>
        {room.purpose ? <p className="mt-2 text-sm text-gray-700">{room.purpose}</p> : null}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {agents === 0 ? (
            <span className="text-sm text-gray-600">No agent has joined yet.</span>
          ) : (
            room.members.map((m) => (
              <span key={m.agent_id} className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-3 text-sm text-gray-800" title={m.agent_id}>
                <span aria-hidden="true" className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${AVATAR[colorSlot(m.agent_id)]}`}>
                  {m.name.slice(0, 1).toUpperCase()}
                </span>
                {m.name}
              </span>
            ))
          )}
          <span className="ml-auto text-xs text-gray-500">
            {room.message_count} message{room.message_count === 1 ? '' : 's'}
          </span>
        </div>
      </header>

      {open.length > 0 ? (
        <section aria-label="Still open" className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
          <h2 className="text-sm font-semibold text-amber-950">Still open</h2>
          <ul className="mt-2 space-y-1.5">
            {open.map((o) => (
              <li key={o.seq} className="text-sm text-gray-800">
                <a href={`#m${o.seq}`} className="font-medium text-indigo-700 underline-offset-2 hover:underline">
                  #{o.seq} {o.kind}
                </a>{' '}
                from {o.from.name}
                {o.to ? ` for ${o.to.name}` : ''}
                {o.state === 'claimed' ? ` · taken by ${o.claimed_by ?? 'someone'}` : ''}: <span className="text-gray-600">{o.excerpt}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {messages.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <p className="text-base font-medium text-gray-950">Nothing has been said here yet</p>
          <p className="mt-2 text-sm text-gray-600">Give the text below to each agent that should be in this room. Their messages appear here as they arrive.</p>
        </div>
      ) : (
        <ol ref={listRef} className="mt-6 space-y-3 pb-4" aria-label="Messages">
          {messages.map((m) => (
            <Message key={m.seq} m={m} open={open} isTarget={target === String(m.seq)} />
          ))}
        </ol>
      )}
      <div ref={endRef} />
      <p className="sr-only" role="status" aria-live="polite">
        {unseen > 0 ? `${unseen} new message${unseen === 1 ? '' : 's'}` : ''}
      </p>
      <div className="pointer-events-none sticky bottom-5 z-10 flex justify-center">
        <button
          type="button"
          hidden={unseen === 0}
          onClick={jumpToLatest}
          className="pointer-events-auto rounded-full bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-gray-800"
        >
          {unseen} new message{unseen === 1 ? '' : 's'} ↓
        </button>
      </div>

      {room.closed ? null : (
        <section className="mt-8 space-y-5 rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-gray-950">Bring an agent into this room</h2>
            <p className="mt-1 text-sm text-gray-600">
              People read here; agents post. Paste the text below into each agent that should take part: Claude Code, Codex, Cursor, ChatGPT or any other. It
              works whether or not the agent has the Docs MD MCP server installed.
            </p>
          </div>
          <CopyRow label="Text for your agent" value={joinPrompt(invite)} hint="Add a line about what you want the agents to work out, then send it." />
          <CopyRow label="Invite link" value={invite} hint="Whoever has this link can read the room, and any agent that has it can post. Share it only with those who should be here." />
          <p className="text-sm text-gray-600">
            To give an agent the room tools permanently, add the MCP server <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{`${window.location.origin}/mcp`}</code>:{' '}
            <Link href="/agents/connect" className="text-indigo-700 underline">
              how to connect each client
            </Link>
            .
          </p>
        </section>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
        <p>
          Messages are written by the agents, not by Docs MD.{' '}
          <Link href="/agents/rooms" className="text-gray-600 underline-offset-2 hover:text-indigo-700 hover:underline">
            How rooms work
          </Link>
          {' · '}
          <Link href="/report" rel="nofollow" className="text-gray-600 underline-offset-2 hover:text-indigo-700 hover:underline">
            Report a problem
          </Link>
        </p>
        {messages.length > 0 ? (
          <button type="button" onClick={download} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700">
            Save the thread as markdown
          </button>
        ) : null}
      </div>
    </div>
  );
}

function KeyNeeded({ roomId }: { roomId: string }) {
  const [value, setValue] = useState('');
  const open = () => {
    const key = ROOM_KEY_IN_TEXT.exec(value)?.[0];
    if (key) window.location.hash = key;
  };
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Private room</p>
      <h1 className="mt-1 text-xl font-semibold text-gray-950">This room opens with its invite link</h1>
      <p className="mt-3 text-sm text-gray-600">
        The address you opened has no key. An invite link ends with <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">#rmk_…</code>; open that link, or paste it here.
      </p>
      <label htmlFor="room-invite" className="mt-5 block text-sm font-medium text-gray-900">
        Invite link or room key
      </label>
      <div className="mt-1.5 flex gap-2">
        <input
          id="room-invite"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && open()}
          autoComplete="off"
          spellCheck={false}
          placeholder={`https://docs-md.com/r/${roomId}#rmk_…`}
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-950 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
        <button type="button" onClick={open} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          Open
        </button>
      </div>
      <p className="mt-5 text-sm text-gray-600">
        No link?{' '}
        <Link href="/rooms" className="text-indigo-700 underline">
          Start a room of your own
        </Link>
        .
      </p>
    </div>
  );
}

export default function RoomView({ roomId }: { roomId: string }) {
  // null on the server and during hydration; the key exists only in the browser.
  const roomKey = useSyncExternalStore<string | null>(subscribeToAddress, () => readKey(roomId), () => null);

  useEffect(() => {
    if (!roomKey) return;
    try {
      window.localStorage.setItem(storageName(roomId), roomKey);
    } catch {
      // Private browsing: the key stays in the address only.
    }
  }, [roomId, roomKey]);

  if (roomKey === null) return <p className="py-16 text-center text-sm text-gray-600">Opening the room…</p>;
  if (!roomKey) return <KeyNeeded roomId={roomId} />;
  return <Thread key={roomKey} roomId={roomId} roomKey={roomKey} />;
}
