// Read-only access to the markdown in a public GitHub repository, for /gh/[owner]/[repo]/[[...path]].
//
// Two upstreams: the REST API for repository metadata and directory listings (rate-limited:
// 60 requests/hour per IP without a token, 5,000 with GITHUB_TOKEN), and raw.githubusercontent.com
// for file bodies (not rate-limited the same way). Every fetch is cached by Next's data cache for an
// hour, so a popular repo costs a handful of API calls per hour, not per visitor.
//
// Security: owner, repo and path segments are validated against a strict character set, `..` is
// rejected, only markdown-like files are rendered, and the markdown goes through react-markdown
// without raw HTML, so a hostile README cannot inject script or markup.

const API = 'https://api.github.com';
const RAW = 'https://raw.githubusercontent.com';
const SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]{0,99}$/;
const MARKDOWN_EXT = /\.(md|mdx|markdown|mdown|mkd|txt|rst)$/i;
const MAX_FILE_BYTES = 2 * 1024 * 1024;
export const REVALIDATE_SECONDS = 3600;

export interface RepoMeta {
  owner: string;
  repo: string;
  defaultBranch: string;
  description: string | null;
  stars: number;
  htmlUrl: string;
}

export interface Entry {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size: number;
}

export type DocResult =
  | { kind: 'file'; path: string; content: string; dir: string }
  | { kind: 'dir'; path: string; entries: Entry[] }
  | { kind: 'missing'; path: string }
  | { kind: 'rate-limited' }
  | { kind: 'too-large'; path: string };

export function isValidSegment(s: string): boolean {
  return SEGMENT.test(s) && s !== '..' && s !== '.';
}

export function isMarkdownPath(p: string): boolean {
  return MARKDOWN_EXT.test(p);
}

/**
 * Accepts "owner/repo", "github.com/owner/repo", "https://github.com/owner/repo/tree/main/docs",
 * ".../blob/main/README.md" and returns the /gh path, or null.
 */
