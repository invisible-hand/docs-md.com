// Static Markdown → target-syntax table rendered on the dialect converter
// pages. Server component; the rows are plain data so the table is readable
// without JavaScript.

export interface MappingRow {
  element: string;
  markdown: string;
  target: string;
  note?: string;
}

const TH = 'border-b border-gray-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500';
const TD = 'border-b border-gray-100 px-3 py-2 align-top text-sm text-gray-700';
const CODE = 'whitespace-pre-wrap rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-900';

export default function SyntaxMappingTable({ target, rows }: { target: string; rows: MappingRow[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className={TH}>Element</th>
            <th className={TH}>Markdown</th>
            <th className={TH}>{target}</th>
            <th className={TH}>Note</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.element}>
              <td className={`${TD} font-medium text-gray-900`}>{r.element}</td>
              <td className={TD}>
                <code className={CODE}>{r.markdown}</code>
              </td>
              <td className={TD}>
                <code className={CODE}>{r.target}</code>
              </td>
              <td className={`${TD} text-gray-500`}>{r.note ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
