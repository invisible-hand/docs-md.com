// Unit tests for lib/json-table.ts. Run: npx tsx scripts/test-json-table.ts
import assert from 'node:assert/strict';
import {
  JsonSyntaxError,
  applyHeaderCase,
  detectShape,
  flattenObject,
  jsonToMarkdownTable,
  markdownTableToJson,
  parseJson,
  parseMarkdownTable,
} from '../lib/json-table';

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

const md = (text: string, opts = {}) => jsonToMarkdownTable(text, { pad: false, ...opts }).markdown;

// ---- shapes ----------------------------------------------------------------

test('array of objects', () => {
  assert.equal(
    md('[{"name":"Ada","age":36},{"name":"Grace","age":85}]'),
    '| name | age |\n| --- | --- |\n| Ada | 36 |\n| Grace | 85 |',
  );
});

test('object of objects gets a key column', () => {
  const out = md('{"ada":{"age":36},"grace":{"age":85}}');
  assert.equal(out, '| key | age |\n| --- | --- |\n| ada | 36 |\n| grace | 85 |');
});

test('object of arrays is column-major', () => {
  const out = md('{"name":["Ada","Grace"],"age":[36,85]}');
  assert.equal(out, '| name | age |\n| --- | --- |\n| Ada | 36 |\n| Grace | 85 |');
});

test('object of arrays with ragged lengths pads with empty cells', () => {
  const out = md('{"a":[1,2,3],"b":[true]}');
  assert.equal(out, '| a | b |\n| --- | --- |\n| 1 | true |\n| 2 |  |\n| 3 |  |');
});

test('single object becomes key/value', () => {
  const out = md('{"name":"Ada","born":1815,"alive":false}');
  assert.equal(out, '| key | value |\n| --- | --- |\n| name | Ada |\n| born | 1815 |\n| alive | false |');
});

test('single object with nested values flattens into dotted keys', () => {
  const out = md('{"name":"Ada","address":{"city":"London"}}');
  assert.equal(out, '| key | value |\n| --- | --- |\n| name | Ada |\n| address.city | London |');
});

test('array of arrays gets numbered columns', () => {
  const out = md('[[1,2],[3,4,5]]');
  assert.equal(out, '| column1 | column2 | column3 |\n| --- | --- | --- |\n| 1 | 2 |  |\n| 3 | 4 | 5 |');
});

test('array of primitives is a single value column', () => {
  assert.equal(md('["a","b"]'), '| value |\n| --- |\n| a |\n| b |');
});

test('wrapper object around an array is unwrapped', () => {
  const out = jsonToMarkdownTable('{"data":[{"id":1},{"id":2}]}', { pad: false });
  assert.equal(out.shape, 'array-of-objects');
  assert.equal(out.markdown, '| id |\n| --- |\n| 1 |\n| 2 |');
});

test('detectShape labels', () => {
  assert.equal(detectShape([]), 'empty');
  assert.equal(detectShape({}), 'empty');
  assert.equal(detectShape(42), 'primitive');
  assert.equal(detectShape([{ a: 1 }, 'x']), 'array-of-objects');
});

test('empty array yields empty markdown', () => {
  assert.equal(md('[]'), '');
});

// ---- flattening ------------------------------------------------------------

test('nested keys flatten to dot paths', () => {
  const out = md('[{"user":{"name":"Ada","geo":{"lat":51.5,"lng":-0.1}}}]');
  assert.equal(out, '| user.name | user.geo.lat | user.geo.lng |\n| --- | --- | --- |\n| Ada | 51.5 | -0.1 |');
});

test('maxDepth limits flattening and stringifies the rest', () => {
  const out = md('[{"user":{"name":"Ada","geo":{"lat":1}}}]', { maxDepth: 1 });
  assert.equal(out, '| user.name | user.geo |\n| --- | --- |\n| Ada | {"lat":1} |');
});

test('maxDepth 0 keeps nested objects as JSON strings', () => {
  const out = md('[{"user":{"name":"Ada"}}]', { maxDepth: 0 });
  assert.equal(out, '| user |\n| --- |\n| {"name":"Ada"} |');
});

test('arrays of primitives join with comma-space', () => {
  const out = md('[{"tags":["a","b","c"],"n":[1,2]}]');
  assert.equal(out, '| tags | n |\n| --- | --- |\n| a, b, c | 1, 2 |');
});

test('arrays of objects are stringified', () => {
  const out = md('[{"items":[{"id":1}]}]');
  assert.equal(out, '| items |\n| --- |\n| [{"id":1}] |');
});

test('null and missing keys are empty cells; mixed keys union the columns', () => {
  const out = md('[{"a":1,"b":null},{"c":"x"}]');
  assert.equal(out, '| a | b | c |\n| --- | --- | --- |\n| 1 |  |  |\n|  |  | x |');
});

