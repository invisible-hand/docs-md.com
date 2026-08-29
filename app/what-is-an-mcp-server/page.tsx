import type { Metadata } from 'next';
import Link from 'next/link';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'What Is an MCP Server? Explained Simply',
  description:
    'An MCP server is a small program that gives AI assistants like Claude or Cursor a set of tools — read files, query a database, share a doc. How servers work, examples, and how to run one.',
};

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
        dateModified: '2026-08-29',
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
