#!/usr/bin/env node
// docs-md: share markdown at a docs-md.com link. No dependencies, Node 18+.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, join } from 'node:path';

const BASE = process.env.DOCS_MD_URL || 'https://docs-md.com';
const TOKENS_FILE = join(process.env.XDG_CONFIG_HOME || join(homedir(), '.config'), 'docs-md', 'tokens.json');
const VERSION = '1.0.0';

const HELP = `docs-md ${VERSION} — share markdown at a docs-md.com link (no account)

Usage
  docs-md share <file|->  [--expiry 1d|7d|30d|never] [--name NAME.md] [--json]
  docs-md read <id|url>                 print the markdown of a share
  docs-md update <id|url> <file|-> [--token TOKEN]
  docs-md delete <id|url> [--token TOKEN]
  docs-md list                          shares created from this machine

  docs-md <file>  is short for  docs-md share <file>

Edit tokens are saved to ${TOKENS_FILE} so update and delete work without --token.
Docs: https://docs-md.com/agents`;

function parseArgs(argv) {
  const args = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json' || a === '-h' || a === '--help' || a === '-v' || a === '--version') flags[a.replace(/^-+/, '')] = true;
    else if (a.startsWith('--')) flags[a.slice(2)] = argv[++i];
    else args.push(a);
  }
  return { args, flags };
}

function fail(message) {
  console.error(`docs-md: ${message}`);
  process.exit(1);
}

function readInput(path) {
  if (!path) fail('give a file name, or - to read from stdin');
  try {
    return readFileSync(path === '-' ? 0 : path, 'utf8');
  } catch (e) {
    fail(`cannot read ${path}: ${e.code || e.message}`);
  }
}

function shareId(value) {
  const m = /([a-z]+-[a-z]+-[A-Za-z0-9]{5})(?:\.md)?\/?(?:[?#].*)?$/.exec(String(value || '').trim());
  if (!m) fail(`not a docs-md share id or URL: ${value}`);
  return m[1];
}

function loadTokens() {
  try {
    return JSON.parse(readFileSync(TOKENS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveToken(id, entry) {
  const tokens = loadTokens();
  if (entry) tokens[id] = entry;
  else delete tokens[id];
  const dir = join(TOKENS_FILE, '..');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true, mode: 0o700 });
  writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2), { mode: 0o600 });
}

async function request(path, init) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { 'user-agent': `docs-md-cli/${VERSION}`, ...(init && init.headers) },
    });
  } catch (e) {
    fail(`network error: ${e.cause?.code || e.message}`);
  }
  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    /* plain text */
  }
  if (!res.ok) fail(data?.error || text.trim() || `HTTP ${res.status}`);
  return data ?? text;
}

async function share(args, flags) {
  const file = args[0];
  const content = readInput(file);
  const filename = flags.name || (file && file !== '-' ? basename(file) : undefined);
  const data = await request('/api/share', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ content, filename, expiry: flags.expiry || '30d', client: 'cli' }),
  });
  saveToken(data.id, { token: data.editToken, url: data.url, filename: filename || 'untitled.md', expiresAt: data.expiresAt });
  if (flags.json) return console.log(JSON.stringify(data, null, 2));
  console.log(data.url);
  const expires = data.expiresAt === 0 ? 'never' : new Date(data.expiresAt).toISOString().slice(0, 10);
  console.error(`raw: ${data.rawUrl}\nexpires: ${expires}\nedit token saved to ${TOKENS_FILE}`);
}

async function read(args) {
  process.stdout.write(await request(`/raw/${shareId(args[0])}`));
}

function tokenFor(id, flags) {
  const token = flags.token || loadTokens()[id]?.token;
  if (!token) fail(`no edit token for ${id}: pass --token`);
  return token;
}

async function update(args, flags) {
  const id = shareId(args[0]);
  const content = readInput(args[1]);
  const data = await request(`/api/share/${id}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json', 'x-edit-token': tokenFor(id, flags) },
    body: JSON.stringify({ content, ...(flags.name ? { filename: flags.name } : {}) }),
  });
  console.log(data.url);
}

async function remove(args, flags) {
  const id = shareId(args[0]);
  await request(`/api/share/${id}`, { method: 'DELETE', headers: { 'x-edit-token': tokenFor(id, flags) } });
  saveToken(id, null);
  console.log(`deleted ${id}`);
}

function list() {
  const tokens = loadTokens();
  const now = Date.now();
  const rows = Object.entries(tokens).filter(([, t]) => !t.expiresAt || t.expiresAt > now);
  if (!rows.length) return console.log('no shares yet');
  for (const [, t] of rows) {
    const expires = !t.expiresAt ? 'never' : new Date(t.expiresAt).toISOString().slice(0, 10);
    console.log(`${t.url}  ${expires}  ${t.filename}`);
  }
}

const { args, flags } = parseArgs(process.argv.slice(2));
if (flags.version || flags.v) {
  console.log(VERSION);
} else if (flags.help || flags.h || !args.length) {
  console.log(HELP);
} else {
  const [command, ...rest] = args;
  const commands = { share, read, update, delete: remove, rm: remove, list, ls: list };
  const run = commands[command] ?? (() => share(args, flags));
  await run(commands[command] ? rest : args, flags);
}
