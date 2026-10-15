import Link from 'next/link';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import CheatSheet, { SectionNav, type Section } from '@/components/CheatSheet';
import UpdatedLine from '@/components/UpdatedLine';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-10-15';
const JIRA_NOTATION = 'https://jira.atlassian.com/secure/WikiRendererHelpAction.jspa?section=all';
const JIRA_CLOUD_MD = 'https://support.atlassian.com/jira-software-cloud/docs/markdown-and-keyboard-shortcuts/';
const CONF_WIKI = 'https://support.atlassian.com/confluence-cloud/docs/insert-confluence-wiki-markup/';
const JIRA_REST = 'https://developer.atlassian.com/cloud/jira/platform/rest/api-group-overview';

export const metadata = pageMetadata({
  title: 'Jira Wiki Markup vs Markdown Cheat Sheet',
  description:
    'Markdown to Jira wiki markup: h1., *bold*, {code}, {noformat}, ||tables||, {quote}, {panel}, [text|url], lists, plus Jira Cloud shortcuts and Confluence.',
  path: '/jira-markdown',
  type: 'article',
  kicker: 'Reference',
});

const FAQ: Array<{ q: string; a: string; href?: { path: string; label: string } }> = [
  {
    q: 'Does Jira use markdown?',
    a: 'Partly. Jira\'s native rich-text notation is wiki markup (h1., *bold*, {code}), which is what the REST API v2, Jira Data Center and the legacy text editor speak. The Jira Cloud editor additionally recognises a set of markdown shortcuts as you type (**bold**, # heading, ``` code) and converts them into rich text — but, in Atlassian\'s words, "you can copy raw markdown into the Atlassian editor but you can\'t convert content from it into raw markdown."',
  },
  {
    q: 'How do I make text bold in Jira?',
    a: 'In wiki markup wrap the text in single asterisks: *bold*. In the Jira Cloud editor type **bold** or _bold_ with double markers, or press Cmd/Ctrl+B. Note the inversion: single asterisks are bold in wiki markup but italic in markdown.',
  },
  {
    q: 'How do I add a code block in Jira?',
    a: 'Wiki markup: {code:java} … {code} with the language after the colon (default language is Java), or {noformat} … {noformat} for text with no highlighting at all. Jira Cloud editor: type ``` at the start of a line, or use the / quick insert menu, to add a code block and pick the language from its dropdown.',
  },
  {
    q: 'How do I make a table in Jira?',
    a: 'Wiki markup uses double pipes for header cells and single pipes for body cells: ||Name||Status|| on the first line, then |Login|Done| per row. There is no separator row of dashes as in markdown. In the Jira Cloud editor, markdown pipe tables are not a typing shortcut — use the / quick insert menu or paste from a spreadsheet.',
    href: { path: '/markdown-table-generator', label: 'Markdown table generator' },
  },
  {
    q: 'What is the difference between Jira and Confluence wiki markup?',
    a: 'The core notation is shared (Atlassian\'s Confluence wiki markup page lists the same h1., *bold*, _italic_, {{monospace}}, bq., ||table|| and {color} syntax). Differences: Confluence Cloud only accepts wiki markup through Insert > Markup in the legacy editor ("the new editor doesn\'t support markup"), while Jira still stores wiki markup in REST v2 fields and renders it in Data Center; Confluence adds page-link syntax like [Page title] and [alias|Page#anchor], and each product ships its own macro set.',
  },
  {
    q: 'Which Jira REST API version uses wiki markup?',
    a: 'Version 2 of the Jira Cloud platform REST API accepts wiki markup strings in description and comment fields. Version 3 offers the same operations but represents rich text as Atlassian Document Format (ADF), a JSON document tree, in comment bodies, descriptions and text custom fields. If you are sending a plain string with *bold* and {code}, use v2.',
  },
  {
    q: 'How do I convert markdown to Jira wiki markup?',
    a: 'Paste the markdown into the markdown-to-Jira converter on this site, or do it by hand with the translation table above: swap ** for *, * for _, ``` for {code}, # for h1., | tables for ||header|| rows, [text](url) for [text|url] and > quotes for {quote}. Pandoc also has a "jira" output format: pandoc -t jira file.md.',
    href: { path: '/markdown-to-jira', label: 'Markdown to Jira converter' },
  },
];