test('booleans and numbers render as text', () => {
  const out = md('[{"ok":true,"n":0,"f":1.5e3,"neg":-7}]');
  assert.equal(out, '| ok | n | f | neg |\n| --- | --- | --- | --- |\n| true | 0 | 1500 | -7 |');
});

test('empty nested object renders as {}', () => {
  assert.deepEqual(flattenObject({ a: {} }), { a: '{}' });
});

// ---- escaping ---------------------------------------------------------------

test('pipes inside values are escaped', () => {
  const out = md('[{"cmd":"a | b","x":"c"}]');
  assert.equal(out, '| cmd | x |\n| --- | --- |\n| a \\| b | c |');
});

test('newlines inside values become <br>', () => {
  const out = md('[{"note":"line1\\nline2"}]');
  assert.equal(out, '| note |\n| --- |\n| line1<br>line2 |');
});

test('pipes inside keys are escaped too', () => {
  const out = md('[{"a|b":1}]');
  assert.equal(out, '| a\\|b |\n| --- |\n| 1 |');
});

test('unicode survives and padding counts code points', () => {
  const out = jsonToMarkdownTable('[{"名前":"Ada","emoji":"😀"},{"名前":"Grace","emoji":"x"}]').markdown;
  assert.equal(out, '| 名前    | emoji |\n| ----- | ----- |\n| Ada   | 😀     |\n| Grace | x     |');
});

// ---- options ----------------------------------------------------------------

test('alphabetical column order', () => {
  const out = md('[{"z":1,"a":2,"m":3}]', { columnOrder: 'alpha' });
  assert.equal(out, '| a | m | z |\n| --- | --- | --- |\n| 2 | 3 | 1 |');
});

test('custom column order puts listed columns first, unknown names ignored', () => {
  const out = md('[{"z":1,"a":2,"m":3}]', { columnOrder: 'custom', customOrder: ['m', 'nope', 'z'] });
  assert.equal(out, '| m | z | a |\n| --- | --- | --- |\n| 3 | 1 | 2 |');
});

test('exclude drops columns', () => {
  const out = md('[{"id":1,"secret":"x","name":"n"}]', { exclude: ['secret'] });
  assert.equal(out, '| id | name |\n| --- | --- |\n| 1 | n |');
});

test('alignment per column writes colons', () => {
  const out = md('[{"a":1,"b":2,"c":3}]', { align: { a: 'left', b: 'center', c: 'right' } });
  assert.equal(out, '| a | b | c |\n| --- | :-: | --: |\n| 1 | 2 | 3 |');
});

test('padded output lines up and alignment pads accordingly', () => {
  const out = jsonToMarkdownTable('[{"name":"Ada","n":1},{"name":"Grace","n":100}]', { align: { n: 'right' } }).markdown;
  assert.equal(out, '| name  |   n |\n| ----- | --: |\n| Ada   |   1 |\n| Grace | 100 |');
});

test('header casing', () => {
  assert.equal(applyHeaderCase('firstName', 'title'), 'First Name');
  assert.equal(applyHeaderCase('user.geo_lat', 'title'), 'User Geo Lat');
  assert.equal(applyHeaderCase('firstName', 'snake'), 'first_name');
  assert.equal(applyHeaderCase('Name', 'upper'), 'NAME');
  assert.equal(applyHeaderCase('Name', 'lower'), 'name');
  assert.equal(applyHeaderCase('Name', 'as-is'), 'Name');
  const out = md('[{"firstName":"Ada"}]', { headerCase: 'title' });
  assert.equal(out, '| First Name |\n| --- |\n| Ada |');
});

test('bold header', () => {
  assert.equal(md('[{"a":1}]', { boldHeader: true }), '| **a** |\n| --- |\n| 1 |');
});

// ---- errors ----------------------------------------------------------------

function errorAt(text: string): { message: string; line: number; column: number } {
  try {
    parseJson(text);
  } catch (e) {
    if (e instanceof JsonSyntaxError) return { message: e.message, line: e.line, column: e.column };
    throw e;
  }
  throw new Error('expected a parse error');
}

test('trailing comma reports line and column', () => {
  const e = errorAt('[\n  {"a": 1},\n]');
  assert.equal(e.line, 3);
  assert.equal(e.column, 1);
  assert.match(e.message, /Trailing comma/);
});

test('single-quoted string is explained', () => {
  const e = errorAt("[{'a': 1}]");
  assert.equal(e.line, 1);
  assert.equal(e.column, 3);
  assert.match(e.message, /double quotes/);
});

test('unquoted key is explained', () => {
  const e = errorAt('{\n  name: "Ada"\n}');
  assert.equal(e.line, 2);
  assert.equal(e.column, 3);
  assert.match(e.message, /double quotes/);
});

test('missing comma between values', () => {
  const e = errorAt('[1 2]');
  assert.equal(e.column, 4);
  assert.match(e.message, /Expected "," or "\]"/);
});

