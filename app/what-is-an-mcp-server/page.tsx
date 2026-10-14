import Link from 'next/link';
import ContentPage from '@/components/ContentPage';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata({
  title: 'What Is an MCP Server? Explained Simply',
  description:
    'An MCP server is a small program that gives AI assistants like Claude or Cursor tools: read files, query a database, share a doc. How it works and runs.',
  path: '/what-is-an-mcp-server',
  type: 'article',
});

const FAQ = [
  {
    q: 'What is an MCP server in simple terms?',
    a: 'An MCP server is a small program that gives an AI assistant extra abilities. It exposes tools (actions like "query the database" or "share this document") over the Model Context Protocol, so any MCP-capable assistant — Claude, Cursor, VS Code Copilot — can discover and call them.',
  },
  {
    q: 'What is the difference between MCP and an MCP server?',
    a: 'MCP (Model Context Protocol) is the open standard — the common language. An MCP server is one concrete program speaking that language to offer specific tools. The AI application is the MCP client (or host) that connects to servers and lets the model call their tools.',
  },
  {
    q: 'Do MCP servers run locally or in the cloud?',
    a: 'Both. Local servers run on your machine as a subprocess communicating over stdio, best for tools touching local files. Remote servers run as web services over HTTP, best for shared services — you configure a URL instead of a command.',
  },
  {
    q: 'What is the difference between MCP and function calling?',
    a: 'Function calling is how one model asks for one tool inside one application: the developer defines the functions and wires every one by hand. MCP standardises the other side. A server publishes its tools once, with names, descriptions and input schemas, and any client can discover and call them. Under the hood the client still presents those tools to the model as functions; MCP is the plumbing that gets them there without custom code per pairing.',
  },
  {
    q: 'What does an MCP server actually contain?',
    a: 'Three kinds of things. Tools are actions the model may call, each with a name, a description and a JSON schema for its arguments. Resources are read-only data the client can load into context, such as a file or a database row, addressed by URI. Prompts are reusable templates the server offers, like "summarise this ticket". Most servers ship only tools; the other two are optional.',
  },
  {
    q: 'Are MCP servers safe to use?',
    a: 'A server can do whatever its code does, with your credentials — so treat installing one like installing any software: prefer official servers from the vendor of the service, read what tools it exposes, and grant the minimum access. Clients ask for confirmation before tool calls by default.',
  },
];

