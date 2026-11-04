'use client';

import { useEffect } from 'react';

/**
 * Sets `<html lang>` for a translated page. The root layout renders every route (one root
 * layout, no locale route groups), so it emits lang="en"; this corrects it on the client for
 * screen readers, translation UIs and crawlers that render JavaScript. The page root also
 * carries its own `lang` attribute for the static HTML.
 */
export default function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const html = document.documentElement;
    const previous = html.lang;
    html.lang = lang;
    return () => {
      html.lang = previous;
    };
  }, [lang]);
  return null;
}
