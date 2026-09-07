import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import type { Example } from '@/lib/examples';

// Renders a worked example from content/examples with the actions the
// walkthrough pages promise: view raw, download, open in the viewer, open in
// the editor. Nothing here publishes anything — sharing is always a separate,
// explicit click in the homepage editor.
const ACTION =
  'rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700';

export default function ExamplePanel({ example }: { example: Example }) {
  const raw = `/examples/${example.slug}/raw`;
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-mono text-sm text-gray-900">{example.filename}</p>
          <p className="text-xs text-gray-500">
            {example.body.length.toLocaleString()} characters · fictional example, same file as the download
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={raw} className={ACTION}>
            View raw
          </a>
          <a href={`${raw}?download=1`} className={ACTION} download={example.filename}>
            Download .md
          </a>
          <Link href={`/markdown-viewer?example=${example.slug}`} className={ACTION}>
            Open in viewer
          </Link>
          <Link
            href={`/?example=${example.slug}`}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
          >
            Open in editor
          </Link>
        </div>
      </div>
      <div className="px-5 py-5 md:px-8">
        <MarkdownRenderer content={example.body} />
      </div>
    </div>
  );
}
