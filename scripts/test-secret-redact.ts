// Unit tests for lib/secret-redact.ts. Run: npx tsx scripts/test-secret-redact.ts
//
// Every value below that has the format of a key is assembled at run time from parts, so this
// file holds no string a secret scanner would flag. The last test reads the sources and checks.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SECRET_KINDS, findSecrets, type SecretMatch } from '../lib/agent-policy';
import {
  highlightSegments,
  maskSecret,
  placeholderFor,
  redact,
  redactAll,
  sampleText,
  scanText,
  secretSpans,
} from '../lib/secret-redact';

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

// ---- made-up values ----------------------------------------------------------

const BODY = 'Zx9Qw3Lr7Tn2Vb8Kd4Hf6Jm1Pc5Ys0Ua' + 'Gt4Re8Wq2Mn6Bv0Cx3Zl7Kj1Hg5Fd9Sa';
/** `n` mixed characters, starting `from` characters into BODY. */
const body = (n: number, from = 0) => (BODY + BODY).slice(from, from + n);

const KEY_HEADER = ['-----BEGIN', 'RSA', 'PRIVATE', 'KEY-----'].join(' ');
const KEY_FOOTER = ['-----END', 'RSA', 'PRIVATE', 'KEY-----'].join(' ');
const KEY_LINES = [body(64), body(64, 7), body(40, 21) + '=='];
const KEY_BLOCK = [KEY_HEADER, ...KEY_LINES, KEY_FOOTER].join('\n');

/** One value per kind the scanner knows. A kind added to SECRET_KINDS needs a value here. */
const SAMPLES: Record<string, string> = {
  'private key block': KEY_HEADER,
  'Docs MD agent key': 'dmk' + '_' + body(43),
  'Docs MD room key': 'rmk' + '_' + body(43, 5),
  'Anthropic API key': 'sk-ant-' + 'api03-' + body(48),
  'OpenAI API key': 'sk-' + 'proj-' + body(48, 3),
  'GitHub token': 'gh' + 'p_' + body(36),
  'AWS access key id': 'AK' + 'IA' + 'Q7WX2RT9YL4PN8ZK',
  'Slack token': 'xo' + 'xb-' + '2048' + '-' + body(24),
  'Google API key': 'AI' + 'za' + body(35),
  'Stripe live key': 'sk' + '_live_' + body(24),
};

/** Values the scanner must let through. */
const PLACEHOLDERS = [
  'sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  'AKIAIOSFODNN7EXAMPLE',
  'dmk_EXAMPLE_KEY_DO_NOT_USE_00000000000000000000',
  'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  'sk-your-key-goes-here-000000000000000000000000000',
];

const at = (kind: string, line: number, start: number, end: number): SecretMatch => ({ kind, line, start, end });
const rejoin = (text: string, matches: SecretMatch[]) => highlightSegments(text, matches).map((s) => s.text).join('');
const flagged = (text: string, matches: SecretMatch[]) => highlightSegments(text, matches).filter((s) => s.flagged);

/** A document with every kind in it, one per line, with prose around each. */
const EVERYTHING = [
  '# Notes',
  ...SECRET_KINDS.map((kind) => `- ${kind}: \`${kind === 'private key block' ? 'see below' : SAMPLES[kind]}\` (rotate it)`),
  '',
  KEY_BLOCK,
  '',
  `Placeholders: ${PLACEHOLDERS.join(' ')}`,
].join('\n');

// ---- one case per kind --------------------------------------------------------

test('every kind in SECRET_KINDS has a value in this file', () => {
  assert.deepEqual(Object.keys(SAMPLES).sort(), [...SECRET_KINDS].sort());
});

for (const kind of SECRET_KINDS) {
  test(`${kind}: found, masked, replaced, and gone after redaction`, () => {
    const value = SAMPLES[kind];
    assert.ok(value, 'no sample value');
    const text = `first line\nbefore ${value} after\nlast line`;
    const matches = findSecrets(text);
    assert.ok(matches.some((m) => m.kind === kind), `not found as "${kind}"`);

    const spans = secretSpans(text, matches);
    assert.equal(spans.length, 1, 'one span');
    assert.equal(spans[0].kind, kind);
    assert.equal(spans[0].line, 2);
    assert.equal(text.slice(spans[0].start, spans[0].end), value);

    const redacted = redact(text, matches);
    assert.equal(redacted, `first line\nbefore ${placeholderFor(kind)} after\nlast line`);
    assert.deepEqual(findSecrets(redacted), []);

    const marks = flagged(text, matches);
    assert.equal(marks.length, 1);
    assert.equal(marks[0].text, value);
    assert.equal(rejoin(text, matches), text);

    if (kind !== 'private key block') {
      const masked = maskSecret(value);
      assert.equal(masked.slice(0, 4), value.slice(0, 4));
      assert.equal(masked.slice(-4), value.slice(-4));
      assert.ok(!masked.includes(value.slice(4, 12)), 'the middle of the value is shown');
      assert.ok(masked.length <= value.length);
      assert.notEqual(masked, value);
    }
  });
}

