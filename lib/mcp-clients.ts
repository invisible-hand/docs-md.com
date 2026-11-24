// MCP client facts and config generators behind /mcp-config-generator.
//
// Pure data and functions: no React and no Node imports, so the same module runs in the
// browser, in server components and under tsx (scripts/test-mcp-clients.ts).
//
// Every command, file path and config shape below follows the vendor page named in the
// client's `docUrl` (or `moreDocs`), read on FACTS_CHECKED. Nothing is filled in from memory:
// where a vendor documents no field for something (a header, a timeout, a local command),
// the generator leaves it out and `caveats()` says so. When a vendor changes a shape, change
// it here and in the test, and move FACTS_CHECKED.

export const FACTS_CHECKED = '2026-11-24';

// ---------------------------------------------------------------------------
// Types

export interface ServerInput {
  /** The name the client lists the server under. */
  name: string;
  /** Remote server: the Streamable HTTP endpoint. Leave out for a local command. */
  url?: string;
  /** Local server: the executable that starts it. Used when `url` is absent. */
  command?: string;
  /** Local server: arguments passed to `command`. */
  args?: string[];
  /** Remote server: HTTP request headers. */
  headers?: Record<string, string>;
  /** Local server: environment variables for the process. */
  env?: Record<string, string>;
  /** Optional limit for one tool call, written only where the client documents a per-server field. */
  timeoutSeconds?: number;
}

export type BlockLanguage = 'bash' | 'json' | 'toml' | 'yaml' | 'text';
export type BlockKind = 'command' | 'file' | 'link' | 'steps';
export type Scope = 'project' | 'user' | 'local';

export interface FileLocation {
  scope: Scope;
  path: string;
}

export interface OutputBlock {
  kind: BlockKind;
  label: string;
  language: BlockLanguage;
  code: string;
  /** The first documented file for this block (same as `locations[0].path`). */
  path?: string;
  /** Every documented file the block can go in, with the scope each one has. */
  locations?: FileLocation[];
  /** Where to paste it when the destination is a settings screen, not a file path. */
  where?: string;
  /** A caveat that applies to this block only. */
  note?: string;
}

export interface ToolTimeout {
  /** Documented limit on one tool call, in seconds; null when the vendor documents none. */
  seconds: number | null;
  /** Short form for a table cell when the bare number would mislead; otherwise the seconds are shown. */
  headline?: string;
  /** The limit in words, with its conditions. */
  summary: string;
  /** The documented setting that changes it. */
  setting?: string;
  sourceUrl?: string;
}

export interface McpClient {
  id: string;
  name: string;
  /** The name the product, or part of it, had before. */
  formerName?: string;
  /** Products that read this configuration. */
  covers?: string;
  /** The vendor page the shapes come from. */
  docUrl: string;
  docTitle: string;
  moreDocs?: { title: string; url: string }[];
  /** YYYY-MM-DD the facts were read from the vendor pages. */
  checked: string;
  timeout: ToolTimeout;
  /** Traps and facts worth knowing before pasting. */
  notes: string[];
  /** The documented way to check that the server is connected. */
  verify?: string;
  /** Where a user-level server is stored when that is not a file you paste a block into. */
  userStore?: string;
  /** The commands, files, links or steps for this server in this client. */
  generate(input: ServerInput): OutputBlock[];
  /** What the client cannot take from this input (left out of the blocks). */
  caveats(input: ServerInput): string[];
}

// ---------------------------------------------------------------------------
// Quoting and escaping

const SHELL_BARE = /^[A-Za-z0-9_@%+:,./-][A-Za-z0-9_@%+=:,./-]*$/;

/**
 * One shell argument. Bare when every character is inert; double quotes when the text has
 * nothing a shell expands inside them (the form the vendor docs use for headers); otherwise
 * POSIX single quotes with each ' written as '\''.
 */
export function shellQuote(text: string): string {
  if (SHELL_BARE.test(text)) return text;
  if (!/["$`\\!\n\r]/.test(text)) return `"${text}"`;
  return `'${text.replace(/'/g, `'\\''`)}'`;
}

/** A TOML basic string. */
export function tomlString(text: string): string {
  let out = '"';
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (ch === '\\') out += '\\\\';
    else if (ch === '"') out += '\\"';
    else if (ch === '\n') out += '\\n';
    else if (ch === '\r') out += '\\r';
    else if (ch === '\t') out += '\\t';
    else if (code < 0x20 || code === 0x7f) out += `\\u${code.toString(16).padStart(4, '0')}`;
    else out += ch;
  }
  return `${out}"`;
}

/** A TOML key: bare when it may be, quoted otherwise (a dot or a space in a server name). */
export function tomlKey(key: string): string {
  return /^[A-Za-z0-9_-]+$/.test(key) ? key : tomlString(key);
}

const YAML_PLAIN = /^[A-Za-z][A-Za-z0-9_./:+=@%~-]*$/;
const YAML_WORDS = /^(true|false|yes|no|on|off|null|y|n)$/i;

/** A YAML scalar: plain when nothing in it can be misread, double-quoted otherwise. */
export function yamlScalar(text: string): string {
  if (YAML_PLAIN.test(text) && !text.endsWith(':') && !YAML_WORDS.test(text)) return text;
  let out = '"';
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (ch === '\\') out += '\\\\';
    else if (ch === '"') out += '\\"';
    else if (ch === '\n') out += '\\n';
    else if (ch === '\r') out += '\\r';
    else if (ch === '\t') out += '\\t';
    else if (code < 0x20 || code === 0x7f) out += `\\x${code.toString(16).padStart(2, '0')}`;
    else out += ch;
  }
  return `${out}"`;
}

/** Base64 of the UTF-8 bytes of `text` (btoa alone fails on non-Latin-1 characters). */
export function base64Utf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

/**
 * Splits an argument line the way a shell would: whitespace separates, single and double
 * quotes group, a backslash escapes the next character outside single quotes.
 */
export function splitArgs(line: string): string[] {
  const out: string[] = [];
  let current = '';
  let started = false;
  let quote: '"' | "'" | null = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quote) {
      if (ch === quote) quote = null;
      else if (ch === '\\' && quote === '"' && i + 1 < line.length && /["\\$`]/.test(line[i + 1])) current += line[++i];
      else current += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      started = true;
    } else if (ch === '\\' && i + 1 < line.length) {
      current += line[++i];
      started = true;
    } else if (/\s/.test(ch)) {
      if (started) out.push(current);
      current = '';
      started = false;
    } else {
      current += ch;
      started = true;
    }
  }
  if (started) out.push(current);
  return out;
}

function fileSlug(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return slug || 'mcp-server';
}

// ---------------------------------------------------------------------------
// Input handling

export const DEFAULT_INPUT: ServerInput = { name: 'docs-md', url: 'https://docs-md.com/mcp' };

/** Stand-ins used while a required field is still empty, so the output keeps its shape. */
export const PLACEHOLDER = { name: 'my-server', url: 'https://example.com/mcp', command: 'your-command' } as const;

type Pairs = [string, string][];

interface Ctx {
  name: string;
  http: boolean;
  url: string;
  command: string;
  args: string[];
  headers: Pairs;
  env: Pairs;
  hasHeaders: boolean;
  hasEnv: boolean;
  /** Whole seconds, or undefined when no timeout was asked for. */
  timeout?: number;
}

function pairs(record: Record<string, string> | undefined): Pairs {
  if (!record) return [];
  return Object.entries(record)
    .map(([k, v]): [string, string] => [k.trim(), String(v)])
    .filter(([k]) => k !== '');
}

/** True when the input describes a remote server (a URL), false for a local command. */
export function isRemote(input: ServerInput): boolean {
  return input.url !== undefined || input.command === undefined;
}

function context(input: ServerInput): Ctx {
  const http = isRemote(input);
  const headers = http ? pairs(input.headers) : [];
  const env = http ? [] : pairs(input.env);
  const t = input.timeoutSeconds;
  return {
    name: input.name.trim() || PLACEHOLDER.name,
    http,
    url: (input.url ?? '').trim() || PLACEHOLDER.url,
    command: (input.command ?? '').trim() || PLACEHOLDER.command,
    args: input.args ?? [],
    headers,
    env,
    hasHeaders: headers.length > 0,
    hasEnv: env.length > 0,
    timeout: typeof t === 'number' && Number.isFinite(t) && t >= 1 ? Math.round(t) : undefined,
  };
}

export interface InputProblem {
  field: 'name' | 'url' | 'command';
  /** "error": the output is not usable as typed. "hint": it is, with a caution. */
  level: 'error' | 'hint';
  message: string;
}

/** Problems a person should fix before copying; the generators still run with placeholders. */
export function validateInput(input: ServerInput): InputProblem[] {
  const problems: InputProblem[] = [];
  const name = input.name.trim();
  if (!name) problems.push({ field: 'name', level: 'error', message: `Enter a name. Until then the output uses ${PLACEHOLDER.name}.` });
  else if (!/^[A-Za-z0-9_-]+$/.test(name))
    problems.push({
      field: 'name',
      level: 'hint',
      message: 'Letters, digits, hyphens and underscores work in every client. Other characters are quoted where the format allows it.',
    });
  if (isRemote(input)) {
    const url = (input.url ?? '').trim();
    if (!url) problems.push({ field: 'url', level: 'error', message: `Enter the server URL. Until then the output uses ${PLACEHOLDER.url}.` });
    else {
      let ok = false;
      try {
        const parsed = new URL(url);
        ok = parsed.protocol === 'https:' || parsed.protocol === 'http:';
      } catch {
        ok = false;
      }
      if (!ok) problems.push({ field: 'url', level: 'error', message: 'This is not an absolute http or https URL.' });
    }
  } else if (!(input.command ?? '').trim()) {
    problems.push({ field: 'command', level: 'error', message: `Enter the command. Until then the output uses ${PLACEHOLDER.command}.` });
  }
  return problems;
}

// ---------------------------------------------------------------------------
// Block builders

const sh = shellQuote;
const enc = encodeURIComponent;
const record = (p: Pairs): Record<string, string> => Object.fromEntries(p);

/**
 * JSON the way the vendor pages print it: objects one key per line, lists of plain values
 * on one line (`"args": ["-y", "pkg"]`, `"tools": ["*"]`).
 */
function json(value: unknown, indent = ''): string {
  const inner = `${indent}  `;
  if (Array.isArray(value)) {
    if (value.every((v) => v === null || typeof v !== 'object')) return `[${value.map((v) => JSON.stringify(v)).join(', ')}]`;
    return `[\n${value.map((v) => inner + json(v, inner)).join(',\n')}\n${indent}]`;
  }
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';
    return `{\n${entries.map(([k, v]) => `${inner}${JSON.stringify(k)}: ${json(v, inner)}`).join(',\n')}\n${indent}}`;
  }
  return JSON.stringify(value);
}

