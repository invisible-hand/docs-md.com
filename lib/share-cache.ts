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
  /** The owner agent's public identity; null for shares created before agent keys (2026-11-13). */
  author: { agent_id: string; name: string } | null;
}

function shareTag(id: string): string {
  return `share:${id}`;
}

/** Reads a share and its markdown from the database (and the blob store for shares created before 2026-11-13). */
async function loadShare(id: string): Promise<CachedShare | null> {
  const share = await dbOperations.getShare(id);
  if (!share) return null;
  // Shares written since 2026-11-13 carry their markdown in the row; older ones still read from the blob store.
  const content = share.content ?? (share.blob_url ? await storageOperations.readMarkdown(share.blob_url) : null);
  // Throwing keeps a transient blob failure out of the cache; the next request retries.
  if (content === null) throw new BlobUnreadableError(id);
  const agent = share.agent_id ? await dbOperations.getAgentById(share.agent_id) : undefined;
  return {
    // Secrets and the duplicate copy of the markdown stay out of the cache entry.
    share: {
      ...share,
      content: null,
      edit_token: null,
      edit_token_hash: null,
      created_at: Number(share.created_at),
      expires_at: Number(share.expires_at),
    },
    content,
    author: agent ? { agent_id: agent.id, name: agent.name } : null,
  };
}

/** Deduplicated within a request too (the page and its metadata both ask for the same share). */
export const getCachedShare = cache(async (id: string): Promise<CachedShare | null> => {
  if (!SHARE_ID_RE.test(id)) return null;
  try {
    // Outside the Next.js runtime (scripts/test-agents-e2e.ts) there is no data cache to read through.
    if (process.env.DOCS_MD_NO_DATA_CACHE) return await loadShare(id);
    return await unstable_cache(
      () => loadShare(id),
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
  if (process.env.DOCS_MD_NO_DATA_CACHE) return;
  try {
    revalidateTag(shareTag(id), { expire: 0 });
  } catch (error) {
    // Outside a request (scripts) there is no cache to invalidate.
    console.error(`Could not invalidate cached share ${id}:`, error);
  }
}
