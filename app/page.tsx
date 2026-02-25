'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownEditor from '@/components/MarkdownEditor';

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-gray-950">DOCS-MD.COM</h1>
              <p className="text-xs text-gray-600 mt-0.5">Share Markdown Files</p>
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

      {/* Main Content - Editor takes full width */}
      <main className="flex-1 flex flex-col max-w-[1400px] w-full mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          {/* Editor fills available space */}
          <div className="flex-1 min-h-[500px]">
            <MarkdownEditor value={content} onChange={setContent} />
          </div>

          {/* Error + Submit */}
          <div className="flex items-center justify-between mt-4 gap-4">
            <div className="flex-1">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-800 text-sm">
                  {error}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading || !content.trim()}
              className="px-8 py-3 bg-gray-950 text-white rounded-xl hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium text-sm shadow-sm hover:shadow-md flex items-center gap-2 shrink-0"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating Link...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </>
              )}
            </button>
          </div>
        </form>

        {/* MCP Integration */}
        <div id="mcp-setup" className="mt-12 max-w-3xl mx-auto w-full">
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
      <footer className="border-t border-gray-100 mt-8">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
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
