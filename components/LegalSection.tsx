import type { ReactNode } from 'react';
import Link from 'next/link';
import { LEGAL_UPDATED } from '@/lib/legal';

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3 leading-relaxed">
      <h2 className="text-xl font-semibold text-gray-950">{title}</h2>
      {children}
    </section>
  );
}

const LEGAL_PAGES = [
  { href: '/terms', label: 'Terms of Service' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/acceptable-use', label: 'Acceptable Use Policy' },
  { href: '/report', label: 'Report content' },
];

export function LegalMeta({ current }: { current: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-gray-100 pb-6 text-sm text-gray-500">
      <span>Last updated {LEGAL_UPDATED}</span>
      {LEGAL_PAGES.filter((p) => p.href !== current).map((p) => (
        <Link key={p.href} href={p.href} className="text-indigo-700 hover:underline">
          {p.label}
        </Link>
      ))}
    </div>
  );
}

export const legalLinkClass = 'text-indigo-700 hover:underline';
