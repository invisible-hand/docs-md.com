import type { Metadata } from 'next';
import Link from 'next/link';
import CopyButton from '@/components/CopyButton';

export const metadata: Metadata = {
  title: 'README Templates — Copy-Paste Examples That Work',
  description:
    'Four proven README templates to copy: a general project, an open-source library, a CLI tool, and a GitHub profile README — each annotated with why the sections are ordered that way.',
};

const TEMPLATES: Array<{ id: string; title: string; when: string; body: string }> = [
  {
    id: 'project',
    title: 'General project README',
    when: 'The default — an app, a service, an internal tool. Answers the three reader questions in order: what is it, how do I run it, how do I work on it.',
    body: `# Project Name

One-sentence description of what this does and who it's for.

![Screenshot or demo GIF](docs/demo.png)

## Features

- The two or three things it does well
- Written as outcomes, not implementation details

## Getting started

### Prerequisites

- Node.js 20+
- A PostgreSQL database

### Installation

\`\`\`bash
git clone https://github.com/you/project
cd project
npm install
cp .env.example .env   # then fill in the values
npm run dev
\`\`\`

## Usage

Show the single most common workflow with a real example:

\`\`\`bash
npm run import -- --file data.csv
\`\`\`

## Configuration

| Variable | Default | What it does |
| -------- | ------- | ------------ |
| \`PORT\` | \`3000\` | HTTP port |
| \`DATABASE_URL\` | — | Postgres connection string |

## Contributing

Pull requests welcome. Run \`npm test\` before submitting.

## License

[MIT](LICENSE)
`,
  },
  {
    id: 'library',
    title: 'Open-source library / npm package',
    when: 'For code other people install. Leads with install + a working example — the two things every evaluating developer wants within ten seconds.',
    body: `# package-name

[![npm](https://img.shields.io/npm/v/package-name)](https://www.npmjs.com/package/package-name)
[![CI](https://github.com/you/package-name/actions/workflows/ci.yml/badge.svg)](https://github.com/you/package-name/actions)
[![license](https://img.shields.io/npm/l/package-name)](LICENSE)

What it does in one sentence, and the problem it solves in one more.

## Install

\`\`\`bash
npm install package-name
\`\`\`

## Quick start

\`\`\`js
import { thing } from 'package-name';

const result = thing('input');
// => what the reader should expect to see
\`\`\`

## API

### \`thing(input, options?)\`

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| \`strict\` | \`boolean\` | \`false\` | What it changes |

Returns a \`Result\`. Throws \`TypeError\` when input is not a string.

## Why not X?

One honest paragraph on how this differs from the popular alternative.

## License

MIT
`,
  },
  {
    id: 'cli',
    title: 'CLI tool README',
    when: 'For command-line tools. The hero is a terminal session the reader can replay — show real commands with real output.',
    body: `# mytool

Fast one-line description.

\`\`\`console
$ mytool convert report.pdf
✔ Extracted 14 pages
✔ Wrote report.md (3,412 words)
\`\`\`

## Install

\`\`\`bash
# homebrew
brew install mytool

# or npm
npm install -g mytool
\`\`\`

## Commands

| Command | What it does |
| ------- | ------------ |
| \`mytool convert <file>\` | Convert a file to markdown |
| \`mytool watch <dir>\` | Convert on change |

## Options

\`\`\`text
-o, --out <path>   output file (default: stdout)
-q, --quiet        suppress progress output
\`\`\`

## Examples

Convert and pipe into another tool:

\`\`\`bash
mytool convert report.pdf -q | wc -w
\`\`\`

## License

MIT
`,
  },
  {
    id: 'profile',
    title: 'GitHub profile README',
    when: 'The repo named after your username, shown on your profile. Short beats complete — three sections is plenty.',
    body: `## Hi, I'm Alex 👋

I build developer tools. Currently working on [project](https://github.com/you/project) —
markdown sharing for AI workflows.

### Things I've made

- [project](https://github.com/you/project) — one-line description
- [othertool](https://github.com/you/othertool) — one-line description

### Find me

[Blog](https://example.com) · [Bluesky](https://bsky.app/profile/you) ·
[LinkedIn](https://linkedin.com/in/you)

<!-- Optional: GitHub stats card
![stats](https://github-readme-stats.vercel.app/api?username=you&show_icons=true)
-->
`,
  },
];

export default function ReadmeTemplatesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'README templates you can copy',
    description: metadata.description,
    dateModified: '2026-08-29',
    author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
    mainEntityOfPage: 'https://docs-md.com/readme-templates',
  };
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
        README templates
      </h1>
      <p className="mt-4 max-w-3xl text-base text-gray-600">
        Four templates for the four READMEs people actually write. Copy one, replace the
        placeholders, delete the sections you don&apos;t need — a README that omits a section beats
        one with &ldquo;TODO&rdquo; in it. Prefer filling in a form? The{' '}
        <Link href="/readme-generator" className="text-indigo-700 underline">
          README generator
        </Link>{' '}
        builds one interactively with live badges.
      </p>
      <nav className="mt-6 flex flex-wrap gap-2 text-sm">
        {TEMPLATES.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}`}
            className="rounded-full border border-gray-200 px-3 py-1.5 font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700"
          >
            {t.title}
          </a>
        ))}
      </nav>
      <div className="mt-10 space-y-14">
        {TEMPLATES.map((t) => (
          <section key={t.id} id={t.id} className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-950">{t.title}</h2>
            <p className="max-w-3xl text-gray-600">{t.when}</p>
            <div className="relative rounded-2xl border border-gray-200 bg-gray-50">
              <div className="absolute right-3 top-3">
                <CopyButton content={t.body} />
              </div>
              <pre className="max-h-[32rem] overflow-auto p-4 text-sm leading-relaxed text-gray-800">{t.body}</pre>
            </div>
          </section>
        ))}
      </div>
      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">What makes a good README?</h2>
          <p>
            Order sections by reader intent: what is this (one sentence + screenshot), can I use it
            (install), how do I use it (one real example), then reference material. Badges go under
            the title and should carry information (version, CI status, license) — not decoration.
            Keep the quick-start honest: if setup takes six steps, show six steps. And add a{' '}
            <Link href="/markdown-toc-generator" className="text-indigo-700 underline">
              table of contents
            </Link>{' '}
            once the file grows past a few screens.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">Related</h2>
          <p className="text-sm">
            <Link href="/readme-generator" className="text-indigo-700 underline">README generator</Link>{' · '}
            <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">markdown cheat sheet</Link>{' · '}
            <Link href="/guides/markdown-image" className="text-indigo-700 underline">images &amp; badges syntax</Link>{' · '}
            <Link href="/" className="text-indigo-700 underline">share a draft for review</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
