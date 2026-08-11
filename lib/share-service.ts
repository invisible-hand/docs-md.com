import { dbOperations, ExpiryOption, isExpired, Share } from '@/lib/db';
import { generateEditToken, isValidEditToken, normalizeFilename } from '@/lib/security';
import { generateSlug } from '@/lib/slug-generator';
import { storageOperations } from '@/lib/storage';

export const BASE_URL =
  process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production'
    ? 'https://docs-md.com'
    : 'http://localhost:3000';

export class ShareServiceError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ShareServiceError';
  }
}

export interface CreatedShare {
  id: string;
  url: string;
  rawUrl: string;
  editToken: string;
  expiresAt: number;
}

export async function createShare(
  content: string,
  filename: string | undefined,
  expiry: ExpiryOption
): Promise<CreatedShare> {
  let id = generateSlug();
  let attempts = 0;
  while ((await dbOperations.getShare(id)) && attempts < 5) {
    id = generateSlug();
    attempts++;
  }

  const editToken = generateEditToken();
  const blobUrl = await storageOperations.saveMarkdown(id, content);
  const share = await dbOperations.createShare(
    id,
    normalizeFilename(filename),
    blobUrl,
    expiry,
    editToken
  );

  return {
    id: share.id,
    url: `${BASE_URL}/${share.id}`,
    rawUrl: `${BASE_URL}/raw/${share.id}`,
    editToken,
    expiresAt: share.expires_at,
  };
}

// Returns the live (non-expired) share or throws; expired shares are lazily deleted.
export async function getLiveShare(id: string): Promise<Share> {
  const share = await dbOperations.getShare(id);
  if (!share) {
    throw new ShareServiceError('Share not found', 404);
  }
  if (isExpired(share, Date.now())) {
    await storageOperations.deleteMarkdown(share.blob_url);
    await dbOperations.deleteShare(id);
    throw new ShareServiceError('Share not found', 404);
  }
  return share;
}

async function getAuthorizedShare(id: string, editToken: string): Promise<Share> {
  const share = await getLiveShare(id);
  if (!isValidEditToken(editToken, share.edit_token)) {
    throw new ShareServiceError('Invalid edit token', 403);
  }
  return share;
}

export async function updateShare(
  id: string,
  editToken: string,
  content: string,
  filename?: string
): Promise<{ url: string }> {
  const share = await getAuthorizedShare(id, editToken);

  const newBlobUrl = await storageOperations.saveMarkdown(id, content);
  const newFilename = filename ? normalizeFilename(filename) : share.filename;
  await dbOperations.updateShare(id, newFilename, newBlobUrl);

  if (newBlobUrl !== share.blob_url) {
    await storageOperations.deleteMarkdown(share.blob_url);
  }

  return { url: `${BASE_URL}/${id}` };
}

export async function deleteShare(id: string, editToken: string): Promise<void> {
  const share = await getAuthorizedShare(id, editToken);
  await storageOperations.deleteMarkdown(share.blob_url);
  await dbOperations.deleteShare(id);
}