function command(label: string, parts: string[], note?: string): OutputBlock {
  return { kind: 'command', label, language: 'bash', code: parts.join(' '), ...(note ? { note } : {}) };
}

function file(
  label: string,
  language: BlockLanguage,
  code: string,
  locations: FileLocation[],
  extra: { where?: string; note?: string } = {},
): OutputBlock {
  return {
    kind: 'file',
    label,
    language,
    code,
    ...(locations.length ? { path: locations[0].path, locations } : {}),
    ...extra,
  };
}

function link(label: string, url: string, note?: string): OutputBlock {
  return { kind: 'link', label, language: 'text', code: url, ...(note ? { note } : {}) };
}

function steps(label: string, lines: string[], note?: string): OutputBlock {
  return { kind: 'steps', label, language: 'text', code: lines.map((l, i) => `${i + 1}. ${l}`).join('\n'), ...(note ? { note } : {}) };
}

/** `{ "<key>": { "<name>": entry } }`, the wrapper most clients share. */
function serversJson(name: string, entry: Record<string, unknown>, key = 'mcpServers'): string {
  return json({ [key]: { [name]: entry } });
}

/** A remote entry: the given fields, then `headers` when there are any. */
function remoteEntry(c: Ctx, fields: Record<string, unknown>, after: Record<string, unknown> = {}): Record<string, unknown> {
  return { ...fields, ...(c.hasHeaders ? { headers: record(c.headers) } : {}), ...after };
}

/** A local entry: `command`, `args`, then `env` when there is any. */
function localEntry(c: Ctx, before: Record<string, unknown> = {}, after: Record<string, unknown> = {}): Record<string, unknown> {
  return { ...before, command: c.command, args: c.args, ...(c.hasEnv ? { env: record(c.env) } : {}), ...after };
}

const headerFlags = (c: Ctx, flag = '--header'): string[] => c.headers.flatMap(([k, v]) => [flag, sh(`${k}: ${v}`)]);
const envFlags = (c: Ctx, flag = '--env'): string[] => c.env.flatMap(([k, v]) => [flag, sh(`${k}=${v}`)]);
const launch = (c: Ctx): string[] => [sh(c.command), ...c.args.map(sh)];

const SECRET_LINK_NOTE = 'This link carries the header or variable values you entered. Do not post it if they are secret.';
const linkNote = (c: Ctx, base?: string): string | undefined => {
  const parts = [base, c.hasHeaders || c.hasEnv ? SECRET_LINK_NOTE : undefined].filter(Boolean);
  return parts.length ? parts.join(' ') : undefined;
};

const noTimeoutField = (c: Ctx, client: string): string[] =>
  c.timeout ? [`${client} documents no per-server timeout field, so the ${c.timeout} second timeout is left out.`] : [];

interface ClientSpec extends Omit<McpClient, 'generate' | 'caveats' | 'checked'> {
  build(c: Ctx): OutputBlock[];
  warn?(c: Ctx): string[];
}

function client(spec: ClientSpec): McpClient {
  const { build, warn, ...facts } = spec;
  return {
    ...facts,
    checked: FACTS_CHECKED,
    generate: (input) => build(context(input)),
    caveats: (input) => (warn ? warn(context(input)) : []),
  };
}

// ---------------------------------------------------------------------------
// The clients. Order is the order of the toggles on the page.

