import Link from 'next/link';
import ExamplePanel from '@/components/ExamplePanel';
import WalkthroughPage, { CODE, CodeBlock, H2, LINK } from '@/components/WalkthroughPage';
import { getExample } from '@/lib/examples';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-09-07';

export const metadata = pageMetadata({
  title: 'Bug Report Template in Markdown (with Filled-In Example)',
  description:
    'Markdown bug report template + filled-in example: environment, steps to reproduce, expected vs actual, evidence, scope, workaround. GitHub issue form too.',
  path: '/bug-report-template',
  type: 'article',
  kicker: 'Walkthrough',
});

const TEMPLATE = `# Bug: <one line — what breaks, where, under what condition>

## Summary
Two or three sentences: what happens, who it affects, why it matters.

## Environment
- Product / version / build (commit if known):
- URL or screen:
- OS + browser or device:
- Account type / role / region:

## Steps to reproduce
1. ...
2. ...
3. ...

## Expected result
What should have happened.

## Actual result
What happened instead. Quote exact error text.

## Evidence
- Screenshot / recording:
- Request + response (status, body):
- Console or server log lines:

## Scope and impact
- Reproduces N/N times on <env>; not on <env/version>.
- Who is affected; how many reports so far.

## Workaround
What a user can do right now, or "none".

## Suspected cause (optional)
Only if you have a concrete lead — a PR, a commit, a config change.
`;

const ISSUE_FORM = `# .github/ISSUE_TEMPLATE/bug_report.yml
name: Bug report
description: Something is broken
title: "Bug: "
labels: [bug, triage]
body:
  - type: textarea
    id: summary
    attributes: { label: Summary, description: What happens, who it affects, why it matters }
    validations: { required: true }
  - type: input
    id: version
    attributes: { label: Version / build, placeholder: "2026.09.04-1 (c81d2f7)" }
    validations: { required: true }
  - type: input
    id: env
    attributes: { label: Environment, placeholder: "Chrome 140 · macOS 15.6 · US" }
  - type: textarea
    id: steps
    attributes:
      label: Steps to reproduce
      value: |
        1.
        2.
        3.
    validations: { required: true }
  - type: textarea
    id: expected
    attributes: { label: Expected result }
    validations: { required: true }
  - type: textarea
    id: actual
    attributes: { label: Actual result, description: Quote exact error text }
    validations: { required: true }
  - type: textarea
    id: evidence
    attributes: { label: Evidence, description: Screenshots, request/response, logs }
  - type: textarea
    id: workaround
    attributes: { label: Workaround }
`;

const FAQ = [
  {
    q: 'What should a bug report contain?',
    a: 'A one-line title, a short summary, the environment (version or build, URL, OS and browser, account type), numbered steps to reproduce, the expected result, the actual result with exact error text, evidence (screenshot, request and response, logs), the scope (how often it reproduces and on which versions), and a workaround if one exists. A suspected cause is optional.',
  },
  {
    q: 'How do I write a bug report in markdown?',
    a: 'Use one H2 per section so the report has a table of contents, numbered lists for steps, a fenced code block for error text and log lines, and a table if you compare versions or environments. Keep the title under 80 characters and start it with "Bug:". The template on this page is plain markdown you can paste into GitHub, GitLab, Jira, Linear, or a shared document.',
  },
  {
    q: 'What is the difference between a bug report template and a GitHub issue form?',
    a: 'A markdown template is a document with headings that the reporter fills in anywhere. A GitHub issue form is a YAML file in .github/ISSUE_TEMPLATE that renders as a web form with required fields, so reporters cannot skip the steps or the version. Both produce the same sections; use the form for public repositories and the markdown template everywhere else.',
  },
  {
    q: 'How detailed should the steps to reproduce be?',
    a: 'Detailed enough that someone who has never seen the product can follow them without asking a question: exact menu names, exact input values, the SKU or record id, and the starting state. If a step depends on data, say which data. Five precise steps beat one vague paragraph.',
  },
  {
    q: 'How do I share a bug report with someone outside the issue tracker?',
    a: 'Paste the markdown into Docs MD and share the link. The reader gets a rendered page with headings and a table of contents; nobody needs an account or tracker access. Choose a 7-day expiry for a report that will be copied into a ticket, or "never" for a report you link from a postmortem. Keep credentials and customer data out of it — the link is public to anyone who has it.',
  },
  {
    q: 'What should I leave out of a bug report?',
    a: 'Guesses presented as facts, several bugs in one report, screenshots without the step they belong to, and anything private: session cookies, API keys, customer names. Strip cookies from HAR files before attaching them.',
  },
];

