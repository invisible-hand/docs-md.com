import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200/70 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 text-sm text-gray-600 md:flex-row md:items-center">
        <p>Built with Next.js, Vercel Blob, Neon Postgres, and MCP.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/about" className="hover:text-indigo-700">
            About
          </Link>
          <Link href="/what-is-mcp" className="hover:text-indigo-700">
            What is MCP
          </Link>
          <a
            href="https://github.com/invisible-hand/docs-md.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-700"
          >
            Source on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
