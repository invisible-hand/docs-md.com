// Pure markdown builder for the HANDOFF.md generator. No DOM, no React:
// the component feeds it form state, scripts/test-handoff.ts exercises it.

export interface KeyFile {
  path: string;
  note: string;
}

export interface HandoffFields {
  project: string;
  repo: string;
  branch: string;
  goal: string;
  /** One item per line. */
  done: string;
  inProgress: string;
  blocked: string;
  /** Shell commands, one per line. */
  runCommands: string;
  testCommands: string;
  keyFiles: KeyFile[];
  /** One per line, "decision — why" (— or | or : separates the reason). */
  decisions: string;
  openQuestions: string;
  /** One per line; rendered as an ordered list in the order given. */
  nextSteps: string;
  constraints: string;
  /** One per line, "Role: name". */
  owners: string;
  /** One per line, "Label: https://…" or a bare URL. */
  links: string;
  // Options
  agentPreamble: boolean;
  contextBudget: string;
  doNotTouch: string;
  verifyCommands: string;
  statusTable: boolean;
  timestamps: boolean;
}

export interface BuildOptions {
  /** Injected for deterministic output; defaults to the current time. */
  now?: Date;
}

export const SAMPLE_FIELDS: HandoffFields = {
  project: 'Invoice export service',
  repo: 'acme/billing-api',
  branch: 'feat/csv-export',
  goal: 'Customers can download a CSV of all invoices for a date range from the billing dashboard.',
  done: [
    'Added GET /api/invoices/export?from=&to= returning text/csv (streamed, 10k rows/sec in local tests)',
    'Unit tests for the CSV writer, including quoted commas and UTF-8 names',
    'Feature flag `csv_export` wired through config/flags.ts, default off',
  ].join('\n'),
  inProgress: [
    'Dashboard button in app/billing/InvoiceList.tsx — renders, but the date picker is not passed through yet',
  ].join('\n'),
  blocked: [
    'Exports over 50k rows time out at the 30 s gateway limit — needs a decision on background jobs vs pagination',
  ].join('\n'),
  runCommands: 'npm install\ncp .env.example .env.local\nnpm run dev',
  testCommands: 'npm run lint\nnpm test -- invoices',
  keyFiles: [
    { path: 'app/api/invoices/export/route.ts', note: 'The export endpoint; streams rows from the repository' },
    { path: 'lib/invoices/csv.ts', note: 'CSV writer with RFC 4180 quoting — do not swap for a library' },
    { path: 'app/billing/InvoiceList.tsx', note: 'Dashboard list; the new Export button lives here' },
    { path: 'config/flags.ts', note: 'Feature flags; `csv_export` gates the whole feature' },
  ],
  decisions: [
    'Stream the response instead of buffering — memory stayed flat at 100k rows',
    'Dates are exported as ISO 8601 in UTC — matches the existing JSON API, avoids locale bugs',
    'No Excel BOM prefix — the two customers who asked use Google Sheets, which does not need it',
  ].join('\n'),
  openQuestions: [
    'Should exports over 50k rows become an emailed background job?',
    'Do we need per-currency columns, or is a single amount + currency column enough?',
  ].join('\n'),
  nextSteps: [
    'Pass the selected date range from the picker into the Export button',
    'Add an integration test for the 50k-row case (currently fails with a gateway timeout)',
    'Turn the flag on for the internal workspace and watch error rates for a day',
    'Write the help-center article and link it from the button tooltip',
  ].join('\n'),
  constraints: [
    'The invoices table has no index on created_at in production — the query plan is fine under 100k rows only',
    'A pre-existing lint warning in lib/legacy/totals.ts is unrelated; leave it',
    'CI runs on Node 20; `Array.fromAsync` is not available',
  ].join('\n'),
  owners: 'Feature owner: Priya (billing team)\nReviewer: Marco\nOn-call for the gateway: #platform channel',
  links: 'Ticket: https://example.com/jira/BIL-412\nDesign doc: https://example.com/docs/csv-export\nPR: https://github.com/acme/billing-api/pull/388',
  agentPreamble: true,
  contextBudget: 'Read this file, then only the files listed under Key files. The repo is large; do not scan it whole.',
  doNotTouch: 'lib/invoices/csv.ts\nprisma/migrations/',
  verifyCommands: 'npm run lint\nnpm test -- invoices\ncurl -s "http://localhost:3000/api/invoices/export?from=2026-01-01&to=2026-01-31" | head -3',
  statusTable: true,
  timestamps: true,
};

