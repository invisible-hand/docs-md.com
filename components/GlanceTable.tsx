import type { GlanceRow } from '@/lib/cheat-sheet';

interface GlanceTableProps {
  rows: GlanceRow[];
  title: string;
  headers: { element: string; syntax: string; note: string };
}

/** "Markdown syntax at a glance": one row per element, the answer-first summary above the full cheat sheet. */
export default function GlanceTable({ rows, title, headers }: GlanceTableProps) {
  return (
    <section id="at-a-glance" className="scroll-mt-8 space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight text-gray-950">{title}</h2>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">{headers.element}</th>
              <th scope="col" className="px-4 py-3 font-semibold">{headers.syntax}</th>
              <th scope="col" className="px-4 py-3 font-semibold">{headers.note}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.element} className="align-top">
                <th scope="row" className="px-4 py-3 font-medium text-gray-950">{row.element}</th>
                <td className="px-4 py-3">
                  <pre className="whitespace-pre-wrap font-mono text-xs text-gray-800">{row.syntax}</pre>
                </td>
                <td className="px-4 py-3 text-gray-600">{row.note ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
