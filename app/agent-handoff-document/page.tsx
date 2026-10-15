import Link from 'next/link';
import ExamplePanel from '@/components/ExamplePanel';
import WalkthroughPage, { CODE, CodeBlock, H2, LINK } from '@/components/WalkthroughPage';
import { getExample } from '@/lib/examples';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-10-11';

export const metadata = pageMetadata({
  title: 'HANDOFF.md: What It Is + a Copy-Paste Template',
  description:
    'HANDOFF.md is a markdown file that records state, decisions and next steps so another AI agent or developer can continue. Copy-paste template and example.',
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

const HANDOFF_MD = `# HANDOFF: <task name>

## Goal
What "done" means, in one or two sentences. What must not change.

## Current state
Where the work stands right now. Branch, last commit, what runs and what does not.

## What changed
- ...

## Decisions and why
- Chose X over Y because ...

## Next steps
1. ...
2. ...

## Open questions / blockers
- ...

## How to verify
\`\`\`
npm test
\`\`\`

## Files touched
- path/one.ts (new)
- path/two.ts (modified)
`;

const FAQ = [
  {
    q: 'What is HANDOFF.md?',
    a: 'HANDOFF.md is a plain markdown file, usually at the repo root or in a task folder, that records the goal, current state, decisions, next steps and open questions of a piece of work. An AI coding agent or a developer writes it at the end of a session so the next agent or person can continue without the old conversation.',
  },
  {
    q: 'Where should HANDOFF.md go?',
    a: 'Put it at the repo root for a single piece of ongoing work. For several tasks in parallel, use one file per task, such as tasks/<name>/HANDOFF.md. Commit it on the task branch, or keep it out of git if it holds scratch notes, and delete or archive it when the work merges.',
  },
  {
    q: 'Is HANDOFF.md a standard?',
    a: 'No. It is a community convention, not a formal spec. No tool requires the name or the sections. Teams pick the headings that fit and tell their agents to read and update the file. The template on this page is one workable layout.',
  },
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
      title="HANDOFF.md: what it is and a copy-paste template"
      description="HANDOFF.md is a plain markdown file at the repo root or in a task folder. It records the goal, current state, decisions, next steps and open questions so another AI agent or person can continue the work. Below: a template, an example and how to share it."
      updated={UPDATED}
      faq={FAQ}
    >
      <section className="space-y-4">
        <h2 className={H2}>Copy-paste HANDOFF.md template</h2>
        <p>Paste this into a new file, or ask your agent to fill it in at the end of a session.</p>
        <CodeBlock>{HANDOFF_MD}</CodeBlock>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>Where do you put HANDOFF.md and how do agents use it?</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Repo root</strong> for one stream of work. The next session finds it without being told.
          </li>
          <li>
            <strong>Per task</strong> (for example <code className={CODE}>tasks/login-fix/HANDOFF.md</code>) when
            several agents or branches run in parallel.
          </li>
        </ul>
        <p>
          Agents such as Claude Code, Cursor or Codex can read any file in the repo, so the simplest
          setup is a line in your instructions: &quot;At the end of a session, update HANDOFF.md. At
          the start, read it first.&quot; Nothing here depends on a built-in feature; it is an ordinary
          file and an ordinary instruction.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>HANDOFF.md vs AGENTS.md, CLAUDE.md and README</h2>
        <p>
          HANDOFF.md holds <strong>session state</strong>: what happened and what comes next. It
          changes every session and is retired when the work ends. AGENTS.md and CLAUDE.md hold{' '}
          <strong>standing instructions</strong> for agents: build commands, code style, rules. README
          holds <strong>project docs</strong> for humans. Do not put session notes in the standing
          files; they go stale and mislead later runs.
        </p>
      </section>

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
        <p>The template above is the short form. This longer nine-section version suits larger tasks and adds the commit and the commands already run.</p>
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
          To build the file from a form instead of by hand, use the{' '}
          <Link href="/handoff-generator" className={LINK}>
            HANDOFF.md generator
          </Link>
          : it emits the same sections with a live preview, a download, and a share link.
        </p>
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
