import Link from 'next/link';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import CheatSheet, { SectionNav } from '@/components/CheatSheet';
import { SECTIONS, MDX_WHAT } from '@/lib/platform-sheets/mdx-cheat-sheet';
import UpdatedLine from '@/components/UpdatedLine';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-10-15';
const MDX_START = 'https://mdxjs.com/docs/getting-started/';
const MDX_V3 = 'https://mdxjs.com/migrating/v3/';
const MDX_V2 = 'https://mdxjs.com/migrating/v2/';

export const metadata = pageMetadata({
  title: 'MDX Cheat Sheet — JSX, Imports, Expressions, Gotchas',
  description:
    'MDX syntax in one page: JSX in markdown, import/export, {expressions}, layouts, escaping < and {, what differs from markdown, MDX 2 vs 3, Next.js.',
  path: '/mdx-cheat-sheet',
  type: 'article',
  kicker: 'Reference',
});

const FAQ: Array<{ q: string; a: string; href?: { path: string; label: string } }> = [
  {
    q: 'What is MDX?',
    a: 'MDX is markdown that can contain JSX, JavaScript expressions in curly braces, and ESM import/export statements. A .mdx file compiles to a JavaScript component, so React (or Preact, Vue, Svelte via the JSX runtime) components can be used inline in prose. Markdown support is CommonMark by default; GFM tables, task lists and footnotes need the remark-gfm plugin.',
  },
  {
    q: 'How do I use a React component inside MDX?',
    a: 'Import it at the top of the file and write it as a JSX tag anywhere in the content: import {Chart} from \'./chart.js\' followed by <Chart data={[1, 2, 3]} /> on its own line. Components can also be passed in through the components prop of the compiled MDX component, or defined locally with export.',
  },
  {
    q: 'Why does MDX fail on a < or { character in my text?',
    a: 'In MDX, < starts a JSX tag and { starts an expression, so a bare "a < b" or "use {braces}" is a syntax error. Escape them as \\< and \\{, or write them as expressions: {\'<\'} and {\'{\'}. Inside inline code and fenced code blocks they are fine without escaping.',
  },
  {
    q: 'Why does an HTML comment break MDX?',
    a: 'HTML syntax does not work in MDX; it is replaced by JSX. <!-- comment --> is therefore invalid. Use a JavaScript comment inside braces instead: {/* comment */}. The same rule means <img> must be self-closed as <img />.',
    href: { path: '/guides/markdown-comment', label: 'Markdown comment guide' },
  },
  {
    q: 'What markdown does not work in MDX?',
    a: 'Three things from regular markdown are turned off: indented code blocks (four-space indentation is a paragraph, so JSX can be indented), autolinks (write [text](https://url) instead of a bare URL or <https://url>) and HTML (use JSX). GFM extensions such as tables and strikethrough are off unless remark-gfm is added.',
  },
  {
    q: 'What changed between MDX 2 and MDX 3?',
    a: 'MDX 3 (2023) is a small release: Node 16 or later is required, the useDynamicImport option was removed because its behaviour became the default, evaluate/run need a baseUrl when the MDX uses import/export, MDXContext and withMDXComponents are replaced by useMDXComponents, and @mdx-js/register is replaced by @mdx-js/node-loader. The syntax itself did not change. MDX 2 (2022) was the big break: packages became ESM-only, GFM became opt-in, the inlineCode component and dotted component names like ol.li were removed, and JSX no longer needs blank lines around it.',
  },
  {
    q: 'How do I add a layout to an MDX file?',
    a: 'Export a default function that receives children: export default function Layout({children}) { return <main>{children}</main> }. Alternatively pass the layout as components.wrapper from the outside; a local default export takes precedence over the wrapper.',
  },
];

