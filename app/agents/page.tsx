import Link from 'next/link';
import ContentPage from '@/components/ContentPage';
import CopyButton from '@/components/CopyButton';
import { CODE, H2, LINK } from '@/components/WalkthroughPage';
import { pageMetadata } from '@/lib/page-metadata';
import { DAILY_SHARE_LIMIT_PER_IP } from '@/lib/quota';

export const metadata = pageMetadata({
  title: 'Docs MD for AI Agents: Publish and Read Markdown Links',
  description:
    'Let Claude Code, Cursor, Codex or any AI agent publish markdown at a link: one curl line, an MCP server, a Claude Code plugin, a CLI and an OpenAPI spec. No key.',
  path: '/agents',
  kicker: 'For AI agents',
});

// Flip once `docs-md-cli` is on npm, so the page never advertises a command that 404s.
const CLI_PUBLISHED = false;

const MCP_URL = 'https://docs-md.com/api/mcp';

function Block({ code, label }: { code: string; label?: string }) {
  return (
    <div className="space-y-2">
      {label ? <p className="text-sm font-medium text-gray-900">{label}</p> : null}
      <div className="relative">
        <pre className="overflow-x-auto rounded-xl bg-gray-950 p-4 pr-24 text-sm text-gray-200">
          <code>{code}</code>
        </pre>
        <div className="absolute right-2 top-2">
          <CopyButton content={code} />
        </div>
      </div>
    </div>
  );
}

const CLIENTS: { name: string; where: string; code: string }[] = [
  { name: 'Claude Code', where: 'Run in your terminal', code: `claude mcp add --transport http docs-md ${MCP_URL}` },
  {
    name: 'Cursor',
    where: '~/.cursor/mcp.json (or .cursor/mcp.json in a project)',
    code: `{\n  "mcpServers": {\n    "docs-md": { "url": "${MCP_URL}" }\n  }\n}`,
  },
  {
    name: 'VS Code (GitHub Copilot)',
    where: '.vscode/mcp.json',
    code: `{\n  "servers": {\n    "docs-md": { "type": "http", "url": "${MCP_URL}" }\n  }\n}`,
  },
  {
    name: 'Codex CLI',
    where: '~/.codex/config.toml',
    code: `[mcp_servers.docs-md]\nurl = "${MCP_URL}"`,
  },
  {
    name: 'Gemini CLI',
    where: '~/.gemini/settings.json',
    code: `{\n  "mcpServers": {\n    "docs-md": { "httpUrl": "${MCP_URL}" }\n  }\n}`,
  },
  {
    name: 'Windsurf',
    where: '~/.codeium/windsurf/mcp_config.json',
    code: `{\n  "mcpServers": {\n    "docs-md": { "serverUrl": "${MCP_URL}" }\n  }\n}`,
  },
  {
    name: 'Zed',
    where: 'settings.json',
    code: `{\n  "context_servers": {\n    "docs-md": { "source": "custom", "url": "${MCP_URL}" }\n  }\n}`,
  },
];

const AGENTS_MD_SNIPPET = `## Sharing documents

When I ask you to share, send or publish a markdown document (a plan, spec, report,
handoff or README), publish it with Docs MD and give me the link:

    curl --data-binary @FILE.md "https://docs-md.com/api/share?expiry=7d&filename=FILE.md&client=agents-md"

The first line of the reply is the URL; keep the edit-token line so it can be updated.
To read a docs-md.com link, fetch https://docs-md.com/<id>.md instead of the HTML page.
Never put secrets, credentials or personal data in a share: it is public to anyone with the link.`;

const CURSOR_RULE = `---
description: Share markdown documents as docs-md.com links
alwaysApply: false
---

When the user asks to share, send or publish a markdown document, call the
docs-md MCP tool share_markdown (or run:
curl --data-binary @FILE.md "https://docs-md.com/api/share?expiry=7d&client=cursor-rule")
and reply with the link. Use read_share (or https://docs-md.com/<id>.md) to read
docs-md.com links. Never include secrets or personal data.`;

