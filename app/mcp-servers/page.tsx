import type { Metadata } from 'next';
import Link from 'next/link';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'MCP Server List — Best Servers Worth Installing (2026)',
  description:
    'A curated MCP server list: official servers for GitHub, Playwright, Sentry, Stripe, Figma, and databases, plus utilities for search, memory, and markdown sharing — with what each one is for.',
};

interface Server {
  name: string;
  by: string;
  what: string;
  href: string;
}

const CATEGORIES: Array<{ title: string; blurb: string; servers: Server[] }> = [
  {
    title: 'Code & development',
    blurb: 'The servers most developers install first.',
    servers: [
      { name: 'GitHub', by: 'GitHub (official)', what: 'Issues, PRs, code search, and repo management from your assistant.', href: 'https://github.com/github/github-mcp-server' },
      { name: 'Playwright', by: 'Microsoft (official)', what: 'Drive a real browser: navigate, click, fill forms, screenshot — the standard for web automation and testing.', href: 'https://github.com/microsoft/playwright-mcp' },
      { name: 'Sentry', by: 'Sentry (official)', what: 'Pull error reports and stack traces into the conversation to debug production issues.', href: 'https://github.com/getsentry/sentry-mcp' },
      { name: 'GitLab', by: 'community', what: 'Merge requests, pipelines, and issues for GitLab-hosted projects.', href: 'https://gitlab.com/gitlab-org/mcp-server' },
    ],
  },
  {
    title: 'Documentation & knowledge',
    blurb: 'Get accurate, current context into the model.',
    servers: [
      { name: 'Context7', by: 'Upstash', what: 'Fetches up-to-date, version-specific library documentation so the model stops hallucinating APIs.', href: 'https://github.com/upstash/context7' },
      { name: 'Docs MD markdown share', by: 'this site', what: 'One tool: turn the markdown in your editor into a live shareable URL with expiry. No API key.', href: '/ai-powered-ide' },
      { name: 'Notion', by: 'Notion (official)', what: 'Read and write pages and databases in your workspace.', href: 'https://github.com/makenotion/notion-mcp-server' },
      { name: 'Obsidian', by: 'community', what: 'Search and edit your local Obsidian vault.', href: 'https://github.com/MarkusPfundstein/mcp-obsidian' },
    ],
  },
  {
    title: 'Data & databases',
    blurb: 'Let the assistant answer questions from real data.',
    servers: [
      { name: 'Postgres', by: 'community/vendors', what: 'Run read-only SQL against a Postgres database; official options exist from Neon and Supabase.', href: 'https://github.com/modelcontextprotocol/servers' },
      { name: 'Snowflake', by: 'Snowflake (official)', what: 'Query warehouses and manage Cortex services.', href: 'https://github.com/Snowflake-Labs/mcp' },
      { name: 'Stripe', by: 'Stripe (official)', what: 'Look up customers, subscriptions, and payments; create test objects.', href: 'https://github.com/stripe/agent-toolkit' },
    ],
  },
  {
    title: 'Web, search & automation',
    blurb: 'Reach beyond the local machine.',
    servers: [
      { name: 'Firecrawl', by: 'Firecrawl (official)', what: 'Scrape and crawl websites into clean markdown for the model.', href: 'https://github.com/firecrawl/firecrawl-mcp-server' },
      { name: 'Brave Search', by: 'Brave (official)', what: 'Web search with an generous free tier.', href: 'https://github.com/brave/brave-search-mcp-server' },
      { name: 'Zapier', by: 'Zapier (official)', what: 'One server that proxies thousands of app actions through Zapier.', href: 'https://zapier.com/mcp' },
      { name: 'Sequential Thinking', by: 'Anthropic reference', what: 'A scratchpad tool that helps models work through multi-step problems.', href: 'https://github.com/modelcontextprotocol/servers' },
    ],
  },
];

export default function McpServersPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Curated MCP server list',
    numberOfItems: CATEGORIES.reduce((n, c) => n + c.servers.length, 0),
    itemListElement: CATEGORIES.flatMap((c) => c.servers).map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.name,
    })),
  };
  return (
    <ContentPage
      title="MCP server list"
      description="Thousands of MCP servers exist; you need about a dozen. This list is curated for usefulness — official servers where they exist, with what each one actually does."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="text-sm text-gray-600">
        New to the concept? Start with{' '}
        <Link href="/what-is-an-mcp-server" className="text-indigo-700 underline">
          what an MCP server is
        </Link>{' '}
        and the{' '}
        <Link href="/ai-powered-ide" className="text-indigo-700 underline">
          editor setup guide
        </Link>
        . Updated <time dateTime="2026-08-29">August 29, 2026</time>.
      </p>
      {CATEGORIES.map((cat) => (
        <section key={cat.title} className="space-y-4">
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
                <p className="mt-0.5 text-xs uppercase tracking-wide text-gray-500">{s.by}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.what}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">How were these chosen?</h2>
        <p>
          Preference order: an official server from the service&apos;s vendor beats a community
          clone; servers that expose a few well-designed tools beat kitchen sinks (every tool
          definition consumes context window); and anything here is actively maintained as of
          August 2026. The full firehose lives in the{' '}
          <a href="https://github.com/modelcontextprotocol/servers" rel="noopener" className="text-indigo-700 underline">
            official modelcontextprotocol/servers repo
          </a>{' '}
          and the community registry — this page is the short list.
        </p>
      </section>
    </ContentPage>
  );
}
