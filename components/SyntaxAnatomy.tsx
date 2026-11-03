/**
 * A vector diagram of one line of markup: each part in its own box, labelled underneath.
 * `kind` picks the colour: markers (the syntax you type), content (your text), extra (arguments).
 * Pure SVG, server-rendered, scales with its container; widths are estimated from a monospace font.
 */
export type AnatomyPart = { text: string; label?: string; kind: 'marker' | 'content' | 'extra' };

const FILL: Record<AnatomyPart['kind'], { box: string; stroke: string; text: string }> = {
  marker: { box: '#eef2ff', stroke: '#6366f1', text: '#3730a3' },
  content: { box: '#f9fafb', stroke: '#d1d5db', text: '#111827' },
  extra: { box: '#ecfdf5', stroke: '#10b981', text: '#065f46' },
};

const CHAR_W = 10.2;
const PAD = 10;
const GAP = 6;

export default function SyntaxAnatomy({ parts, title }: { parts: AnatomyPart[]; title: string }) {
  const widths = parts.map((p) => Math.max(p.text.length * CHAR_W + PAD * 2, (p.label?.length ?? 0) * 6.4 + 8, 28));
  const boxes = parts.map((p, i) => ({ ...p, w: widths[i], x: widths.slice(0, i).reduce((a, w) => a + w + GAP, 0) }));
  const width = Math.max(widths.reduce((a, w) => a + w, 0) + GAP * (parts.length - 1), 120);
  const height = 92;
  return (
    <figure className="not-prose my-4">
      <svg
        viewBox={`-2 -2 ${width + 4} ${height + 4}`}
        className="h-auto w-full max-w-2xl"
        role="img"
        aria-label={`${title}: ${parts.map((p) => `${p.text}${p.label ? ` (${p.label})` : ''}`).join(', ')}`}
      >
        <title>{title}</title>
        {boxes.map((b, i) => {
          const c = FILL[b.kind];
          return (
            <g key={i}>
              <rect x={b.x} y={0} width={b.w} height={40} rx={8} fill={c.box} stroke={c.stroke} strokeWidth={1.5} />
              <text
                x={b.x + b.w / 2}
                y={26}
                textAnchor="middle"
                fontFamily="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
                fontSize={17}
                fill={c.text}
                xmlSpace="preserve"
              >
                {b.text}
              </text>
              {b.label && (
                <>
                  <line x1={b.x + b.w / 2} y1={42} x2={b.x + b.w / 2} y2={56} stroke={c.stroke} strokeWidth={1.2} />
                  <text x={b.x + b.w / 2} y={72} textAnchor="middle" fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize={11} fill="#4b5563">
                    {b.label}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-1 text-xs text-gray-500">{title}</figcaption>
    </figure>
  );
}