export const EMPTY_FIELDS: HandoffFields = {
  project: '',
  repo: '',
  branch: '',
  goal: '',
  done: '',
  inProgress: '',
  blocked: '',
  runCommands: '',
  testCommands: '',
  keyFiles: [{ path: '', note: '' }],
  decisions: '',
  openQuestions: '',
  nextSteps: '',
  constraints: '',
  owners: '',
  links: '',
  agentPreamble: false,
  contextBudget: '',
  doNotTouch: '',
  verifyCommands: '',
  statusTable: false,
  timestamps: true,
};

// ---- helpers -----------------------------------------------------------------

/** Split a textarea into trimmed, non-empty lines with any list marker removed. */
export function lines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim().replace(/^(?:[-*+]|\d+[.)])\s+/, '').trim())
    .filter(Boolean);
}

/** Make a string safe inside a GFM table cell: pipes escaped, newlines flattened. */
export function cell(text: string): string {
  const flat = text.replace(/\r?\n/g, ' ').trim();
  return flat === '' ? '—' : flat.replace(/\|/g, '\\|');
}

/** Make a string safe as heading or inline text: single line, no leading '#'. */
export function inline(text: string): string {
  return text
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*#+\s*/, ''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function bullets(text: string): string {
  return lines(text).map((l) => `- ${l}`).join('\n');
}

function numbered(text: string): string {
  return lines(text).map((l, i) => `${i + 1}. ${l}`).join('\n');
}

function fence(text: string, lang = 'bash'): string {
  const body = lines(text).join('\n');
  return `\`\`\`${lang}\n${body}\n\`\`\``;
}

/** "decision — why" | "decision | why" | "decision: why" → [decision, why]. */
export function splitReason(line: string): [string, string] {
  const m = line.match(/^(.*?)\s+(?:—|–|\||->|→)\s+(.*)$/) ?? line.match(/^([^:]{3,}?):\s+(.*)$/);
  return m ? [m[1].trim(), m[2].trim()] : [line.trim(), ''];
}

/** "Label: https://x" or "https://x" → markdown link item. */
export function linkItem(line: string): string {
  const url = line.match(/https?:\/\/\S+/)?.[0];
  if (!url) return line;
  const label = line.replace(url, '').replace(/[\s:—–-]+$/, '').trim();
  return label ? `[${label}](${url})` : `<${url}>`;
}

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function isoMinute(d: Date): string {
  return d.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
}

// ---- builder -------------------------------------------------------------------

