import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';
import { isAuthorizedByEnvSecret } from '@/lib/security';
import { storageOperations } from '@/lib/storage';

export const maxDuration = 300;

const CLEANUP_BATCH_SIZE = 100;

function ensureCleanupAuthorized(request: NextRequest): NextResponse | null {
  const isProduction = process.env.NODE_ENV === 'production';
  const secretConfigured = Boolean(process.env.CRON_SECRET);

  if ((isProduction || secretConfigured) && !isAuthorizedByEnvSecret(request, 'CRON_SECRET')) {
    return NextResponse.json(
      { error: 'Unauthorized cleanup request' },
      { status: 401 }
    );
  }

  return null;
}

async function runCleanup(request: NextRequest) {
  const unauthorized = ensureCleanupAuthorized(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const expiredShares = await dbOperations.getExpiredShares();

    // Delete in batches: blobs first, then only the rows whose blobs are gone,
    // so a failed batch is retried on the next run instead of leaving orphans.
    let deletedCount = 0;
    let failedCount = 0;
    for (let i = 0; i < expiredShares.length; i += CLEANUP_BATCH_SIZE) {
      const batch = expiredShares.slice(i, i + CLEANUP_BATCH_SIZE);
      const blobsDeleted = await storageOperations.deleteMarkdownBatch(batch.map((s) => s.blob_url));
      if (!blobsDeleted) {
        failedCount += batch.length;
        continue;
      }
      deletedCount += await dbOperations.deleteSharesByIds(batch.map((s) => s.id));
    }

    const prunedQuotaRows = await dbOperations.pruneDailyCounts().catch((error) => {
      console.error('Error pruning daily counters:', error);
      return 0;
    });

    return NextResponse.json({
      success: failedCount === 0,
      deletedCount,
      failedCount,
      prunedQuotaRows,
      message: `Cleaned up ${deletedCount} expired shares`,
    });
  } catch (error) {
    console.error('Error during cleanup:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup expired shares' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  return runCleanup(request);
}

export async function GET(request: NextRequest) {
  return runCleanup(request);
}

