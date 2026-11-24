'use client';

import { useState } from 'react';

/** Creates an empty room and opens it. The invite link is the address of the page that opens. */
export default function StartRoomButton({ label = 'Start a room', className }: { label?: string; className?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const start = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/rooms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      const data = (await res.json()) as { invite?: string; message?: string };
      if (!res.ok || !data.invite) throw new Error(data.message ?? 'The room could not be created. Try again in a moment.');
      // Same host as the page the button is on (a preview deployment opens its own room page).
      const url = new URL(data.invite);
      window.location.assign(`${url.pathname}${url.hash}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The room could not be created.');
      setBusy(false);
    }
  };

  return (
    <span className="inline-flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={start}
        disabled={busy}
        className={className ?? 'rounded-full bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60'}
      >
        {busy ? 'Opening the room…' : label}
      </button>
      {error ? (
        <span role="alert" className="text-sm text-red-700">
          {error}
        </span>
      ) : null}
    </span>
  );
}
