import type { Metadata } from 'next';
import Link from 'next/link';
import WalkthroughPage, { CODE, CodeBlock, H2, LINK } from '@/components/WalkthroughPage';

const UPDATED = '2026-09-07';

export const metadata: Metadata = {
  title: 'GitHub Action to Publish a Markdown Report as a Shareable Link',
  description:
    'Publish a markdown file from GitHub Actions as a rendered, expiring link and get the URL as a step output. No account needed. Inputs, outputs, examples.',
  alternates: { canonical: '/github-action' },
};

const BASIC = `- name: Publish report
  id: report
  uses: invisible-hand/share-markdown-action@v1
  with:
    file: bundle-report.md
    expiry: 7d            # 1d | 7d | 30d | never

- name: Link it from the job summary
  run: echo "Readable report: \${{ steps.report.outputs.url }}" >> "$GITHUB_STEP_SUMMARY"`;

const PR_COMMENT = `name: Test report
on: [pull_request]
jobs:
  report:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test -- --reporter=markdown > test-report.md || true
      - id: share
        uses: invisible-hand/share-markdown-action@v1
        with:
          file: test-report.md
          expiry: 7d
      - uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              owner: context.repo.owner, repo: context.repo.repo,
              issue_number: context.issue.number,
              body: \`Test report for \${context.sha.slice(0,7)}: \${{ steps.share.outputs.url }}\`
            })`;

const UPDATE = `- uses: invisible-hand/share-markdown-action@v1
  with:
    file: STATUS.md
    share-id: \${{ secrets.STATUS_SHARE_ID }}
    edit-token: \${{ secrets.STATUS_EDIT_TOKEN }}`;

const FAQ = [
  {
    q: 'How do I publish a markdown file from GitHub Actions as a link?',
    a: 'Add one step: uses: invisible-hand/share-markdown-action@v1 with file: path/to/report.md. The step outputs url (a rendered page), raw-url (the markdown as text/markdown), id, edit-token and expires-at. No account, secret or token is needed to create a share.',
  },
  {
    q: 'Why not just use the GitHub job summary?',
    a: 'The job summary lives inside the Actions run, so only people with repository access can read it, and it disappears with the run logs. A Docs MD link can be sent to anyone — a client, a Slack channel, a release thread — and lives for the expiry you choose, independent of log retention.',
  },
  {
    q: 'Can the action update the same link on every run?',
    a: 'Yes. Create the share once, store its id and edit token as repository secrets, and pass them as share-id and edit-token. The action then sends a PATCH instead of a POST and the URL stays the same.',
  },
  {
    q: 'Is the edit token printed in the workflow log?',
    a: 'No. The action registers it with ::add-mask:: before anything is printed, so GitHub replaces it with *** in logs. It is still available as the edit-token output for a later step to store.',
  },
  {
    q: 'What does the action need on the runner?',
    a: 'bash, curl and jq, all present on ubuntu-latest, macos-latest and windows-latest with Git Bash. It is a composite action with no Docker image and no Node dependencies, so it adds about a second to a job.',
  },
  {
    q: 'Who can read a published report?',
    a: 'Anyone with the link. Shares are public URLs; there is no access control beyond the unguessable id. Keep secrets, tokens, private hostnames and customer data out of the file. Expiry deletes the page but does not recall copies already fetched.',
  },
];

