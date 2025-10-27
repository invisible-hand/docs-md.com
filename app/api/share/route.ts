import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { dbOperations } from '@/lib/db';
import { storageOperations } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, filename } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }

    // Generate unique ID
    const id = nanoid(10);
    
    // Save markdown file and get blob URL
    const blobUrl = await storageOperations.saveMarkdown(id, content);
    
    // Save metadata to database
    const share = await dbOperations.createShare(
      id,
      filename || 'untitled.md',
      blobUrl
    );

    // Get base URL
    const baseUrl = process.env.BASE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
      `${request.nextUrl.protocol}//${request.nextUrl.host}`);
    const shareUrl = `${baseUrl}/${id}`;

    return NextResponse.json({
      success: true,
      id: share.id,
      url: shareUrl,
      expiresAt: share.expires_at,
    });
  } catch (error) {
    console.error('Error creating share:', error);
    return NextResponse.json(
      { error: 'Failed to create share' },
      { status: 500 }
    );
  }
}

