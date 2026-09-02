import type { Metadata } from 'next';
import Link from 'next/link';
import UpdatedLine from '@/components/UpdatedLine';

const UPDATED = '2026-09-01';
import ReadmeGenerator from '@/components/tools/ReadmeGenerator';

export const metadata: Metadata = {
  title: 'README Generator — Free Online Tool',
  description:
    'Generate a professional README.md: fill in a form, get badges, install instructions, usage examples, and license sections with a live preview. Free, no signup.',
};

export default function ReadmeGeneratorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'README Generator',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description: metadata.description,
        dateModified: UPDATED,
        url: 'https://docs-md.com/readme-generator',
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'Is anything uploaded while I type?', acceptedAnswer: { '@type': 'Answer', text: 'No — the README is assembled in your browser. The only network request happens if you explicitly click Share as link, which publishes the markdown to a URL (with an edit token, expiring in 30 days) so you can send a draft to a teammate before committing it.' } },
          { '@type': 'Question', name: 'Can I edit the result afterwards?', acceptedAnswer: { '@type': 'Answer', text: 'Absolutely — the output is plain markdown, meant as a strong starting point. Download it, drop it in your repo, and extend it with project-specific sections (architecture, benchmarks, screenshots) as the project grows.' } },
          { '@type': 'Question', name: 'Which license should I pick?', acceptedAnswer: { '@type': 'Answer', text: 'Not legal advice, but as a rough map of common practice: MIT is the most common choice for libraries (short and permissive), Apache-2.0 adds an explicit patent grant, and GPL-3.0 requires derivative works to stay open source. See choosealicense.com for a fuller comparison.' } },
          { '@type': 'Question', name: 'Does this work for non-code projects?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — skip the npm field, put whatever setup steps you have in the install box, and the structure works for datasets, courses, design systems, or documentation repos just as well.' } },
        ],
      },
    ],
  };
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
          README generator
        </h1>
        <UpdatedLine date={UPDATED} />
        <p className="mt-4 text-base text-gray-600">
          Fill in the form and watch a complete, professionally structured README.md build itself
          in the live preview — badges, features, installation, usage, contributing guidelines, and
          license. Download the file, copy the markdown, or publish it as a shareable link.
        </p>
      </div>

      <ReadmeGenerator />

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-950">
            What makes a good README?
          </h2>
          <p>
            A README has one job: get a stranger from &quot;what is this?&quot; to &quot;it&apos;s
            running on my machine&quot; with as little friction as possible. The structure this
            generator produces is the one that has converged across successful open-source
            projects:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Name and tagline first</strong> — a reader decides in seconds whether the
              project is relevant. The tagline (rendered as a blockquote) answers &quot;what does
              it do?&quot; before anything else.
            </li>
            <li>
              <strong>Badges as signals</strong> — license, npm version, and download counts are
              trust signals that take one line. More than four or five becomes noise.
            </li>
            <li>
              <strong>Features as bullets, not prose</strong> — scannable claims about what the
              project does well. Three to six is the sweet spot.
            </li>
            <li>
              <strong>Copy-pasteable install and usage</strong> — the two sections people
              actually read. A working code snippet beats paragraphs of description.
            </li>
            <li>
              <strong>License at the bottom</strong> — companies check it before adopting
              anything; missing licenses block adoption silently.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-950">Where do the badges come from?</h2>
          <p>
            Badges are generated from{' '}
            <a href="https://shields.io" target="_blank" rel="noopener noreferrer" className="text-indigo-700 underline">
              shields.io
            </a>
            , the de-facto standard badge service. The license badge is static; the npm version,
            download, and GitHub star badges are live — they update automatically as your package
            gets releases and your repo gets stars, with no maintenance on your side. Fill in the
            GitHub repo (as <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">owner/name</code>) and npm
            package fields and the relevant badges appear; leave them empty and they&apos;re
            skipped.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-950">Frequently asked questions</h2>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-950">Is anything uploaded while I type?</h2>
              <p>
                No — the README is assembled in your browser. The only network request happens if
                you explicitly click <em>Share as link</em>, which publishes the markdown to a URL
                (with an edit token, expiring in 30 days) so you can send a draft to a teammate
                before committing it.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-950">Can I edit the result afterwards?</h2>
              <p>
                Absolutely — the output is plain markdown, meant as a strong starting point.
                Download it, drop it in your repo, and extend it with project-specific sections
                (architecture, benchmarks, screenshots) as the project grows.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-950">Which license should I pick?</h2>
              <p>
                Not legal advice, but as a rough map of common practice: MIT is the most common
                choice for libraries (short and permissive), Apache-2.0 adds an explicit patent
                grant, and GPL-3.0 requires derivative works to stay open source. See{' '}
                <a href="https://choosealicense.com" target="_blank" rel="noopener noreferrer" className="text-indigo-700 underline">
                  choosealicense.com
                </a>{' '}
                for a fuller comparison.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-950">Does this work for non-code projects?</h2>
              <p>
                Yes — skip the npm field, put whatever setup steps you have in the install box,
                and the structure works for datasets, courses, design systems, or documentation
                repos just as well.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl bg-indigo-50 p-6">
          <h2 className="text-xl font-semibold text-gray-950">More markdown tools</h2>
          <p>
            <Link href="/readme-templates" className="text-indigo-700 underline">README templates</Link>{' · '}
            <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">Markdown cheat sheet</Link>{' · '}
            <Link href="/markdown-table-generator" className="text-indigo-700 underline">Table generator</Link>{' · '}
            <Link href="/markdown-formatter" className="text-indigo-700 underline">Markdown formatter</Link>{' · '}
            <Link href="/markdown-to-pdf" className="text-indigo-700 underline">Markdown to PDF</Link>{' · '}
            <Link href="/" className="text-indigo-700 underline">Share markdown as a link</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
