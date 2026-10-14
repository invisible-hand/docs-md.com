import Link from 'next/link';
import GithubRepoForm from '@/components/tools/GithubRepoForm';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('github-readme-viewer');

export default function GithubReadmeViewerPage() {
  return (
    <ToolPage
      slug="github-readme-viewer"
      width="narrow"
      intro="Read a GitHub repository's README and docs folder as a site instead of as files: paste the repo URL below and the viewer renders the README, lists every markdown file at the root and in docs/, and rewrites the relative links and images so you can click through. Nothing to clone, nothing to install, no account."
      tool={<GithubRepoForm />}
      faq={[
        {
          q: 'How do I view a GitHub README without cloning the repo?',
          a: 'Paste the repository URL or owner/repo into the box above. The viewer fetches the README from GitHub and renders it with tables, code highlighting, task lists and mermaid diagrams, with a sidebar listing the other markdown files in the repo.',
        },
        {
          q: 'Does it work for private repositories?',
          a: 'No. The viewer reads public repositories only, through the public GitHub API and raw file host. Nothing is sent from your account, and no token is required from you.',
        },
        {
          q: 'Why do relative links work here when they break in other viewers?',
          a: 'Markdown in a repo links to sibling files like docs/setup.md or ../CONTRIBUTING.md. The viewer resolves those against the file\'s folder: links to other markdown files open as pages on this site, and links to code or images go to the file on GitHub\'s raw host.',
        },
        {
          q: 'Can I link someone straight to a file or folder?',
          a: 'Yes. Every page has a stable address: docs-md.com/gh/owner/repo for the README, /gh/owner/repo/docs for a folder, /gh/owner/repo/docs/setup.md for a file. Add ?ref=branch to read a branch other than the default one.',
        },
        {
          q: 'Why does a repo sometimes show a rate-limit message?',
          a: 'GitHub allows a limited number of anonymous API requests per hour. Rendered pages are cached for an hour, so a popular repo rarely hits the limit, but a burst of new repositories can. Wait a few minutes or open the file on GitHub.',
        },
        {
          q: 'Is the content indexed by search engines?',
          a: 'No. Rendered repository pages carry a noindex tag and a canonical to themselves; the content belongs to its authors on GitHub. Only this tool page is indexed.',
        },
      ]}
    >
      <section className="space-y-3">
        <h2 className={H2}>What does the viewer show?</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>The README</strong>, rendered: GitHub-flavoured markdown with tables, task lists,
            footnotes, highlighted code blocks and <code className={CODE}>mermaid</code> diagrams.
          </li>
          <li>
            <strong>A sidebar</strong> with every markdown file at the repository root (CONTRIBUTING,
            CHANGELOG, SECURITY…) and one level of the <code className={CODE}>docs/</code> folder.
          </li>
          <li>
            <strong>Working links</strong>: relative links to other markdown files open as pages
            here; images and code links resolve to GitHub&apos;s raw file host.
          </li>
          <li>
            <strong>An outline</strong> of the document&apos;s headings, and the star count, branch and
            a link back to the file on GitHub.
          </li>
        </ul>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>When is this better than reading on GitHub?</h2>
        <p>
          GitHub renders one file at a time, in a narrow column, with the repository chrome around
          it. For documentation that spans a README and a <code className={CODE}>docs/</code>{' '}
          folder, a sidebar and a wider reading column make the difference between skimming and
          reading. It is also the quickest way to read a project&apos;s docs on a phone, and to send
          a colleague a link that opens on the exact page.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>What about a single file or your own markdown?</h2>
        <p>
          For one file from anywhere, including a gist or a raw URL, use the{' '}
          <Link href="/markdown-viewer" className="text-indigo-700 underline">
            markdown viewer
          </Link>
          , which also opens local files and prints to PDF. To publish your own markdown as a link,
          use the <Link href="/" className="text-indigo-700 underline">share tool</Link>.
        </p>
      </section>
    </ToolPage>
  );
}