const TRANSLATION: Array<{ element: string; md: string; jira: string; note?: string }> = [
  { element: 'Heading 1–6', md: '# Title … ###### Title', jira: 'h1. Title … h6. Title', note: 'Letter h, level, period, space.' },
  { element: 'Bold', md: '**bold**', jira: '*bold*', note: 'Single asterisk — the markdown italic marker.' },
  { element: 'Italic', md: '*italic* or _italic_', jira: '_italic_', note: 'Underscore only.' },
  { element: 'Strikethrough', md: '~~deleted~~', jira: '-deleted-', note: 'Hyphens; keep them touching the text.' },
  { element: 'Underline / inserted', md: '<u>text</u>', jira: '+inserted+' },
  { element: 'Superscript', md: '<sup>2</sup>', jira: '^superscript^' },
  { element: 'Subscript', md: '<sub>2</sub>', jira: '~subscript~', note: 'Single tilde is subscript, not strike.' },
  { element: 'Inline code / monospace', md: '`code`', jira: '{{code}}', note: 'Double curly braces.' },
  { element: 'Code block', md: '```java\\ncode\\n```', jira: '{code:java}\\ncode\\n{code}', note: 'Default language is Java; add title=Foo.java|borderStyle=solid for a titled panel.' },
  { element: 'Preformatted, no markup', md: '```\\ntext\\n```', jira: '{noformat}\\ntext\\n{noformat}', note: 'No highlighting; wiki markup inside is not parsed.' },
  { element: 'Blockquote (one paragraph)', md: '> quote', jira: 'bq. quote' },
  { element: 'Blockquote (multi-paragraph)', md: '> para 1\\n>\\n> para 2', jira: '{quote}\\npara 1\\n\\npara 2\\n{quote}' },
  { element: 'Callout / panel', md: '> [!NOTE]\\n> text', jira: '{panel:title=Note}\\ntext\\n{panel}', note: 'Also borderStyle, borderColor, bgColor, titleBGColor parameters.' },
  { element: 'Link', md: '[text](https://example.com)', jira: '[text|https://example.com]', note: 'Pipe, not parentheses; [https://example.com] with no alias also works.' },
  { element: 'Anchor', md: '[Jump](#section)', jira: '{anchor:section} … [#section]' },
  { element: 'User mention', md: '@username', jira: '[~username]' },
  { element: 'Image', md: '![alt](image.png)', jira: '!image.png!', note: 'Exclamation marks; attachments by filename.' },
  { element: 'Bulleted list', md: '- item\\n  - nested', jira: '* item\\n** nested', note: 'Depth by repeating *, no indentation.' },
  { element: 'Numbered list', md: '1. item\\n   1. nested', jira: '# item\\n## nested', note: '# is a list, not a heading, in wiki markup.' },
  { element: 'Mixed nesting', md: '1. item\\n   - sub', jira: '# item\\n#* sub' },
  { element: 'Table header row', md: '| A | B |\\n|---|---|', jira: '||A||B||', note: 'No separator row.' },
  { element: 'Table body row', md: '| a | b |', jira: '|a|b|' },
  { element: 'Horizontal rule', md: '---', jira: '----', note: 'Four hyphens.' },
  { element: 'Line break', md: 'two trailing spaces or \\\\', jira: '\\\\\\\\', note: 'Two backslashes.' },
  { element: 'Colored text', md: '(no syntax)', jira: '{color:red}text{color}', note: 'Named HTML colors or #hex.' },
  { element: 'Escape a character', md: '\\\\*', jira: '\\\\*', note: 'Backslash before the special character.' },
];

