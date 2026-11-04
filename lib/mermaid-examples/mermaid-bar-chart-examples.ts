import type { MermaidExamplesPage } from './types';

export const PAGE: MermaidExamplesPage = {
  slug: 'mermaid-bar-chart-examples',
  title: 'Mermaid Bar Chart Examples — xychart Syntax',
  description:
    'Mermaid bar chart syntax (xychart) with copyable examples rendered live: vertical and horizontal bars, line charts, bar plus line, labels and colours.',
  h1: 'Mermaid bar chart examples',
  label: 'Bar chart',
  updated: '2026-11-03',
  answer:
    'A Mermaid bar chart is an XY chart: start with `xychart-beta`, give the `x-axis` a list of categories, give the `y-axis` a title and range, then add a `bar [...]` line with one number per category. A `line [...]` statement draws a line chart on the same axes. Every example below is rendered live from its code.',
  examples: [
    {
      id: 'vertical-bar',
      title: 'Basic vertical bar chart',
      intro: 'The chart itself is the five lines after the second `---`: the keyword, a quoted title, the categories, the y-axis title with its range, and the values. Single-word categories need no quotes; anything with a space does. The config block above it only sets the bar colour; without it the bars take the first colour of the page’s Mermaid theme, which in the `neutral` theme used here is a very light grey.',
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
      id: 'horizontal-bar',
      title: 'Horizontal bar chart',
      intro: 'Add `horizontal` after the keyword and the bars run left to right. The rest of the code is unchanged: categories still go on the x-axis statement, even though they now appear down the side.',
      code: `xychart-beta horizontal
    title "Support tickets by channel"
    x-axis [Email, Chat, Phone, "Self-service"]
    y-axis "Tickets per week" 0 --> 200
    bar [150, 95, 40, 180]`,
    },
    {
      id: 'line-chart',
      title: 'Line chart',
      intro: 'Swap `bar` for `line` and the same data becomes a line chart. The y-axis range does not have to start at zero; here it starts at 100 so the change is easier to see. The palette line gives the line a colour that shows against a white page.',
      code: `---
config:
  themeVariables:
    xyChart:
      plotColorPalette: "#4f46e5"
---
xychart-beta
    title "Average response time"
    x-axis [Mon, Tue, Wed, Thu, Fri]
    y-axis "Milliseconds" 100 --> 400
    line [320, 280, 250, 210, 190]`,
    },
    {
      id: 'bar-and-line',
      title: 'Bar and line on one chart',
      intro: 'A chart can hold several plots. Bars for the actual figures and a line for the target is the usual pairing; both use the same categories and the same y-axis.',
      code: `xychart-beta
    title "Revenue against target"
    x-axis [Q1, Q2, Q3, Q4]
    y-axis "Revenue (thousands)" 0 --> 120
    bar [60, 75, 90, 110]
    line [70, 80, 90, 100]`,
    },
    {
      id: 'numeric-axis',
      title: 'Numeric x-axis with a range',
      intro: 'Instead of categories, the x-axis can be a numeric range written as `title min --> max`. The data points are then spread evenly across that range. Values may be negative or decimal.',
      code: `---
config:
  themeVariables:
    xyChart:
      plotColorPalette: "#4f46e5"
---
xychart-beta
    title "Temperature through the day"
    x-axis "Hour" 0 --> 24
    y-axis "Degrees C" -5 --> 30
    line [-2, -1, 4, 12, 18, 22, 17, 9, 3]`,
    },
    {
      id: 'data-labels',
      title: 'Show the value on each bar',
      intro: 'Set `showDataLabel: true` in an `xyChart` config block and every bar is labelled with its value; add `showDataLabelOutsideBar: true` to put the label above the bar instead of inside it. Both options need Mermaid 11.14.0 or later.',
      code: `---
config:
  xyChart:
    showDataLabel: true
    showDataLabelOutsideBar: true
---
xychart-beta
    title "Downloads per release"
    x-axis ["v1.0", "v1.1", "v1.2", "v2.0"]
    y-axis "Downloads" 0 --> 1200
    bar [340, 410, 520, 1100]`,
    },
    {
      id: 'colours-and-size',
      title: 'Colours and chart size',
      intro: '`plotColorPalette` under `themeVariables: xyChart` lists one colour per plot in order, here the bars then the line. `width` and `height` under `config: xyChart` set the size of the drawing.',
      code: `---
config:
  xyChart:
    width: 700
    height: 400
  themeVariables:
    xyChart:
      plotColorPalette: "#4f46e5, #f59e0b"
---
xychart-beta
    title "Visits by source"
    x-axis [Search, Direct, Social, Referral]
    y-axis "Visits" 0 --> 5000
    bar [4200, 2600, 1800, 900]
    line [3000, 3000, 3000, 3000]`,
    },
    {
      id: 'init-directive',
      title: 'The same colours with an init directive',
      intro: 'Older documents set configuration with a `%%{init: ...}%%` directive on the first line. Mermaid’s documentation marks directives as deprecated from version 10.5.0 in favour of the config block, but they still work in 11.16, so you will meet them in existing files.',
      code: `%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#10b981", "titleColor": "#111827"}}}}%%
xychart-beta
    title "Tests passing per build"
    x-axis [Build 41, Build 42, Build 43, Build 44, Build 45]
    y-axis "Passing tests" 900 --> 1000
    bar [942, 951, 968, 975, 991]`,
    },
  ],
  sections: [
    {
      h2: 'Mermaid bar chart syntax, statement by statement',
      paragraphs: [
        'Mermaid has no separate `barChart` type. Bar charts and line charts are both plots inside the XY chart, which Mermaid’s documentation describes as a module for charts with an x-axis and a y-axis. The keyword is `xychart-beta`; since Mermaid 11.10.0 the plain `xychart` is accepted as well, and 11.16 takes either. The optional `horizontal` word after the keyword flips the orientation.',
        'Everything after the keyword is optional except one data set: Mermaid’s own minimal example is `xychart` followed by a single `line [...]`. In practice you want all of the statements below.',
      ],
      table: {
        head: ['Statement', 'What it does', 'Notes'],
        rows: [
          ['`title "Text"`', 'Heading above the chart', 'Quotes needed when the title has a space'],
          ['`x-axis [a, b, c]`', 'Categorical x-axis', 'Quote any category that contains a space'],
          ['`x-axis "Title" min --> max`', 'Numeric x-axis range', 'Points are spread across the range'],
          ['`y-axis "Title" min --> max`', 'Y-axis title and range', 'Leave the range off and Mermaid fits it to the data'],
          ['`bar [n, n, n]`', 'A bar series, one value per category', 'Any numeric value, including negatives and decimals'],
          ['`line [n, n, n]`', 'A line series on the same axes', 'Several `bar` and `line` statements may follow each other'],
        ],
      },
    },
    {
      h2: 'How do you set bar colours, size and labels?',
      paragraphs: [
        'Configuration goes in a YAML block between `---` lines at the top of the diagram, as in the data-label and colour examples. Sizing and labels live under `config: xyChart`; colours are theme variables and live under `config: themeVariables: xyChart`. The options below are the ones Mermaid documents for the XY chart.',
        'Bars take their colours from `plotColorPalette` in plot order, so a bar series followed by a line series uses the first and second colours. Set the palette explicitly when the chart has to look the same everywhere: each Mermaid theme ships its own default palette, and the first colour of the `neutral` theme is `#EEE`, which is why the plain examples above render in light grey on this page. Mermaid draws every bar series across the full width of its category, which means a second `bar` statement is painted over the first rather than next to it; for a side-by-side comparison use bars for one series and a line for the other, or draw two charts.',
      ],
      table: {
        head: ['Option', 'Where', 'Effect'],
        rows: [
          ['`width`, `height`', '`config: xyChart`', 'Size of the chart in pixels (defaults 700 by 500)'],
          ['`showDataLabel`', '`config: xyChart`', 'Prints each bar’s value inside the bar (Mermaid 11.14.0+)'],
          ['`showDataLabelOutsideBar`', '`config: xyChart`', 'Moves those labels outside the bar (11.14.0+)'],
          ['`xAxis: labelRotation`', '`config: xyChart`', 'Rotates bottom x-axis labels by the given degrees, for long category names (11.16.0+)'],
          ['`plotColorPalette`', '`config: themeVariables: xyChart`', 'Comma-separated colours applied to plots in order'],
          ['`titleColor`, `xAxisLabelColor`, `yAxisLabelColor`, `backgroundColor`', '`config: themeVariables: xyChart`', 'Text and background colours'],
        ],
      },
    },
    {
      h2: 'Which platforms render a Mermaid bar chart?',
      paragraphs: [
        'The XY chart arrived in Mermaid 10.6.0, so it is younger than the pie chart or Gantt chart and fails on a renderer older than that. The optional parts matter more: data labels need 11.14.0, label rotation and per-point line labels need 11.16.0, and the `xychart` keyword without `-beta` needs 11.10.0. Write `xychart-beta` if the chart has to work on a platform whose version you do not control.',
        'GitHub renders `mermaid` blocks in issues, pull requests, discussions, wikis and Markdown files, and its documentation suggests rendering the one-word `info` diagram to see which Mermaid version it runs; the [Mermaid in Markdown](/mermaid-in-markdown) page shows that check and how GitLab, Obsidian, Notion and VS Code differ. To publish a chart outside those platforms, paste the Markdown into the [Docs MD editor](/) and share the link, or [convert the document to PDF](/markdown-to-pdf).',
      ],
    },
    {
      h2: 'Bar chart, pie chart or Gantt chart?',
      paragraphs: [
        'Use a bar chart to compare amounts across categories or to show how one measure changes over a handful of periods; the vertical form suits time on the x-axis, the horizontal form suits long category names. A [pie chart](/mermaid-pie-chart-examples) only works for parts of one whole, and a [Gantt chart](/mermaid-gantt-chart-examples) is for tasks with start and end dates rather than values. For many points over a continuous range, a `line` plot reads better than bars.',
        'Keep the data small. Mermaid charts are drawn from text in a document, not from a spreadsheet, so a chart with more than a dozen categories or more than three plots becomes hard to maintain and hard to read; split it or summarise. The [hub of Mermaid examples](/mermaid-diagram-examples) compares every chart type Docs MD covers.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is the Mermaid bar chart keyword xychart or xychart-beta?',
      a: 'Both work in Mermaid 11.16. The chart was introduced in 10.6.0 as `xychart-beta`; the `-beta` suffix was dropped from the documentation in 11.10.0, and the parser has accepted either spelling since then. Use `xychart-beta` when the chart must render on a platform whose Mermaid version you cannot check, because versions between 10.6.0 and 11.9 only recognise that form.',
    },
    {
      q: 'Can a Mermaid bar chart show negative values?',
      a: 'Yes. Mermaid’s documentation says both `bar` and `line` accept any valid numeric value, and the numeric-axis example above plots negative temperatures. Set the y-axis range so it includes the lowest value, for example `y-axis "Degrees C" -5 --> 30`; if you leave the range off, Mermaid derives it from the data.',
    },
    {
      q: 'How do I show the numbers on the bars?',
      a: 'Add a config block at the top of the diagram with `xyChart: showDataLabel: true`. The value is printed inside each bar; add `showDataLabelOutsideBar: true` to print it above the bar instead. Both options were added in Mermaid 11.14.0, so on an older renderer the chart draws without labels or fails on the unknown option.',
    },
    {
      q: 'Can I draw two bar series side by side in Mermaid?',
      a: 'Not as grouped bars. Each `bar` statement is drawn across the full width of its category, so a second series is painted over the first and hides it where it is shorter. Mermaid’s documentation shows multiple bars and lines in one chart for colour demonstrations, but for a readable comparison pair a bar series with a line series, as the revenue example does, or use two charts.',
    },
    {
      q: 'Why does my Mermaid bar chart not render?',
      a: 'Check the keyword first: `xychart-beta` works everywhere the chart exists, `xychart` only from 11.10.0. Then check quoting: categories and titles with spaces must be in double quotes. Make sure every `bar` or `line` has the same number of values as there are categories, and that the config block, if any, uses `xyChart` with a capital C. Finally confirm the platform runs Mermaid 10.6.0 or later with the `info` diagram.',
    },
  ],
  sources: [
    { label: 'Mermaid documentation: XY chart', url: 'https://mermaid.js.org/syntax/xyChart.html' },
    { label: 'Mermaid documentation: Directives', url: 'https://mermaid.js.org/config/directives.html' },
    { label: 'Mermaid changelog', url: 'https://github.com/mermaid-js/mermaid/blob/develop/packages/mermaid/CHANGELOG.md' },
    { label: 'GitHub Docs: Creating diagrams', url: 'https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams' },
  ],
  related: ['/mermaid-pie-chart-examples', '/mermaid-gantt-chart-examples', '/mermaid-in-markdown', '/mermaid-diagram-examples', '/markdown-to-pdf'],
};