export function buildHandoff(f: HandoffFields, opts: BuildOptions = {}): string {
  const now = opts.now ?? new Date();
  const parts: string[] = [];
  const project = inline(f.project) || 'Untitled project';

  parts.push(`# HANDOFF: ${project}`);

  const meta: string[] = [];
  if (f.repo.trim()) meta.push(`**Repo:** \`${inline(f.repo)}\``);
  if (f.branch.trim()) meta.push(`**Branch:** \`${inline(f.branch)}\``);
  if (f.timestamps) meta.push(`**Written:** ${isoMinute(now)}`);
  if (meta.length) parts.push(meta.join(' · '));

  if (f.goal.trim()) parts.push(`## Goal\n\n${inline(f.goal)}`);

  if (f.agentPreamble) {
    const items: string[] = [];
    items.push('Read this whole file before changing anything, then continue from **Next steps** in order.');
    if (f.contextBudget.trim()) items.push(`**Context budget:** ${inline(f.contextBudget)}`);
    const dnt = lines(f.doNotTouch);
    if (dnt.length) items.push(`**Do not touch:** ${dnt.map((p) => `\`${p}\``).join(', ')}`);
    items.push('Do not re-do items listed under **Done**; verify them with the commands below if in doubt.');
    items.push('If the branch head differs from what this file describes, treat the file as a starting point, not the truth.');
    let block = `## For an AI agent\n\n${items.map((i) => `- ${i}`).join('\n')}`;
    if (lines(f.verifyCommands).length) {
      block += `\n\nVerify before and after your changes:\n\n${fence(f.verifyCommands)}`;
    }
    parts.push(block);
  }

  const done = lines(f.done);
  const inProgress = lines(f.inProgress);
  const blocked = lines(f.blocked);

  if (f.statusTable && (done.length || inProgress.length || blocked.length)) {
    const rows = [
      ...done.map((d) => `| ${cell(d)} | Done |`),
      ...inProgress.map((d) => `| ${cell(d)} | In progress |`),
      ...blocked.map((d) => `| ${cell(d)} | Blocked |`),
    ];
    parts.push(`## Status\n\n| Item | Status |\n| --- | --- |\n${rows.join('\n')}`);
  }

  if (done.length || inProgress.length || blocked.length) {
    const sub: string[] = [];
    if (done.length) sub.push(`### Done\n\n${bullets(f.done)}`);
    if (inProgress.length) sub.push(`### In progress\n\n${bullets(f.inProgress)}`);
    if (blocked.length) sub.push(`### Blocked\n\n${bullets(f.blocked)}`);
    parts.push(`## Current state\n\n${sub.join('\n\n')}`);
  }

  const run = lines(f.runCommands);
  const test = lines(f.testCommands);
  if (run.length || test.length) {
    const sub: string[] = [];
    if (run.length) sub.push(`Run:\n\n${fence(f.runCommands)}`);
    if (test.length) sub.push(`Test:\n\n${fence(f.testCommands)}`);
    parts.push(`## How to run and test\n\n${sub.join('\n\n')}`);
  }

  const files = f.keyFiles.filter((k) => k.path.trim());
  if (files.length) {
    const rows = files.map((k) => `| \`${cell(k.path)}\` | ${cell(k.note)} |`);
    parts.push(`## Key files\n\n| File | What it does |\n| --- | --- |\n${rows.join('\n')}`);
  }

  const decisions = lines(f.decisions);
  if (decisions.length) {
    const rows = decisions.map(splitReason).map(([d, why]) => `| ${cell(d)} | ${cell(why)} |`);
    parts.push(`## Decisions\n\n| Decision | Why |\n| --- | --- |\n${rows.join('\n')}`);
  }

  if (lines(f.openQuestions).length) parts.push(`## Open questions\n\n${bullets(f.openQuestions)}`);
  if (lines(f.nextSteps).length) parts.push(`## Next steps\n\n${numbered(f.nextSteps)}`);
  if (lines(f.constraints).length) parts.push(`## Constraints and gotchas\n\n${bullets(f.constraints)}`);
  if (lines(f.owners).length) parts.push(`## Owners and contacts\n\n${bullets(f.owners)}`);

  const links = lines(f.links);
  if (links.length) parts.push(`## Links\n\n${links.map((l) => `- ${linkItem(l)}`).join('\n')}`);

  if (f.timestamps) parts.push(`---\n\n_Handoff written ${isoDate(now)}. Update this file before you stop; the next reader starts here._`);

  return parts.join('\n\n') + '\n';
}

/** Section headings in the order the builder emits them; used by the tests and the page. */
export const SECTION_ORDER = [
  '## Goal',
  '## For an AI agent',
  '## Status',
  '## Current state',
  '## How to run and test',
  '## Key files',
  '## Decisions',
  '## Open questions',
  '## Next steps',
  '## Constraints and gotchas',
  '## Owners and contacts',
  '## Links',
];
