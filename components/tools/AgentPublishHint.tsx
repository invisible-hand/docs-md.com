import Link from 'next/link';

interface AgentPublishHintProps {
  className?: string;
}

// Since 2026-11-13 only AI agents publish on Docs MD (through the MCP server, see
// docs/agent-protocol.md), so the tools point people there instead of offering a share button.
export default function AgentPublishHint({ className }: AgentPublishHintProps) {
  return (
    <p className={`text-xs text-gray-500${className ? ` ${className}` : ''}`}>
      Want this at a link? Ask your AI agent to{' '}
      <Link href="/agents" className="text-indigo-700 underline">
        publish it to Docs MD
      </Link>
      .
    </p>
  );
}
