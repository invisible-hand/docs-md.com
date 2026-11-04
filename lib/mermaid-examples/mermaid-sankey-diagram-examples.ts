import type { MermaidExamplesPage } from './types';

export const PAGE: MermaidExamplesPage = {
  slug: 'mermaid-sankey-diagram-examples',
  title: 'Mermaid Sankey Diagram Examples — Syntax and Copyable Code',
  description:
    'Mermaid sankey-beta syntax with copyable examples rendered live: energy flow, budget, user funnel, website traffic, CSV rules, colours and alignment.',
  h1: 'Mermaid sankey diagram examples',
  label: 'Sankey diagram',
  updated: '2026-11-03',
  answer:
    'A Mermaid sankey diagram is the keyword `sankey-beta` followed by CSV: one line per flow with exactly three columns, source, target and value. Mermaid lays out the nodes left to right and draws each link with a width proportional to its value. Every example below is rendered live from its code.',
  examples: [
    {
      id: 'energy-flow',
      title: 'Basic sankey: energy flow',
      intro: 'The minimum: the keyword, a blank line, then `source,target,value` rows. Nodes are created from the names as they appear, so spelling must match exactly between rows. The `%%` line is a comment.',
      code: `sankey-beta

%% source,target,value
Solar,Electricity grid,30
Wind,Electricity grid,45
Gas,Electricity grid,60
Electricity grid,Homes,70
Electricity grid,Industry,50
Electricity grid,Losses,15`,
    },
    {
      id: 'budget',
      title: 'Monthly budget',
      intro: 'Income on the left, one shared node in the middle, spending on the right. Blank lines between groups are allowed and make the CSV easier to read; Mermaid ignores them.',
      code: `sankey-beta

Salary,Budget,4200
Freelance,Budget,800

Budget,Rent,1500
Budget,Groceries,600
Budget,Transport,250
Budget,Bills,1000
Budget,Savings,1200
Budget,Fun,450`,
    },
    {
      id: 'user-funnel',
      title: 'User funnel with drop-off',
      intro: 'A funnel reads naturally as a sankey because the people who leave at each step get their own node. Here every stage splits into the next stage and a drop-off, so the widths tell the story without percentages.',
      code: `sankey-beta

Visitors,Signed up,1200
Visitors,Left,8800
Signed up,Activated,700
Signed up,Churned,500
Activated,Paid,210
Activated,Free tier,490`,
    },
    {
      id: 'website-traffic',
      title: 'Website traffic with commas in names',
      intro: 'A name that contains a comma must be wrapped in double quotes, exactly as in a CSV file. The same node name is reused as a target and later as a source, which is what joins the two halves of the diagram.',
      code: `sankey-beta

Organic search,Blog,5400
Organic search,Docs,2100
Social,Blog,1300
Direct,Docs,1600
Newsletter,"Pricing, plans",900
Blog,"Pricing, plans",1500
Blog,Exit,5200
Docs,Sign up,1100
Docs,Exit,2600
"Pricing, plans",Sign up,1400
"Pricing, plans",Exit,1000`,
    },
    {
      id: 'alignment-and-colours',
      title: 'Link colours, node alignment and size',
      intro: 'Configuration goes in a YAML block above the keyword. `linkColor` can be `source`, `target`, `gradient` or a hex colour; `nodeAlignment` is `justify`, `center`, `left` or `right`; `showValues: false` hides the numbers next to the node names.',
      code: `---
config:
  sankey:
    showValues: false
    linkColor: gradient
    nodeAlignment: left
    width: 700
    height: 350
---
sankey-beta

Applicants,Phone screen,120
Applicants,Rejected,280
Phone screen,Interview,45
Phone screen,Rejected,75
Interview,Offer,12
Interview,Rejected,33
Offer,Hired,9
Offer,Declined,3`,
    },
    {
      id: 'node-width-and-labels',
      title: 'Node width, padding, label style and node colours',
      intro: 'Mermaid 11.15.0 added `nodeWidth`, `nodePadding`, the `outlined` label style and a `nodeColors` map keyed by node name. Nodes not listed keep the default palette. On an older renderer these options are unknown, so test where the document will be read.',
      code: `---
config:
  sankey:
    showValues: false
    labelStyle: outlined
    nodeWidth: 16
    nodePadding: 18
    nodeColors:
      Losses: "#9ca3af"
      Homes: "#4f46e5"
      Factories: "#f59e0b"
---
sankey-beta

Power plant,Grid,100
Grid,Homes,55
Grid,Factories,35
Grid,Losses,10`,
    },
  ],
  sections: [
    {
      h2: 'Mermaid sankey syntax: the CSV rules',
      paragraphs: [
        'Mermaid’s documentation describes the idea plainly: type the `sankey-beta` keyword, paste raw CSV underneath, get a diagram. The CSV follows RFC 4180 with two differences. It must have exactly three columns, read as source, target and value; and empty lines without commas are allowed for readability. A value with a comma inside goes in double quotes, and a literal double quote is written as two double quotes inside a quoted field.',
        'Nodes are not declared anywhere. Every distinct name in the first two columns becomes a node, and a node that appears as a target in one row and a source in another connects the stages. Values can be decimals, as in Mermaid’s own energy example with figures such as `124.729`. Mermaid still labels the diagram experimental and says the syntax may be extended, which is a reason to keep to these basics.',
      ],
      table: {
        head: ['Rule', 'Example'],
        rows: [
          ['Three columns: source, target, value', '`Visitors,Signed up,1200`'],
          ['Blank lines are allowed', 'A blank line between income rows and spending rows'],
          ['Comma inside a name: quote the name', '`Newsletter,"Pricing, plans",900`'],
          ['Double quote inside a name: double it', '`Pumped heat,"Heating ""homes""",193`'],
          ['Comments', 'A line starting with `%%`'],
        ],
      },
    },
    {
      h2: 'Do the flows have to balance?',
      paragraphs: [
        'No. Mermaid does not check that what flows into a node equals what flows out, and the diagram renders either way. Mermaid uses the d3-sankey layout, which sizes a node by the larger of its total inflow and its total outflow, so an unbalanced node simply shows a gap on its smaller side. That is sometimes what you want: the budget example above could leave the Budget node wider on the income side to show money left over.',
        'Balanced data is easier to read, though, because every band that enters a node leaves it again. The funnel example is balanced by construction: each stage splits into the next stage and a drop-off node, and the two numbers add up to the stage total. When you build a sankey from real figures, add a node such as Other or Losses to absorb the difference rather than leaving readers to guess.',
      ],
    },
    {
      h2: 'Which configuration options does a sankey diagram have?',
      paragraphs: [
        'All options sit under `config: sankey` in the YAML block at the top of the diagram. The first group has existed since the diagram arrived in Mermaid 10.3.0; the second group was added in 11.15.0.',
      ],
      table: {
        head: ['Option', 'Values', 'Since'],
        rows: [
          ['`showValues`', '`true` (default) or `false`: show the value next to each node name', '10.3.0'],
          ['`linkColor`', '`source`, `target`, `gradient` or a hex colour such as `#a1a1a1`', '10.3.0'],
          ['`nodeAlignment`', '`justify` (default), `center`, `left` or `right`', '10.3.0'],
          ['`width`, `height`', 'Size of the diagram in pixels', '10.3.0'],
          ['`labelStyle`', '`legacy` (default, plain text) or `outlined` (text with a background stroke)', '11.15.0'],
          ['`nodeWidth`', 'Width of the node bars in pixels (default 10)', '11.15.0'],
          ['`nodePadding`', 'Vertical gap between nodes in pixels (default 12)', '11.15.0'],
          ['`nodeColors`', 'Map of node name to CSS colour; unlisted nodes use the default palette', '11.15.0'],
        ],
      },
    },
    {
      h2: 'Where does a sankey diagram render, and when should you use one?',
      paragraphs: [
        'The sankey diagram arrived in Mermaid 10.3.0 as `sankey-beta`; the `-beta` suffix was dropped from the documentation in 11.10.0 and both keywords are accepted in 11.16, so `sankey-beta` is the safer spelling for a document whose renderer you do not control. The node and label options need 11.15.0. GitHub renders `mermaid` blocks in issues, pull requests, discussions, wikis and Markdown files and suggests the `info` diagram to check its version; the [Mermaid in Markdown](/mermaid-in-markdown) page shows that check and the differences between GitHub, GitLab, Obsidian, Notion and VS Code. For readers elsewhere, paste the Markdown into the [Docs MD editor](/) and share the rendered page.',
        'Use a sankey when the question is where quantities go: energy, money, traffic, people through a process. It is a poor fit for comparing independent totals, where a [bar chart](/mermaid-bar-chart-examples) is clearer, and for shares of one whole, where a [pie chart](/mermaid-pie-chart-examples) is enough. Keep to roughly a dozen nodes; the layout stays readable, and the CSV stays easy to update when the numbers change.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is the Mermaid sankey keyword sankey or sankey-beta?',
      a: 'Both work in Mermaid 11.16. The diagram was introduced in 10.3.0 as `sankey-beta`; the suffix was dropped from the documentation in 11.10.0 and the parser has accepted either spelling since. Use `sankey-beta` when the document may be rendered by a platform on an older Mermaid, because versions between 10.3.0 and 11.9 only recognise that form.',
    },
    {
      q: 'Why does my Mermaid sankey diagram not render?',
      a: 'Almost always the CSV. Every data row needs exactly three comma-separated columns, so a name containing a comma must be in double quotes and a row must not end with a trailing comma. Node names must match exactly between rows, including case and spaces. Check the keyword is `sankey-beta` and that the config block, if present, is valid YAML. Finally confirm the platform runs Mermaid 10.3.0 or later with the `info` diagram.',
    },
    {
      q: 'How do I hide the numbers in a Mermaid sankey diagram?',
      a: 'Add a config block at the top of the diagram with `sankey: showValues: false`. The node names stay and the values disappear; the link widths still carry the proportions. Mermaid’s own documentation uses this setting in its main energy example because the raw figures clutter a diagram with many nodes.',
    },
    {
      q: 'Can I set the colour of a specific node?',
      a: 'Yes, from Mermaid 11.15.0: add a `nodeColors` map under `config: sankey` with the node name as the key and any CSS colour as the value, for example `Losses: "#9ca3af"`. Nodes you do not list keep the default palette. For the links, set `linkColor` to `source`, `target`, `gradient` or a single hex colour; that option has existed since the diagram was added.',
    },
    {
      q: 'Can a Mermaid sankey diagram have a cycle?',
      a: 'No. A sankey shows flow in one direction, from sources on the left to sinks on the right, and the d3-sankey layout Mermaid uses rejects a loop with a `circular link` error, so a diagram with rows such as `A,B,10`, `B,C,10` and `C,A,5` fails to render. If a quantity genuinely returns to an earlier stage, such as recycled material, model the return as a separate node named for the return rather than linking back to the original node.',
    },
  ],
  sources: [
    { label: 'Mermaid documentation: Sankey diagram', url: 'https://mermaid.js.org/syntax/sankey.html' },
    { label: 'Mermaid release v10.3.0 (sankey diagrams added)', url: 'https://github.com/mermaid-js/mermaid/releases/tag/v10.3.0' },
    { label: 'Mermaid changelog', url: 'https://github.com/mermaid-js/mermaid/blob/develop/packages/mermaid/CHANGELOG.md' },
    { label: 'GitHub Docs: Creating diagrams', url: 'https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams' },
  ],
  related: ['/mermaid-bar-chart-examples', '/mermaid-pie-chart-examples', '/mermaid-in-markdown', '/mermaid-diagram-examples'],
};