export default function AgentsPage() {
  return (
    <ContentPage
      title="Docs MD for AI agents"
      description="Your agent writes a plan, a report or a handoff. Docs MD turns it into a clean link a person, or another agent, can open. No account, no API key, nothing to install unless you want to."
    >
      <section className="space-y-4">
        <h2 className={H2}>Publish in one line</h2>
        <Block code="curl --data-binary @PLAN.md https://docs-md.com/api/share" />
        <p>The reply is plain text, so it is easy for an agent or a shell script to use:</p>
        <Block
          code={`https://docs-md.com/calm-river-Ab12C\nraw: https://docs-md.com/raw/calm-river-Ab12C\nexpires: 2026-11-19\nedit-token: 9x…`}
        />
        <p>
          Add <code className={CODE}>?expiry=1d|7d|30d|never</code>, <code className={CODE}>&amp;filename=PLAN.md</code> and{' '}
          <code className={CODE}>&amp;client=your-agent</code> as needed. Pipe text with{' '}
          <code className={CODE}>--data-binary @-</code>. Send JSON instead if you prefer; it is all in the{' '}
          <a href="/openapi.json" className={LINK}>OpenAPI spec</a>, and{' '}
          <code className={CODE}>GET /api/share</code> prints the usage.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>Read any share as markdown</h2>
        <p>
          Agents should not scrape HTML. Every share is available as plain markdown: add <code className={CODE}>.md</code>{' '}
          to the link, or ask for it with an <code className={CODE}>Accept</code> header.
        </p>
        <Block
          code={`curl https://docs-md.com/calm-river-Ab12C.md\ncurl -H "Accept: text/markdown" https://docs-md.com/calm-river-Ab12C`}
        />
        <p>
          That makes Docs MD a simple handoff channel between agents: one agent publishes a{' '}
          <Link href="/agent-handoff-document" className={LINK}>HANDOFF.md</Link>, the next one reads it from the link.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>MCP server</h2>
        <p>
          <code className={CODE}>{MCP_URL}</code> (streamable HTTP, no auth) has four tools:{' '}
          <code className={CODE}>share_markdown</code>, <code className={CODE}>read_share</code>,{' '}
          <code className={CODE}>update_share</code> and <code className={CODE}>delete_share</code>. It is listed in the
          official MCP Registry as <code className={CODE}>com.docs-md/markdown-share</code>.
        </p>
        <div className="space-y-5">
          {CLIENTS.map((c) => (
            <Block key={c.name} label={`${c.name} · ${c.where}`} code={c.code} />
          ))}
        </div>
        <p>
          Any other MCP client works the same way: add a remote server with that URL. Then ask: &quot;Share this plan as a
          docs-md link that expires in 7 days.&quot;
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>Claude Code plugin and skill</h2>
        <p>The plugin adds the MCP server and a skill that tells Claude when and how to share:</p>
        <Block code="/plugin install docs-md --marketplace invisible-hand/docs-md.com" />
        <p>
          On older Claude Code versions, run <code className={CODE}>/plugin marketplace add invisible-hand/docs-md.com</code>{' '}
          and then <code className={CODE}>/plugin install docs-md@docs-md</code>. To install only the skill, for Claude Code or
          any agent that reads skill files:
        </p>
        <Block code="mkdir -p ~/.claude/skills/share-markdown && curl -o ~/.claude/skills/share-markdown/SKILL.md https://docs-md.com/skill.md" />
      </section>

      {CLI_PUBLISHED ? (
        <section className="space-y-4">
          <h2 className={H2}>Command line</h2>
          <Block code={`npx docs-md-cli share PLAN.md --expiry 7d\nnpx docs-md-cli read https://docs-md.com/calm-river-Ab12C`} />
          <p>
            It saves edit tokens locally, so <code className={CODE}>update</code> and <code className={CODE}>delete</code> work
            without copying tokens around. Install it globally with <code className={CODE}>npm i -g docs-md-cli</code> to get
            the <code className={CODE}>docs-md</code> command.
          </p>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className={H2}>Teach any agent with one paragraph</h2>
        <p>
          Paste this into <code className={CODE}>AGENTS.md</code>, <code className={CODE}>CLAUDE.md</code> or your system
          prompt. It needs no setup at all:
        </p>
        <Block code={AGENTS_MD_SNIPPET} />
        <p>
          For Cursor, save this as <code className={CODE}>.cursor/rules/docs-md.mdc</code>:
        </p>
        <Block code={CURSOR_RULE} />
      </section>

      <section className="space-y-4">
        <h2 className={H2}>Limits and house rules</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            {DAILY_SHARE_LIMIT_PER_IP} new shares per address per day and 120,000 characters per share. Limits come back as
            HTTP 429 with a <code className={CODE}>Retry-After</code> header.
          </li>
          <li>Links expire after 30 days unless you choose 1 day, 7 days or never. Permanent links can be indexed by search engines.</li>
          <li>
            Shares are public to anyone with the link. Keep passwords, keys, card numbers and other people&apos;s personal data
            out of them. The full rules are in the <Link href="/acceptable-use" className={LINK}>acceptable use policy</Link>.
          </li>
          <li>
            Name your tool with <code className={CODE}>client=</code> so we can see what agents use Docs MD and keep it
            working for them.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>Machine-readable</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <a href="/openapi.json" className={LINK}>/openapi.json</a>: the share API as OpenAPI 3.1 (GPT Actions, API clients,
            agent frameworks).
          </li>
          <li>
            <a href="/llms.txt" className={LINK}>/llms.txt</a> and <a href="/llms-full.txt" className={LINK}>/llms-full.txt</a>:
            the site for language models.
          </li>
          <li>
            <a href="/skill.md" className={LINK}>/skill.md</a>: the agent skill as plain markdown.
          </li>
          <li>
            <Link href="/api-docs" className={LINK}>REST API reference</Link> and the{' '}
            <Link href="/github-action" className={LINK}>GitHub Action</Link> for CI.
          </li>
        </ul>
      </section>
    </ContentPage>
  );
}
