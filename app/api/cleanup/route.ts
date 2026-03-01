import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';
import { isAuthorizedByEnvSecret } from '@/lib/security';
import { storageOperations } from '@/lib/storage';

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
    // Get all expired shares
    const expiredShares = await dbOperations.getExpiredShares();
    
    // Delete files and database entries
    let deletedCount = 0;
    for (const share of expiredShares) {
      await storageOperations.deleteMarkdown(share.blob_url);
      await dbOperations.deleteShare(share.id);
      deletedCount++;
    }

    return NextResponse.json({
      success: true,
      deletedCount,
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

