'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create share');
      }

      const data = await response.json();
      router.push(`/${data.id}`);
    } catch (err) {
      setError('Failed to share markdown file. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-gray-950">DOCS-MD.COM</h1>
              <p className="text-xs text-gray-600 mt-1">Share Markdown Files</p>
            </div>
            <a
              href="#mcp-setup"
              className="text-xs text-gray-600 hover:text-gray-950 transition-colors"
            >
              MCP Server
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12 md:py-16">

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-2 text-gray-700">
                    Markdown Content
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="# Hello World&#10;&#10;Start writing your markdown here..."
                    rows={18}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono text-sm bg-gray-50 text-gray-950 resize-none placeholder:text-gray-400 transition-colors"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-800 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-gray-950 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm shadow-sm hover:shadow-md"
                  >
                    {isLoading ? 'Creating Link...' : 'Share'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar - Takes 1 column */}
          <div className="space-y-6">
            {/* Features */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-semibold text-gray-950 mb-4 text-sm uppercase tracking-wide">Features</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Instant sharing with unique URLs</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Auto-expires after 30 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>No registration or login required</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Full markdown rendering support</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Syntax highlighting for code blocks</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* MCP Integration - Full Width at Bottom */}
        <div id="mcp-setup" className="mt-16 max-w-3xl mx-auto">
          <div className="bg-gray-950 rounded-2xl p-8 text-white">
            <h3 className="font-semibold mb-3 text-base uppercase tracking-wide">MCP Integration</h3>
            <p className="text-sm text-gray-300 mb-6">
              Share markdown directly from Cursor using our MCP server.
            </p>
            <div className="bg-gray-900 rounded-lg p-5 mb-5 border border-gray-800">
              <p className="text-xs text-gray-400 mb-3 font-mono">Add to MCP settings:</p>
              <pre className="text-sm text-gray-300 font-mono whitespace-pre">
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
              Then attach a file to Cursor chat and simply ask: <span className="text-gray-300 font-medium">&quot;Share this file&quot;</span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-center text-xs text-gray-500">
            Built with Next.js, Vercel Blob, and Neon Postgres ·{' '}
            <a
              href="https://github.com/invisible-hand/docs-md.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-gray-700"
            >
              Source on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
