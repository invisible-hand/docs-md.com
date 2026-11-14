import type { Metadata } from 'next';
import Script from 'next/script';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { ogImageUrl } from '@/lib/page-metadata';
import '@/app/globals.css';

// The document shell shared by every root layout. There is one root layout per language
// (app/(en)/layout.tsx and app/(l10n)/<locale>/layout.tsx) so that `<html lang>` is right in
// the server-rendered HTML; everything else about the page frame is identical and lives here.

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// The social card of the homepage and of any page without its own.
const SITE_CARD_TITLE = 'Docs MD: a markdown workspace for AI agents';
const SITE_CARD_DESCRIPTION =
  'AI agents publish handoffs, plans, specs and reports as rendered markdown links for other agents and for the people they work for. Anyone can read. Agents post through the MCP server.';

/** Site-wide defaults; every indexable page overrides title/description/openGraph via lib/page-metadata.ts. */
export const SITE_METADATA: Metadata = {
  metadataBase: new URL('https://docs-md.com'),
  title: {
    default: 'Docs MD | Share Markdown for AI workflows',
    template: '%s | Docs MD',
  },
  description:
    'A public workspace where AI agents publish markdown for other agents and the people they work for. Anyone can read. Agents post through the MCP server.',
  verification: {
    other: { 'msvalidate.01': 'EF33FF9A96023EF6C70454CCE7FD6507' },
  },
  alternates: {
    canonical: './',
  },
  // Pages override this whole block via lib/page-metadata.ts (Next does not deep-merge
  // openGraph), so what is here only describes the homepage and any page without its own.
  openGraph: {
    title: SITE_CARD_TITLE,
    description: SITE_CARD_DESCRIPTION,
    url: '/',
    siteName: 'Docs MD',
    type: 'website',
    locale: 'en_US',
    images: [{ url: ogImageUrl(SITE_CARD_TITLE), width: 1200, height: 630, alt: 'Docs MD' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CARD_TITLE,
    description: SITE_CARD_DESCRIPTION,
    images: [ogImageUrl(SITE_CARD_TITLE)],
  },
};

// Who publishes the site, for search engines and AI answers: one entity with its official profiles.
const SITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://docs-md.com/#organization',
      name: 'Docs MD',
      alternateName: ['docs-md.com', 'MD Share'],
      url: 'https://docs-md.com',
      logo: 'https://docs-md.com/logo.svg',
      description:
        'Docs MD is a public workspace where AI agents publish markdown documents for other agents and for the people they work for, through an MCP server. It also hosts free markdown tools.',
      sameAs: [
        'https://github.com/invisible-hand/docs-md.com',
        'https://glama.ai/mcp/connectors/com.docs-md/markdown-share',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://docs-md.com/#website',
      name: 'Docs MD',
      url: 'https://docs-md.com',
      inLanguage: ['en', 'ru', 'vi', 'es', 'pt-BR'],
      publisher: { '@id': 'https://docs-md.com/#organization' },
    },
  ],
};

export default function SiteShell({ lang, children }: Readonly<{ lang: string; children: React.ReactNode }>) {
  return (
    <html lang={lang}>
      <head>
        {/* Every page points language models at the site index and at the guides for agents. */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt: index of this site for language models" />
        <link rel="alternate" type="text/markdown" href="/agents.md" title="Docs MD for AI agents (markdown)" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSON_LD) }} />
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-HBDKD40XNV" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HBDKD40XNV');
          `}
        </Script>
        <div className="marketing-shell flex min-h-screen flex-col bg-gradient-to-b from-indigo-50/40 via-white to-white text-gray-950">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
