'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';

type ExpiryOption = '1d' | '7d' | '30d' | 'never';

const EXPIRY_CHOICES: Array<{ value: ExpiryOption; label: string }> = [
  { value: '1d', label: '1 day' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: 'never', label: 'Never expires' },
];

interface ShareResult {
  id: string;
  url: string;
  rawUrl: string;
  editToken: string;
  expiresAt: number;
}

const STARTER_CONTENT = `# Ship better docs faster

Use **Docs MD** to share markdown with your team and AI workflows.

## Why it works
- Fast share links
- Auto-expiration in 30 days
- Great rendering with code highlighting

\`\`\`ts
export function greet(name: string) {
  return \`Hello, \${name}\`;
}
\`\`\`
`;

const FORMAT_SNIPPETS: Array<{ label: string; snippet: string }> = [
  { label: 'H1', snippet: '# Heading\n' },
  { label: 'Bold', snippet: '**bold text**' },
  { label: 'Link', snippet: '[title](https://example.com)' },
  { label: 'List', snippet: '- First item\n- Second item\n' },
  { label: 'Code', snippet: '```\nconst x = 1;\n```' },
  { label: 'Table', snippet: '| Col A | Col B |\n| --- | --- |\n| One | Two |\n' },
];

export default function Home() {
  const [content, setContent] = useState(STARTER_CONTENT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [expiry, setExpiry] = useState<ExpiryOption>('30d');
  const [result, setResult] = useState<ShareResult | null>(null);
  const [copiedField, setCopiedField] = useState<'url' | 'token' | null>(null);
  const [mobileTab, setMobileTab] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const copyValue = async (field: 'url' | 'token', value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please enter some markdown content');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          filename: 'untitled.md',
          expiry,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Failed to create share');
      }

      const data = await response.json();
      setResult({
        id: data.id,
        url: data.url,
        rawUrl: data.rawUrl,
        editToken: data.editToken,
        expiresAt: data.expiresAt,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to share markdown file. Please try again.';
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const insertSnippet = (snippet: string) => {
    const textarea = textareaRef.current;

    if (!textarea) {
      setContent((prev) => `${prev}${prev.endsWith('\n') ? '' : '\n'}${snippet}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextValue = `${content.slice(0, start)}${snippet}${content.slice(end)}`;

    setContent(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + snippet.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <div>
      <section className="mx-auto w-full max-w-6xl px-4 pb-8 pt-12 md:pt-16">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="mb-4 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Built for AI-powered teams
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-950 md:text-5xl">
              Share markdown with a bold, developer-first workflow.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-gray-600 md:text-lg">
              Paste markdown, preview instantly, and publish an expiring URL. Connect through MCP
              to share directly from Cursor and other AI-native tools.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <a
                href="#editor"
                className="rounded-full bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-indigo-500"
              >
                Start Sharing
              </a>
              <Link
                href="/what-is-mcp"
                className="rounded-full border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700"
              >
                Learn MCP
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Why Docs MD</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>Instant share links with memorable IDs</li>
              <li>Flexible expiry — 1 day, 7 days, 30 days, or never</li>
              <li>Edit and delete your shares with a private token</li>
              <li>MCP endpoint for IDE automation</li>
              <li>Mermaid diagrams rendered automatically</li>
              <li>Syntax highlighting and GitHub-flavored markdown</li>
              <li>No account required to start</li>
            </ul>
            <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-900">Free markdown tools</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/markdown-table-generator" className="text-indigo-700 underline">
                  Markdown table generator
                </Link>
              </li>
              <li>
                <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">
                  Markdown cheat sheet
                </Link>
              </li>
              <li>
                <Link href="/readme-generator" className="text-indigo-700 underline">
                  README generator
                </Link>
              </li>
              <li>
                <Link href="/markdown-to-pdf" className="text-indigo-700 underline">
                  Markdown to PDF
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-indigo-700 underline">
                  All tools →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="editor" className="mx-auto w-full max-w-6xl px-4 pb-16">
        <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-xl md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-gray-950">Write and preview</h2>
            <div className="inline-flex rounded-full border border-gray-200 p-1 md:hidden">
              <button
                type="button"
                onClick={() => setMobileTab('write')}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  mobileTab === 'write' ? 'bg-indigo-600 text-white' : 'text-gray-600'
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('preview')}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  mobileTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-gray-600'
                }`}
              >
                Preview
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {FORMAT_SNIPPETS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => insertSnippet(item.snippet)}
                  className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className={mobileTab === 'preview' ? 'hidden md:block' : 'block'}>
                <label htmlFor="content" className="mb-2 block text-sm font-medium text-gray-700">
                  Markdown Content
                </label>
                <textarea
                  ref={textareaRef}
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={22}
                  className="h-[560px] w-full resize-none overflow-y-auto rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-950 placeholder:text-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="# Start writing your markdown..."
                />
              </div>

              <div className={mobileTab === 'write' ? 'hidden md:block' : 'block'}>
                <p className="mb-2 block text-sm font-medium text-gray-700">Live Preview</p>
                <div className="h-[560px] overflow-y-auto rounded-2xl border border-gray-200 bg-white px-5 py-4">
                  <MarkdownRenderer content={content || '_Your preview appears here..._'} />
                </div>
              </div>
            </div>

            {error ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">Link expiry:</span>
                {EXPIRY_CHOICES.map((choice) => (
                  <button
                    key={choice.value}
                    type="button"
                    onClick={() => setExpiry(choice.value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      expiry === choice.value
                        ? 'bg-indigo-600 text-white'
                        : 'border border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-700'
                    }`}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-full bg-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Creating link...' : 'Share Markdown'}
              </button>
            </div>
          </form>

          {result ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-emerald-900">
                  ✓ Your markdown is live{result.expiresAt === 0 ? ' — permanently' : ''}
                </h3>
                <Link
                  href={`/${result.id}`}
                  className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500"
                >
                  View share →
                </Link>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <code className="min-w-0 flex-1 truncate rounded-lg border border-emerald-200 bg-white px-3 py-2 text-gray-800">
                    {result.url}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyValue('url', result.url)}
                    className="rounded-lg bg-gray-950 px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-800"
                  >
                    {copiedField === 'url' ? '✓ Copied' : 'Copy link'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <code className="min-w-0 flex-1 truncate rounded-lg border border-emerald-200 bg-white px-3 py-2 text-gray-800">
                    {result.editToken}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyValue('token', result.editToken)}
                    className="rounded-lg bg-gray-950 px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-800"
                  >
                    {copiedField === 'token' ? '✓ Copied' : 'Copy token'}
                  </button>
                </div>
                <p className="text-xs text-emerald-800">
                  Save the edit token — it&apos;s the only way to update or delete this share later, and it
                  won&apos;t be shown again.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section id="mcp-setup" className="mx-auto w-full max-w-5xl px-4 pb-20">
        <div className="rounded-3xl bg-gray-950 p-8 text-white">
          <h3 className="mb-3 text-base font-semibold uppercase tracking-wide">MCP Integration</h3>
          <p className="mb-6 text-sm text-gray-300">
            Share markdown directly from Cursor and other AI-powered IDE workflows.
          </p>
          <div className="mb-5 rounded-lg border border-gray-800 bg-gray-900 p-5">
            <p className="mb-3 font-mono text-xs text-gray-400">Add to MCP settings:</p>
            <pre className="overflow-x-auto whitespace-pre text-sm text-gray-300">
{`{
  "mcpServers": {
    "md-share": {
      "url": "https://docs-md.com/api/mcp",
      "transport": "http"
    }
  }
}`}
            </pre>
          </div>
          <p className="text-sm text-gray-400">
            Then ask your assistant: <span className="font-medium text-gray-200">&quot;Share this markdown file&quot;</span>
          </p>
        </div>
      </section>
    </div>
  );
}
