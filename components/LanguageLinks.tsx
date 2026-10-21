import Link from 'next/link';

/** "Also available in …" switcher shown on every language version of a translated page. */
export default function LanguageLinks({ label, links }: { label: string; links: Array<{ href: string; label: string; hreflang: string }> }) {
  if (links.length === 0) return null;
  return (
    <p className="text-sm text-gray-500">
      {label}:{' '}
      {links.map((l, i) => (
        <span key={l.href}>
          {i > 0 ? ' · ' : ''}
          <Link href={l.href} hrefLang={l.hreflang} className="text-indigo-700 hover:underline">
            {l.label}
          </Link>
        </span>
      ))}
    </p>
  );
}
