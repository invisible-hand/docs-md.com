import Link from 'next/link';
import LinkChecker from '@/components/tools/LinkChecker';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('markdown-link-checker');

const FAQ = [
  {
    q: 'What is sent to the server when I check links?',
    a: 'Only the list of external http(s) URLs. Parsing, anchor verification, duplicate detection, and reference checks all run in your browser; the markdown text itself never leaves your machine. The server fetches each URL once (HEAD, then GET if needed) and returns the status code.',
  },
  {
    q: 'Why does a link that works in my browser show 403 or an error here?',
    a: 'Some sites (Cloudflare-protected pages, LinkedIn, some publishers) block automated requests or answer HEAD requests with 403 or 405. The checker retries with GET, but a site that refuses non-browser traffic will still report an error. Treat a 403 on a page you know is public as "blocked by the site", not as a dead link.',
  },
  {
    q: 'How are #anchor links verified?',
    a: 'The checker builds the same heading slugs GitHub does (via github-slugger): lowercase, spaces to hyphens, punctuation dropped, and -1, -2 suffixes on duplicates. A link like #getting-started passes when a heading produces that slug, or when an explicit HTML id or name attribute defines it.',
  },
  {
    q: 'Why are relative links like ./docs/setup.md not checked?',
    a: 'The tool only sees the one document you pasted, so it cannot know whether a sibling file exists in your repository. Relative links are listed with their line numbers so you can verify them where the files live; anchors within the same document are checked.',
  },
  {
    q: 'Does a redirect count as broken?',
    a: 'No. A 301 or 302 is shown in amber with the final URL so you can decide whether to update the link. Permanent redirects are worth fixing in a README because each hop adds latency and some renderers refuse to follow them.',
  },
  {
    q: 'Is there a limit on how many links I can check?',
    a: 'Up to 100 unique external URLs per run, checked in batches of 25 with an 8-second timeout each, and 20 runs per 10 minutes per IP address. That covers a long README comfortably.',
  },
];

export default function MarkdownLinkCheckerPage() {
  return (
    <ToolPage
      slug="markdown-link-checker"
      intro={
        <>
          Paste a README or any markdown document and get every link listed with its line number
          — then check the external ones for dead pages and redirects, catch{' '}
          <code className={CODE}>#anchors</code> that no heading produces, and spot duplicate or
          undefined reference links before you publish.
        </>
      }
      tool={<LinkChecker />}
      faq={FAQ}
      related={['markdown-toc-generator', 'markdown-link-generator', 'markdown-lint', 'readme-generator', 'markdown-formatter']}
    >
      <section className="space-y-3">
        <h2 className={H2}>Which kinds of links does the checker find?</h2>
        <p>
          All six ways a URL can appear in markdown: inline links{' '}
          <code className={CODE}>[text](url)</code>, images <code className={CODE}>![alt](src)</code>,
          reference-style links <code className={CODE}>[text][id]</code> together with their{' '}
          <code className={CODE}>[id]: url</code> definitions, autolinks in angle brackets, bare URLs
          that GitHub turns into links automatically, and HTML <code className={CODE}>&lt;a href&gt;</code>{' '}
          or <code className={CODE}>&lt;img src&gt;</code> tags. Anything inside a fenced code block or
          inline backticks is ignored, since it is not rendered as a link.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className={H2}>What does each result mean?</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>2xx, green</strong> — the page answered. <strong>3xx, amber</strong> — it
            redirects; the final address is shown so you can update the link.
          </li>
          <li>
            <strong>4xx / 5xx, red</strong> — the page is missing, forbidden, or the server failed.
            404 is a genuinely dead link; 403 often means the site blocks link checkers (see the FAQ).
          </li>
          <li>
            <strong>Anchor missing</strong> — a <code className={CODE}>#slug</code> link that no heading
            in the document produces. The{' '}
            <Link href="/markdown-toc-generator" className="text-indigo-700 underline">
              table of contents generator
            </Link>{' '}
            builds correct anchors from your headings.
          </li>
          <li>
            <strong>Undefined reference</strong> — <code className={CODE}>[text][id]</code> with no{' '}
            <code className={CODE}>[id]: url</code> line, which renders as literal brackets. The{' '}
            <Link href="/markdown-link-generator" className="text-indigo-700 underline">
              link generator
            </Link>{' '}
            writes reference links with matching definitions.
          </li>
          <li>
            <strong>Duplicate</strong> — the same URL appears more than once; fine in prose, but in
            a link list it usually means a copy-paste slip.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className={H2}>How do I keep links from breaking in the first place?</h2>
        <p>
          Prefer permanent URLs (release pages, tagged docs) over “latest” links, link to headings
          by their generated slug rather than a guessed one, and keep reference definitions at the
          bottom of the file where they are easy to audit. Run the check again after editing:
          every problem row is clickable and selects the offending line in the editor. For a
          repository, add a link checker to CI as well — this page is for the quick pass before you
          commit.
        </p>
      </section>
    </ToolPage>
  );
}
