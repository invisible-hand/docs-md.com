import { notFound } from 'next/navigation';
import { dbOperations } from '@/lib/db';
import { storageOperations } from '@/lib/storage';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ShareActions from '@/components/ShareActions';

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

  // Check if share has expired
  if (expiresAt < Date.now()) {
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
  const daysUntilExpiry = Math.ceil((expiresAt - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <a
            href="/"
            className="text-sm text-gray-600 hover:text-gray-950 hover:underline transition-colors"
          >
            ← Share New
          </a>
          <div className="text-sm text-gray-500">
            Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
          {/* File Info Bar */}
          <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-950">{share.filename}</h1>
              <p className="text-xs text-gray-500 mt-1">
                Shared {createdDate.toLocaleDateString()} • 
                Expires {expiresDate.toLocaleDateString()}
              </p>
            </div>
            <ShareActions content={content} />
          </div>

          {/* Markdown Content */}
          <div className="p-8 md:p-12 bg-white">
            <MarkdownRenderer content={content} />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            This link will be automatically deleted on {expiresDate.toLocaleDateString()}
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

  return {
    title: `${share.filename} - MD Share`,
    description: `Shared markdown file: ${share.filename}`,
  };
}

