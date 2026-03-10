import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, DEFAULT_OG_IMAGE } from './constants';
import { locales, defaultLocale, type Locale } from '@/i18n/config';
import type { Tool } from '@/types/tools';

export function getAlternateLanguages(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    if (locale === defaultLocale) {
      languages[locale] = `${SITE_URL}${path}`;
    } else {
      languages[locale] = `${SITE_URL}/${locale}${path}`;
    }
  }
  languages['x-default'] = `${SITE_URL}${path}`;
  return languages;
}

function getLocalizedUrl(path: string, locale: Locale) {
  return locale !== defaultLocale
    ? `${SITE_URL}/${locale}${path}`
    : `${SITE_URL}${path}`;
}

function getOgLocale(locale: Locale) {
  const map: Record<Locale, string> = { en: 'en_US', hi: 'hi_IN', ne: 'ne_NP' };
  return map[locale] ?? 'en_US';
}

export async function generateToolMetadata(tool: Tool): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const path = `/tools/${tool.slug}`;
  const url = getLocalizedUrl(path, locale);

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    keywords: [tool.targetKeyword, ...tool.secondaryKeywords].join(', '),
    alternates: {
      canonical: url,
      languages: getAlternateLanguages(path),
    },
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url,
      siteName: SITE_NAME,
      images: [{ url: `${SITE_URL}/tools/${tool.slug}/opengraph-image`, width: 1200, height: 630, alt: tool.name }],
      type: 'website',
      locale: getOgLocale(locale),
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.metaTitle,
      description: tool.metaDescription,
      images: [{ url: `${SITE_URL}/tools/${tool.slug}/opengraph-image`, alt: tool.name }],
    },
    robots: { index: true, follow: true },
  };
}

export function generatePageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  locale?: Locale;
}): Metadata {
  const url = opts.locale && opts.locale !== defaultLocale
    ? `${SITE_URL}/${opts.locale}${opts.path}`
    : `${SITE_URL}${opts.path}`;

  return {
    title: `${opts.title} | ${SITE_NAME}`,
    description: opts.description,
    keywords: opts.keywords,
    alternates: {
      canonical: url,
      languages: getAlternateLanguages(opts.path),
    },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: opts.title }],
      type: 'website',
      locale: getOgLocale(opts.locale ?? 'en'),
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [{ url: DEFAULT_OG_IMAGE, alt: opts.title }],
    },
  };
}

export function getDefaultMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${SITE_NAME} - Free Online Tools`, template: `%s | ${SITE_NAME}` },
    description: SITE_DESCRIPTION,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: { email: false, address: false, telephone: false },
    alternates: {
      languages: getAlternateLanguages('/'),
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      alternateLocale: ['hi_IN', 'ne_NP'],
      url: SITE_URL,
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME} - Free Online Tools` }],
    },
    twitter: { card: 'summary_large_image', site: '@ToolsArena', images: [{ url: DEFAULT_OG_IMAGE, alt: `${SITE_NAME} - Free Online Tools` }] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    icons: { icon: '/icon', apple: '/apple-icon' },
    manifest: '/manifest.json',
  };
}
