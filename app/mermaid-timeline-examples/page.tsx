import type { Metadata } from 'next';
import Link from 'next/link';
import CopyButton from '@/components/CopyButton';
import MermaidDiagram from '@/components/MermaidDiagram';

export const metadata: Metadata = {
  title: 'Mermaid Timeline Examples — Syntax and Copyable Code',
  description:
    'Mermaid timeline syntax with five copyable examples rendered live: basic timeline, multiple events per period, sections/eras, a project roadmap, and styling. Plus how to embed one in markdown.',
};

const EXAMPLES: Array<{ id: string; title: string; intro: string; code: string; after?: string }> = [
  {
    id: 'basic',
    title: 'Basic timeline',
    intro:
      'The whole syntax in four lines: the timeline keyword, an optional title, then one time period per line with events after colons.',
    code: `timeline
    title History of Social Media
    2002 : LinkedIn founded
    2004 : Facebook launches
    2006 : Twitter goes live
    2010 : Instagram appears`,
  },
  {
    id: 'multiple-events',
    title: 'Multiple events per period',
    intro:
      'Chain extra events onto one period with additional colons — either on the same line or indented on the following lines.',
    code: `timeline
    title Product Year One
    Q1 : Prototype built
       : First user interviews
    Q2 : Private beta
       : Pricing decided
    Q3 : Public launch
       : First 1,000 users
    Q4 : Break even`,
  },
  {
    id: 'sections',
    title: 'Sections (eras)',
    intro:
      'Group periods into named eras with the section keyword. Each section gets its own background color band automatically.',
    code: `timeline
    title Programming Languages by Era
    section Foundations
        1957 : Fortran
        1972 : C
    section Object Orientation
        1983 : C++
        1995 : Java : JavaScript
    section Modern Era
        2009 : Go
        2014 : Swift`,
  },
  {
    id: 'roadmap',
    title: 'Project roadmap',
    intro:
      'Timelines read better than Gantt charts for high-level roadmaps where exact durations don’t matter — only order and grouping do.',
    code: `timeline
    title Migration Roadmap
    section Preparation
        Week 1 : Audit current schema
        Week 2 : Write migration scripts
               : Set up staging
    section Execution
        Week 3 : Dry run on staging
        Week 4 : Production migration
    section Cleanup
        Week 5 : Remove legacy tables
               : Retro`,
  },
];

export default function MermaidTimelineExamplesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Mermaid timeline examples and syntax',
    description: metadata.description,
    dateModified: '2026-08-29',
    author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
    mainEntityOfPage: 'https://docs-md.com/mermaid-timeline-examples',
  };
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
        Mermaid timeline examples
      </h1>
      <p className="mt-4 max-w-3xl text-base text-gray-600">
        A mermaid timeline starts with the <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">timeline</code> keyword,
        followed by an optional title and one line per time period —{' '}
        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">period : event</code>, with extra colons for extra events.
        Every example below is rendered live from the code next to it; copy any of them as a
        starting point. Updated <time dateTime="2026-08-29">August 29, 2026</time>.
      </p>

      <div className="mt-10 space-y-12">
        {EXAMPLES.map((ex) => (
          <section key={ex.id} id={ex.id} className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-950">{ex.title}</h2>
            <p className="max-w-3xl text-gray-600">{ex.intro}</p>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="relative rounded-2xl border border-gray-200 bg-gray-50">
                <div className="absolute right-3 top-3">
                  <CopyButton content={'```mermaid\n' + ex.code + '\n```'} />
                </div>
                <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-gray-800">{ex.code}</pre>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-gray-200 p-3">
                <MermaidDiagram chart={ex.code} />
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">How do you embed a timeline in markdown?</h2>
          <p>
            Put the code in a fenced block tagged <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">mermaid</code>{' '}
            (the copy buttons above include the fence). GitHub, GitLab, Obsidian, Notion, and Docs
            MD share pages render it as a diagram automatically —{' '}
            <Link href="/" className="text-indigo-700 underline">
              paste one into the editor here
            </Link>{' '}
            to see it live, or check the full fence syntax on the{' '}
            <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">
              cheat sheet
            </Link>
            .
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">Why is my timeline not rendering?</h2>
          <p>
            The usual causes: the renderer ships a mermaid version older than 9.4 (when timeline
            landed); the fence is tagged with nothing or <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">text</code>{' '}
            instead of <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">mermaid</code>; or a colon appears inside an
            event&apos;s text — colons are the delimiter, so write &ldquo;Launch — v2&rdquo; with a
            dash instead. Long event text wraps automatically, but very long <em>period</em> labels
            don&apos;t; keep periods short.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">Timeline vs Gantt — which should you use?</h2>
          <p>
            A timeline shows <em>what happened when</em> — discrete periods with events, no
            durations or dependencies. A Gantt chart (mermaid&apos;s{' '}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">gantt</code> keyword) models start dates, durations, and
            task dependencies. If your data is &ldquo;era → things that happened&rdquo;, timeline
            reads far better; if it&apos;s &ldquo;task A blocks task B&rdquo;, use Gantt.
          </p>
        </section>
      </div>
    </div>
  );
}
