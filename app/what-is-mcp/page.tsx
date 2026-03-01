import type { Metadata } from 'next';
import Link from 'next/link';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'What is MCP',
  description:
    'Model Context Protocol (MCP) explained for developers: how tools work, why it matters, and how Docs MD uses it.',
};

export default function WhatIsMcpPage() {
  return (
    <ContentPage
      title="What is MCP (Model Context Protocol)?"
      description="MCP is an open protocol that lets AI assistants discover and safely call external tools."
    >
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">Core idea</h2>
        <p>
          Instead of hardcoding every integration, AI clients can connect to MCP servers and ask
          what tools are available. This keeps integrations structured and predictable.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">How it works in practice</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>The AI client initializes with an MCP server.</li>
          <li>It requests a tool list and schemas.</li>
          <li>It calls a tool with typed arguments.</li>
          <li>The server returns structured output back to the client.</li>
        </ol>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">Docs MD + MCP</h2>
        <p>
          Docs MD exposes a markdown sharing tool over MCP, so your assistant can publish files
          directly from your IDE session without context switching.
        </p>
        <Link href="/" className="inline-flex rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500">
          Try the share flow
        </Link>
      </section>
    </ContentPage>
  );
}
