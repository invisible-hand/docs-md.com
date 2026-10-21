import Link from 'next/link';
import type { ReactNode } from 'react';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import CheatSheet, { SectionNav } from '@/components/CheatSheet';
import { SECTIONS } from '@/lib/platform-sheets/github-flavored-markdown';
import UpdatedLine from '@/components/UpdatedLine';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-10-15';
const PATH = '/github-flavored-markdown';

export const metadata = pageMetadata({
  title: 'GitHub Flavored Markdown (GFM) Cheat Sheet',
  description:
    'Every GFM element with syntax and rendered result: tables, task lists, alerts, footnotes, math, mermaid, emoji, @mentions, #refs. GFM vs CommonMark table.',
  path: PATH,
  type: 'article',
  kicker: 'Reference',
});

const SOURCES = [
  { href: 'https://github.github.com/gfm/', label: 'GFM spec (0.29-gfm)' },
  {
    href: 'https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax',
    label: 'GitHub docs: Basic writing and formatting syntax',
  },
  {
    href: 'https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams',
    label: 'GitHub docs: Creating diagrams',
  },
  {
    href: 'https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/writing-mathematical-expressions',
    label: 'GitHub docs: Writing mathematical expressions',
  },
  {
    href: 'https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/autolinked-references-and-urls',
    label: 'GitHub docs: Autolinked references and URLs',
  },
];

/** GFM vs CommonMark vs GitHub.com. "Spec" = in the GFM spec; "GitHub" = github.com rendering only. */
const MATRIX: Array<{ feature: string; syntax: string; commonmark: string; gfmSpec: string; github: string }> = [
  { feature: 'Tables', syntax: '| a | b |\n| --- | --- |', commonmark: '—', gfmSpec: 'Yes (extension)', github: 'Yes' },
  { feature: 'Task lists', syntax: '- [ ] todo / - [x] done', commonmark: '—', gfmSpec: 'Yes (extension)', github: 'Yes, clickable in issues' },
  { feature: 'Strikethrough', syntax: '~~text~~ or ~text~', commonmark: '—', gfmSpec: 'Yes (1 or 2 tildes)', github: 'Yes' },
  { feature: 'Autolinks (bare URLs)', syntax: 'https://… or www.…', commonmark: 'Only <https://…>', gfmSpec: 'Yes (extension)', github: 'Yes' },
  { feature: 'Disallowed raw HTML', syntax: '<script>, <style>, <iframe>…', commonmark: 'Passed through', gfmSpec: 'Filtered (tagfilter)', github: 'Filtered' },
  { feature: 'Footnotes', syntax: 'text[^1] … [^1]: note', commonmark: '—', gfmSpec: 'Not in spec', github: 'Yes (not in wikis)' },
  { feature: 'Alerts', syntax: '> [!NOTE]', commonmark: '—', gfmSpec: 'Not in spec', github: 'Yes, 5 types' },
  { feature: 'Math', syntax: '$x^2$, $$…$$, ```math', commonmark: '—', gfmSpec: 'Not in spec', github: 'Yes (MathJax)' },
  { feature: 'Mermaid diagrams', syntax: '```mermaid', commonmark: '—', gfmSpec: 'Not in spec', github: 'Yes (+ geojson, topojson, stl)' },
  { feature: 'Emoji shortcodes', syntax: ':tada:', commonmark: '—', gfmSpec: 'Not in spec', github: 'Yes' },
  { feature: '@mentions', syntax: '@user, @org/team', commonmark: '—', gfmSpec: 'Not in spec', github: 'Yes (notifies)' },
  { feature: 'Issue / PR references', syntax: '#26, GH-26, owner/repo#26', commonmark: '—', gfmSpec: 'Not in spec', github: 'Yes (not in wikis or files)' },
  { feature: 'Commit SHA links', syntax: 'a5c3785…, owner/repo@sha', commonmark: '—', gfmSpec: 'Not in spec', github: 'Yes' },
  { feature: 'Collapsible sections', syntax: '<details><summary>', commonmark: 'Raw HTML', gfmSpec: 'Raw HTML', github: 'Yes, styled' },
  { feature: 'Color chips', syntax: '`#0969DA`', commonmark: 'Inline code', gfmSpec: 'Inline code', github: 'Issues, PRs, discussions only' },
  { feature: 'Heading anchors', syntax: '[Jump](#my-heading)', commonmark: 'No ids generated', gfmSpec: 'No ids generated', github: 'Auto-generated slugs' },
  { feature: 'Underline', syntax: '<ins>text</ins>', commonmark: 'Raw HTML', gfmSpec: 'Raw HTML', github: 'Yes' },
  { feature: 'Sub / superscript', syntax: '<sub>2</sub> <sup>2</sup>', commonmark: 'Raw HTML', gfmSpec: 'Raw HTML', github: 'Yes' },
];

