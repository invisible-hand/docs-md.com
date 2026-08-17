'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { BTN_DARK, BTN_GHOST, downloadFile, useCopy } from '@/components/tools/toolkit';

interface ReadmeFields {
  name: string;
  tagline: string;
  description: string;
  repo: string; // owner/name
  npmPackage: string;
  features: string;
  install: string;
  usage: string;
  usageLang: string;
  license: string;
  author: string;
  contributing: boolean;
}

const DEFAULTS: ReadmeFields = {
  name: 'my-project',
  tagline: 'One sentence that sells the project.',
  description:
    'A longer paragraph explaining what the project does, who it is for, and why it exists. Two to four sentences is plenty.',
  repo: '',
  npmPackage: '',
  features: 'Fast — no configuration needed\nSmall — zero dependencies\nTyped — ships with TypeScript definitions',
  install: 'npm install my-project',
  usage: "import { thing } from 'my-project';\n\nthing.run();",
  usageLang: 'js',
  license: 'MIT',
  author: '',
  contributing: true,
};

const LICENSES = ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'ISC', 'Unlicense', 'None'];

function buildBadges(f: ReadmeFields): string {
  const badges: string[] = [];
  if (f.license !== 'None') {
    badges.push(`![License](https://img.shields.io/badge/license-${encodeURIComponent(f.license)}-blue.svg)`);
  }
  if (f.npmPackage.trim()) {
    const pkg = f.npmPackage.trim();
    badges.push(`![npm](https://img.shields.io/npm/v/${pkg})`);
    badges.push(`![downloads](https://img.shields.io/npm/dm/${pkg})`);
  }
  if (f.repo.trim()) {
    badges.push(`![GitHub stars](https://img.shields.io/github/stars/${f.repo.trim()})`);
  }
  return badges.join('\n');
}

function buildReadme(f: ReadmeFields): string {
  const parts: string[] = [];
  const name = f.name.trim() || 'my-project';

  parts.push(`# ${name}`);
  if (f.tagline.trim()) parts.push(`> ${f.tagline.trim()}`);

  const badges = buildBadges(f);
  if (badges) parts.push(badges);

  if (f.description.trim()) parts.push(f.description.trim());

  const features = f.features
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  if (features.length > 0) {
    parts.push(`## Features\n\n${features.map((feat) => `- ${feat}`).join('\n')}`);
  }

  if (f.install.trim()) {
    parts.push(`## Installation\n\n\`\`\`bash\n${f.install.trim()}\n\`\`\``);
  }

  if (f.usage.trim()) {
    parts.push(`## Usage\n\n\`\`\`${f.usageLang.trim()}\n${f.usage.trim()}\n\`\`\``);
  }

  if (f.contributing) {
    const issuesLink = f.repo.trim()
      ? `[open an issue](https://github.com/${f.repo.trim()}/issues)`
      : 'open an issue';
    parts.push(
      `## Contributing\n\nContributions are welcome! Please ${issuesLink} first to discuss what you would like to change, and make sure tests pass before opening a pull request.`,
    );
  }

  if (f.license !== 'None') {
    const holder = f.author.trim();
    parts.push(`## License\n\n[${f.license}](LICENSE)${holder ? ` © ${holder}` : ''}`);
  }

  return parts.join('\n\n') + '\n';
}

const FIELD_CLASS =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none';
const LABEL_CLASS = 'mb-1 block text-xs font-semibold text-gray-700';

