// Unit tests for lib/handoff.ts. Run: npx tsx scripts/test-handoff.ts
import assert from 'node:assert/strict';
import {
  EMPTY_FIELDS,
  SAMPLE_FIELDS,
  SECTION_ORDER,
  buildHandoff,
  cell,
  inline,
  lines,
  linkItem,
  splitReason,
  type HandoffFields,
} from '../lib/handoff';

let passed = 0;
const failures: string[] = [];
function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
  } catch (e) {
    failures.push(`${name}: ${e instanceof Error ? e.message : String(e)}`);
  }
}

const NOW = new Date('2026-10-15T09:30:00Z');
const build = (over: Partial<HandoffFields>, base: HandoffFields = EMPTY_FIELDS) =>
  buildHandoff({ ...base, ...over }, { now: NOW });

// ---- helpers ---------------------------------------------------------------

test('lines strips list markers and blank lines', () => {
  assert.deepEqual(lines('- a\n\n* b\n1. c\n2) d\n  e  \n'), ['a', 'b', 'c', 'd', 'e']);
});

test('cell escapes pipes and flattens newlines', () => {
  assert.equal(cell('a | b\nc'), 'a \\| b c');
  assert.equal(cell('   '), '—');
});

test('inline drops heading markers and collapses whitespace', () => {
  assert.equal(inline('## My\n  project '), 'My project');
});

test('splitReason accepts —, |, -> and colon separators', () => {
  assert.deepEqual(splitReason('Stream — memory stays flat'), ['Stream', 'memory stays flat']);
  assert.deepEqual(splitReason('Use UTC | matches API'), ['Use UTC', 'matches API']);
  assert.deepEqual(splitReason('No BOM -> Sheets'), ['No BOM', 'Sheets']);
  assert.deepEqual(splitReason('Keep pnpm: lockfile exists'), ['Keep pnpm', 'lockfile exists']);
  assert.deepEqual(splitReason('No reason given'), ['No reason given', '']);
});

test('linkItem turns "Label: url" into a markdown link and bare URLs into autolinks', () => {
  assert.equal(linkItem('Ticket: https://example.com/t/1'), '[Ticket](https://example.com/t/1)');
  assert.equal(linkItem('https://example.com'), '<https://example.com>');
  assert.equal(linkItem('no url here'), 'no url here');
});

// ---- builder ---------------------------------------------------------------

test('empty form yields only the title and the footer', () => {
  const out = build({});
  assert.equal(
    out,
    '# HANDOFF: Untitled project\n\n**Written:** 2026-10-15 09:30 UTC\n\n---\n\n_Handoff written 2026-10-15. Update this file before you stop; the next reader starts here._\n',
  );
});

test('empty sections are omitted', () => {
  const out = build({ project: 'X', goal: 'G', timestamps: false });
  assert.equal(out, '# HANDOFF: X\n\n## Goal\n\nG\n');
  for (const h of SECTION_ORDER) if (h !== '## Goal') assert.ok(!out.includes(h), `${h} should be absent`);
});

test('whitespace-only textareas count as empty', () => {
  const out = build({ done: '  \n\n', nextSteps: '\n', keyFiles: [{ path: '  ', note: 'x' }], timestamps: false });
  assert.ok(!out.includes('## Current state'));
  assert.ok(!out.includes('## Next steps'));
  assert.ok(!out.includes('## Key files'));
});

test('sections come out in the documented order', () => {
  const out = buildHandoff(SAMPLE_FIELDS, { now: NOW });
  const positions = SECTION_ORDER.map((h) => out.indexOf(`\n${h}\n`));
  assert.ok(positions.every((p) => p > 0), 'every section present in the sample');
  for (let i = 1; i < positions.length; i++) assert.ok(positions[i] > positions[i - 1], `${SECTION_ORDER[i]} after ${SECTION_ORDER[i - 1]}`);
});

test('timestamps off removes the Written line and footer', () => {
  const out = buildHandoff({ ...SAMPLE_FIELDS, timestamps: false }, { now: NOW });
  assert.ok(!out.includes('**Written:**'));
  assert.ok(!out.includes('_Handoff written'));
  assert.ok(!out.includes('2026-10-15'));
});

