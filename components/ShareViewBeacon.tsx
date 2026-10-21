'use client';

import { useEffect } from 'react';

/**
 * Counts one human view of a share page (share_views_daily) from the browser, so crawlers that
 * never run scripts cost no database work. /api/view also drops bot user agents.
 */
export default function ShareViewBeacon() {
  useEffect(() => {
    try {
      if (!navigator.sendBeacon?.('/api/view')) {
        fetch('/api/view', { method: 'POST', keepalive: true }).catch(() => undefined);
      }
    } catch {
      /* counting is best effort */
    }
  }, []);
  return null;
}
