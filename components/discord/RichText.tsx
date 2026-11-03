import Link from 'next/link';
import type { ReactNode } from 'react';

const TOKEN = /(`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;

/** Renders the two inline forms the topic data allows: `code` and [label](href). Everything else is text. */
export default function RichText({ text }: { text: string }): ReactNode {
  const parts = text.split(TOKEN).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith('`') && p.endsWith('`')) {
      return (
        <code key={i} className="rounded bg-gray-100 px-1.5 py-0.5 text-[0.9em] text-gray-900">
          {p.slice(1, -1)}
        </code>
      );
    }
    const m = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(p);
    if (m) {
      return m[2].startsWith('/') ? (
        <Link key={i} href={m[2]} className="text-indigo-700 underline">
          {m[1]}
        </Link>
      ) : (
        <a key={i} href={m[2]} className="text-indigo-700 underline" rel="noopener noreferrer">
          {m[1]}
        </a>
      );
    }
    return <span key={i}>{p}</span>;
  });
}