export const MCP_CLIENTS: McpClient[] = [
  client({
    id: 'claude-code',
    name: 'Claude Code',
    docUrl: 'https://code.claude.com/docs/en/mcp',
    docTitle: 'Claude Code: Connect to tools via MCP',
    timeout: {
      seconds: 60,
      headline: '60 s to the first response byte (HTTP servers)',
      summary:
        'No short limit on the whole call (MCP_TOOL_TIMEOUT defaults to 100000000 ms, about 28 hours). For an HTTP server each request must return its first response byte within 60 seconds unless a longer tool timeout applies, and an idle window of five minutes applies after that.',
      setting: 'Per-server "timeout" in milliseconds, or MCP_TOOL_TIMEOUT for all servers',
      sourceUrl: 'https://code.claude.com/docs/en/mcp',
    },
    notes: [
      'Scopes: local is the default (this project, only you, stored in ~/.claude.json); project writes .mcp.json for everyone on the project; user covers all your projects.',
      'A JSON entry with a "url" and no "type" is a configuration error: Claude Code reads an entry without "type" as a stdio server.',
      'Put --env before another option such as --transport: directly before the server name, the name is read as one more KEY=value pair.',
      'Servers from .mcp.json need your approval in an interactive session before they connect.',
    ],
    verify: 'Run claude mcp list: each server shows Connected, Needs authentication or Failed to connect. Inside a session, /mcp shows the tool count.',
    userStore: '~/.claude.json, written by the command (local and user scope)',
    build(c) {
      const out: OutputBlock[] = [];
      const timeoutNote = c.timeout ? 'The command has no timeout flag. Use the .mcp.json entry, or add "timeout" to the saved entry.' : undefined;
      let entry: Record<string, unknown>;
      if (c.http) {
        const tail = headerFlags(c);
        out.push(command('Command (this project, only you)', ['claude', 'mcp', 'add', '--transport', 'http', sh(c.name), sh(c.url), ...tail], timeoutNote));
        out.push(command('Command (all your projects)', ['claude', 'mcp', 'add', '--transport', 'http', sh(c.name), '--scope', 'user', sh(c.url), ...tail], timeoutNote));
        entry = remoteEntry(c, { type: 'http', url: c.url });
      } else {
        const env = envFlags(c);
        out.push(command('Command (this project, only you)', ['claude', 'mcp', 'add', ...env, '--transport', 'stdio', sh(c.name), '--', ...launch(c)], timeoutNote));
        out.push(command('Command (all your projects)', ['claude', 'mcp', 'add', ...env, '--transport', 'stdio', '--scope', 'user', sh(c.name), '--', ...launch(c)], timeoutNote));
        entry = localEntry(c, { type: 'stdio' });
      }
      if (c.timeout) entry.timeout = c.timeout * 1000;
      out.push(
        file('Project file, shared with the team', 'json', serversJson(c.name, entry), [{ scope: 'project', path: '.mcp.json' }], {
          note: 'The same command with --scope project writes this entry for you.',
        }),
      );
      return out;
    },
  }),

  client({
    id: 'claude',
    name: 'Claude (web and desktop)',
    covers: 'claude.ai, Claude Desktop',
    docUrl: 'https://claude.com/docs/connectors/custom/add-unlisted',
    docTitle: "Claude: Add a connector that isn't in the directory",
    timeout: {
      seconds: 240,
      summary: '240 seconds per tool call on claude.ai and Claude Desktop.',
      sourceUrl: 'https://claude.com/docs/connectors/building/index',
    },
    notes: [
      'There is no config file for a remote server: it is added as a custom connector by URL.',
      "The connection comes from Anthropic's servers, not from your machine, so the URL has to be reachable from the internet.",
      'The Free plan allows one custom connector. On Team and Enterprise an Owner adds it under Organization settings > Connectors (Add, then Custom).',
      'A URL ending in /sse selects the older SSE transport.',
    ],
    verify: 'In a chat, select +, then Connectors, and turn the connector on. Ask which tools it offers.',
    build(c) {
      if (!c.http) return [];
      return [
        steps('Steps', [
          'Open Customize > Connectors.',
          'Select Add, then Add custom connector.',
          `Name: ${c.name}`,
          `Remote MCP server URL: ${c.url}`,
          'Click Continue and keep the options marked Detected.',
          'Click Add. If the connector then shows Connect, click it.',
        ]),
        link(
          'Link that opens the form filled in',
          `https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=${enc(c.name)}&connectorUrl=${enc(c.url)}`,
          'The link only prefills the form. You still confirm it.',
        ),
      ];
    },
    warn(c) {
      if (!c.http)
        return [
          'Claude on the web and Claude Desktop add remote servers by URL. Anthropic describes claude_desktop_config.json as a separate mechanism for local servers; its shape is not covered here.',
        ];
      return [
        ...(c.hasHeaders
          ? ['Request headers are in beta for a limited set of organizations (up to four headers), so the headers you entered are left out.']
          : []),
        ...(c.timeout ? ['No setting is documented for the 240 second limit per tool call, so the timeout you entered is left out.'] : []),
      ];
    },
  }),

  client({
    id: 'chatgpt',
    name: 'ChatGPT',
    covers: 'ChatGPT on the web',
    docUrl: 'https://developers.openai.com/api/docs/guides/custom-mcp-server',
    docTitle: 'OpenAI: Add custom MCP server',
    timeout: { seconds: null, summary: 'Not documented.' },
    notes: [
      'The server is created as a plugin. Install the plugin, then type @ in the prompt box to select it.',
      'Authentication options are OAuth, No authentication, and OAuth or no authentication.',
      'Tools without a readOnlyHint are treated as write actions, and write actions ask for confirmation by default.',
      'The ChatGPT desktop app is a Codex host: it reads the Codex configuration instead.',
    ],
    build(c) {
      if (!c.http) return [];
      return [
        steps('Steps', [
          'Go to ChatGPT Plugins (chatgpt.com/plugins).',
          'Select the plus button, then Add custom MCP server.',
          `Name: ${c.name}`,
          `Under Connection, Server URL: ${c.url}`,
          'Choose the authentication the server uses (No authentication for an open server).',
          'Review the risk warning and select "I understand and want to continue".',
          'Select Create as a plugin, then install the plugin.',
        ]),
      ];
    },
    warn(c) {
      if (!c.http) return ['ChatGPT on the web connects to a server URL (or a tunnel). It has no setting for a local command.'];
      return [
        ...(c.hasHeaders ? ['Custom request headers are not documented for ChatGPT, so the headers you entered are left out.'] : []),
        ...noTimeoutField(c, 'ChatGPT'),
      ];
    },
  }),

  client({
    id: 'codex',
    name: 'Codex',
    covers: 'Codex CLI, Codex IDE extension, ChatGPT desktop app',
    docUrl: 'https://learn.chatgpt.com/docs/extend/mcp?surface=cli',
    docTitle: 'Codex: Model Context Protocol',
    timeout: {
      seconds: 60,
      summary: '60 seconds to run a tool (tool_timeout_sec), 10 seconds for the server to start (startup_timeout_sec).',
      setting: 'tool_timeout_sec in the server table, in seconds',
      sourceUrl: 'https://learn.chatgpt.com/docs/extend/mcp?surface=cli',
    },
    notes: [
      'The ChatGPT desktop app, Codex CLI and the IDE extension share this configuration.',
      'A project .codex/config.toml is read in trusted projects only.',
      'codex mcp add has no header flag. Headers go in config.toml: http_headers for fixed values, env_http_headers to read a value from an environment variable, bearer_token_env_var for a bearer token.',
      'IDE extension: gear menu > MCP servers > Add server, choose STDIO or Streamable HTTP, save, then Restart extension.',
    ],
    verify: 'Run codex mcp list to see configured servers, or type /mcp in the Codex TUI to see the active ones.',
    build(c) {
      const out: OutputBlock[] = [];
      const timeoutNote = c.timeout ? 'The command has no timeout flag. Add tool_timeout_sec to the table it writes.' : undefined;
      const lines = [`[mcp_servers.${tomlKey(c.name)}]`];
      if (c.http) {
        if (!c.hasHeaders) out.push(command('Command', ['codex', 'mcp', 'add', sh(c.name), '--url', sh(c.url)], timeoutNote));
        lines.push(`url = ${tomlString(c.url)}`);
        if (c.hasHeaders) lines.push(`http_headers = { ${c.headers.map(([k, v]) => `${tomlString(k)} = ${tomlString(v)}`).join(', ')} }`);
        if (c.timeout) lines.push(`tool_timeout_sec = ${c.timeout}`);
      } else {
        out.push(command('Command', ['codex', 'mcp', 'add', sh(c.name), ...envFlags(c), '--', ...launch(c)], timeoutNote));
        lines.push(`command = ${tomlString(c.command)}`);
        if (c.args.length) lines.push(`args = [${c.args.map(tomlString).join(', ')}]`);
        if (c.timeout) lines.push(`tool_timeout_sec = ${c.timeout}`);
        if (c.hasEnv) {
          lines.push('', `[mcp_servers.${tomlKey(c.name)}.env]`);
          for (const [k, v] of c.env) lines.push(`${tomlKey(k)} = ${tomlString(v)}`);
        }
      }
      out.push(
        file('Config file', 'toml', lines.join('\n'), [
          { scope: 'user', path: '~/.codex/config.toml' },
          { scope: 'project', path: '.codex/config.toml' },
        ]),
      );
      return out;
    },
    warn(c) {
      return c.http && c.hasHeaders ? ['codex mcp add has no header flag, so with headers only the config.toml table is shown.'] : [];
    },
  }),

  client({
    id: 'cursor',
    name: 'Cursor',
    covers: 'Cursor editor and Cursor CLI',
    docUrl: 'https://cursor.com/docs/mcp',
    docTitle: 'Cursor: Model Context Protocol (MCP)',
    moreDocs: [{ title: 'Cursor: MCP install links', url: 'https://cursor.com/docs/mcp/install-links' }],
    timeout: { seconds: null, summary: 'Not documented.' },
    notes: [
      '.cursor/mcp.json applies to one project; ~/.cursor/mcp.json applies to every project you open in the editor or the CLI.',
      'Hosted Cloud Agents do not read ~/.cursor/mcp.json.',
      'Values can use ${env:NAME} in command, args, env, url and headers.',
      'Cursor asks for approval before using an MCP tool by default.',
    ],
    verify: 'Enable or disable the server from Customize in the sidebar. Connection errors appear under "MCP Logs" in the Output panel.',
    build(c) {
      const entry = c.http ? remoteEntry(c, { url: c.url }) : localEntry(c, { type: 'stdio' });
      return [
        file('Config file', 'json', serversJson(c.name, entry), [
          { scope: 'project', path: '.cursor/mcp.json' },
          { scope: 'user', path: '~/.cursor/mcp.json' },
        ]),
        link(
          'Install link',
          `cursor://anysphere.cursor-deeplink/mcp/install?name=${enc(c.name)}&config=${enc(base64Utf8(JSON.stringify(entry)))}`,
          linkNote(c),
        ),
      ];
    },
    warn: (c) => noTimeoutField(c, 'Cursor'),
  }),

  client({
    id: 'vscode',
    name: 'VS Code with GitHub Copilot',
    docUrl: 'https://code.visualstudio.com/docs/agents/reference/mcp-configuration',
    docTitle: 'VS Code: MCP configuration reference',
    moreDocs: [{ title: 'VS Code: Add and manage MCP servers', url: 'https://code.visualstudio.com/docs/agent-customization/mcp-servers' }],
    timeout: {
      seconds: null,
      summary: 'Not documented on the VS Code pages, which point to the Copilot CLI guidance for runtime options.',
    },
    notes: [
      'The current files are .mcp.json at the workspace root and ~/.copilot/mcp-config.json ($COPILOT_HOME/mcp-config.json when COPILOT_HOME is set), both with a top-level "mcpServers" key.',
      '.vscode/mcp.json and the profile mcp.json use the older "servers" key. The reference dated 11/18/2026 calls that the deprecated Local harness format and says the Local harness will be removed in February 2027.',
      'Guided setup offers the workspace-root .mcp.json only when the experimental setting chat.mcp.workspaceRootConfig.enabled is on. A file that already exists is read either way.',
      'Server names: the docs say to avoid whitespace and special characters and to use camelCase for multi-word names.',
      'MCP: Open User Configuration opens the editor-managed profile mcp.json, not the Copilot user file.',
    ],
    verify: 'Run Chat: Open Customizations and select MCP Servers to see and manage servers. MCP: List Servers opens the server controls.',
    build(c) {
      const portable = c.http ? remoteEntry(c, { type: 'http', url: c.url }, { tools: ['*'] }) : localEntry(c, { type: 'stdio' }, { tools: ['*'] });
      const legacy = c.http ? remoteEntry(c, { type: 'http', url: c.url }) : localEntry(c, { type: 'stdio' });
      return [
        file('Config file', 'json', serversJson(c.name, portable), [
          { scope: 'project', path: '.mcp.json' },
          { scope: 'user', path: '~/.copilot/mcp-config.json' },
        ]),
        file('Deprecated format', 'json', serversJson(c.name, legacy, 'servers'), [{ scope: 'project', path: '.vscode/mcp.json' }], {
          note: 'Only for a setup that still uses the Local harness, which VS Code says it will remove in February 2027.',
        }),
        link(
          'Install link',
          `vscode:mcp/install?${enc(JSON.stringify({ name: c.name, ...legacy }))}`,
          linkNote(c, 'It opens the server details editor for review. The docs do not say which file it writes to.'),
        ),
      ];
    },
    warn: (c) => noTimeoutField(c, 'VS Code'),
  }),

  client({
    id: 'copilot-cli',
    name: 'GitHub Copilot CLI',
    docUrl: 'https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers',
    docTitle: 'GitHub Docs: Adding MCP servers for GitHub Copilot CLI',
    moreDocs: [
      { title: 'GitHub Docs: Copilot CLI command reference', url: 'https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference' },
    ],
    timeout: {
      seconds: 30,
      summary:
        '30 seconds (30000 ms) for tool discovery and tool calls. A call that keeps sending progress notifications is cancelled at ten times the timeout.',
      setting: '--timeout <ms> on copilot mcp add, or "timeout" in the server entry, in milliseconds',
      sourceUrl: 'https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference',
    },
    notes: [
      'copilot mcp add writes to the user file ~/.copilot/mcp-config.json.',
      'Project files: .mcp.json in any directory from the working directory up to the repository root, and .github/mcp.json. If both sit in one directory, .mcp.json wins.',
      'Copilot CLI does not read .vscode/mcp.json.',
      'A local server uses "type": "local" in the file.',
    ],
    verify: 'Run copilot mcp list to list servers from every source. In a session, /mcp show NAME shows the status of a server and its tools.',
    build(c) {
      const timeoutFlag = c.timeout ? ['--timeout', String(c.timeout * 1000)] : [];
      const after: Record<string, unknown> = { tools: ['*'], ...(c.timeout ? { timeout: c.timeout * 1000 } : {}) };
      const cmd = c.http
        ? ['copilot', 'mcp', 'add', '--transport', 'http', ...headerFlags(c), ...timeoutFlag, sh(c.name), sh(c.url)]
        : ['copilot', 'mcp', 'add', ...timeoutFlag, sh(c.name), ...envFlags(c), '--', ...launch(c)];
      const entry = c.http ? remoteEntry(c, { type: 'http', url: c.url }, after) : localEntry(c, { type: 'local' }, after);
      return [
        command('Command', cmd),
        file('Config file', 'json', serversJson(c.name, entry), [
          { scope: 'user', path: '~/.copilot/mcp-config.json' },
          { scope: 'project', path: '.mcp.json' },
          { scope: 'project', path: '.github/mcp.json' },
        ]),
      ];
    },
  }),

  client({
    id: 'copilot-cloud-agent',
    name: 'GitHub Copilot cloud agent',
    formerName: 'Copilot coding agent',
    docUrl: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers',
    docTitle: 'GitHub Docs: Configure MCP servers for Copilot cloud agent',
    timeout: { seconds: null, summary: 'Not documented.' },
    notes: [
      'The configuration is per repository and is shared with Copilot code review.',
      '"tools" is required. GitHub recommends listing specific read-only tools in place of "*".',
      'Copilot uses the tools on its own and does not ask for approval first.',
      'Remote servers that use OAuth are not supported.',
      'Header and env values can reference secrets and variables whose names start with COPILOT_MCP_.',
    ],
    verify: 'Open the session logs (View session) and expand the Start MCP Servers step: the tools of each started server are listed at the bottom.',
    build(c) {
      const entry = c.http ? remoteEntry(c, { type: 'http', url: c.url }, { tools: ['*'] }) : localEntry(c, { type: 'local' }, { tools: ['*'] });
      return [
        file('MCP configuration', 'json', serversJson(c.name, entry), [], {
          where: 'Repository Settings > Copilot > MCP servers, then Save MCP configuration',
        }),
      ];
    },
    warn: (c) => noTimeoutField(c, 'Copilot cloud agent'),
  }),

  client({
    id: 'gemini-cli',
    name: 'Gemini CLI',
    docUrl: 'https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md',
    docTitle: 'Gemini CLI: MCP servers',
    timeout: {
      seconds: 600,
      summary: '600 seconds (600,000 ms) per request.',
      setting: '"timeout" in the server entry, in milliseconds',
      sourceUrl: 'https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md',
    },
    notes: [
      'In settings.json, "httpUrl" means Streamable HTTP and "url" means the older SSE transport.',
      'gemini mcp add writes to the project file .gemini/settings.json by default; --scope user writes to ~/.gemini/settings.json.',
      'settings.json holds other settings too: merge "mcpServers" into the file you have.',
      'The README now positions Gemini CLI for Gemini Code Assist Standard and Enterprise licences. Free and Google AI Pro / Ultra access moved to Antigravity CLI on June 18, 2026, and Antigravity does not accept "httpUrl".',
    ],
    verify: 'Run gemini mcp list: each server shows Connected or Disconnected. In a session, /mcp shows the status and the tools.',
    build(c) {
      const timeoutNote = c.timeout ? 'The --timeout flag of gemini mcp add is a connection timeout. Set "timeout" in settings.json for requests.' : undefined;
      const base = ['gemini', 'mcp', 'add'];
      let project: string[];
      let user: string[];
      let entry: Record<string, unknown>;
      if (c.http) {
        const rest = [...headerFlags(c), sh(c.name), sh(c.url)];
        project = [...base, '--transport', 'http', ...rest];
        user = [...base, '--transport', 'http', '--scope', 'user', ...rest];
        entry = remoteEntry(c, { httpUrl: c.url });
      } else {
        // Flags meant for the server go after "--", as in the documented example
        // `gemini mcp add python-server python server.py -- --server-arg my-value`.
        const firstFlag = c.args.findIndex((a) => a.startsWith('-'));
        const args = firstFlag === -1 ? c.args.map(sh) : [...c.args.slice(0, firstFlag).map(sh), '--', ...c.args.slice(firstFlag).map(sh)];
        const rest = [...envFlags(c, '-e'), sh(c.name), sh(c.command), ...args];
        project = [...base, ...rest];
        user = [...base, '--scope', 'user', ...rest];
        entry = localEntry(c);
      }
      if (c.timeout) entry.timeout = c.timeout * 1000;
      return [
        command('Command (this project)', project, timeoutNote),
        command('Command (all your projects)', user, timeoutNote),
        file('Settings file', 'json', serversJson(c.name, entry), [
          { scope: 'project', path: '.gemini/settings.json' },
          { scope: 'user', path: '~/.gemini/settings.json' },
        ]),
      ];
    },
  }),

  client({
    id: 'antigravity',
    name: 'Google Antigravity',
    covers: 'Antigravity App, IDE and CLI',
    docUrl: 'https://antigravity.google/docs/mcp',
    docTitle: 'Antigravity: MCP',
    timeout: {
      seconds: 180,
      summary: '180 seconds per tool call, and 300 seconds to connect and list tools.',
      setting: '"timeoutSeconds" in the server entry replaces both limits; a negative value turns both off',
      sourceUrl: 'https://antigravity.google/docs/mcp',
    },
    notes: [
      'A remote server must use Streamable HTTP. Put the endpoint in "serverUrl" ("url" also works); "httpUrl" and the older SSE transport are not supported.',
      'The global file applies to all your projects, the workspace file to one workspace.',
      'In the IDE: agent side panel "…" > MCP Servers > Manage MCP Servers > View raw config.',
    ],
    verify: 'In Antigravity CLI, type /mcp to open the MCP manager, which shows a live status for each server. In the app, see the MCP Servers section of the Customizations page.',
    build(c) {
      const entry = c.http ? remoteEntry(c, { serverUrl: c.url }) : localEntry(c);
      if (c.timeout) entry.timeoutSeconds = c.timeout;
      return [
        file('Config file', 'json', serversJson(c.name, entry), [
          { scope: 'project', path: '.agents/mcp_config.json' },
          { scope: 'user', path: '~/.gemini/config/mcp_config.json' },
        ]),
      ];
    },
  }),

  client({
    id: 'devin',
    name: 'Devin Desktop',
    formerName: 'Windsurf',
    covers: 'Devin Local agent, Devin CLI',
    docUrl: 'https://docs.devin.ai/cli/extensibility/mcp/configuration',
    docTitle: 'Devin: MCP configuration',
    moreDocs: [{ title: 'Devin Desktop FAQ (the rename)', url: 'https://docs.devin.ai/desktop/devin-desktop-faq' }],
    timeout: { seconds: null, summary: 'Not documented.' },
    notes: [
      'Windsurf became Devin Desktop on June 2, 2026, and docs.windsurf.com now redirects to docs.devin.ai.',
      'devin mcp add saves to local scope by default (.devin/mcp_config.local.json, gitignored). -s project writes the shared .devin/mcp_config.json and -s user writes the user file.',
      'A remote server uses Streamable HTTP by default and falls back to SSE on the same URL when the server answers with an HTTP 4xx error.',
      'On Windows the user file is %APPDATA%\\devin\\mcp_config.json.',
      'Cascade (legacy) and the Windsurf JetBrains plugin read ~/.config/devin/mcp_config.json and take the endpoint as "serverUrl" or "url".',
      'By default the agent asks for approval before it calls an MCP tool.',
    ],
    verify: 'Run devin mcp list to list configured servers, or devin mcp get <name> for one.',
    build(c) {
      const out: OutputBlock[] = [];
      if (c.http && !c.hasHeaders) {
        out.push(command('Command (local scope, only you)', ['devin', 'mcp', 'add', sh(c.name), sh(c.url)]));
        out.push(command('Command (project, shared)', ['devin', 'mcp', 'add', '-s', 'project', sh(c.name), sh(c.url)]));
      }
      if (!c.http && !c.hasEnv) {
        out.push(command('Command (local scope, only you)', ['devin', 'mcp', 'add', sh(c.name), '--', ...launch(c)]));
        out.push(command('Command (project, shared)', ['devin', 'mcp', 'add', '-s', 'project', sh(c.name), '--', ...launch(c)]));
      }
      const entry = c.http ? remoteEntry(c, { url: c.url, transport: 'http' }) : localEntry(c);
      out.push(
        file('Config file', 'json', serversJson(c.name, entry), [
          { scope: 'project', path: '.devin/mcp_config.json' },
          { scope: 'local', path: '.devin/mcp_config.local.json' },
          { scope: 'user', path: '~/.config/devin/mcp_config.json' },
        ]),
      );
      return out;
    },
    warn(c) {
      return [
        ...(c.http && c.hasHeaders ? ['The Devin docs show no header flag for devin mcp add, so with headers only the file is shown.'] : []),
        ...(!c.http && c.hasEnv ? ['The Devin docs show no env flag for devin mcp add, so with variables only the file is shown.'] : []),
        ...noTimeoutField(c, 'Devin'),
      ];
    },
  }),

  client({
    id: 'zed',
    name: 'Zed',
    docUrl: 'https://github.com/zed-industries/zed/blob/main/docs/src/ai/mcp.md',
    docTitle: 'Zed: Model Context Protocol',
    moreDocs: [{ title: 'Zed: all settings', url: 'https://github.com/zed-industries/zed/blob/main/docs/src/reference/all-settings.md' }],
    timeout: {
      seconds: 60,
      summary: '60 seconds for MCP requests, tool calls included (context_server_timeout). Timeouts are capped at 600 seconds.',
      setting: '"timeout" in the server entry, in seconds, or context_server_timeout for all servers',
      sourceUrl: 'https://github.com/zed-industries/zed/blob/main/docs/src/reference/all-settings.md',
    },
    notes: [
      'The top-level key is "context_servers", not "mcpServers".',
      'Settings > AI > MCP Servers > Add Server, then Add Remote Server or Add Local Server, writes the same entry.',
      'The docs do not name the transport used for a "url" server, and do not say whether a project .zed/settings.json may hold context_servers.',
      'Zed supports MCP tools and prompts.',
    ],
    verify: 'Open Settings > AI > MCP Servers: the dot next to a running server is green and its tooltip says "Server is active".',
    build(c) {
      // The documented local example always carries "env", empty when there is none.
      const entry: Record<string, unknown> = c.http ? remoteEntry(c, { url: c.url }) : { command: c.command, args: c.args, env: record(c.env) };
      if (c.timeout) entry.timeout = Math.min(c.timeout, 600);
      return [file('Settings file', 'json', serversJson(c.name, entry, 'context_servers'), [], { where: 'Zed settings.json' })];
    },
    warn: (c) => (c.timeout && c.timeout > 600 ? ['Zed caps timeouts at 600 seconds, so 600 is written.'] : []),
  }),

  client({
    id: 'cline',
    name: 'Cline',
    covers: 'Cline for VS Code, Cline Desktop, Cline CLI',
    docUrl: 'https://docs.cline.bot/mcp/mcp-overview',
    docTitle: 'Cline: MCP overview',
    timeout: {
      seconds: 60,
      headline: '60 s (from the source code)',
      summary: '60 seconds by default, settable from 1 to 3600 seconds. The number is in the repository source; the docs only say "Set request timeouts".',
      sourceUrl: 'https://github.com/cline/cline/blob/main/sdk/packages/shared/src/mcp.ts',
    },
    notes: [
      'Set "type": "streamableHttp" for a remote server. Without "type", Cline uses the older SSE transport.',
      'Cline CLI reads ~/.cline/data/settings/cline_mcp_settings.json (CLINE_MCP_SETTINGS_PATH overrides the path).',
      'In the IDE extension: MCP Servers icon > Configure tab > Configure MCP Servers opens the JSON the extension uses.',
      'Without --yes, cline mcp add opens the add wizard with the fields filled in.',
      'A project-level file is not documented.',
    ],
    build(c) {
      const out: OutputBlock[] = [];
      const after = { disabled: false, autoApprove: [] };
      if (c.http) out.push(command('Command', ['cline', 'mcp', 'add', sh(c.name), sh(c.url), '--transport', 'http', ...headerFlags(c), '--yes']));
      else if (!c.hasEnv) out.push(command('Command', ['cline', 'mcp', 'add', sh(c.name), '--yes', '--', ...launch(c)]));
      const entry = c.http ? remoteEntry(c, { type: 'streamableHttp', url: c.url }, after) : localEntry(c, {}, after);
      out.push(file('Settings file', 'json', serversJson(c.name, entry), [{ scope: 'user', path: '~/.cline/data/settings/cline_mcp_settings.json' }]));
      return out;
    },
    warn(c) {
      return [
        ...(!c.http && c.hasEnv ? ['The Cline docs show no env flag for cline mcp add, so with variables only the file is shown.'] : []),
        ...(c.timeout ? [`The Cline docs list "Set request timeouts" among the ways to manage a server but do not name the field, so the ${c.timeout} second timeout is left out.`] : []),
      ];
    },
  }),

  client({
    id: 'continue',
    name: 'Continue',
    docUrl: 'https://docs.continue.dev/customize/deep-dives/mcp',
    docTitle: 'Continue: MCP',
    moreDocs: [{ title: 'Continue: config.yaml reference', url: 'https://docs.continue.dev/reference' }],
    timeout: {
      seconds: null,
      summary: 'Not documented for tool calls. Only connectionTimeout, for the first connection, is described.',
    },
    notes: [
      'MCP can only be used in agent mode.',
      'Each file in .continue/mcpServers/ at the top of the workspace is one block with name, version and schema. Servers can also sit under mcpServers in config.yaml.',
      'JSON config files from Claude Desktop, Cursor or Cline can be copied into .continue/mcpServers/ as they are.',
      'Headers go under requestOptions, in the same format as the requestOptions of a model.',
    ],
    build(c) {
      const lines = [`name: ${yamlScalar(c.name)}`, 'version: 0.0.1', 'schema: v1', 'mcpServers:', `  - name: ${yamlScalar(c.name)}`];
      if (c.http) {
        lines.push('    type: streamable-http', `    url: ${yamlScalar(c.url)}`);
        if (c.hasHeaders) {
          lines.push('    requestOptions:', '      headers:');
          for (const [k, v] of c.headers) lines.push(`        ${yamlScalar(k)}: ${yamlScalar(v)}`);
        }
      } else {
        lines.push('    type: stdio', `    command: ${yamlScalar(c.command)}`);
        if (c.args.length) {
          lines.push('    args:');
          for (const a of c.args) lines.push(`      - ${yamlScalar(a)}`);
        }
        if (c.hasEnv) {
          lines.push('    env:');
          for (const [k, v] of c.env) lines.push(`      ${yamlScalar(k)}: ${yamlScalar(v)}`);
        }
      }
      return [file('Block file', 'yaml', lines.join('\n'), [{ scope: 'project', path: `.continue/mcpServers/${fileSlug(c.name)}.yaml` }])];
    },
    warn: (c) => noTimeoutField(c, 'Continue'),
  }),

  client({
    id: 'opencode',
    name: 'OpenCode',
    docUrl: 'https://opencode.ai/docs/mcp-servers',
    docTitle: 'OpenCode: MCP servers',
    timeout: {
      seconds: 43200,
      summary: '12 hours for tool calls (execution). Startup and listing tools each get 30 seconds.',
      setting: 'Per-server "timeout" overrides',
      sourceUrl: 'https://opencode.ai/docs/mcp-servers',
    },
    notes: [
      'Servers go under mcp.servers. The docs say: "V2 does not place server names directly under mcp".',
      'opencode mcp add writes to the project configuration; --global makes the server available in every project.',
      'Remote servers use OAuth by default. The docs say to set "oauth": false only when the server uses an API key or another header credential and nothing else.',
      'A local server lists the executable and its arguments in one "command" array and its variables under "environment".',
      'The --header flag takes NAME=VALUE.',
    ],
    verify: 'Run opencode mcp list. In a session, /mcps lets you view, connect, disconnect or authenticate servers.',
    build(c) {
      let project: string[];
      let entry: Record<string, unknown>;
      if (c.http) {
        project = ['opencode', 'mcp', 'add', sh(c.name), '--url', sh(c.url), ...c.headers.flatMap(([k, v]) => ['--header', sh(`${k}=${v}`)])];
        entry = remoteEntry(c, { type: 'remote', url: c.url });
      } else {
        project = ['opencode', 'mcp', 'add', sh(c.name), ...envFlags(c), '--', ...launch(c)];
        entry = { type: 'local', command: [c.command, ...c.args], ...(c.hasEnv ? { environment: record(c.env) } : {}) };
      }
      const global = [...project.slice(0, 4), '--global', ...project.slice(4)];
      return [
        command('Command (this project)', project),
        command('Command (every project)', global),
        file('Config file', 'json', json({ $schema: 'https://opencode.ai/config.json', mcp: { servers: { [c.name]: entry } } }), [
          { scope: 'project', path: 'opencode.json' },
          { scope: 'user', path: '~/.config/opencode/opencode.json' },
        ]),
      ];
    },
    warn(c) {
      return c.timeout ? [`The shape of OpenCode's per-server "timeout" overrides was not checked, so the ${c.timeout} second timeout is left out. The default for tool calls is 12 hours.`] : [];
    },
  }),

  client({
    id: 'goose',
    name: 'Goose',
    docUrl: 'https://github.com/aaif-goose/goose/blob/main/documentation/docs/getting-started/using-extensions.md',
    docTitle: 'Goose: Using extensions',
    timeout: {
      seconds: 300,
      headline: '300 s in every example',
      summary: 'Set per extension in seconds. Every documented example uses 300; no default is stated.',
      setting: '"timeout" in the extension entry, in seconds',
      sourceUrl: 'https://github.com/aaif-goose/goose/blob/main/documentation/docs/getting-started/using-extensions.md',
    },
    notes: [
      'Goose calls MCP servers extensions. The entry goes under "extensions:" in ~/.config/goose/config.yaml.',
      'goose configure > Add Extension > Remote Extension (Streamable HTTP) writes the same entry.',
      'A project-level config file is not documented.',
      'The repository moved from block/goose to aaif-goose/goose.',
    ],
    build(c) {
      const timeout = c.timeout ?? 300;
      const flowMap = (p: Pairs) => (p.length ? `{ ${p.map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(', ')} }` : '{}');
      const id = fileSlug(c.name);
      const describe = `&id=${enc(id)}&name=${enc(c.name)}&description=${enc(`${c.name} MCP server`)}`;
      const out: OutputBlock[] = [];
      const lines = ['extensions:', `  ${yamlScalar(c.name)}:`];
      if (c.http) {
        lines.push(
          '    type: streamable_http',
          `    name: ${yamlScalar(c.name)}`,
          '    enabled: true',
          `    uri: ${JSON.stringify(c.url)}`,
          `    headers: ${flowMap(c.headers)}`,
          `    timeout: ${timeout}`,
        );
      } else {
        lines.push(
          `    name: ${yamlScalar(c.name)}`,
          `    cmd: ${yamlScalar(c.command)}`,
          `    args: [${c.args.map((a) => JSON.stringify(a)).join(', ')}]`,
          '    enabled: true',
          `    envs: ${flowMap(c.env)}`,
          '    type: stdio',
          `    timeout: ${timeout}`,
        );
      }
      out.push(file('Config file', 'yaml', lines.join('\n'), [{ scope: 'user', path: '~/.config/goose/config.yaml' }]));
      if (c.http && !c.hasHeaders) {
        out.push(link('Install link', `goose://extension?url=${enc(c.url)}&type=streamable_http${describe}`));
        out.push(command('Command (one session only)', ['goose', 'session', '--with-streamable-http-extension', sh(c.url)]));
      }
      if (!c.http && !c.hasEnv) {
        out.push(link('Install link', `goose://extension?cmd=${enc(c.command)}${c.args.map((a) => `&arg=${enc(a)}`).join('')}${describe}`));
      }
      return out;
    },
    warn(c) {
      return [
        ...(c.http && c.hasHeaders ? ['The documented Goose install link and session flag carry no headers, so with headers only the config entry is shown.'] : []),
        ...(!c.http && c.hasEnv ? ['The documented Goose install link carries no variables, so with variables only the config entry is shown.'] : []),
      ];
    },
  }),

  client({
    id: 'jetbrains-ai-assistant',
    name: 'JetBrains AI Assistant',
    docUrl: 'https://www.jetbrains.com/help/ai-assistant/mcp.html',
    docTitle: 'JetBrains AI Assistant: Model Context Protocol (MCP)',
    timeout: { seconds: null, summary: 'Not documented.' },
    notes: [
      'The JSON is pasted into a dialog, and the Server level field decides whether the server is global or for the current project.',
      'The "url" should point to the endpoint that implements Streamable HTTP. SSE is supported for older servers.',
      'Headers and environment variables are not documented on the AI Assistant pages.',
    ],
    verify: 'On the same settings page, the Status column shows the connection. Click the icon in that column to list the tools.',
    build(c) {
      const entry = c.http ? { url: c.url } : { command: c.command, args: c.args };
      return [
        file('JSON configuration', 'json', serversJson(c.name, entry), [], {
          where: 'Settings | Tools | AI Assistant | Model Context Protocol (MCP) > Add, then OK and Apply',
        }),
      ];
    },
    warn(c) {
      return [
        ...(c.hasHeaders ? ['JetBrains documents no headers field for AI Assistant, so the headers you entered are left out.'] : []),
        ...(c.hasEnv ? ['JetBrains documents no env field for AI Assistant, so the variables you entered are left out.'] : []),
        ...noTimeoutField(c, 'JetBrains AI Assistant'),
      ];
    },
  }),

  client({
    id: 'junie',
    name: 'JetBrains Junie',
    covers: 'Junie CLI and Junie in JetBrains IDEs',
    docUrl: 'https://junie.jetbrains.com/docs/junie-cli-mcp-configuration.html',
    docTitle: 'Junie CLI: MCP configuration',
    timeout: {
      seconds: 60,
      summary: '60 seconds for every request to the server: the startup handshake, listing tools and each tool call.',
      setting: '"timeout" in the server entry, in milliseconds, from 1000 to 3600000',
      sourceUrl: 'https://junie.jetbrains.com/docs/junie-cli-mcp-configuration.html',
    },
    notes: [
      'Junie CLI and Junie in JetBrains IDEs use the same MCP JSON.',
      '"timeout" is in milliseconds. A value outside 1000 to 3600000, such as "timeout": 60, is rejected and the 60 second default applies.',
      'A project-scoped server can show Approval required until you approve its command or URL.',
    ],
    verify: 'Type /mcp to list servers with a status: Starting, Active, Inactive, Disabled, Failed, Authorization required or Approval required.',
    build(c) {
      const entry = c.http ? remoteEntry(c, { url: c.url }) : localEntry(c);
      if (c.timeout) entry.timeout = Math.min(c.timeout, 3600) * 1000;
      return [
        file('Config file', 'json', serversJson(c.name, entry), [
          { scope: 'project', path: '.junie/mcp/mcp.json' },
          { scope: 'user', path: '~/.junie/mcp/mcp.json' },
        ]),
      ];
    },
    warn: (c) => (c.timeout && c.timeout > 3600 ? ['Junie accepts at most 3600000 ms (1 hour), so that is written.'] : []),
  }),

  client({
    id: 'kiro',
    name: 'Kiro',
    formerName: 'Amazon Q Developer CLI (now Kiro CLI)',
    covers: 'Kiro IDE, Kiro CLI, Kiro Web',
    docUrl: 'https://kiro.dev/docs/mcp/configuration',
    docTitle: 'Kiro: MCP configuration',
    moreDocs: [
      { title: 'Kiro: migrating from Amazon Q Developer CLI', url: 'https://kiro.dev/docs/upgrade-guides/migrating-from-q' },
      { title: 'Kiro: agent configuration reference', url: 'https://kiro.dev/docs/custom-agents/configuration-reference' },
    ],
    timeout: {
      seconds: 120,
      headline: '120 s (Kiro CLI)',
      summary: 'Kiro CLI: 120 seconds per call (requestTimeout, 120000 ms). The connection handshake gets 60 seconds (timeout, 60000 ms).',
      setting: 'requestTimeout in the agent configuration, in milliseconds',
      sourceUrl: 'https://kiro.dev/docs/custom-agents/configuration-reference',
    },
    notes: [
      'If both files exist they are merged, and the workspace file wins.',
      'Kiro IDE and Kiro CLI read the same user file, ~/.kiro/settings/mcp.json.',
      'A remote "url" must be HTTPS, or HTTP for localhost.',
      'Kiro CLI is the successor of Amazon Q Developer CLI (available since November 17, 2025). It still reads .amazonq/mcp.json and copies ~/.aws/amazonq/mcp.json to ~/.kiro/settings/mcp.json.',
    ],
    verify: 'In the IDE, open the MCP Servers view in the Kiro panel. In Kiro CLI, /mcp reports a server that did not start.',
    build(c) {
      const entry = c.http ? remoteEntry(c, { url: c.url }) : localEntry(c);
      return [
        file('Config file', 'json', serversJson(c.name, entry), [
          { scope: 'project', path: '.kiro/settings/mcp.json' },
          { scope: 'user', path: '~/.kiro/settings/mcp.json' },
        ]),
        link('Install link', `https://kiro.dev/launch/mcp/add?name=${enc(c.name)}&config=${enc(JSON.stringify(entry))}`, linkNote(c)),
      ];
    },
    warn(c) {
      return c.timeout ? [`Kiro documents requestTimeout in the agent configuration, not in mcp.json, so the ${c.timeout} second timeout is left out.`] : [];
    },
  }),

  client({
    id: 'lm-studio',
    name: 'LM Studio',
    docUrl: 'https://lmstudio.ai/docs/app/mcp',
    docTitle: 'LM Studio: Use MCP servers',
    moreDocs: [{ title: 'LM Studio: Add to LM Studio button', url: 'https://lmstudio.ai/docs/app/mcp/deeplink' }],
    timeout: { seconds: null, summary: 'Not documented.' },
    notes: [
      'LM Studio follows the mcp.json notation of Cursor. Its own page shows a remote example only.',
      'There is one mcp.json for the app and no project scope. The docs do not give its path on disk.',
      'Local and remote MCP servers need LM Studio 0.3.17 (b10) or later.',
      'The docs do not name the transport used for a "url" server.',
    ],
    build(c) {
      const entry = c.http ? remoteEntry(c, { url: c.url }) : localEntry(c);
      return [
        file('mcp.json', 'json', serversJson(c.name, entry), [], { where: 'Program tab in the right sidebar > Install > Edit mcp.json' }),
        link('Install link', `lmstudio://add_mcp?name=${enc(c.name)}&config=${enc(base64Utf8(JSON.stringify(entry)))}`, linkNote(c)),
      ];
    },
    warn: (c) => noTimeoutField(c, 'LM Studio'),
  }),

  client({
    id: 'warp',
    name: 'Warp',
    docUrl: 'https://docs.warp.dev/agents/capabilities/mcp/',
    docTitle: 'Warp: Model Context Protocol (MCP)',
    timeout: { seconds: null, summary: 'Not documented.' },
    notes: [
      'In the app: Settings > Agents > MCP servers > + Add, then paste the JSON. The docs say configurations from most MCP clients can be pasted as they are.',
      'Warp also reads the MCP files of Claude Code (~/.claude.json, .mcp.json) and Codex (~/.codex/config.toml, .codex/config.toml), and ~/.agents/.mcp.json and .agents/.mcp.json.',
      'A project-scoped server from any of those files needs explicit approval.',
      'For a local server, set "working_directory" when the command or its arguments use relative paths.',
    ],
    verify: 'Settings > Agents > MCP servers lists every server and shows which are running. View Logs opens the log of one server.',
    build(c) {
      const entry = c.http ? remoteEntry(c, { url: c.url }) : localEntry(c);
      return [
        file('Config file', 'json', serversJson(c.name, entry), [
          { scope: 'project', path: '.warp/.mcp.json' },
          { scope: 'user', path: '~/.warp/.mcp.json' },
        ]),
      ];
    },
    warn: (c) => noTimeoutField(c, 'Warp'),
  }),
];

