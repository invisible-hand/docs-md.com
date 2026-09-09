import Link from 'next/link';
import ExamplePanel from '@/components/ExamplePanel';
import WalkthroughPage, { CODE, CodeBlock, H2, LINK } from '@/components/WalkthroughPage';
import { getExample } from '@/lib/examples';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-09-06';

export const metadata = pageMetadata({
  title: 'Share a Mermaid Architecture Diagram as a Link',
  description:
    'Explain an architecture change with a mermaid diagram, assumptions, and failure paths. Preview locally, then share it as a link with no account.',
  path: '/share-architecture-diagram',
  type: 'article',
  kicker: 'Walkthrough',
});

const FAQ = [
  {
    q: 'How can I share a mermaid diagram with explanatory text?',
    a: 'Write the diagram in a ```mermaid fence inside a markdown document, with the assumptions and failure paths as ordinary headings and tables around it. Paste the document into the Docs MD editor and click Share Markdown. The link renders the diagram as an SVG next to the text. No account is needed.',
  },
  {
    q: 'Can I send an architecture diagram as a link without requiring an account?',
    a: 'Yes. Neither the sender nor the reader needs an account. The share is a public URL; choose an expiry of 1, 7, or 30 days, or never, and keep the edit token if you expect to revise the diagram.',
  },
  {
    q: 'How do I preview an AI-generated markdown architecture document before sharing it?',
    a: 'Open it in the markdown viewer: drag the .md file in or paste the text. The viewer renders mermaid, tables, and highlighted code in your browser and does not upload anything. Sharing is a separate button.',
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
      description="A diagram alone gets misread. A diagram with its assumptions, failure paths, and one code sample gets understood. Here is a complete example, how to preview it locally, and how to publish it as a link when you are ready."
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
          Click <em>Open in editor</em> above, or paste your document into the{' '}
          <Link href="/" className={LINK}>
            homepage editor
          </Link>
          . Pick an expiry — 30 days is the default; <em>never</em> for a document you will link from
          a README — and click <strong>Share Markdown</strong>. The page you get renders the diagram
          as an SVG with the notes around it, and the sidebar lists the headings. From Cursor or
          Claude Code with the{' '}
          <Link href="/ai-powered-ide" className={LINK}>
            MCP server
          </Link>{' '}
          connected, the same thing is one sentence:
        </p>
        <CodeBlock>{`Share architecture-webhook-flow.md as a permanent link and give me the URL.`}</CodeBlock>
        <p>
          Keep the edit token the assistant reports. When the architecture changes, ask it to update
          the share, and the link everyone bookmarked shows the new diagram.
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
          <li>Images referenced by absolute URL load from wherever they are hosted; relative image paths do not resolve.</li>
          <li>120,000 characters per share — plenty for a note, not for a whole design system.</li>
        </ul>
      </section>
    </WalkthroughPage>
  );
}
