import Link from 'next/link';
import { toolsInCategory } from '@/lib/tools-registry';

const PRODUCT = [
  { href: '/', label: 'Share markdown' },
  { href: '/what-is-mcp', label: 'MCP server' },
  { href: '/ai-powered-ide', label: 'AI IDE setup' },
  { href: '/api-docs', label: 'REST API' },
  { href: '/use-cases', label: 'Use cases' },
  { href: '/about', label: 'About' },
];

const LEARN = [
  { href: '/markdown-cheat-sheet', label: 'Markdown cheat sheet' },
  { href: '/guides', label: 'Syntax guides' },
  { href: '/what-is-markdown', label: 'What is markdown?' },
  { href: '/readme-templates', label: 'README templates' },
  { href: '/discord-markdown', label: 'Discord markdown' },
  { href: '/slack-markdown', label: 'Slack formatting' },
  { href: '/mermaid-timeline-examples', label: 'Mermaid timelines' },
  { href: '/what-is-an-mcp-server', label: 'What is an MCP server?' },
  { href: '/mcp-servers', label: 'MCP server list' },
];

const MORE_FROM_US = [
  { href: 'https://chartcraft.dev', label: 'ChartCraft', blurb: 'diagrams from text' },
  { href: 'https://fixmyformatting.com', label: 'FixMyFormatting', blurb: 'clean up AI text' },
  { href: 'https://onetworesume.com', label: 'OneTwoResume', blurb: 'resume builder' },
];

function Column({ heading, links }: { heading: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-900">{heading}</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="text-gray-600 transition hover:text-indigo-700">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter() {
  const convert = toolsInCategory('convert').map((t) => ({ href: `/${t.slug}`, label: t.name }));
  const generate = toolsInCategory('generate').map((t) => ({ href: `/${t.slug}`, label: t.name }));
  const check = [...toolsInCategory('check'), ...toolsInCategory('edit')].map((t) => ({
    href: `/${t.slug}`,
    label: t.name,
  }));

  return (
    <footer className="border-t border-gray-200/70 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="text-base font-semibold tracking-tight text-gray-950">
              DOCS-MD.COM
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              Markdown sharing with expiring links, an MCP server for AI IDEs, and free tools for
              every markdown job.
            </p>
            <a
              href="https://github.com/invisible-hand/docs-md.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Source on GitHub
            </a>
          </div>
          <Column heading="Product" links={PRODUCT} />
          <Column heading="Convert" links={convert} />
          <Column heading="Generate" links={[...generate, { href: '/tools', label: 'All tools →' }]} />
          <Column heading="Check & edit" links={check} />
        </div>

        <div className="mt-10 grid gap-10 border-t border-gray-100 pt-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-900">Learn markdown</h2>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {LEARN.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-600 transition hover:text-indigo-700">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-900">More from us</h2>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {MORE_FROM_US.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-gray-600 transition hover:text-indigo-700">
                    {l.label} <span className="text-gray-400">· {l.blurb}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-gray-100 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Docs MD. Built with Next.js, Vercel Blob, Neon Postgres, and MCP.</p>
          <p>Tools run in your browser. Nothing is uploaded unless you share it.</p>
        </div>
      </div>
    </footer>
  );
}
