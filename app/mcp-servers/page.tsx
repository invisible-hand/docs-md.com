import Link from 'next/link';
import ContentPage from '@/components/ContentPage';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-10-13';

export const metadata = pageMetadata({
  title: 'MCP Server List 2026 — Best Servers by Category, With Install Commands',
  description:
    'A curated 2026 MCP server list: the seven reference servers, official servers from GitHub, Microsoft, Google, Sentry, Stripe, Notion, Linear, Atlassian, AWS, Azure, Cloudflare and more, with what each does and how to install it.',
  path: '/mcp-servers',
  type: 'article',
  extra: { other: { 'last-modified': UPDATED } },
});

interface Server {
  name: string;
  by: string;
  what: string;
  href: string;
  /** How it connects: a local process (stdio) or a hosted endpoint (HTTP). */
  transport: 'stdio' | 'HTTP' | 'both';
}

const CATEGORIES: Array<{ id: string; title: string; blurb: string; servers: Server[] }> = [
  {
    id: 'reference',
    title: 'Reference servers (maintained by the protocol project)',
    blurb:
      'Small, well-built servers that demonstrate the protocol. These are the ones to read if you want to write your own. Everything else that used to live in the reference repo was archived in 2025 (see below).',
    servers: [
      { name: 'Filesystem', by: 'modelcontextprotocol', what: 'Read, write, search and move files inside directories you allow. The first server most people install.', href: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem', transport: 'stdio' },
      { name: 'Fetch', by: 'modelcontextprotocol', what: 'Fetch a web page and convert it to markdown for the model, with length limits so one page does not eat the context window.', href: 'https://github.com/modelcontextprotocol/servers/tree/main/src/fetch', transport: 'stdio' },
      { name: 'Git', by: 'modelcontextprotocol', what: 'Read, search and manipulate local Git repositories: log, diff, blame, commit.', href: 'https://github.com/modelcontextprotocol/servers/tree/main/src/git', transport: 'stdio' },
      { name: 'Memory', by: 'modelcontextprotocol', what: 'A knowledge-graph memory the assistant can write to and recall from across conversations.', href: 'https://github.com/modelcontextprotocol/servers/tree/main/src/memory', transport: 'stdio' },
      { name: 'Sequential Thinking', by: 'modelcontextprotocol', what: 'A structured scratchpad for multi-step problems: the model records and revises thoughts as tool calls.', href: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking', transport: 'stdio' },
      { name: 'Time', by: 'modelcontextprotocol', what: 'Current time and timezone conversion, so the model stops guessing what day it is.', href: 'https://github.com/modelcontextprotocol/servers/tree/main/src/time', transport: 'stdio' },
      { name: 'Everything', by: 'modelcontextprotocol', what: 'A test server exposing every protocol feature (tools, resources, prompts, sampling). For client developers, not daily use.', href: 'https://github.com/modelcontextprotocol/servers/tree/main/src/everything', transport: 'stdio' },
    ],
  },
  {
    id: 'code',
    title: 'Code and development',
    blurb: 'The servers most developers install first. Prefer the vendor-maintained one where it exists.',
    servers: [
      { name: 'GitHub', by: 'GitHub (official)', what: 'Issues, pull requests, code search, file contents, Actions runs and security alerts. Hosted and local variants; the reference GitHub server was archived in favour of this one.', href: 'https://github.com/github/github-mcp-server', transport: 'both' },
      { name: 'Playwright', by: 'Microsoft (official)', what: 'Drive a real browser through the accessibility tree: navigate, click, fill forms, screenshot. The standard for web automation and end-to-end testing from an assistant.', href: 'https://github.com/microsoft/playwright-mcp', transport: 'stdio' },
      { name: 'Chrome DevTools', by: 'Google (official)', what: 'Inspect a live Chrome: performance traces, console, network requests, DOM, and automation. The debugging counterpart to Playwright.', href: 'https://github.com/ChromeDevTools/chrome-devtools-mcp', transport: 'stdio' },
      { name: 'Sentry', by: 'Sentry (official)', what: 'Pull issues, stack traces and release health into the conversation to debug production errors where they happened.', href: 'https://github.com/getsentry/sentry-mcp', transport: 'both' },
      { name: 'Context7', by: 'Upstash', what: 'Version-specific library documentation fetched on demand, so the model stops inventing APIs that changed two releases ago.', href: 'https://github.com/upstash/context7', transport: 'both' },
      { name: 'GitLab', by: 'GitLab', what: 'Merge requests, pipelines, issues and repository files for GitLab-hosted projects.', href: 'https://gitlab.com/gitlab-org/mcp-server', transport: 'both' },
      { name: 'Docker', by: 'Docker (official)', what: 'Run and inspect containers, and the MCP Toolkit that packages other servers as containers with scoped credentials.', href: 'https://github.com/docker/mcp-servers', transport: 'stdio' },
      { name: 'Docs MD markdown share', by: 'this site', what: 'One tool: turn the markdown in your editor into a live shareable URL with an expiry. No API key, no account.', href: '/ai-powered-ide', transport: 'HTTP' },
    ],
  },
  {
    id: 'data',
    title: 'Databases and data',
    blurb: 'Let the assistant answer questions from real data. Give every one of these a read-only role unless you mean otherwise.',
    servers: [
      { name: 'Supabase', by: 'Supabase (official)', what: 'Query Postgres, manage tables, migrations, branches, logs and edge functions for a Supabase project.', href: 'https://github.com/supabase-community/supabase-mcp', transport: 'both' },
      { name: 'Neon', by: 'Neon (official)', what: 'Serverless Postgres: create branches, run SQL, inspect schemas.', href: 'https://github.com/neondatabase/mcp-server-neon', transport: 'both' },
      { name: 'MongoDB', by: 'MongoDB (official)', what: 'Query and manage MongoDB and Atlas clusters, with a read-only mode.', href: 'https://github.com/mongodb-js/mongodb-mcp-server', transport: 'stdio' },
      { name: 'ClickHouse', by: 'ClickHouse (official)', what: 'Run analytical SQL against ClickHouse and list databases and tables.', href: 'https://github.com/ClickHouse/mcp-clickhouse', transport: 'stdio' },
      { name: 'Snowflake', by: 'Snowflake (official)', what: 'Query warehouses and work with Cortex services.', href: 'https://github.com/Snowflake-Labs/mcp', transport: 'stdio' },
      { name: 'Stripe', by: 'Stripe (official)', what: 'Look up customers, subscriptions, invoices and payments; create test-mode objects; search the Stripe docs.', href: 'https://github.com/stripe/agent-toolkit', transport: 'both' },
      { name: 'dbt', by: 'dbt Labs (official)', what: 'Discover models, lineage and metrics from a dbt project and run semantic-layer queries.', href: 'https://github.com/dbt-labs/dbt-mcp', transport: 'stdio' },
    ],
  },
  {
    id: 'work',
    title: 'Productivity and project tools',
    blurb: 'Mostly hosted servers with OAuth: you sign in once, the vendor holds the token.',
    servers: [
      { name: 'Notion', by: 'Notion (official)', what: 'Search, read and write pages and databases in your workspace.', href: 'https://github.com/makenotion/notion-mcp-server', transport: 'both' },
      { name: 'Linear', by: 'Linear (official)', what: 'Issues, projects, cycles and comments; create and update from the conversation.', href: 'https://linear.app/docs/mcp', transport: 'HTTP' },
      { name: 'Atlassian (Jira and Confluence)', by: 'Atlassian (official)', what: 'Search and edit Jira issues and Confluence pages through the Rovo MCP server.', href: 'https://www.atlassian.com/platform/remote-mcp-server', transport: 'HTTP' },
      { name: 'Asana', by: 'Asana (official)', what: 'Tasks, projects and goals from an assistant.', href: 'https://developers.asana.com/docs/using-asanas-model-control-protocol-mcp-server', transport: 'HTTP' },
      { name: 'Figma Dev Mode', by: 'Figma (official)', what: 'Pull design context (components, variables, layout) into a coding assistant to generate matching code.', href: 'https://help.figma.com/hc/en-us/articles/32132100833559', transport: 'both' },
      { name: 'Obsidian', by: 'community', what: 'Search and edit your local vault.', href: 'https://github.com/MarkusPfundstein/mcp-obsidian', transport: 'stdio' },
      { name: 'Zapier', by: 'Zapier (official)', what: 'One hosted server that proxies thousands of app actions, when the app you need has no server of its own.', href: 'https://zapier.com/mcp', transport: 'HTTP' },
    ],
  },
  {
    id: 'web',
    title: 'Web, search and crawling',
    blurb: 'Reach beyond the local machine. Search servers return citations; crawl servers return clean markdown.',
    servers: [
      { name: 'Firecrawl', by: 'Firecrawl (official)', what: 'Scrape, crawl and search websites into clean markdown; handles JavaScript-rendered pages.', href: 'https://github.com/firecrawl/firecrawl-mcp-server', transport: 'both' },
      { name: 'Brave Search', by: 'Brave (official)', what: 'Web, news, image and local search on an independent index, with a free tier.', href: 'https://github.com/brave/brave-search-mcp-server', transport: 'both' },
      { name: 'Exa', by: 'Exa (official)', what: 'Neural web search built for agents: semantic queries, company and people research, full-page contents.', href: 'https://github.com/exa-labs/exa-mcp-server', transport: 'both' },
      { name: 'Tavily', by: 'Tavily (official)', what: 'Search, extract and crawl tuned for RAG pipelines.', href: 'https://github.com/tavily-ai/tavily-mcp', transport: 'both' },
      { name: 'Fetch (reference)', by: 'modelcontextprotocol', what: 'If you only need "read this one URL", the reference Fetch server above is enough.', href: 'https://github.com/modelcontextprotocol/servers/tree/main/src/fetch', transport: 'stdio' },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud and infrastructure',
    blurb: 'Vendor servers for the platforms themselves. Scope the credentials; these can change infrastructure.',
    servers: [
      { name: 'AWS', by: 'AWS Labs (official)', what: 'A family of servers: documentation, CDK, Terraform, cost analysis, Bedrock knowledge bases, Lambda, and per-service tools.', href: 'https://github.com/awslabs/mcp', transport: 'stdio' },
      { name: 'Azure', by: 'Microsoft (official)', what: 'Query and manage Azure resources, storage, Cosmos DB, monitor logs and more from one server.', href: 'https://github.com/Azure/azure-mcp', transport: 'stdio' },
      { name: 'Cloudflare', by: 'Cloudflare (official)', what: 'Workers, KV, R2, D1, DNS, observability and the docs, as separate hosted servers you add individually.', href: 'https://github.com/cloudflare/mcp-server-cloudflare', transport: 'HTTP' },
      { name: 'Terraform', by: 'HashiCorp (official)', what: 'Provider and module documentation from the Terraform Registry, so generated HCL uses real resource arguments.', href: 'https://github.com/hashicorp/terraform-mcp-server', transport: 'stdio' },
      { name: 'Kubernetes', by: 'community', what: 'List, describe and manage cluster resources through kubectl-equivalent tools; several maintained options exist.', href: 'https://github.com/containers/kubernetes-mcp-server', transport: 'stdio' },
    ],
  },
  {
    id: 'ai',
    title: 'Models, AI platforms and memory',
    blurb: 'Servers about the model layer itself.',
    servers: [
      { name: 'Hugging Face', by: 'Hugging Face (official)', what: 'Search models, datasets, papers and Spaces, and run Gradio apps as tools.', href: 'https://github.com/huggingface/hf-mcp-server', transport: 'HTTP' },
      { name: 'Memory (reference)', by: 'modelcontextprotocol', what: 'Persistent knowledge-graph memory; the simplest way to give an assistant recall between sessions.', href: 'https://github.com/modelcontextprotocol/servers/tree/main/src/memory', transport: 'stdio' },
      { name: 'Sequential Thinking (reference)', by: 'modelcontextprotocol', what: 'Structured reasoning as a tool; helps smaller models on multi-step tasks.', href: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking', transport: 'stdio' },
    ],
  },
];

const ARCHIVED = ['GitHub (use GitHub’s own server)', 'GitLab (use GitLab’s)', 'Slack', 'Google Drive', 'Google Maps', 'PostgreSQL (use Supabase, Neon or a vendor server)', 'Puppeteer (use Playwright)', 'Redis', 'Sentry (use Sentry’s)', 'SQLite', 'Brave Search (use Brave’s)', 'EverArt', 'AWS KB Retrieval (use AWS Labs)'];

const FAQ = [
  {
    q: 'How many MCP servers should I install?',
    a: 'Fewer than you think. Every tool a server exposes is described to the model on every request, so twenty servers with ten tools each cost thousands of tokens before you type a word, and the model picks the wrong tool more often. Most people are well served by three to six: a file or repo server, one data source, one search or fetch server, and the services they actually work in.',
  },
  {
    q: 'Which MCP servers are official?',
    a: 'Two kinds. The reference servers (Filesystem, Fetch, Git, Memory, Sequential Thinking, Time, Everything) are maintained by the protocol project. Vendor servers are published by the company behind the service: GitHub, Microsoft, Google, Sentry, Stripe, Notion, Linear, Atlassian, Supabase, AWS, Cloudflare and others. In 2025 the protocol project archived thirteen of its early servers (GitHub, Slack, Google Drive, PostgreSQL, Puppeteer and more); they still run but get no security updates, so use the vendor replacements.',
  },
  {
    q: 'What is the difference between a local and a remote MCP server?',
    a: 'A local server is a process your assistant starts on your machine and talks to over standard input and output; it is right for anything touching local files or a local database. A remote server is a hosted HTTP endpoint you add by URL, usually with OAuth; the vendor runs it and holds the credential. Many vendors now offer both.',
  },
  {
    q: 'How do I add an MCP server to Claude Code, Claude Desktop or Cursor?',
    a: 'Claude Code: claude mcp add <name> -- <command> for a local server, or claude mcp add --transport http <name> <url> for a hosted one. Claude Desktop and Cursor read a JSON config with a mcpServers object whose entries give a command plus args, or a url. The install snippets on this page show both shapes.',
  },
  {
    q: 'Are MCP servers safe?',
    a: 'A server runs with whatever access you give it, and its tool results flow back into the model as text, which means a malicious web page or document can try to instruct the model through a tool result. Install official servers, give them read-only or scoped credentials, keep the number small, and review what an agent did before it touches anything you cannot undo.',
  },
];

function Snippet({ title, code }: { title: string; code: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</p>
      <pre className="overflow-x-auto text-sm leading-relaxed text-gray-900"><code>{code}</code></pre>
    </div>
  );
}

export default function McpServersPage() {
  const all = CATEGORIES.flatMap((c) => c.servers);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: 'Curated MCP server list (2026)',
        numberOfItems: all.length,
        itemListElement: all.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.name, url: s.href.startsWith('/') ? `https://docs-md.com${s.href}` : s.href })),
      },
      {
        '@type': 'Article',
        headline: 'MCP server list 2026',
        dateModified: UPDATED,
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: 'https://docs-md.com/mcp-servers',
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };
  return (
    <ContentPage
      title="MCP server list (2026)"
      description={`Thousands of MCP servers exist; you need about five. ${all.length} servers below, grouped by what they do, official where the vendor ships one, each with how it connects and what it is for.`}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="text-sm text-gray-600">
        New to the concept? Start with{' '}
        <Link href="/what-is-an-mcp-server" className="text-indigo-700 underline">what an MCP server is</Link>{' '}
        and the <Link href="/ai-powered-ide" className="text-indigo-700 underline">editor setup guide</Link>.
        Updated <time dateTime={UPDATED}>October 13, 2026</time>. Jump to:{' '}
        {CATEGORIES.map((c, i) => (
          <span key={c.id}>{i > 0 ? ' · ' : ''}<a href={`#${c.id}`} className="text-indigo-700 underline">{c.title.split(' (')[0]}</a></span>
        ))}
        {' · '}<a href="#install" className="text-indigo-700 underline">install</a>
        {' · '}<a href="#archived" className="text-indigo-700 underline">archived</a>
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">The short list, if you install five</h2>
        <ol className="list-decimal space-y-1 pl-6 text-gray-800">
          <li><strong>Filesystem</strong> (reference) for your working folders.</li>
          <li><strong>GitHub</strong> (official) for issues, PRs and code search.</li>
          <li><strong>Playwright</strong> (Microsoft) when the assistant must use a browser.</li>
          <li><strong>Context7</strong> (Upstash) so library APIs are current.</li>
          <li>One search server: <strong>Brave</strong>, <strong>Exa</strong> or <strong>Tavily</strong>, or <strong>Fetch</strong> if you only ever read known URLs.</li>
        </ol>
        <p className="text-sm text-gray-600">Then add the one service you live in (Linear, Notion, Jira, Sentry, your database) and stop.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">All {all.length} servers at a glance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="py-2 pr-4">Server</th><th className="py-2 pr-4">By</th><th className="py-2 pr-4">Category</th><th className="py-2 pr-4">Runs as</th>
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.flatMap((c) => c.servers.map((s) => (
                <tr key={`${c.id}-${s.name}`} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-medium text-gray-900">{s.href.startsWith('/') ? <Link href={s.href} className="hover:text-indigo-700">{s.name}</Link> : <a href={s.href} rel="noopener" className="hover:text-indigo-700">{s.name}</a>}</td>
                  <td className="py-2 pr-4 text-gray-600">{s.by}</td>
                  <td className="py-2 pr-4 text-gray-600">{c.title.split(' (')[0]}</td>
                  <td className="py-2 pr-4 text-gray-600">{s.transport === 'both' ? 'local or hosted' : s.transport === 'HTTP' ? 'hosted (HTTP)' : 'local (stdio)'}</td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </section>

      {CATEGORIES.map((cat) => (
        <section key={cat.id} id={cat.id} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-950">{cat.title}</h2>
          <p className="text-sm text-gray-600">{cat.blurb}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {cat.servers.map((s) => (
              <div key={s.name} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="text-base font-semibold text-gray-950">
                  {s.href.startsWith('/') ? (
                    <Link href={s.href} className="hover:text-indigo-700">{s.name}</Link>
                  ) : (
                    <a href={s.href} rel="noopener" className="hover:text-indigo-700">{s.name}</a>
                  )}
                </h3>
                <p className="mt-0.5 text-xs uppercase tracking-wide text-gray-500">{s.by} · {s.transport === 'both' ? 'local or hosted' : s.transport === 'HTTP' ? 'hosted' : 'local'}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.what}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section id="install" className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">How do you install an MCP server?</h2>
        <p>
          Two shapes cover every client: a <strong>local</strong> server is a command the client starts
          (the config gives <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[0.9em]">command</code> and{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[0.9em]">args</code>); a <strong>hosted</strong> server is a URL
          (the config gives <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[0.9em]">url</code>, and the client handles sign-in).
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Snippet title="Claude Code · local server" code={`claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ~/projects`} />
          <Snippet title="Claude Code · hosted server" code={`claude mcp add --transport http github https://api.githubcopilot.com/mcp/`} />
          <Snippet
            title="Claude Desktop / Cursor · claude_desktop_config.json or mcp.json"
            code={`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/projects"]
    },
    "github": { "url": "https://api.githubcopilot.com/mcp/" }
  }
}`}
          />
          <Snippet
            title="VS Code · .vscode/mcp.json"
            code={`{
  "servers": {
    "playwright": { "command": "npx", "args": ["@playwright/mcp@latest"] }
  }
}`}
          />
        </div>
        <p className="text-sm text-gray-600">
          Exact package names and URLs are on each server&apos;s page above; vendors rename them. After adding a server, ask the
          assistant to list its tools: if the list is long, you have found the one to remove first.
        </p>
      </section>

      <section id="archived" className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">Archived reference servers (do not install these)</h2>
        <p>
          In 2025 the protocol project moved thirteen of its original servers to an archive repository. They still start and
          still appear in older &ldquo;best MCP servers&rdquo; lists, but they get no fixes or security review. Each has a
          vendor-maintained replacement in the list above.
        </p>
        <p className="text-sm text-gray-700">{ARCHIVED.join(' · ')}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">How were these chosen?</h2>
        <p>
          Preference order: an official server from the service&apos;s vendor beats a community clone; servers that expose a few
          well-designed tools beat kitchen sinks (every tool definition consumes context window); and everything here was
          maintained as of October 2026. The full firehose lives in the{' '}
          <a href="https://github.com/modelcontextprotocol/servers" rel="noopener" className="text-indigo-700 underline">modelcontextprotocol/servers repo</a>{' '}
          (which you can <Link href="/gh/modelcontextprotocol/servers" className="text-indigo-700 underline">read here as a site</Link>) and the{' '}
          <a href="https://registry.modelcontextprotocol.io" rel="noopener" className="text-indigo-700 underline">official registry</a>; this page is the short list.
        </p>
      </section>

      {FAQ.map((f) => (
        <section key={f.q} className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">{f.q}</h2>
          <p>{f.a}</p>
        </section>
      ))}
    </ContentPage>
  );
}
