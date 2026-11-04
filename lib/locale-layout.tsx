import SiteShell from '@/components/SiteShell';
import { LOCALE_INFO, type Locale } from '@/lib/i18n';

/**
 * Root layout for one translated locale (app/(l10n)/<locale>/layout.tsx). Each locale is a
 * static segment, which a layout cannot read as a param, so each locale folder has its own
 * three-line layout file that calls this with its locale.
 */
export function makeLocaleLayout(locale: Locale) {
  return function LocaleLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <SiteShell lang={LOCALE_INFO[locale].hreflang}>{children}</SiteShell>;
  };
}
