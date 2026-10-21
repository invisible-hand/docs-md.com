import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LocalizedPage from '@/components/LocalizedPage';
import { getLocalized, languageAlternates, listLocalized, LOCALE_INFO, type Locale } from '@/lib/i18n';
import { pageMetadata } from '@/lib/page-metadata';

type Props = { params: Promise<{ page: string }> };

/** Everything app/<locale>/[page]/page.tsx needs (each file still declares dynamicParams = false itself). */
export function makeLocaleRoute(locale: Locale) {
  function generateStaticParams() {
    return listLocalized(locale).map((p) => ({ page: p.slug }));
  }

  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { page } = await params;
    const content = getLocalized(locale, page);
    if (!content) return {};
    const path = `/${locale}/${content.slug}`;
    const base = pageMetadata({
      title: content.title,
      description: content.description,
      path,
      type: content.page === 'markdown-cheat-sheet' ? 'article' : 'website',
      kicker: 'Docs MD',
    });
    return {
      ...base,
      alternates: { canonical: path, languages: languageAlternates(content.page) },
      openGraph: { ...base.openGraph, locale: LOCALE_INFO[locale].ogLocale },
    };
  }

  async function Page({ params }: Props) {
    const { page } = await params;
    const content = getLocalized(locale, page);
    if (!content) notFound();
    return <LocalizedPage content={content} />;
  }

  return { dynamicParams: false as const, generateStaticParams, generateMetadata, default: Page };
}
