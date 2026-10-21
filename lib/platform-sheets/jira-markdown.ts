import type { Section } from '@/components/CheatSheet';

export const JIRA_NOTATION = 'https://jira.atlassian.com/secure/WikiRendererHelpAction.jspa?section=all';
export const CONF_WIKI = 'https://support.atlassian.com/confluence-cloud/docs/insert-confluence-wiki-markup/';

// Content of /jira-markdown, shared by the page and /llms-full.txt.
export const SECTIONS: Section[] = [
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
