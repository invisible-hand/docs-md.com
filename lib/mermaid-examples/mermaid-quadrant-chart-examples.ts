import type { MermaidExamplesPage } from './types';

export const PAGE: MermaidExamplesPage = {
  slug: 'mermaid-quadrant-chart-examples',
  title: 'Mermaid Quadrant Chart Examples — Syntax and Copyable Code',
  description:
    'Mermaid quadrantChart syntax with copyable examples rendered live: priority matrix, effort and impact, risk matrix, point styling and theme config.',
  h1: 'Mermaid quadrant chart examples',
  label: 'Quadrant chart',
  updated: '2026-11-03',
  answer:
    'A Mermaid quadrant chart starts with `quadrantChart`, names the two ends of each axis with `x-axis Left --> Right` and `y-axis Bottom --> Top`, labels the four quadrants with `quadrant-1` to `quadrant-4`, then plots points as `Name: [x, y]` with both values between 0 and 1. Every example below is rendered live from its code.',
  examples: [
    {
      id: 'priority-matrix',
      title: 'Priority matrix (urgent and important)',
      intro: 'The classic four-box prioritisation. Quadrant 1 is the top right, where both values are high; the numbering then runs anticlockwise, so quadrant 2 is top left, 3 bottom left and 4 bottom right.',
      code: `quadrantChart
    title Priority matrix
    x-axis Low urgency --> High urgency
    y-axis Low importance --> High importance
    quadrant-1 Do first
    quadrant-2 Schedule
    quadrant-3 Drop
    quadrant-4 Delegate
    Fix login bug: [0.9, 0.85]
    Write quarterly report: [0.3, 0.8]
    Update team wiki: [0.2, 0.3]
    Answer vendor email: [0.8, 0.25]`,
    },
    {
      id: 'effort-impact',
      title: 'Effort and impact of backlog items',
      intro: 'Put effort on the x-axis and impact on the y-axis and the top-left quadrant becomes the quick wins. Point names can contain spaces; the coordinates are fractions of the chart, not real units.',
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
    Rewrite billing: [0.9, 0.3]
    Keyboard shortcuts: [0.3, 0.6]`,
    },
    {
      id: 'risk-matrix',
      title: 'Risk matrix (likelihood and impact)',
      intro: 'A risk register as a chart: likelihood left to right, severity bottom to top. Points close to the top right need action; points near the bottom left can be accepted.',
      code: `quadrantChart
    title Risk register
    x-axis Unlikely --> Likely
    y-axis Minor impact --> Severe impact
    quadrant-1 Mitigate now
    quadrant-2 Plan a response
    quadrant-3 Accept
    quadrant-4 Monitor
    Key supplier fails: [0.25, 0.9]
    Cloud bill overrun: [0.7, 0.45]
    Staff turnover: [0.6, 0.6]
    Office flood: [0.1, 0.7]
    Short outage: [0.8, 0.2]`,
    },
    {
      id: 'point-styling',
      title: 'Point colours and sizes',
      intro: 'Style a single point by adding `radius`, `color`, `stroke-color` and `stroke-width` after its coordinates, separated by commas. A larger radius is a simple way to encode a third value such as budget.',
      code: `quadrantChart
    title Campaign review
    x-axis Low reach --> High reach
    y-axis Low engagement --> High engagement
    quadrant-1 Expand
    quadrant-2 Promote
    quadrant-3 Rethink
    quadrant-4 Improve
    Newsletter: [0.3, 0.7] radius: 8
    Podcast ads: [0.6, 0.3] color: #f59e0b, radius: 10
    Launch video: [0.85, 0.8] radius: 12, color: #4f46e5, stroke-color: #312e81, stroke-width: 2px`,
    },
    {
      id: 'classes',
      title: 'Shared styles with classDef',
      intro: 'When several points share a style, define it once with `classDef` and attach it with `:::name` between the point name and the colon. Direct styles override class styles, which override the theme.',
      code: `quadrantChart
    title Feature requests
    x-axis Few requests --> Many requests
    y-axis Low revenue --> High revenue
    quadrant-1 Build next
    quadrant-2 Validate
    quadrant-3 Park
    quadrant-4 Bundle
    SSO:::enterprise: [0.4, 0.9]
    Audit log:::enterprise: [0.3, 0.75]
    Dark mode:::community: [0.85, 0.2]
    Emoji reactions:::community: [0.7, 0.1]
    classDef enterprise color: #4f46e5, radius: 9
    classDef community color: #10b981, radius: 9`,
    },
    {
      id: 'theme-config',
      title: 'Quadrant colours and chart size',
      intro: 'Size options such as `chartWidth` and `pointRadius` go under `config: quadrantChart`; colours are theme variables such as `quadrant1Fill`. This example tints each quadrant and enlarges every point.',
      code: `---
config:
  quadrantChart:
    chartWidth: 500
    chartHeight: 400
    pointRadius: 7
  themeVariables:
    quadrant1Fill: "#e0e7ff"
    quadrant2Fill: "#dcfce7"
    quadrant3Fill: "#f3f4f6"
    quadrant4Fill: "#fee2e2"
    quadrantPointFill: "#111827"
---
quadrantChart
    title Vendor evaluation
    x-axis Low cost --> High cost
    y-axis Low quality --> High quality
    quadrant-1 Premium
    quadrant-2 Best value
    quadrant-3 Budget
    quadrant-4 Overpriced
    Vendor A: [0.2, 0.8]
    Vendor B: [0.7, 0.9]
    Vendor C: [0.3, 0.3]
    Vendor D: [0.8, 0.35]`,
    },
  ],
  sections: [
    {
      h2: 'Mermaid quadrant chart syntax',
      paragraphs: [
        'The quadrant chart was added in Mermaid 10.2.0 and its syntax has stayed small. Every statement is optional apart from the keyword; a chart with no points draws the axis labels and quadrant names centred in their quadrants, and once points exist the x-axis labels move to the bottom edge and the quadrant names to the top of each quadrant.',
        'Axis statements name the ends of an axis, not a scale. `x-axis Left --> Right` renders both labels, `x-axis Left` only the left one; `y-axis Bottom --> Top` works the same way from bottom to top. Mermaid 11.15.0 extended the parser so that unquoted labels may contain accented, CJK and emoji characters.',
      ],
      table: {
        head: ['Statement', 'Meaning'],
        rows: [
          ['`title Text`', 'Heading above the chart'],
          ['`x-axis Left --> Right`', 'Labels for the left and right ends of the x-axis'],
          ['`y-axis Bottom --> Top`', 'Labels for the bottom and top ends of the y-axis'],
          ['`quadrant-1 Text`', 'Label of the top-right quadrant'],
          ['`quadrant-2 Text`', 'Label of the top-left quadrant'],
          ['`quadrant-3 Text`', 'Label of the bottom-left quadrant'],
          ['`quadrant-4 Text`', 'Label of the bottom-right quadrant'],
          ['`Name: [x, y]`', 'A point; x and y run from 0 to 1'],
          ['`Name:::class: [x, y]`', 'A point with a class defined by `classDef`'],
        ],
      },
    },
    {
      h2: 'How do the coordinates work?',
      paragraphs: [
        'Both coordinates are fractions of the chart: `[0, 0]` is the bottom-left corner and `[1, 1]` the top-right, so `[0.5, 0.5]` sits exactly on the crossing of the quadrant lines. To plot real data, scale it yourself; a risk scored 4 out of 5 for likelihood becomes `0.8`. Mermaid does not draw tick marks or numbers along the axes, which keeps the chart honest about being a judgement rather than a measurement.',
        'Points are drawn in the order written, and a label is placed under each point. When two points are close their labels overlap, so spread the values a little or shorten the names. The default point radius is 5; raise `pointRadius` in the config to make the chart readable at a glance, as the vendor example does.',
      ],
    },
    {
      h2: 'Which options does a quadrant chart have?',
      paragraphs: [
        'Layout options live under `config: quadrantChart` and colours under `config: themeVariables`, both in the YAML block at the top of the diagram. These are the ones you are most likely to need; Mermaid’s documentation lists the full set, including padding and font sizes for every text element.',
      ],
      table: {
        head: ['Option', 'Where', 'Effect', 'Default'],
        rows: [
          ['`chartWidth`, `chartHeight`', '`quadrantChart`', 'Size of the chart in pixels', '500, 500'],
          ['`pointRadius`', '`quadrantChart`', 'Radius of every point without its own radius', '5'],
          ['`xAxisPosition`', '`quadrantChart`', '`top` or `bottom`; with points present the x-axis is always at the bottom', '`top`'],
          ['`yAxisPosition`', '`quadrantChart`', '`left` or `right`', '`left`'],
          ['`quadrant1Fill` to `quadrant4Fill`', '`themeVariables`', 'Background colour of each quadrant', 'theme'],
          ['`quadrant1TextFill` to `quadrant4TextFill`', '`themeVariables`', 'Colour of each quadrant label', 'theme'],
          ['`quadrantPointFill`, `quadrantPointTextFill`', '`themeVariables`', 'Default point colour and point label colour', 'theme'],
          ['`quadrantXAxisTextFill`, `quadrantYAxisTextFill`, `quadrantTitleFill`', '`themeVariables`', 'Axis label and title colours', 'theme'],
        ],
      },
    },
    {
      h2: 'Where does a quadrant chart render, and when is it the wrong chart?',
      paragraphs: [
        'Because the type dates from Mermaid 10.2.0, any platform on Mermaid 10.2 or later draws the basic chart; per-point styling and `classDef` are documented for 11.16 and may not exist on an older renderer, so test them where the document will be read. GitHub renders `mermaid` blocks in issues, pull requests, discussions, wikis and Markdown files and suggests the `info` diagram to check its version; the [Mermaid in Markdown](/mermaid-in-markdown) page covers that check and the other platforms. Outside those platforms, paste the Markdown into the [Docs MD editor](/) and share the rendered page.',
        'A quadrant chart is for sorting a short list of items by two judgements. It is the wrong choice for measured data with real scales, where a [bar chart](/mermaid-bar-chart-examples) or line chart shows the numbers, and for comparing one item across many criteria, where a [radar chart](/mermaid-radar-chart-examples) fits. More than about fifteen points makes the labels collide; split the chart by team or by time period instead.',
      ],
    },
  ],
  faq: [
    {
      q: 'What range do Mermaid quadrant chart points use?',
      a: 'Both coordinates run from 0 to 1. Mermaid’s documentation states that the minimum is 0 and the maximum is 1, with `[0, 0]` at the bottom left and `[1, 1]` at the top right. Convert your own scores before plotting, for example by dividing a 1-to-10 score by 10. Values outside the range are not meaningful and may draw outside the quadrants.',
    },
    {
      q: 'Which quadrant is quadrant-1 in Mermaid?',
      a: 'The top-right one, where both x and y are high. The numbering continues anticlockwise: `quadrant-2` is top left, `quadrant-3` bottom left and `quadrant-4` bottom right. This matches the mathematical convention for quadrants of a plane. When you write a priority matrix, put the label for high-urgency, high-importance items on `quadrant-1`.',
    },
    {
      q: 'Can I colour individual points in a quadrant chart?',
      a: 'Yes. After the coordinates add `color: #hex` and optionally `radius`, `stroke-color` and `stroke-width`, separated by commas. For several points with the same look, define a class with `classDef name color: #hex, radius: 9` and attach it with `Name:::name: [x, y]`. Direct styles win over class styles, and class styles win over theme variables such as `quadrantPointFill`.',
    },
    {
      q: 'Why are my x-axis labels at the bottom even though I set xAxisPosition to top?',
      a: 'Because the chart has points. Mermaid’s documentation says the `xAxisPosition` option only applies to a chart without points; as soon as any point is plotted, the x-axis labels are drawn at the bottom and the quadrant labels move to the top of each quadrant. Remove the points to see the labels centred, or accept the bottom placement, which is what readers expect.',
    },
    {
      q: 'Does GitHub render Mermaid quadrant charts?',
      a: 'GitHub renders Mermaid blocks in issues, pull requests, discussions, wikis and Markdown files, and it chooses the Mermaid version it runs; the quadrant chart needs 10.2.0 or later and point styling is newer still. Its documentation suggests rendering an `info` block to see the version in use. If the basic chart draws but styled points do not, remove the styling or keep the chart in a document rendered elsewhere.',
    },
  ],
  sources: [
    { label: 'Mermaid documentation: Quadrant chart', url: 'https://mermaid.js.org/syntax/quadrantChart.html' },
    { label: 'Mermaid release v10.2.0 (quadrant chart added)', url: 'https://github.com/mermaid-js/mermaid/releases/tag/v10.2.0' },
    { label: 'GitHub Docs: Creating diagrams', url: 'https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams' },
  ],
  related: ['/mermaid-bar-chart-examples', '/mermaid-radar-chart-examples', '/mermaid-in-markdown', '/mermaid-diagram-examples', '/share-implementation-plan'],
};
