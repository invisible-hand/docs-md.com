import Link from 'next/link';
import WalkthroughPage, { CODE, CodeBlock, H2, LINK } from '@/components/WalkthroughPage';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-09-06';

export const metadata = pageMetadata({
  title: 'Share Markdown Without an Account: Free Options Compared',
  description:
    'Paste markdown, get a rendered link, no signup: Docs MD, yeet.md, JotBird, Rentry, HackMD and more compared on link lifetime, editing, Mermaid, and API.',
  path: '/share-markdown-without-account',
  type: 'article',
  kicker: 'Comparison',
});

interface Row {
  name: string;
  account: string;
  lifetime: string;
  edit: string;
  mermaid: string;
  api: string;
  note: string;
}

// Checked against each service's own site or documentation on 2026-09-06.
// Re-verify before editing a row — these products change their free tiers.
const ROWS: Row[] = [
  {
    name: 'Docs MD',
    account: 'None',
    lifetime: '1 day, 7 days, 30 days, or never',
    edit: 'Update and delete in place with an edit token',
    mermaid: 'Yes',
    api: 'REST API + MCP server, raw markdown endpoint',
    note: 'This site. 120,000 characters per share.',
  },
  {
    name: 'yeet.md',
    account: 'None',
    lifetime: 'Indefinite until deleted',
    edit: 'Anonymous pages are immutable snapshots; republish and delete the old one',
    mermaid: 'Yes',
    api: 'Not documented',
    note: 'Open source; 500 KB limit; KaTeX and callouts.',
  },
  {
    name: 'JotBird',
    account: 'None for anonymous pages',
    lifetime: '30 days anonymously; longer with an account, permanent on a paid plan',
    edit: 'Update and delete from the same browser',
    mermaid: 'Yes',
    api: 'API and MCP with an account key',
    note: 'Polished document look; hosted images.',
  },
  {
    name: 'Rentry',
    account: 'None',
    lifetime: 'Permanent',
    edit: 'Edit and delete with an edit code; custom URLs',
    mermaid: 'Not listed',
    api: 'Minimal',
    note: 'Markdown pastebin with its own extensions (colors, spoilers).',
  },
  {
    name: 'HackMD',
    account: 'Guest notes possible; account for a persistent workspace',
    lifetime: 'Tied to the account',
    edit: 'Real-time collaborative editing',
    mermaid: 'Yes',
    api: 'API with an account',
    note: 'A collaborative editor rather than a paste-and-share tool.',
  },
  {
    name: 'HedgeDoc',
    account: 'Self-hosted; anonymous notes if the instance allows',
    lifetime: 'Your server, your rules',
    edit: 'Real-time collaborative editing, revisions',
    mermaid: 'Yes',
    api: 'Yes, on your instance',
    note: 'Open source, formerly CodiMD. The public demo is for trying it.',
  },
  {
    name: 'dochost',
    account: 'None',
    lifetime: 'Free tier: a few days (longer if the page is public)',
    edit: 'Limited',
    mermaid: 'Yes',
    api: 'MCP with OAuth',
    note: 'Also hosts raw HTML; 1 MB free limit.',
  },
  {
    name: 'boomurl',
    account: 'No password, but an email verification code',
    lifetime: 'No expiry advertised',
    edit: 'Updates supported',
    mermaid: 'GitHub-flavored rendering',
    api: 'Not documented',
    note: 'Uploads .md files to a subdomain of its own; shows a hosting banner.',
  },
];

const FAQ = [
  {
    q: 'What is the best free way to share a markdown file as a rendered webpage without an account?',
    a: 'Paste it into a service that publishes without signup and returns a link: Docs MD, yeet.md, JotBird, and Rentry all do. Pick by what you need afterwards — Docs MD if you want to choose an expiry and update the page in place, yeet.md for a permanent immutable snapshot, Rentry for a custom URL, JotBird for a designed look.',
  },
  {
    q: 'Can I edit a shared markdown page later without an account?',
    a: 'On Docs MD, yes: creating a share returns an edit token, and PATCH /api/share/:id (or the update_share MCP tool) replaces the content at the same URL. Rentry uses an edit code the same way. yeet.md snapshots cannot be edited; you publish a new one.',
  },
  {
    q: 'Are shared markdown pages private?',
    a: 'No, on any of these services. A share is a public URL, and unlisted is not the same as private: anyone who gets the link can read it. The edit token or code only controls who can change the page. Do not share credentials or unreleased data this way.',
  },
  {
    q: 'What does an expiring link actually do?',
    a: 'It deletes the page at that URL after the chosen time — on Docs MD the document and its stored file are removed and the address returns 404. It cannot recall copies that readers downloaded, printed, or cached. Expiring shares on Docs MD also carry a noindex directive that asks search engines not to list them.',
  },
  {
    q: 'Is there a Rentry alternative with expiring links and an API?',
    a: 'Docs MD: paste, pick 1, 7, or 30 days or never, get the link, and update or delete it with the edit token — from the browser, from curl, or from Cursor and Claude Code through MCP. It renders Mermaid diagrams and GitHub-flavored tables, which Rentry does not advertise.',
  },
];

