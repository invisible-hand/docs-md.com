'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { BTN_GHOST, useCopy } from '@/components/tools/toolkit';
import { TIMESTAMP_STYLES, formatTimestamp } from '@/lib/discord/render';

const LABEL = 'text-xs font-semibold uppercase tracking-wide text-gray-500';
const INPUT = 'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none';

/** Offset (ms) of `timeZone` from UTC at instant `ms`. */
function zoneOffset(ms: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(ms));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return asUtc - Math.floor(ms / 1000) * 1000;
}

/** Unix seconds for a wall-clock time ("YYYY-MM-DDTHH:mm") in `timeZone`. */
export function wallTimeToUnix(local: string, timeZone: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(local);
  if (!m) return null;
  const guess = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] ?? 0));
  let ms = guess - zoneOffset(guess, timeZone);
  ms = guess - zoneOffset(ms, timeZone);
  return Math.floor(ms / 1000);
}

/** "YYYY-MM-DDTHH:mm" for `unix` in `timeZone`, for the datetime-local input. */
function unixToWallTime(unix: number, timeZone: string): string {
  const ms = unix * 1000 + zoneOffset(unix * 1000, timeZone);
  return new Date(ms).toISOString().slice(0, 16);
}

const subscribe = () => () => {};

const PRESETS: Array<{ label: string; seconds: number }> = [
  { label: '+1 hour', seconds: 3600 },
  { label: '+1 day', seconds: 86400 },
  { label: '+1 week', seconds: 604800 },
];

export default function DiscordTimestamp() {
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  const browserZone = isClient ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC';
  const zones = useMemo(() => {
    if (!isClient) return ['UTC'];
    const all = typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : [];
    return Array.from(new Set([browserZone, 'UTC', ...all]));
  }, [isClient, browserZone]);

  const [zone, setZone] = useState<string | null>(null);
  const tz = zone ?? browserZone;
  const [unix, setUnix] = useState<number | null>(null);
  const [paste, setPaste] = useState('');
  const now = isClient ? Math.floor(Date.now() / 1000) : 1_800_000_000;
  const value = unix ?? Math.floor(now / 60) * 60;
  const wall = unixToWallTime(value, tz);
  const locale = isClient ? navigator.language || 'en-US' : 'en-US';

  const decoded = useMemo(() => {
    const m = /<t:(-?\d+)(?::([tTdDfFsSR]))?>/.exec(paste) ?? /^\s*(-?\d{9,11})\s*$/.exec(paste);
    return m ? { unix: Number(m[1]), style: m[2] ?? 'f' } : null;
  }, [paste]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 md:grid-cols-3">
        <label className="space-y-1">
          <span className={LABEL}>Date and time</span>
          <input
            type="datetime-local"
            className={`${INPUT} w-full`}
            value={wall}
            onChange={(e) => {
              const u = wallTimeToUnix(e.target.value, tz);
              if (u !== null) setUnix(u);
            }}
          />
        </label>
        <label className="space-y-1">
          <span className={LABEL}>Time zone</span>
          <select className={`${INPUT} w-full`} value={tz} onChange={(e) => setZone(e.target.value)}>
            {zones.map((z) => (
              <option key={z} value={z}>
                {z === browserZone ? `${z} (yours)` : z}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className={LABEL}>Unix timestamp</span>
          <input
            inputMode="numeric"
            className={`${INPUT} w-full font-mono`}
            value={String(value)}
            onChange={(e) => {
              const n = Number(e.target.value.replace(/\D/g, '').slice(0, 11));
              if (Number.isFinite(n)) setUnix(n);
            }}
          />
        </label>
        <div className="flex flex-wrap gap-2 md:col-span-3">
          <button type="button" className={BTN_GHOST} onClick={() => setUnix(Math.floor(Date.now() / 1000))}>
            Now
          </button>
          {PRESETS.map((p) => (
            <button key={p.label} type="button" className={BTN_GHOST} onClick={() => setUnix(value + p.seconds)}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left">
              <th className="px-4 py-2.5 font-semibold text-gray-950">Style</th>
              <th className="px-4 py-2.5 font-semibold text-gray-950">Paste into Discord</th>
              <th className="px-4 py-2.5 font-semibold text-gray-950">Readers see (your locale)</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {TIMESTAMP_STYLES.map((s) => (
              <Row key={s.style} code={`<t:${value}:${s.style}>`} name={s.name} preview={formatTimestamp(value, s.style, locale, isClient ? Date.now() : value * 1000, isClient ? undefined : 'UTC')} />
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-600">
        Discord shows each reader the time in their own time zone and language, so the preview above is what you would
        see; someone in another country sees the same moment in their local time. Relative times (<code className="rounded bg-gray-100 px-1">R</code>) update
        live in the Discord client.
      </p>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <label className="block space-y-1">
          <span className={LABEL}>Decode a timestamp</span>
          <input className={`${INPUT} w-full font-mono`} placeholder="<t:1767225600:F> or 1767225600" value={paste} onChange={(e) => setPaste(e.target.value)} />
        </label>
        {decoded && (
          <p className="mt-3 text-sm text-gray-700">
            {new Date(decoded.unix * 1000).toISOString().replace('T', ' ').slice(0, 19)} UTC · in your locale:{' '}
            <strong>{formatTimestamp(decoded.unix, 'F', locale)}</strong> ({formatTimestamp(decoded.unix, 'R', locale)}){' '}
            <button type="button" className="ml-2 text-indigo-700 underline" onClick={() => setUnix(decoded.unix)}>
              Edit this time
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

function Row({ code, name, preview }: { code: string; name: string; preview: string }) {
  const [copied, copy] = useCopy();
  return (
    <tr className="border-b border-gray-100">
      <td className="px-4 py-2.5 text-gray-700">{name}</td>
      <td className="px-4 py-2.5">
        <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-gray-900">{code}</code>
      </td>
      <td className="px-4 py-2.5 text-gray-900">{preview}</td>
      <td className="px-4 py-2.5 text-right">
        <button type="button" className={BTN_GHOST} onClick={() => copy(code)}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </td>
    </tr>
  );
}
