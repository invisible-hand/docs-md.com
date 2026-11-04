import Link from 'next/link';
import BadgeGenerator from '@/components/tools/BadgeGenerator';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('markdown-badge-generator');

export default function BadgeGeneratorPage() {
  return (
    <ToolPage
      slug="markdown-badge-generator"
      intro="Design a shields.io badge with a live preview and copy it as markdown, HTML, or reStructuredText — or type a repo and package name and pick from a curated set of live badges for version, downloads, license, CI, coverage, and stars."
      tool={<BadgeGenerator />}
      faq={[
        {
          q: 'How do I add a badge to a README?',
          a: 'Paste the markdown output under your title: ![alt](https://img.shields.io/…). Wrap it in a link, [![alt](img-url)](target-url), to make the badge clickable. GitHub renders the SVG inline.',
        },
        {
          q: 'What is the difference between a static and a dynamic badge?',
          a: 'A static badge shows fixed text you typed, encoded into the URL. A dynamic badge queries a service (npm, GitHub, PyPI, Codecov) each time it is loaded, so the version or star count is always current.',
        },
        {
          q: 'Why does my badge text show dashes or underscores wrong?',
          a: 'In static badge URLs a single dash separates label, message, and color, so a literal dash must be written as a double dash (--) and a literal underscore as a double underscore (__). This tool escapes both for you.',
        },
        {
          q: 'Which logos can I use?',
          a: 'Any icon in the simple-icons set, by its slug: github, npm, python, docker, rust, typescript, and about 3,000 more. Add logoColor to recolor it, for example white on a dark label.',
        },
        {
          q: 'Do badges slow down my README?',
          a: 'Each badge is one small SVG request served by shields.io with caching, and GitHub proxies images through its camo service. A row of five badges is normal; more than six or seven becomes visual noise rather than a performance problem.',
        },
      ]}
    >
      <section className="space-y-3">
        <h2 className={H2}>How does a shields.io badge URL work?</h2>
        <p>
          A static badge is just a URL:{' '}
          <code className={CODE}>https://img.shields.io/badge/label-message-color</code>. The three
          parts are separated by dashes, which is why a real dash inside the text must be doubled
          (<code className={CODE}>--</code>) and an underscore doubled (<code className={CODE}>__</code>).
          Spaces are percent-encoded. Options go in the query string:{' '}
          <code className={CODE}>?style=flat-square&amp;logo=github&amp;logoColor=white</code>. Colors can
          be shields names (<code className={CODE}>brightgreen</code>, <code className={CODE}>blue</code>,{' '}
          <code className={CODE}>critical</code>), hex without the hash, or CSS names. Dynamic badges use
          a path per service instead — <code className={CODE}>/npm/v/package</code>,{' '}
          <code className={CODE}>/github/stars/owner/repo</code>,{' '}
          <code className={CODE}>/github/actions/workflow/status/owner/repo/ci.yml</code> — and shields
          fetches the live value.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>Which badges belong in a README?</h2>
        <p>
          The useful ones answer a question a visitor has before adopting the project: is it
          maintained (last commit, CI status), can I trust it (coverage, license), how popular is
          it (stars, downloads), and which version am I getting (npm, PyPI). Put them on one line
          directly under the title, order them by importance, and skip badges that state the
          obvious. The{' '}
          <Link href="/readme-generator" className="text-indigo-700 underline">
            README generator
          </Link>{' '}
          adds a sensible default row automatically; the{' '}
          <Link href="/readme-templates" className="text-indigo-700 underline">
            README templates
          </Link>{' '}
          show where the row sits in a well-structured file.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>Can I use these badges outside GitHub?</h2>
        <p>
          Yes. The HTML output works on any web page or in a GitLab README; the reStructuredText
          output is for Python projects whose README is <code className={CODE}>.rst</code> and for
          Sphinx docs. The raw URL can be dropped into a{' '}
          <Link href="/guides/markdown-image" className="text-indigo-700 underline">
            markdown image
          </Link>{' '}
          anywhere markdown is rendered, including Docs MD share pages.
        </p>
      </section>
    </ToolPage>
  );
}