export default function ReadmeGenerator() {
  const [fields, setFields] = useState<ReadmeFields>(DEFAULTS);
  const [view, setView] = useState<'preview' | 'markdown'>('preview');
  const [copied, copy] = useCopy();
  const [shareState, setShareState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [shareUrl, setShareUrl] = useState('');

  const markdown = useMemo(() => buildReadme(fields), [fields]);

  const set = <K extends keyof ReadmeFields>(key: K, value: ReadmeFields[K]) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  const handleShare = async () => {
    setShareState('loading');
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: markdown, filename: 'README.md', expiry: '30d' }),
      });
      if (!response.ok) throw new Error('share failed');
      const data = await response.json();
      setShareUrl(data.url);
      setShareState('done');
    } catch (err) {
      console.error(err);
      setShareState('idle');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL_CLASS}>Project name</label>
            <input value={fields.name} onChange={(e) => set('name', e.target.value)} className={FIELD_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Author (for license line)</label>
            <input value={fields.author} onChange={(e) => set('author', e.target.value)} placeholder="Jane Doe" className={FIELD_CLASS} />
          </div>
        </div>
        <div>
          <label className={LABEL_CLASS}>Tagline (one line)</label>
          <input value={fields.tagline} onChange={(e) => set('tagline', e.target.value)} className={FIELD_CLASS} />
        </div>
        <div>
          <label className={LABEL_CLASS}>Description</label>
          <textarea value={fields.description} onChange={(e) => set('description', e.target.value)} rows={3} className={FIELD_CLASS} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL_CLASS}>GitHub repo (owner/name, for badges)</label>
            <input value={fields.repo} onChange={(e) => set('repo', e.target.value)} placeholder="vercel/next.js" className={FIELD_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>npm package (for badges)</label>
            <input value={fields.npmPackage} onChange={(e) => set('npmPackage', e.target.value)} placeholder="left-pad" className={FIELD_CLASS} />
          </div>
        </div>
        <div>
          <label className={LABEL_CLASS}>Features — one per line</label>
          <textarea value={fields.features} onChange={(e) => set('features', e.target.value)} rows={3} className={`${FIELD_CLASS} font-mono`} spellCheck={false} />
        </div>
        <div>
          <label className={LABEL_CLASS}>Install command(s)</label>
          <textarea value={fields.install} onChange={(e) => set('install', e.target.value)} rows={2} className={`${FIELD_CLASS} font-mono`} spellCheck={false} />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-700">Usage example</label>
            <label className="flex items-center gap-1 text-xs text-gray-500">
              lang
              <input value={fields.usageLang} onChange={(e) => set('usageLang', e.target.value)} className="w-16 rounded border border-gray-200 px-1.5 py-0.5 font-mono text-xs focus:border-indigo-400 focus:outline-none" />
            </label>
          </div>
          <textarea value={fields.usage} onChange={(e) => set('usage', e.target.value)} rows={4} className={`${FIELD_CLASS} font-mono`} spellCheck={false} />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-xs font-semibold text-gray-700">
            License{' '}
            <select value={fields.license} onChange={(e) => set('license', e.target.value)} className="ml-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-normal focus:border-indigo-400 focus:outline-none">
              {LICENSES.map((license) => (
                <option key={license} value={license}>{license}</option>
              ))}
            </select>
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-700">
            <input type="checkbox" checked={fields.contributing} onChange={(e) => set('contributing', e.target.checked)} className="h-3.5 w-3.5 accent-indigo-600" />
            Contributing section
          </label>
        </div>
      </div>

      <div>
        <div className="mb-2 flex min-h-8 flex-wrap items-center justify-between gap-2">
          <div className="flex rounded-lg border border-gray-200 p-0.5 text-xs font-medium">
            <button
              onClick={() => setView('preview')}
              className={`rounded-md px-3 py-1 transition ${view === 'preview' ? 'bg-gray-950 text-white' : 'text-gray-600 hover:text-gray-950'}`}
            >
              Preview
            </button>
            <button
              onClick={() => setView('markdown')}
              className={`rounded-md px-3 py-1 transition ${view === 'markdown' ? 'bg-gray-950 text-white' : 'text-gray-600 hover:text-gray-950'}`}
            >
              Markdown
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => copy(markdown)} className={BTN_DARK}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
            <button onClick={() => downloadFile('README.md', markdown, 'text/markdown')} className={BTN_GHOST}>
              Download README.md
            </button>
            <button onClick={handleShare} disabled={shareState === 'loading'} className={BTN_GHOST}>
              {shareState === 'loading' ? 'Sharing…' : 'Share as link'}
            </button>
          </div>
        </div>
        {view === 'preview' ? (
          <div className="h-[640px] overflow-y-auto rounded-2xl border border-gray-200 bg-white px-6 py-5">
            <MarkdownRenderer content={markdown} />
          </div>
        ) : (
          <pre className="h-[640px] overflow-auto rounded-2xl bg-gray-950 p-4 text-sm text-gray-200">
            <code>{markdown}</code>
          </pre>
        )}
        {shareState === 'done' ? (
          <p className="mt-2 text-sm text-gray-600">
            Live at{' '}
            <Link href={shareUrl} className="text-indigo-700 underline">
              {shareUrl}
            </Link>{' '}
            (expires in 30 days)
          </p>
        ) : null}
      </div>
    </div>
  );
}