const ALERTS: Array<{ type: string; purpose: string; color: string }> = [
  { type: '[!NOTE]', purpose: 'Useful information that users should know, even when skimming content.', color: 'Blue, info icon' },
  { type: '[!TIP]', purpose: 'Helpful advice for doing things better or more easily.', color: 'Green, lightbulb icon' },
  { type: '[!IMPORTANT]', purpose: 'Key information users need to know to achieve their goal.', color: 'Purple, report icon' },
  { type: '[!WARNING]', purpose: 'Urgent info that needs immediate user attention to avoid problems.', color: 'Yellow, alert icon' },
  { type: '[!CAUTION]', purpose: 'Advises about risks or negative outcomes of certain actions.', color: 'Red, stop icon' },
];

/** Fence identifiers that GitHub highlights (Linguist). Aliases per the Linguist languages list. */
const LANGS: Array<{ tag: string; aliases: string; language: string }> = [
  { tag: 'js', aliases: 'javascript, node', language: 'JavaScript' },
  { tag: 'ts', aliases: 'typescript', language: 'TypeScript' },
  { tag: 'jsx', aliases: '', language: 'JSX' },
  { tag: 'tsx', aliases: '', language: 'TSX' },
  { tag: 'python', aliases: 'py, python3', language: 'Python' },
  { tag: 'java', aliases: '', language: 'Java' },
  { tag: 'c', aliases: '', language: 'C' },
  { tag: 'cpp', aliases: 'c++', language: 'C++' },
  { tag: 'csharp', aliases: 'cs, c#', language: 'C#' },
  { tag: 'go', aliases: 'golang', language: 'Go' },
  { tag: 'rust', aliases: 'rs', language: 'Rust' },
  { tag: 'ruby', aliases: 'rb', language: 'Ruby' },
  { tag: 'php', aliases: '', language: 'PHP' },
  { tag: 'swift', aliases: '', language: 'Swift' },
  { tag: 'kotlin', aliases: 'kt', language: 'Kotlin' },
  { tag: 'bash', aliases: 'sh, shell, zsh', language: 'Shell' },
  { tag: 'powershell', aliases: 'ps1, pwsh', language: 'PowerShell' },
  { tag: 'sql', aliases: '', language: 'SQL' },
  { tag: 'html', aliases: 'xhtml', language: 'HTML' },
  { tag: 'css', aliases: '', language: 'CSS' },
  { tag: 'json', aliases: 'jsonc, json5', language: 'JSON' },
  { tag: 'yaml', aliases: 'yml', language: 'YAML' },
  { tag: 'toml', aliases: '', language: 'TOML' },
  { tag: 'markdown', aliases: 'md', language: 'Markdown' },
  { tag: 'diff', aliases: 'patch', language: 'Diff (adds +/− colouring)' },
  { tag: 'mermaid', aliases: '', language: 'Rendered as a diagram, not highlighted' },
  { tag: 'math', aliases: '', language: 'Rendered as LaTeX, not highlighted' },
];