const FRAMEWORKS: Array<{ fw: string; pkg: string; setup: string; note: string }> = [
  { fw: 'Next.js (App Router)', pkg: '@next/mdx', setup: 'Wrap next.config with createMDX(); add md and mdx to pageExtensions; add mdx-components.tsx for custom components.', note: 'mdxjs.com advises against providerImportSource and @mdx-js/react with Next.' },
  { fw: 'Docusaurus', pkg: 'built in', setup: 'Write .mdx in docs/ or blog/; import components at the top of the file.', note: 'Docusaurus 3 uses MDX 3; front matter and admonitions (:::note) are supported.' },
  { fw: 'Astro', pkg: '@astrojs/mdx', setup: 'npx astro add mdx; put .mdx in src/pages or a content collection.', note: 'Astro components and framework components can be used; expressions run at build time.' },
  { fw: 'Vite', pkg: '@mdx-js/rollup', setup: 'Add mdx() to plugins in vite.config.js; with @vitejs/plugin-react use enforce: "pre".', note: 'Same plugin serves Rollup builds.' },
  { fw: 'Gatsby', pkg: 'gatsby-plugin-mdx', setup: 'Add the plugin to gatsby-config and source .mdx files.', note: 'Gatsby maintains its own integration.' },
  { fw: 'Any bundler / Node', pkg: '@mdx-js/mdx, @mdx-js/node-loader, @mdx-js/esbuild, @mdx-js/loader (webpack)', setup: 'compile() or evaluate() from @mdx-js/mdx; loaders for esbuild, webpack and Node.', note: 'Core packages are ESM-only since MDX 2.' },
];

const DIFFS: Array<{ feature: string; markdown: string; mdx: string }> = [
  { feature: 'Indented code (4 spaces)', markdown: 'Code block', mdx: 'Paragraph — use ``` fences' },
  { feature: 'Bare URL / <https://…>', markdown: 'Autolink', mdx: 'Not a link — write [text](url)' },
  { feature: '<div>, <img>, <br>', markdown: 'Raw HTML passed through', mdx: 'JSX — must be well-formed and self-closed (<img />, <br />)' },
  { feature: '<!-- comment -->', markdown: 'Hidden', mdx: 'Error — use {/* comment */}' },
  { feature: 'Literal < or {', markdown: 'Plain text', mdx: 'Escape: \\< \\{ or {\'<\'} {\'{\'}' },
  { feature: 'class="x" on a tag', markdown: 'Passed through', mdx: 'className="x" in React (attribute names follow the framework)' },
  { feature: 'style="color:red"', markdown: 'Passed through', mdx: 'style={{color: \'red\'}}' },
  { feature: 'Tables, ~~strike~~, task lists, footnotes', markdown: 'GFM (most renderers)', mdx: 'Off until remark-gfm is added' },
  { feature: 'YAML front matter', markdown: 'Ignored or parsed by the site', mdx: 'Needs remark-frontmatter (and remark-mdx-frontmatter to expose it)' },
  { feature: 'import / export lines', markdown: 'Plain text', mdx: 'ESM — must be at the top level, not indented' },
  { feature: '{Math.PI}', markdown: 'Plain text', mdx: 'Evaluated expression' },
  { feature: 'Markdown inside <Tag>…</Tag>', markdown: 'n/a', mdx: 'Inline markdown works on the same line; block markdown needs its own lines inside the tag' },
];


