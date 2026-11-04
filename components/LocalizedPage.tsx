import CheatSheet, { SectionNav } from '@/components/CheatSheet';
import GlanceTable from '@/components/GlanceTable';
import LanguageLinks from '@/components/LanguageLinks';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import MarkdownViewer from '@/components/tools/MarkdownViewer';
import UpdatedLine from '@/components/UpdatedLine';
import { LOCALE_INFO, otherLanguageLinks, type LocalizedContent } from '@/lib/i18n';

const SITE = 'https://docs-md.com';

/** A translated viewer or cheat sheet, rendered from content/i18n/<locale>/<page>.json. */
export default function LocalizedPage({ content }: { content: LocalizedContent }) {
  const info = LOCALE_INFO[content.locale];
  const path = `/${content.locale}/${content.slug}`;
  const { chrome } = content;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      content.page === 'markdown-viewer'
        ? {
            '@type': 'WebApplication',
            name: content.h1,
            url: `${SITE}${path}`,
            inLanguage: info.hreflang,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any (browser)',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            dateModified: content.updated,
          }
        : {
            '@type': 'Article',
            headline: content.h1,
            description: content.description,
            inLanguage: info.hreflang,
            dateModified: content.updated,
            author: { '@type': 'Organization', name: 'Docs MD', url: SITE },
            mainEntityOfPage: `${SITE}${path}`,
          },
      {
        '@type': 'FAQPage',
        inLanguage: info.hreflang,
        mainEntity: content.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <div lang={info.hreflang} className="mx-auto w-full max-w-5xl px-4 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="mb-8 max-w-3xl space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">{content.h1}</h1>
        <UpdatedLine date={content.updated} label={chrome.updated} locale={info.dateLocale} className="text-sm text-gray-500" />
        <div className="text-base text-gray-700">
          <MarkdownRenderer content={content.intro} />
        </div>
        <LanguageLinks label={chrome.otherLanguages} links={otherLanguageLinks(content.page, content.locale)} />
      </header>

      {content.page === 'markdown-viewer' ? (
        <>
          <MarkdownViewer labels={content.ui} starter={content.starter} />
          <div className="mt-12 max-w-3xl space-y-10 text-gray-700">
            {content.sections.map((s) => (
              <section key={s.h2} className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-950">{s.h2}</h2>
                <MarkdownRenderer content={s.body} />
              </section>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-12">
          <GlanceTable
            rows={content.glance}
            title={chrome.glanceTitle ?? ''}
            headers={{ element: chrome.glanceElement ?? '', syntax: chrome.glanceSyntax ?? '', note: chrome.glanceNote ?? '' }}
          />
          <div className="space-y-4">
            {chrome.sectionsTitle ? <h2 className="text-2xl font-semibold tracking-tight text-gray-950">{chrome.sectionsTitle}</h2> : null}
            <SectionNav sections={content.sections} />
          </div>
          <CheatSheet sections={content.sections} copyLabels={{ copy: chrome.copy, copied: chrome.copied }} />
        </div>
      )}

      <section className="mt-12 max-w-3xl space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">{chrome.faqTitle}</h2>
        {content.faq.map((f) => (
          <div key={f.q} className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-950">{f.q}</h3>
            <p className="text-gray-700">{f.a}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
