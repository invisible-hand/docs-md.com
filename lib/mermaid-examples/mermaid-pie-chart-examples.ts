import type { MermaidExamplesPage } from './types';

export const PAGE: MermaidExamplesPage = {
  slug: 'mermaid-pie-chart-examples',
  title: 'Mermaid Pie Chart Examples — Syntax and Copyable Code',
  description:
    'Mermaid pie chart syntax with copyable examples rendered live: title, showData, decimals, donut charts, legend position and colours, plus how to embed one.',
  h1: 'Mermaid pie chart examples',
  label: 'Pie chart',
  updated: '2026-11-03',
  answer:
    'A Mermaid pie chart starts with the `pie` keyword, an optional `title`, then one line per slice: the label in double quotes, a colon, and a positive number. Mermaid works out the percentages and draws slices clockwise in the order you list them. Every example below is rendered live from its code.',
  examples: [
    {
      id: 'basic',
      title: 'Basic pie chart',
      intro: 'The whole syntax: the keyword, a title, and three slices. Values do not need to add up to 100; Mermaid turns them into shares of the total.',
      code: `pie title Where the week went
    "Meetings" : 12
    "Deep work" : 20
    "Email and chat" : 8`,
    },
    {
      id: 'show-data',
      title: 'Show the values next to the legend',
      intro: 'Add `showData` after `pie` and each legend entry shows the raw value you typed, not only the colour.',
      code: `pie showData
    title Survey responses
    "Yes" : 412
    "No" : 128
    "Not sure" : 60`,
    },
    {
      id: 'decimals',
      title: 'Decimal values',
      intro: 'Values can have up to two decimal places, which suits money and percentages.',
      code: `pie title Monthly cloud bill (USD)
    "Compute" : 1820.55
    "Storage" : 412.10
    "Network egress" : 239.75
    "Other" : 61.40`,
    },
    {
      id: 'donut',
      title: 'Donut chart',
      intro: 'Set `donutHole` in the config block to cut out the middle; valid values run from 0 to 0.9. This needs Mermaid 11.16.0 or later.',
      code: `---
config:
  pie:
    donutHole: 0.5
---
pie title Traffic by device
    "Desktop" : 58
    "Mobile" : 37
    "Tablet" : 5`,
    },
    {
      id: 'legend-and-labels',
      title: 'Legend position and label placement',
      intro: '`legendPosition` moves the legend (top, bottom, left, right or center) and `textPosition` moves the percentage labels between the centre (0) and the edge (1).',
      code: `---
config:
  pie:
    legendPosition: bottom
    textPosition: 0.6
---
pie title Bug reports by component
    "Editor" : 31
    "Sharing" : 18
    "Viewer" : 9
    "API" : 6`,
    },
    {
      id: 'colours',
      title: 'Custom slice colours',
      intro: 'Theme variables `pie1` to `pie12` set the colour of each slice in order. Use the `base` theme so your colours are not overridden.',
      code: `---
config:
  theme: base
  themeVariables:
    pie1: "#4f46e5"
    pie2: "#10b981"
    pie3: "#f59e0b"
---
pie title Release status
    "Shipped" : 14
    "In review" : 5
    "Blocked" : 2`,
    },
  ],
  sections: [
    {
      h2: 'How do you put a Mermaid pie chart in markdown?',
      paragraphs: [
        'Wrap the code in a fenced block tagged `mermaid`, three backticks and the word mermaid on the first line and three backticks on the last; the copy buttons above include the fence. GitHub, GitLab, Obsidian and Notion render the block as a chart, and so does Docs MD: [paste it into the editor](/) and the shared link shows the rendered pie, not the code.',
        'Where a platform does not render Mermaid, readers see the code, which is still legible: the labels and values are right there. To ship a picture instead, export the rendered chart to an image or [convert the document to PDF](/markdown-to-pdf), which draws the diagrams first.',
      ],
    },
    {
      h2: 'Why is my Mermaid pie chart not rendering?',
      paragraphs: [
        'Check four things in order. Labels must be in straight double quotes (`"Label"`, not curly quotes pasted from a word processor). Each slice needs a colon between the label and the value. Values must be positive: Mermaid’s documentation says zero and negative numbers are an error. And the renderer must be new enough for what you used: `donutHole`, `legendPosition` and `highlightSlice` arrived in Mermaid 11.16.0, so a platform that ships an older Mermaid renders a plain pie or fails on the config.',
        'A label that contains a double quote breaks the line; reword it or use single quotes inside the label text. If the chart renders but the slices look wrong, check the order: slices are drawn clockwise in the order of the lines, not sorted by size.',
      ],
    },
    {
      h2: 'Which configuration options does a Mermaid pie chart have?',
      paragraphs: ['These are the pie-specific options from Mermaid’s documentation. Set them in a `config` block at the top of the diagram, as in the donut and legend examples.'],
      table: {
        head: ['Option', 'What it does', 'Default'],
        rows: [
          ['`textPosition`', 'Where the percentage labels sit, from 0.0 (centre) to 1.0 (edge)', '0.75'],
          ['`donutHole`', 'Size of the hole for a donut chart, 0 to 0.9 (Mermaid 11.16.0+)', '0'],
          ['`legendPosition`', '`top`, `bottom`, `left`, `right` or `center` (11.16.0+)', '`right`'],
          ['`highlightSlice`', 'Highlights the slice with a matching label, or `hover` for the hovered slice (11.16.0+)', 'none'],
          ['`showData` (keyword)', 'Shows each value after its legend text', 'off'],
        ],
      },
    },
    {
      h2: 'When is a pie chart the wrong choice?',
      paragraphs: [
        'Pie charts show parts of one whole. They stop working when there are more than about six slices, when slices are close in size, or when the numbers are not parts of a total (two separate measurements, or values over time). For a ranked comparison a bar chart reads faster, and for change over time Mermaid’s [timeline](/mermaid-timeline-examples) or a Gantt chart fits better. If a slice would be a sliver, group the small ones into “Other”, as the cloud-bill example does.',
      ],
    },
  ],
  faq: [
    {
      q: 'Do Mermaid pie chart values have to add up to 100?',
      a: 'No. Mermaid adds up all the values and draws each slice as its share of the total, so raw counts (412 yes, 128 no) work as well as percentages. The labels on the slices show the computed percentage. If you want readers to see your original numbers too, add `showData` after `pie` and the legend shows each value.',
    },
    {
      q: 'Can a Mermaid pie chart have a zero or negative slice?',
      a: 'No. Mermaid’s documentation says pie chart values must be positive numbers greater than zero, and negative values cause an error. Leave a category with no data out of the chart, or mention it in the text around the diagram. Values may have up to two decimal places.',
    },
    {
      q: 'How do you make a donut chart in Mermaid?',
      a: 'Add a config block at the top of the diagram with `pie: donutHole: 0.5` (any value from 0 to 0.9 sets the size of the hole), then write the pie as usual. The option needs Mermaid 11.16.0 or later; on an older renderer the chart either renders as a full pie or fails, so test it on the platform where it will be read.',
    },
    {
      q: 'Does GitHub render Mermaid pie charts?',
      a: 'Yes. GitHub renders fenced `mermaid` blocks in Markdown files, issues, pull requests and discussions, and the pie chart is one of the supported diagram types. GitHub controls which Mermaid version it runs, so the newest options such as `donutHole` may not work there yet. The basic syntax with a title, slices and `showData` is safe everywhere.',
    },
  ],
  sources: [
    { label: 'Mermaid documentation: Pie chart diagrams', url: 'https://mermaid.js.org/syntax/pie.html' },
    { label: 'GitHub Docs: Creating diagrams', url: 'https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams' },
  ],
  related: ['/mermaid-timeline-examples', '/markdown-to-pdf', '/markdown-viewer', '/markdown-cheat-sheet'],
};
