'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BTN_PRIMARY } from '@/components/tools/toolkit';
import { parseRepoInput } from '@/lib/github-docs';

const EXAMPLES: Array<{ label: string; href: string }> = [
  { label: 'modelcontextprotocol/servers', href: '/gh/modelcontextprotocol/servers' },
  { label: 'remarkjs/react-markdown', href: '/gh/remarkjs/react-markdown' },
  { label: 'vercel/next.js · docs/', href: '/gh/vercel/next.js/docs' },
  { label: 'anthropics/anthropic-sdk-python', href: '/gh/anthropics/anthropic-sdk-python' },
];

export default function GithubRepoForm() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  function go(e: React.FormEvent) {
    e.preventDefault();
    const href = parseRepoInput(value);
    if (!href) {
      setError('Enter a public repository as owner/repo or paste its GitHub URL (a folder or a .md file link works too).');
      return;
    }
    setError(null);
    router.push(href);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={go} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="owner/repo or https://github.com/owner/repo/tree/main/docs"
          aria-label="GitHub repository"
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <button type="submit" className={BTN_PRIMARY}>
          Open docs
        </button>
      </form>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <p className="text-sm text-gray-600">
        Try one:{' '}
        {EXAMPLES.map((x, i) => (
          <span key={x.href}>
            {i > 0 ? ' · ' : ''}
            <a href={x.href} className="font-mono text-indigo-700 underline">
              {x.label}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}
