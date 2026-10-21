import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isExpired } from '@/lib/db';
import { getCachedShare } from '@/lib/share-cache';
import { pageMetadata } from '@/lib/page-metadata';
import { extractToc } from '@/lib/toc';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ShareActions from '@/components/ShareActions';
import ShareViewBeacon from '@/components/ShareViewBeacon';
import TableOfContents from '@/components/TableOfContents';

// Rendered per request so the expiry check below always uses the current time;
// the share's row and markdown come from the per-id data cache (lib/share-cache.ts).
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SharePage({ params }: PageProps) {
  const { id } = await params;

  const cached = await getCachedShare(id);
  if (!cached) {
    notFound();
  }
  const { share, content } = cached;

  const createdAt = Number(share.created_at);
  const expiresAt = Number(share.expires_at);
  // eslint-disable-next-line react-hooks/purity -- dynamic server route; expiry must be checked against request time
  const nowTimestamp = Date.now();
  const neverExpires = expiresAt === 0;

  // Expired shares 404 at once; the cleanup cron deletes them (no database write while rendering).
  if (isExpired({ expires_at: expiresAt }, nowTimestamp) || !content) {
    notFound();
  }

  const expiresDate = new Date(expiresAt);
  const createdDate = new Date(createdAt);
  const daysUntilExpiry = Math.ceil((expiresAt - nowTimestamp) / (1000 * 60 * 60 * 24));
  const toc = extractToc(content);

  return (
    <div className="px-4 py-8 md:py-12">
      <ShareViewBeacon />
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto mb-8 flex max-w-5xl items-center justify-between">
          <Link
            href="/?ref=share-nav"
            className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700"
          >
            ← Share New
          </Link>
          {neverExpires ? (
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
              Permanent link
            </div>
          ) : (
            <div className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
              Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div className="flex justify-center gap-8">
          {/* Main Card */}
          <div className="min-w-0 max-w-5xl flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
            {/* File Info Bar */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-indigo-50 via-white to-white px-6 py-4">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-gray-950">{share.filename}</h1>
                <p className="mt-1 text-xs text-gray-500">
                  Shared {createdDate.toLocaleDateString()}
                  {neverExpires ? '' : ` • Expires ${expiresDate.toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/raw/${id}`}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700"
                >
                  Raw
                </a>
                <Link
                  href={`/?from=${id}`}
                  rel="nofollow"
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700"
                >
                  Duplicate &amp; edit
                </Link>
                <ShareActions content={content} filename={share.filename} />
              </div>
            </div>

            {/* Markdown Content */}
            <div id="markdown-content" className="bg-white p-8 md:p-12">
              <MarkdownRenderer content={content} />
            </div>
          </div>

          <TableOfContents entries={toc} />
        </div>

        {/* Recipients are the biggest audience that has never heard of Docs MD: invite them to share their own. */}
        <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold text-gray-950">Share your own markdown in seconds</p>
            <p className="mt-1 text-sm text-gray-600">
              Free, no account. Paste markdown and get a link like this one, or publish straight from Claude Code,
              Cursor or any AI agent.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/?ref=share-banner"
              className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Share markdown free
            </Link>
            <Link
              href="/agents?ref=share-banner"
              className="rounded-full border border-indigo-200 bg-white px-5 py-2 text-sm font-medium text-indigo-700 transition hover:border-indigo-300"
            >
              For AI agents
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            {neverExpires
              ? 'This link does not expire.'
              : `This link will be automatically deleted on ${expiresDate.toLocaleDateString()}`}
          </p>
          <p className="mt-2">
            Content is published by its author, not by Docs MD.{' '}
            <Link href={`/report?share=${id}`} rel="nofollow" className="text-gray-600 underline-offset-2 hover:text-indigo-700 hover:underline">
              Report this share
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const cached = await getCachedShare(id);

  if (!cached) {
    return {
      title: 'Shared Markdown Not Found',
    };
  }

  const { share, content } = cached;
  const expiresAt = Number(share.expires_at);

  return pageMetadata({
    title: share.filename,
    description: excerpt(content) || `Shared markdown file: ${share.filename}`,
    path: `/${id}`,
    type: 'article',
    kicker: 'Shared markdown',
    extra: {
      // Only permanent shares are worth indexing; expiring pages would churn the index.
      robots: expiresAt === 0 ? undefined : { index: false, follow: true },
      // Agents can fetch the markdown itself instead of the rendered page.
      alternates: { canonical: `/${id}`, types: { 'text/markdown': `/raw/${id}` } },
    },
  });
}

/** First paragraph of prose, stripped of markdown syntax, for the description and link card. */
function excerpt(content: string | null, max = 155): string {
  if (!content) return '';
  const lines = content.replace(/^---[\s\S]*?\n---\n/, '').split('\n');
  let inFence = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('```') || line.startsWith('~~~')) {
      inFence = !inFence;
      continue;
    }
    if (inFence || !line || /^(#{1,6}\s|[-*_]{3,}$|[|>]|!\[|<)/.test(line)) continue;
    const text = line
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[`*_~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (text.length < 20) continue;
    return text.length > max ? `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…` : text;
  }
  return '';
}
