import Link from 'next/link';
import ChangelogGenerator from '@/components/tools/ChangelogGenerator';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('changelog-generator');

export default function ChangelogGeneratorPage() {
  return (
    <ToolPage
      slug="changelog-generator"
      intro="Write release notes in a form — version, date, and what was Added, Changed, Fixed — and get a CHANGELOG.md in the Keep a Changelog format with compare links. Or paste your git log and let conventional commits sort themselves into sections."
      tool={<ChangelogGenerator />}
      faq={[
        {
          q: 'What is the Keep a Changelog format?',
          a: 'A convention for human-readable changelogs: a CHANGELOG.md with one ## [version] - YYYY-MM-DD heading per release, newest first, and bullets grouped under Added, Changed, Deprecated, Removed, Fixed, and Security. An [Unreleased] section at the top collects changes for the next version.',
        },
        {
          q: 'How do I generate a changelog from git commits?',
          a: 'Run git log --oneline <last-tag>..HEAD, paste the output into the "From git log" tab, and the tool groups Conventional Commits by type: feat becomes Added, fix becomes Fixed, perf and refactor become Changed, revert becomes Removed. Commits marked with ! or BREAKING CHANGE get a BREAKING label.',
        },
        {
          q: 'What are the compare links at the bottom of a changelog?',
          a: 'Reference-style links that turn each version heading into a link to the diff between that version and the previous one, such as https://github.com/owner/repo/compare/v1.0.0...v1.1.0. The first release links to its tag instead. Enter your repository URL and they are generated for you.',
        },
        {
          q: 'Should I use Semantic Versioning in the changelog?',
          a: 'Keep a Changelog recommends it: MAJOR for breaking changes, MINOR for new features, PATCH for fixes. The tool validates versions against the SemVer pattern, including pre-release suffixes like 2.0.0-beta.1.',
        },
        {
          q: 'Is my changelog uploaded anywhere?',
          a: 'No. Everything is generated in your browser. Only clicking "Share as link" publishes the markdown, to a URL with an edit token that expires after 30 days.',
        },
      ]}
    >
      <section className="space-y-3">
        <h2 className={H2}>What goes in each changelog section?</h2>
        <p>
          <strong>Added</strong> for new features, <strong>Changed</strong> for changes to existing
          behavior, <strong>Deprecated</strong> for features that will be removed, <strong>Removed</strong>{' '}
          for features that are gone, <strong>Fixed</strong> for bugs, and <strong>Security</strong> for
          vulnerabilities. Write for the person upgrading, not the person who wrote the code:
          &ldquo;Config files can now be YAML&rdquo; rather than &ldquo;refactor config loader&rdquo;.
          One bullet per change, present tense, with a PR or issue number in parentheses when
          there is one to link to.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>How do conventional commits map to changelog sections?</h2>
        <p>
          Conventional Commits prefix every message with a type — <code className={CODE}>feat:</code>,{' '}
          <code className={CODE}>fix:</code>, <code className={CODE}>perf:</code>,{' '}
          <code className={CODE}>refactor:</code>, <code className={CODE}>docs:</code>,{' '}
          <code className={CODE}>chore:</code> — with an optional scope in parentheses and a{' '}
          <code className={CODE}>!</code> for breaking changes. That structure is enough to draft a
          changelog automatically: features become Added, fixes become Fixed, performance and
          refactoring become Changed. Housekeeping types like <code className={CODE}>chore</code>,{' '}
          <code className={CODE}>ci</code>, and <code className={CODE}>test</code> are excluded by default
          because users of your project do not care about them; toggle them on if your team
          does. Scopes are kept as a bold prefix so <code className={CODE}>feat(cli): add --json</code>{' '}
          becomes <strong>cli:</strong> Add --json.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>Where does the changelog live?</h2>
        <p>
          At the repository root as <code className={CODE}>CHANGELOG.md</code>, next to the README —
          link to it from the README&apos;s install or contributing section so people can find it.
          The{' '}
          <Link href="/readme-generator" className="text-indigo-700 underline">
            README generator
          </Link>{' '}
          and{' '}
          <Link href="/readme-templates" className="text-indigo-700 underline">
            README templates
          </Link>{' '}
          cover the rest of the project&apos;s front door; the{' '}
          <Link href="/markdown-badge-generator" className="text-indigo-700 underline">
            badge generator
          </Link>{' '}
          adds a version badge that always shows the latest release.
        </p>
      </section>
    </ToolPage>
  );
}