test('repo and branch render as inline code on one line', () => {
  const out = build({ repo: 'acme/x', branch: 'main', timestamps: false });
  assert.ok(out.includes('**Repo:** `acme/x` · **Branch:** `main`'));
});

test('next steps are numbered in the order given, even when pasted with other markers', () => {
  const out = build({ nextSteps: '- third first\n7. then this\nlast', timestamps: false });
  assert.ok(out.includes('## Next steps\n\n1. third first\n2. then this\n3. last\n'));
});

test('key files table escapes pipes in notes and wraps the path in code', () => {
  const out = build({ keyFiles: [{ path: 'a/b.ts', note: 'x | y' }], timestamps: false });
  assert.ok(out.includes('| File | What it does |\n| --- | --- |\n| `a/b.ts` | x \\| y |'));
});

test('decisions table splits reason and uses a dash for a missing one', () => {
  const out = build({ decisions: 'Stream — flat memory\nNo BOM', timestamps: false });
  assert.ok(out.includes('| Decision | Why |\n| --- | --- |\n| Stream | flat memory |\n| No BOM | — |'));
});

test('status table lists done, in progress and blocked with their status', () => {
  const out = build({ done: 'A', inProgress: 'B', blocked: 'C', statusTable: true, timestamps: false });
  assert.ok(out.includes('## Status\n\n| Item | Status |\n| --- | --- |\n| A | Done |\n| B | In progress |\n| C | Blocked |'));
  assert.ok(out.indexOf('## Status') < out.indexOf('## Current state'));
});

test('status table is skipped when there is nothing to list', () => {
  const out = build({ statusTable: true, goal: 'g', timestamps: false });
  assert.ok(!out.includes('## Status'));
});

test('current state only includes the non-empty sub-lists', () => {
  const out = build({ done: 'A', blocked: 'C', timestamps: false });
  assert.ok(out.includes('### Done\n\n- A'));
  assert.ok(!out.includes('### In progress'));
  assert.ok(out.includes('### Blocked\n\n- C'));
});

test('agent preamble includes budget, do-not-touch paths and a verify fence', () => {
  const out = build({
    agentPreamble: true,
    contextBudget: 'Read only listed files',
    doNotTouch: 'a/\nb.ts',
    verifyCommands: 'npm test',
    timestamps: false,
  });
  assert.ok(out.includes('## For an AI agent'));
  assert.ok(out.includes('**Context budget:** Read only listed files'));
  assert.ok(out.includes('**Do not touch:** `a/`, `b.ts`'));
  assert.ok(out.includes('```bash\nnpm test\n```'));
});

test('agent preamble off leaves no trace of its fields', () => {
  const out = build({ agentPreamble: false, contextBudget: 'secret', doNotTouch: 'x', verifyCommands: 'y', timestamps: false });
  assert.ok(!out.includes('For an AI agent'));
  assert.ok(!out.includes('secret'));
});

test('run and test commands become bash fences', () => {
  const out = build({ runCommands: 'npm i\nnpm run dev', testCommands: 'npm test', timestamps: false });
  assert.ok(out.includes('## How to run and test\n\nRun:\n\n```bash\nnpm i\nnpm run dev\n```\n\nTest:\n\n```bash\nnpm test\n```'));
});

test('a heading pasted into the project name does not become a second heading', () => {
  const out = build({ project: '# Evil\n## heading', timestamps: false });
  assert.ok(out.startsWith('# HANDOFF: Evil heading\n'));
  assert.equal(out.match(/^#/gm)?.length, 1);
});

test('links and owners render as bullet lists', () => {
  const out = build({ owners: 'Owner: Ada', links: 'PR: https://x.test/1', timestamps: false });
  assert.ok(out.includes('## Owners and contacts\n\n- Owner: Ada'));
  assert.ok(out.includes('## Links\n\n- [PR](https://x.test/1)'));
});

test('output always ends with exactly one newline', () => {
  const out = buildHandoff(SAMPLE_FIELDS, { now: NOW });
  assert.ok(out.endsWith('\n') && !out.endsWith('\n\n'));
});

// ---- report ----------------------------------------------------------------

if (failures.length) {
  console.error(`${failures.length} failed, ${passed} passed\n` + failures.map((f) => `  ✗ ${f}`).join('\n'));
  process.exit(1);
}
console.log(`${passed} passed`);