/** Clients switched on when the page first loads. */
export const DEFAULT_CLIENT_IDS = ['claude-code', 'codex', 'cursor', 'vscode', 'gemini-cli'];

/** A product in the same family that is gone, kept so the page can say so. */
export const RETIRED_CLIENTS = [
  {
    name: 'Roo Code',
    note: 'The Roo Code extension was shut down on May 15, 2026 and its repository is archived, so it has no entry here.',
    docUrl: 'https://docs.roocode.com',
  },
];

export function getMcpClient(id: string): McpClient | undefined {
  return MCP_CLIENTS.find((c) => c.id === id);
}

/** "30 s", "12 h", or the client's own headline; "Not documented" when the vendor gives no number. */
export function timeoutLabel(t: ToolTimeout): string {
  if (t.headline) return t.headline;
  if (t.seconds === null) return 'Not documented';
  return t.seconds >= 3600 && t.seconds % 3600 === 0 ? `${t.seconds / 3600} h` : `${t.seconds} s`;
}

export const SCOPE_LABEL: Record<Scope, string> = {
  project: 'project',
  user: 'all your projects',
  local: 'this project, only you',
};

// ---------------------------------------------------------------------------
// Link state: what the page keeps after "#" in its address, so that a link reproduces the
// form. Header and variable VALUES are not part of it. They are often credentials, and an
// address ends up in browser history and wherever the link is pasted. Only names travel.

