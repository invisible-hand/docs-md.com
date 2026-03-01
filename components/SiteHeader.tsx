import Link from 'next/link';

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/what-is-mcp', label: 'What is MCP' },
  { href: '/ai-powered-ide', label: 'AI IDE Guide' },
  { href: '/use-cases', label: 'Use Cases' },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="group">
          <p className="text-base font-semibold tracking-tight text-gray-950 transition-colors group-hover:text-indigo-700">
            DOCS-MD.COM
          </p>
          <p className="text-[11px] text-gray-600">Markdown sharing for AI-native workflows</p>
        </Link>
        <nav className="hidden items-center gap-4 text-sm text-gray-700 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-indigo-700">
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/invisible-hand/docs-md.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
