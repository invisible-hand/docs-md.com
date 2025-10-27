import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { initDatabase } from '@/lib/db';

export async function GET() {
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