const FAQ: Array<{ q: string; a: string; href?: { path: string; label: string } }> = [
  {
    q: 'What is GitHub Flavored Markdown?',
    a: 'GitHub Flavored Markdown (GFM) is the dialect of markdown GitHub uses for READMEs, issues, pull requests, discussions and wikis. The GFM spec (version 0.29-gfm) is a strict superset of CommonMark that adds five extensions: tables, task list items, strikethrough, extended autolinks and a filter for disallowed raw HTML. On top of the spec, github.com renders footnotes, alerts, math, mermaid, emoji shortcodes, @mentions and issue references.',
  },
  {
    q: 'What is the difference between GFM and CommonMark?',
    a: 'CommonMark is the base specification: headings, emphasis, lists, links, images, code, blockquotes and raw HTML. GFM adds tables, task lists, strikethrough, bare-URL autolinks and the tagfilter that neutralises <script>, <style>, <iframe> and similar tags. Everything valid in CommonMark renders identically in GFM.',
    href: { path: '/markdown-flavors', label: 'Full flavor comparison' },
  },
  {
    q: 'Does GFM support footnotes?',
    a: 'GitHub.com renders footnotes (text[^1] with a [^1]: definition), but they are not part of the GFM spec, and they do not work in GitHub wikis. Other renderers that claim GFM support (remark-gfm, GitLab, many static site generators) usually include them, but check before relying on it.',
  },
  {
    q: 'How do I write an alert or callout in GitHub markdown?',
    a: 'Start a blockquote with one of [!NOTE], [!TIP], [!IMPORTANT], [!WARNING] or [!CAUTION] on its own line, then continue the quote with the message. GitHub renders a coloured box with an icon. The docs recommend one or two per article, never consecutive, and alerts cannot be nested inside lists or other elements.',
    href: { path: '/guides/markdown-quote', label: 'Blockquote and callout guide' },
  },
  {
    q: 'Can I write LaTeX math in a GitHub README?',
    a: 'Yes. Inline math goes between single dollar signs ($x^2$) or $`…`$ when the expression contains markdown characters; block math goes between $$ delimiters on their own lines or in a ```math fence. GitHub uses MathJax and renders it in .md files, issues, PRs, discussions and wikis.',
  },
  {
    q: 'Which diagrams render on GitHub?',
    a: 'Mermaid (```mermaid), GeoJSON and TopoJSON maps (```geojson, ```topojson) and ASCII STL 3D models (```stl), in the same places as math: issues, discussions, PRs, wikis and markdown files. PlantUML, Graphviz and D2 do not render natively.',
  },
  {
    q: 'Why does my markdown look different on GitHub than in my editor?',
    a: 'Usually one of four things: alerts and emoji shortcodes are github.com features that editors show as literal text; GitHub inserts a line break for every newline in issues and PRs but not in .md files; GitHub strips <script>, <style> and <iframe>; and heading anchors follow GitHub\'s own slug rules, so a table of contents built for another tool can point at the wrong ids.',
  },
];

function Th({ children }: { children: ReactNode }) {
  return <th className="py-2 pr-4 text-left font-semibold text-gray-950">{children}</th>;
}
function Td({ children, mono = false }: { children: ReactNode; mono?: boolean }) {
  return (
    <td className="py-2 pr-4 align-top text-gray-700">
      {mono ? <code className="whitespace-pre rounded bg-gray-100 px-1.5 py-0.5 text-xs">{children}</code> : children}
    </td>
  );
}

export default function GithubFlavoredMarkdownPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'GitHub Flavored Markdown (GFM) cheat sheet',
        description: metadata.description,
        dateModified: UPDATED,
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: `https://docs-md.com${PATH}`,
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-10 max-w-3xl">
        <div className="flex items-start gap-4">
          <ToolIconTile slug="github-flavored-markdown" size="lg" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
              GitHub Flavored Markdown (GFM) cheat sheet
            </h1>
            <UpdatedLine date={UPDATED} />
          </div>
        </div>
        <p className="mt-4 text-base text-gray-600">
          GitHub Flavored Markdown is CommonMark plus five spec extensions — tables, task lists,
          strikethrough, bare-URL autolinks and an HTML tag filter — and github.com layers alerts,
          footnotes, math, mermaid, emoji shortcodes, @mentions and issue references on top. Each
          block below shows the syntax on the left and the rendered result on the right; the tables
          say which features are in the spec and which only work on github.com.
        </p>
        <SectionNav sections={SECTIONS} className="mt-5 flex flex-wrap gap-2 text-xs" />
      </div>

      <section id="matrix" className="mb-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">GFM vs CommonMark vs github.com</h2>
        <p className="text-base text-gray-600">
          &quot;GFM spec&quot; is what any GFM-compatible renderer (remark-gfm, GitLab, cmark-gfm)
          must support. &quot;github.com&quot; is what the website renders on top of the spec.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>Feature</Th>
                <Th>Syntax</Th>
                <Th>CommonMark</Th>
                <Th>GFM spec</Th>
                <Th>github.com</Th>
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((r) => (
                <tr key={r.feature} className="border-b border-gray-100">
                  <Td>
                    <span className="font-medium text-gray-900">{r.feature}</span>
                  </Td>
                  <Td mono>{r.syntax}</Td>
                  <Td>{r.commonmark}</Td>
                  <Td>{r.gfmSpec}</Td>
                  <Td>{r.github}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CheatSheet sections={SECTIONS} />

      <section id="alert-types" className="mt-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Alert types on GitHub</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>First line of the blockquote</Th>
                <Th>Use it for</Th>
                <Th>Rendered as</Th>
              </tr>
            </thead>
            <tbody>
              {ALERTS.map((a) => (
                <tr key={a.type} className="border-b border-gray-100">
                  <Td mono>{`> ${a.type}`}</Td>
                  <Td>{a.purpose}</Td>
                  <Td>{a.color}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="languages" className="mt-12 scroll-mt-8 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Fence language tags GitHub highlights</h2>
        <p className="text-base text-gray-600">
          GitHub uses{' '}
          <a href="https://github.com/github-linguist/linguist/blob/main/lib/linguist/languages.yml" className="text-indigo-700 underline">
            Linguist
          </a>{' '}
          to pick a highlighter; any language name or alias from its list works. The ones that show up
          most in READMEs:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <Th>Tag</Th>
                <Th>Also accepted</Th>
                <Th>Language</Th>
              </tr>
            </thead>
            <tbody>
              {LANGS.map((l) => (
                <tr key={l.tag} className="border-b border-gray-100">
                  <Td mono>{'```' + l.tag}</Td>
                  <Td>{l.aliases || '—'}</Td>
                  <Td>{l.language}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        {FAQ.map((f) => (
          <section key={f.q} className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-950">{f.q}</h2>
            <p>{f.a}</p>
            {f.href ? (
              <p>
                <Link href={f.href.path} className="text-indigo-700 underline">
                  {f.href.label} →
                </Link>
              </p>
            ) : null}
          </section>
        ))}

        <section className="space-y-3 rounded-2xl bg-indigo-50 p-6">
          <h2 className="text-xl font-semibold text-gray-950">Related tools and sheets</h2>
          <p>
            Check a README before pushing with the{' '}
            <Link href="/github-readme-viewer" className="text-indigo-700 underline">GitHub README viewer</Link>, scaffold one with the{' '}
            <Link href="/readme-generator" className="text-indigo-700 underline">README generator</Link> or{' '}
            <Link href="/readme-templates" className="text-indigo-700 underline">README templates</Link>, add{' '}
            <Link href="/markdown-badge-generator" className="text-indigo-700 underline">badges</Link>, lint it with{' '}
            <Link href="/markdown-lint" className="text-indigo-700 underline">markdown lint</Link>, and compare GFM with
            every other dialect on the{' '}
            <Link href="/markdown-flavors" className="text-indigo-700 underline">markdown flavors</Link> page. The general{' '}
            <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">markdown cheat sheet</Link> covers the
            CommonMark core.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-950">Sources</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {SOURCES.map((s) => (
              <li key={s.href}>
                <a href={s.href} className="text-indigo-700 underline" rel="noopener">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
