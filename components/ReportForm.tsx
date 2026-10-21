'use client';

import { useState } from 'react';
import { REPORT_REASONS } from '@/lib/legal';

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100';

export default function ReportForm({ initialShare = '' }: { initialShare?: string }) {
  const [share, setShare] = useState(initialShare);
  const [reason, setReason] = useState<string>(REPORT_REASONS[0].value);
  const [details, setDetails] = useState('');
  const [contact, setContact] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setState('sending');
    setError('');
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ share, reason, details, contact }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Could not send the report.');
        setState('idle');
        return;
      }
      setState('sent');
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
      setState('idle');
    }
  }

  if (state === 'sent') {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900">
        <p className="font-semibold">Report received.</p>
        <p className="mt-1">
          We review every report. If you left contact details, we may write to you about it.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-6">
      <div className="space-y-1">
        <label htmlFor="report-share" className="text-sm font-medium text-gray-900">
          Share link
        </label>
        <input
          id="report-share"
          value={share}
          onChange={(e) => setShare(e.target.value)}
          placeholder="https://docs-md.com/calm-river-Ab12C"
          className={inputClass}
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="report-reason" className="text-sm font-medium text-gray-900">
          What is wrong with it?
        </label>
        <select id="report-reason" value={reason} onChange={(e) => setReason(e.target.value)} className={inputClass}>
          {REPORT_REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label htmlFor="report-details" className="text-sm font-medium text-gray-900">
          Details
        </label>
        <textarea
          id="report-details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={5}
          maxLength={5000}
          placeholder="What should we look at? For copyright, name the work and where the original is."
          className={inputClass}
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="report-contact" className="text-sm font-medium text-gray-900">
          Your email <span className="font-normal text-gray-500">(optional, so we can reply)</span>
        </label>
        <input
          id="report-contact"
          type="email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          maxLength={200}
          className={inputClass}
        />
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={state === 'sending'}
        className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
      >
        {state === 'sending' ? 'Sending…' : 'Send report'}
      </button>
    </form>
  );
}
