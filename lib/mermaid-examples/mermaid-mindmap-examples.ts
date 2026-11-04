import type { MermaidExamplesPage } from './types';

export const PAGE: MermaidExamplesPage = {
  slug: 'mermaid-mindmap-examples',
  title: 'Mermaid Mindmap Examples — Copyable Code',
  description:
    'Mermaid mindmap syntax with copyable examples rendered live: indentation, node shapes, markdown strings, icons, and turning a Markdown list into a mindmap.',
  h1: 'Mermaid mindmap examples',
  label: 'Mindmap',
  updated: '2026-11-03',
  answer:
    'A Mermaid mindmap starts with the `mindmap` keyword, then one node per line, with indentation setting the hierarchy. The first node is the root; a line indented further than the one above becomes its child, and brackets around a node’s text set its shape. Every example below is rendered live from its code.',
  examples: [
    {
      id: 'basic',
      title: 'Basic mindmap',
      intro:
        'Indentation is the whole syntax. The first line after `mindmap` is the root, each line indented further than the line above becomes its child, and lines at the same indentation are siblings.',
      code: `mindmap
  Product launch
    Marketing
      Blog post
      Newsletter
      Launch video
    Engineering
      Feature flags
      Load testing
    Support
      Help articles
      Saved replies`,
    },
    {
      id: 'indentation',
      title: 'How uneven indentation is read',
      intro:
        'Only relative indentation matters. Mermaid attaches each line to the nearest line above it with less indentation, so Hotel below still lands under Book next to Flights, and Pack becomes a second branch of the root even though it is indented less than Book.',
      code: `mindmap
  Trip to Lisbon
      Book
          Flights
        Hotel
    Pack
      Passport
      Adapter`,
    },
    {
      id: 'shapes',
      title: 'Node shapes',
      intro:
        'Put an ID in front of the text and wrap the text in delimiters, as in flowcharts: square brackets for a square, parentheses for a rounded square, double parentheses for a circle, `))` and `((` for a bang, `)` and `(` for a cloud and `{{ }}` for a hexagon. Text with no delimiters gets the default shape.',
      code: `mindmap
  root((Shapes))
    sq[Square]
    rd(Rounded square)
    ci((Circle))
    bg))Bang((
    cl)Cloud(
    hx{{Hexagon}}
    Default shape`,
    },
    {
      id: 'markdown-strings',
      title: 'Bold, italics and wrapping with markdown strings',
      intro:
        'Wrap a label in a double quote and a backtick at each end to make it a markdown string. Double asterisks make text bold, single asterisks make it italic, long text wraps inside the node on its own, and a plain line break in the label starts a new line.',
      code: `mindmap
  root["\`**Q3 planning**
three themes\`"]
    grow["\`*Grow* activation\`"]
    churn["\`Cut **churn** in the first month by fixing the three biggest onboarding drop-offs\`"]
    plain[Ship the mobile app]`,
    },
    {
      id: 'study-map',
      title: 'Study map with line breaks',
      intro:
        'A circle root with plain children makes a quick study map. In a regular label, `<br/>` forces a line break, as in the example in Mermaid’s own documentation.',
      code: `mindmap
  root((Learning Rust))
    Basics
      Variables and mutability
      Ownership<br/>and borrowing
      Pattern matching
    Tooling
      cargo
      rustfmt
      clippy
    Projects
      Command-line tool
      Web server`,
    },
    {
      id: 'retrospective',
      title: 'Retrospective with shapes that carry meaning',
      intro:
        'Shapes can mean something: a hexagon for the topic, rounded squares for the two lists, a square for actions and a cloud for open questions. Text that contains brackets of its own goes in quotes inside the delimiters.',
      code: `mindmap
  retro{{Sprint 22 retro}}
    good(Went well)
      Fewer flaky tests
      Faster reviews
    bad(Did not go well)
      Late design changes
      On-call noise
    actions[Actions]
      Freeze designs by day 3
      a1["Tune alert thresholds (pager)"]
    open)Open questions(
      Move standup later?`,
    },
    {
      id: 'markdown-outline',
      title: 'A Markdown outline turned into a mindmap',
      intro:
        'A nested bullet list is already a mindmap in text form. This map came from the outline shown in the section below: the `mindmap` keyword went on top, the single top-level bullet became the root, every `- ` marker was deleted and the indentation was kept as it was. Only the last line needed quoting, because its text has parentheses.',
      code: `mindmap
  root((Website redesign))
    Research
      User interviews
      Analytics review
    Design
      Wireframes
      Visual design
    Build
      Front end
      CMS
      b1["Launch checklist (draft)"]`,
    },
  ],
  sections: [
    {
      h2: 'How does indentation work in a Mermaid mindmap?',
      paragraphs: [
        'A mindmap is a text outline. The first node after `mindmap` is the root and there can be only one: a second line at the root’s indentation makes Mermaid stop with the error “There can be only one root”. Every other line becomes a child of the nearest line above it that is indented less. The amount of indentation does not matter, only how it compares with the lines above, which is why the uneven example still produces a tidy map.',
        'Because a parent is found by looking upwards, the order of lines matters as much as their indentation. To move a whole branch, move its lines together. To keep large maps readable in source, indent by a fixed step, such as two or four spaces per level, even though Mermaid would accept anything that is consistently deeper.',
      ],
    },
    {
      h2: 'Turn a Markdown outline into a mindmap',
      paragraphs: [
        'Start from the list as it is written in the file. Put `mindmap` on the first line. Turn the one top-level bullet into the root, optionally in a shape such as `root((Website redesign))`; if the list has several top-level bullets, add a root above them, such as the document title, and indent every bullet one step. Then delete the bullet marker, `- `, `* ` or `1. `, from every line and keep the indentation exactly as it was. Mermaid reads a line indented further than the one above as its child, which is the same rule a Markdown list follows, so the hierarchy carries over without any edits. The example above was made this way from the outline in the table.',
        'Two kinds of line need a hand. Text that contains parentheses or brackets, such as “Launch checklist (draft)”, has to go in quotes inside a shape with an ID in front, `b1["Launch checklist (draft)"]`, or Mermaid reads the parentheses as a shape. Inline Markdown such as bold or a link has no meaning in a plain node: strip it, or wrap the label as a markdown string, a double quote and a backtick at each end, where `**bold**` and `*italic*` do work. Icons, `::icon(fa fa-book)` on the line after a node, and classes, `:::name`, can be added afterwards; both only show where the renderer supplies the icon font or the CSS, so a converted map is usually left without them.',
        'Both versions can live in the same Markdown file: the list stays readable text and the fenced `mermaid` block renders as the map on GitHub, GitLab, Obsidian and Docs MD. When the list changes, repeat the same steps; there is nothing else to keep in sync.',
      ],
      table: {
        head: ['Markdown outline', 'Mindmap source', 'What changed'],
        rows: [
          ['—', '`mindmap`', 'The diagram keyword goes on the first line'],
          ['`- Website redesign`', '`root((Website redesign))`', 'The single top-level bullet becomes the root; the double parentheses make it a circle and are optional'],
          ['`  - Research`', '`Research`, indented one level under the root', 'Bullet marker removed, indentation kept'],
          ['`    - User interviews`', '`User interviews`, indented one level under Research', 'Same rule, one level deeper'],
          ['`  - Build`', '`Build`, back at the first level', 'Less indentation closes the branch, exactly as in the list'],
          ['`    - Launch checklist (draft)`', '`b1["Launch checklist (draft)"]`', 'Parentheses in the text need an ID and quotes inside a shape'],
        ],
      },
    },
    {
      h2: 'Which node shapes can a Mermaid mindmap use?',
      paragraphs: [
        'Mermaid’s documentation lists six shapes plus the default. The syntax follows flowcharts: an ID, then the text inside the shape’s delimiters. The ID is not shown; it only has to be there so Mermaid can tell the shape apart from the text.',
      ],
      table: {
        head: ['Shape', 'Syntax', 'Example'],
        rows: [
          ['Square', 'Square brackets', '`id[Square]`'],
          ['Rounded square', 'Parentheses', '`id(Rounded)`'],
          ['Circle', 'Double parentheses', '`id((Circle))`'],
          ['Bang', 'Two closing, then two opening parentheses', '`id))Bang((`'],
          ['Cloud', 'One closing, then one opening parenthesis', '`id)Cloud(`'],
          ['Hexagon', 'Double braces', '`id{{Hexagon}}`'],
          ['Default', 'No delimiters', '`Plain text`'],
        ],
      },
    },
    {
      h2: 'How do icons and classes work in a mindmap?',
      paragraphs: [
        'An icon goes on the line after its node as `::icon(fa fa-book)`, with the icon font’s class names inside the parentheses; Mermaid’s documentation shows Font Awesome 5 and Material Design icons. The icon only appears if the site that renders the diagram has loaded that icon font, which the diagram author cannot do from inside the diagram. Mermaid marks the icon syntax as experimental and says it may change, which is the reason the mindmap diagram as a whole is still labelled experimental.',
        'A class works the same way: `:::urgent large` on the line after a node attaches the CSS classes `urgent` and `large` to it. The CSS for those classes has to be supplied by the site, so on most platforms a class changes nothing. The examples on this page leave both out for that reason: they would render, but without visible icons or styles.',
      ],
    },
    {
      h2: 'Why is my Mermaid mindmap not rendering as expected?',
      paragraphs: [
        'The most common surprise is brackets in plain text. A line such as `Fix login (urgent)` is read as a node with the ID “Fix login” and the rounded-square text “urgent”, so the first words disappear. Quote the text inside a shape instead: `a1["Fix login (urgent)"]`, as in the retrospective example. The second is a second root, described above.',
        'If the diagram does not render at all, check the renderer’s version. The mindmap has been part of Mermaid since 9.4.0; older versions needed a separate plugin. For markdown strings, the backtick must sit inside the double quotes at both ends of the label, and the label must be inside a shape such as square brackets. In Markdown files, the whole diagram goes in a fenced block tagged `mermaid`; see [how to use Mermaid in Markdown](/mermaid-in-markdown).',
      ],
    },
  ],
  faq: [
    {
      q: 'Is the Mermaid mindmap still experimental?',
      a: 'Mermaid’s documentation still labels the mindmap experimental, but it also says the syntax is stable except for the icon integration. In practice, the outline syntax, shapes and markdown strings on this page are safe to use; the `::icon()` syntax is the part that may change. The diagram has shipped with Mermaid since version 9.4.0, loaded on demand when a page first draws a mindmap.',
    },
    {
      q: 'Can a Mermaid mindmap have more than one root?',
      a: 'No. A mindmap has exactly one root, the first node after the `mindmap` keyword. If another line starts at the same indentation as the root, Mermaid stops with the error “There can be only one root”. To show two separate topics, make them children of a shared root, or draw two mindmaps one after the other in the same document.',
    },
    {
      q: 'How do you add a line break inside a mindmap node?',
      a: 'In a regular label, write `<br/>` where the line should break, as in “Ownership<br/>and borrowing” in the study map example. In a markdown string, the label wrapped in a double quote and a backtick at each end, press Enter inside the label and the new line carries into the node. Markdown strings also wrap long text automatically, so you rarely need manual breaks there.',
    },
    {
      q: 'Can you convert a Markdown list to a Mermaid mindmap?',
      a: 'Yes, by hand in three steps, because the two formats share one rule: indentation means hierarchy. Put `mindmap` on the first line, make the one top-level bullet the root (or add a root line above several), and delete the `- ` marker from every line while keeping its indentation. Then quote any text with parentheses or brackets inside a shape, such as `a1["Review (legal)"]`, and strip inline Markdown such as bold or links, or keep it in a markdown string. The outline example on this page shows the list and the resulting map side by side.',
    },
    {
      q: 'Does GitHub render Mermaid mindmaps?',
      a: 'GitHub renders fenced `mermaid` blocks in Markdown files, issues, pull requests, discussions and wikis using the Mermaid library, so a mindmap in standard syntax works there. GitHub controls which Mermaid version it runs, and icons need an icon font that GitHub decides whether to load. To see the version, GitHub’s documentation suggests rendering a one-word `info` diagram.',
    },
    {
      q: 'How do you change the colours of a Mermaid mindmap?',
      a: 'By default each top-level branch gets its own colour from the theme and its children share it. Choose another theme in a `config` block at the top of the diagram to change the palette. Per-node colours need classes, which only work where the site supplies the CSS. Mermaid’s current documentation adds a `mindmap` setting, `colorBy: depth`, that colours by level instead, but it needs Mermaid 12.2.0 or later.',
    },
  ],
  sources: [
    { label: 'Mermaid documentation: Mindmap', url: 'https://mermaid.js.org/syntax/mindmap.html' },
    { label: 'GitHub Docs: Creating diagrams', url: 'https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams' },
  ],
  related: ['/mermaid-in-markdown', '/obsidian-markdown', '/markdown-viewer', '/markdown-to-pdf'],
};
