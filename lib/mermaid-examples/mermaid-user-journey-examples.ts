import type { MermaidExamplesPage } from './types';

export const PAGE: MermaidExamplesPage = {
  slug: 'mermaid-user-journey-examples',
  title: 'Mermaid User Journey Examples — Copyable Code',
  description:
    'Mermaid user journey syntax with copyable examples rendered live: sections, tasks with scores and actors, onboarding, checkout and support journeys.',
  h1: 'Mermaid user journey examples',
  label: 'User journey',
  updated: '2026-11-03',
  answer:
    'A Mermaid user journey starts with the `journey` keyword and an optional `title`, groups steps under `section` lines, and writes each step as `Task name: score: actors`, where the score is 1 to 5 and actors are a comma-separated list. Mermaid draws a face for each score and colours each actor. Every example below is rendered live from its code.',
  examples: [
    {
      id: 'onboarding',
      title: 'Basic user journey: onboarding',
      intro: 'The complete syntax: a title, two sections, and tasks with a score and one or more actors. Scores above 3 draw a smiling face, 3 a neutral one and below 3 a sad one, which is how the diagram shows where the experience hurts.',
      code: `journey
    title New user onboarding
    section Sign up
      Open the landing page: 5: Visitor
      Create an account: 3: Visitor
      Verify the email address: 2: Visitor
    section First session
      Import a document: 4: User
      Share the link: 5: User, Teammate`,
    },
    {
      id: 'checkout',
      title: 'Online checkout',
      intro: 'A journey with three sections and a single actor. The low scores in the payment section point at the forms to redesign; the high scores afterwards show the parts that already work.',
      code: `journey
    title Online checkout
    section Browse
      Search for a product: 4: Shopper
      Compare two options: 3: Shopper
    section Pay
      Enter the shipping address: 2: Shopper
      Enter card details: 1: Shopper
      Confirm the order: 4: Shopper
    section After purchase
      Receive the confirmation email: 5: Shopper
      Track the parcel: 3: Shopper, Courier`,
    },
    {
      id: 'support-ticket',
      title: 'Support ticket with several actors',
      intro: 'Each distinct actor gets a colour and a legend entry, and a task lists every actor involved. Here the customer, an agent and an engineer share the journey, and the shared tasks show where hand-offs happen.',
      code: `journey
    title Support ticket
    section Report
      Find the help page: 2: Customer
      Describe the problem: 3: Customer
    section Triage
      Read the ticket: 4: Agent
      Ask for logs: 2: Customer, Agent
    section Resolve
      Ship a fix: 5: Engineer
      Confirm it works: 5: Customer, Agent`,
    },
    {
      id: 'hiring',
      title: 'Hiring process from both sides',
      intro: 'A journey can carry two perspectives at once by scoring each step for the person who experiences it. The candidate and the hiring manager appear on the same tasks, so the chart shows where the process is slow for everyone.',
      code: `journey
    title Hiring a designer
    section Apply
      Read the job post: 4: Candidate
      Submit the portfolio: 3: Candidate
      Screen applications: 2: Recruiter
    section Interview
      Phone screen: 3: Candidate, Recruiter
      Design exercise: 2: Candidate
      Panel interview: 4: Candidate, Manager
    section Decide
      Reference checks: 3: Recruiter
      Offer and negotiation: 4: Candidate, Manager`,
    },
    {
      id: 'no-sections',
      title: 'A short journey without sections',
      intro: 'Sections are optional. For a quick sketch, list the tasks directly under the title; the diagram still draws the faces and the actor lane.',
      code: `journey
    title Monday morning
    Wake up: 2: Me
    Make coffee: 5: Me
    Read the news: 3: Me
    Open the laptop: 2: Me`,
    },
    {
      id: 'section-colours',
      title: 'Section and actor colours',
      intro: 'The journey configuration has `sectionFills` for the section bands and `actorColours` for the actor markers, each a list of colours used in order. These are configuration keys under `config: journey`, not theme variables.',
      code: `---
config:
  journey:
    sectionFills: ["#4f46e5", "#0f766e", "#b45309"]
    actorColours: ["#111827", "#6b7280"]
---
journey
    title Returning a product
    section Request
      Find the returns page: 3: Customer
      Print the label: 2: Customer
    section Ship
      Drop off the parcel: 4: Customer
      Receive the parcel: 4: Warehouse
    section Refund
      Inspect the item: 3: Warehouse
      Refund issued: 5: Customer`,
    },
  ],
  sections: [
    {
      h2: 'Mermaid user journey syntax',
      paragraphs: [
        'Mermaid’s documentation defines the diagram in three lines: a journey is split into sections that describe parts of the task, each task is written as `Task name: <score>: <comma separated list of actors>`, and the score is a number from 1 to 5 inclusive. The `journey` keyword and a `title` come first; the rest is sections and tasks, indented for readability.',
        'Tasks are drawn left to right in the order written, grouped under coloured section bands. Each task shows a face for its score, and each actor named anywhere in the diagram gets a colour, a legend entry and a marker on the tasks they take part in. That is the whole vocabulary; there are no arrows, conditions or durations, which is what keeps the diagram quick to write in a planning document or a research summary.',
      ],
      table: {
        head: ['Element', 'Syntax', 'Notes'],
        rows: [
          ['Diagram', '`journey`', 'First line'],
          ['Title', '`title New user onboarding`', 'Optional'],
          ['Section', '`section Sign up`', 'Optional; groups the tasks that follow'],
          ['Task', '`Create an account: 3: Visitor`', 'Name, score 1–5, actors'],
          ['Several actors', '`Share the link: 5: User, Teammate`', 'Comma-separated; each actor gets a colour'],
        ],
      },
    },
    {
      h2: 'What do the scores mean?',
      paragraphs: [
        'The score is how the actor feels at that step, from 1 (bad) to 5 (good); the documentation only fixes the range, so agree the meaning with your team before scoring. In the rendered diagram, a score above 3 draws a smiling face, exactly 3 a neutral face and below 3 a sad face, and the face sits higher or lower on the task card with the score. Readers scan the row of faces first, so the chart is at its best when it has a handful of low scores that point at the steps worth fixing.',
        'Scores are per task, not per actor. If two actors experience a step differently, split it into two tasks, or score the actor whose experience you are mapping, as the hiring example does by giving the candidate and the recruiter separate application steps.',
      ],
    },
    {
      h2: 'Which configuration options does a user journey have?',
      paragraphs: [
        'The journey has no theme variables of its own; its colours and spacing are configuration keys under `config: journey` in the YAML block at the top of the diagram. These are the ones worth knowing; the full list is in Mermaid’s configuration schema.',
      ],
      table: {
        head: ['Option', 'Effect', 'Default'],
        rows: [
          ['`sectionFills`', 'List of colours for the section bands, used in order', '7 dark colours'],
          ['`actorColours`', 'List of colours for the actor markers and legend, used in order', '6 colours'],
          ['`taskFontSize`', 'Font size of the task text', '14'],
          ['`taskMargin`', 'Space between tasks', '50'],
          ['`width`, `height`', 'Size of the task boxes', '150, 50'],
          ['`leftMargin`', 'Margin between actors', '150'],
        ],
      },
    },
    {
      h2: 'Where does a user journey render, and when should you use one?',
      paragraphs: [
        'The user journey is one of Mermaid’s older diagram types, so it renders on every platform that supports Mermaid at all: GitHub draws `mermaid` blocks in issues, pull requests, discussions, wikis and Markdown files, and GitLab, Obsidian, Notion and the VS Code Markdown preview render them too. The [Mermaid in Markdown](/mermaid-in-markdown) page shows how each one embeds a diagram and how to check the Mermaid version with the `info` diagram. To share a journey with people outside those tools, have your AI agent publish the Markdown to [Docs MD](/agents) and send the link, or [convert the document to PDF](/markdown-to-pdf).',
        'Use a user journey to summarise research or a walkthrough: what a person does, in order, and how it feels. It is not a flowchart, so it cannot show branches or failures, and it is not a [timeline](/mermaid-timeline-examples), so it carries no dates. For the status of work items use a [kanban](/mermaid-kanban-examples); for a schedule use a [Gantt chart](/mermaid-gantt-chart-examples). The [hub of Mermaid examples](/mermaid-diagram-examples) compares every chart type Docs MD covers.',
      ],
    },
  ],
  faq: [
    {
      q: 'What score range does a Mermaid user journey accept?',
      a: 'Whole numbers from 1 to 5 inclusive, as stated in Mermaid’s documentation. A score above 3 is drawn as a smiling face, 3 as a neutral face and below 3 as a sad face. Decide what the numbers mean for your team before scoring, since the diagram only fixes the range; a common reading is 1 for frustrating and 5 for delightful.',
    },
    {
      q: 'How many actors can a task in a Mermaid user journey have?',
      a: 'As many as you list after the second colon, separated by commas. Each distinct actor name in the diagram gets its own colour and legend entry, and a marker on every task it appears in. Keep the names consistent, because `User` and `user` would become two actors. In practice three or four actors is the readable limit for one journey.',
    },
    {
      q: 'Can a Mermaid user journey have tasks without sections?',
      a: 'Yes. Sections are optional; tasks written directly after the title are drawn without a section band, as the short Monday morning example shows. Once you use one section, put every task under a section so that the bands read consistently from left to right.',
    },
    {
      q: 'How do I change the colours of a Mermaid user journey?',
      a: 'Set `sectionFills` and `actorColours` under `config: journey` in a YAML block at the top of the diagram, each as a list of colours used in order. These are configuration options rather than theme variables, which is why the usual `themeVariables` approach for other charts does not apply here. The section colours example on this page shows the block.',
    },
    {
      q: 'Does GitHub render Mermaid user journey diagrams?',
      a: 'Yes. GitHub renders fenced `mermaid` blocks in issues, pull requests, discussions, wikis and Markdown files, and the user journey is an established diagram type that predates Mermaid 10, so it does not depend on a recent version. GitHub chooses the Mermaid version it runs; render an `info` block there if you want to know which one.',
    },
  ],
  sources: [
    { label: 'Mermaid documentation: User journey diagram', url: 'https://mermaid.js.org/syntax/userJourney.html' },
    { label: 'Mermaid configuration schema: Journey diagram config', url: 'https://mermaid.js.org/config/schema-docs/config-defs-journey-diagram-config.html' },
    { label: 'GitHub Docs: Creating diagrams', url: 'https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams' },
  ],
  related: ['/mermaid-timeline-examples', '/mermaid-kanban-examples', '/mermaid-in-markdown', '/mermaid-diagram-examples'],
};
