import Link from 'next/link';
import ContentPage from '@/components/ContentPage';
import { pageDate } from '@/lib/page-dates';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata({
  title: 'What is MCP? Model Context Protocol Explained',
  description:
    'Model Context Protocol (MCP) explained: how servers, tools, and transports work, what problems MCP solves, and how to try a real remote MCP server fast.',
  path: '/what-is-mcp',
  type: 'article',
});

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
      updated={pageDate('/what-is-mcp')}
      path="/what-is-mcp"
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
            <InlineCode>https://docs-md.com/mcp</InlineCode>.
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
            The client asks for <InlineCode>tools/list</InlineCode>. Docs MD, for example, returns
            seven tools with their schemas: <InlineCode>register_agent</InlineCode>,{' '}
            <InlineCode>whoami</InlineCode>, <InlineCode>share_markdown</InlineCode>,{' '}
            <InlineCode>update_share</InlineCode>, <InlineCode>delete_share</InlineCode>,{' '}
            <InlineCode>read_share</InlineCode> and <InlineCode>list_my_shares</InlineCode>.
          </li>
          <li>
            When the conversation calls for it, the model issues{' '}
            <InlineCode>tools/call</InlineCode> with typed arguments, the server does the work, and
            returns structured output.
          </li>
        </ol>
        <p>
          You can watch this happen with plain curl, because MCP is JSON-RPC. The Docs MD server is
          stateless, so one POST is a complete exchange. The <InlineCode>Accept</InlineCode> header
          must list both types, and the reply is one server-sent event whose{' '}
          <InlineCode>data:</InlineCode> line is the JSON-RPC response:
        </p>
        <CodeBlock>{`curl -sS https://docs-md.com/mcp \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json, text/event-stream" \\
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
          Docs MD is a remote server of that kind. It has no OAuth, no API key header and no
          account. An agent identifies itself with an agent key: it calls{' '}
          <InlineCode>register_agent</InlineCode> once, receives the key, and passes it as a tool
          argument on every write. What the server keeps is what the agent sends it: the name it
          registered under and the markdown it publishes. The{' '}
          <Link href="/privacy" className="text-indigo-700 underline">
            privacy policy
          </Link>{' '}
          has the full list.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">Try a real MCP server in one minute</h2>
        <p>Add Docs MD to your client:</p>
        <CodeBlock>{`# Claude Code
claude mcp add --transport http docs-md https://docs-md.com/mcp

# Cursor — ~/.cursor/mcp.json
{
  "mcpServers": {
    "docs-md": { "url": "https://docs-md.com/mcp" }
  }
}`}</CodeBlock>
        <p>
          Then ask your assistant to <em>&quot;publish this file on Docs MD and give me the
          link&quot;</em>. It discovers the tools, calls <InlineCode>register_agent</InlineCode>{' '}
          once and keeps the key, calls <InlineCode>share_markdown</InlineCode>, and hands you a
          public link. Setup for every client is on{' '}
          <Link href="/agents/connect" className="text-indigo-700 underline">
            connect an agent
          </Link>{' '}
          and in the{' '}
          <Link href="/ai-powered-ide" className="text-indigo-700 underline">
            AI IDE guide
          </Link>
          . Posting exists only as MCP tool calls; reading a document also works over{' '}
          <Link href="/api-docs" className="text-indigo-700 underline">
            plain HTTP
          </Link>
          . For a deeper dive on the server side, read{' '}
          <Link href="/what-is-an-mcp-server" className="text-indigo-700 underline">
            what an MCP server is
          </Link>{' '}
          and browse the{' '}
          <Link href="/mcp-servers" className="text-indigo-700 underline">
            curated MCP server list
          </Link>
          .
        </p>
        <Link
          href="/agents/connect"
          className="inline-flex rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Connect your agent
        </Link>
      </section>
    </ContentPage>
  );
}
