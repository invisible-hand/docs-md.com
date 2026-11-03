'use client';

import { useMemo, useState } from 'react';
import DiscordMessage from '@/components/discord/DiscordMessage';
import { BTN_GHOST, BTN_PRIMARY, useCopy } from '@/components/tools/toolkit';
import { ANSI_BG, ANSI_FG } from '@/lib/discord/render';

const LABEL = 'text-xs font-semibold uppercase tracking-wide text-gray-500';
const ESC = '\u001b';

type Run = { id: number; text: string; fg: number | null; bg: number | null; bold: boolean; underline: boolean };

let nextId = 4;
const START: Run[] = [
  { id: 1, text: 'Build ', fg: null, bg: null, bold: false, underline: false },
  { id: 2, text: 'passed', fg: 32, bg: null, bold: true, underline: false },
  { id: 3, text: ' · 2 warnings', fg: 33, bg: null, bold: false, underline: false },
];

/** The SGR codes for one run, e.g. "1;32" for bold green. Every run starts from a reset (0) so styles never leak. */
function sgr(r: Run): string {
  const codes = ['0'];
  if (r.bold) codes.push('1');
  if (r.underline) codes.push('4');
  if (r.fg) codes.push(String(r.fg));
  if (r.bg) codes.push(String(r.bg));
  return codes.join(';');
}

/** The full message: an ```ansi code block with an escape sequence before each run and a reset at the end. */
export function buildAnsiMessage(runs: Run[], escape = ESC): string {
  const body = runs.map((r) => `${escape}[${sgr(r)}m${r.text}`).join('') + `${escape}[0m`;
  return '```ansi\n' + body + '\n```';
}

export default function DiscordColoredText() {
  const [runs, setRuns] = useState<Run[]>(START);
  const [copied, copy] = useCopy();
  const message = useMemo(() => buildAnsiMessage(runs), [runs]);
  const readable = useMemo(() => buildAnsiMessage(runs, '\\u001b'), [runs]);
  const update = (id: number, patch: Partial<Run>) => setRuns((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {runs.map((r, i) => (
          <div key={r.id} className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <span className={LABEL}>Part {i + 1}</span>
              <input
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-indigo-400 focus:outline-none"
                value={r.text}
                aria-label={`Text of part ${i + 1}`}
                onChange={(e) => update(r.id, { text: e.target.value })}
              />
              {runs.length > 1 && (
                <button type="button" className="text-sm text-gray-500 hover:text-red-600" onClick={() => setRuns((rs) => rs.filter((x) => x.id !== r.id))}>
                  Remove
                </button>
              )}
            </div>
            <Swatches label="Text colour" palette={ANSI_FG} value={r.fg} onPick={(fg) => update(r.id, { fg })} />
            <Swatches label="Background" palette={ANSI_BG} value={r.bg} onPick={(bg) => update(r.id, { bg })} />
            <div className="flex gap-4 text-sm text-gray-700">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={r.bold} onChange={(e) => update(r.id, { bold: e.target.checked })} /> Bold
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={r.underline} onChange={(e) => update(r.id, { underline: e.target.checked })} /> Underline
              </label>
            </div>
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          <button type="button" className={BTN_GHOST} onClick={() => setRuns((rs) => [...rs, { id: nextId++, text: ' more text', fg: 36, bg: null, bold: false, underline: false }])}>
            Add a part
          </button>
          <button type="button" className={BTN_GHOST} onClick={() => setRuns((rs) => [...rs, { id: nextId++, text: '\n', fg: null, bg: null, bold: false, underline: false }])}>
            Add a line break
          </button>
        </div>
      </div>

      <div>
        <div className={`${LABEL} pb-2`}>Discord shows</div>
        <DiscordMessage source={message} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={LABEL}>Message to paste</span>
          <button type="button" className={BTN_PRIMARY} onClick={() => copy(message)}>
            {copied ? 'Copied' : 'Copy for Discord'}
          </button>
        </div>
        <pre className="overflow-x-auto rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">{readable}</pre>
        <p className="text-xs text-gray-500">
          Shown with <code>\u001b</code> where the copied text has the invisible escape character. Copy with the button: typing{' '}
          <code>\u001b</code> by hand does not work in Discord.
        </p>
      </div>
    </div>
  );
}

function Swatches({
  label,
  palette,
  value,
  onPick,
}: {
  label: string;
  palette: Record<number, { name: string; hex: string }>;
  value: number | null;
  onPick: (code: number | null) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-24 text-xs text-gray-500">{label}</span>
      <button
        type="button"
        onClick={() => onPick(null)}
        className={`h-7 rounded-md border px-2 text-xs ${value === null ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300'}`}
      >
        None
      </button>
      {Object.entries(palette).map(([code, c]) => (
        <button
          key={code}
          type="button"
          title={`${c.name} (${code})`}
          aria-label={`${c.name}, ANSI ${code}`}
          onClick={() => onPick(Number(code))}
          className={`h-7 w-7 rounded-md border ${value === Number(code) ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300'}`}
          style={{ backgroundColor: c.hex }}
        />
      ))}
    </div>
  );
}
