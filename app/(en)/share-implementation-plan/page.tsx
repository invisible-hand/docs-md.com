import Link from 'next/link';
import ExamplePanel from '@/components/ExamplePanel';
import WalkthroughPage, { CODE, CodeBlock, H2, LINK } from '@/components/WalkthroughPage';
import { getExample } from '@/lib/examples';
import { pageMetadata } from '@/lib/page-metadata';
import { pageDate } from '@/lib/page-dates';

const UPDATED = pageDate('/share-implementation-plan');

export const metadata = pageMetadata({
  title: 'Share a Cursor or Claude Code Implementation Plan',
  description:
    'Turn an AI-generated implementation plan into a rendered link a teammate can review: your agent publishes it from Cursor or Claude Code through MCP.',
  path: '/share-implementation-plan',
  type: 'article',
  kicker: 'Walkthrough',
});

const SHARE_ARGS = `{
  "agent_key": "dmk_EXAMPLE_KEY_DO_NOT_USE_00000000000000000000",
  "content": "# Webhook retries: implementation plan\\n\\n## Decision needed\\n...",
  "filename": "implementation-plan.md",
  "expiry": "7d",
  "kind": "plan",
  "audience": "the reviewing teammate"
}`;

const SHARE_RESULT = `{
  "id": "quiet-harbor-7k2pd",
  "url": "https://docs-md.com/quiet-harbor-7k2pd",
  "raw_url": "https://docs-md.com/raw/quiet-harbor-7k2pd",
  "expires_at": "2026-11-20T09:31:00.000Z",
  "expiry": "7d",
  "trust": "new",
  "shape": "document",
  "links_clickable": false,
  "indexable": false,
  "duplicate": false,
  "notices": [
    "Outbound links are shown as plain text and the page is not indexed by search engines (trust level \\"new\\")."
  ]
}`;

const UPDATE_ARGS = `{
  "id": "quiet-harbor-7k2pd",
  "agent_key": "dmk_EXAMPLE_KEY_DO_NOT_USE_00000000000000000000",
  "content": "# Webhook retries: implementation plan (v2)\\n\\n## Decision needed\\n..."
}`;

const FAQ = [
  {
    q: 'How do I share a Cursor implementation plan with a teammate?',
    a: 'Add the Docs MD MCP server to Cursor, then ask the agent to "publish implementation-plan.md on Docs MD with a 7-day expiry and give me the link". The first time, it calls register_agent and keeps the key it receives. Then it calls share_markdown and returns a public URL that renders the plan with its diagram and code blocks. No account is needed on either side.',
  },
  {
    q: 'Can I update the plan after reviewers comment without changing the link?',
    a: 'Yes. Ask the agent that published the plan to update it. It calls update_share with the document id, its agent key and the new content, and the same URL shows the new version. Nothing you posted in Slack or a pull request goes stale. Only the agent that owns a document can change it.',
  },
  {
    q: 'Is the shared plan private?',
    a: 'No. A published plan is a public URL: anyone who has the link can read it. The agent key only controls who can change or delete it. Do not put credentials or unreleased customer data in a plan you publish; keep the discussion itself in your existing PR, issue, or chat thread.',
  },
  {
    q: 'What happens when the 7 days are up?',
    a: 'The URL answers 404 and the document is deleted by a daily job. Expiration removes access at the original address; it cannot recall copies that reviewers downloaded or printed. A plan posted with a newly registered key is not indexed by search engines at any point.',
  },
  {
    q: 'Does opening the example publish anything?',
    a: 'No. Viewing, downloading or previewing the example only reads its text. A document is created only when an agent calls share_markdown with its agent key. There is no paste form and no REST endpoint for posting.',
  },
];

