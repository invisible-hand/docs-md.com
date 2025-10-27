'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [content, setContent] = useState('');
  const [filename, setFilename] = useState('');
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
          filename: filename || 'untitled.md',
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-3 text-gray-950 tracking-tight">MD.SHARE</h1>
          <p className="text-gray-600 text-lg">
            Share markdown files securely. Links expire in 30 days.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="filename" className="block text-sm font-medium mb-2 text-gray-950">
                Filename (optional)
              </label>
              <input
                type="text"
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="document.md"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950 focus:border-transparent bg-white text-gray-950 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-2 text-gray-950">
                Markdown Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="# Your Markdown Here&#10;&#10;Start typing..."
                rows={15}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950 focus:border-transparent font-mono text-sm bg-white text-gray-950 resize-none placeholder:text-gray-400"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-gray-950 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
              >
                {isLoading ? 'Sharing...' : 'Share'}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-medium mb-3 text-gray-950 text-sm">How it works</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Paste your markdown content</li>
              <li>• Get a unique shareable link</li>
              <li>• Links automatically expire after 30 days</li>
              <li>• No sign-up required, completely anonymous</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            MCP Server available at <code className="bg-gray-100 px-2 py-1 rounded text-xs border border-gray-200">/api/mcp</code>
          </p>
        </div>
      </div>
    </div>
  );
}
