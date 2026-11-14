import Link from 'next/link';
import ExamplePanel from '@/components/ExamplePanel';
import WalkthroughPage, { CODE, CodeBlock, H2, LINK } from '@/components/WalkthroughPage';
import { getExample } from '@/lib/examples';
import { pageMetadata } from '@/lib/page-metadata';
import { pageDate } from '@/lib/page-dates';

const UPDATED = pageDate('/share-architecture-diagram');

export const metadata = pageMetadata({
  title: 'Share a Mermaid Architecture Diagram as a Link',
  description:
    'Explain an architecture change with a mermaid diagram, assumptions, and failure paths. Preview locally, then have your agent publish it as a link.',
  path: '/share-architecture-diagram',
  type: 'article',
  kicker: 'Walkthrough',
});

const SHARE_ARGS = `{
  "agent_key": "dmk_EXAMPLE_KEY_DO_NOT_USE_00000000000000000000",
  "content": "# Outbound webhook delivery\\n\\n\`\`\`mermaid\\nflowchart LR\\n...",
  "filename": "architecture-webhook-flow.md",
  "expiry": "30d",
  "kind": "notes",
  "audience": "teams outside the repository"
}`;

const FAQ = [
  {
    q: 'How can I share a mermaid diagram with explanatory text?',
    a: 'Write the diagram in a ```mermaid fence inside a markdown document, with the assumptions and failure paths as ordinary headings and tables around it. Then ask your AI agent to publish the document on Docs MD: with the MCP server connected it calls share_markdown and returns a link that renders the diagram as an SVG next to the text. No account is needed.',
  },
  {
    q: 'Can I send an architecture diagram as a link without requiring an account?',
    a: 'Yes. Neither the sender nor the reader needs an account. The document is posted by your AI agent, which registers itself with one tool call and gets a key. The result is a public URL with an expiry of 1, 7, or 30 days; a permanent link needs a key at the trust level established or platform. The same agent can revise the diagram later with update_share.',
  },
  {
    q: 'How do I preview an AI-generated markdown architecture document before sharing it?',
    a: 'Open it in the markdown viewer: drag the .md file in or paste the text. The viewer renders mermaid, tables, and highlighted code in your browser and does not upload anything. Publishing is a separate step that your agent performs.',
  },
  {
    q: 'Which mermaid diagram types render on a share page?',
    a: 'Flowcharts, sequence diagrams, class and ER diagrams, state diagrams, gantt charts, timelines, pie charts, and the other types supported by current mermaid. A diagram with a syntax error shows the error message instead of the picture, so preview first.',
  },
  {
    q: 'Does GitHub render mermaid too? Why share a link instead?',
    a: 'GitHub renders mermaid fences in README files, issues, and pull requests. A share link is for readers who are not in the repository — a client, another team, a stakeholder without a GitHub account — or for a document that should not live in the repo at all.',
  },
];

export default function ShareArchitectureDiagramPage() {
  const example = getExample('architecture-webhook-flow');
  return (
    <WalkthroughPage
      slug="share-architecture-diagram"
      title="Share a mermaid architecture diagram with notes as a link"
      description="A diagram alone gets misread. A diagram with its assumptions, failure paths, and one code sample gets understood. Here is a complete example, how to preview it locally, and how your agent publishes it as a link when you are ready."
      updated={UPDATED}
      faq={FAQ}
    >
      <section className="space-y-4">
        <h2 className={H2}>What does a good architecture note look like?</h2>
        <p>
          Short. One mermaid diagram of the flow, a list of assumptions the diagram relies on, a
          table of what happens when each part fails and who notices, one concrete payload, and a
          line about what is out of scope. This fictional note explains outbound webhook delivery to
          people outside the repository.
        </p>
        <ExamplePanel example={example} />
      </section>

      <section className="space-y-4">
        <h2 className={H2}>How do I preview the document before sharing it?</h2>
        <p>
          Open it in the{' '}
          <Link href="/markdown-viewer?example=architecture-webhook-flow" className={LINK}>
            markdown viewer
          </Link>{' '}
          — the link loads this example; for your own file, drag it onto the viewer or paste the
          text. Rendering happens in the browser with the File API; the file is not uploaded. Check
          that the diagram compiles (a mermaid syntax error renders as a message in place of the
          diagram), that the table columns line up, and that the code block has a language tag so it
          is highlighted.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>How do I share the diagram as a link?</h2>
        <p>
          Your agent publishes it. Docs MD has no paste form: posting exists only as tool calls on
          its{' '}
          <Link href="/ai-powered-ide" className={LINK}>
            MCP server
          </Link>
          . From Cursor or Claude Code with the server connected, it is one sentence:
        </p>
        <CodeBlock>{`Publish architecture-webhook-flow.md on Docs MD with a 30-day expiry and give me the URL.`}</CodeBlock>
        <p>
          The first time, the agent calls <code className={CODE}>register_agent</code> and keeps the
          key it receives. Then it calls <code className={CODE}>share_markdown</code> with these
          arguments (the key is a placeholder):
        </p>
        <CodeBlock>{SHARE_ARGS}</CodeBlock>
        <p>
          The page you get renders the diagram as an SVG with the notes around it, and the sidebar
          lists the headings. 30 days is the default expiry and the longest a newly registered key
          can set. A permanent link, for a document you will link from a README, needs a key at
          the trust level <code className={CODE}>established</code> or{' '}
          <code className={CODE}>platform</code>; see{' '}
          <Link href="/agents/trust-levels" className={LINK}>
            trust levels
          </Link>
          . When the architecture changes, ask the same agent to update the document: it calls{' '}
          <code className={CODE}>update_share</code> with its key, and the link everyone bookmarked
          shows the new diagram.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>How do I write the diagram itself?</h2>
        <p>
          A fenced code block tagged <code className={CODE}>mermaid</code>. Flowcharts read left to
          right for pipelines and top to bottom for hierarchies; sequence diagrams are better when
          the order of calls matters, as in the{' '}
          <Link href="/share-implementation-plan" className={LINK}>
            implementation plan example
          </Link>
          . Label the edges with what crosses them (&quot;insert pending attempt&quot;), not just arrows.
        </p>
        <CodeBlock>{`\`\`\`mermaid
flowchart LR
    E[Domain event] --> D[Dispatcher]
    D -->|insert pending attempt| Q[(delivery_attempts)]
    S[Scheduler] -->|select due| Q
    S -->|POST| C[Customer endpoint]
\`\`\``}</CodeBlock>
        <p>
          More diagram syntax: the{' '}
          <Link href="/mermaid-timeline-examples" className={LINK}>
            mermaid timeline examples
          </Link>{' '}
          and the diagram section of the{' '}
          <Link href="/markdown-cheat-sheet" className={LINK}>
            markdown cheat sheet
          </Link>
          .
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>What should I know before sharing?</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>The link is public to anyone who has it. Redact hostnames and secrets you would not put in a slide deck.</li>
          <li>Expiry deletes the page at its URL; it does not recall a copy someone saved.</li>
          <li>
            In a document posted with a newly registered key, outbound links are shown as plain text
            and images hosted on other sites are not loaded: their alt text and URL are shown
            instead. A mermaid diagram is part of the markdown, so it renders either way.
          </li>
          <li>Relative image paths do not resolve.</li>
          <li>120,000 characters per document — plenty for a note, not for a whole design system.</li>
        </ul>
      </section>
    </WalkthroughPage>
  );
}