export interface LinkState {
  name: string;
  transport: 'http' | 'stdio';
  url: string;
  command: string;
  /** The argument line as typed (split with splitArgs). */
  args: string;
  headerNames: string[];
  envNames: string[];
  /** Seconds as digits, or '' for none. */
  timeout: string;
  /** Selected client ids, in the order of MCP_CLIENTS. */
  clients: string[];
}

export const DEFAULT_LINK_STATE: LinkState = {
  name: DEFAULT_INPUT.name,
  transport: 'http',
  url: DEFAULT_INPUT.url ?? '',
  command: '',
  args: '',
  headerNames: [],
  envNames: [],
  timeout: '',
  clients: DEFAULT_CLIENT_IDS,
};

const LINK_KEYS = ['name', 'url', 'cmd', 'args', 'h', 'e', 't', 'c'];
const cleanNames = (names: string[]): string[] => names.map((n) => n.trim()).filter(Boolean);
const cleanTimeout = (text: string): string => text.replace(/[^0-9]/g, '').slice(0, 6);
const knownClients = (ids: string[]): string[] => MCP_CLIENTS.map((c) => c.id).filter((id) => ids.includes(id));

function linkParams(s: LinkState): string {
  const p = new URLSearchParams();
  p.set('name', s.name);
  if (s.transport === 'http') {
    p.set('url', s.url);
    for (const h of cleanNames(s.headerNames)) p.append('h', h);
  } else {
    p.set('cmd', s.command);
    if (s.args.trim()) p.set('args', s.args);
    for (const e of cleanNames(s.envNames)) p.append('e', e);
  }
  if (cleanTimeout(s.timeout)) p.set('t', cleanTimeout(s.timeout));
  p.set('c', knownClients(s.clients).join(' '));
  return p.toString();
}