const CLOUD_SHORTCUTS: Array<{ result: string; typed: string; keys: string }> = [
  { result: 'Bold', typed: '**text** or __text__', keys: 'Cmd/Ctrl+B' },
  { result: 'Italic', typed: '*text* or _text_', keys: 'Cmd/Ctrl+I' },
  { result: 'Underline', typed: '—', keys: 'Cmd/Ctrl+U' },
  { result: 'Strikethrough', typed: '~~text~~', keys: 'Cmd/Ctrl+Shift+S' },
  { result: 'Inline code', typed: '`text`', keys: 'Cmd/Ctrl+Shift+M' },
  { result: 'Code block', typed: '``` then space', keys: '/ quick insert' },
  { result: 'Heading 1–6', typed: '# to ###### then space', keys: '—' },
  { result: 'Bulleted list', typed: '* or - then space', keys: 'Cmd/Ctrl+Shift+8' },
  { result: 'Numbered list', typed: '1. or 2) then space', keys: 'Cmd/Ctrl+Shift+7' },
  { result: 'Action item (checkbox)', typed: '[] then space', keys: '—' },
  { result: 'Block quote', typed: '> then space', keys: 'Cmd/Ctrl+Shift+9' },
  { result: 'Divider', typed: '--- or ***', keys: 'Cmd/Ctrl+Shift+-' },
  { result: 'Link', typed: '[text](url)', keys: 'Cmd/Ctrl+Shift+K' },
  { result: 'Image from URL', typed: '![alt](url)', keys: '/ quick insert' },
  { result: 'Emoji', typed: ':smile:', keys: ':' },
  { result: 'Table', typed: '— (no markdown shortcut)', keys: '/ quick insert' },
  { result: 'Panel (info/note/warning)', typed: '—', keys: '/ quick insert' },
  { result: 'Clear formatting', typed: '—', keys: 'Cmd/Ctrl+\\' },
];

const SECTIONS: Section[] = [
  {
    id: 'text',
    title: 'Jira wiki markup: text effects',
    intro: 'Wiki markup is what Jira Data Center, the Jira Cloud REST API v2 and text-mode fields understand. The right column shows the markdown equivalent rendered, so you can see the intended result.',
    snippets: [
      {
        label: 'Headings',
        syntax: 'h1. Biggest heading\nh2. Bigger heading\nh3. Big heading\nh4. Normal heading',
        preview: '# Biggest heading\n## Bigger heading\n### Big heading\n#### Normal heading',
        note: 'The space after the period is required; "h1.Title" stays plain text.',
      },
      {
        label: 'Bold, italic, strike, inserted',
        syntax: '*bold* _italic_ -strikethrough- +inserted+',
        preview: '**bold** *italic* ~~strikethrough~~ <u>inserted</u>',
        note: 'Single asterisk is bold here; the hyphen strike needs no space between hyphen and text, so "a - b" is safe.',
      },
      {
        label: 'Superscript, subscript, monospace',
        syntax: 'E = mc^2^, H~2~O, run {{npm install}}',
        preview: 'E = mc<sup>2</sup>, H<sub>2</sub>O, run `npm install`',
        note: 'Single tilde is subscript in Jira, not strikethrough as in some chat apps.',
      },
      {
        label: 'Color',
        syntax: '{color:red}look ma, red text!{color} and {color:#336699}hex works too{color}',
        render: false,
        note: 'Any of the sixteen standard HTML color names or a hex code; markdown has no equivalent.',
      },
    ],
  },
  {
    id: 'blocks',
    title: 'Code, quotes, panels',
    snippets: [
      {
        label: 'Code block with language',
        syntax: '{code:python}\ndef greet(name):\n    return f"Hello, {name}"\n{code}',
        preview: '```python\ndef greet(name):\n    return f"Hello, {name}"\n```',
        note: 'Without a language the block is highlighted as Java; {code:title=app.py|borderStyle=solid} adds a titled frame.',
      },
      {
        label: 'No-format block',
        syntax: '{noformat}\nThis is text \\#&@!@(*!&*@()#*@\\ *not bold* {macros} _wont_work_here_\n{noformat}',
        preview: '```\nThis is text \\#&@!@(*!&*@()#*@\\ *not bold* {macros} _wont_work_here_\n```',
        note: 'Use it for log output, JSON and anything containing * _ { } that must stay literal.',
      },
      {
        label: 'Single-paragraph quote',
        syntax: 'bq. Some block quoted text',
        preview: '> Some block quoted text',
        note: 'bq. quotes only until the next blank line.',
      },
      {
        label: 'Multi-paragraph quote',
        syntax: '{quote}\nThis is text from another source.\n\nSecond paragraph of the quote.\n{quote}',
        preview: '> This is text from another source.\n>\n> Second paragraph of the quote.',
      },
      {
        label: 'Panel',
        syntax: '{panel:title=My Title|borderStyle=dashed|borderColor=#ccc|titleBGColor=#F7D6C1|bgColor=#FFFFCE}\na block of text surrounded with a *panel*\nyet _another_ line\n{panel}',
        render: false,
        note: 'The closest wiki-markup equivalent to a GitHub alert; every parameter is optional.',
      },
    ],
  },
  {
    id: 'links-lists-tables',
    title: 'Links, lists, tables',
    snippets: [
      {
        label: 'Links',
        syntax: '[Atlassian|http://atlassian.com]\n[http://jira.atlassian.com]\n[mailto:support@example.com]\n[#anchor] [^attachment.pdf] [~username]',
        render: false,
        note: 'Alias first, then a pipe, then the URL — the reverse order of markdown\'s [text](url).',
      },
      {
        label: 'Lists',
        syntax: '* some\n* bullet\n** indented\n** bullets\n* points\n\n# a\n# numbered\n#* with\n#* nested\n#* bullet\n# list',
        preview: '- some\n- bullet\n  - indented\n  - bullets\n- points\n\n1. a\n2. numbered\n   - with\n   - nested\n   - bullet\n3. list',
        note: 'Nesting depth is the number of repeated markers (**, ##, #*), and markers must start in the first column.',
      },
      {
        label: 'Table',
        syntax: '||heading 1||heading 2||heading 3||\n|cell A1|cell A2|cell A3|\n|cell B1|cell B2|cell B3|',
        preview: '| heading 1 | heading 2 | heading 3 |\n|---|---|---|\n| cell A1 | cell A2 | cell A3 |\n| cell B1 | cell B2 | cell B3 |',
        note: 'Double pipes mark header cells (any row, not just the first); there is no |---| separator line.',
      },
      {
        label: 'Rules, breaks, images',
        syntax: 'Line one\\\\Line two after a forced break\n----\n!screenshot.png!',
        render: false,
        note: 'Two backslashes force a line break, four hyphens draw a rule, and !filename! embeds an attachment.',
      },
    ],
    more: [
      { href: JIRA_NOTATION, label: 'Jira text formatting notation help (official)' },
      { href: CONF_WIKI, label: 'Confluence wiki markup syntax (official)' },
    ],
  },
];

