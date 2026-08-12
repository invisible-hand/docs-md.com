import type { Metadata } from 'next';
import Link from 'next/link';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'AI-Powered IDE Workflows with Markdown and MCP',
  description:
    'Set up markdown sharing from Cursor, Claude Code, Windsurf, VS Code, and Zed via MCP — with real configs, workflows, and prompt examples.',
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

export default function AiPoweredIdePage() {
  return (
    <ContentPage
      title="AI-powered IDE workflows with markdown"
      description="How to publish markdown from Cursor, Claude Code, Windsurf, VS Code, and Zed with one prompt — setup configs, real workflows, and the practices that make shared docs actually get read."
    >
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">Why markdown is the output format of AI coding</h2>
        <p>
          Every AI coding assistant thinks in markdown. Implementation plans, architecture notes,
          code reviews, migration checklists, incident timelines — when you ask Cursor or Claude
          Code to write something down, what comes out is a <InlineCode>.md</InlineCode> file. The
          format is not an accident: markdown survives copy-paste, renders anywhere, diffs cleanly
          in git, and both humans and models parse it without ambiguity.
        </p>
        <p>
          The gap is distribution. The artifact your assistant just produced lives in your working
          tree or your chat scroll-back. The person who needs it — a reviewer, a PM, an on-call
          engineer — is in Slack or Linear or a PR thread. The usual options all lose something:
          pasting into Slack mangles tables and code fences, committing to the repo is overkill for
          a document with a two-week lifespan, and Notion means leaving the terminal and
          reformatting by hand.
        </p>
        <p>
          A markdown-native share link fixes this: the document renders with syntax highlighting,
          tables, and mermaid diagrams at a URL anyone can open, and your assistant can publish it
          without you leaving the editor. That is what the Docs MD{' '}
          <Link href="/what-is-mcp" className="text-indigo-700 underline">
            MCP server
          </Link>{' '}
          does.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">What your assistant can do once connected</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <InlineCode>share_markdown</InlineCode> — publish any markdown as a public URL. Choose
            expiry: 1 day, 7 days, 30 days, or never. Returns the share link, a raw-markdown link,
            and a private edit token.
          </li>
          <li>
            <InlineCode>update_share</InlineCode> — replace the content at the same URL using the
            edit token. The link you already posted in Slack keeps working and shows the new
            version.
          </li>
          <li>
            <InlineCode>delete_share</InlineCode> — remove a share early when the document is no
            longer needed.
          </li>
        </ul>
        <p>
          No account, no API key. The edit token returned at creation is the only credential, and it
          scopes to that single document.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">Setup by editor</h2>

        <h3 className="text-lg font-semibold text-gray-900">Cursor</h3>
        <p>
          Add the server to <InlineCode>~/.cursor/mcp.json</InlineCode> (or per-project in{' '}
          <InlineCode>.cursor/mcp.json</InlineCode>), then restart Cursor:
        </p>
        <CodeBlock>{`{
  "mcpServers": {
    "md-share": {
      "url": "https://docs-md.com/api/mcp"
    }
  }
}`}</CodeBlock>

        <h3 className="text-lg font-semibold text-gray-900">Claude Code</h3>
        <p>One command in your terminal:</p>
        <CodeBlock>{`claude mcp add --transport http md-share https://docs-md.com/api/mcp`}</CodeBlock>

        <h3 className="text-lg font-semibold text-gray-900">VS Code (GitHub Copilot)</h3>
        <p>
          Create <InlineCode>.vscode/mcp.json</InlineCode> in your workspace:
        </p>
        <CodeBlock>{`{
  "servers": {
    "md-share": {
      "type": "http",
      "url": "https://docs-md.com/api/mcp"
    }
  }
}`}</CodeBlock>

        <h3 className="text-lg font-semibold text-gray-900">Windsurf</h3>
        <p>
          Add to <InlineCode>~/.codeium/windsurf/mcp_config.json</InlineCode>:
        </p>
        <CodeBlock>{`{
  "mcpServers": {
    "md-share": {
      "serverUrl": "https://docs-md.com/api/mcp"
    }
  }
}`}</CodeBlock>

        <h3 className="text-lg font-semibold text-gray-900">Zed</h3>
        <p>
          Add a context server in <InlineCode>settings.json</InlineCode>:
        </p>
        <CodeBlock>{`{
  "context_servers": {
    "md-share": {
      "source": "custom",
      "url": "https://docs-md.com/api/mcp"
    }
  }
}`}</CodeBlock>
        <p className="text-sm text-gray-600">
          Any MCP client that speaks streamable HTTP works the same way — the endpoint is always{' '}
          <InlineCode>https://docs-md.com/api/mcp</InlineCode>.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">Four workflows that earn their keep</h2>

        <h3 className="text-lg font-semibold text-gray-900">1. Design review without the repo dance</h3>
        <p>
          Your assistant drafts an implementation plan before touching code. Instead of committing a{' '}
          <InlineCode>PLAN.md</InlineCode> to the repo or pasting 200 lines into Slack:
        </p>
        <CodeBlock>{`"Share this plan as markdown with 7-day expiry and give me the link."`}</CodeBlock>
        <p>
          Reviewers get a rendered document with a table of contents and highlighted code. When the
          review lands changes, ask the assistant to <InlineCode>update_share</InlineCode> — the
          same link now shows v2, so the Slack thread never points at a stale doc.
        </p>

        <h3 className="text-lg font-semibold text-gray-900">2. Incident postmortems on a deadline</h3>
        <p>
          During an incident, the assistant assembles a timeline from logs and git history. Share it
          with a 30-day expiry for the review meeting; once the formal postmortem lands in your
          wiki, the working document quietly deletes itself. Ephemeral by default is a feature here
          — no stale incident docs floating around with half-correct conclusions.
        </p>

        <h3 className="text-lg font-semibold text-gray-900">3. Handoff between agents and humans</h3>
        <p>
          Long-running agents produce state: what was tried, what failed, what is left. A share link
          is the cheapest durable handoff — the agent publishes its status document and posts one
          URL, instead of dumping its context into a channel. The next agent (or human) reads the
          raw endpoint (<InlineCode>/raw/id</InlineCode>) to pick up exactly where things stood.
        </p>

        <h3 className="text-lg font-semibold text-gray-900">4. Permanent docs linked from READMEs</h3>
        <p>
          Some documents deserve to live forever: setup guides, API references for internal tools,
          onboarding checklists. Share with <InlineCode>expiry: never</InlineCode> and link them
          from your README. Permanent shares keep a stable URL and render mermaid diagrams — useful
          for architecture docs that outgrow ASCII art.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">Practices that make shared docs get read</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>One decision per document.</strong> A share link with a focused question gets
            read in two minutes; a kitchen-sink document gets skimmed and forgotten.
          </li>
          <li>
            <strong>Front-load the ask.</strong> Put the decision needed and the deadline in the
            first paragraph — the rest is supporting evidence.
          </li>
          <li>
            <strong>Match expiry to the document&apos;s half-life.</strong> Review artifacts: 7
            days. Working documents: 30 days. Reference material: never. Defaulting everything to
            permanent recreates the stale-wiki problem you were escaping.
          </li>
          <li>
            <strong>Keep the edit token.</strong> Your assistant receives it when publishing — ask
            it to note the token in the conversation or a local file, so later sessions can update
            the same link instead of minting a new one.
          </li>
          <li>
            <strong>Use mermaid for anything with arrows.</strong> Sequence diagrams and flowcharts
            in <InlineCode>mermaid</InlineCode> fences render as real diagrams in the shared view.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900">Do viewers need an account?</h3>
            <p>No. Share links are public URLs — anyone with the link can read the rendered document or the raw markdown.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Can I use it from scripts and CI too?</h3>
            <p>
              Yes — the same operations are available as a{' '}
              <Link href="/api-docs" className="text-indigo-700 underline">
                REST API
              </Link>
              . The MCP server and the API share the same backend and limits.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">What are the size limits?</h3>
            <p>120,000 characters of markdown per share, and 20 share operations per minute per IP (30 for MCP calls).</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">What happens when a link expires?</h3>
            <p>
              The document and its stored file are deleted automatically and the URL returns 404.
              Expiring shares are also marked <InlineCode>noindex</InlineCode> so they never end up
              in search results.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl bg-indigo-50 p-6">
        <h2 className="text-xl font-semibold text-gray-950">Try it in 30 seconds</h2>
        <p>
          Add the server to your editor with the config above, then ask your assistant:{' '}
          <em>&quot;Write a short summary of this file and share it as markdown.&quot;</em> You get
          back a link you can post anywhere. Or start from the{' '}
          <Link href="/" className="text-indigo-700 underline">
            web editor
          </Link>{' '}
          — no setup at all.
        </p>
      </section>
    </ContentPage>
  );
}
