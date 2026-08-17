'use client';

// Tiny shared kit for the tool components: consistent button styles,
// clipboard handling, and client-side file downloads.

import { useCallback, useEffect, useRef, useState } from 'react';

export const BTN_PRIMARY =
  'rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50';
export const BTN_DARK =
  'rounded-lg bg-gray-950 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-gray-800 disabled:opacity-50';
export const BTN_GHOST =
  'rounded-lg border border-gray-300 px-4 py-1.5 text-xs font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700 disabled:opacity-50';
export const BTN_PILL =
  'rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700';

export function useCopy(): [boolean, (text: string) => void] {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = useCallback((text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error('Failed to copy:', err));
  }, []);

  return [copied, copy];
}

export function downloadFile(filename: string, content: string, mime = 'text/plain'): void {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function wordCount(text: string): { words: number; chars: number } {
  const trimmed = text.trim();
  return {
    words: trimmed === '' ? 0 : trimmed.split(/\s+/).length,
    chars: text.length,
  };
}