export default function GitHubActionPage() {
  return (
    <WalkthroughPage
      slug="github-action"
      title="GitHub Action: publish a markdown report as a shareable link"
      description="One step in a workflow turns any generated markdown file — a test report, a bundle-size table, release notes, a bug report — into a rendered link with an expiry, and hands the URL to the next step. No account, no API token."
      updated={UPDATED}
      faq={FAQ}
    >
      <section className="space-y-4">
        <h2 className={H2}>What does the action do?</h2>
        <p>
          It POSTs the file to the{' '}
          <Link href="/api-docs" className={LINK}>
            Docs MD share API
          </Link>
          , masks the returned edit token, and exposes the reading URL, raw URL, id and expiry as
          step outputs. It is a composite action (bash + curl + jq), so there is no container to pull
          and nothing to install.
        </p>
        <CodeBlock>{BASIC}</CodeBlock>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>What are the inputs and outputs?</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-900">
                <th className="py-2 pr-4">Input</th>
                <th className="py-2 pr-4">Default</th>
                <th className="py-2">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="py-2 pr-4 font-mono">file</td><td className="py-2 pr-4">required</td><td className="py-2">Markdown file, up to 120,000 characters</td></tr>
              <tr><td className="py-2 pr-4 font-mono">expiry</td><td className="py-2 pr-4">7d</td><td className="py-2">1d, 7d, 30d or never</td></tr>
              <tr><td className="py-2 pr-4 font-mono">filename</td><td className="py-2 pr-4">basename of file</td><td className="py-2">Shown on the page and used for downloads</td></tr>
              <tr><td className="py-2 pr-4 font-mono">share-id</td><td className="py-2 pr-4">—</td><td className="py-2">Update this share in place instead of creating one</td></tr>
              <tr><td className="py-2 pr-4 font-mono">edit-token</td><td className="py-2 pr-4">—</td><td className="py-2">Required with share-id; pass from a secret</td></tr>
              <tr><td className="py-2 pr-4 font-mono">api-url</td><td className="py-2 pr-4">https://docs-md.com</td><td className="py-2">For a self-hosted instance</td></tr>
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-900">
                <th className="py-2 pr-4">Output</th>
                <th className="py-2">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="py-2 pr-4 font-mono">url</td><td className="py-2">Rendered page for people</td></tr>
              <tr><td className="py-2 pr-4 font-mono">raw-url</td><td className="py-2">text/markdown for scripts and AI assistants</td></tr>
              <tr><td className="py-2 pr-4 font-mono">id</td><td className="py-2">Share id</td></tr>
              <tr><td className="py-2 pr-4 font-mono">edit-token</td><td className="py-2">Masked in logs; store as a secret to update or delete later</td></tr>
              <tr><td className="py-2 pr-4 font-mono">expires-at</td><td className="py-2">Unix epoch in milliseconds, empty for never</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>How do I post a test report link on every pull request?</h2>
        <p>
          Generate the report, publish it, and comment the URL on the PR. Reviewers without a
          GitHub account for that repository — a client, a QA vendor — can still open it.
        </p>
        <CodeBlock>{PR_COMMENT}</CodeBlock>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>How do I keep one stable URL and update it on every run?</h2>
        <p>
          Create the share once (a first run of the action, or the{' '}
          <Link href="/" className={LINK}>
            editor
          </Link>
          ), save the <code className={CODE}>id</code> and <code className={CODE}>edit-token</code>{' '}
          outputs as repository secrets, and pass them back in. The action then updates the existing
          page instead of creating a new one — a status page, a nightly benchmark table, a changelog
          draft.
        </p>
        <CodeBlock>{UPDATE}</CodeBlock>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>What are the limits?</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>120,000 characters per file; 20 shares per minute per IP (a busy monorepo with many parallel jobs should stagger publishes).</li>
          <li>Shares are public to anyone with the link. Never publish secrets, private hostnames or customer data.</li>
          <li>Expiry deletes the page at its URL; it does not recall copies already fetched.</li>
          <li>Pin to <code className={CODE}>@v1</code> for stability or to a commit SHA for reproducibility. Source and issues:{' '}
            <a href="https://github.com/invisible-hand/share-markdown-action" className={LINK} rel="noopener">
              share-markdown-action repository
            </a>
            .
          </li>
        </ul>
        <p>
          Prefer a plain script? The{' '}
          <Link href="/api-docs" className={LINK}>
            API docs
          </Link>{' '}
          carry a 12-line bash equivalent. For documents an assistant writes rather than CI, see{' '}
          <Link href="/agent-handoff-document" className={LINK}>
            the agent handoff walkthrough
          </Link>
          .
        </p>
      </section>
    </WalkthroughPage>
  );
}