export default function BugReportTemplatePage() {
  const example = getExample('bug-report');
  return (
    <WalkthroughPage
      slug="bug-report-template"
      title="Bug report template: what to include, with a filled-in example"
      description="A markdown template with the nine sections an engineer needs to reproduce a bug without follow-up questions, a complete example report, the equivalent GitHub issue form, and how to share the report as a link with someone who has no tracker access."
      updated={UPDATED}
      faq={FAQ}
    >
      <section className="space-y-4">
        <h2 className={H2}>What should a bug report contain?</h2>
        <p>
          Nine sections. The first four get the bug reproduced; the rest get it prioritised and
          fixed without a round trip back to the reporter.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-900">
                <th className="py-2 pr-4">Section</th>
                <th className="py-2 pr-4">Answers</th>
                <th className="py-2">Most common omission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="py-2 pr-4 font-medium">Title</td><td className="py-2 pr-4">What breaks, where, under what condition</td><td className="py-2">The condition</td></tr>
              <tr><td className="py-2 pr-4 font-medium">Summary</td><td className="py-2 pr-4">Who is affected and why it matters</td><td className="py-2">Impact</td></tr>
              <tr><td className="py-2 pr-4 font-medium">Environment</td><td className="py-2 pr-4">Version or build, URL, OS/browser, account type</td><td className="py-2">The build number</td></tr>
              <tr><td className="py-2 pr-4 font-medium">Steps to reproduce</td><td className="py-2 pr-4">Exact numbered actions from a known starting state</td><td className="py-2">The starting state</td></tr>
              <tr><td className="py-2 pr-4 font-medium">Expected result</td><td className="py-2 pr-4">What should have happened</td><td className="py-2">Left implicit</td></tr>
              <tr><td className="py-2 pr-4 font-medium">Actual result</td><td className="py-2 pr-4">What happened, with exact error text</td><td className="py-2">Paraphrased errors</td></tr>
              <tr><td className="py-2 pr-4 font-medium">Evidence</td><td className="py-2 pr-4">Screenshot, request/response, log lines</td><td className="py-2">The response body</td></tr>
              <tr><td className="py-2 pr-4 font-medium">Scope</td><td className="py-2 pr-4">How often, which versions, how many reports</td><td className="py-2">The last version that worked</td></tr>
              <tr><td className="py-2 pr-4 font-medium">Workaround</td><td className="py-2 pr-4">What users can do today</td><td className="py-2">&quot;None&quot; is a valid answer</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>Bug report template (markdown)</h2>
        <p>Copy this into your tracker, wiki, or a new document. Every section is an H2 so the rendered report gets a table of contents.</p>
        <CodeBlock>{TEMPLATE}</CodeBlock>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>What does a good bug report look like filled in?</h2>
        <p>
          A fictional but realistic one: a checkout page loses an applied discount when the
          quantity changes. Notice what makes it actionable — the build number, the SKU and promo
          code used, the request that returned the wrong body, the last build that worked, and the
          number of support tickets that match.
        </p>
        <ExamplePanel example={example} />
      </section>

      <section className="space-y-4">
        <h2 className={H2}>How do I turn the template into a GitHub issue form?</h2>
        <p>
          For a public repository, the same sections as a YAML issue form in{' '}
          <code className={CODE}>.github/ISSUE_TEMPLATE/bug_report.yml</code>. Required fields stop
          reporters from skipping the steps or the version; the free-text fields keep the markdown
          habits (numbered steps, fenced error text) intact.
        </p>
        <CodeBlock>{ISSUE_FORM}</CodeBlock>
        <p>
          GitLab and Gitea use markdown description templates instead (
          <code className={CODE}>.gitlab/issue_templates/Bug.md</code>,{' '}
          <code className={CODE}>.gitea/ISSUE_TEMPLATE/bug.md</code>) — paste the markdown template
          above into those files as-is.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>How do I share a bug report with someone who has no tracker access?</h2>
        <p>
          A customer, a vendor, a contractor, a release thread in Slack: paste the markdown on the{' '}
          <Link href="/" className={LINK}>
            Docs MD editor
          </Link>{' '}
          and share the link. From Claude Code or Cursor with the{' '}
          <Link href="/ai-powered-ide" className={LINK}>
            MCP server
          </Link>{' '}
          connected:
        </p>
        <CodeBlock>{`Write a bug report for the failing checkout test using the nine-section
template (build, steps, expected, actual, evidence, scope, workaround), then
share it with a 7-day expiry and give me the reading link.`}</CodeBlock>
        <p>From a shell or CI:</p>
        <CodeBlock>{`curl -s -X POST https://docs-md.com/api/share \\
  -H "Content-Type: application/json" \\
  --data-binary @<(jq -Rs '{content: ., filename: "bug-report.md", expiry: "7d"}' bug-report.md) \\
  | jq -r '.url'`}</CodeBlock>
        <p>
          The reader opens a rendered page with headings and a sidebar table of contents. The{' '}
          <code className={CODE}>/raw/&lt;id&gt;</code> URL returns the markdown itself for pasting
          into a ticket or feeding to an assistant.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>What should stay out of a bug report?</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Several bugs in one report. One report, one bug, one title.</li>
          <li>Guesses written as facts. Put leads under &quot;Suspected cause&quot; and say why.</li>
          <li>Screenshots without the step they belong to.</li>
          <li>
            Secrets and personal data: session cookies, API keys, customer names. Strip cookies from
            HAR files. A shared link is public to anyone who has it.
          </li>
        </ul>
        <p>
          See also:{' '}
          <Link href="/agent-handoff-document" className={LINK}>
            agent handoff document
          </Link>
          ,{' '}
          <Link href="/share-implementation-plan" className={LINK}>
            share an implementation plan
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