export function parseRepoInput(input: string): string | null {
  const s = input.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\.git$/i, '');
  const m = s.match(/^(?:github\.com\/)?([^/\s]+)\/([^/\s#?]+)(?:\/(?:tree|blob)\/([^/\s]+)(?:\/(.*))?)?\/?$/);
  if (!m) return null;
  const [, owner, repo, ref, rest] = m;
  if (!isValidSegment(owner) || !isValidSegment(repo)) return null;
  const parts = (rest ?? '').split('/').filter(Boolean);
  if (!parts.every(isValidSegment)) return null;
  // A non-default branch is passed as ?ref= on the first page only; the /gh route itself is branch-less.
  const path = parts.length ? `/${parts.join('/')}` : '';
  const query = ref && ref !== 'main' && ref !== 'master' ? `?ref=${encodeURIComponent(ref)}` : '';
  return `/gh/${owner}/${repo}${path}${query}`;
}

function headers(json: boolean): HeadersInit {
  const h: Record<string, string> = {
    'User-Agent': 'docs-md.com github-readme-viewer (+https://docs-md.com/github-readme-viewer)',
    Accept: json ? 'application/vnd.github+json' : 'text/plain',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function api(path: string): Promise<{ status: number; json: unknown }> {
  const res = await fetch(`${API}${path}`, { headers: headers(true), next: { revalidate: REVALIDATE_SECONDS } });
  if (res.status === 403 || res.status === 429) return { status: 429, json: null };
  if (!res.ok) return { status: res.status, json: null };
  return { status: 200, json: await res.json() };
}

export async function getRepo(owner: string, repo: string): Promise<RepoMeta | 'rate-limited' | null> {
  if (!isValidSegment(owner) || !isValidSegment(repo)) return null;
  const r = await api(`/repos/${owner}/${repo}`);
  if (r.status === 429) return 'rate-limited';
  if (r.status !== 200 || !r.json) return null;
  const j = r.json as { default_branch?: string; description?: string | null; stargazers_count?: number; html_url?: string; name?: string; owner?: { login?: string } };
  return {
    owner: j.owner?.login ?? owner,
    repo: j.name ?? repo,
    defaultBranch: j.default_branch ?? 'main',
    description: j.description ?? null,
    stars: j.stargazers_count ?? 0,
    htmlUrl: j.html_url ?? `https://github.com/${owner}/${repo}`,
  };
}

export async function listDir(owner: string, repo: string, ref: string, path: string): Promise<Entry[] | 'rate-limited' | null> {
  const r = await api(`/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(ref)}`);
  if (r.status === 429) return 'rate-limited';
  if (r.status !== 200 || !Array.isArray(r.json)) return null;
  return (r.json as Array<{ name: string; path: string; type: string; size?: number }>)
    .filter((e) => e.type === 'dir' || (e.type === 'file' && isMarkdownPath(e.name)))
    .map((e): Entry => ({ name: e.name, path: e.path, type: e.type === 'dir' ? 'dir' : 'file', size: e.size ?? 0 }))
    .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1));
}

export async function getFile(owner: string, repo: string, ref: string, path: string): Promise<string | 'too-large' | null> {
  const res = await fetch(`${RAW}/${owner}/${repo}/${encodeURIComponent(ref)}/${path.split('/').map(encodeURIComponent).join('/')}`, {
    headers: headers(false),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) return null;
  const len = Number(res.headers.get('content-length') ?? 0);
  if (len > MAX_FILE_BYTES) return 'too-large';
  const text = await res.text();
  if (text.length > MAX_FILE_BYTES) return 'too-large';
  return text;
}

function dirOf(path: string): string {
  const i = path.lastIndexOf('/');
  return i < 0 ? '' : path.slice(0, i);
}

/** README lookup is case-insensitive and accepts the common extensions. */
function findReadme(entries: Entry[]): Entry | undefined {
  return entries.find((e) => e.type === 'file' && /^readme(\.(md|mdx|markdown|txt|rst))?$/i.test(e.name));
}

/**
 * Resolve what to show for a path: a markdown file renders; a directory renders its README if it
 * has one, otherwise a listing; anything else is "missing".
 */
export async function resolveDoc(owner: string, repo: string, ref: string, segments: string[]): Promise<DocResult> {
  if (!segments.every(isValidSegment)) return { kind: 'missing', path: segments.join('/') };
  const path = segments.join('/');
  if (path && isMarkdownPath(path)) {
    const content = await getFile(owner, repo, ref, path);
    if (content === 'too-large') return { kind: 'too-large', path };
    if (content !== null) return { kind: 'file', path, content, dir: dirOf(path) };
    return { kind: 'missing', path };
  }
  const entries = await listDir(owner, repo, ref, path);
  if (entries === 'rate-limited') return { kind: 'rate-limited' };
  if (!entries) {
    // Not a directory: an extension-less file such as LICENSE or CODEOWNERS. Show it as plain text.
    if (path && !path.includes('.')) {
      const text = await getFile(owner, repo, ref, path);
      if (text === 'too-large') return { kind: 'too-large', path };
      if (text !== null) return { kind: 'file', path, content: '```text\n' + text.replace(/```/g, '` ` `') + '\n```', dir: dirOf(path) };
    }
    return { kind: 'missing', path };
  }
  const readme = findReadme(entries);
  if (readme) {
    const content = await getFile(owner, repo, ref, readme.path);
    if (content === 'too-large') return { kind: 'too-large', path: readme.path };
    if (content !== null) return { kind: 'file', path: readme.path, content, dir: path };
  }
  return { kind: 'dir', path, entries };
}

export interface NavGroup {
  label: string;
  entries: Entry[];
}

/** Sidebar: markdown at the repo root, plus one level of the first docs-like folder found. */
export async function docsNav(owner: string, repo: string, ref: string): Promise<NavGroup[]> {
  const root = await listDir(owner, repo, ref, '');
  if (!root || root === 'rate-limited') return [];
  const groups: NavGroup[] = [{ label: 'Repository', entries: root.filter((e) => e.type === 'file') }];
  const docsDir = root.find((e) => e.type === 'dir' && /^(docs?|documentation|wiki|guides?)$/i.test(e.name));
  if (docsDir) {
    const inner = await listDir(owner, repo, ref, docsDir.path);
    if (inner && inner !== 'rate-limited' && inner.length) groups.push({ label: docsDir.name, entries: inner });
  }
  const otherDirs = root.filter((e) => e.type === 'dir' && e !== docsDir && !/^(\.|node_modules$|dist$|build$)/.test(e.name));
  if (otherDirs.length) groups.push({ label: 'Folders', entries: otherDirs });
  return groups;
}

export function pageHref(owner: string, repo: string, path: string, ref?: string): string {
  const base = `/gh/${owner}/${repo}${path ? `/${path}` : ''}`;
  return ref ? `${base}?ref=${encodeURIComponent(ref)}` : base;
}

/**
 * Bases for rewriting the document's relative links: pages stay on docs-md, assets go to raw GitHub.
 * `pageRoot`/`rawRoot` resolve repo-root links ("/examples/x"), which GitHub reads as the repository root.
 */
export function relativeBases(
  owner: string,
  repo: string,
  ref: string,
  dir: string,
): { page: string; raw: string; pageRoot: string; rawRoot: string } {
  const d = dir ? `${dir}/` : '';
  const pageRoot = `/gh/${owner}/${repo}/`;
  const rawRoot = `${RAW}/${owner}/${repo}/${encodeURIComponent(ref)}/`;
  return { page: `${pageRoot}${d}`, raw: `${rawRoot}${d}`, pageRoot, rawRoot };
}

/** First paragraph of a markdown document, flattened, for a meta description. */
export function excerptOf(markdown: string, max = 155): string {
  const body = markdown
    .replace(/^---[\s\S]*?---\s*/m, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  const para = body.split(/\n\s*\n/).map((p) => p.trim()).find((p) => p && !/^#/.test(p) && !/^[-*|>]/.test(p)) ?? '';
  const flat = para.replace(/[*_`#]/g, '').replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
}
