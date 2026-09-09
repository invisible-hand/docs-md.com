import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { ogImageUrl } from "@/lib/page-metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://docs-md.com"),
  title: {
    default: "Docs MD | Share Markdown for AI workflows",
    template: "%s | Docs MD",
  },
  description:
    "Share markdown for free, no signup: paste a file, get a rendered link that lasts a day, a week, a month, or forever. Free markdown tools and MCP server.",
  verification: {
    other: { "msvalidate.01": "EF33FF9A96023EF6C70454CCE7FD6507" },
  },
  alternates: {
    canonical: "./",
  },
  // Pages override this whole block via lib/page-metadata.ts (Next does not deep-merge
  // openGraph), so what is here only describes the homepage and any page without its own.
  openGraph: {
    title: "Share Markdown online for free — no signup",
    description:
      "Paste markdown, get a rendered link that expires in a day, a week, a month, or never. Free markdown tools and an MCP server for Cursor and Claude Code.",
    url: "/",
    siteName: "Docs MD",
    type: "website",
    locale: "en_US",
    images: [{ url: ogImageUrl("Share Markdown online for free — no signup"), width: 1200, height: 630, alt: "Docs MD" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Share Markdown online for free — no signup",
    description:
      "Paste markdown, get a rendered link that expires in a day, a week, a month, or never. Free markdown tools and an MCP server for Cursor and Claude Code.",
    images: [ogImageUrl("Share Markdown online for free — no signup")],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HBDKD40XNV"
          strategy="afterInteractive"
        />
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
