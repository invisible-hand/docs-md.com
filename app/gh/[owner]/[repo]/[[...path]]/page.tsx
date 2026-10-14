import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import TableOfContents from '@/components/TableOfContents';
import {
  docsNav,
  excerptOf,
  getRepo,
  isValidSegment,
  pageHref,
  relativeBases,
  resolveDoc,
  type Entry,
} from '@/lib/github-docs';
import { extractToc } from '@/lib/toc';

export const revalidate = 3600;

interface Params {
  owner: string;
  repo: string;
  path?: string[];
}
interface PageProps {
  params: Promise<Params>;
  searchParams: Promise<{ ref?: string }>;
}

function refOf(sp: { ref?: string }): string | undefined {
  const r = sp.ref?.trim();
  return r && /^[A-Za-z0-9][A-Za-z0-9._/-]{0,199}$/.test(r) && !r.includes('..') ? r : undefined;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { owner, repo, path = [] } = await params;
  const branchName = refOf(await searchParams);
  if (!isValidSegment(owner) || !isValidSegment(repo)) return { title: 'Repository not found' };
  const meta = await getRepo(owner, repo);
  if (!meta || meta === 'rate-limited') return { title: `${owner}/${repo}`, robots: { index: false, follow: true } };
  const doc = await resolveDoc(owner, repo, branchName ?? meta.defaultBranch, path);
  const file = doc.kind === 'file' ? doc.path : path.join('/') || 'README';
  const description =
    doc.kind === 'file' ? excerptOf(doc.content) || meta.description || `${file} from ${owner}/${repo}, rendered.` : meta.description || `Browse the markdown in ${owner}/${repo}.`;
  // Third-party content: readable and linkable, never indexed under this domain.
  return {
    title: `${file} · ${owner}/${repo}`,
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: pageHref(owner, repo, doc.kind === 'file' ? doc.path : path.join('/'), branchName) },
    openGraph: { title: `${file} · ${owner}/${repo}`, description, type: 'article' },
  };
}

