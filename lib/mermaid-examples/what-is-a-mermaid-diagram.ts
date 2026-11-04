import type { MermaidExamplesPage } from './types';

export const PAGE: MermaidExamplesPage = {
  slug: 'what-is-a-mermaid-diagram',
  title: 'What Is a Mermaid Diagram? Types and Syntax',
  description:
    'A Mermaid diagram is a chart written as text and rendered to SVG. What Mermaid is, its diagram types with small live examples, and where the code renders.',
  h1: 'What is a Mermaid diagram?',
  label: 'What is Mermaid',
  updated: '2026-11-03',
  answer:
    'A Mermaid diagram is a chart or diagram written as plain text in a small syntax and drawn by the Mermaid JavaScript library as an SVG image wherever the text is displayed. Put the text in a code block tagged `mermaid` and GitHub, GitLab, Notion, Obsidian, VS Code and Docs MD draw it. The examples below are rendered live.',
  examples: [
    {
      id: 'pie',
      title: 'Pie chart',
      intro: 'The smallest Mermaid diagram that shows the idea: a keyword, a title and three lines of data. Full syntax and options are on the [pie chart examples](/mermaid-pie-chart-examples) page.',
      code: `pie title Where the week went
    "Meetings" : 12
    "Deep work" : 20
    "Email" : 8`,
    },
    {
      id: 'bar',
      title: 'Bar chart (XY chart)',
      intro: 'Bar and line charts share the XY chart type. Categories go on the x-axis, a range on the y-axis, values in a `bar` or `line` list; the config block only sets the colour. See the [bar chart examples](/mermaid-bar-chart-examples).',
      code: `---
config:
  themeVariables:
    xyChart:
      plotColorPalette: "#4f46e5"
---
xychart-beta
    title "Sign-ups per month"
    x-axis [Jan, Feb, Mar, Apr]
    y-axis "Sign-ups" 0 --> 400
    bar [120, 180, 260, 350]`,
    },
    {
      id: 'gantt',
      title: 'Gantt chart',
      intro: 'Tasks with dates and durations on a calendar, grouped in sections. `after des1` makes a task start when another ends; see the [Gantt chart examples](/mermaid-gantt-chart-examples).',
      code: `gantt
    title Website relaunch
    dateFormat YYYY-MM-DD
    section Design
      Wireframes     :done, des1, 2026-01-05, 10d
      Visual design  :active, des2, after des1, 14d
    section Build
      Front end      :dev1, after des2, 21d
      Content        :dev2, after des2, 14d`,
    },
    {
      id: 'timeline',
      title: 'Timeline',
      intro: 'Events in order without durations; one line per period, more than one event per period with extra colons. See the [timeline examples](/mermaid-timeline-examples).',
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
      intro: 'Ideas branching from a central topic, with structure given by indentation alone. Shapes and markdown text are covered in the [mindmap examples](/mermaid-mindmap-examples).',
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
      id: 'kanban',
      title: 'Kanban board',
      intro: 'Columns and cards, with optional metadata on each card. Kanban needs Mermaid 11.4.0 or later; see the [kanban examples](/mermaid-kanban-examples).',
      code: `kanban
  todo[To do]
    t1[Write release notes]
  doing[In progress]
    t2[Fix export bug]@{ assigned: 'li', priority: 'High' }
  done[Done]
    t3[Update pricing page]`,
    },
    {
      id: 'radar',
      title: 'Radar chart',
      intro: 'Several items compared across the same criteria on spokes. Radar charts need Mermaid 11.6.0 or later; see the [radar chart examples](/mermaid-radar-chart-examples).',
      code: `radar-beta
  title Laptop comparison
  axis b["Battery"], s["Screen"], w["Weight"], p["Price"]
  curve a["Model A"]{4, 5, 3, 2}
  curve c["Model B"]{3, 3, 5, 4}
  max 5
  min 0`,
    },
    {
      id: 'journey',
      title: 'User journey',
      intro: 'The steps a person takes, each with a 1-to-5 score drawn as a face and the actors involved. See the [user journey examples](/mermaid-user-journey-examples).',
      code: `journey
    title Checkout
    section Pay
      Enter address: 2: Shopper
      Enter card details: 1: Shopper
    section After
      Confirmation email: 5: Shopper`,
    },
  ],
  sections: [
    {
      h2: 'What is Mermaid?',
      paragraphs: [
        'Mermaid is an open-source JavaScript library that turns Markdown-inspired text definitions into diagrams. Its own documentation sums it up as a diagramming and charting tool whose main purpose is to help documentation keep up with development: because a diagram is text, it can live next to the code, be edited in a pull request and be regenerated whenever it changes, instead of going stale as an exported image. Mermaid was created by Knut Sveidqvist; the GitHub repository dates from November 2014, the code is MIT-licensed, and the project won the 2019 JS Open Source Award for the most exciting use of technology.',
        'A Mermaid diagram, then, is the text itself. Each diagram begins with a keyword that names its type, such as `pie`, `gantt` or `xychart-beta`, followed by lines in that type’s small grammar. When a page that supports Mermaid displays the text, the library parses it and draws an SVG in its place. There is no image file to manage; change a line of text and the picture changes with it.',
      ],
    },
    {
      h2: 'How does a Mermaid diagram get rendered?',
      paragraphs: [
        'In Markdown, the diagram goes in a fenced code block: three backticks and the word `mermaid`, the diagram text, three backticks. A platform that supports Mermaid recognises the fence and hands the text to the library; one that does not simply shows the code, which is still readable. The copy buttons on this page include the fence, so a pasted example works as is. The [Mermaid in Markdown](/mermaid-in-markdown) page walks through the embedding on each platform.',
        'On a web page you control, you load the Mermaid script and it looks for elements with the class `mermaid`, or you call its render function yourself. Mermaid’s documentation also provides the Live Editor at mermaid.live for drafting a diagram and seeing it drawn as you type. Docs MD does the same inside the editor: paste Markdown with a `mermaid` block into [the editor](/) and the preview, the shared link and the [PDF export](/markdown-to-pdf) all show the drawn diagram.',
      ],
    },
    {
      h2: 'Which diagram types does Mermaid have?',
      paragraphs: [
        'Mermaid 11.16 documents about thirty diagram types. They fall into two families. Chart-style types show data or plans and are the ones illustrated above; Docs MD has a full page of copyable examples for each. UML-style types describe software structure and behaviour and are covered with worked examples on chartcraft.dev. A few further types, such as C4, requirement, block, packet, architecture and treemap diagrams, are documented at mermaid.js.org.',
      ],
      table: {
        head: ['Type', 'Keyword', 'Use it for', 'Examples'],
        rows: [
          ['Pie chart', '`pie`', 'Shares of one whole', '[pie chart examples](/mermaid-pie-chart-examples)'],
          ['Bar and line chart', '`xychart-beta`', 'Amounts by category or over periods', '[bar chart examples](/mermaid-bar-chart-examples)'],
          ['Gantt chart', '`gantt`', 'Tasks with dates and dependencies', '[Gantt chart examples](/mermaid-gantt-chart-examples)'],
          ['Timeline', '`timeline`', 'Events in order', '[timeline examples](/mermaid-timeline-examples)'],
          ['Mindmap', '`mindmap`', 'Ideas branching from a topic', '[mindmap examples](/mermaid-mindmap-examples)'],
          ['Git graph', '`gitGraph`', 'Branches, commits and merges', '[git graph examples](/mermaid-gitgraph-examples)'],
          ['Quadrant chart', '`quadrantChart`', 'Items placed by two judgements', '[quadrant chart examples](/mermaid-quadrant-chart-examples)'],
          ['Sankey diagram', '`sankey-beta`', 'Where quantities flow', '[sankey diagram examples](/mermaid-sankey-diagram-examples)'],
          ['Kanban', '`kanban`', 'Work items by status column', '[kanban examples](/mermaid-kanban-examples)'],
          ['Radar chart', '`radar-beta`', 'Items compared across criteria', '[radar chart examples](/mermaid-radar-chart-examples)'],
          ['User journey', '`journey`', 'Steps a person takes and how they feel', '[user journey examples](/mermaid-user-journey-examples)'],
          ['Flowchart', '`flowchart`', 'Processes with decisions', '[flowchart examples](https://www.chartcraft.dev/flowchart-examples)'],
          ['Sequence diagram', '`sequenceDiagram`', 'Messages between participants over time', '[sequence diagram examples](https://www.chartcraft.dev/sequence-diagram-examples)'],
          ['Class diagram', '`classDiagram`', 'Classes and their relationships', '[class diagram examples](https://www.chartcraft.dev/class-diagram-examples)'],
          ['State diagram', '`stateDiagram-v2`', 'States and transitions', '[state diagram examples](https://www.chartcraft.dev/state-diagram-examples)'],
          ['Entity relationship diagram', '`erDiagram`', 'Database tables and relations', '[ER diagram examples](https://www.chartcraft.dev/er-diagram-examples)'],
        ],
      },
    },
    {
      h2: 'Where do Mermaid diagrams render?',
      paragraphs: [
        'In more places each year, which is the main reason to learn the syntax once. GitHub renders `mermaid` blocks in issues, pull requests, discussions, wikis and Markdown files. GitLab renders them in its Markdown and states in its documentation which Mermaid major version it supports. Notion added Mermaid to its code block in December 2021: choose Mermaid as the language and switch the block to preview. Obsidian renders `mermaid` code blocks in notes, and VS Code’s built-in Markdown preview renders them from version 1.121, where earlier versions needed an extension. Mermaid’s own integrations list marks Azure DevOps wikis as native support and lists several Marketplace apps that add Mermaid to Confluence and Jira.',
        'The catch is the version. Each platform ships its own copy of Mermaid and updates on its own schedule, so a diagram type or option added recently, such as kanban in 11.4.0 or radar charts in 11.6.0, renders on one platform and shows as code or an error on another. GitHub’s documentation suggests rendering the one-word `info` diagram to see the version in use; the [Mermaid in Markdown](/mermaid-in-markdown) page shows that check. When the audience is outside those tools, paste the Markdown into the [Docs MD editor](/) and share the link; the shared page renders every diagram with Mermaid 11.16.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is Mermaid free to use?',
      a: 'Yes. Mermaid is open source under the MIT licence, which allows use, modification and redistribution, including in commercial products, with attribution. The library is published on npm and served from public CDNs, and the Live Editor at mermaid.live is free to use. The team behind the project also offers a hosted product, Mermaid Chart, but the library and syntax do not depend on it.',
    },
    {
      q: 'What is the difference between a Mermaid diagram and an image?',
      a: 'A Mermaid diagram is text, so it can be edited in any editor, reviewed in a pull request, searched, and regenerated automatically when the source changes; an image has to be redrawn in a graphics tool and re-exported. The trade-off is control: Mermaid lays the diagram out for you, and you adjust it through options rather than by dragging shapes. For diagrams that live next to code or in documentation, that trade is usually worth it.',
    },
    {
      q: 'Do I need to install anything to use Mermaid?',
      a: 'Not on a platform that already supports it. Write the diagram in a `mermaid` code block in GitHub, GitLab, Notion, Obsidian, VS Code or the Docs MD editor and it is drawn for you. You only install Mermaid, from npm or a CDN script tag, when you want diagrams on your own website or in a build pipeline. The Live Editor at mermaid.live needs nothing installed either.',
    },
    {
      q: 'Which Mermaid diagram should I use?',
      a: 'Start from the data. Shares of one whole: pie chart. Amounts by category: bar chart. Tasks with dates: Gantt chart. Events in order: timeline. Ideas around a topic: mindmap. Items ranked by two judgements: quadrant chart. Flows of quantities: sankey diagram. Work by status: kanban. Items compared across criteria: radar chart. Steps a person takes: user journey. For processes with decisions, message exchanges, classes, states or database tables, use the UML types; the table above links to examples of each.',
    },
    {
      q: 'Why does my Mermaid diagram render in one tool but not another?',
      a: 'Almost always the Mermaid version. Each platform bundles its own copy, and recently added types and options are not available on an older copy: kanban needs 11.4.0, radar charts 11.6.0, the pie chart’s donut option 11.16.0. Render the `info` diagram on the platform to see its version, and prefer the older spellings, such as `xychart-beta`, when a document must work everywhere. A second cause is a third-party Mermaid browser plugin, which GitHub’s documentation warns can cause errors on its pages.',
    },
  ],
  sources: [
    { label: 'Mermaid documentation: About Mermaid', url: 'https://mermaid.js.org/intro/' },
    { label: 'Mermaid documentation: Integrations', url: 'https://mermaid.js.org/ecosystem/integrations-community.html' },
    { label: 'Mermaid on GitHub', url: 'https://github.com/mermaid-js/mermaid' },
    { label: 'GitHub Docs: Creating diagrams', url: 'https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams' },
    { label: 'GitLab Docs: GitLab Flavored Markdown, Mermaid', url: 'https://docs.gitlab.com/user/markdown/#mermaid' },
    { label: 'Notion release notes, 23 December 2021', url: 'https://www.notion.com/releases/2021-12-23' },
    { label: 'Obsidian Help: Advanced formatting syntax', url: 'https://help.obsidian.md/Editing+and+formatting/Advanced+formatting+syntax' },
    { label: 'VS Code Docs: Markdown', url: 'https://code.visualstudio.com/docs/languages/markdown' },
  ],
  related: ['/mermaid-diagram-examples', '/mermaid-in-markdown', '/what-is-markdown', '/markdown-viewer', '/markdown-cheat-sheet'],
};
