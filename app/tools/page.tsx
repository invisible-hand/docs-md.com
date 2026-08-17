import type { Metadata } from 'next';
import Link from 'next/link';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'Free Markdown Tools',
  description:
    'Free browser-based markdown tools: table generator, markdown to PDF converter, syntax cheat sheet, and instant markdown sharing. No signup, nothing uploaded.',
};

const TOOLS = [
  {
    href: '/markdown-table-generator',
    title: 'Markdown table generator',
    body: 'Build tables in a visual grid — set column alignment, paste CSV/TSV from a spreadsheet, and copy clean padded markdown.',
  },
  {
    href: '/markdown-to-pdf',
    title: 'Markdown to PDF converter',
    body: 'Paste or open a .md file and download a PDF with real selectable text, highlighted code, and rendered tables. Fully client-side.',
  },
  {
    href: '/markdown-cheat-sheet',
    title: 'Markdown cheat sheet',
    body: 'Every element of markdown and GFM with side-by-side syntax and rendered output — headings to footnotes to mermaid diagrams.',
  },
  {
    href: '/markdown-to-html',
    title: 'Markdown to HTML converter',
    body: 'Turn markdown into clean semantic HTML as you type — copy the fragment, or download a complete styled document. GFM supported.',
  },
  {
    href: '/readme-generator',
    title: 'README generator',
    body: 'Fill in a form, get a professional README.md with live badges, install and usage sections, and a live preview.',
  },
  {
    href: '/markdown-formatter',
    title: 'Markdown formatter',
    body: 'Prettify messy markdown: uniform list markers, one emphasis style, aligned tables. Semantic — rendered output never changes.',
  },
  {
    href: '/',
    title: 'Markdown sharing',
    body: 'The core product: paste markdown, get a link. Flexible expiry from 1 day to forever, edit tokens, raw endpoints, and an MCP server for AI IDEs.',
  },
];

export default function ToolsPage() {
  return (
    <ContentPage
      title="Markdown tools"
      description="Small, fast, browser-based tools for working with markdown. No accounts, no uploads — your text stays on your machine unless you explicitly share it."
    >
      <section className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-2xl border border-gray-200 bg-gray-50 p-6 transition hover:border-indigo-300 hover:bg-indigo-50/40"
          >
            <h2 className="text-lg font-semibold text-gray-950 group-hover:text-indigo-700">
              {tool.title} →
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{tool.body}</p>
          </Link>
        ))}
      </section>
      <section className="space-y-3">
        <p className="text-sm text-gray-600">
          Working from an AI IDE? The same sharing works over MCP — see the{' '}
          <Link href="/ai-powered-ide" className="text-indigo-700 underline">
            setup guide for Cursor, Claude Code, VS Code, Windsurf, and Zed
          </Link>
          , or automate with the{' '}
          <Link href="/api-docs" className="text-indigo-700 underline">
            REST API
          </Link>
          .
        </p>
      </section>
    </ContentPage>
  );
}
