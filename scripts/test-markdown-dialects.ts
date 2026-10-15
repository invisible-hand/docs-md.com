// Run: npx tsx scripts/test-markdown-dialects.ts
import { convertMarkdown, type ConvertOptions, type Dialect } from '../lib/markdown-dialects';

let failed = 0;
let passed = 0;

function eq(name: string, dialect: Dialect, md: string, expected: string, opts: ConvertOptions = {}) {
  const { output } = convertMarkdown(md, dialect, opts);
  if (output === expected) {
    passed++;
  } else {
    failed++;
    console.error(`FAIL ${dialect}: ${name}\n  expected: ${JSON.stringify(expected)}\n  got:      ${JSON.stringify(output)}`);
  }
}

function warns(name: string, dialect: Dialect, md: string, element: string, line: number, opts: ConvertOptions = {}) {
  const { warnings } = convertMarkdown(md, dialect, opts);
  const hit = warnings.find((w) => w.element === element && w.line === line);
  if (hit) passed++;
  else {
    failed++;
    console.error(`FAIL ${dialect}: ${name} — no warning {element:${element}, line:${line}} in ${JSON.stringify(warnings)}`);
  }
}

// ---- Slack ----------------------------------------------------------------
eq('bold/italic/strike/code', 'slack', 'a **b** *c* ~~d~~ `e`', 'a *b* _c_ ~d~ `e`');
eq('link api', 'slack', '[docs](https://example.com/docs)', '<https://example.com/docs|docs>');
eq('bare link', 'slack', '<https://example.com>', '<https://example.com>');
eq('link composer', 'slack', '[docs](https://example.com/docs)', 'docs: https://example.com/docs', { slackTarget: 'composer' });
eq('heading → bold line', 'slack', '# Title\n\ntext', '*Title*\n\ntext');
eq('escape & < > in API text', 'slack', 'a & b < c', 'a &amp; b &lt; c');
eq('no escape in composer', 'slack', 'a & b', 'a & b', { slackTarget: 'composer' });
eq('code block drops lang', 'slack', '```js\nx()\n```', '```\nx()\n```');
eq('bullets', 'slack', '- one\n- two\n  - nested', '• one\n• two\n    ◦ nested');
eq('ordered', 'slack', '1. a\n2. b', '1. a\n2. b');
eq('quote', 'slack', '> hi\n> there', '> hi\n> there');
eq('table → code grid', 'slack', '| a | b |\n|---|---|\n| 1 | 22 |', '```\na  b\n-  --\n1  22\n```');
warns('heading warns', 'slack', 'x\n\n## H', 'heading h2', 3);
warns('table warns', 'slack', '| a |\n|---|\n| 1 |', 'table', 1);
warns('lang warns', 'slack', '```ts\nx\n```', 'code block', 1);

// ---- Discord --------------------------------------------------------------
eq('bold/italic/strike', 'discord', '**b** *i* ~~s~~ `c`', '**b** *i* ~~s~~ `c`');
eq('__x__ is bold in markdown', 'discord', '__u__', '**u**');
eq('headings 1-3 kept', 'discord', '# a\n\n## b\n\n### c', '# a\n\n## b\n\n### c');
eq('h4 → bold', 'discord', '#### d', '**d**');
eq('masked link', 'discord', '[site](https://x.io)', '[site](https://x.io)');
eq('plain link option', 'discord', '[site](https://x.io)', 'site (https://x.io)', { discordLinks: 'plain' });
eq('code block keeps lang', 'discord', '```py\nprint(1)\n```', '```py\nprint(1)\n```');
eq('lists use - and 2-space nesting', 'discord', '* a\n  * b\n* c', '- a\n  - b\n- c');
eq('spoiler passthrough', 'discord', 'the ||secret|| bit', 'the ||secret|| bit');
eq('escapes markdown chars in text', 'discord', 'snake\\_case 2\\*3', 'snake\\_case 2\\*3');
eq('table → code grid', 'discord', '| h |\n|---|\n| v |', '```\nh\n-\nv\n```');
warns('h4 warns', 'discord', '#### d', 'heading h4', 1);
warns('html warns', 'discord', '<b>x</b>', 'HTML', 1);

// ---- Jira -----------------------------------------------------------------
eq('headings', 'jira', '# a\n\n###### f', 'h1. a\n\nh6. f');
eq('inline', 'jira', '**b** *i* ~~s~~ `m`', '*b* _i_ -s- {{m}}');
eq('link', 'jira', '[Atlassian](https://atlassian.com)', '[Atlassian|https://atlassian.com]');
eq('code with lang', 'jira', '```js\nx()\n```', '{code:javascript}\nx()\n{code}');
eq('code without lang → noformat', 'jira', '```\nraw\n```', '{noformat}\nraw\n{noformat}');
eq('unknown lang → {code}', 'jira', '```brainfuck\n+\n```', '{code}\n+\n{code}');
eq('table', 'jira', '| a | b |\n|---|---|\n| 1 | 2 |', '||a||b||\n|1|2|');
eq('quote', 'jira', '> q', '{quote}\nq\n{quote}');
eq('nested mixed lists', 'jira', '- a\n  1. b\n  2. c\n- d', '* a\n*# b\n*# c\n* d');
eq('ordered nested', 'jira', '1. a\n   - b', '# a\n#* b');
eq('rule', 'jira', 'a\n\n---\n\nb', 'a\n\n----\n\nb');
eq('image', 'jira', '![alt](https://h/i.png)', '!https://h/i.png!');
eq('escapes braces', 'jira', 'a {b} [c]', 'a \\{b} \\[c]');
warns('unknown lang warns', 'jira', '```brainfuck\n+\n```', 'code block', 1);

// ---- Plain ----------------------------------------------------------------
eq('strips everything', 'plain', '# T\n\n**b** *i* ~~s~~ `c` [l](https://u)', 'T\n\nb i s c l');
eq('keepLinkUrls', 'plain', '[l](https://u)', 'l (https://u)', { keepLinkUrls: true });
eq('code block kept as text', 'plain', '```js\nx()\n```', 'x()');
eq('lists', 'plain', '- a\n  - b\n1. c', '- a\n  - b\n\n1. c');
eq('table grid', 'plain', '| a | b |\n|---|---|\n| 1 | 2 |', 'a  b\n-  -\n1  2');
eq('rule dropped', 'plain', 'a\n\n---\n\nb', 'a\n\nb');
eq('html stripped', 'plain', 'x<br>y', 'x\ny');
eq('no warnings', 'plain', '# h\n\n| a |\n|---|\n| 1 |', 'h\n\na\n-\n1');

console.log(`${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