// ---- placeholders --------------------------------------------------------------

test('placeholder values are not flagged and the text is left alone', () => {
  for (const value of PLACEHOLDERS) {
    const text = `KEY=${value}\n`;
    assert.deepEqual(findSecrets(text), [], value);
    assert.equal(redact(text, findSecrets(text)), text);
    assert.equal(redactAll(text), text);
    assert.deepEqual(highlightSegments(text, []), [{ flagged: false, text, start: 0, end: text.length }]);
  }
});

test('placeholderFor: a variable name where one is conventional, otherwise the kind', () => {
  assert.equal(placeholderFor('Anthropic API key'), '<ANTHROPIC_API_KEY>');
  assert.equal(placeholderFor('OpenAI API key'), '<OPENAI_API_KEY>');
  assert.equal(placeholderFor('GitHub token'), '<REDACTED: GitHub token>');
  assert.equal(placeholderFor('private key block'), '<REDACTED: private key block>');
  assert.equal(placeholderFor('a kind added later'), '<REDACTED: a kind added later>');
});

test('the placeholders themselves are not flagged', () => {
  const all = SECRET_KINDS.map(placeholderFor);
  assert.equal(new Set(all).size, SECRET_KINDS.length, 'two kinds share a placeholder');
  assert.deepEqual(findSecrets(all.join('')), []);
  assert.deepEqual(findSecrets(all.join('\n')), []);
});

// ---- masking -------------------------------------------------------------------

test('maskSecret shows four characters at each end and caps the dots', () => {
  assert.equal(maskSecret('abcdefghijklmnopqrstuvwxyz'), 'abcd••••••••••••wxyz');
  assert.equal(maskSecret('abcdefghijklmnop'), 'abcd••••••••mnop');
});

test('maskSecret never shows more than half of a short value', () => {
  assert.equal(maskSecret(''), '');
  assert.equal(maskSecret('abc'), '•••');
  assert.equal(maskSecret('abcdefgh'), 'ab••••gh');
  assert.equal(maskSecret('abcdefghijkl'), 'abc••••••jkl');
});

test('maskSecret shows the BEGIN line of a key block and none of the key', () => {
  const masked = maskSecret(KEY_BLOCK);
  assert.ok(masked.startsWith(KEY_HEADER));
  for (const line of KEY_LINES) assert.ok(!masked.includes(line.slice(0, 8)));
  assert.ok(!masked.includes('\n'));
  assert.equal(maskSecret(KEY_HEADER), KEY_HEADER);
});

// ---- overlapping and adjacent matches -------------------------------------------

test('overlapping matches become one span with one placeholder', () => {
  const text = 'abcdefghij';
  const matches = [at('A', 1, 2, 6), at('B', 1, 4, 8)];
  assert.deepEqual(secretSpans(text, matches), [{ kind: 'A', line: 1, start: 2, end: 8 }]);
  assert.equal(redact(text, matches), 'ab<REDACTED: A>ij');
  assert.equal(rejoin(text, matches), text);
});

test('a match inside another, and two matches on the same span', () => {
  assert.equal(redact('abcdefghij', [at('A', 1, 1, 9), at('B', 1, 3, 5)]), 'a<REDACTED: A>j');
  assert.equal(redact('abcdefghij', [at('A', 1, 3, 7), at('B', 1, 3, 7)]), 'abc<REDACTED: A>hij');
});

test('matches given out of order, past the end, or empty', () => {
  assert.equal(redact('abcdefghij', [at('B', 1, 6, 8), at('A', 1, 1, 3)]), 'a<REDACTED: A>def<REDACTED: B>ij');
  assert.equal(redact('abc', [at('A', 1, 1, 99)]), 'a<REDACTED: A>');
  assert.equal(redact('abc', [at('A', 1, 7, 9), at('B', 1, 2, 2)]), 'abc');
});

