import type { MermaidExamplesPage } from './types';

export const PAGE: MermaidExamplesPage = {
  slug: 'mermaid-diagram-examples',
  title: 'Mermaid Diagram Examples — Every Chart Type, Copyable Code',
  description:
    'Copyable Mermaid diagram examples for every chart type, rendered live: bar, pie, Gantt, timeline, mindmap, git graph, quadrant, sankey and more.',
  h1: 'Mermaid diagram examples',
  label: 'All examples',
  updated: '2026-11-03',
  answer:
    'Every Mermaid chart type in one place: a short, copyable example of each, rendered live with Mermaid 11.16, plus a link to the full page of examples for that type and a table of which chart fits which data. Copy an example, paste it into a `mermaid` code block, and change the labels and numbers.',
  examples: [
    {
      id: 'bar-chart',
      title: 'Bar chart',
      intro: 'Categories on the x-axis, a range on the y-axis, values in a `bar` list; swap `bar` for `line` for a line chart. The config block only sets the bar colour. More on the [bar chart examples](/mermaid-bar-chart-examples) page: horizontal bars, combined plots, labels and colours.',
      code: `---
config:
  themeVariables:
    xyChart:
      plotColorPalette: "#4f46e5"
---
xychart-beta
    title "Monthly sign-ups"
    x-axis [Jan, Feb, Mar, Apr, May, Jun]
    y-axis "Sign-ups" 0 --> 500
    bar [120, 180, 240, 310, 390, 460]`,
    },
    {
      id: 'pie-chart',
      title: 'Pie chart',
      intro: 'One line per slice; Mermaid works out the percentages. The [pie chart examples](/mermaid-pie-chart-examples) page adds `showData`, donut charts, legend position and colours.',
      code: `pie showData
    title Survey responses
    "Yes" : 412
    "No" : 128
    "Not sure" : 60`,
    },
    {
      id: 'gantt-chart',
      title: 'Gantt chart',
      intro: 'Tasks with a start and a duration, grouped in sections; `after` chains tasks and `milestone` marks a date. The [Gantt chart examples](/mermaid-gantt-chart-examples) page covers dependencies, excluded weekends, axis formats and the today marker.',
      code: `gantt
    title Website relaunch
    dateFormat YYYY-MM-DD
    section Design
      Wireframes     :done, des1, 2026-01-05, 10d
      Visual design  :active, des2, after des1, 14d
    section Build
      Front end      :dev1, after des2, 21d
      Content        :dev2, after des2, 14d
    section Launch
      Go live        :milestone, m1, after dev1, 0d`,
    },
    {
      id: 'timeline',
      title: 'Timeline',
      intro: 'Periods and the events in them, in order, with no durations. The [timeline examples](/mermaid-timeline-examples) page adds sections, multiple events per period and styling.',
      code: `timeline
    title Product history
    2023 : Prototype
    2024 : Public beta : First paying customer
    2025 : Version 1.0
    2026 : Mobile app`,
    },
    {
      id: 'mindmap',
      title: 'Mindmap',
      intro: 'Indentation is the whole grammar: each deeper level branches from the line above. Node shapes and markdown text are on the [mindmap examples](/mermaid-mindmap-examples) page.',
      code: `mindmap
  root((Launch plan))
    Marketing
      Blog post
      Newsletter
    Product
      Release notes
      Docs update
    Support
      FAQ refresh`,
    },
    {
      id: 'git-graph',
      title: 'Git graph',
      intro: 'Commits, branches and merges as a diagram, written as the Git commands you would type. Commit types, tags, cherry-picks and orientation are on the [git graph examples](/mermaid-gitgraph-examples) page.',
      code: `gitGraph
    commit id: "init"
    branch feature
    checkout feature
    commit id: "add export"
    commit id: "fix tests"
    checkout main
    merge feature
    commit id: "release" tag: "v1.0"`,
    },
    {
      id: 'quadrant-chart',
      title: 'Quadrant chart',
      intro: 'Points placed by two judgements, each between 0 and 1, in four labelled quadrants. Point styling, classes and theme options are on the [quadrant chart examples](/mermaid-quadrant-chart-examples) page.',
      code: `quadrantChart
    title Effort and impact
    x-axis Low effort --> High effort
    y-axis Low impact --> High impact
    quadrant-1 Big bets
    quadrant-2 Quick wins
    quadrant-3 Fill ins
    quadrant-4 Time sinks
    Dark mode: [0.35, 0.7]
    Search filters: [0.75, 0.85]
    Export to CSV: [0.2, 0.4]
    Rewrite billing: [0.9, 0.3]`,
    },
    {
      id: 'sankey-diagram',
      title: 'Sankey diagram',
      intro: 'CSV rows of source, target and value; link widths follow the values. Budgets, funnels, traffic and the configuration options are on the [sankey diagram examples](/mermaid-sankey-diagram-examples) page.',
      code: `sankey-beta

Visitors,Signed up,1200
Visitors,Left,8800
Signed up,Activated,700
Signed up,Churned,500
Activated,Paid,210
Activated,Free tier,490`,
    },
  ],
  sections: [
    {
      h2: 'Which Mermaid chart for which data?',
      paragraphs: [
        'Mermaid has a type for most things a document needs to show. The chart-style types take data or plans; the UML-style types describe software. Pick by the shape of your data, not by the look of the chart. Three types that did not fit above have their own example pages: [kanban](/mermaid-kanban-examples) for work by status, [radar chart](/mermaid-radar-chart-examples) for items compared across criteria, and [user journey](/mermaid-user-journey-examples) for the steps a person takes and how each one feels.',
      ],
      table: {
        head: ['Your data', 'Chart', 'Keyword', 'Examples'],
        rows: [
          ['Shares of one whole', 'Pie chart', '`pie`', '[pie chart](/mermaid-pie-chart-examples)'],
          ['Amounts by category or over a few periods', 'Bar or line chart', '`xychart-beta`', '[bar chart](/mermaid-bar-chart-examples)'],
          ['Tasks with dates, durations and dependencies', 'Gantt chart', '`gantt`', '[Gantt chart](/mermaid-gantt-chart-examples)'],
          ['Events in order, no durations', 'Timeline', '`timeline`', '[timeline](/mermaid-timeline-examples)'],
          ['Ideas branching from one topic', 'Mindmap', '`mindmap`', '[mindmap](/mermaid-mindmap-examples)'],
          ['Commits, branches and merges', 'Git graph', '`gitGraph`', '[git graph](/mermaid-gitgraph-examples)'],
          ['A short list ranked by two judgements', 'Quadrant chart', '`quadrantChart`', '[quadrant chart](/mermaid-quadrant-chart-examples)'],
          ['Where quantities flow between stages', 'Sankey diagram', '`sankey-beta`', '[sankey diagram](/mermaid-sankey-diagram-examples)'],
          ['Work items by status column', 'Kanban', '`kanban`', '[kanban](/mermaid-kanban-examples)'],
          ['Several items across the same criteria', 'Radar chart', '`radar-beta`', '[radar chart](/mermaid-radar-chart-examples)'],
          ['Steps a person takes and how they feel', 'User journey', '`journey`', '[user journey](/mermaid-user-journey-examples)'],
          ['A process with decisions', 'Flowchart', '`flowchart`', '[flowchart](https://www.chartcraft.dev/flowchart-examples)'],
          ['Messages between participants over time', 'Sequence diagram', '`sequenceDiagram`', '[sequence diagram](https://www.chartcraft.dev/sequence-diagram-examples)'],
          ['Classes and their relationships', 'Class diagram', '`classDiagram`', '[class diagram](https://www.chartcraft.dev/class-diagram-examples)'],
          ['States and the transitions between them', 'State diagram', '`stateDiagram-v2`', '[state diagram](https://www.chartcraft.dev/state-diagram-examples)'],
          ['Database tables and their relations', 'Entity relationship diagram', '`erDiagram`', '[ER diagram](https://www.chartcraft.dev/er-diagram-examples)'],
        ],
      },
    },
    {
      h2: 'How do you use these examples?',
      paragraphs: [
        'Each copy button on this page copies the example wrapped in a fenced code block tagged `mermaid`, which is the form GitHub, GitLab, Obsidian, Notion and VS Code recognise. Paste it into a README, an issue, a note or a wiki page and the platform draws the diagram. Then edit the labels and numbers in place; because the diagram is text, the picture follows. The [Mermaid in Markdown](/mermaid-in-markdown) page shows the embedding on each platform and how to check which Mermaid version a platform runs.',
        'To share a rendered diagram with people who are not in your repository or workspace, paste the Markdown into the [Docs MD editor](/) and send the link: the shared page renders every `mermaid` block with Mermaid 11.16 and prints cleanly, and [PDF export](/markdown-to-pdf) draws the diagrams before converting. The [architecture diagram guide](/share-architecture-diagram) walks through a typical document with several diagrams.',
      ],
    },
    {
      h2: 'Which Mermaid version do the examples need?',
      paragraphs: [
        'Every example on docs-md.com is rendered with Mermaid 11.16 and uses syntax taken from Mermaid’s documentation for that version. Most of the types are old enough to work everywhere: pie, Gantt, git graph and user journey predate Mermaid 10, timeline and mindmap are from 9.x, the quadrant chart from 10.2.0, sankey from 10.3.0 and the XY chart from 10.6.0. Two are recent: kanban needs 11.4.0 and the radar chart 11.6.0.',
        'Individual options are often newer than their chart. The pie chart’s `donutHole` needs 11.16.0, bar chart data labels 11.14.0, and the sankey node options 11.15.0; each example page notes the version next to the option. Where it matters, the examples use the older spellings `xychart-beta` and `sankey-beta`, which every version since the chart was introduced accepts, rather than the suffix-free keywords that only work from 11.10.0.',
      ],
    },
    {
      h2: 'What else can Mermaid draw?',
      paragraphs: [
        'Beyond the types on this page, Mermaid 11.16 documents C4, requirement, block, packet, architecture, treemap and ZenUML diagrams, and several newer experimental types. For a diagram that does not fit any of these, a flowchart is the usual fallback: it has the most shapes and the most control over layout. The [What is a Mermaid diagram](/what-is-a-mermaid-diagram) page explains how the library works and where it renders; Mermaid’s own syntax reference lists every type with its current status.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can I use these Mermaid examples in GitHub README files?',
      a: 'Yes. GitHub renders fenced `mermaid` blocks in Markdown files as well as in issues, pull requests, discussions and wikis, and the copy buttons include the fence. GitHub chooses the Mermaid version it runs, so the newer types (kanban, radar) and newer options may not render there yet; its documentation suggests an `info` block to see the version. The older types on this page render on any version that supports Mermaid.',
    },
    {
      q: 'Which Mermaid chart is best for comparing numbers?',
      a: 'A bar chart, written with the XY chart type. Put the categories on the x-axis and the values in a `bar` list; use a `line` list for change over time, or both for actual against target. Use a pie chart only when the numbers are parts of one whole, and a radar chart when you compare a few items across several criteria that share one scale.',
    },
    {
      q: 'Does Mermaid have a bar chart?',
      a: 'Yes, as part of the XY chart type introduced in Mermaid 10.6.0. The keyword is `xychart-beta` (or `xychart` from 11.10.0), and a `bar [...]` statement draws the bars; `line [...]` draws a line on the same axes, and `horizontal` after the keyword turns the bars sideways. The bar chart examples page shows vertical and horizontal bars, data labels and colours.',
    },
    {
      q: 'Where are the flowchart and sequence diagram examples?',
      a: 'On chartcraft.dev, which covers the UML-style Mermaid types: flowchart, sequence, class, state and entity relationship diagrams, each with worked examples. Docs MD focuses on the chart-style types that show data and plans, and on using Mermaid inside Markdown. The table above links to both sets so you can pick the right type first.',
    },
    {
      q: 'How do I check which Mermaid version a platform runs?',
      a: 'Render the one-word diagram `info` in a `mermaid` code block on that platform; it draws the version number in place of a diagram. GitHub’s documentation recommends this check. Compare the result with the version noted on each example page before using a newer type or option, and prefer `xychart-beta` and `sankey-beta` over the suffix-free keywords when the version is old or unknown.',
    },
  ],
  sources: [
    { label: 'Mermaid documentation: Syntax reference', url: 'https://mermaid.js.org/intro/syntax-reference.html' },
    { label: 'Mermaid changelog', url: 'https://github.com/mermaid-js/mermaid/blob/develop/packages/mermaid/CHANGELOG.md' },
    { label: 'GitHub Docs: Creating diagrams', url: 'https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams' },
  ],
  related: ['/what-is-a-mermaid-diagram', '/mermaid-in-markdown', '/markdown-viewer', '/markdown-to-pdf', '/share-architecture-diagram'],
};
