'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { BTN_DARK, BTN_GHOST, BTN_PILL, downloadFile, useCopy } from '@/components/tools/toolkit';

type Alignment = 'left' | 'center' | 'right';

const ALIGNMENT_CYCLE: Record<Alignment, Alignment> = {
  left: 'center',
  center: 'right',
  right: 'left',
};

const ALIGNMENT_ICON: Record<Alignment, string> = {
  left: '⇤',
  center: '↔',
  right: '⇥',
};

function makeGrid(rows: number, cols: number, fill = ''): string[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill));
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}

function alignmentMarker(alignment: Alignment, width: number): string {
  const dashes = Math.max(3, width);
  if (alignment === 'center') return `:${'-'.repeat(dashes - 2)}:`;
  if (alignment === 'right') return `${'-'.repeat(dashes - 1)}:`;
  return '-'.repeat(dashes);
}

function buildMarkdown(header: string[], body: string[][], alignments: Alignment[]): string {
  const columns = header.length;
  const widths = Array.from({ length: columns }, (_, col) => {
    const cells = [header[col] ?? '', ...body.map((row) => row[col] ?? '')];
    return Math.max(3, ...cells.map((cell) => escapeCell(cell).length));
  });

  const pad = (value: string, col: number) => {
    const escaped = escapeCell(value);
    const gap = widths[col] - escaped.length;
    if (alignments[col] === 'right') return ' '.repeat(gap) + escaped;
    if (alignments[col] === 'center') {
      const left = Math.floor(gap / 2);
      return ' '.repeat(left) + escaped + ' '.repeat(gap - left);
    }
    return escaped + ' '.repeat(gap);
  };

  const headerRow = `| ${header.map((cell, col) => pad(cell, col)).join(' | ')} |`;
  const separator = `| ${alignments.map((a, col) => alignmentMarker(a, widths[col])).join(' | ')} |`;
  const bodyRows = body.map((row) => `| ${row.map((cell, col) => pad(cell, col)).join(' | ')} |`);

  return [headerRow, separator, ...bodyRows].join('\n');
}

interface BodyRowProps {
  row: string[];
  rowIndex: number;
  onCell: (row: number, col: number, value: string) => void;
}

