import type { MermaidExamplesPage } from './types';

export const PAGE: MermaidExamplesPage = {
  slug: 'mermaid-radar-chart-examples',
  title: 'Mermaid Radar Chart Examples — Syntax and Copyable Code',
  description:
    'Mermaid radar-beta syntax with copyable examples rendered live: skill charts, product comparisons, axis and curve statements, graticule, ticks and colours.',
  h1: 'Mermaid radar chart examples',
  label: 'Radar chart',
  updated: '2026-11-03',
  answer:
    'A Mermaid radar chart starts with `radar-beta`, lists its spokes with `axis`, then adds one `curve` per item compared, with a value for every axis in braces. Optional keywords set `max`, `min`, the `graticule` shape, the `ticks` and the legend. Radar charts need Mermaid 11.6.0 or later. Every example below is rendered live from its code.',
  examples: [
    {
      id: 'skills',
      title: 'Basic radar chart: a skills self-assessment',
      intro: 'Each `axis` entry is an id with a label in quotes; several axes may share a line. The `curve` lists one value per axis in the same order, and `max` fixes the outer ring so that the scale is honest.',
      code: `radar-beta
  title Skills self-assessment
  axis c["Communication"], t["Technical depth"], l["Leadership"]
  axis d["Design"], p["Planning"]
  curve now["Now"]{3, 4, 2, 3, 4}
  max 5
  min 0`,
    },
    {
      id: 'product-comparison',
      title: 'Compare three products',
      intro: 'Add more `curve` lines and the chart overlays them, one colour each, with a legend. Three or four curves is the practical limit before the shapes hide each other.',
      code: `radar-beta
  title Laptop comparison
  axis battery["Battery"], screen["Screen"], weight["Portability"]
  axis perf["Performance"], price["Value"]
  curve a["Model A"]{4, 5, 3, 5, 2}
  curve b["Model B"]{5, 3, 5, 3, 4}
  curve c["Model C"]{3, 4, 4, 4, 5}
  max 5
  min 0`,
    },
    {
      id: 'key-value-curves',
      title: 'Values keyed by axis id',
      intro: 'Instead of relying on order, a curve can name the axis for each value as `id: value` pairs. The pairs may be in any order, which is safer when the axes change later.',
      code: `radar-beta
  title Team skills coverage
  axis fe["Frontend"], be["Backend"], ops["Operations"], data["Data"]
  curve alice["Alice"]{ fe: 5, be: 3, ops: 2, data: 4 }
  curve bob["Bob"]{ be: 5, ops: 4, fe: 2, data: 3 }
  max 5
  min 0`,
    },
    {
      id: 'polygon-graticule',
      title: 'Polygon grid and fewer ticks',
      intro: 'The graticule is the grid behind the curves. `graticule polygon` draws straight-sided rings instead of circles, and `ticks 4` sets how many rings there are (the default is 5).',
      code: `radar-beta
  title Quarterly health check
  axis q["Quality"], s["Speed"], c["Cost"], m["Morale"], r["Risk"]
  curve q1["Q1"]{70, 55, 60, 80, 45}
  curve q2["Q2"]{80, 65, 55, 75, 60}
  graticule polygon
  ticks 4
  max 100
  min 0`,
    },
    {
      id: 'single-curve-no-legend',
      title: 'One curve without a legend',
      intro: 'With a single curve the legend repeats the title, so turn it off with `showLegend false`. Axis ids can be any word; only the quoted labels are shown.',
      code: `radar-beta
  title Coffee tasting notes
  axis acid["Acidity"], body["Body"], sweet["Sweetness"], finish["Finish"], aroma["Aroma"]
  curve e["Ethiopian"]{8, 5, 7, 6, 9}
  showLegend false
  max 10
  min 0`,
    },
    {
      id: 'colours',
      title: 'Curve colours and grid styling',
      intro: 'Curve colours come from the theme colour scale `cScale0`, `cScale1` and so on, set under `themeVariables` with the `base` theme. Radar-specific styling such as `axisColor`, `graticuleColor` and `curveOpacity` sits under `themeVariables: radar`.',
      code: `---
config:
  theme: base
  themeVariables:
    cScale0: "#4f46e5"
    cScale1: "#10b981"
    radar:
      axisColor: "#6b7280"
      graticuleColor: "#9ca3af"
      curveOpacity: 0.35
---
radar-beta
  title Before and after the redesign
  axis speed["Speed"], ux["Ease of use"], acc["Accessibility"], vis["Visual design"]
  curve before["Before"]{2, 3, 2, 2}
  curve after["After"]{4, 4, 5, 5}
  max 5
  min 0`,
    },
  ],
  sections: [
    {
      h2: 'Mermaid radar chart syntax',
      paragraphs: [
        'Mermaid added the radar chart in version 11.6.0 under the keyword `radar-beta`; the documentation also calls it a spider, star, cobweb or polar chart and a Kiviat diagram. The syntax has two building blocks. `axis` defines the spokes, each as an id with an optional quoted label, and several may be listed on one line separated by commas. `curve` defines one data series as an id, an optional quoted label and a brace list of values, either plain numbers in axis order or `axisId: value` pairs in any order.',
        'The remaining keywords are options and can appear anywhere after the axes. A `title` line puts a heading above the chart; the same effect comes from a `title:` field in a YAML block at the top of the diagram.',
      ],
      table: {
        head: ['Keyword', 'Meaning', 'Default'],
        rows: [
          ['`axis id["Label"], ...`', 'One or more spokes', 'required'],
          ['`curve id["Label"]{v, v, ...}`', 'A data series, values in axis order', 'required'],
          ['`curve id{ axisId: v, ... }`', 'A data series with values keyed by axis id', '—'],
          ['`max n`', 'Value of the outer ring', 'largest value in the data'],
          ['`min n`', 'Value at the centre', '0'],
          ['`graticule circle` or `polygon`', 'Shape of the grid rings', '`circle`'],
          ['`ticks n`', 'Number of grid rings', '5'],
          ['`showLegend true` or `false`', 'Show the legend', '`true`'],
        ],
      },
    },
    {
      h2: 'How do you change colours and size?',
      paragraphs: [
        'Colours are theme variables. Each curve takes the next colour from the theme colour scale, `cScale0` for the first curve, `cScale1` for the second, up to the theme’s maximum of usually twelve. Override them under `config: themeVariables` with `theme: base` so that your values are not replaced. Styling specific to the radar, such as the axis colour, the graticule colour and opacity, the curve width and opacity, and the legend font size, goes one level deeper under `themeVariables: radar`.',
        'Size and geometry are configuration rather than theme: `width` and `height` (both 600 by default), the four margins, `axisScaleFactor`, `axisLabelFactor` for pushing labels away from the spokes, and `curveTension` for how rounded the curves are. These go under `config: radar`.',
      ],
      table: {
        head: ['Setting', 'Where', 'Default'],
        rows: [
          ['`cScale0` … `cScale11`', '`themeVariables`', 'theme'],
          ['`axisColor`, `axisStrokeWidth`, `axisLabelFontSize`', '`themeVariables: radar`', '`black`, 1, `12px`'],
          ['`curveOpacity`, `curveStrokeWidth`', '`themeVariables: radar`', '0.7, 2'],
          ['`graticuleColor`, `graticuleOpacity`, `graticuleStrokeWidth`', '`themeVariables: radar`', '`black`, 0.5, 1'],
          ['`legendBoxSize`, `legendFontSize`', '`themeVariables: radar`', '10, `14px`'],
          ['`width`, `height`', '`config: radar`', '600, 600'],
          ['`axisScaleFactor`, `axisLabelFactor`, `curveTension`', '`config: radar`', '1, 1.05, 0.17'],
        ],
      },
    },
    {
      h2: 'Which platforms render a Mermaid radar chart?',
      paragraphs: [
        'Only renderers on Mermaid 11.6.0 or later. The type is young, and platforms embed their own copy of Mermaid: docs-md.com runs 11.16, GitLab’s Markdown documentation states the Mermaid major version it supports, and GitHub’s documentation suggests rendering the one-word `info` diagram to see the version it uses. The [Mermaid in Markdown](/mermaid-in-markdown) page shows that check and how GitHub, GitLab, Obsidian, Notion and VS Code embed diagrams.',
        'Where the renderer is too old, readers see the code, which for a radar chart is still a readable table of axes and values. To share the drawn chart with people outside those platforms, paste the Markdown into the [Docs MD editor](/) and send the link, or [convert the document to PDF](/markdown-to-pdf).',
      ],
    },
    {
      h2: 'When is a radar chart the right choice?',
      paragraphs: [
        'A radar chart compares a few items across several criteria measured on the same scale: skills, product features, review scores, health metrics. It works when the axes share one scale and there are between three and about eight of them. Set `max` explicitly so that two charts drawn on different days stay comparable, and keep the number of curves to three or four.',
        'When the criteria have different units, a radar chart misleads; use a [bar chart](/mermaid-bar-chart-examples) per criterion instead. When you are sorting items by just two judgements, a [quadrant chart](/mermaid-quadrant-chart-examples) is clearer. And when the values are shares of one whole, a [pie chart](/mermaid-pie-chart-examples) is enough. The [hub of Mermaid examples](/mermaid-diagram-examples) compares every chart type Docs MD covers.',
      ],
    },
  ],
  faq: [
    {
      q: 'Which Mermaid version added radar charts?',
      a: 'Mermaid 11.6.0. The keyword is `radar-beta`, and in Mermaid 11.16 that is still the only accepted spelling. A platform on an older Mermaid shows the code as text or reports an unknown diagram type, so render the `info` diagram there first to see which version it runs.',
    },
    {
      q: 'Why does my Mermaid radar chart show a syntax error?',
      a: 'Check the version first: anything older than 11.6.0 cannot parse `radar-beta`. Then check the braces: every curve needs one value per axis, in braces, separated by commas, and a keyed curve uses the axis ids exactly as declared. Labels must be in double quotes inside square brackets, and the options `max`, `min`, `ticks`, `graticule` and `showLegend` must be spelled exactly like that.',
    },
    {
      q: 'How do I change the colours of a Mermaid radar chart?',
      a: 'Add a YAML config block at the top of the diagram with `theme: base` and set `cScale0`, `cScale1` and so on under `themeVariables`; each curve takes the next colour in that scale. Axis, grid and legend styling go under `themeVariables: radar`, for example `axisColor`, `graticuleColor` and `curveOpacity`. The colour example on this page shows the complete block.',
    },
    {
      q: 'What is the graticule in a Mermaid radar chart?',
      a: 'The grid behind the curves: the concentric rings that mark the scale and the spokes that mark the axes. Mermaid’s documentation uses the word for the ring shape, which is `circle` by default and `polygon` when you write `graticule polygon`. The `ticks` keyword sets how many rings are drawn, five by default, and the `radar` theme variables set their colour and opacity.',
    },
    {
      q: 'Do all curves need a value for every axis?',
      a: 'Give every curve a value for every axis. Plain values are matched to the axes in order, so a short list leaves the remaining axes undefined; keyed values match by axis id, so a missing key leaves that axis without a point. Use the keyed form when curves come from different sources, and fill genuine gaps with the `min` value so the shape stays closed and readers can see the gap.',
    },
  ],
  sources: [
    { label: 'Mermaid documentation: Radar diagram', url: 'https://mermaid.js.org/syntax/radar.html' },
    { label: 'Mermaid changelog (radar chart added in 11.6.0)', url: 'https://github.com/mermaid-js/mermaid/blob/develop/packages/mermaid/CHANGELOG.md' },
    { label: 'GitHub Docs: Creating diagrams', url: 'https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams' },
  ],
  related: ['/mermaid-bar-chart-examples', '/mermaid-quadrant-chart-examples', '/mermaid-pie-chart-examples', '/mermaid-in-markdown', '/mermaid-diagram-examples'],
};
