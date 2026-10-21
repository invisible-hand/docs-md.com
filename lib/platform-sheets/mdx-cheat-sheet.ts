import type { Section } from '@/components/CheatSheet';

export const MDX_USING = 'https://mdxjs.com/docs/using-mdx/';
export const MDX_WHAT = 'https://mdxjs.com/docs/what-is-mdx/';

// Content of /mdx-cheat-sheet, shared by the page and /llms-full.txt.
export const SECTIONS: Section[] = [
  {
    id: 'jsx',
    title: 'JSX in markdown',
    intro: 'Any JSX tag can sit between markdown blocks or inside a paragraph. The preview column shows plain markdown equivalents, since the site renderer does not execute components.',
    snippets: [
      {
        label: 'A component in prose',
        syntax: 'import {Chart} from \'./chart.js\'\n\n# Quarterly numbers\n\nRevenue grew **12%**.\n\n<Chart data={[10, 12, 15]} />\n\nSee the <Tooltip tip="year over year">YoY</Tooltip> note.',
        render: false,
        note: 'Block JSX goes on its own line between blank lines; inline JSX stays inside the sentence.',
      },
      {
        label: 'Markdown inside JSX: same line vs own lines',
        syntax: '<div>*this is emphasis*</div>\n\n<div># this is not a heading</div>\n\n<div>\n  # this IS a heading\n</div>',
        render: false,
        note: 'Inline markdown works when text and tags share a line; block syntax (headings, lists) only works on its own lines inside the tag.',
      },
      {
        label: 'Self-closing and well-formed tags',
        syntax: '<img src="/pic.png" alt="A picture" />\n<br />\n<Box>\n  Content\n</Box>',
        render: false,
        note: 'Unlike HTML in markdown, every tag must close; <img> without the slash is a syntax error.',
      },
      {
        label: 'Attribute names follow the framework',
        syntax: '<section className="note" style={{color: \'tomato\'}} aria-label="Note">\n  Text\n</section>',
        render: false,
        note: 'React wants className and a style object; copying class="…" style="…" from HTML fails.',
      },
    ],
  },
  {
    id: 'esm',
    title: 'Imports and exports',
    snippets: [
      {
        label: 'Import components and data',
        syntax: 'import {Chart} from \'./chart.js\'\nimport data from \'./data.json\'\nimport {External} from \'./some/place.js\'',
        render: false,
        note: 'import/export must start at column 0 and may contain blank lines; they are hoisted out of the content.',
      },
      {
        label: 'Export values other files can import',
        syntax: 'export const meta = {title: \'Release notes\', date: \'2026-10-15\'}\n\nexport function Note({children}) {\n  return <aside className="note">{children}</aside>\n}\n\n<Note>Locally defined components work too.</Note>',
        render: false,
        note: 'Named exports are available to whoever imports the .mdx file; the content itself is the default export.',
      },
      {
        label: 'Layout via default export',
        syntax: 'export default function Layout({children}) {\n  return <main className="prose">{children}</main>\n}\n\n# This heading renders inside <main>',
        render: false,
        note: 'A local default export wraps all content and overrides a components.wrapper passed from outside.',
      },
    ],
  },
  {
    id: 'expressions',
    title: 'Expressions in braces',
    snippets: [
      {
        label: 'Inline and block expressions',
        syntax: 'Two π is {Math.PI * 2}.\n\n{(function () {\n  const items = [\'a\', \'b\']\n  return <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>\n})()}',
        render: false,
        note: 'Braces hold any JavaScript expression; multi-statement logic goes in an IIFE.',
      },
      {
        label: 'Props passed to the MDX component',
        syntax: '# Hello {props.name.toUpperCase()}\n\nThe current year is {props.year}',
        render: false,
        note: 'Rendered as <Content name="Mars" year={2026} />; the document reads them as props.',
      },
      {
        label: 'Comments and escapes',
        syntax: '{/* A comment, invisible in output */}\n\nTemplates use \\{braces\\} and 1 \\< 2, or {\'{\'}braces{\'}\'} and 1 {\'<\'} 2.',
        render: false,
        note: 'HTML comments are not allowed; \\< and \\{ (or string expressions) are the only ways to print those characters outside code.',
      },
    ],
  },
  {
    id: 'components',
    title: 'Components as headings and layouts',
    snippets: [
      {
        label: 'Replace markdown elements from outside',
        syntax: 'import Content from \'./post.mdx\'\n\n<Content\n  components={{\n    h1: (props) => <h1 className="title" {...props} />,\n    a: Link,\n    code: Code,\n    wrapper: ({children}) => <article>{children}</article>,\n  }}\n/>',
        render: false,
        note: 'Keys named after HTML tags (h1, a, pre, code, img) swap the element markdown generates; wrapper wraps everything.',
      },
      {
        label: 'Map h1 to h2 in one line',
        syntax: '<Content components={{h1: \'h2\'}} />',
        render: false,
        note: 'A string value works too — useful when the page template already renders the H1.',
      },
      {
        label: 'Provider for nested MDX (React)',
        syntax: 'import {MDXProvider} from \'@mdx-js/react\'\n\n<MDXProvider components={{h1: Title}}>\n  <Content />\n</MDXProvider>',
        render: false,
        note: 'Only needed when MDX files import other MDX files; otherwise pass components directly (Next.js uses mdx-components.tsx instead).',
      },
    ],
    more: [
      { href: MDX_USING, label: 'mdxjs.com: using MDX (official)' },
      { href: MDX_WHAT, label: 'mdxjs.com: what is MDX (official)' },
    ],
  },
  {
    id: 'gotchas',
    title: 'Gotchas',
    snippets: [
      {
        label: 'No indented code blocks',
        syntax: '    console.log(1) // this is a paragraph in MDX!\n\n```js\nconsole.log(1) // this is a code block\n```',
        render: false,
        note: 'Four-space indentation is ignored so JSX can be indented; always use fences.',
      },
      {
        label: 'No autolinks',
        syntax: 'https://mdxjs.com is plain text.\n\n[mdxjs.com](https://mdxjs.com) is a link.',
        render: false,
        note: 'Bare URLs and <https://…> are not links in MDX; <https://…> is even a JSX parse error.',
      },
      {
        label: 'Tags cannot span blocks',
        syntax: '<a href="/x">\n\n# Heading inside a link\n\n</a>',
        render: false,
        note: 'An opening tag in one paragraph and its closing tag in another raise a misnesting error; keep the whole element in one block.',
      },
      {
        label: 'GFM needs a plugin',
        syntax: 'import remarkGfm from \'remark-gfm\'\n// compile(source, {remarkPlugins: [remarkGfm]})\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n~~strike~~  - [x] task',
        render: false,
        note: 'Without remark-gfm the table is a paragraph of pipes and the tildes are literal.',
      },
    ],
  },
];