// Memoized so typing in one cell doesn't re-render every other row of the grid.
const BodyRow = memo(function BodyRow({ row, rowIndex, onCell }: BodyRowProps) {
  return (
    <tr>
      {row.map((cell, ci) => (
        <td key={ci} className="p-0">
          <input
            value={cell}
            onChange={(e) => onCell(rowIndex, ci, e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-indigo-400 focus:outline-none"
          />
        </td>
      ))}
    </tr>
  );
});

function parseDelimited(text: string): string[][] | null {
  const lines = text.replace(/\r/g, '').split('\n').filter((line) => line.trim() !== '');
  if (lines.length === 0) return null;
  const delimiter = lines[0].includes('\t') ? '\t' : ',';
  const rows = lines.map((line) => line.split(delimiter).map((cell) => cell.trim()));
  const columns = Math.max(...rows.map((row) => row.length));
  if (columns < 1) return null;
  return rows.map((row) => Array.from({ length: columns }, (_, i) => row[i] ?? ''));
}

export default function TableGenerator() {
  const [header, setHeader] = useState<string[]>(['Name', 'Role', 'Location']);
  const [body, setBody] = useState<string[][]>(makeGrid(3, 3));
  const [alignments, setAlignments] = useState<Alignment[]>(['left', 'left', 'left']);
  const [copied, copy] = useCopy();
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [shareState, setShareState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [shareUrl, setShareUrl] = useState('');

  const columns = header.length;
  const markdown = useMemo(() => buildMarkdown(header, body, alignments), [header, body, alignments]);

  const setCell = useCallback((row: number, col: number, value: string) => {
    setBody((prev) => prev.map((r, ri) => (ri === row ? r.map((c, ci) => (ci === col ? value : c)) : r)));
  }, []);

  const setHeaderCell = (col: number, value: string) => {
    setHeader((prev) => prev.map((c, ci) => (ci === col ? value : c)));
  };

  const addRow = () => setBody((prev) => [...prev, Array.from({ length: columns }, () => '')]);
  const removeRow = () => setBody((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));

  const addColumn = () => {
    setHeader((prev) => [...prev, `Column ${prev.length + 1}`]);
    setBody((prev) => prev.map((row) => [...row, '']));
    setAlignments((prev) => [...prev, 'left']);
  };

  const removeColumn = () => {
    if (columns <= 1) return;
    setHeader((prev) => prev.slice(0, -1));
    setBody((prev) => prev.map((row) => row.slice(0, -1)));
    setAlignments((prev) => prev.slice(0, -1));
  };

  const cycleAlignment = (col: number) => {
    setAlignments((prev) => prev.map((a, ci) => (ci === col ? ALIGNMENT_CYCLE[a] : a)));
  };

  const handleImport = () => {
    const parsed = parseDelimited(importText);
    if (!parsed) return;
    const [first, ...rest] = parsed;
    setHeader(first);
    setBody(rest.length > 0 ? rest : makeGrid(1, first.length));
    setAlignments(Array.from({ length: first.length }, () => 'left'));
    setImportOpen(false);
    setImportText('');
  };

  const handleShare = async () => {
    setShareState('loading');
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: markdown, filename: 'table.md', expiry: '30d' }),
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
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
          <button onClick={addRow} className={BTN_PILL}>+ Row</button>
          <button onClick={removeRow} className={BTN_PILL}>− Row</button>
          <button onClick={addColumn} className={BTN_PILL}>+ Column</button>
          <button onClick={removeColumn} className={BTN_PILL}>− Column</button>
          <button onClick={() => setImportOpen((v) => !v)} className={BTN_PILL}>
            Paste CSV / TSV
          </button>
          <span className="ml-auto text-gray-500">Click ⇤ ↔ ⇥ above a column to change its alignment</span>
        </div>

        {importOpen ? (
          <div className="mb-4 space-y-2">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={5}
              placeholder={'Paste comma- or tab-separated data. First line becomes the header.\nName, Role\nAda, Engineer'}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-sm focus:border-indigo-300 focus:outline-none"
            />
            <button onClick={handleImport} className="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500">
              Convert to table
            </button>
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-separate border-spacing-1">
            <thead>
              <tr>
                {header.map((_, col) => (
                  <th key={col} className="p-0">
                    <button
                      onClick={() => cycleAlignment(col)}
                      title={`Alignment: ${alignments[col]} (click to change)`}
                      className="mb-1 w-full rounded-md border border-dashed border-gray-200 py-0.5 text-xs text-gray-500 transition hover:border-indigo-300 hover:text-indigo-700"
                    >
                      {ALIGNMENT_ICON[alignments[col]]} {alignments[col]}
                    </button>
                  </th>
                ))}
              </tr>
              <tr>
                {header.map((cell, col) => (
                  <th key={col} className="p-0">
                    <input
                      value={cell}
                      onChange={(e) => setHeaderCell(col, e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-indigo-50/50 px-3 py-2 text-sm font-semibold text-gray-900 focus:border-indigo-400 focus:outline-none"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <BodyRow key={ri} row={row} rowIndex={ri} onCell={setCell} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Markdown</h3>
            <div className="flex gap-2">
              <button onClick={() => copy(markdown)} className={BTN_DARK}>
                {copied ? '✓ Copied' : 'Copy markdown'}
              </button>
              <button onClick={() => downloadFile('table.md', markdown, 'text/markdown')} className={BTN_GHOST}>
                Download .md
              </button>
              <button onClick={handleShare} disabled={shareState === 'loading'} className={BTN_GHOST}>
                {shareState === 'loading' ? 'Sharing…' : 'Share as link'}
              </button>
            </div>
          </div>
          <pre className="h-64 overflow-auto rounded-2xl bg-gray-950 p-4 text-sm text-gray-200">
            <code>{markdown}</code>
          </pre>
          {shareState === 'done' ? (
            <p className="mt-2 text-sm text-gray-600">
              Live at{' '}
              <Link href={shareUrl} className="text-indigo-700 underline">
                {shareUrl}
              </Link>{' '}
              (expires in 30 days)
            </p>
          ) : null}
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-900">Preview</h3>
          <div className="h-64 overflow-auto rounded-2xl border border-gray-200 bg-white px-5 py-4">
            <MarkdownRenderer content={markdown} />
          </div>
        </div>
      </div>
    </div>
  );
}
