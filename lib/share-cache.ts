import { revalidateTag, unstable_cache } from 'next/cache';
import { cache } from 'react';
import { dbOperations, type Share } from '@/lib/db';
import { storageOperations } from '@/lib/storage';

// Read path for share pages, /raw and MCP read_share. Crawlers re-read the same shares all day,
// and every uncached read kept the Neon compute awake (it only sleeps after 5 idle minutes).
// The share row and its markdown are cached per id for a day; every write path calls
// invalidateShare(id). Expiry is NOT cached: callers compare expires_at with the current time
// on every request, so an expired share disappears on time even while its data is cached.

/** Shape of every id generateSlug() produces; anything else (probes like /wp-admin) never reaches the database. */
export const SHARE_ID_RE = /^[a-z]+-[a-z]+-[A-Za-z0-9]{5}$/;

const DAY_SECONDS = 24 * 60 * 60;

export interface CachedShare {
  share: Share;
  content: string;
}

function shareTag(id: string): string {
  return `share:${id}`;
}

/** Deduplicated within a request too (the page and its metadata both ask for the same share). */
export const getCachedShare = cache(async (id: string): Promise<CachedShare | null> => {
  if (!SHARE_ID_RE.test(id)) return null;
  try {
    return await unstable_cache(
      async (): Promise<CachedShare | null> => {
        const share = await dbOperations.getShare(id);
        if (!share) return null;
        const content = await storageOperations.readMarkdown(share.blob_url);
        // Throwing keeps a transient blob failure out of the cache; the next request retries.
        if (content === null) throw new BlobUnreadableError(id);
        return {
          share: { ...share, created_at: Number(share.created_at), expires_at: Number(share.expires_at) },
          content,
        };
      },
      ['share', id],
      { revalidate: DAY_SECONDS, tags: [shareTag(id)] },
    )();
  } catch (error) {
    if (error instanceof BlobUnreadableError) return null;
    throw error;
  }
});

class BlobUnreadableError extends Error {
  constructor(id: string) {
    super(`Markdown for share ${id} could not be read`);
  }
}

/** Drop the cached copy right away (expire: 0, not stale-while-revalidate). Call after any write to a share. */
export function invalidateShare(id: string): void {
  try {
    revalidateTag(shareTag(id), { expire: 0 });
  } catch (error) {
    // Outside a request (scripts) there is no cache to invalidate.
    console.error(`Could not invalidate cached share ${id}:`, error);
  }
}
