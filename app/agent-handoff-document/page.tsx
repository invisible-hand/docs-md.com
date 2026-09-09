import Link from 'next/link';
import ExamplePanel from '@/components/ExamplePanel';
import WalkthroughPage, { CODE, CodeBlock, H2, LINK } from '@/components/WalkthroughPage';
import { getExample } from '@/lib/examples';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-09-06';

export const metadata = pageMetadata({
  title: 'Agent Handoff Document: Template for AI Coding Agents',
  description:
    'Template and filled-in example for handing a coding task from one AI agent to another: objective, commit, changes, commands run, open problems, next steps.',
  path: '/agent-handoff-document',
  type: 'article',
  kicker: 'Walkthrough',
});

const TEMPLATE = `# Agent handoff: <task name>

## Objective
One paragraph: what "done" means, and what must not change.

## Repository and branch
- Repo:
- Branch:
- Base:

## Relevant commit
<hash> — <subject>. Everything below describes the tree at this commit.

## Completed changes
- ...

## Files affected
\`\`\`
path/one.ts   (new | modified)
\`\`\`

## Commands run and results
\`\`\`
npm test  → 14 passed
\`\`\`

## Unresolved problems
1. ...

## Decisions and constraints
- ...

## Next steps
1. ...
`;

const FAQ = [
  {
    q: 'How do I hand off a coding task to another AI agent?',
    a: 'Have the current agent write a handoff document: objective, repo and branch, the commit its summary describes, completed changes, files touched, commands it ran with their results, unresolved problems, decisions, and next steps. Publish it as a link. The next agent reads the raw markdown URL; a human reads the rendered page.',
  },
  {
    q: 'What should an agent handoff document contain?',
    a: 'The nine sections in the template on this page. The two that are most often missing and most valuable are "commands run and results" (so the next agent does not repeat them) and "relevant commit" (so it can tell whether the summary is stale).',
  },
  {
    q: 'How can another coding assistant read my markdown progress report?',
    a: 'Give it the raw URL, https://docs-md.com/raw/<id>, which returns plain text/markdown. Any assistant that can fetch a URL — Claude Code, Cursor, Codex, a custom agent with an HTTP tool — can read it directly. The rendered URL without /raw/ is for people.',
  },
  {
    q: 'Does the handoff transfer repository access or conversation history?',
    a: 'No. It transfers a written summary only: no repo access, no credentials, no files, no chat state. The next agent still needs its own checkout and permissions. That is why the document names the branch and commit explicitly.',
  },
  {
    q: 'How long should a handoff link live?',
    a: 'Match the expiry to the task: 1 day for a same-day session switch, 7 days for a task that waits on a teammate. Use "never" only for handoffs you will link from a README or an issue for the long term. The link is public to anyone who has it.',
  },
];

export default function AgentHandoffDocumentPage() {
  const example = getExample('agent-handoff');
  return (
    <WalkthroughPage
      slug="agent-handoff-document"
      title="Agent handoff document: pass a coding task between AI agents"
      description="A fresh session, a different assistant, or a teammate has to pick up where an agent stopped. This is the document that makes that possible — a template, a filled-in example, and the two ways the next reader consumes it."
      updated={UPDATED}
      faq={FAQ}
    >
      <section className="space-y-4">
        <h2 className={H2}>Why does an agent handoff need a document at all?</h2>
        <p>
          Context windows end, sessions get closed, and the assistant that started the work is not
          the one that finishes it. What survives is whatever was written down. A handoff document is
          a compact, honest account of the state of a task: what was done, what was verified, what is
          still broken, and what to do next. It is not a transcript, and it deliberately does not
          carry repository access, credentials, or the previous conversation — only text.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>What should an agent handoff document contain?</h2>
        <p>Nine sections, in this order. Copy the template into your project or ask your assistant to fill it in.</p>
        <CodeBlock>{TEMPLATE}</CodeBlock>
        <p>
          Two of these do most of the work. <strong>Commands run and results</strong> saves the next
          agent from re-running a ten-minute test suite to learn what you already know.{' '}
          <strong>Relevant commit</strong> lets it check <code className={CODE}>git log -1</code> and
          see immediately whether the summary still matches the branch.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>What does a filled-in handoff look like?</h2>
        <p>
          A fictional but realistic one: an agent moved session storage to Redis behind a feature
          flag, ran the tests, and stopped before the CI and staging work. Everything the next agent
          needs is in the document, including the pre-existing lint warning it should not waste time on.
        </p>
        <ExamplePanel example={example} />
      </section>

      <section className="space-y-4">
        <h2 className={H2}>How do I publish the handoff and pass the link on?</h2>
        <p>
          From Claude Code or Cursor with the{' '}
          <Link href="/ai-powered-ide" className={LINK}>
            Docs MD MCP server
          </Link>{' '}
          connected, at the end of the session:
        </p>
        <CodeBlock>{`Write an agent-handoff.md for the work in this session using the nine-section
template, then share it with a 7-day expiry and give me both links.`}</CodeBlock>
        <p>
          You get a rendered URL and a raw URL. Paste the raw URL into the next session&apos;s first
          message, or into the issue the teammate will pick up. Without MCP, the same thing from a
          shell:
        </p>
        <CodeBlock>{`curl -s -X POST https://docs-md.com/api/share \\
  -H "Content-Type: application/json" \\
  --data-binary @<(jq -Rs '{content: ., filename: "agent-handoff.md", expiry: "7d"}' agent-handoff.md) \\
  | jq -r '.rawUrl'`}</CodeBlock>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>How does the next agent or person read it?</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>A person</strong> opens the rendered link: headings, the file list as a code
            block, the results table, and a table of contents in the sidebar.
          </li>
          <li>
            <strong>An assistant</strong> with an HTTP tool fetches{' '}
            <code className={CODE}>https://docs-md.com/raw/&lt;id&gt;</code> and gets the markdown as{' '}
            <code className={CODE}>text/markdown</code>. A first message such as{' '}
            <em>&quot;Read https://docs-md.com/raw/… and continue from its next steps&quot;</em> is enough.
          </li>
        </ul>
        <p>
          Before acting on the summary, the next agent should compare the commit in the document
          with the branch head. If they differ, someone worked after the handoff was written, and the
          document is a starting point rather than the truth.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>What are the limits?</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>120,000 characters per share; a handoff should be far shorter than that.</li>
          <li>The link is public to anyone who has it. Never include tokens, keys, or customer data.</li>
          <li>Expiry removes the page at its URL; it does not recall copies already fetched.</li>
          <li>
            The next agent needs its own repository access. The handoff carries a summary, not
            permissions.
          </li>
        </ul>
        <p>
          See also:{' '}
          <Link href="/share-implementation-plan" className={LINK}>
            share an implementation plan for review
          </Link>{' '}
          and the{' '}
          <Link href="/api-docs" className={LINK}>
            REST API
          </Link>
          .
        </p>
      </section>
    </WalkthroughPage>
  );
}