export default function ShareMarkdownWithoutAccountPage() {
  return (
    <WalkthroughPage
      slug="share-markdown-without-account"
      title="Share markdown without an account: free options compared"
      description="Eight services that turn pasted markdown into a rendered link with no signup, compared on the things that matter once the link is out: how long it lives, whether you can edit it, whether diagrams render, and whether a script or an AI assistant can do it for you."
      updated={UPDATED}
      faq={FAQ}
    >
      <section className="space-y-4">
        <h2 className={H2}>Which free services share markdown as a rendered page with no signup?</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-3 py-2">Service</th>
                <th className="px-3 py-2">Account</th>
                <th className="px-3 py-2">Link lifetime</th>
                <th className="px-3 py-2">Editing</th>
                <th className="px-3 py-2">Mermaid</th>
                <th className="px-3 py-2">API / automation</th>
                <th className="px-3 py-2">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ROWS.map((r) => (
                <tr key={r.name} className={r.name === 'Docs MD' ? 'bg-indigo-50/40' : ''}>
                  <td className="px-3 py-2 font-medium text-gray-900">{r.name}</td>
                  <td className="px-3 py-2">{r.account}</td>
                  <td className="px-3 py-2">{r.lifetime}</td>
                  <td className="px-3 py-2">{r.edit}</td>
                  <td className="px-3 py-2">{r.mermaid}</td>
                  <td className="px-3 py-2">{r.api}</td>
                  <td className="px-3 py-2 text-gray-600">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600">
          Checked on {UPDATED} against each service&apos;s own site. Free tiers change; confirm on
          the service before relying on a limit.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>How do I share markdown with no account on Docs MD?</h2>
        <ol className="list-decimal space-y-2 pl-6">
          <li>
            Paste the markdown into the{' '}
            <Link href="/" className={LINK}>
              editor on the homepage
            </Link>
            ; the preview on the right shows exactly what the page will look like.
          </li>
          <li>Choose an expiry: 1 day, 7 days, 30 days (default), or never.</li>
          <li>
            Click <strong>Share Markdown</strong>. You get a link such as{' '}
            <code className={CODE}>https://docs-md.com/quiet-harbor-7k2pd</code>, a raw-markdown link,
            and an edit token.
          </li>
        </ol>
        <p>The same from a terminal, no key required:</p>
        <CodeBlock>{`curl -s -X POST https://docs-md.com/api/share \\
  -H "Content-Type: application/json" \\
  -d '{"content":"# Hello\\n\\nRendered, shareable, no signup.","expiry":"7d"}' | jq .url`}</CodeBlock>
        <p>
          And from Cursor or Claude Code, after adding the{' '}
          <Link href="/ai-powered-ide" className={LINK}>
            MCP server
          </Link>
          : <em>&quot;Share this file as markdown with a 7-day expiry.&quot;</em>
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>Docs MD vs Rentry: which one for a markdown paste?</h2>
        <p>
          Rentry is the classic markdown pastebin: permanent pages, custom URLs, an edit code, and
          its own formatting extensions. Docs MD is for documents with a lifespan and a workflow
          around them — an expiry you choose, in-place updates through an API, Mermaid diagrams and
          GitHub-flavored tables, and publishing from an AI coding assistant. If you want a page that
          lives forever at a name you picked, Rentry. If you want a document that expires when the
          review is over and can be updated by a script, Docs MD.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>Docs MD vs yeet.md: snapshot or living document?</h2>
        <p>
          yeet.md publishes immutable snapshots that live until you delete them — a good fit for
          something you will never touch again. Docs MD shares are mutable: the edit token lets you
          replace the content at the same URL, and the expiry (or <em>never</em>) is your choice.
          Both need no account and both render Mermaid.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>Docs MD vs HackMD and HedgeDoc: sharing or collaborating?</h2>
        <p>
          HackMD and HedgeDoc are collaborative editors: several people typing in one note in real
          time, with revisions and permissions. That is a different job. If the document is finished
          and you want a link that renders it — no editing session, no workspace to join — a
          paste-and-share tool is lighter. If people need to edit together, use one of the editors and
          share its link instead.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>What to check before you pick one</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Lifetime.</strong> Anonymous pages on some services expire in days; make sure the
            default matches how long the reader needs it.
          </li>
          <li>
            <strong>Editing.</strong> If you will revise the document, you want an edit token or code,
            not a new URL every time.
          </li>
          <li>
            <strong>Rendering.</strong> Tables, task lists, code highlighting, and Mermaid are not
            universal. Paste a sample and look.
          </li>
          <li>
            <strong>Automation.</strong> A REST endpoint or MCP server means a script or your coding
            assistant can publish for you; see{' '}
            <Link href="/share-implementation-plan" className={LINK}>
              sharing an implementation plan
            </Link>{' '}
            for a worked example.
          </li>
          <li>
            <strong>Privacy.</strong> None of these are private. Treat every link as public.
          </li>
        </ul>
      </section>
    </WalkthroughPage>
  );
}
