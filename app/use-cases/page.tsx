import type { Metadata } from 'next';
import Link from 'next/link';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'Markdown Sharing Use Cases',
  description:
    'How teams use markdown share links: design reviews, incident postmortems, AI agent handoffs, client deliverables, README-linked docs, and CI reports.',
};

function InlineCode({ children }: { children: string }) {
  return <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">{children}</code>;
}

const useCases = [
  {
    title: 'Engineering design reviews',
    expiry: '7 days',
    body: 'An RFC needs readers, not a permanent home — that comes later, in the repo or wiki, after the decision. Share the draft with a 7-day expiry, collect comments in the Slack thread next to it, and update the same link as the design evolves. Reviewers always see the current version; nothing stale survives the review.',
  },
  {
    title: 'Incident postmortems',
    expiry: '30 days',
    body: 'During and after an incident you need one working document: timeline, log excerpts with syntax highlighting, action items. A share link is faster than a wiki page and safer than a Google Doc full of paste-mangled stack traces. When the formal postmortem lands, the working copy deletes itself on schedule.',
  },
  {
    title: 'AI agent → human handoffs',
    expiry: '1–7 days',
    body: 'Agents produce state that someone else has to pick up: what was tried, what failed, what remains. Publishing a status document via MCP and posting one URL beats dumping context into a channel. The next agent reads /raw/:id to resume with exact state; humans get the rendered version with a table of contents.',
  },
  {
    title: 'Client and stakeholder deliverables',
    expiry: '30 days',
    body: 'Consultants and freelancers send scopes, audits, and status reports to people who will never open a git repo. A share link renders cleanly on any device with no login wall, and the expiry communicates professionalism: this is a living document with a shelf life, not a file to be forwarded around forever.',
  },
  {
    title: 'Docs linked from READMEs',
    expiry: 'never',
    body: 'Setup guides, internal API references, onboarding checklists — documents that outlive any sprint. Permanent shares keep a stable URL you can safely put in a README, and mermaid code fences render as real diagrams, which is more than GitHub gives you in most contexts.',
  },
  {
    title: 'CI and automation reports',
    expiry: '1 day',
    body: 'A nightly job posts its summary — test flakes, bundle-size diffs, dependency audits — through the REST API and drops the link in Slack. One day of expiry keeps the channel useful and the report collection self-cleaning. No dashboards to build, no artifacts bucket to browse.',
  },
];

export default function UseCasesPage() {
  return (
    <ContentPage
      title="Use cases for Docs MD"
      description="Six patterns where a markdown share link beats a wiki page, a Google Doc, or a paste into chat — each with the expiry setting that fits it."
    >
      <section className="space-y-5">
        {useCases.map((useCase) => (
          <article key={useCase.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-gray-950">{useCase.title}</h2>
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                expiry: {useCase.expiry}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">{useCase.body}</p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">The common thread</h2>
        <p>
          Every one of these is a document with a <em>known audience and a known half-life</em>.
          That is the niche between chat (instant but unreadable for anything structured) and a
          wiki (permanent but heavyweight). Match the expiry to the half-life —{' '}
          <InlineCode>1d</InlineCode>, <InlineCode>7d</InlineCode>, <InlineCode>30d</InlineCode>, or{' '}
          <InlineCode>never</InlineCode> — and the tool disappears into the workflow.
        </p>
        <p>
          Publish from the{' '}
          <Link href="/" className="text-indigo-700 underline">
            web editor
          </Link>
          , from your IDE via{' '}
          <Link href="/what-is-mcp" className="text-indigo-700 underline">
            MCP
          </Link>
          , or from scripts via the{' '}
          <Link href="/api-docs" className="text-indigo-700 underline">
            REST API
          </Link>
          . Every share can be updated or deleted later with its edit token.
        </p>
      </section>
    </ContentPage>
  );
}
