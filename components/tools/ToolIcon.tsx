import type { ReactNode } from 'react';

// One hand-drawn 24×24 stroke glyph per tool. All share the same stroke
// weight and radius so the /tools grid reads as a set. `currentColor` lets
// the tile decide the color.

const GLYPHS: Record<string, ReactNode> = {
  // convert
  'html-to-markdown': (
    <>
      <path d="M3.5 7.5 6 12l-2.5 4.5" />
      <path d="M11.5 7.5 9 12l2.5 4.5" />
      <path d="M14 16.5V7.5l3 3.5 3-3.5v9" />
    </>
  ),
  'markdown-to-html': (
    <>
      <path d="M3 16.5V7.5l3 3.5 3-3.5v9" />
      <path d="M15.5 7.5 13 12l2.5 4.5" />
      <path d="M18.5 7.5 21 12l-2.5 4.5" />
    </>
  ),
  'markdown-to-pdf': (
    <>
      <path d="M6 3h8l4 4v6" />
      <path d="M14 3v4h4" />
      <path d="M6 3v18h12v-3" />
      <path d="M9 14v-4h1.75a1.75 1.75 0 0 1 0 3.5H9" />
      <path d="M13.5 16.5v-6h1.5a2.25 2.25 0 0 1 2.25 2.25v1.5" />
    </>
  ),
  'pdf-to-markdown': (
    <>
      <path d="M4 20V4h7l3 3v3" />
      <path d="M11 4v3h3" />
      <path d="M7 14v-4h1.5a1.5 1.5 0 0 1 0 3H7" />
      <path d="M14 20v-7l3 3.5 3-3.5v7" />
    </>
  ),
  'markdown-to-word': (
    <>
      <path d="M3 16V8l3 3.5L9 8v8" />
      <path d="M12.5 8 14 16l2-6 2 6 1.5-8" />
    </>
  ),
  'csv-to-markdown': (
    <>
      <path d="M3 5h8M3 9h8M3 13h8M3 17h8" strokeDasharray="1.5 1.5" />
      <path d="M14 18v-8l3 3.5 3-3.5v8" />
      <path d="M11.5 5.5h2.5" />
    </>
  ),

  // generate
  'markdown-table-generator': (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M3 15h18M9 4v16M15 4v16" />
    </>
  ),
  'readme-generator': (
    <>
      <path d="M5 3h10l4 4v14H5z" />
      <path d="M15 3v4h4" />
      <path d="M8 12h8M8 16h8M8 8h3" />
    </>
  ),
  'markdown-toc-generator': (
    <>
      <path d="M4 6h2M9 6h11M4 12h2M9 12h11M4 18h2M9 18h11" />
    </>
  ),
  'markdown-link-generator': (
    <>
      <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1.5 1.5" />
      <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1.5-1.5" />
    </>
  ),
  'markdown-badge-generator': (
    <>
      <rect x="2.5" y="8" width="19" height="8" rx="2" />
      <path d="M11 8v8" />
      <path d="M5.5 12h2.5M14.5 12h3" />
    </>
  ),
  'changelog-generator': (
    <>
      <path d="M6 3v18" />
      <circle cx="6" cy="7" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="6" cy="13" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="6" cy="19" r="1.5" fill="currentColor" stroke="none" />
      <path d="M10 7h10M10 13h7M10 19h9" />
    </>
  ),
  'front-matter-generator': (
    <>
      <path d="M4 4h16v16H4z" />
      <path d="M4 10h16" />
      <path d="M7 7h2M11 7h6" />
      <path d="M7 14h3M7 17h6" />
    </>
  ),

  // check & compare
  'markdown-lint': (
    <>
      <path d="M4 7h9M4 12h6M4 17h8" />
      <path d="m14 15 2.5 2.5L21 13" />
    </>
  ),
  'markdown-diff': (
    <>
      <path d="M4 4h6v16H4z" />
      <path d="M14 4h6v16h-6z" />
      <path d="M6 9h2M6 13h2" />
      <path d="M17 8v3M15.5 9.5h3" />
      <path d="M15.5 15.5h3" />
    </>
  ),
  'markdown-link-checker': (
    <>
      <path d="M9.5 14.5a3.5 3.5 0 0 0 4.95 0l2.55-2.55a3.5 3.5 0 0 0-4.95-4.95L11 8" />
      <path d="M13 9.5a3.5 3.5 0 0 0-4.95 0L5.5 12.05A3.5 3.5 0 0 0 10.45 17" />
      <path d="m15 19 1.5 1.5L20 17" />
    </>
  ),
  'markdown-word-counter': (
    <>
      <path d="M4 6h16M4 10h10M4 14h13M4 18h7" />
      <circle cx="18" cy="17" r="3" />
      <path d="M18 15.5V17l1 1" />
    </>
  ),

  // edit & share
  'markdown-viewer': (
    <>
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  'markdown-formatter': (
    <>
      <path d="M4 6h16M4 10h10M4 14h16M4 18h7" />
      <path d="m16.5 8.5 1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="currentColor" stroke="none" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6" />
    </>
  ),

  // reference
  'markdown-cheat-sheet': (
    <>
      <path d="M4 4h16v16H4z" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </>
  ),
};

export const ICON_SLUGS = Object.keys(GLYPHS);

interface ToolIconProps {
  slug: string;
  className?: string;
}

export default function ToolIcon({ slug, className = 'h-6 w-6' }: ToolIconProps) {
  const glyph = GLYPHS[slug] ?? GLYPHS['markdown-cheat-sheet'];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {glyph}
    </svg>
  );
}

/** A colored rounded tile around the glyph — the unit used in headers and grids. */
export function ToolIconTile({ slug, size = 'md' }: { slug: string; size?: 'sm' | 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-14 w-14 rounded-2xl' : size === 'sm' ? 'h-8 w-8 rounded-lg' : 'h-11 w-11 rounded-xl';
  const icon = size === 'lg' ? 'h-7 w-7' : size === 'sm' ? 'h-4 w-4' : 'h-5.5 w-5.5';
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center border border-indigo-100 bg-indigo-50 text-indigo-700 ${box}`}
    >
      <ToolIcon slug={slug} className={icon} />
    </span>
  );
}
