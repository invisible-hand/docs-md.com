import type { MermaidExamplesPage } from './types';

export const PAGE: MermaidExamplesPage = {
  slug: 'mermaid-in-markdown',
  title: 'Mermaid in Markdown: GitHub, GitLab, Obsidian, Notion',
  description:
    'Add a Mermaid diagram to Markdown with a mermaid code block, and where it renders: GitHub, GitLab, Obsidian, Notion, VS Code, Confluence and Docs MD.',
  h1: 'How to use Mermaid diagrams in Markdown',
  label: 'Mermaid in Markdown',
  updated: '2026-11-03',
  answer:
    'To use Mermaid in Markdown, put the diagram code in a fenced code block with the language `mermaid`: three backticks and the word mermaid, the diagram, then three backticks. GitHub, GitLab, Obsidian, VS Code’s preview and Docs MD draw it as a diagram; in Notion you pick Mermaid as a code block’s language. Every example below renders live.',
  examples: [
    {
      id: 'flowchart',
      title: 'Flowchart',
      intro:
        'The diagram type most READMEs use. The first line names the type and the direction, `LR` for left to right. `accTitle` and `accDescr` give the diagram an accessible title and description for screen readers; Mermaid supports them in every diagram type.',
      code: `flowchart LR
    accTitle: How a Markdown file becomes a page
    accDescr: A file with a mermaid block renders as a diagram, a file without one stays text
    A[Markdown file] --> B{Has a mermaid block?}
    B -->|Yes| C[Diagram]
    B -->|No| D[Plain text]`,
    },
    {
      id: 'sequence',
      title: 'Sequence diagram',
      intro:
        'Sequence diagrams show who talks to whom, in order, which suits an API flow documented next to its code. `->>` draws a solid arrow and `-->>` a dotted one, often used for replies; `as` gives a participant a longer display name.',
      code: `sequenceDiagram
    participant Browser
    participant API
    participant DB as Database
    Browser->>API: GET /docs/42
    API->>DB: Load document 42
    DB-->>API: Markdown text
    API-->>Browser: Rendered page`,
    },
    {
      id: 'pie',
      title: 'Pie chart',
      intro:
        'A title and one quoted label and value per line; Mermaid works out the percentages. Donut charts, legend position and colours are on the [pie chart examples](/mermaid-pie-chart-examples) page.',
      code: `pie title Open issues by label
    "bug" : 42
    "enhancement" : 27
    "docs" : 11`,
    },
    {
      id: 'gantt',
      title: 'Gantt chart',
      intro:
        'A schedule with sections, dependencies and a milestone. Dates, durations, weekends and today markers are covered on the [Gantt chart examples](/mermaid-gantt-chart-examples) page.',
      code: `gantt
    title Docs migration
    dateFormat YYYY-MM-DD
    axisFormat %b %d
    section Content
        Audit pages        :a1, 2026-01-05, 5d
        Rewrite guides     :a2, after a1, 10d
    section Launch
        Redirects          :after a2, 3d
        Go live            :milestone, 2026-01-26, 0d`,
    },
    {
      id: 'timeline',
      title: 'Timeline',
      intro:
        'Periods on the left of each colon, events on the right, and extra colons for extra events. More layouts are on the [timeline examples](/mermaid-timeline-examples) page.',
      code: `timeline
    title Project history
    2024 : Prototype
    2025 : Public beta : First paying team
    2026 : Version 1.0`,
    },
    {
      id: 'mindmap',
      title: 'Mindmap',
      intro:
        'Indentation sets the hierarchy and double parentheses make the root a circle. Shapes, markdown strings and line breaks are on the [mindmap examples](/mermaid-mindmap-examples) page.',
      code: `mindmap
  root((README))
    Install
    Usage
      Command line
      API
    Contributing
    License`,
    },
    {
      id: 'git-graph',
      title: 'Git graph',
      intro:
        'Git operations in the order they happen, starting on `main`. Cherry-picks, tags, orientation and colours are on the [git graph examples](/mermaid-gitgraph-examples) page.',
      code: `gitGraph
    commit
    branch docs
    commit id: "add diagrams"
    checkout main
    merge docs tag: "v1.1"`,
    },
    {
      id: 'version-check',
      title: 'Check which Mermaid version a platform runs',
      intro:
        'GitHub’s documentation suggests this one-word diagram for checking the Mermaid version in use: it renders as the version number. Here it shows the version Docs MD runs. Paste it into a README, a note or an issue to test another platform.',
      code: `info`,
    },
  ],
  sections: [
    {
      h2: 'How do you add a Mermaid diagram to a Markdown file?',
      paragraphs: [
        'Start a fenced code block with three backticks followed by the word `mermaid`, write the diagram on the lines below, and close the block with three backticks. The first line inside the block names the diagram type: `flowchart`, `sequenceDiagram`, `pie`, `gantt`, `timeline`, `mindmap`, `gitGraph` and so on. Everything outside the block stays ordinary Markdown, so a diagram can sit between a heading and the paragraph that explains it. The copy buttons on this page include the fence.',
        'Settings go at the very top of the block, between two lines of three dashes, before the diagram type: a `title`, or a `config` section that changes the theme or diagram options, as in the Gantt and git graph examples. Mermaid’s documentation notes that a misspelled setting is ignored silently while badly formed YAML breaks the diagram. Lines starting with `%%` are comments.',
        'Where a platform does not render Mermaid, readers see the code block as text. Short labels and one statement per line keep that fallback readable, and an `accTitle` and `accDescr` help readers who use a screen reader where the diagram does render.',
      ],
    },
    {
      h2: 'Does GitHub support Mermaid?',
      paragraphs: [
        'Yes. GitHub’s documentation page Creating diagrams says diagram rendering is available in GitHub Issues, GitHub Discussions, pull requests, wikis and Markdown files, which includes every README. You write a fenced code block with the `mermaid` language identifier, as on this page, and GitHub draws it when the file, issue or comment is viewed. Mermaid is one of four diagram syntaxes GitHub renders this way; the other three are GeoJSON and TopoJSON maps and ASCII STL 3D models, each with its own code block language.',
        'For diagram types, GitHub’s page names flow charts, sequence diagrams and pie charts, then refers to the Mermaid documentation for the rest: whatever the Mermaid version GitHub runs can draw, GitHub draws, which with any Mermaid from 9.4 onwards includes the Gantt chart, timeline, mindmap and git graph above. GitHub does not publish that version, so render the `info` block from this page in an issue to see it, and expect a recently added option to lag there for a while. The same page warns that a third-party Mermaid browser plugin can cause errors on GitHub.',
      ],
    },
    {
      h2: 'Which platforms render Mermaid in Markdown?',
      paragraphs: [
        'All of these use the same diagram code. What differs is how you insert it and which Mermaid version draws it, so a diagram that uses a recent option can render on one platform and fail on another.',
      ],
      table: {
        head: ['Platform', 'How you add a diagram', 'Where it renders'],
        rows: [
          ['GitHub', 'A fenced block tagged `mermaid`', 'Markdown files such as READMEs, issues, pull requests, discussions and wikis'],
          ['GitLab', 'A fenced block tagged `mermaid`', 'Repository Markdown files, issues, merge requests, epics, comments, wiki pages, milestones, releases and `.md` snippets; GitLab’s documentation says it supports Mermaid version 12'],
          ['Obsidian', 'A fenced block tagged `mermaid`', 'Notes; the `internal-link` class on flowchart nodes links them to other notes'],
          ['Notion', 'A code block (type `/code`) with Mermaid chosen as its language', 'The block itself: switch its view to Preview for the diagram, or Split for code and diagram side by side'],
          ['Confluence', 'A Marketplace app’s macro; Confluence has no Mermaid rendering of its own', 'Pages, once an app such as Atlassian Labs’ Mermaid diagrams viewer or Mermaid Chart for Confluence is installed on the site'],
          ['VS Code', 'A fenced block tagged `mermaid`', 'The built-in Markdown preview from version 1.121 (May 2026); older versions need an extension such as Markdown Preview Mermaid Support'],
          ['Docs MD', 'A fenced block tagged `mermaid`', 'The [editor](/), the [Markdown viewer](/markdown-viewer) and shared links, drawn with Mermaid 11'],
        ],
      },
    },
    {
      h2: 'Confluence and Mermaid',
      paragraphs: [
        'Confluence does not render Mermaid on its own. Its code block element highlights source code but has no Mermaid language, so a pasted fenced `mermaid` block stays text, and Atlassian’s guide to importing from Notion lists Notion’s Mermaid code blocks as arriving in Confluence as plain text.',
        'Rendering comes from Atlassian Marketplace apps, which add a macro that takes Mermaid source, or a link to it, and draws the diagram on the page. Atlassian Labs publishes Mermaid diagrams viewer, which renders the Mermaid code found in a code block on the same page; Mermaid Chart, the company behind Mermaid, publishes Mermaid Chart for Confluence; and several other vendors list Mermaid macros for Confluence Cloud and Data Center. Apps are installed per site by a Confluence admin, so check which one your site has before writing a page around a diagram, then paste the same code you would use on GitHub into the macro.',
      ],
    },
    {
      h2: 'Why does my Mermaid block show as code instead of a diagram?',
      paragraphs: [
        'Work through four checks. The fence must be tagged `mermaid`; a block with no language, or another language, is shown as ordinary code. The platform must render Mermaid at all; one that does not shows the block as code, which is the expected fallback. The diagram must parse; a syntax error stops the drawing, and depending on the platform you see an error message or the raw code. Paste the block into the [Docs MD editor](/) or another live preview to find the line that breaks.',
        'Last, the platform’s Mermaid version must be new enough for what you used. Newer options fail on older renderers: the pie chart’s `donutHole` needs Mermaid 11.16.0 and the git graph’s `BT:` orientation 11.0.0. Render the `info` diagram above on the platform to see its version. Two platform-specific causes are documented: GitHub warns that a third-party Mermaid plugin can cause errors, and on GitLab Self-Managed a `Cross-Origin-Resource-Policy` header set to `same-site` or `same-origin` makes diagrams fail silently.',
      ],
    },
    {
      h2: 'How do you share or export Markdown with Mermaid diagrams?',
      paragraphs: [
        'Inside a repository, the file is already the shared version: GitHub and GitLab draw the diagram for anyone who can open it. For readers outside the repository, paste the Markdown into the [Docs MD editor](/) and share it as a link; the shared page shows the rendered diagrams next to the text. The [architecture diagram guide](/share-architecture-diagram) walks through a typical document.',
        'For a file that has to travel as an attachment, [convert the Markdown to PDF](/markdown-to-pdf): the diagrams are drawn first and printed as vector graphics. To check a local file before sending it anywhere, open it in the [Markdown viewer](/markdown-viewer), which renders Mermaid in the browser without uploading the file.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does GitHub support Mermaid in README files?',
      a: 'Yes. A README is a Markdown file, and GitHub renders fenced `mermaid` blocks in Markdown files as well as in issues, pull requests, discussions and wikis. Write the block as shown on this page, commit the file, and the diagram appears when the README is viewed on GitHub. GitHub chooses the Mermaid version it runs, so test newer syntax there; an `info` block shows the version.',
    },
    {
      q: 'How do you use Mermaid in Obsidian?',
      a: 'Type a fenced code block tagged `mermaid` in a note and write the diagram inside; Obsidian draws it in the note. Obsidian adds one extra: give flowchart nodes the class `internal-link`, as in `class A,B internal-link;`, and each node becomes a link to the note named by its text. Obsidian’s help notes that these links do not appear in the graph view. More syntax is on the [Obsidian Markdown](/obsidian-markdown) page.',
    },
    {
      q: 'Does Notion support Mermaid diagrams?',
      a: 'Yes, through code blocks. Type `/code` to add a code block, choose Mermaid in the language menu at its top left, and write the diagram. A second menu switches the block to Preview, which shows the chart, or Split, which shows code and chart together. Notion announced this in December 2021. You do not type the three-backtick fence yourself; the code block plays that role.',
    },
    {
      q: 'Does VS Code show Mermaid diagrams in the Markdown preview?',
      a: 'Yes, from VS Code 1.121, released in May 2026: the built-in Markdown preview renders `mermaid` blocks, and you can pan and zoom larger diagrams in place. On older versions, install an extension such as Markdown Preview Mermaid Support, which VS Code’s own extension guide uses as its example of adding Mermaid to the preview.',
    },
    {
      q: 'Which Mermaid diagram types work in Markdown?',
      a: 'Any type the platform’s Mermaid version supports, because the Markdown only carries the code. That includes the flowcharts, sequence diagrams, pie charts, Gantt charts, timelines, mindmaps and git graphs shown above, plus class, state and entity-relationship diagrams and newer types. Recently added types need a recent renderer, so a diagram that works in Docs MD can fail on a platform a few versions behind.',
    },
  ],
  sources: [
    { label: 'Mermaid documentation: Diagram syntax', url: 'https://mermaid.js.org/intro/syntax-reference.html' },
    { label: 'Mermaid documentation: Accessibility options', url: 'https://mermaid.js.org/config/accessibility.html' },
    { label: 'GitHub Docs: Creating diagrams', url: 'https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams' },
    { label: 'GitLab Docs: GitLab Flavored Markdown, Mermaid', url: 'https://docs.gitlab.com/user/markdown/#mermaid' },
    { label: 'Obsidian Help: Advanced formatting syntax, Diagram', url: 'https://obsidian.md/help/advanced-syntax' },
    { label: 'Notion release notes, December 23, 2021: Mermaid diagrams in code blocks', url: 'https://www.notion.com/releases/2021-12-23' },
    { label: 'VS Code documentation: Markdown and Visual Studio Code', url: 'https://code.visualstudio.com/docs/languages/markdown' },
    { label: 'VS Code 1.121 release notes (built-in Mermaid preview)', url: 'https://code.visualstudio.com/updates/v1_121' },
    { label: 'Atlassian Marketplace: Mermaid diagrams viewer (Atlassian Labs)', url: 'https://marketplace.atlassian.com/apps/1232887/mermaid-diagrams-viewer' },
    { label: 'Atlassian Marketplace: Mermaid Chart for Confluence', url: 'https://marketplace.atlassian.com/apps/1234056/mermaid-chart-for-confluence' },
    { label: 'Atlassian Support: FAQ, import data from Notion to Confluence', url: 'https://support.atlassian.com/confluence-cloud/docs/faq-import-data-from-notion-to-confluence' },
  ],
  related: ['/github-flavored-markdown', '/obsidian-markdown', '/notion-markdown', '/markdown-viewer', '/markdown-to-pdf', '/share-architecture-diagram'],
};
