import type { Metadata } from 'next';
import Link from 'next/link';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'What is MCP? Model Context Protocol Explained',
  description:
    'Model Context Protocol (MCP) explained: how servers, tools, and transports work, what problems MCP solves, and how to try a real remote MCP server in one minute.',
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-200">
      <code>{children}</code>
    </pre>
  );
}

function InlineCode({ children }: { children: string }) {
  return <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">{children}</code>;
}

export default function WhatIsMcpPage() {
  return (
    <ContentPage
      title="What is MCP (Model Context Protocol)?"
      description="MCP is an open protocol that lets AI assistants discover and call external tools in a structured, predictable way — the USB standard for connecting models to the outside world."
    >
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">The problem MCP solves</h2>
        <p>
          Before MCP, every AI product integrated every external service its own way. Connecting
          your assistant to GitHub, your database, or your issue tracker meant a custom plugin for
          each combination of client and service — an N×M explosion of one-off integrations, each
          with its own auth story and each breaking independently.
        </p>
        <p>
          The Model Context Protocol, introduced by Anthropic in late 2024 and since adopted across
          the industry — Cursor, VS Code/Copilot, Windsurf, Zed, OpenAI, Google — replaces that
          with one standard. A service implements one MCP <strong>server</strong>; every MCP-capable{' '}
          <strong>client</strong> can use it. Write it once, works everywhere.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">The moving parts</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Server</strong> — a program that exposes capabilities. It can run locally
            (spawned by your editor over stdio) or remotely (a URL your client talks to over
            HTTP). Docs MD is a remote server at{' '}
            <InlineCode>https://docs-md.com/api/mcp</InlineCode>.
          </li>
          <li>
            <strong>Tools</strong> — typed functions the server offers, each with a JSON schema
            describing its inputs. The model reads the schemas and decides when to call which tool.
          </li>
          <li>
            <strong>Client</strong> — the AI application (Cursor, Claude Code, Claude.ai, …) that
            connects to servers, shows the model what tools exist, executes calls, and returns
            results into the conversation.
          </li>
          <li>
            <strong>Transports</strong> — stdio for local servers; streamable HTTP for remote ones.
            Remote servers need zero installation: you add a URL to your client&apos;s config and
            you&apos;re done.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">What a session looks like</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            The client sends <InlineCode>initialize</InlineCode> and the server replies with its
            capabilities and version.
          </li>
          <li>
            The client asks for <InlineCode>tools/list</InlineCode> — Docs MD, for example, returns{' '}
            <InlineCode>share_markdown</InlineCode>, <InlineCode>update_share</InlineCode>, and{' '}
            <InlineCode>delete_share</InlineCode> with their schemas.
          </li>
          <li>
            When the conversation calls for it, the model issues{' '}
            <InlineCode>tools/call</InlineCode> with typed arguments, the server does the work, and
            returns structured output.
          </li>
        </ol>
        <p>You can watch this happen with plain curl — MCP is just JSON-RPC:</p>
        <CodeBlock>{`curl -X POST https://docs-md.com/api/mcp \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`}</CodeBlock>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">Local vs. remote servers</h2>
        <p>
          Local (stdio) servers are right when the tool needs your machine: reading files, running
          builds, talking to a local database. Remote servers are right when the capability lives on
          the network anyway — publishing, search, SaaS APIs. Remote servers have two practical
          advantages: nothing to install or update, and they work identically from every device and
          client. The trade-off is trust: a remote server sees whatever arguments the model sends
          it, so prefer servers that need minimal data and no broad credentials.
        </p>
        <p>
          Docs MD leans into that: no account, no API key, and the only thing it ever receives is
          the markdown you explicitly asked to publish. Each share returns a single-document edit
          token instead of any account-level credential.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">Try a real MCP server in one minute</h2>
        <p>Add Docs MD to your client:</p>
        <CodeBlock>{`# Claude Code
claude mcp add --transport http md-share https://docs-md.com/api/mcp

# Cursor — ~/.cursor/mcp.json
{
  "mcpServers": {
    "md-share": { "url": "https://docs-md.com/api/mcp" }
  }
}`}</CodeBlock>
        <p>
          Then ask your assistant to <em>&quot;share this file as markdown&quot;</em> — it will
          discover the tool, call it, and hand you a public link. Full per-editor setup lives in the{' '}
          <Link href="/ai-powered-ide" className="text-indigo-700 underline">
            AI IDE guide
          </Link>
          ; the same operations are also a plain{' '}
          <Link href="/api-docs" className="text-indigo-700 underline">
            REST API
          </Link>
          .
        </p>
        <Link
          href="/"
          className="inline-flex rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Try the share flow
        </Link>
      </section>
    </ContentPage>
  );
}