/** The text to put after "#" for a state; empty for the default example. */
export function encodeLinkState(s: LinkState): string {
  const encoded = linkParams(s);
  return encoded === linkParams(DEFAULT_LINK_STATE) ? '' : encoded;
}

/**
 * Reads a state back from the text after "#". Returns null when none of the keys is there
 * (an empty hash, or one that belongs to something else), which means the default example.
 * A link written by hand needs only `name` and `url` (or `cmd`): `c` falls back to the
 * default clients, and unknown client ids are dropped.
 */
export function decodeLinkState(hash: string): LinkState | null {
  const p = new URLSearchParams(hash.replace(/^#/, ''));
  if (!LINK_KEYS.some((k) => p.has(k))) return null;
  const local = p.has('cmd') && !p.has('url');
  const chosen = p.get('c');
  return {
    name: p.get('name') ?? '',
    transport: local ? 'stdio' : 'http',
    url: local ? '' : (p.get('url') ?? ''),
    command: local ? (p.get('cmd') ?? '') : '',
    args: local ? (p.get('args') ?? '') : '',
    headerNames: local ? [] : cleanNames(p.getAll('h')),
    envNames: local ? cleanNames(p.getAll('e')) : [],
    timeout: cleanTimeout(p.get('t') ?? ''),
    clients: chosen === null ? DEFAULT_CLIENT_IDS : knownClients(chosen.split(/[\s,]+/)),
  };
}

