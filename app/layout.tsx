import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
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
    "Share markdown files with expiring links and connect your AI-powered IDE through MCP.",
  verification: {
    other: { "msvalidate.01": "EF33FF9A96023EF6C70454CCE7FD6507" },
  },
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Docs MD",
    description:
      "Markdown sharing with expiring links, live preview, and MCP integration for AI-native workflows.",
    url: "https://docs-md.com",
    siteName: "Docs MD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Docs MD",
    description:
      "Markdown sharing with expiring links and MCP integration for AI-powered IDEs.",
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