function Sidebar({ owner, repo, branchName, groups, current }: { owner: string; repo: string; branchName?: string; groups: Array<{ label: string; entries: Entry[] }>; current: string }) {
  return (
    <nav aria-label="Repository documents" className="text-sm">
      {groups.map((g) => (
        <div key={g.label} className="mb-5">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">{g.label}</p>
          <ul className="space-y-0.5">
            {g.entries.map((e) => {
              const active = e.path === current;
              return (
                <li key={e.path}>
                  <Link
                    href={pageHref(owner, repo, e.path, branchName)}
                    className={`block truncate rounded px-2 py-1 ${active ? 'bg-indigo-50 font-medium text-indigo-700' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-700'}`}
                    title={e.path}
                  >
                    {e.type === 'dir' ? `${e.name}/` : e.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default async function GithubDocPage({ params, searchParams }: PageProps) {
  const { owner, repo, path = [] } = await params;
  const branchName = refOf(await searchParams);
  if (!isValidSegment(owner) || !isValidSegment(repo)) notFound();

  const meta = await getRepo(owner, repo);
  if (meta === null) notFound();
  if (meta === 'rate-limited') {
    return <Problem title="GitHub is rate-limiting this viewer right now" body="GitHub allows a limited number of anonymous API requests per hour. Try again in a few minutes, or open the file directly on GitHub." owner={owner} repo={repo} />;
  }
  const branch = branchName ?? meta.defaultBranch;
  const [doc, nav] = await Promise.all([resolveDoc(owner, repo, branch, path), docsNav(owner, repo, branch)]);

  if (doc.kind === 'rate-limited') {
    return <Problem title="GitHub is rate-limiting this viewer right now" body="Try again in a few minutes, or open the file directly on GitHub." owner={owner} repo={repo} />;
  }
  if (doc.kind === 'missing') notFound();

  const currentPath = doc.kind === 'file' ? doc.path : doc.path;
  const title = doc.kind === 'file' ? doc.path.split('/').pop() ?? doc.path : `${doc.path || '/'}`;
  const crumbs = currentPath.split('/').filter(Boolean);
  const githubFileUrl = `${meta.htmlUrl}/${doc.kind === 'file' ? 'blob' : 'tree'}/${encodeURIComponent(branch)}/${currentPath}`;
  const toc = doc.kind === 'file' ? extractToc(doc.content) : [];

  return (
    <div className="px-4 py-6 md:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              <Link href="/github-readme-viewer" className="hover:text-indigo-700">GitHub README viewer</Link>
            </p>
            <h1 className="truncate text-xl font-semibold tracking-tight text-gray-950">
              <Link href={pageHref(owner, repo, '', branchName)} className="hover:text-indigo-700">{owner}/{repo}</Link>
              {crumbs.map((c, i) => (
                <span key={i} className="text-gray-500">
                  {' / '}
                  <Link href={pageHref(owner, repo, crumbs.slice(0, i + 1).join('/'), branchName)} className="hover:text-indigo-700">{c}</Link>
                </span>
              ))}
            </h1>
            {meta.description ? <p className="mt-1 truncate text-sm text-gray-600">{meta.description}</p> : null}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="rounded-full border border-gray-200 px-3 py-1.5 text-gray-600">★ {meta.stars.toLocaleString()}</span>
            <span className="rounded-full border border-gray-200 px-3 py-1.5 text-gray-600">{branch}</span>
            <a href={githubFileUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-gray-200 px-3 py-1.5 text-gray-700 hover:border-indigo-300 hover:text-indigo-700">
              Open on GitHub →
            </a>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden w-60 shrink-0 md:block">
            <div className="sticky top-6">
              <Sidebar owner={owner} repo={repo} branchName={branchName} groups={nav} current={currentPath} />
            </div>
          </aside>

          <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 bg-gradient-to-r from-indigo-50 via-white to-white px-6 py-3">
              <p className="text-sm font-medium text-gray-800">{title}</p>
            </div>
            <div className="p-6 md:p-10">
              {doc.kind === 'file' ? (
                <MarkdownRenderer content={doc.content} relativeBase={relativeBases(owner, repo, branch, doc.dir)} />
              ) : doc.kind === 'too-large' ? (
                <p className="text-gray-700">This file is larger than 2 MB, which is more than the viewer renders. <a className="text-indigo-700 underline" href={githubFileUrl}>Open it on GitHub.</a></p>
              ) : (
                <div>
                  <p className="mb-4 text-sm text-gray-600">No README in this folder. Markdown files and folders:</p>
                  <ul className="space-y-1">
                    {doc.entries.map((e) => (
                      <li key={e.path}>
                        <Link href={pageHref(owner, repo, e.path, branchName)} className="text-indigo-700 underline">
                          {e.type === 'dir' ? `${e.name}/` : e.name}
                        </Link>
                      </li>
                    ))}
                    {!doc.entries.length ? <li className="text-gray-500">Nothing markdown-like here.</li> : null}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {toc.length ? <TableOfContents entries={toc} /> : null}
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          Rendered from the public repository {owner}/{repo} on GitHub; content belongs to its authors. Cached for up to an hour.
        </p>
      </div>
    </div>
  );
}

function Problem({ title, body, owner, repo }: { title: string; body: string; owner: string; repo: string }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-xl font-semibold text-gray-950">{title}</h1>
      <p className="mt-3 text-gray-600">{body}</p>
      <p className="mt-6 text-sm">
        <a className="text-indigo-700 underline" href={`https://github.com/${owner}/${repo}`}>github.com/{owner}/{repo}</a>
        {' · '}
        <Link className="text-indigo-700 underline" href="/github-readme-viewer">try another repository</Link>
      </p>
    </div>
  );
}
