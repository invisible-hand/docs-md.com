'use client';

import { useEffect, useId, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const reactId = useId();

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'strict' });
        const renderId = `mermaid-${reactId.replace(/[^a-zA-Z0-9]/g, '')}`;
        const { svg: rendered } = await mermaid.render(renderId, chart);
        if (!cancelled) {
          setSvg(rendered);
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chart, reactId]);

  if (error) {
    return (
      <pre className="overflow-x-auto rounded-lg bg-gray-50 p-4 text-sm text-gray-800">
        <code>{chart}</code>
      </pre>
    );
  }

  if (!svg) {
    return <div className="my-4 h-24 animate-pulse rounded-lg bg-gray-100" />;
  }

  return (
    <div
      className="my-4 flex justify-center overflow-x-auto [&_svg]:h-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
