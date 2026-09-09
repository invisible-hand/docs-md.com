import Link from 'next/link';
import ExamplePanel from '@/components/ExamplePanel';
import WalkthroughPage, { CODE, CodeBlock, H2, LINK } from '@/components/WalkthroughPage';
import { getExample } from '@/lib/examples';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-09-06';

export const metadata = pageMetadata({
  title: 'Share an Implementation Plan from Cursor or Claude Code',
  description:
    'Turn an AI-generated implementation plan into a rendered link a teammate can review, from Cursor or Claude Code via MCP or with curl. Example included.',
  path: '/share-implementation-plan',
  type: 'article',
  kicker: 'Walkthrough',
});

const FAQ = [
  {
    q: 'How do I share a Cursor implementation plan with a teammate?',
    a: 'Add the Docs MD MCP server to Cursor, then ask the assistant to "share implementation-plan.md with a 7-day expiry and give me the link". It calls share_markdown and returns a public URL that renders the plan with its diagram and code blocks. No account is needed on either side.',
  },
  {
    q: 'Can I update the plan after reviewers comment without changing the link?',
    a: 'Yes. Every share returns an edit token. Ask the assistant to update the share with the new content (or call PATCH /api/share/:id with the token) and the same URL shows the new version. Nothing you posted in Slack or a pull request goes stale.',
  },
  {
    q: 'Is the shared plan private?',
    a: 'No. A share is a public URL: anyone who has the link can read it. The edit token only controls who can change or delete it. Do not put credentials or unreleased customer data in a plan you share; keep the discussion itself in your existing PR, issue, or chat thread.',
  },
  {
    q: 'What happens when the 7 days are up?',
    a: 'The document and its stored file are deleted and the URL returns 404. Expiration removes access at the original address; it cannot recall copies that reviewers downloaded or printed. Expiring shares also carry a noindex directive, which asks search engines not to list them.',
  },
  {
    q: 'Does loading the example publish anything?',
    a: 'No. "Open in editor" only fills the homepage editor with the example text. A share is created only when you click Share Markdown, and the same is true for the MCP and API paths — nothing is published until you or your assistant explicitly calls share_markdown.',
  },
];

export default function ShareImplementationPlanPage() {
  const example = getExample('implementation-plan');
  return (
    <WalkthroughPage
      slug="share-implementation-plan"
      title="Share an implementation plan from Cursor or Claude Code as a link"
      description="Your assistant just wrote a long plan: alternatives, a sequence diagram, code snippets, a decision for the reviewer. Here is how to hand it to a teammate as a rendered page, update it after review, and let it expire on its own."
      updated={UPDATED}
      faq={FAQ}
    >
      <section className="space-y-4">
        <h2 className={H2}>What is the problem with sharing a plan from an AI coding assistant?</h2>
        <p>
          The plan lives in your working tree or in the chat scroll-back. The reviewer is in Slack,
          Linear, or a pull request thread. Pasting 200 lines of markdown into chat breaks the tables
          and the mermaid diagram; committing a <code className={CODE}>PLAN.md</code> for a document
          that is obsolete the moment the code lands is noise in the repo. A share link is the
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
          risks, and rollout. Download it, open it in the editor, or use it as a template for your
          own.
        </p>
        <ExamplePanel example={example} />
      </section>

      <section className="space-y-4">
        <h2 className={H2}>How do I publish the plan from Cursor or Claude Code?</h2>
        <p>
          Connect the Docs MD MCP server once (per-editor configs are in the{' '}
          <Link href="/ai-powered-ide" className={LINK}>
            AI IDE guide
          </Link>
          ). For Claude Code that is one command:
        </p>
        <CodeBlock>{`claude mcp add --transport http md-share https://docs-md.com/api/mcp`}</CodeBlock>
        <p>Then, with the plan open, ask:</p>
        <CodeBlock>{`Publish implementation-plan.md with a 7-day expiry. Give me the reading link,
and keep the edit token out of the document itself.`}</CodeBlock>
        <p>
          The assistant calls <code className={CODE}>share_markdown</code> and reports back something
          like this (the id and token are made up):
        </p>
        <CodeBlock>{`✓ Markdown shared successfully!

https://docs-md.com/quiet-harbor-7k2pd

Raw: https://docs-md.com/raw/quiet-harbor-7k2pd
Expires: 9/13/2026

Edit token (keep it to update or delete this share later): 4b1e…`}</CodeBlock>
        <p>
          Post the first URL in the review thread. Ask the assistant to note the edit token in the
          conversation or a local file that is not committed — it is the only way to change the
          share later.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>How do I update the plan after review without changing the link?</h2>
        <p>
          Edit the source, then ask: <em>&quot;Update the share quiet-harbor-7k2pd with the new
          implementation-plan.md.&quot;</em> The assistant calls{' '}
          <code className={CODE}>update_share</code> with the edit token. The URL you already posted now
          renders version two, and the expiry clock does not reset. From a script the same operation is:
        </p>
        <CodeBlock>{`curl -X PATCH https://docs-md.com/api/share/quiet-harbor-7k2pd \\
  -H "Content-Type: application/json" \\
  -H "x-edit-token: $EDIT_TOKEN" \\
  --data-binary @<(jq -Rs '{content: .}' implementation-plan.md)`}</CodeBlock>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>Where does the review discussion go?</h2>
        <p>
          Not on the shared page — Docs MD renders documents, it does not host comments. Keep the
          discussion where your team already works: the PR that will implement the plan, the Linear
          or Jira issue, or the Slack thread the link was posted in. The share is the readable
          artifact those conversations point at, and updating it keeps every pointer current.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>What are the limits?</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Up to 120,000 characters of markdown per share, which is roughly 60 pages of plan.</li>
          <li>Expiry options are 1 day, 7 days, 30 days (the default), or never.</li>
          <li>Shares are public to anyone with the link; there is no reader authentication.</li>
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
          . The full REST surface is on the{' '}
          <Link href="/api-docs" className={LINK}>
            API page
          </Link>
          .
        </p>
      </section>
    </WalkthroughPage>
  );
}
