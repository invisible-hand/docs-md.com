import type { MermaidExamplesPage } from './types';

export const PAGE: MermaidExamplesPage = {
  slug: 'mermaid-kanban-examples',
  title: 'Mermaid Kanban Examples — Syntax and Copyable Code',
  description:
    'Mermaid kanban syntax with copyable examples rendered live: columns, tasks, assigned, ticket and priority metadata, ticket links and version notes.',
  h1: 'Mermaid kanban examples',
  label: 'Kanban',
  updated: '2026-11-03',
  answer:
    'A Mermaid kanban board starts with the `kanban` keyword, then one line per column written as `id[Title]`, with the tasks of that column indented beneath it in the same `id[Text]` form. Optional metadata such as `assigned`, `ticket` and `priority` goes in `@{ ... }` after a task. Every example below is rendered live from its code.',
  examples: [
    {
      id: 'basic',
      title: 'Basic kanban board',
      intro: 'Three columns and a handful of tasks. Indentation decides which column a task belongs to, and every column and task needs its own unique id before the square brackets.',
      code: `kanban
  todo[To do]
    t1[Write the release notes]
    t2[Record the demo video]
  doing[In progress]
    t3[Fix the export bug]
  done[Done]
    t4[Update the pricing page]
    t5[Rotate the API keys]`,
    },
    {
      id: 'metadata',
      title: 'Assigned, ticket and priority',
      intro: 'Append `@{ ... }` to a task with any of the three documented keys. `priority` accepts `Very High`, `High`, `Low` and `Very Low`; quote values that contain spaces.',
      code: `kanban
  todo[To do]
    t1[Migrate the search index]@{ ticket: DOCS-142, assigned: 'maria', priority: 'High' }
    t2[Refresh the onboarding emails]@{ assigned: 'sam', priority: 'Low' }
  doing[In progress]
    t3[Fix PDF export on Safari]@{ ticket: DOCS-139, assigned: 'li', priority: 'Very High' }
  done[Done]
    t4[Rotate the API keys]@{ ticket: DOCS-131, priority: 'Very Low' }`,
    },
    {
      id: 'ticket-links',
      title: 'Link tickets to your tracker',
      intro: 'Set `ticketBaseUrl` under `config: kanban` and every ticket id becomes a link, with `#TICKET#` replaced by the value from the task. The URL pattern is yours; this one follows the shape Mermaid’s documentation uses for an Atlassian tracker.',
      code: `---
config:
  kanban:
    ticketBaseUrl: 'https://example.atlassian.net/browse/#TICKET#'
---
kanban
  backlog[Backlog]
    b1[Dark mode for the viewer]@{ ticket: DM-412 }
    b2[Keyboard shortcuts]@{ ticket: DM-415, priority: 'Low' }
  next[Next up]
    n1[Faster PDF export]@{ ticket: DM-401, assigned: 'li', priority: 'High' }
  doing[In progress]
    d1[Share links with expiry]@{ ticket: DM-398, assigned: 'maria' }`,
    },
    {
      id: 'content-pipeline',
      title: 'Content pipeline',
      intro: 'A kanban does not have to be a software board. Here the columns are the stages of a publishing process, and the metadata records who owns each piece.',
      code: `kanban
  idea[Ideas]
    c1[Guide to Markdown tables]
    c2[Comparison of note apps]@{ priority: 'Low' }
  draft[Drafting]
    c3[Mermaid cheat sheet]@{ assigned: 'editor' }
  review[In review]
    c4[Release notes template]@{ assigned: 'reviewer', priority: 'High' }
  scheduled[Scheduled]
    c5[Changelog for version 2]
  published[Published]
    c6[README checklist]
    c7[Share a plan with a link]`,
    },
    {
      id: 'sprint-board',
      title: 'Sprint board with long task text',
      intro: 'Task text wraps inside its card, so a sentence of context is fine. Keep ids short and unique across the whole diagram; the ids never appear in the drawing.',
      code: `kanban
  todo[Sprint backlog]
    s1[Add an index to the documents table so that the search page loads in under a second on large workspaces]@{ ticket: DM-430, priority: 'Very High' }
    s2[Write the upgrade notes]@{ assigned: 'sam' }
  doing[In progress]
    s3[Replace the deprecated PDF library]@{ ticket: DM-422, assigned: 'li', priority: 'High' }
  blocked[Blocked]
    s4[Enable the new billing webhook]@{ ticket: DM-419, assigned: 'maria' }
  done[Done this sprint]
    s5[Fix the broken anchor links in the sidebar]@{ ticket: DM-417 }`,
    },
  ],
  sections: [
    {
      h2: 'Mermaid kanban syntax',
      paragraphs: [
        'The kanban diagram was added in Mermaid 11.4.0, which makes it one of the newer types, and its grammar resembles the mindmap’s: structure comes from indentation. A column is `id[Title]` at the first level of indentation; a task is `id[Text]` indented one level further under the column it belongs to. Mermaid’s documentation stresses three things: ids must be unique, tasks must be indented under their column, and the text goes in square brackets.',
        'Columns and tasks are drawn in the order written, left to right and top to bottom. There is no syntax for work-in-progress limits, swimlanes or dates; a kanban in Mermaid is a snapshot of a board for a document, a retrospective or a plan, not a live tracker.',
      ],
      table: {
        head: ['Element', 'Syntax', 'Notes'],
        rows: [
          ['Diagram', '`kanban`', 'First line, nothing else on it'],
          ['Column', '`todo[To do]`', 'Unique id, title in square brackets'],
          ['Task', '`t1[Write the release notes]`', 'Indented under its column; unique id'],
          ['Metadata', '`t1[Text]@{ assigned: \'sam\', priority: \'High\' }`', 'Any of `assigned`, `ticket`, `priority`'],
          ['Config', '`kanban: ticketBaseUrl: \'https://…/#TICKET#\'`', 'In the YAML block at the top of the diagram'],
        ],
      },
    },
    {
      h2: 'Which metadata keys does a kanban task support?',
      paragraphs: [
        'Mermaid documents three keys, all optional and all rendered on the card. Values with spaces or special characters go in single quotes; Mermaid 11.4.1 fixed a bug where a purely numeric ticket id or assignee broke rendering, so quoting those is still a good habit on platforms that may run 11.4.0.',
      ],
      table: {
        head: ['Key', 'Meaning', 'Values'],
        rows: [
          ['`assigned`', 'Who is responsible for the task', 'Any name, quoted if it has spaces'],
          ['`ticket`', 'Ticket or issue reference, linked when `ticketBaseUrl` is set', 'A reference such as `DOCS-142`'],
          ['`priority`', 'Urgency shown on the card', '`Very High`, `High`, `Low`, `Very Low`'],
        ],
      },
    },
    {
      h2: 'Which Mermaid version do you need, and where does kanban render?',
      paragraphs: [
        'Kanban needs Mermaid 11.4.0 or later. That matters more than for older types, because platforms embed their own copy of Mermaid and update it on their own schedule: a board that renders on docs-md.com or in a current VS Code may show as plain code or an error in a tool that is still on Mermaid 10. GitHub renders `mermaid` blocks in issues, pull requests, discussions, wikis and Markdown files, and its documentation suggests rendering the one-word `info` diagram to see the version it runs; GitLab’s Markdown documentation states the Mermaid major version it supports. The [Mermaid in Markdown](/mermaid-in-markdown) page shows the version check and how each platform embeds a diagram.',
        'When the reader’s platform cannot draw it, the fallback is the text itself, which for a kanban is still a legible list of columns and tasks. To share the rendered board with people outside your repository, paste the Markdown into the [Docs MD editor](/) and send the link, or [convert the document to PDF](/markdown-to-pdf).',
      ],
    },
    {
      h2: 'Kanban, Gantt chart or timeline?',
      paragraphs: [
        'A kanban shows status now: what is waiting, what is in progress, what is done. A [Gantt chart](/mermaid-gantt-chart-examples) shows when: tasks with start dates, durations and dependencies on a calendar. A [timeline](/mermaid-timeline-examples) shows what happened in order, without durations. For a sprint review or a weekly update, a kanban is the quickest to write and the easiest to read; for a plan with deadlines, use the Gantt chart; for a retrospective of a release, the timeline.',
        'Because the board is text, it versions well: commit it with the code, diff it in a pull request, or keep one per sprint in a folder. The [hub of Mermaid examples](/mermaid-diagram-examples) compares every chart type Docs MD covers, and the [implementation plan guide](/share-implementation-plan) shows a kanban alongside the written plan.',
      ],
    },
  ],
  faq: [
    {
      q: 'Which Mermaid version supports kanban diagrams?',
      a: 'Mermaid 11.4.0 added the kanban diagram, and 11.4.1 fixed rendering when a ticket id or assignee is a plain number. Any platform on an older Mermaid shows the code as text or reports an unknown diagram type. Render the `info` diagram on the platform to see its version before relying on a kanban there; docs-md.com runs Mermaid 11.16.',
    },
    {
      q: 'Which priority values are allowed in a Mermaid kanban?',
      a: 'Mermaid’s documentation lists four: `Very High`, `High`, `Low` and `Very Low`. There is no documented medium level; leave `priority` out for a task of normal priority. Quote the two-word values, as in `priority: \'Very High\'`, so that the space inside the value is read correctly.',
    },
    {
      q: 'Can tasks in a Mermaid kanban link to tickets?',
      a: 'Yes. Give the task a `ticket` value and set `ticketBaseUrl` under `config: kanban` in the YAML block at the top of the diagram. Mermaid replaces `#TICKET#` in that URL with the ticket value and renders the ticket id as a link. Whether the link is clickable depends on the host page’s Mermaid security settings, so test it where the document will be read.',
    },
    {
      q: 'Why does my Mermaid kanban not render?',
      a: 'Check four things. The platform must run Mermaid 11.4.0 or later. Each task must be indented more than its column, and each column less than its tasks. Every id, for columns and tasks alike, must be unique within the diagram. And metadata must be valid: only `assigned`, `ticket` and `priority`, with quotes around values that contain spaces. If the board renders but a card looks wrong, look for an unbalanced bracket in that task’s text.',
    },
    {
      q: 'Can I move a task between columns?',
      a: 'Only by editing the text: cut the task line and paste it under the new column, keeping the indentation. There is no interactivity in the rendered board. That is the trade-off of a text diagram, and also its advantage: the move shows up as a one-line change in version control, and the whole board can be reviewed like any other file.',
    },
  ],
  sources: [
    { label: 'Mermaid documentation: Kanban diagram', url: 'https://mermaid.js.org/syntax/kanban.html' },
    { label: 'Mermaid changelog (kanban added in 11.4.0)', url: 'https://github.com/mermaid-js/mermaid/blob/develop/packages/mermaid/CHANGELOG.md' },
    { label: 'GitHub Docs: Creating diagrams', url: 'https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams' },
  ],
  related: ['/mermaid-gantt-chart-examples', '/mermaid-timeline-examples', '/mermaid-in-markdown', '/mermaid-diagram-examples', '/share-implementation-plan'],
};
