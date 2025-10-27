import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';
import { storageOperations } from '@/lib/storage';
import { generateSlug } from '@/lib/slug-generator';

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

    // Generate unique friendly slug
    let id = generateSlug();
    
    // Ensure uniqueness (unlikely collision, but check anyway)
    let attempts = 0;
    while (await dbOperations.getShare(id) && attempts < 5) {
      id = generateSlug();
      attempts++;
    }
    
    // Save markdown file and get blob URL
    const blobUrl = await storageOperations.saveMarkdown(id, content);
    
    // Save metadata to database
    const share = await dbOperations.createShare(
      id,
      filename || 'untitled.md',
      blobUrl
    );

    // Get base URL - always use custom domain
    const baseUrl = 'https://docs-md.com';
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

