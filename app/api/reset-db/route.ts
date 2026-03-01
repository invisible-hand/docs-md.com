import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { initDatabase } from '@/lib/db';
import { isAuthorizedByEnvSecret } from '@/lib/security';

function blockIfUnauthorized(request: NextRequest): NextResponse | null {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is disabled in production' },
      { status: 403 }
    );
  }

  if (!isAuthorizedByEnvSecret(request, 'ADMIN_API_SECRET')) {
    return NextResponse.json(
      { error: 'Unauthorized request' },
      { status: 401 }
    );
  }

  return null;
}

export async function GET(request: NextRequest) {
  const unauthorized = blockIfUnauthorized(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    // Drop the existing table
    await sql`DROP TABLE IF EXISTS shares`;
    
    // Recreate with new schema
    await initDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database reset successfully',
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json(
      { error: 'Failed to reset database' },
      { status: 500 }
    );
  }
}

