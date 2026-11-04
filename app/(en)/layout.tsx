import type { Metadata } from 'next';
import SiteShell, { SITE_METADATA } from '@/components/SiteShell';

// Root layout of every English route. The translated pages have their own root layouts under
// app/(l10n)/<locale>/ so the server-rendered <html lang> matches the page language.
export const metadata: Metadata = SITE_METADATA;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell lang="en">{children}</SiteShell>;
}
