import { NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';
import { storageOperations } from '@/lib/storage';

export async function DELETE() {
  try {
    // Get all expired shares
    const expiredShares = dbOperations.getExpiredShares();
    
    // Delete files and database entries
    let deletedCount = 0;
    for (const share of expiredShares) {
      storageOperations.deleteMarkdown(share.id);
      dbOperations.deleteShare(share.id);
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

// Allow GET for easy manual triggering
export async function GET() {
  return DELETE();
}

