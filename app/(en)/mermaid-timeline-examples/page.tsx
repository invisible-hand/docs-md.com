import Link from 'next/link';
import type { ReactNode } from 'react';
import CopyButton from '@/components/CopyButton';
import MermaidDiagram from '@/components/MermaidDiagram';
import { pageMetadata } from '@/lib/page-metadata';
import { pageDate } from '@/lib/page-dates';

const UPDATED = pageDate('/mermaid-timeline-examples');

export const metadata = pageMetadata({
  title: 'Mermaid Timeline Examples: Syntax and Markdown',
  description:
    'Copy-paste Mermaid timeline code: syntax line by line, sections, several events per period, process steps, custom colours and the markdown code block.',
  path: '/mermaid-timeline-examples',
  type: 'article',
});

type Example = {
  id: string;
  title: string;
  intro: string;
  /** Mermaid source without the fence; the copy button adds the fence. */
  code: string;
  /** Shown after the rendered diagram. */
  after?: ReactNode;
  /** Print the code inside its ```mermaid fence, as it would sit in a Markdown file. */
  showFence?: boolean;
};

const code = 'rounded bg-gray-100 px-1.5 py-0.5 text-sm';

const EXAMPLES: Example[] = [
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

const COMMON_CASES: Example[] = [
  {
    id: 'history-events-per-year',
    title: 'History timeline with events per year',
    intro:
      'One line per year, and a colon for every event that happened in it. Events for the same year can share the line or continue on indented lines that start with a colon; Mermaid stacks them top to bottom under the year.',
    code: `timeline
    title History of the Web
    1989 : Tim Berners-Lee proposes the World Wide Web
    1991 : First website goes live at CERN
         : WorldWideWeb browser released
    1993 : Mosaic browser
         : CERN puts the Web in the public domain
    1994 : Netscape Navigator
         : W3C founded
    1998 : Google founded
    2004 : First Web 2.0 conference : Firefox 1.0`,
    after: (
      <>
        Years are plain text, so gaps between them are not drawn to scale: 1994 and 1998 sit next to each other.
        Long event text wraps inside its box; force a break with <code className={code}>&lt;br&gt;</code> where you want one.
      </>
    ),
  },
  {
    id: 'project-milestones-sections',
    title: 'Project milestones with sections',
    intro:
      'A section per project phase, a period per milestone date, and the deliverable as the event. Each section becomes a labelled, coloured band and the milestones under it share that colour.',
    code: `timeline
    title Website Relaunch Milestones
    section Discovery
        Jan 12 : Kickoff
        Feb 2 : Research complete
    section Build
        Mar 2 : Alpha
        Apr 6 : Beta : Content frozen
    section Launch
        May 4 : General availability
        May 18 : Retrospective`,
    after: (
      <>
        Sections and milestones appear in the order written, nothing is sorted. If the spacing between dates matters,
        draw the same milestones as a{' '}
        <Link href="/mermaid-gantt-chart-examples#milestones" className="text-indigo-700 underline">
          milestones-only Gantt chart
        </Link>
        , which puts them on a real date axis.
      </>
    ),
  },
  {
    id: 'process-steps',
    title: 'Step-by-step process timeline',
    intro:
      'Periods do not have to be dates. Label them Step 1, Step 2 and so on and list each step’s tasks as events, and the timeline becomes a process diagram read left to right.',
    code: `timeline
    title Pull Request Review Process
    Step 1 : Open the pull request
           : Fill in the template
    Step 2 : Automated checks run
    Step 3 : Reviewer assigned
           : Changes requested
    Step 4 : Approvals collected
    Step 5 : Squash and merge
           : Branch deleted`,
    after: (
      <>
        Without sections, every step gets its own colour. To give the steps one shared colour, see the{' '}
        <a href="#custom-colours" className="text-indigo-700 underline">
          colours example
        </a>{' '}
        below. For tasks with durations and dependencies, a Gantt chart is the better fit (compared at the end of this page).
      </>
    ),
  },
  {
    id: 'markdown-code-block',
    title: 'Timeline inside a markdown code block',
    intro:
      'This is the block exactly as it goes into a README, issue, wiki page or note: a fenced code block tagged mermaid with the timeline inside. The code box shows the fence; the diagram under it is what the block renders as.',
    code: `timeline
    title Release History
    v1.0 : Initial release
    v1.1 : Dark mode : Export to PDF
    v2.0 : New editor`,
    showFence: true,
    after: (
      <>
        The fence is three backticks followed by the word <code className={code}>mermaid</code> on its own line, the
        diagram, then three closing backticks; nothing else goes inside. It renders as a diagram where Markdown is drawn
        with Mermaid — GitHub, GitLab, Obsidian, VS Code’s preview and Docs MD — and shows as plain code everywhere
        else. In Notion you pick Mermaid as a code block’s language instead of typing the fence. Platform details are on{' '}
        <Link href="/mermaid-in-markdown" className="text-indigo-700 underline">
          Mermaid in Markdown
        </Link>
        .
      </>
    ),
  },
  {
    id: 'custom-colours',
    title: 'Timeline with custom colours (disableMulticolor / theme)',
    intro:
      'Colours come from the theme, not from the timeline syntax. A config block at the top of the diagram sets the theme and overrides its cScale variables: cScale0 colours the first section, cScale1 the second, and so on up to cScale11, with cScaleLabel0 to cScaleLabel11 for the text on each.',
    code: `---
config:
  theme: base
  themeVariables:
    cScale0: '#4f46e5'
    cScaleLabel0: '#ffffff'
    cScale1: '#0f766e'
    cScaleLabel1: '#ffffff'
    cScale2: '#b45309'
    cScaleLabel2: '#ffffff'
---
timeline
    title Company History
    section Startup
        2019 : Founded
        2020 : Seed round
    section Growth
        2022 : Series A : 50 employees
    section Scale
        2024 : Europe launch
        2026 : 500 employees`,
    after: (
      <>
        Without sections, each period gets its own colour from the same <code className={code}>cScale</code> list. To
        give every period one colour instead, add the timeline option under <code className={code}>config</code>:{' '}
        <code className={code}>timeline:</code> on one line and <code className={code}>disableMulticolor: true</code>{' '}
        indented beneath it. Mermaid’s documented themes include <code className={code}>default</code>,{' '}
        <code className={code}>neutral</code>, <code className={code}>dark</code>, <code className={code}>forest</code>{' '}
        and <code className={code}>base</code>; <code className={code}>base</code> is the one meant for overriding
        variables. The <code className={code}>---</code> config block needs Mermaid 10.5 or later; on an older renderer,
        delete it and the timeline still draws in the default colours.
      </>
    ),
  },
];

const ALL_EXAMPLES = [...EXAMPLES, ...COMMON_CASES];

const SYNTAX_ROWS: Array<[string, string]> = [
  ['timeline', 'Always the first line. timeline TD draws the diagram top-down instead of left to right (Mermaid 11.14 or later).'],
  ['title History of the Web', 'Optional. Everything after title becomes the heading above the diagram.'],
  ['section Discovery', 'Optional. Starts a named group: every period until the next section line belongs to it and shares its colour.'],
  ['1991 : First website', 'A time period, then a colon with a space on each side, then an event. Both are plain text, so a period can be a year, a date, a quarter or a step name.'],
  ['1991 : First website : First browser', 'Several events on one line, each introduced by another colon.'],
  ['     : Another event', 'A line that starts with a colon adds one more event to the period above it. Indentation is cosmetic.'],
  ['%% draft, check dates', 'A comment. Lines starting with %% are ignored.'],
  ['accTitle: Web history', 'An accessible title read by screen readers; accDescr: adds a description. Neither is drawn.'],
  ['Sea levels rise.<br>Britain becomes an island', 'Text wraps on its own; <br> forces a line break inside an event or a section label.'],
];

function ExampleBlock({ ex, level }: { ex: Example; level: 'h2' | 'h3' }) {
  const Heading = level;
  const shown = ex.showFence ? '```mermaid\n' + ex.code + '\n```' : ex.code;
  return (
    <section id={ex.id} className="scroll-mt-8 space-y-4">
      <Heading
        className={
          level === 'h2'
            ? 'text-2xl font-semibold tracking-tight text-gray-950'
            : 'text-xl font-semibold tracking-tight text-gray-950'
        }
      >
        {ex.title}
      </Heading>
      <p className="max-w-3xl text-gray-600">{ex.intro}</p>
      <div className="space-y-4">
        <div className="relative rounded-2xl border border-gray-200 bg-gray-50">
          <div className="absolute right-3 top-3">
            <CopyButton content={'```mermaid\n' + ex.code + '\n```'} />
          </div>
          <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-gray-800">{shown}</pre>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6" data-mermaid-example={ex.id}>
          <MermaidDiagram chart={ex.code} fill />
        </div>
      </div>
      {ex.after && <p className="max-w-3xl text-gray-600">{ex.after}</p>}
    </section>
  );
}

export default function MermaidTimelineExamplesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Mermaid timeline examples and syntax',
    description: metadata.description,
    dateModified: UPDATED,
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
        A mermaid timeline starts with the <code className={code}>timeline</code> keyword,
        followed by an optional title and one line per time period —{' '}
        <code className={code}>period : event</code>, with extra colons for extra events.
        Every example below is rendered live from the code next to it, and the copy button on each one copies it
        as a ready <code className={code}>```mermaid</code> code block for Markdown. The first four cover the
        syntax; the five after the{' '}
        <a href="#syntax" className="text-indigo-700 underline">
          line-by-line reference
        </a>{' '}
        are complete timelines for common cases. Updated{' '}
        <time dateTime={UPDATED}>November 3, 2026</time>.
      </p>
      <nav aria-label="Examples on this page" className="mt-5 flex flex-wrap gap-2 text-xs">
        {ALL_EXAMPLES.map((ex) => (
          <a
            key={ex.id}
            href={`#${ex.id}`}
            className="rounded-full border border-gray-200 px-3 py-1 text-gray-700 hover:border-indigo-300 hover:text-indigo-700"
          >
            {ex.title}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-12">
        {EXAMPLES.map((ex) => (
          <ExampleBlock key={ex.id} ex={ex} level="h2" />
        ))}
      </div>

      <section id="syntax" className="mx-auto mt-16 max-w-3xl scroll-mt-8 space-y-4 text-gray-700">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Mermaid timeline syntax, line by line</h2>
        <p>
          Every line of a timeline is one of a handful of statements. The table lists each kind in the order it
          usually appears, using lines from the examples on this page.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-4 py-2.5 font-semibold text-gray-950">Line</th>
                <th className="px-4 py-2.5 font-semibold text-gray-950">What it does</th>
              </tr>
            </thead>
            <tbody>
              {SYNTAX_ROWS.map(([line, meaning]) => (
                <tr key={line} className="border-b border-gray-100 align-top">
                  <td className="whitespace-pre px-4 py-2.5 font-mono text-[0.85em] text-gray-900">{line}</td>
                  <td className="px-4 py-2.5 text-gray-700">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Three rules cover most mistakes. The colon that separates a period from its events, and events from each
          other, needs a space after it: <code className={code}>2002 : LinkedIn</code> works and{' '}
          <code className={code}>2002 :LinkedIn</code> is a parse error, while a colon followed by a space inside event
          text, as in &ldquo;Launch: v2&rdquo;, silently splits it into two events (times such as{' '}
          <code className={code}>09:30</code> are fine). Order is drawing order: the first period is drawn at the left
          and the first event of a period at the top, and nothing is sorted. And a <code className={code}>#</code>{' '}
          inside a period label starts a comment, so &ldquo;Sprint #3&rdquo; loses everything from the hash on; write
          &ldquo;Sprint 3&rdquo; instead.
        </p>
        <p className="text-sm">
          Full reference with every keyword and option:{' '}
          <a href="https://www.chartcraft.dev/mermaid-timeline-syntax" className="text-indigo-700 underline" rel="noopener noreferrer">
            Mermaid timeline syntax on ChartCraft
          </a>
          {' · '}
          <a href="https://mermaid.js.org/syntax/timeline.html" className="text-indigo-700 underline" rel="noopener noreferrer">
            Mermaid documentation: Timeline
          </a>
          .
        </p>
      </section>

      <section id="common-cases" className="mt-16 scroll-mt-8 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
          Timeline examples you can copy for common cases
        </h2>
        <p className="max-w-3xl text-gray-600">
          Five complete timelines for the things people most often draw: a history with several events per year,
          project milestones grouped by phase, a step-by-step process, the fenced code block that goes into a
          Markdown file, and a timeline in your own colours. Copy one and replace the text.
        </p>
        <div className="mt-6 space-y-12">
          {COMMON_CASES.map((ex) => (
            <ExampleBlock key={ex.id} ex={ex} level="h3" />
          ))}
        </div>
      </section>

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">How do you embed a timeline in markdown?</h2>
          <p>
            Put the code in a fenced block tagged <code className={code}>mermaid</code>{' '}
            (the copy buttons above include the fence, and the{' '}
            <a href="#markdown-code-block" className="text-indigo-700 underline">
              code block example
            </a>{' '}
            shows the block exactly as it goes into a file). GitHub, GitLab, Obsidian, VS Code&apos;s Markdown preview
            and Docs MD share pages render it as a diagram automatically; in Notion you choose Mermaid as a code
            block&apos;s language instead of typing the fence.{' '}
            <Link href="/" className="text-indigo-700 underline">
              Paste one into the editor here
            </Link>{' '}
            to see it live, check the full fence syntax on the{' '}
            <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">
              cheat sheet
            </Link>
            , or see the per-platform notes on{' '}
            <Link href="/mermaid-in-markdown" className="text-indigo-700 underline">
              Mermaid in Markdown
            </Link>
            .
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">Why is my timeline not rendering?</h2>
          <p>
            The usual causes: the renderer ships a mermaid version older than 9.4 (when timeline landed), or older
            than what an option needs — <code className={code}>timeline TD</code> is 11.14 and the{' '}
            <code className={code}>---</code> config block is 10.5; the fence is tagged with nothing or{' '}
            <code className={code}>text</code> instead of <code className={code}>mermaid</code>; or a colon is missing
            its space — <code className={code}>2002 :LinkedIn</code> fails to parse. A colon with a space inside an
            event does not stop the drawing but splits the event in two, so write &ldquo;Launch — v2&rdquo; with a
            dash instead, and a <code className={code}>#</code> in a period label cuts the line short. Long event text
            wraps automatically, but very long <em>period</em> labels don&apos;t; keep periods short. To find the
            broken line, paste the block into the{' '}
            <Link href="/" className="text-indigo-700 underline">
              editor
            </Link>
            , which shows the parser&apos;s error.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">Timeline vs Gantt — which should you use?</h2>
          <p>
            A timeline shows <em>what happened when</em> — discrete periods with events, no
            durations or dependencies. A Gantt chart (mermaid&apos;s{' '}
            <code className={code}>gantt</code> keyword) models start dates, durations, and
            task dependencies. If your data is &ldquo;era → things that happened&rdquo;, timeline
            reads far better; if it&apos;s &ldquo;task A blocks task B&rdquo;, use Gantt. The middle ground is a Gantt
            chart made only of milestones, which keeps the timeline look but spaces events by their real dates; see the{' '}
            <Link href="/mermaid-gantt-chart-examples#milestones" className="text-indigo-700 underline">
              milestones example
            </Link>{' '}
            on the Gantt page.
          </p>
        </section>
        <section className="no-print space-y-3 rounded-2xl bg-indigo-50 p-6">
          <h2 className="text-xl font-semibold text-gray-950">More Mermaid examples</h2>
          <p className="text-sm">
            <Link href="/mermaid-gantt-chart-examples" className="text-indigo-700 underline">Gantt chart</Link>{' · '}
            <Link href="/mermaid-pie-chart-examples" className="text-indigo-700 underline">Pie chart</Link>{' · '}
            <Link href="/mermaid-mindmap-examples" className="text-indigo-700 underline">Mindmap</Link>{' · '}
            <Link href="/mermaid-gitgraph-examples" className="text-indigo-700 underline">Git graph</Link>{' · '}
            <Link href="/mermaid-in-markdown" className="text-indigo-700 underline">Mermaid in Markdown</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