export default function JiraMarkdownPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'Jira wiki markup vs Markdown cheat sheet',
        description: metadata.description,
        dateModified: UPDATED,
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: 'https://docs-md.com/jira-markdown',
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
  const code = 'whitespace-pre rounded bg-gray-100 px-1.5 py-0.5';
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-10 max-w-3xl">
        <div className="flex items-start gap-4">
          <ToolIconTile slug="jira-markdown" size="lg" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
              Jira wiki markup vs Markdown cheat sheet
            </h1>
            <UpdatedLine date={UPDATED} />
          </div>
        </div>
        <p className="mt-4 text-base text-gray-600">
          Jira&apos;s native notation is <strong>wiki markup</strong>, not markdown:{' '}
          <code className="rounded bg-gray-100 px-1 text-sm">h1.</code> for headings,{' '}
          <code className="rounded bg-gray-100 px-1 text-sm">*bold*</code> with a single asterisk,{' '}
          <code className="rounded bg-gray-100 px-1 text-sm">{'{code:java}'}</code> for code,{' '}
          <code className="rounded bg-gray-100 px-1 text-sm">||header||</code> for tables and{' '}
          <code className="rounded bg-gray-100 px-1 text-sm">[text|url]</code> for links. The Jira Cloud
          editor also accepts markdown <em>typing shortcuts</em> and converts them to rich text, and REST API v2
          still takes wiki markup strings. The translation table below maps every common markdown element to its
          Jira form; paste a whole document into the{' '}
          <Link href="/markdown-to-jira" className="text-indigo-700 underline">markdown to Jira converter</Link>{' '}
          to do it in one go.
        </p>
        <SectionNav sections={SECTIONS} />
      </div>

      <section className="mb-12 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Markdown to Jira wiki markup translation table</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="py-2 pr-4 font-semibold text-gray-950">Element</th>
                <th className="py-2 pr-4 font-semibold text-gray-950">Markdown</th>
                <th className="py-2 pr-4 font-semibold text-gray-950">Jira wiki markup</th>
                <th className="py-2 font-semibold text-gray-950">Notes</th>
              </tr>
            </thead>
            <tbody>
              {TRANSLATION.map((r) => (
                <tr key={r.element} className="border-b border-gray-100 align-top">
                  <td className="py-2.5 pr-4 font-medium text-gray-900">{r.element}</td>
                  <td className="py-2.5 pr-4"><code className={code}>{r.md.replace(/\\n/g, '\n')}</code></td>
                  <td className="py-2.5 pr-4"><code className={code}>{r.jira.replace(/\\n/g, '\n')}</code></td>
                  <td className="py-2.5 text-gray-600">{r.note ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CheatSheet sections={SECTIONS} />

      <section id="cloud-editor" className="mt-12 scroll-mt-8 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Jira Cloud editor: markdown shortcuts and keys</h2>
        <p className="max-w-3xl text-base text-gray-600">
          The Jira Cloud (Atlassian) editor converts these as you type, per Atlassian&apos;s{' '}
          <a href={JIRA_CLOUD_MD} className="text-indigo-700 underline" rel="noopener">markdown and keyboard shortcuts</a>{' '}
          page. Conversion is one-way: the editor stores rich text (ADF), not markdown or wiki markup.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="py-2 pr-4 font-semibold text-gray-950">Result</th>
                <th className="py-2 pr-4 font-semibold text-gray-950">Type (markdown shortcut)</th>
                <th className="py-2 font-semibold text-gray-950">Key or slash command</th>
              </tr>
            </thead>
            <tbody>
              {CLOUD_SHORTCUTS.map((r) => (
                <tr key={r.result} className="border-b border-gray-100 align-top">
                  <td className="py-2.5 pr-4 font-medium text-gray-900">{r.result}</td>
                  <td className="py-2.5 pr-4"><code className={code}>{r.typed}</code></td>
                  <td className="py-2.5 text-gray-600"><code className={code}>{r.keys}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">Where does each syntax apply?</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-300 text-left">
                  <th className="py-2 pr-4 font-semibold text-gray-950">Surface</th>
                  <th className="py-2 pr-4 font-semibold text-gray-950">Accepts</th>
                  <th className="py-2 font-semibold text-gray-950">Stores</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Jira Cloud editor (issues, comments)', 'Markdown typing shortcuts, toolbar, / commands', 'ADF rich text'],
                  ['Jira Cloud REST API v2', 'Wiki markup strings', 'Wiki markup'],
                  ['Jira Cloud REST API v3', 'ADF JSON', 'ADF'],
                  ['Jira Data Center / Server', 'Wiki markup (text mode) or visual editor', 'Wiki markup'],
                  ['Confluence Cloud legacy editor', 'Insert > Markup: wiki markup or markdown', 'Confluence storage format'],
                  ['Confluence Cloud new editor', 'Markdown typing shortcuts only ("doesn’t support markup")', 'ADF'],
                ].map(([a, b, c]) => (
                  <tr key={a} className="border-b border-gray-100 align-top">
                    <td className="py-2 pr-4 font-medium text-gray-900">{a}</td>
                    <td className="py-2 pr-4 text-gray-600">{b}</td>
                    <td className="py-2 text-gray-600">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600">
            Source: Atlassian&apos;s{' '}
            <a href={JIRA_REST} className="text-indigo-700 underline" rel="noopener">REST API overview</a> (v2 vs v3) and{' '}
            <a href={CONF_WIKI} className="text-indigo-700 underline" rel="noopener">Confluence wiki markup</a> page.
          </p>
        </section>

        {FAQ.map((f) => (
          <section key={f.q} className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-950">{f.q}</h2>
            <p>{f.a}</p>
            {f.href ? (
              <p>
                <Link href={f.href.path} className="text-indigo-700 underline">
                  {f.href.label} →
                </Link>
              </p>
            ) : null}
          </section>
        ))}

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">Related</h2>
          <p className="text-sm text-gray-600">
            <Link href="/markdown-to-jira" className="text-indigo-700 underline">Markdown to Jira converter</Link>{' · '}
            <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">Markdown cheat sheet</Link>{' · '}
            <Link href="/markdown-table-generator" className="text-indigo-700 underline">Table generator</Link>{' · '}
            <Link href="/pandoc-markdown" className="text-indigo-700 underline">Pandoc markdown (has a jira writer)</Link>{' · '}
            <Link href="/guides/markdown-code-block" className="text-indigo-700 underline">Code block guide</Link>{' · '}
                        <Link href="/guides/markdown-quote" className="text-indigo-700 underline">Blockquote guide</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
