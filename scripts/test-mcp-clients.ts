// Unit tests for lib/mcp-clients.ts. Run: npx tsx scripts/test-mcp-clients.ts
//
// The expected strings are the documented shapes from each vendor's MCP page with the
// default example (name docs-md, URL https://docs-md.com/mcp) substituted in. Shell quoting
// is checked by handing the generated command line to a real POSIX shell and comparing the
// arguments it produces.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  DEFAULT_CLIENT_IDS,
  DEFAULT_INPUT,
  DEFAULT_LINK_STATE,
  FACTS_CHECKED,
  MCP_CLIENTS,
  PLACEHOLDER,
  base64Utf8,
  decodeLinkState,
  encodeLinkState,
  getMcpClient,
  isRemote,
  shellQuote,
  splitArgs,
  tomlKey,
  tomlString,
  timeoutLabel,
  validateInput,
  yamlScalar,
  type LinkState,
  type OutputBlock,
  type ServerInput,
} from '../lib/mcp-clients';

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

// ---- helpers ---------------------------------------------------------------

const URL_ = 'https://docs-md.com/mcp';

function blocks(id: string, input: ServerInput = DEFAULT_INPUT): OutputBlock[] {
  const c = getMcpClient(id);
  assert.ok(c, `client ${id} exists`);
  return c.generate(input);
}
function caveats(id: string, input: ServerInput): string[] {
  const c = getMcpClient(id);
  assert.ok(c, `client ${id} exists`);
  return c.caveats(input);
}
const codes = (id: string, input?: ServerInput) => blocks(id, input).map((b) => b.code);
const commands = (id: string, input?: ServerInput) => blocks(id, input).filter((b) => b.kind === 'command').map((b) => b.code);
function only(id: string, kind: OutputBlock['kind'], input?: ServerInput, index = 0): OutputBlock {
  const found = blocks(id, input).filter((b) => b.kind === kind);
  assert.ok(found[index], `${id} has a ${kind} block #${index}`);
  return found[index];
}
const fileJson = (id: string, input?: ServerInput, index = 0) => JSON.parse(only(id, 'file', input, index).code);
const paths = (b: OutputBlock) => (b.locations ?? []).map((l) => l.path);

/** The argument list a POSIX shell builds from a command line (nothing is executed). */
function shellArgs(line: string): string[] {
  const out = execFileSync('sh', ['-c', `set -- ${line}\nprintf '%s\\0' "$@"`], { encoding: 'utf8' });
  return out.split('\0').slice(0, -1);
}

/** A reader for the TOML subset the generator writes: tables, strings, integers, string arrays, inline tables. */
function parseToml(src: string): Record<string, Record<string, unknown>> {
  const tables: Record<string, Record<string, unknown>> = {};
  let current = '';
  const readString = (s: string, i: number): [string, number] => {
    assert.equal(s[i], '"', `expected a string at ${i} in ${s}`);
    let out = '';
    i++;
    while (s[i] !== '"') {
      assert.ok(i < s.length, `unterminated string in ${s}`);
      if (s[i] === '\\') {
        const n = s[++i];
        if (n === 'n') out += '\n';
        else if (n === 't') out += '\t';
        else if (n === 'r') out += '\r';
        else if (n === 'u') {
          out += String.fromCharCode(parseInt(s.slice(i + 1, i + 5), 16));
          i += 4;
        } else if (n === '"' || n === '\\') out += n;
        else assert.fail(`bad escape \\${n}`);
        i++;
      } else out += s[i++];
    }
    return [out, i + 1];
  };
  const readKey = (s: string, i: number): [string, number] => {
    if (s[i] === '"') return readString(s, i);
    const m = /^[A-Za-z0-9_-]+/.exec(s.slice(i));
    assert.ok(m, `bad key at ${i} in ${s}`);
    return [m[0], i + m[0].length];
  };
  const skip = (s: string, i: number) => {
    while (s[i] === ' ') i++;
    return i;
  };
  for (const line of src.split('\n')) {
    if (!line.trim()) continue;
    if (line.startsWith('[')) {
      const parts: string[] = [];
      let i = 1;
      while (line[i] !== ']') {
        const [k, next] = readKey(line, i);
        parts.push(k);
        i = next;
        if (line[i] === '.') i++;
      }
      current = JSON.stringify(parts);
      tables[current] = {};
      continue;
    }
    const [key, afterKey] = readKey(line, 0);
    let i = skip(line, afterKey);
    assert.equal(line[i], '=', `expected = in ${line}`);
    i = skip(line, i + 1);
    let value: unknown;
    if (line[i] === '"') [value] = readString(line, i);
    else if (line[i] === '[') {
      const items: string[] = [];
      i = skip(line, i + 1);
      while (line[i] !== ']') {
        const [v, next] = readString(line, i);
        items.push(v);
        i = skip(line, next);
        if (line[i] === ',') i = skip(line, i + 1);
      }
      value = items;
    } else if (line[i] === '{') {
      const table: Record<string, string> = {};
      i = skip(line, i + 1);
      while (line[i] !== '}') {
        const [k, afterK] = readKey(line, i);
        i = skip(line, afterK);
        assert.equal(line[i], '=');
        const [v, next] = readString(line, skip(line, i + 1));
        table[k] = v;
        i = skip(line, next);
        if (line[i] === ',') i = skip(line, i + 1);
      }
      value = table;
    } else value = Number(line.slice(i));
    tables[current][key] = value;
  }
  return tables;
}
const table = (...parts: string[]) => JSON.stringify(parts);

/** The `yaml` package when it is installed (it is a transitive dependency), else null. */
function yamlParser(): ((text: string) => unknown) | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return (require('yaml') as { parse: (text: string) => unknown }).parse;
  } catch {
    return null;
  }
}
const parseYaml = yamlParser();

const NASTY = 'say "hi" to $HOME, it\'s `fine` \\ ok!';
const withHeaders: ServerInput = {
  name: 'my-api',
  url: 'https://api.example.com/mcp?x=1&y=2',
  headers: { Authorization: 'Bearer dmk_…', 'X-Note': NASTY },
};
const local: ServerInput = { name: 'context7', command: 'npx', args: ['-y', '@upstash/context7-mcp'] };
const localEnv: ServerInput = {
  name: 'files',
  command: '/opt/my tools/server',
  args: ['--root', '/tmp/my dir', "it's"],
  env: { API_KEY: 'dmk_…', NOTE: NASTY },
};
const timed: ServerInput = { ...DEFAULT_INPUT, timeoutSeconds: 120 };
const INPUTS: [string, ServerInput][] = [
  ['default', DEFAULT_INPUT],
  ['headers', withHeaders],
  ['local', local],
  ['local with env', localEnv],
  ['timeout', timed],
  ['odd name', { name: 'my server.v2', url: URL_ }],
  ['empty', { name: '', url: '' }],
];

