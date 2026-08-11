import type { TocEntry } from '@/lib/toc';

interface TableOfContentsProps {
  entries: TocEntry[];
}

export default function TableOfContents({ entries }: TableOfContentsProps) {
  if (entries.length < 3) {
    return null;
  }

  return (
    <nav className="hidden lg:block" aria-label="Table of contents">
      <div className="sticky top-8 max-h-[80vh] w-56 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 text-sm shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">On this page</p>
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.slug} style={{ paddingLeft: `${(entry.depth - 1) * 12}px` }}>
              <a
                href={`#${entry.slug}`}
                className="block truncate text-gray-600 transition hover:text-indigo-700"
              >
                {entry.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
