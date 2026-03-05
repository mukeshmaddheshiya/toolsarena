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
  return locale === 'hi' ? 'hi_IN' : 'en_US';
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
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: tool.name }],
      type: 'website',
      locale: getOgLocale(locale),
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.metaTitle,
      description: tool.metaDescription,
      images: [DEFAULT_OG_IMAGE],
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
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
      type: 'website',
      locale: opts.locale === 'hi' ? 'hi_IN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [DEFAULT_OG_IMAGE],
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
      alternateLocale: ['hi_IN'],
      url: SITE_URL,
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', site: '@ToolsArena' },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
    manifest: '/manifest.json',
  };
}