test('matches that touch stay two findings', () => {
  const matches = [at('A', 1, 2, 5), at('B', 1, 5, 8)];
  assert.equal(secretSpans('abcdefghij', matches).length, 2);
  assert.equal(redact('abcdefghij', matches), 'ab<REDACTED: A><REDACTED: B>ij');
  assert.deepEqual(
    flagged('abcdefghij', matches).map((s) => [s.text, s.flagged && s.index]),
    [['cde', 0], ['fgh', 1]],
  );
});

test('an Anthropic key, which the OpenAI pattern also matches, is one finding', () => {
  const text = `export ANTHROPIC_API_KEY=${SAMPLES['Anthropic API key']}`;
  const matches = findSecrets(text);
  assert.equal(secretSpans(text, matches).length, 1);
  assert.equal(redact(text, matches), 'export ANTHROPIC_API_KEY=<ANTHROPIC_API_KEY>');
});

test('two real matches that overlap in part: a Slack token running into an agent key', () => {
  const text = 'xo' + 'xb-' + '2048' + '-' + body(20) + '-' + SAMPLES['Docs MD agent key'];
  const matches = findSecrets(text);
  assert.deepEqual(matches.map((m) => m.kind), ['Slack token', 'Docs MD agent key']);
  assert.ok(matches[1].start < matches[0].end, 'the two matches overlap');
  assert.equal(redact(text, matches), '<REDACTED: Slack token>');
});

test('two real matches that touch: a Google key ending in "-" and an Anthropic key', () => {
  const google = 'AI' + 'za' + body(34) + '-';
  const text = google + SAMPLES['Anthropic API key'];
  const matches = findSecrets(text);
  const spans = secretSpans(text, matches);
  assert.deepEqual(spans.map((s) => s.kind), ['Google API key', 'Anthropic API key']);
  assert.equal(spans[0].end, spans[1].start);
  const redacted = redact(text, matches);
  assert.equal(redacted, '<GOOGLE_API_KEY><ANTHROPIC_API_KEY>');
  assert.deepEqual(findSecrets(redacted), []);
});

test('two tokens with one character between them, and line numbers', () => {
  const token = SAMPLES['GitHub token'];
  const text = `${token},${token}\n\n${SAMPLES['Stripe live key']}`;
  const spans = secretSpans(text, findSecrets(text));
  assert.deepEqual(spans.map((s) => [s.kind, s.line]), [['GitHub token', 1], ['GitHub token', 1], ['Stripe live key', 3]]);
  assert.equal(redact(text, findSecrets(text)), '<REDACTED: GitHub token>,<REDACTED: GitHub token>\n\n<REDACTED: Stripe live key>');
});

// ---- private key blocks ----------------------------------------------------------

test('a key block is replaced from its BEGIN line to its END line', () => {
  const text = `Deploy key:\n${KEY_BLOCK}\nKeep it safe.`;
  const matches = findSecrets(text);
  assert.equal(matches.length, 1);
  const redacted = redact(text, matches);
  assert.equal(redacted, 'Deploy key:\n<REDACTED: private key block>\nKeep it safe.');
  const [mark] = flagged(text, matches);
  assert.equal(mark.text, KEY_BLOCK);
  assert.equal(mark.flagged && mark.line, 2);
});

test('a key kept as one JSON string, with "\\n" escapes', () => {
  const inline = [KEY_HEADER, ...KEY_LINES, KEY_FOOTER, ''].join('\\n');
  const text = `{\n  "private_key": "${inline}",\n  "client_id": "1234"\n}`;
  assert.equal(redact(text, findSecrets(text)), '{\n  "private_key": "<REDACTED: private key block>\\n",\n  "client_id": "1234"\n}');
});

test('a key block with no END line: the base64 lines after the header go too', () => {
  const text = `${KEY_HEADER}\n${KEY_LINES[0]}\n  ${KEY_LINES[1]}\n\nThanks, Sam`;
  const redacted = redact(text, findSecrets(text));
  assert.equal(redacted, '<REDACTED: private key block>\n\nThanks, Sam');
  const cut = [KEY_HEADER, ...KEY_LINES.slice(0, 2)].join('\\n');
  assert.equal(redact(`"key": "${cut}`, findSecrets(`"key": "${cut}`)), '"key": "<REDACTED: private key block>');
});

test('a BEGIN line quoted in prose takes nothing else with it', () => {
  const text = `The file starts with ${KEY_HEADER} and then base64.\nNext line.`;
  assert.equal(redact(text, findSecrets(text)), 'The file starts with <REDACTED: private key block> and then base64.\nNext line.');
});

