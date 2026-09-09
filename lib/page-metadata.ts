import type { Metadata } from 'next';

export const SITE_URL = 'https://docs-md.com';
export const SITE_NAME = 'Docs MD';

/** Builds the URL of the dynamically rendered Open Graph card (app/og/route.tsx). */
export function ogImageUrl(title: string, kicker?: string): string {
  const q = new URLSearchParams({ title });
  if (kicker) q.set('kicker', kicker);
  return `/og?${q.toString()}`;
}

export interface PageMetadataInput {
  /** Page title. Rendered through the root "%s | Docs MD" template unless `absoluteTitle` is set. */
  title: string;
  /** Meta description, ≤155 characters. */
  description: string;
  /** Pathname of the page, e.g. "/markdown-cheat-sheet". Becomes the canonical and og:url. */
  path: string;
  /** "article" for guides, explainers and walkthroughs; "website" (default) for tools and hubs. */
  type?: 'website' | 'article';
  /** Skip the "| Docs MD" title template. */
  absoluteTitle?: boolean;
  /** Small label above the title on the OG card, e.g. "Markdown guide". */
  kicker?: string;
  /** Extra fields merged last (robots, keywords, …). */
  extra?: Metadata;
}

/**
 * Per-page metadata with a matching Open Graph / Twitter card.
 *
 * Next.js does not merge nested metadata objects: a page that sets only `title`
 * inherits the root layout's whole `openGraph` block, so every page used to share
 * the homepage's og:title, og:description and og:url. Every indexable page goes
 * through this helper so the card, canonical and og:url always describe *that* page.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = 'website',
  absoluteTitle = false,
  kicker,
  extra,
}: PageMetadataInput): Metadata {
  const image = { url: ogImageUrl(title, kicker), width: 1200, height: 630, alt: title };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type,
      locale: 'en_US',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.url],
    },
    ...extra,
  };
}
