import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Section } from '@/components/CheatSheet';
import type { ViewerLabels } from '@/components/tools/MarkdownViewer';
import type { GlanceRow } from '@/lib/cheat-sheet';

// Translated versions of the pages AI answers already cite most (the viewer and the cheat sheet),
// at /<locale>/<native slug>. Content lives in content/i18n/<locale>/<page>.json. The share viewer
// owns the top-level dynamic segment (app/[id]), so each locale has its own app/<locale>/[page]
// route built by makeLocaleRoute(). The root layout stays English; each page marks its own
// language with lang= and hreflang alternates.

export const LOCALES = ['ru', 'vi', 'es', 'pt-br'] as const;
export type Locale = (typeof LOCALES)[number];

export type LocalizedPage = 'markdown-viewer' | 'markdown-cheat-sheet';

/** hreflang code and the date locale for each URL locale. */
export const LOCALE_INFO: Record<Locale, { hreflang: string; dateLocale: string; name: string; ogLocale: string }> = {
  ru: { hreflang: 'ru', dateLocale: 'ru-RU', name: 'Русский', ogLocale: 'ru_RU' },
  vi: { hreflang: 'vi', dateLocale: 'vi-VN', name: 'Tiếng Việt', ogLocale: 'vi_VN' },
  es: { hreflang: 'es', dateLocale: 'es-ES', name: 'Español', ogLocale: 'es_ES' },
  'pt-br': { hreflang: 'pt-BR', dateLocale: 'pt-BR', name: 'Português (Brasil)', ogLocale: 'pt_BR' },
};

/** Native slug of each localized page. The English page lives at /<page>. */
export const LOCALIZED_SLUGS: Record<LocalizedPage, Record<Locale, string>> = {
  'markdown-viewer': {
    ru: 'prosmotr-md-fajlov',
    vi: 'doc-file-md-online',
    es: 'visor-md',
    'pt-br': 'visualizador-markdown',
  },
  'markdown-cheat-sheet': {
    ru: 'shpargalka-markdown',
    vi: 'cu-phap-markdown',
    es: 'sintaxis-markdown',
    'pt-br': 'sintaxe-markdown',
  },
};

interface Chrome {
  updated: string;
  faqTitle: string;
  otherLanguages: string;
  copy: string;
  copied: string;
  glanceTitle?: string;
  glanceElement?: string;
  glanceSyntax?: string;
  glanceNote?: string;
  sectionsTitle?: string;
}

interface LocalizedBase {
  locale: Locale;
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  updated: string;
  chrome: Chrome;
  faq: Array<{ q: string; a: string }>;
}

export interface LocalizedViewer extends LocalizedBase {
  page: 'markdown-viewer';
  ui: Partial<ViewerLabels>;
  starter: string;
  sections: Array<{ h2: string; body: string }>;
}

export interface LocalizedCheatSheet extends LocalizedBase {
  page: 'markdown-cheat-sheet';
  glance: GlanceRow[];
  sections: Section[];
}

export type LocalizedContent = LocalizedViewer | LocalizedCheatSheet;

const I18N_DIR = join(process.cwd(), 'content', 'i18n');

/** Every translated page of one locale. */
export function listLocalized(locale: Locale): LocalizedContent[] {
  const dir = join(I18N_DIR, locale);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')) as LocalizedContent);
}

export function getLocalized(locale: Locale, slug: string): LocalizedContent | undefined {
  return listLocalized(locale).find((p) => p.slug === slug);
}

/** Path of a page in a language ('en' = the English original). Undefined when that translation is not written yet. */
export function localizedPath(page: LocalizedPage, locale: Locale | 'en'): string | undefined {
  if (locale === 'en') return `/${page}`;
  const slug = LOCALIZED_SLUGS[page][locale];
  return existsSync(join(I18N_DIR, locale, `${page}.json`)) ? `/${locale}/${slug}` : undefined;
}

/** hreflang map for every language version of a page, plus x-default → English. */
export function languageAlternates(page: LocalizedPage): Record<string, string> {
  const languages: Record<string, string> = { en: `/${page}`, 'x-default': `/${page}` };
  for (const locale of LOCALES) {
    const path = localizedPath(page, locale);
    if (path) languages[LOCALE_INFO[locale].hreflang] = path;
  }
  return languages;
}

/** Links to the other language versions, for the language switcher on each version. */
export function otherLanguageLinks(page: LocalizedPage, current: Locale | 'en'): Array<{ href: string; label: string; hreflang: string }> {
  const links: Array<{ href: string; label: string; hreflang: string }> = [];
  if (current !== 'en') links.push({ href: `/${page}`, label: 'English', hreflang: 'en' });
  for (const locale of LOCALES) {
    if (locale === current) continue;
    const path = localizedPath(page, locale);
    if (path) links.push({ href: path, label: LOCALE_INFO[locale].name, hreflang: LOCALE_INFO[locale].hreflang });
  }
  return links;
}