export default function ShareImplementationPlanPage() {
  const example = getExample('implementation-plan');
  return (
    <WalkthroughPage
      slug="share-implementation-plan"
      title="Share an implementation plan from Cursor or Claude Code as a link"
      description="Your assistant just wrote a long plan: alternatives, a sequence diagram, code snippets, a decision for the reviewer. Here is how the assistant hands it to a teammate as a rendered page, updates it after review, and lets it expire on its own."
      updated={UPDATED}
      faq={FAQ}
    >
      <section className="space-y-4">
        <h2 className={H2}>What is the problem with sharing a plan from an AI coding assistant?</h2>
        <p>
          The plan lives in your working tree or in the chat scroll-back. The reviewer is in Slack,
          Linear, or a pull request thread. Pasting 200 lines of markdown into chat breaks the tables
          and the mermaid diagram; committing a <code className={CODE}>PLAN.md</code> for a document
          that is obsolete the moment the code lands is noise in the repo. A published link is the
          middle path: the document renders at a URL with a table of contents, the diagram becomes a
          real diagram, and the link can expire when the review is over.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>What does a good implementation plan look like?</h2>
        <p>
          This is a complete, fictional plan for adding webhook retries to a small payments API. It
          has the parts a reviewer needs: the decision being asked for, the problem, the proposed
          behavior, the alternatives that were rejected, a sequence diagram, the steps, verification,
          risks, and rollout. Download it, or use it as a template for your own.
        </p>
        <ExamplePanel example={example} />
      </section>

      <section className="space-y-4">
        <h2 className={H2}>How do I publish the plan from Cursor or Claude Code?</h2>
        <p>
          Connect the Docs MD MCP server once (per-client configs are in the{' '}
          <Link href="/ai-powered-ide" className={LINK}>
            AI IDE guide
          </Link>{' '}
          and on{' '}
          <Link href="/agents/connect" className={LINK}>
            connect an agent
          </Link>
          ). For Claude Code that is one command:
        </p>
        <CodeBlock>{`claude mcp add --transport http docs-md https://docs-md.com/mcp`}</CodeBlock>
        <p>Then, with the plan open, ask:</p>
        <CodeBlock>{`Publish implementation-plan.md on Docs MD with a 7-day expiry and give me the
reading link.`}</CodeBlock>
        <p>
          The first time, the assistant calls <code className={CODE}>register_agent</code> and stores
          the <code className={CODE}>agent_key</code> it receives; the key is shown once. Then it calls{' '}
          <code className={CODE}>share_markdown</code> with these arguments (the key is a
          placeholder):
        </p>
        <CodeBlock>{SHARE_ARGS}</CodeBlock>
        <p>The result looks like this (the id is made up):</p>
        <CodeBlock>{SHARE_RESULT}</CodeBlock>
        <p>
          Post <code className={CODE}>url</code> in the review thread. The assistant needs its key
          again to change the document later, so tell it where to keep the key: a memory file,
          project notes or an environment variable, and never the plan itself. A key that is lost
          cannot be recovered.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>How do I update the plan after review without changing the link?</h2>
        <p>
          Edit the source, then ask: <em>&quot;Update the document quiet-harbor-7k2pd with the new
          implementation-plan.md.&quot;</em> The assistant calls{' '}
          <code className={CODE}>update_share</code> with its key:
        </p>
        <CodeBlock>{UPDATE_ARGS}</CodeBlock>
        <p>
          The URL you already posted now renders version two. An update replaces the content and,
          optionally, the filename; it never changes when the document expires.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>Where does the review discussion go?</h2>
        <p>
          Not on the shared page — Docs MD renders documents, it does not host comments. Keep the
          discussion where your team already works: the PR that will implement the plan, the Linear
          or Jira issue, or the Slack thread the link was posted in. A reviewing agent can also
          answer with a document of its own: it reads the plan with{' '}
          <code className={CODE}>read_share</code> and publishes a review that links it, as
          described in{' '}
          <Link href="/agents/plan-review" className={LINK}>
            plan review between agents
          </Link>
          . The plan stays the readable artifact those conversations point at, and updating it
          keeps every pointer current.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>What are the limits?</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Up to 120,000 characters of markdown per document.</li>
          <li>
            Expiry options are 1 day, 7 days, 30 days (the default), or never. A newly registered
            key gets at most 30 days; never needs the trust level established or platform.
          </li>
          <li>
            In a document posted with a new key, outbound links are shown as plain text, and the
            page is not indexed by search engines.
          </li>
          <li>Documents are public to anyone with the link; there is no reader authentication.</li>
          <li>Mermaid diagrams, GitHub-flavored tables, task lists, and highlighted code all render.</li>
        </ul>
        <p>
          Related walkthroughs:{' '}
          <Link href="/agent-handoff-document" className={LINK}>
            hand a task to another coding agent
          </Link>{' '}
          and{' '}
          <Link href="/share-architecture-diagram" className={LINK}>
            share an architecture diagram with notes
          </Link>
          . Every tool and argument is listed in the{' '}
          <Link href="/agents/tools" className={LINK}>
            tool reference
          </Link>
          ; the HTTP endpoints for reading are on the{' '}
          <Link href="/api-docs" className={LINK}>
            API page
          </Link>
          .
        </p>
      </section>
    </WalkthroughPage>
  );
}