test('two key blocks, and a quoted BEGIN line before a real block', () => {
  const two = `${KEY_BLOCK}\nbetween\n${KEY_BLOCK}\nafter`;
  assert.equal(redact(two, findSecrets(two)), '<REDACTED: private key block>\nbetween\n<REDACTED: private key block>\nafter');
  const quoted = `Look for ${KEY_HEADER} in the file.\nkept\n${KEY_BLOCK}\nafter`;
  assert.equal(
    redact(quoted, findSecrets(quoted)),
    'Look for <REDACTED: private key block> in the file.\nkept\n<REDACTED: private key block>\nafter',
  );
});

test('a key inside a key block is part of the block', () => {
  const text = [KEY_HEADER, SAMPLES['AWS access key id'], KEY_FOOTER].join('\n');
  assert.equal(findSecrets(text).length, 2);
  assert.equal(redact(text, findSecrets(text)), '<REDACTED: private key block>');
});

// ---- redaction leaves nothing behind ----------------------------------------------

test('a document with every kind: nothing is left after redaction', () => {
  const matches = findSecrets(EVERYTHING);
  const spans = secretSpans(EVERYTHING, matches);
  assert.equal(spans.length, SECRET_KINDS.length, 'one finding per kind');
  const redacted = redact(EVERYTHING, matches);
  assert.deepEqual(findSecrets(redacted), []);
  for (const kind of SECRET_KINDS) assert.ok(redacted.includes(placeholderFor(kind)), kind);
  for (const value of Object.values(SAMPLES)) assert.ok(!redacted.includes(value), 'a value survived');
  for (const line of KEY_LINES) assert.ok(!redacted.includes(line), 'key material survived');
  for (const value of PLACEHOLDERS) assert.ok(redacted.includes(value), 'a placeholder was replaced');
  assert.equal(rejoin(EVERYTHING, matches), EVERYTHING);
  assert.equal(redactAll(EVERYTHING), redacted);
});

test('redactAll goes on until the scanner finds nothing', () => {
  // The scanner passes over the whole run because it contains "example", and flags only the
  // AWS id inside it. Once the id is replaced, what is left of the run is a finding.
  const text = 'sk-' + body(44) + '-' + SAMPLES['AWS access key id'] + '-example';
  assert.ok(findSecrets(text).length > 0);
  const redacted = redactAll(text);
  assert.deepEqual(findSecrets(redacted), []);
  assert.ok(!redacted.includes(body(44)));
  assert.ok(redacted.endsWith('-example'));
});

// ---- scanning in chunks ------------------------------------------------------------

test('scanText gives what findSecrets gives, whatever the chunk size', () => {
  const texts = [EVERYTHING, `${EVERYTHING}\n`, `\n\n${EVERYTHING}\r\n${EVERYTHING}`, sampleText(), 'no secrets here\n'];
  for (const text of texts) {
    for (const size of [1, 7, 64, 1000, 8192]) assert.deepEqual(scanText(text, size), findSecrets(text), `chunk ${size}`);
  }
});

test('a 20,000-line log with a key on every line scans and redacts quickly', () => {
  const key = SAMPLES['Anthropic API key'];
  const text = Array.from({ length: 20_000 }, (_, i) => `2026-11-24T10:00:00Z POST /v1/messages 200 key=${key} request=${i}`).join('\n');
  const t0 = performance.now();
  const matches = scanText(text);
  const spans = secretSpans(text, matches);
  const redacted = redact(text, matches);
  const elapsed = performance.now() - t0;
  assert.equal(spans.length, 20_000);
  assert.equal(spans[19_999].line, 20_000);
  assert.deepEqual(scanText(redacted), []);
  assert.ok(elapsed < 3000, `took ${elapsed.toFixed(0)}ms`);
  console.log(`  perf: 20,000 findings in ${(text.length / 1e6).toFixed(1)} MB scanned and redacted in ${elapsed.toFixed(0)}ms`);
});

// ---- segments -----------------------------------------------------------------------

test('segments are in order, cover the text, and number the findings', () => {
  const text = `a ${SAMPLES['GitHub token']} b ${SAMPLES['Stripe live key']}`;
  const segments = highlightSegments(text, findSecrets(text));
  assert.deepEqual(segments.map((s) => s.flagged), [false, true, false, true]);
  assert.deepEqual(segments.map((s) => (s.flagged ? s.index : null)), [null, 0, null, 1]);
  let pos = 0;
  for (const s of segments) {
    assert.equal(s.start, pos);
    assert.equal(text.slice(s.start, s.end), s.text);
    pos = s.end;
  }
  assert.equal(pos, text.length);
});