test('unterminated string points at its opening quote', () => {
  const e = errorAt('{"a": "oops\n}');
  assert.equal(e.line, 1);
  assert.equal(e.column, 7);
  assert.match(e.message, /Unterminated string/);
});

test('truncated document', () => {
  const e = errorAt('{"a": [1, 2');
  assert.match(e.message, /end of input/);
});

test('empty input', () => {
  assert.match(errorAt('   ').message, /Empty input/);
});

test('garbage after the document', () => {
  const e = errorAt('{"a":1} {"b":2}');
  assert.equal(e.column, 9);
  assert.match(e.message, /after the end/);
});

test('NaN is rejected with a hint', () => {
  assert.match(errorAt('[NaN]').message, /NaN is not valid JSON/);
});

test('bad escape in string', () => {
  assert.match(errorAt('["\\x41"]').message, /Invalid escape/);
});

// ---- reverse ----------------------------------------------------------------

test('markdown → json round-trips types and nesting', () => {
  const table = jsonToMarkdownTable('[{"user":{"name":"Ada","age":36},"ok":true,"none":null,"note":"a | b"}]').markdown;
  assert.deepEqual(markdownTableToJson(table), [{ user: { name: 'Ada', age: 36 }, ok: true, none: null, note: 'a | b' }]);
});

test('markdown → json without inference keeps strings', () => {
  const out = markdownTableToJson('| a | b |\n|---|---|\n| 1 | true |', { inferTypes: false, unflatten: false });
  assert.deepEqual(out, [{ a: '1', b: 'true' }]);
});

test('markdown → json handles outer-pipe-less tables, <br>, bold header, alignment row', () => {
  const t = parseMarkdownTable('**a** | b\n:--|--:\nx<br>y | 2');
  assert.deepEqual(t.columns, ['a', 'b']);
  assert.deepEqual(t.align, ['left', 'right']);
  assert.deepEqual(t.rows, [['x\ny', '2']]);
});

test('markdown → json splitArrays', () => {
  const out = markdownTableToJson('| tags |\n|---|\n| a, b, 3 |', { splitArrays: true });
  assert.deepEqual(out, [{ tags: ['a', 'b', 3] }]);
});

test('markdown → json ignores pipes inside inline code', () => {
  const out = markdownTableToJson('| cmd | n |\n|---|---|\n| `a | b` | 1 |');
  assert.deepEqual(out, [{ cmd: '`a | b`', n: 1 }]);
});

test('markdown → json: leading zeros and huge ints stay strings', () => {
  const out = markdownTableToJson('| zip | big |\n|---|---|\n| 02134 | 12345678901234567890 |');
  assert.deepEqual(out, [{ zip: '02134', big: '12345678901234567890' }]);
});

test('markdown with no table returns []', () => {
  assert.deepEqual(markdownTableToJson('just text'), []);
});

// ---- performance -------------------------------------------------------------

test('1,000 rows × 8 columns with nesting converts quickly', () => {
  const rows = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `user ${i}`,
    email: `u${i}@example.com`,
    active: i % 2 === 0,
    score: i * 1.5,
    tags: ['a', 'b', 'c'],
    address: { city: `City ${i % 50}`, geo: { lat: i, lng: -i } },
    note: i % 10 === 0 ? 'has | pipe' : null,
  }));
  const text = JSON.stringify(rows);
  const t0 = performance.now();
  const out = jsonToMarkdownTable(text);
  const forward = performance.now() - t0;
  const t1 = performance.now();
  const back = markdownTableToJson(out.markdown);
  const reverse = performance.now() - t1;
  assert.equal(out.rows.length, 1000);
  assert.equal(out.outputColumns.length, 10);
  assert.equal(back.length, 1000);
  assert.deepEqual(back[10], {
    id: 10,
    name: 'user 10',
    email: 'u10@example.com',
    active: true,
    score: 15,
    tags: 'a, b, c',
    address: { city: 'City 10', geo: { lat: 10, lng: -10 } },
    note: 'has | pipe',
  });
  assert.ok(forward < 500, `forward took ${forward.toFixed(0)}ms`);
  assert.ok(reverse < 500, `reverse took ${reverse.toFixed(0)}ms`);
  console.log(`  perf: 1,000 rows forward ${forward.toFixed(1)}ms, reverse ${reverse.toFixed(1)}ms`);
});

test('1,000-row error still reports the right position', () => {
  const good = JSON.stringify(Array.from({ length: 1000 }, (_, i) => ({ id: i })), null, 2);
  const broken = good.replace('"id": 500', '"id": 500,');
  const e = errorAt(broken);
  assert.match(e.message, /Trailing comma|expected a quoted key/);
  assert.ok(e.line > 1000, `line ${e.line}`);
});

// ---- report ----------------------------------------------------------------

console.log(`${passed} passed, ${failures.length} failed`);
for (const f of failures) console.error(`  FAIL ${f}`);
if (failures.length) process.exit(1);
