import type { MermaidExamplesPage } from './types';

export const PAGE: MermaidExamplesPage = {
  slug: 'mermaid-gantt-chart-examples',
  title: 'Mermaid Gantt Chart Examples — Syntax and Copyable Code',
  description:
    'Mermaid Gantt chart syntax with copyable examples rendered live: dateFormat, sections, durations, after, milestones, crit and done, weekends, axisFormat.',
  h1: 'Mermaid Gantt chart examples',
  label: 'Gantt chart',
  updated: '2026-11-03',
  answer:
    'A Mermaid Gantt chart starts with the `gantt` keyword, an optional `title` and a `dateFormat`, then one line per task: the task name, a colon, and comma-separated metadata such as tags, an ID, a start date or `after` another task, and a duration. Sections group the rows. Every example below is rendered live from its code.',
  examples: [
    {
      id: 'basic',
      title: 'Basic Gantt chart',
      intro:
        'The smallest useful chart: `dateFormat` tells Mermaid how to read your dates, `section` starts a group of rows, and each task gives a start date and a duration. A task with only a duration starts where the task on the line above it ends.',
      code: `gantt
    title Website relaunch
    dateFormat YYYY-MM-DD
    section Design
        Wireframes          :2026-01-05, 4d
        Visual design       :5d
    section Build
        Front end           :8d
        Content migration   :4d
    section Launch
        QA and fixes        :3d`,
    },
    {
      id: 'dependencies',
      title: 'Dependencies with after and until',
      intro:
        'Give a task an ID and later tasks can start `after` it. List several IDs and the task waits for the last of them to finish. `until` ends a task when another one starts; it needs Mermaid 10.9.0 or later. `axisFormat %b %d` keeps the dates on the axis short.',
      code: `gantt
    title Mobile app release
    dateFormat YYYY-MM-DD
    axisFormat %b %d
    section Backend
        API design          :api, 2026-02-02, 5d
        API build           :build, after api, 10d
    section Apps
        iOS screens         :ios, 2026-02-02, 12d
        Android screens     :android, 2026-02-04, 12d
        Integrate API       :integrate, after build ios android, 4d
    section Release
        Beta testing        :beta, after integrate, until launch
        Store launch        :milestone, launch, 2026-03-09, 0d`,
    },
    {
      id: 'done-active-crit',
      title: 'Done, active and critical tasks',
      intro:
        'Tags change how a bar is drawn: `done` for finished work, `active` for work in progress and `crit` for the critical path. Tags go first in the metadata, before the ID, and `crit` combines with either of the other two.',
      code: `gantt
    title Sprint 14
    dateFormat YYYY-MM-DD
    section Stories
        Rate-limit login       :done, s1, 2026-03-02, 3d
        Password reset email   :active, s2, after s1, 3d
        Audit log export       :s3, after s2, 4d
    section Release blockers
        Security review        :crit, done, r1, 2026-03-02, 2d
        Pen-test fixes         :crit, active, r2, after r1, 4d
        Release sign-off       :crit, r3, after r2, 1d`,
    },
    {
      id: 'milestones',
      title: 'Milestones',
      intro:
        'Add the `milestone` tag and a zero duration to mark a single moment such as a deadline or a launch. Mermaid places the marker at the start date plus half the duration, so `0d` puts it exactly on the date.',
      code: `gantt
    title Conference talk
    dateFormat YYYY-MM-DD
    section Proposal
        Write abstract        :abs, 2026-04-01, 6d
        Submission deadline   :milestone, cfp, 2026-04-10, 0d
    section Talk
        Draft slides          :slides, after cfp, 14d
        Rehearsals            :reh, after slides, 5d
        Talk day              :milestone, after reh, 0d`,
    },
    {
      id: 'excludes-weekends',
      title: 'Exclude weekends and holidays',
      intro:
        '`excludes weekends` skips Saturdays and Sundays, and dates in your `dateFormat` add single days such as a public holiday. Mermaid does not cut a gap into a bar: it extends the task by the excluded days, so `4d` still means four working days.',
      code: `gantt
    title Onboarding plan (working days only)
    dateFormat YYYY-MM-DD
    excludes weekends 2026-05-25
    section Week one
        Laptop and accounts    :a1, 2026-05-20, 2d
        Codebase walkthrough   :a2, after a1, 3d
    section First ticket
        Small bug fix          :a3, after a2, 4d
        Code review and ship   :a4, after a3, 2d`,
    },
    {
      id: 'axis-format',
      title: 'Axis labels and weekly ticks',
      intro:
        '`axisFormat` sets the dates printed under the chart using d3 format codes, here `%b %d` for "Jan 05". `tickInterval` (Mermaid 10.3.0+) fixes the spacing of the ticks, and `weekday monday` starts weekly ticks on Monday instead of Sunday.',
      code: `gantt
    title Q1 roadmap
    dateFormat YYYY-MM-DD
    axisFormat %b %d
    tickInterval 1week
    weekday monday
    section Platform
        Billing v2           :2026-01-05, 4w
        Usage dashboards     :3w
    section Growth
        Referral program     :2026-01-12, 5w
        Pricing page test    :2w`,
    },
    {
      id: 'hours-and-minutes',
      title: 'A schedule in hours and minutes',
      intro:
        'Gantt charts also work within a single day: set `dateFormat HH:mm`, give durations in `m` or `h`, and print times on the axis with `%H:%M`. `todayMarker off` hides the vertical line Mermaid draws at the current date and time.',
      code: `gantt
    title Release day runbook
    dateFormat HH:mm
    axisFormat %H:%M
    todayMarker off
    section Prepare
        Freeze main branch    :09:00, 30m
        Build and sign        :45m
    section Deploy
        Canary rollout        :crit, 60m
        Full rollout          :crit, 90m
    section Verify
        Smoke tests           :30m
        All clear             :milestone, 0m`,
    },
    {
      id: 'today-marker',
      title: 'Roadmap with a styled today marker',
      intro:
        'The today marker is a vertical line at the current date, drawn only while today falls inside the chart. Put CSS properties after `todayMarker` to restyle it; `axisFormat %b %Y` labels a long roadmap by month.',
      code: `gantt
    title Product roadmap
    dateFormat YYYY-MM-DD
    axisFormat %b %Y
    todayMarker stroke-width:4px,stroke:#4f46e5,opacity:0.6
    section Product
        Editor rewrite         :done, 2026-06-01, 120d
        Team workspaces        :active, 2026-09-15, 150d
        Offline mode           :2027-02-01, 90d
    section Infrastructure
        Database migration     :done, 2026-07-01, 60d
        Multi-region hosting   :2026-10-01, 180d`,
    },
  ],
  sections: [
    {
      h2: 'How does Mermaid work out the dates of a task?',
      paragraphs: [
        'Every task line is a name, a colon, and metadata separated by commas. Tags come first if you use any (`done`, `active`, `crit`, `milestone`). What remains is read by position: one item is the end, given as a date or a duration, and the task starts where the previous line ended; two items are a start and an end; three items are an ID, a start and an end. The start can be a date in your `dateFormat` or `after` one or more task IDs, and the end can be a date, a duration, or `until` another task.',
        'Durations are a number and a unit: `ms`, `s`, `m` (minutes), `h`, `d`, `w`, `M` (months) or `y`, and decimals such as `1.5d` are allowed. Mermaid’s documentation warns that an invalid token such as `3dX` is ignored and the task gets zero duration, so a typo shows up as a missing bar rather than an error.',
      ],
      table: {
        head: ['Metadata after the colon', 'Start', 'End'],
        rows: [
          ['`2026-01-05, 5d`', 'The date given', 'Start plus 5 days'],
          ['`5d`', 'End of the task on the line above', 'Start plus 5 days'],
          ['`2026-01-05, 2026-01-09`', 'The first date', 'The second date'],
          ['`id1, after a b, 4d`', 'The latest end of tasks `a` and `b`', 'Start plus 4 days'],
          ['`id2, 2026-01-05, until c`', 'The date given', 'Start of task `c` (Mermaid 10.9.0+)'],
          ['`milestone, m1, 2026-03-09, 0d`', 'The date given', 'A single point: a milestone'],
        ],
      },
    },
    {
      h2: 'What is the difference between dateFormat and axisFormat?',
      paragraphs: [
        '`dateFormat` is how Mermaid reads the dates you type. It uses Day.js tokens and defaults to `YYYY-MM-DD`. `axisFormat` is how Mermaid prints dates on the axis. It uses d3 time-format codes, which start with a percent sign, and also defaults to a year-month-day layout. The two are independent: you can type ISO dates and print `Jan 05`, or type times with `HH:mm` and print `%H:%M`, as in the runbook example.',
      ],
      table: {
        head: ['Token', 'Used in', 'Meaning'],
        rows: [
          ['`YYYY`, `MM`, `DD`', '`dateFormat`', 'Four-digit year, month number, day of month'],
          ['`HH:mm`', '`dateFormat`', '24-hour time'],
          ['`X`', '`dateFormat`', 'Unix timestamp in seconds'],
          ['`%Y`, `%m`, `%d`', '`axisFormat`', 'Year, zero-padded month, zero-padded day'],
          ['`%b`, `%B`', '`axisFormat`', 'Abbreviated or full month name'],
          ['`%a`', '`axisFormat`', 'Abbreviated weekday name'],
          ['`%H:%M`', '`axisFormat`', 'Hours and minutes, 24-hour clock'],
          ['`%W`', '`axisFormat`', 'Week number of the year, weeks starting on Monday'],
        ],
      },
    },
    {
      h2: 'Which other Gantt options does Mermaid have?',
      paragraphs: [
        'These are the remaining Gantt keywords and settings from Mermaid’s documentation, with the version that introduced the newer ones. Keywords go on their own line after `gantt`; `displayMode` and `topAxis` go in a `config` block at the top of the diagram, under `gantt`.',
      ],
      table: {
        head: ['Option', 'What it does'],
        rows: [
          ['`weekend friday`', 'With `excludes weekends`, treats Friday and Saturday as the weekend (Mermaid 11.0.0+)'],
          ['Several `excludes` lines', 'Splits a long list of excluded dates across lines (Mermaid 11.16.0+)'],
          ['`tickInterval 1day`', 'Fixed tick spacing: a number plus `millisecond`, `second`, `minute`, `hour`, `day`, `week` or `month` (10.3.0+)'],
          ['`vert` tag', 'Draws a vertical marker line at a date without taking up a row (Mermaid 11.7.0+)'],
          ['`displayMode: compact`', 'Puts several tasks of a section on the same row when they do not overlap'],
          ['`topAxis: true`', 'Adds the date labels above the chart as well'],
          ['`click id href "url"`', 'Turns a task into a link, only where the page renders Mermaid with `securityLevel` set to `loose`'],
          ['`%%` comment', 'A line starting with two percent signs is ignored'],
        ],
      },
    },
    {
      h2: 'Why is my Mermaid Gantt chart not rendering?',
      paragraphs: [
        'Start with the metadata order. Tags must come before the ID: `done, t1, 2026-05-18, 3d` works, while `t1, done, 2026-05-18, 3d` makes the whole diagram fail. A task name cannot contain a colon, because the first colon starts the metadata. Every `section` needs a name; a bare `section` line breaks the drawing. And `excludes` accepts dates, weekday names and `weekends`, but not `weekdays`.',
        'Some mistakes do not raise an error at all. A date typed in a different layout from your `dateFormat`, or an `after` that names an ID that does not exist, can still render, with the bar somewhere you did not expect. If a bar is missing or misplaced, check the IDs and the date layout first. Finally, check the renderer’s version: `until` needs 10.9.0, `weekend` 11.0.0, `vert` 11.7.0 and several `excludes` lines 11.16.0, and a platform on an older Mermaid will reject or ignore them.',
      ],
    },
    {
      h2: 'Should you use a Gantt chart or a timeline?',
      paragraphs: [
        'Use a Gantt chart when dates, durations and dependencies matter: a project plan, a release schedule, a sprint. Use Mermaid’s [timeline](/mermaid-timeline-examples) when you only need the order of events grouped by period, such as a product history, because it needs no dates or durations at all. To show how a total splits into parts rather than how work is scheduled, a [pie chart](/mermaid-pie-chart-examples) is the better fit.',
      ],
    },
  ],
  faq: [
    {
      q: 'How do you make one task start after another in a Mermaid Gantt chart?',
      a: 'Give the first task an ID, the first item after any tags, as in `Design :des, 2026-01-05, 5d`. Then start the next task with `after des`, as in `Build :after des, 10d`. A task can wait for several tasks at once, `after des api`, and then starts when the last of them ends. A task with no start at all begins where the task on the line above ends, which is often all you need.',
    },
    {
      q: 'How do you exclude weekends and holidays in a Mermaid Gantt chart?',
      a: 'Add `excludes weekends` after `dateFormat`, and add specific dates to the same line, written in your `dateFormat`, for holidays. Excluded days are shaded on the chart and do not count towards durations, so a task that crosses a weekend gets longer instead of losing days. From Mermaid 11.0.0, `weekend friday` makes Friday and Saturday the weekend.',
    },
    {
      q: 'Does Mermaid mark tasks as done automatically?',
      a: 'No. `done` and `active` are tags you write yourself; Mermaid does not compare them with today’s date. What it does draw automatically is the today marker, a vertical line at the current date whenever today falls inside the chart. You can restyle that line with `todayMarker` followed by CSS properties or hide it with `todayMarker off`, but updating task status stays a manual edit.',
    },
    {
      q: 'Does GitHub render Mermaid Gantt charts?',
      a: 'Yes. GitHub renders fenced `mermaid` blocks in Markdown files, issues, pull requests, discussions and wikis with the Mermaid library, so the Gantt syntax on this page works there. GitHub chooses which Mermaid version it runs, so newer options such as several `excludes` lines may not work there yet. Its documentation suggests a one-word `info` diagram to show the version in use. See [how Mermaid works in Markdown](/mermaid-in-markdown).',
    },
    {
      q: 'Can a Mermaid Gantt task link to a web page?',
      a: 'Yes, with a `click` line such as `click t1 href "https://example.com"`, where `t1` is the task ID. Mermaid only activates links and callbacks when the page renders diagrams with `securityLevel` set to `loose`; with `strict` they are ignored. Docs MD renders with `strict`, so a `click` line here is skipped without breaking the rest of the chart.',
    },
  ],
  sources: [
    { label: 'Mermaid documentation: Gantt diagrams', url: 'https://mermaid.js.org/syntax/gantt.html' },
    { label: 'Mermaid changelog (versions of newer Gantt options)', url: 'https://github.com/mermaid-js/mermaid/blob/develop/packages/mermaid/CHANGELOG.md' },
    { label: 'GitHub Docs: Creating diagrams', url: 'https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams' },
  ],
  related: ['/mermaid-in-markdown', '/mermaid-timeline-examples', '/markdown-to-pdf', '/markdown-viewer'],
};