test('an empty text', () => {
  assert.deepEqual(findSecrets(''), []);
  assert.deepEqual(scanText(''), []);
  assert.deepEqual(secretSpans('', []), []);
  assert.equal(redact('', []), '');
  assert.equal(redactAll(''), '');
  assert.deepEqual(highlightSegments('', []), []);
  assert.equal(redact('', [at('A', 1, 0, 5)]), '');
});

test('a text with no findings is one plain segment and is returned as it is', () => {
  const text = 'DATABASE_URL=${DATABASE_URL}\npassword: see the secret manager\n';
  assert.equal(redact(text, findSecrets(text)), text);
  assert.equal(highlightSegments(text, findSecrets(text)).length, 1);
});

// ---- the sample the tool starts with ---------------------------------------------------

test('the sample: two findings, two placeholders that pass, one connection string not detected', () => {
  const sample = sampleText();
  assert.equal(sample, sampleText(), 'the sample changes between calls');
  const spans = secretSpans(sample, findSecrets(sample));
  assert.deepEqual(spans.map((s) => [s.kind, s.line]), [['Anthropic API key', 6], ['GitHub token', 7]]);
  const lines = sample.split('\n');
  assert.ok(lines[7].startsWith('OPENAI_API_KEY=') && lines[8].startsWith('AWS_ACCESS_KEY_ID=') && lines[9].startsWith('DATABASE_URL='));
  const redacted = redactAll(sample).split('\n');
  assert.equal(redacted[5], 'ANTHROPIC_API_KEY=<ANTHROPIC_API_KEY>');
  assert.equal(redacted[6], 'GITHUB_TOKEN=<REDACTED: GitHub token>');
  assert.deepEqual(redacted.slice(7), lines.slice(7), 'the lines without a finding changed');
  assert.deepEqual(findSecrets(redacted.join('\n')), []);
});

// ---- what the page says the scanner does not find -------------------------------------------

test('the limits stated on the page hold (if one fails, the scanner changed: update app/(en)/secret-scanner/page.tsx)', () => {
  const notDetected: Record<string, string> = {
    'a password in a connection string': ['postgres://app', 'correct-horse-battery@db.example.com:5432/orders'].join(':'),
    'an AWS secret access key (no prefix)': `AWS_SECRET_ACCESS_KEY=${body(40)}`,
    'a JSON web token': ['ey' + 'J' + body(20), 'ey' + 'J' + body(40, 9), body(43, 17)].join('.'),
    'a Stripe test-mode key': 'sk' + '_test_' + body(24),
    'a key right after an escaped line break': `{"output":"first line\\n${SAMPLES['Anthropic API key']}"}`,
    'a key joined to the word before it': `TOKEN_${SAMPLES['GitHub token']}`,
    'a key that contains a placeholder word': `${SAMPLES['Anthropic API key']}-EXAMPLE`,
    'a key split across two lines': `${SAMPLES['GitHub token'].slice(0, 20)}\n${SAMPLES['GitHub token'].slice(20)}`,
    'key material without its BEGIN line': [...KEY_LINES, KEY_FOOTER].join('\n'),
  };
  for (const [what, text] of Object.entries(notDetected)) assert.deepEqual(findSecrets(text), [], what);
  // "The line that opens a private key is always flagged", even next to a placeholder word.
  assert.equal(findSecrets(`EXAMPLE ${KEY_HEADER} EXAMPLE`).length, 1);
});

// ---- the sources ------------------------------------------------------------------------

test('no source of the tool, this file included, holds a string the scanner flags', () => {
  const sources = [
    'lib/secret-redact.ts',
    'scripts/test-secret-redact.ts',
    'components/tools/SecretScanner.tsx',
    'app/(en)/secret-scanner/page.tsx',
  ];
  for (const file of sources) {
    const found = findSecrets(readFileSync(join(process.cwd(), file), 'utf8'));
    assert.deepEqual(found.map((m) => `${file}:${m.line} ${m.kind}`), []);
  }
});

// ---- report --------------------------------------------------------------------------------

console.log(`${passed} passed, ${failures.length} failed`);
for (const f of failures) console.error(`  FAIL ${f}`);
if (failures.length) process.exit(1);