export default function WhatIsAnMcpServerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'What is an MCP server?',
        description: metadata.description,
        dateModified: '2026-10-13',
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: 'https://docs-md.com/what-is-an-mcp-server',
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
  return (
    <ContentPage
      title="What is an MCP server?"
      description="The two-minute version: an MCP server is a small program that gives an AI assistant a set of tools it can call — with examples you can run today."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="space-y-4">
        <p>
          An <strong>MCP server</strong> is a small program that gives an AI assistant extra
          abilities. It exposes a set of <em>tools</em> — concrete actions like &ldquo;search these
          files&rdquo;, &ldquo;query this database&rdquo;, or &ldquo;publish this document&rdquo; —
          over the <Link href="/what-is-mcp" className="text-indigo-700 underline">Model Context Protocol</Link>,
          an open standard introduced by Anthropic in 2024. Any MCP-capable app (Claude, Cursor,
          VS Code, Windsurf, Zed, and most AI IDEs) can connect to any MCP server, discover its
          tools, and let the model call them mid-conversation.
        </p>
        <p>
          The useful mental model: <strong>MCP is a USB port for AI</strong>. The protocol is the
          port; each server is a device you plug in. Before MCP, every app needed custom
          integrations with every service. With it, a service ships one server and every assistant
          can use it.
        </p>
      </section>
      {FAQ.slice(1).map((f) => (
        <section key={f.q} className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">{f.q}</h2>
          <p>{f.a}</p>
        </section>
      ))}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">What happens when the model calls a tool?</h2>
        <p>The whole exchange is a handful of JSON messages. In order:</p>
        <ol className="list-decimal space-y-1 pl-6">
          <li>The client starts the server (or opens its URL) and both sides exchange an <em>initialize</em> message that says which protocol version and features each supports.</li>
          <li>The client asks <em>tools/list</em>. The server answers with every tool&apos;s name, description and input schema. The client hands that list to the model as its available functions.</li>
          <li>You type a request. The model decides a tool fits and emits a call with arguments that match the schema.</li>
          <li>The client sends <em>tools/call</em> to the server. The server does the work (runs the query, opens the file, hits the API) and returns a result: text, structured data, or an image.</li>
          <li>The client puts the result into the conversation and the model continues, possibly calling another tool.</li>
        </ol>
        <p>
          Two consequences follow. First, step 2 runs on every conversation, so a server with forty tools spends forty
          descriptions of context before you say anything. Second, step 4&apos;s result is just text to the model, so a
          web page or document fetched by a tool can carry instructions the model may follow. Both are why &ldquo;fewer,
          official servers with scoped access&rdquo; is the standing advice.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">Local (stdio) or hosted (HTTP): which should you use?</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="py-2 pr-4">&nbsp;</th><th className="py-2 pr-4">Local server (stdio)</th><th className="py-2 pr-4">Hosted server (HTTP)</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b border-gray-100"><td className="py-2 pr-4 font-medium">How it runs</td><td className="py-2 pr-4">A process the client starts on your machine; messages over stdin/stdout.</td><td className="py-2 pr-4">A web endpoint run by the vendor; messages over HTTP, often with streaming.</td></tr>
              <tr className="border-b border-gray-100"><td className="py-2 pr-4 font-medium">Sign-in</td><td className="py-2 pr-4">Environment variables or config holding your API key.</td><td className="py-2 pr-4">OAuth in the browser; the vendor holds the token.</td></tr>
              <tr className="border-b border-gray-100"><td className="py-2 pr-4 font-medium">Best for</td><td className="py-2 pr-4">Files, local databases, anything on this computer.</td><td className="py-2 pr-4">SaaS products, shared team tools, phones and web clients.</td></tr>
              <tr className="border-b border-gray-100"><td className="py-2 pr-4 font-medium">Risk shape</td><td className="py-2 pr-4">Runs with your user&apos;s permissions; read the code or trust the publisher.</td><td className="py-2 pr-4">Only what the OAuth scope allows; the vendor sees the calls.</td></tr>
              <tr><td className="py-2 pr-4 font-medium">Config key</td><td className="py-2 pr-4"><code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[0.9em]">command</code> + <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[0.9em]">args</code></td><td className="py-2 pr-4"><code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[0.9em]">url</code></td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600">Many vendors now ship both; the GitHub server is the usual example. When in doubt, hosted for a service, local for your files.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">How is an MCP server different from a plugin, an API, or RAG?</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li><strong>Than an API:</strong> it <em>wraps</em> one. The server translates a service&apos;s API into tools a model can read and call; the model never sees the raw endpoints.</li>
          <li><strong>Than a plugin:</strong> plugins belong to one product (ChatGPT plugins, a VS Code extension). An MCP server is product-neutral; the same server works in Claude, Cursor, VS Code and Zed.</li>
          <li><strong>Than RAG:</strong> RAG retrieves text for the model to read. An MCP server can retrieve (a <em>resource</em>) but also <em>act</em> (a <em>tool</em>): create the ticket, run the query, publish the doc. A search server is RAG delivered over MCP.</li>
          <li><strong>Than an agent:</strong> the server has no judgment; it only answers calls. The agent is the model plus the client loop that decides which tools to call and when to stop.</li>
        </ul>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">What are the words people use?</h2>
        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[max-content_1fr] text-sm">
          <dt className="font-medium text-gray-900">Host / client</dt><dd className="text-gray-700">The application the model runs in (Claude Desktop, Cursor); it maintains a client connection per server.</dd>
          <dt className="font-medium text-gray-900">Server</dt><dd className="text-gray-700">The program exposing tools, resources and prompts.</dd>
          <dt className="font-medium text-gray-900">Tool</dt><dd className="text-gray-700">An action with a name, description and JSON input schema.</dd>
          <dt className="font-medium text-gray-900">Resource</dt><dd className="text-gray-700">Read-only data addressed by a URI, loaded into context on request.</dd>
          <dt className="font-medium text-gray-900">Prompt</dt><dd className="text-gray-700">A reusable message template the server offers the user.</dd>
          <dt className="font-medium text-gray-900">Transport</dt><dd className="text-gray-700">How messages travel: stdio for local processes, streamable HTTP for hosted servers.</dd>
          <dt className="font-medium text-gray-900">Sampling</dt><dd className="text-gray-700">A server asking the client to run a model completion on its behalf; rarely enabled.</dd>
          <dt className="font-medium text-gray-900">Registry</dt><dd className="text-gray-700">The official index of published servers; it records provenance, not safety.</dd>
        </dl>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">What are some examples of MCP servers?</h2>
        <p>
          The ecosystem spans official vendor servers (GitHub, Stripe, Sentry, Linear, Playwright
          for browser automation), community servers for nearly every tool, and small
          special-purpose ones — like this site&apos;s own markdown-sharing server, which gives your
          assistant a <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">share_markdown</code>{' '}
          tool that turns a doc in your editor into a live URL. Browse the{' '}
          <Link href="/mcp-servers" className="text-indigo-700 underline">
            curated MCP server list
          </Link>{' '}
          for the ones worth installing first.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">How do you try an MCP server in one minute?</h2>
        <p>
          Add a server to your editor&apos;s MCP config and ask the assistant to use it. The{' '}
          <Link href="/ai-powered-ide" className="text-indigo-700 underline">
            editor-by-editor setup guide
          </Link>{' '}
          has copy-paste config for Cursor, Claude Code, VS Code, Windsurf, and Zed using the Docs
          MD server — no API key required — so you can watch a tool call happen end to end.
        </p>
      </section>
    </ContentPage>
  );
}
