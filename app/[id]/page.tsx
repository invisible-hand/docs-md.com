import { notFound } from 'next/navigation';
import Link from 'next/link';
import { dbOperations, isExpired } from '@/lib/db';
import { storageOperations } from '@/lib/storage';
import { extractToc } from '@/lib/toc';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ShareActions from '@/components/ShareActions';
import TableOfContents from '@/components/TableOfContents';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SharePage({ params }: PageProps) {
  const { id } = await params;

  // Get share metadata from database
  const share = await dbOperations.getShare(id);

  if (!share) {
    notFound();
  }

  // Convert BIGINT strings from Postgres to numbers
  const createdAt = typeof share.created_at === 'string' ? parseInt(share.created_at) : share.created_at;
  const expiresAt = typeof share.expires_at === 'string' ? parseInt(share.expires_at) : share.expires_at;
  // eslint-disable-next-line react-hooks/purity -- dynamic server route; expiry must be checked against request time
  const nowTimestamp = Date.now();
  const neverExpires = expiresAt === 0;

  if (isExpired({ expires_at: expiresAt }, nowTimestamp)) {
    // Delete expired share
    await storageOperations.deleteMarkdown(share.blob_url);
    await dbOperations.deleteShare(id);
    notFound();
  }

  // Read markdown content
  const content = await storageOperations.readMarkdown(share.blob_url);

  if (!content) {
    notFound();
  }

  const expiresDate = new Date(expiresAt);
  const createdDate = new Date(createdAt);
  const daysUntilExpiry = Math.ceil((expiresAt - nowTimestamp) / (1000 * 60 * 60 * 24));
  const toc = extractToc(content);

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto mb-8 flex max-w-5xl items-center justify-between">
          <Link
            href="/"
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

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            {neverExpires
              ? 'This link does not expire.'
              : `This link will be automatically deleted on ${expiresDate.toLocaleDateString()}`}
          </p>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const share = await dbOperations.getShare(id);

  if (!share) {
    return {
      title: 'Shared Markdown Not Found',
    };
  }

  const expiresAt = Number(share.expires_at);

  return {
    title: share.filename,
    description: `Shared markdown file: ${share.filename}`,
    // Only permanent shares are worth indexing; expiring pages would churn the index.
    robots: expiresAt === 0 ? undefined : { index: false, follow: true },
  };
}
