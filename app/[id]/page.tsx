import { notFound } from 'next/navigation';
import { dbOperations } from '@/lib/db';
import { storageOperations } from '@/lib/storage';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import CopyButton from '@/components/CopyButton';

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

  // Check if share has expired
  if (share.expires_at < Date.now()) {
    // Delete expired share
    await storageOperations.deleteMarkdown(id);
    await dbOperations.deleteShare(id);
    notFound();
  }

  // Read markdown content
  const content = await storageOperations.readMarkdown(id);

  if (!content) {
    notFound();
  }

  const expiresDate = new Date(share.expires_at);
  const daysUntilExpiry = Math.ceil((share.expires_at - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen p-4 md:p-8">
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
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* File Info Bar */}
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-950">{share.filename}</h1>
              <p className="text-xs text-gray-500 mt-1">
                Shared {new Date(share.created_at).toLocaleDateString()} • 
                Expires {expiresDate.toLocaleDateString()}
              </p>
            </div>
            <CopyButton content={content} />
          </div>

          {/* Markdown Content */}
          <div className="p-6 md:p-10">
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