export default function MdxCheatSheetPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'MDX cheat sheet',
        description: metadata.description,
        dateModified: UPDATED,
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: 'https://docs-md.com/mdx-cheat-sheet',
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
  const code = 'whitespace-pre-wrap rounded bg-gray-100 px-1.5 py-0.5';
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-10 max-w-3xl">
        <div className="flex items-start gap-4">
          <ToolIconTile slug="mdx-cheat-sheet" size="lg" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">MDX cheat sheet</h1>
            <UpdatedLine date={UPDATED} />
          </div>
        </div>
        <p className="mt-4 text-base text-gray-600">
          MDX is markdown plus three additions: <strong>JSX</strong> tags (<code className="rounded bg-gray-100 px-1 text-sm">&lt;Chart /&gt;</code>),{' '}
          <strong>expressions</strong> in braces (<code className="rounded bg-gray-100 px-1 text-sm">{'{Math.PI}'}</code>) and{' '}
          <strong>ESM</strong> <code className="rounded bg-gray-100 px-1 text-sm">import</code>/<code className="rounded bg-gray-100 px-1 text-sm">export</code>.
          In exchange it drops three markdown features — indented code, autolinks and raw HTML — and makes{' '}
          <code className="rounded bg-gray-100 px-1 text-sm">&lt;</code> and <code className="rounded bg-gray-100 px-1 text-sm">{'{'}</code>{' '}
          reserved characters. Syntax below follows the official{' '}
          <a href={MDX_WHAT} className="text-indigo-700 underline" rel="noopener">mdxjs.com</a> docs for MDX 3; snippets are shown as
          source only because they need a compiler to run.
        </p>
        <SectionNav sections={SECTIONS} />
      </div>

      <section className="mb-12 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Markdown vs MDX: what changes</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="py-2 pr-4 font-semibold text-gray-950">You write</th>
                <th className="py-2 pr-4 font-semibold text-gray-950">Markdown (GFM)</th>
                <th className="py-2 font-semibold text-gray-950">MDX</th>
              </tr>
            </thead>
            <tbody>
              {DIFFS.map((r) => (
                <tr key={r.feature} className="border-b border-gray-100 align-top">
                  <td className="py-2.5 pr-4"><code className={code}>{r.feature}</code></td>
                  <td className="py-2.5 pr-4 text-gray-600">{r.markdown}</td>
                  <td className="py-2.5 text-gray-900">{r.mdx}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CheatSheet sections={SECTIONS} />

      <section id="versions" className="mt-12 scroll-mt-8 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">MDX 1 vs 2 vs 3</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="py-2 pr-4 font-semibold text-gray-950">Change</th>
                <th className="py-2 pr-4 font-semibold text-gray-950">MDX 2 (2022)</th>
                <th className="py-2 font-semibold text-gray-950">MDX 3 (2023)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Syntax', 'JSX no longer needs blank lines around it and may be indented; expressions {…} added; markdown ambiguities (indented code, autolinks, HTML) removed', 'Unchanged'],
                ['GFM', 'Off by default; add remark-gfm', 'Same'],
                ['Packages', 'ESM-only (no require())', 'Node 16+ required'],
                ['Components', 'inlineCode removed (use code); dotted names like ol.li removed', 'MDXContext and withMDXComponents replaced by useMDXComponents'],
                ['Options', '—', 'useDynamicImport removed (now default); baseUrl needed for evaluate/run when the file uses import/export'],
                ['Loaders', '—', '@mdx-js/register replaced by @mdx-js/node-loader; classic JSX runtime deprecated in favour of automatic'],
              ].map(([a, b, c]) => (
                <tr key={a} className="border-b border-gray-100 align-top">
                  <td className="py-2.5 pr-4 font-medium text-gray-900">{a}</td>
                  <td className="py-2.5 pr-4 text-gray-600">{b}</td>
                  <td className="py-2.5 text-gray-600">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600">
          Sources: <a href={MDX_V2} className="text-indigo-700 underline" rel="noopener">migrating to MDX 2</a> and{' '}
          <a href={MDX_V3} className="text-indigo-700 underline" rel="noopener">migrating to MDX 3</a>.
        </p>
      </section>

      <section id="frameworks" className="mt-12 scroll-mt-8 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Frameworks: Next.js, Docusaurus, Astro and others</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="py-2 pr-4 font-semibold text-gray-950">Framework</th>
                <th className="py-2 pr-4 font-semibold text-gray-950">Package</th>
                <th className="py-2 pr-4 font-semibold text-gray-950">Setup</th>
                <th className="py-2 font-semibold text-gray-950">Notes</th>
              </tr>
            </thead>
            <tbody>
              {FRAMEWORKS.map((r) => (
                <tr key={r.fw} className="border-b border-gray-100 align-top">
                  <td className="py-2.5 pr-4 font-medium text-gray-900">{r.fw}</td>
                  <td className="py-2.5 pr-4"><code className={code}>{r.pkg}</code></td>
                  <td className="py-2.5 pr-4 text-gray-600">{r.setup}</td>
                  <td className="py-2.5 text-gray-600">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600">
          Source: <a href={MDX_START} className="text-indigo-700 underline" rel="noopener">mdxjs.com getting started</a>.
        </p>
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

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">Related</h2>
          <p className="text-sm text-gray-600">
            <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">Markdown cheat sheet</Link>{' · '}
            <Link href="/pandoc-markdown" className="text-indigo-700 underline">Pandoc markdown</Link>{' · '}
            <Link href="/front-matter-generator" className="text-indigo-700 underline">Front matter generator</Link>{' · '}
            <Link href="/markdown-lint" className="text-indigo-700 underline">Markdown lint</Link>{' · '}
            <Link href="/markdown-to-html" className="text-indigo-700 underline">Markdown to HTML</Link>{' · '}
            <Link href="/guides/markdown-code-block" className="text-indigo-700 underline">Code block guide</Link>{' · '}
            <Link href="/guides/markdown-comment" className="text-indigo-700 underline">Comment guide</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