// ---- the client list -------------------------------------------------------

test('client list: ids are unique and every client carries its source and date', () => {
  const ids = MCP_CLIENTS.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(MCP_CLIENTS.length, 21);
  for (const c of MCP_CLIENTS) {
    assert.match(c.id, /^[a-z0-9]+(-[a-z0-9]+)*$/, c.id);
    assert.match(c.docUrl, /^https:\/\//, c.id);
    assert.ok(c.docTitle, c.id);
    assert.equal(c.checked, '2026-11-24', c.id);
    assert.ok(c.timeout.summary, c.id);
    assert.ok(c.notes.length > 0, c.id);
    if (c.timeout.seconds === null) assert.match(c.timeout.summary, /^Not documented/, c.id);
    else assert.ok(c.timeout.sourceUrl, `${c.id} timeout has a source`);
  }
  assert.equal(FACTS_CHECKED, '2026-11-24');
  for (const id of DEFAULT_CLIENT_IDS) assert.ok(getMcpClient(id), id);
});

test('client list: current names, with the old name kept', () => {
  assert.equal(getMcpClient('devin')?.name, 'Devin Desktop');
  assert.equal(getMcpClient('devin')?.formerName, 'Windsurf');
  assert.equal(getMcpClient('copilot-cloud-agent')?.formerName, 'Copilot coding agent');
  assert.match(getMcpClient('kiro')?.formerName ?? '', /Amazon Q Developer CLI/);
  assert.ok(!MCP_CLIENTS.some((c) => /roo/i.test(c.name)), 'Roo Code was shut down');
});

test('client list: documented tool-call timeouts', () => {
  const seconds = Object.fromEntries(MCP_CLIENTS.map((c) => [c.id, c.timeout.seconds]));
  assert.deepEqual(seconds, {
    'claude-code': 60,
    claude: 240,
    chatgpt: null,
    codex: 60,
    cursor: null,
    vscode: null,
    'copilot-cli': 30,
    'copilot-cloud-agent': null,
    'gemini-cli': 600,
    antigravity: 180,
    devin: null,
    zed: 60,
    cline: 60,
    continue: null,
    opencode: 43200,
    goose: 300,
    'jetbrains-ai-assistant': null,
    junie: 60,
    kiro: 120,
    'lm-studio': null,
    warp: null,
  });
});

// ---- the default example, client by client ------------------------------------

test('Claude Code: commands and .mcp.json', () => {
  assert.deepEqual(commands('claude-code'), [
    `claude mcp add --transport http docs-md ${URL_}`,
    `claude mcp add --transport http docs-md --scope user ${URL_}`,
  ]);
  const f = only('claude-code', 'file');
  assert.deepEqual(JSON.parse(f.code), { mcpServers: { 'docs-md': { type: 'http', url: URL_ } } });
  assert.equal(f.path, '.mcp.json');
  assert.equal(f.code, '{\n  "mcpServers": {\n    "docs-md": {\n      "type": "http",\n      "url": "https://docs-md.com/mcp"\n    }\n  }\n}');
});

test('Claude web and desktop: steps and the prefill link', () => {
  const s = only('claude', 'steps').code;
  assert.match(s, /Add custom connector/);
  assert.match(s, /Name: docs-md/);
  assert.match(s, /Remote MCP server URL: https:\/\/docs-md\.com\/mcp/);
  assert.equal(
    only('claude', 'link').code,
    'https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=docs-md&connectorUrl=https%3A%2F%2Fdocs-md.com%2Fmcp',
  );
});

test('ChatGPT: steps only', () => {
  const all = blocks('chatgpt');
  assert.equal(all.length, 1);
  assert.equal(all[0].kind, 'steps');
  assert.match(all[0].code, /Add custom MCP server/);
  assert.match(all[0].code, /Server URL: https:\/\/docs-md\.com\/mcp/);
  assert.match(all[0].code, /Create as a plugin/);
});

test('Codex: codex mcp add --url and the config.toml table', () => {
  assert.deepEqual(commands('codex'), [`codex mcp add docs-md --url ${URL_}`]);
  const f = only('codex', 'file');
  assert.equal(f.language, 'toml');
  assert.equal(f.code, '[mcp_servers.docs-md]\nurl = "https://docs-md.com/mcp"');
  assert.deepEqual(paths(f), ['~/.codex/config.toml', '.codex/config.toml']);
});

test('Cursor: mcp.json and the install link', () => {
  const f = only('cursor', 'file');
  assert.deepEqual(JSON.parse(f.code), { mcpServers: { 'docs-md': { url: URL_ } } });
  assert.deepEqual(paths(f), ['.cursor/mcp.json', '~/.cursor/mcp.json']);
  assert.equal(
    only('cursor', 'link').code,
    'cursor://anysphere.cursor-deeplink/mcp/install?name=docs-md&config=eyJ1cmwiOiJodHRwczovL2RvY3MtbWQuY29tL21jcCJ9',
  );
});

test('VS Code: portable mcpServers file, the deprecated servers file, the install link', () => {
  const current = only('vscode', 'file');
  assert.deepEqual(JSON.parse(current.code), { mcpServers: { 'docs-md': { type: 'http', url: URL_, tools: ['*'] } } });
  assert.deepEqual(paths(current), ['.mcp.json', '~/.copilot/mcp-config.json']);
  const old = only('vscode', 'file', undefined, 1);
  assert.deepEqual(JSON.parse(old.code), { servers: { 'docs-md': { type: 'http', url: URL_ } } });
  assert.deepEqual(paths(old), ['.vscode/mcp.json']);
  assert.match(old.label, /Deprecated/);
  assert.match(old.note ?? '', /February 2027/);
  assert.equal(
    only('vscode', 'link').code,
    'vscode:mcp/install?%7B%22name%22%3A%22docs-md%22%2C%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fdocs-md.com%2Fmcp%22%7D',
  );
});

test('Copilot CLI: command and mcp-config.json', () => {
  assert.deepEqual(commands('copilot-cli'), [`copilot mcp add --transport http docs-md ${URL_}`]);
  const f = only('copilot-cli', 'file');
  assert.deepEqual(JSON.parse(f.code), { mcpServers: { 'docs-md': { type: 'http', url: URL_, tools: ['*'] } } });
  assert.deepEqual(paths(f), ['~/.copilot/mcp-config.json', '.mcp.json', '.github/mcp.json']);
});

test('Copilot cloud agent: repository settings JSON', () => {
  const f = only('copilot-cloud-agent', 'file');
  assert.deepEqual(JSON.parse(f.code), { mcpServers: { 'docs-md': { type: 'http', url: URL_, tools: ['*'] } } });
  assert.equal(f.path, undefined);
  assert.match(f.where ?? '', /Settings > Copilot > MCP servers/);
});

test('Gemini CLI: command, and httpUrl (not url) in settings.json', () => {
  assert.deepEqual(commands('gemini-cli'), [
    `gemini mcp add --transport http docs-md ${URL_}`,
    `gemini mcp add --transport http --scope user docs-md ${URL_}`,
  ]);
  const f = only('gemini-cli', 'file');
  assert.deepEqual(JSON.parse(f.code), { mcpServers: { 'docs-md': { httpUrl: URL_ } } });
  assert.deepEqual(paths(f), ['.gemini/settings.json', '~/.gemini/settings.json']);
});

test('Antigravity: serverUrl, never httpUrl', () => {
  const f = only('antigravity', 'file');
  assert.deepEqual(JSON.parse(f.code), { mcpServers: { 'docs-md': { serverUrl: URL_ } } });
  assert.deepEqual(paths(f), ['.agents/mcp_config.json', '~/.gemini/config/mcp_config.json']);
  assert.ok(!f.code.includes('httpUrl'));
});

test('Devin Desktop: devin mcp add and mcp_config.json', () => {
  assert.deepEqual(commands('devin'), [`devin mcp add docs-md ${URL_}`, `devin mcp add -s project docs-md ${URL_}`]);
  const f = only('devin', 'file');
  assert.deepEqual(JSON.parse(f.code), { mcpServers: { 'docs-md': { url: URL_, transport: 'http' } } });
  assert.deepEqual(paths(f), ['.devin/mcp_config.json', '.devin/mcp_config.local.json', '~/.config/devin/mcp_config.json']);
});

test('Zed: context_servers', () => {
  const f = only('zed', 'file');
  assert.deepEqual(JSON.parse(f.code), { context_servers: { 'docs-md': { url: URL_ } } });
  assert.match(f.where ?? '', /settings\.json/);
});

test('Cline: command and the explicit streamableHttp type', () => {
  assert.deepEqual(commands('cline'), [`cline mcp add docs-md ${URL_} --transport http --yes`]);
  assert.deepEqual(fileJson('cline'), {
    mcpServers: { 'docs-md': { type: 'streamableHttp', url: URL_, disabled: false, autoApprove: [] } },
  });
});

test('Continue: a block file in .continue/mcpServers', () => {
  const f = only('continue', 'file');
  assert.equal(f.language, 'yaml');
  assert.equal(
    f.code,
    'name: docs-md\nversion: 0.0.1\nschema: v1\nmcpServers:\n  - name: docs-md\n    type: streamable-http\n    url: https://docs-md.com/mcp',
  );
  assert.equal(f.path, '.continue/mcpServers/docs-md.yaml');
});

test('OpenCode: commands and mcp.servers', () => {
  assert.deepEqual(commands('opencode'), [`opencode mcp add docs-md --url ${URL_}`, `opencode mcp add docs-md --global --url ${URL_}`]);
  const f = only('opencode', 'file');
  assert.deepEqual(JSON.parse(f.code), {
    $schema: 'https://opencode.ai/config.json',
    mcp: { servers: { 'docs-md': { type: 'remote', url: URL_ } } },
  });
  assert.deepEqual(paths(f), ['opencode.json', '~/.config/opencode/opencode.json']);
});

test('Goose: config.yaml entry, deeplink, one-session flag', () => {
  const f = only('goose', 'file');
  assert.equal(
    f.code,
    'extensions:\n  docs-md:\n    type: streamable_http\n    name: docs-md\n    enabled: true\n    uri: "https://docs-md.com/mcp"\n    headers: {}\n    timeout: 300',
  );
  assert.equal(f.path, '~/.config/goose/config.yaml');
  assert.equal(
    only('goose', 'link').code,
    'goose://extension?url=https%3A%2F%2Fdocs-md.com%2Fmcp&type=streamable_http&id=docs-md&name=docs-md&description=docs-md%20MCP%20server',
  );
  assert.deepEqual(commands('goose'), [`goose session --with-streamable-http-extension ${URL_}`]);
});

test('JetBrains AI Assistant: url only', () => {
  const f = only('jetbrains-ai-assistant', 'file');
  assert.deepEqual(JSON.parse(f.code), { mcpServers: { 'docs-md': { url: URL_ } } });
  assert.match(f.where ?? '', /Model Context Protocol \(MCP\)/);
});

test('Junie: .junie/mcp/mcp.json', () => {
  const f = only('junie', 'file');
  assert.deepEqual(JSON.parse(f.code), { mcpServers: { 'docs-md': { url: URL_ } } });
  assert.deepEqual(paths(f), ['.junie/mcp/mcp.json', '~/.junie/mcp/mcp.json']);
});

test('Kiro: mcp.json and the launch link', () => {
  const f = only('kiro', 'file');
  assert.deepEqual(JSON.parse(f.code), { mcpServers: { 'docs-md': { url: URL_ } } });
  assert.deepEqual(paths(f), ['.kiro/settings/mcp.json', '~/.kiro/settings/mcp.json']);
  assert.equal(
    only('kiro', 'link').code,
    'https://kiro.dev/launch/mcp/add?name=docs-md&config=%7B%22url%22%3A%22https%3A%2F%2Fdocs-md.com%2Fmcp%22%7D',
  );
});

test('LM Studio: mcp.json and the add_mcp link', () => {
  assert.deepEqual(fileJson('lm-studio'), { mcpServers: { 'docs-md': { url: URL_ } } });
  assert.equal(only('lm-studio', 'link').code, 'lmstudio://add_mcp?name=docs-md&config=eyJ1cmwiOiJodHRwczovL2RvY3MtbWQuY29tL21jcCJ9');
});

test('Warp: .warp/.mcp.json', () => {
  const f = only('warp', 'file');
  assert.deepEqual(JSON.parse(f.code), { mcpServers: { 'docs-md': { url: URL_ } } });
  assert.deepEqual(paths(f), ['.warp/.mcp.json', '~/.warp/.mcp.json']);
});

// ---- the optional timeout -----------------------------------------------------

test('timeout: written in each client\'s documented unit', () => {
  assert.equal(fileJson('claude-code', timed).mcpServers['docs-md'].timeout, 120000);
  assert.equal(only('codex', 'file', timed).code, '[mcp_servers.docs-md]\nurl = "https://docs-md.com/mcp"\ntool_timeout_sec = 120');
  assert.deepEqual(commands('copilot-cli', timed), [`copilot mcp add --transport http --timeout 120000 docs-md ${URL_}`]);
  assert.deepEqual(fileJson('copilot-cli', timed), {
    mcpServers: { 'docs-md': { type: 'http', url: URL_, tools: ['*'], timeout: 120000 } },
  });
  assert.equal(fileJson('gemini-cli', timed).mcpServers['docs-md'].timeout, 120000);
  assert.equal(fileJson('antigravity', timed).mcpServers['docs-md'].timeoutSeconds, 120);
  assert.deepEqual(fileJson('zed', timed), { context_servers: { 'docs-md': { url: URL_, timeout: 120 } } });
  assert.deepEqual(fileJson('junie', timed), { mcpServers: { 'docs-md': { url: URL_, timeout: 120000 } } });
  assert.match(only('goose', 'file', timed).code, /\n    timeout: 120$/);
});

test('timeout: capped where the client documents a cap, left out where no field is documented', () => {
  const long: ServerInput = { ...DEFAULT_INPUT, timeoutSeconds: 7200 };
  assert.equal(fileJson('zed', long).context_servers['docs-md'].timeout, 600);
  assert.equal(caveats('zed', long).length, 1);
  assert.equal(fileJson('junie', long).mcpServers['docs-md'].timeout, 3600000);
  for (const id of ['cursor', 'vscode', 'copilot-cloud-agent', 'devin', 'continue', 'jetbrains-ai-assistant', 'kiro', 'lm-studio', 'warp', 'cline', 'opencode']) {
    assert.ok(!/timeout/i.test(codes(id, timed).join('\n')), `${id} writes no timeout`);
    assert.ok(caveats(id, timed).some((w) => /timeout/i.test(w)), `${id} says the timeout is left out`);
    assert.deepEqual(caveats(id, DEFAULT_INPUT), [], `${id} has no caveat for the default example`);
  }
  for (const bad of [0, -5, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.deepEqual(fileJson('junie', { ...DEFAULT_INPUT, timeoutSeconds: bad }), { mcpServers: { 'docs-md': { url: URL_ } } });
  }
});

// ---- local commands -------------------------------------------------------------

test('local command: the documented CLI forms', () => {
  assert.deepEqual(commands('claude-code', local), [
    'claude mcp add --transport stdio context7 -- npx -y @upstash/context7-mcp',
    'claude mcp add --transport stdio --scope user context7 -- npx -y @upstash/context7-mcp',
  ]);
  assert.deepEqual(commands('codex', local), ['codex mcp add context7 -- npx -y @upstash/context7-mcp']);
  assert.deepEqual(commands('copilot-cli', local), ['copilot mcp add context7 -- npx -y @upstash/context7-mcp']);
  assert.deepEqual(commands('opencode', local), [
    'opencode mcp add context7 -- npx -y @upstash/context7-mcp',
    'opencode mcp add context7 --global -- npx -y @upstash/context7-mcp',
  ]);
  assert.deepEqual(commands('cline', local), ['cline mcp add context7 --yes -- npx -y @upstash/context7-mcp']);
  assert.deepEqual(commands('devin', local)[0], 'devin mcp add context7 -- npx -y @upstash/context7-mcp');
  // Gemini CLI: server flags go after "--", as in `gemini mcp add python-server python server.py -- --server-arg my-value`.
  assert.deepEqual(commands('gemini-cli', local)[0], 'gemini mcp add context7 npx -- -y @upstash/context7-mcp');
  assert.deepEqual(
    commands('gemini-cli', { name: 'python-server', command: 'python', args: ['server.py', '--server-arg', 'my-value'] })[0],
    'gemini mcp add python-server python server.py -- --server-arg my-value',
  );
});

test('local command: Claude Code keeps an option between --env and the name', () => {
  const [cmd] = commands('claude-code', { name: 'airtable', command: 'npx', args: ['-y', 'airtable-mcp-server'], env: { AIRTABLE_API_KEY: 'YOUR_KEY' } });
  assert.equal(cmd, 'claude mcp add --env AIRTABLE_API_KEY=YOUR_KEY --transport stdio airtable -- npx -y airtable-mcp-server');
});

test('local command: file shapes', () => {
  const entry = { command: 'npx', args: ['-y', '@upstash/context7-mcp'] };
  assert.deepEqual(fileJson('claude-code', local), { mcpServers: { context7: { type: 'stdio', ...entry } } });
  assert.equal(only('codex', 'file', local).code, '[mcp_servers.context7]\ncommand = "npx"\nargs = ["-y", "@upstash/context7-mcp"]');
  assert.deepEqual(fileJson('cursor', local), { mcpServers: { context7: { type: 'stdio', ...entry } } });
  assert.deepEqual(fileJson('vscode', local), { mcpServers: { context7: { type: 'stdio', ...entry, tools: ['*'] } } });
  assert.deepEqual(fileJson('vscode', local, 1), { servers: { context7: { type: 'stdio', ...entry } } });
  assert.deepEqual(fileJson('copilot-cli', local), { mcpServers: { context7: { type: 'local', ...entry, tools: ['*'] } } });
  assert.deepEqual(fileJson('copilot-cloud-agent', local), { mcpServers: { context7: { type: 'local', ...entry, tools: ['*'] } } });
  assert.deepEqual(fileJson('gemini-cli', local), { mcpServers: { context7: entry } });
  assert.deepEqual(fileJson('antigravity', local), { mcpServers: { context7: entry } });
  assert.deepEqual(fileJson('devin', local), { mcpServers: { context7: entry } });
  assert.deepEqual(fileJson('zed', local), { context_servers: { context7: { ...entry, env: {} } } });
  assert.deepEqual(fileJson('cline', local), { mcpServers: { context7: { ...entry, disabled: false, autoApprove: [] } } });
  assert.deepEqual(fileJson('opencode', local).mcp.servers.context7, { type: 'local', command: ['npx', '-y', '@upstash/context7-mcp'] });
  assert.deepEqual(fileJson('jetbrains-ai-assistant', local), { mcpServers: { context7: entry } });
  for (const id of ['junie', 'kiro', 'lm-studio', 'warp']) assert.deepEqual(fileJson(id, local), { mcpServers: { context7: entry } }, id);
  assert.equal(
    only('continue', 'file', local).code,
    'name: context7\nversion: 0.0.1\nschema: v1\nmcpServers:\n  - name: context7\n    type: stdio\n    command: npx\n    args:\n      - "-y"\n      - "@upstash/context7-mcp"',
  );
  assert.equal(
    only('goose', 'file', local).code,
    'extensions:\n  context7:\n    name: context7\n    cmd: npx\n    args: ["-y", "@upstash/context7-mcp"]\n    enabled: true\n    envs: {}\n    type: stdio\n    timeout: 300',
  );
  assert.equal(
    only('goose', 'link', local).code,
    'goose://extension?cmd=npx&arg=-y&arg=%40upstash%2Fcontext7-mcp&id=context7&name=context7&description=context7%20MCP%20server',
  );
});

test('local command: env lands in each client\'s own key', () => {
  const env = { API_KEY: 'dmk_…', NOTE: NASTY };
  assert.deepEqual(fileJson('claude-code', localEnv).mcpServers.files.env, env);
  assert.deepEqual(fileJson('opencode', localEnv).mcp.servers.files.environment, env);
  assert.deepEqual(fileJson('zed', localEnv).context_servers.files.env, env);
  const toml = parseToml(only('codex', 'file', localEnv).code);
  assert.deepEqual(toml[table('mcp_servers', 'files')], { command: '/opt/my tools/server', args: ['--root', '/tmp/my dir', "it's"] });
  assert.deepEqual(toml[table('mcp_servers', 'files', 'env')], env);
});

test('clients that only take a URL say so for a local command', () => {
  for (const id of ['claude', 'chatgpt']) {
    assert.deepEqual(blocks(id, local), [], id);
    assert.equal(caveats(id, local).length, 1, id);
  }
});

test('where a CLI has no flag for headers or env, the command is dropped and a caveat says why', () => {
  assert.deepEqual(commands('codex', withHeaders), []);
  assert.match(caveats('codex', withHeaders).join(' '), /no header flag/);
  assert.deepEqual(commands('devin', withHeaders), []);
  assert.deepEqual(commands('devin', localEnv), []);
  assert.deepEqual(commands('cline', localEnv), []);
  assert.equal(caveats('devin', withHeaders).length, 1);
  assert.equal(caveats('cline', localEnv).length, 1);
});

test('fields a vendor does not document are left out and reported', () => {
  assert.deepEqual(fileJson('jetbrains-ai-assistant', withHeaders), { mcpServers: { 'my-api': { url: withHeaders.url } } });
  assert.match(caveats('jetbrains-ai-assistant', withHeaders).join(' '), /headers/);
  assert.deepEqual(fileJson('jetbrains-ai-assistant', localEnv).mcpServers.files, { command: '/opt/my tools/server', args: localEnv.args });
  assert.match(caveats('jetbrains-ai-assistant', localEnv).join(' '), /env/);
  assert.ok(!codes('chatgpt', withHeaders).join('\n').includes('Bearer'));
  assert.match(caveats('chatgpt', withHeaders).join(' '), /headers/);
  assert.ok(!codes('claude', withHeaders).join('\n').includes('Bearer'));
  assert.match(caveats('claude', withHeaders).join(' '), /beta/);
});

// ---- escaping -----------------------------------------------------------------

test('shellQuote: bare, double-quoted, single-quoted', () => {
  assert.equal(shellQuote('docs-md'), 'docs-md');
  assert.equal(shellQuote('https://docs-md.com/mcp'), 'https://docs-md.com/mcp');
  assert.equal(shellQuote('@upstash/context7-mcp'), '@upstash/context7-mcp');
  assert.equal(shellQuote('KEY=value'), 'KEY=value');
  assert.equal(shellQuote(''), '""');
  assert.equal(shellQuote('Authorization: Bearer abc123'), '"Authorization: Bearer abc123"');
  assert.equal(shellQuote("it's"), '"it\'s"');
  assert.equal(shellQuote('say "hi"'), '\'say "hi"\'');
  assert.equal(shellQuote('$HOME'), "'$HOME'");
  assert.equal(shellQuote(`it's "x"`), `'it'\\''s "x"'`);
  assert.equal(shellQuote('a&b'), '"a&b"');
  assert.equal(shellQuote('=cmd'), '"=cmd"');
  assert.equal(shellQuote('~/x'), '"~/x"');
});

test('shellQuote: a real shell reads back exactly what went in', () => {
  const samples = ['plain', '', 'two words', NASTY, 'a;b|c&d', '$(touch /tmp/x)', '`id`', '*.md', '~/x', '#hash', 'tab\there', 'line\nbreak', "'", '"', '\\', '!bang', 'ünïcode …', '=eq', '-y', 'a=b c'];
  assert.deepEqual(shellArgs(samples.map(shellQuote).join(' ')), samples);
});

test('commands: a header value with spaces, quotes and $ survives the shell', () => {
  const header1 = 'Authorization: Bearer dmk_…';
  const header2 = `X-Note: ${NASTY}`;
  const url = withHeaders.url as string;
  assert.deepEqual(shellArgs(commands('claude-code', withHeaders)[0]), ['claude', 'mcp', 'add', '--transport', 'http', 'my-api', url, '--header', header1, '--header', header2]);
  assert.deepEqual(shellArgs(commands('copilot-cli', withHeaders)[0]), ['copilot', 'mcp', 'add', '--transport', 'http', '--header', header1, '--header', header2, 'my-api', url]);
  assert.deepEqual(shellArgs(commands('gemini-cli', withHeaders)[0]), ['gemini', 'mcp', 'add', '--transport', 'http', '--header', header1, '--header', header2, 'my-api', url]);
  assert.deepEqual(shellArgs(commands('cline', withHeaders)[0]), ['cline', 'mcp', 'add', 'my-api', url, '--transport', 'http', '--header', header1, '--header', header2, '--yes']);
  // OpenCode's --header takes NAME=VALUE.
  assert.deepEqual(shellArgs(commands('opencode', withHeaders)[0]), ['opencode', 'mcp', 'add', 'my-api', '--url', url, '--header', 'Authorization=Bearer dmk_…', '--header', `X-Note=${NASTY}`]);
  // The documented look for a simple header: double quotes.
  const simple = commands('claude-code', { name: 'secure-api', url: 'https://api.example.com/mcp', headers: { Authorization: 'Bearer your-token' } })[0];
  assert.equal(simple, 'claude mcp add --transport http secure-api https://api.example.com/mcp --header "Authorization: Bearer your-token"');
});

test('commands: a command path, arguments and env values with spaces and quotes survive the shell', () => {
  const launch = ['/opt/my tools/server', '--root', '/tmp/my dir', "it's"];
  const env1 = 'API_KEY=dmk_…';
  const env2 = `NOTE=${NASTY}`;
  assert.deepEqual(shellArgs(commands('claude-code', localEnv)[0]), ['claude', 'mcp', 'add', '--env', env1, '--env', env2, '--transport', 'stdio', 'files', '--', ...launch]);
  assert.deepEqual(shellArgs(commands('codex', localEnv)[0]), ['codex', 'mcp', 'add', 'files', '--env', env1, '--env', env2, '--', ...launch]);
  assert.deepEqual(shellArgs(commands('copilot-cli', localEnv)[0]), ['copilot', 'mcp', 'add', 'files', '--env', env1, '--env', env2, '--', ...launch]);
  assert.deepEqual(shellArgs(commands('opencode', localEnv)[0]), ['opencode', 'mcp', 'add', 'files', '--env', env1, '--env', env2, '--', ...launch]);
  assert.deepEqual(shellArgs(commands('gemini-cli', localEnv)[0]), ['gemini', 'mcp', 'add', '-e', env1, '-e', env2, 'files', launch[0], '--', ...launch.slice(1)]);
});

test('commands: a server name with a space is one shell argument', () => {
  const input: ServerInput = { name: 'my server', url: URL_ };
  for (const id of ['claude-code', 'codex', 'copilot-cli', 'gemini-cli', 'devin', 'cline', 'opencode']) {
    const args = shellArgs(commands(id, input)[0]);
    assert.ok(args.includes('my server'), `${id}: ${args.join('|')}`);
  }
});

test('TOML: strings and keys', () => {
  assert.equal(tomlString('plain'), '"plain"');
  assert.equal(tomlString('a "quoted" \\ value'), '"a \\"quoted\\" \\\\ value"');
  assert.equal(tomlString('line\nbreak\ttab'), '"line\\nbreak\\ttab"');
  assert.equal(tomlString('\u0001'), '"\\u0001"');
  assert.equal(tomlKey('docs-md'), 'docs-md');
  assert.equal(tomlKey('docs_md2'), 'docs_md2');
  assert.equal(tomlKey('my.server'), '"my.server"');
  assert.equal(tomlKey('my server'), '"my server"');
  assert.equal(tomlKey(''), '""');
});

test('TOML: a hyphenated name is a bare key; a dotted or spaced name is quoted', () => {
  assert.match(only('codex', 'file').code, /^\[mcp_servers\.docs-md\]\n/);
  const odd = only('codex', 'file', { name: 'my server.v2', url: URL_ }).code;
  assert.equal(odd, '[mcp_servers."my server.v2"]\nurl = "https://docs-md.com/mcp"');
  assert.deepEqual(parseToml(odd), { [table('mcp_servers', 'my server.v2')]: { url: URL_ } });
  const oddLocal = parseToml(only('codex', 'file', { name: 'a.b', command: 'x', env: { 'odd key': 'v' } }).code);
  assert.deepEqual(oddLocal[table('mcp_servers', 'a.b', 'env')], { 'odd key': 'v' });
});

test('TOML: header values with a space, a quote and a backslash read back unchanged', () => {
  const code = only('codex', 'file', withHeaders).code;
  assert.match(code, /^http_headers = \{ "Authorization" = "Bearer dmk_…", "X-Note" = /m);
  assert.deepEqual(parseToml(code), {
    [table('mcp_servers', 'my-api')]: { url: withHeaders.url, http_headers: withHeaders.headers },
  });
});

test('YAML: scalars', () => {
  assert.equal(yamlScalar('docs-md'), 'docs-md');
  assert.equal(yamlScalar('https://docs-md.com/mcp'), 'https://docs-md.com/mcp');
  assert.equal(yamlScalar('-y'), '"-y"');
  assert.equal(yamlScalar('@playwright/mcp@latest'), '"@playwright/mcp@latest"');
  assert.equal(yamlScalar('Bearer abc'), '"Bearer abc"');
  assert.equal(yamlScalar('true'), '"true"');
  assert.equal(yamlScalar('No'), '"No"');
  assert.equal(yamlScalar('123'), '"123"');
  assert.equal(yamlScalar('a: b'), '"a: b"');
  assert.equal(yamlScalar('key:'), '"key:"');
  assert.equal(yamlScalar('a #b'), '"a #b"');
  assert.equal(yamlScalar(''), '""');
  assert.equal(yamlScalar('say "hi" \\'), '"say \\"hi\\" \\\\"');
});

test('YAML: Continue and Goose output parses back to the input', () => {
  if (!parseYaml) {
    console.log('  note: the yaml package is not installed; YAML output was compared as text only');
    return;
  }
  const cont = parseYaml(only('continue', 'file', withHeaders).code) as { mcpServers: Record<string, unknown>[] };
  assert.deepEqual(cont.mcpServers, [
    { name: 'my-api', type: 'streamable-http', url: withHeaders.url, requestOptions: { headers: withHeaders.headers } },
  ]);
  const contLocal = parseYaml(only('continue', 'file', localEnv).code) as { mcpServers: Record<string, unknown>[] };
  assert.deepEqual(contLocal.mcpServers, [
    { name: 'files', type: 'stdio', command: '/opt/my tools/server', args: localEnv.args, env: localEnv.env },
  ]);
  const goose = parseYaml(only('goose', 'file', withHeaders).code) as { extensions: Record<string, unknown> };
  assert.deepEqual(goose.extensions['my-api'], {
    type: 'streamable_http',
    name: 'my-api',
    enabled: true,
    uri: withHeaders.url,
    headers: withHeaders.headers,
    timeout: 300,
  });
  const gooseLocal = parseYaml(only('goose', 'file', localEnv).code) as { extensions: Record<string, unknown> };
  assert.deepEqual(gooseLocal.extensions.files, {
    name: 'files',
    cmd: '/opt/my tools/server',
    args: localEnv.args,
    enabled: true,
    envs: localEnv.env,
    type: 'stdio',
    timeout: 300,
  });
  const odd = parseYaml(only('goose', 'file', { name: 'my server: v2', url: URL_ }).code) as { extensions: Record<string, { name: string }> };
  assert.equal(odd.extensions['my server: v2'].name, 'my server: v2');
});

test('JSON: every JSON block of every client parses, for every sample input', () => {
  let count = 0;
  for (const c of MCP_CLIENTS) {
    for (const [label, input] of INPUTS) {
      for (const b of c.generate(input)) {
        assert.ok(b.label && b.code, `${c.id}/${label}: empty block`);
        assert.ok(!/undefined|\[object Object\]|NaN/.test(b.code), `${c.id}/${label}: ${b.code}`);
        if (b.kind === 'file') assert.ok(b.path || b.where, `${c.id}/${label}: a file block names its destination`);
        if (b.path) assert.equal(b.path, b.locations?.[0].path);
        if (b.language !== 'json') continue;
        count++;
        let parsed: unknown;
        try {
          parsed = JSON.parse(b.code);
        } catch (e) {
          assert.fail(`${c.id}/${label}: ${e instanceof Error ? e.message : e}\n${b.code}`);
        }
        assert.equal(typeof parsed, 'object');
      }
      for (const w of c.caveats(input)) assert.ok(w.length > 10, `${c.id}/${label}: caveat text`);
    }
  }
  assert.ok(count > 100, `only ${count} JSON blocks checked`);
});

test('JSON: header values and odd names are escaped by the serializer, not by hand', () => {
  for (const id of ['claude-code', 'cursor', 'vscode', 'copilot-cli', 'copilot-cloud-agent', 'gemini-cli', 'antigravity', 'devin', 'zed', 'cline', 'junie', 'kiro', 'lm-studio', 'warp']) {
    const parsed = fileJson(id, withHeaders);
    const servers = parsed.mcpServers ?? parsed.context_servers;
    assert.deepEqual(servers['my-api'].headers, withHeaders.headers, id);
    const odd = fileJson(id, { name: 'my "server"', url: URL_ });
    assert.deepEqual(Object.keys(odd.mcpServers ?? odd.context_servers), ['my "server"'], id);
  }
  assert.deepEqual(fileJson('opencode', withHeaders).mcp.servers['my-api'].headers, withHeaders.headers);
  // A name that is also an Object.prototype key stays an ordinary key.
  assert.deepEqual(Object.keys(fileJson('cursor', { name: '__proto__', url: URL_ }).mcpServers), ['__proto__']);
});

test('install links decode back to the entry they carry', () => {
  const entry = { url: withHeaders.url, headers: withHeaders.headers };
  const param = (url: string, key: string) => new URLSearchParams(url.slice(url.indexOf('?') + 1)).get(key) ?? '';
  const fromBase64 = (b64: string) => JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  const cursor = only('cursor', 'link', withHeaders);
  assert.equal(param(cursor.code, 'name'), 'my-api');
  assert.deepEqual(fromBase64(param(cursor.code, 'config')), entry);
  assert.match(cursor.note ?? '', /secret/);
  assert.deepEqual(fromBase64(param(only('lm-studio', 'link', withHeaders).code, 'config')), entry);
  assert.deepEqual(JSON.parse(param(only('kiro', 'link', withHeaders).code, 'config')), entry);
  const vscode = only('vscode', 'link', withHeaders).code;
  assert.deepEqual(JSON.parse(decodeURIComponent(vscode.slice('vscode:mcp/install?'.length))), { name: 'my-api', type: 'http', ...entry });
  const claude = only('claude', 'link', { name: 'my server', url: withHeaders.url as string }).code;
  assert.equal(param(claude, 'connectorName'), 'my server');
  assert.equal(param(claude, 'connectorUrl'), withHeaders.url);
  assert.equal(only('cursor', 'link').note, undefined);
  // Padding characters of base64 are percent-encoded, as in LM Studio's own example link.
  assert.match(only('lm-studio', 'link', { name: 'a', url: 'https://example.com/mcp1' }).code, /config=[A-Za-z0-9]+(%3D){0,2}$/);
});

test('base64Utf8 handles text outside Latin-1', () => {
  assert.equal(base64Utf8('{"url":"https://docs-md.com/mcp"}'), 'eyJ1cmwiOiJodHRwczovL2RvY3MtbWQuY29tL21jcCJ9');
  assert.equal(Buffer.from(base64Utf8('ключ … 鍵'), 'base64').toString('utf8'), 'ключ … 鍵');
});

// ---- input handling -------------------------------------------------------------

test('splitArgs: whitespace, quotes and backslashes', () => {
  assert.deepEqual(splitArgs('-y @upstash/context7-mcp'), ['-y', '@upstash/context7-mcp']);
  assert.deepEqual(splitArgs('  a   b  '), ['a', 'b']);
  assert.deepEqual(splitArgs(''), []);
  assert.deepEqual(splitArgs('--root "/tmp/my dir" \'it is\''), ['--root', '/tmp/my dir', 'it is']);
  assert.deepEqual(splitArgs('a\\ b "c \\"d\\"" \'\''), ['a b', 'c "d"', '']);
  assert.deepEqual(splitArgs('--name="two words"'), ['--name=two words']);
  assert.deepEqual(splitArgs("'C:\\Program Files\\x.exe'"), ['C:\\Program Files\\x.exe']);
});

test('isRemote: a URL means remote, a command without a URL means local', () => {
  assert.equal(isRemote(DEFAULT_INPUT), true);
  assert.equal(isRemote({ name: 'x', command: 'npx' }), false);
  assert.equal(isRemote({ name: 'x', command: '' }), false);
  assert.equal(isRemote({ name: 'x' }), true);
});

test('validateInput: errors and hints', () => {
  assert.deepEqual(validateInput(DEFAULT_INPUT), []);
  assert.deepEqual(validateInput({ name: 'x', command: 'npx' }), []);
  assert.deepEqual(validateInput({ name: '', url: '' }).map((p) => [p.field, p.level]), [['name', 'error'], ['url', 'error']]);
  assert.deepEqual(validateInput({ name: 'x', url: 'docs-md.com/mcp' }).map((p) => p.field), ['url']);
  assert.deepEqual(validateInput({ name: 'x', url: 'ftp://docs-md.com/mcp' }).map((p) => p.field), ['url']);
  assert.deepEqual(validateInput({ name: 'my server', url: URL_ }).map((p) => [p.field, p.level]), [['name', 'hint']]);
  assert.deepEqual(validateInput({ name: 'x', command: ' ' }).map((p) => p.field), ['command']);
});

test('empty fields fall back to placeholders, so the output keeps its shape', () => {
  assert.deepEqual(fileJson('cursor', { name: ' ', url: '' }), { mcpServers: { [PLACEHOLDER.name]: { url: PLACEHOLDER.url } } });
  assert.deepEqual(fileJson('cursor', { name: 'x', command: '' }).mcpServers.x.command, PLACEHOLDER.command);
  assert.deepEqual(fileJson('cursor', { name: '  padded  ', url: `  ${URL_} ` }), { mcpServers: { padded: { url: URL_ } } });
});

test('headers apply to remote servers only, env to local ones; empty names are dropped', () => {
  const mixed: ServerInput = { name: 'x', url: URL_, headers: { '': 'skip', ' A ': 'kept' }, env: { IGNORED: '1' } };
  assert.deepEqual(fileJson('cursor', mixed), { mcpServers: { x: { url: URL_, headers: { A: 'kept' } } } });
  const mixedLocal: ServerInput = { name: 'x', command: 'run', headers: { Ignored: '1' }, env: { K: 'v' } };
  assert.deepEqual(fileJson('warp', mixedLocal), { mcpServers: { x: { command: 'run', args: [], env: { K: 'v' } } } });
});

// ---- the link (what the page keeps after "#") -----------------------------------

test('link state: the default example has an empty hash, and an empty or foreign hash means the default', () => {
  assert.equal(encodeLinkState(DEFAULT_LINK_STATE), '');
  assert.equal(decodeLinkState(''), null);
  assert.equal(decodeLinkState('#'), null);
  assert.equal(decodeLinkState('#some-heading'), null);
  assert.deepEqual(DEFAULT_LINK_STATE.clients, DEFAULT_CLIENT_IDS);
  assert.equal(DEFAULT_LINK_STATE.name, 'docs-md');
  assert.equal(DEFAULT_LINK_STATE.url, URL_);
});

test('link state: a state survives the round trip through the hash', () => {
  const states: LinkState[] = [
    { ...DEFAULT_LINK_STATE, name: 'my api', url: 'https://api.example.com/mcp?x=1&y=2#frag', headerNames: ['Authorization', 'X-Note'], timeout: '120', clients: ['claude-code', 'zed', 'warp'] },
    { ...DEFAULT_LINK_STATE, name: 'files', transport: 'stdio', url: '', command: '/opt/my tools/server', args: '--root "/tmp/my dir" -y', envNames: ['API_KEY'], clients: [] },
    { ...DEFAULT_LINK_STATE, clients: MCP_CLIENTS.map((c) => c.id) },
    { ...DEFAULT_LINK_STATE, name: 'ключ+&=%', url: 'https://例え.jp/mcp' },
    { ...DEFAULT_LINK_STATE, name: '', url: '' },
  ];
  for (const s of states) {
    const hash = encodeLinkState(s);
    assert.ok(hash.length > 0, 'a non-default state has a hash');
    assert.ok(!/[\s#"<>`]/.test(hash), `the hash needs no further escaping: ${hash}`);
    assert.deepEqual(decodeLinkState(hash), s);
    assert.deepEqual(decodeLinkState(`#${hash}`), s);
  }
});

test('link state: a link written by hand, unknown clients, client order, a bad timeout', () => {
  assert.deepEqual(decodeLinkState('name=x&url=https://x.io/mcp'), { ...DEFAULT_LINK_STATE, name: 'x', url: 'https://x.io/mcp' });
  assert.deepEqual(decodeLinkState('cmd=npx&args=-y+pkg')?.transport, 'stdio');
  assert.deepEqual(decodeLinkState('cmd=npx&args=-y+pkg')?.args, '-y pkg');
  assert.deepEqual(decodeLinkState('name=x&url=u&c=warp,nope,claude-code+zed')?.clients, ['claude-code', 'zed', 'warp']);
  assert.deepEqual(decodeLinkState('name=x&url=u&c=')?.clients, []);
  assert.equal(decodeLinkState('name=x&url=u&t=12abc3456789')?.timeout, '123456');
  // A local command drops what belongs to a remote server, and the other way round.
  assert.deepEqual(decodeLinkState('name=x&cmd=run&h=Authorization&e=KEY')?.headerNames, []);
  assert.deepEqual(decodeLinkState('name=x&url=u&h=Authorization&e=KEY')?.envNames, []);
  assert.match(encodeLinkState({ ...DEFAULT_LINK_STATE, clients: ['warp', 'codex'] }), /c=codex\+warp$/);
});

test('link state: header and variable names travel, values cannot', () => {
  const hash = encodeLinkState({ ...DEFAULT_LINK_STATE, headerNames: [' Authorization ', '', 'X-Key'] });
  assert.deepEqual(new URLSearchParams(hash).getAll('h'), ['Authorization', 'X-Key']);
  assert.deepEqual(Object.keys(DEFAULT_LINK_STATE).sort(), ['args', 'clients', 'command', 'envNames', 'headerNames', 'name', 'timeout', 'transport', 'url']);
});

test('timeoutLabel: seconds, hours, a headline, or "Not documented"', () => {
  assert.equal(timeoutLabel({ seconds: 30, summary: 'x' }), '30 s');
  assert.equal(timeoutLabel({ seconds: 43200, summary: 'x' }), '12 h');
  assert.equal(timeoutLabel({ seconds: null, summary: 'Not documented.' }), 'Not documented');
  assert.equal(timeoutLabel({ seconds: 60, headline: '60 s (from the source code)', summary: 'x' }), '60 s (from the source code)');
});

// ---- report ----------------------------------------------------------------

console.log(`${passed} passed, ${failures.length} failed`);
for (const f of failures) console.error(`  FAIL ${f}`);
if (failures.length) process.exit(1);
