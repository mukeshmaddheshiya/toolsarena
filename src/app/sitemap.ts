import { MetadataRoute } from 'next';
import { tools } from '@/lib/tools-registry';
import { getAllGuides } from '@/lib/guides-registry';
import type { ToolCategory } from '@/types/tools';
import { SITE_URL as BASE_URL } from '@/lib/constants';
import { locales, defaultLocale } from '@/i18n/config';

const CATEGORIES: ToolCategory[] = ['image-tools', 'pdf-tools', 'text-tools', 'calculators', 'developer-tools', 'converters', 'utility-tools', 'seo-tools', 'cricket-tools'];

function getAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    if (locale === defaultLocale) {
      languages[locale] = `${BASE_URL}${path}`;
    } else {
      languages[locale] = `${BASE_URL}/${locale}${path}`;
    }
  }
  return { languages };
}

function getLocaleUrl(locale: string, path: string): string {
  if (locale === defaultLocale) {
    return `${BASE_URL}${path}`;
  }
  return `${BASE_URL}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Use a fixed deploy date — update this when you deploy new content
  const DEPLOY_DATE = '2026-03-16';
  const staticDate = new Date('2026-02-01');

  // Static pages — all locales
  const staticPages = ['', '/about', '/privacy-policy', '/terms', '/contact'];
  for (const page of staticPages) {
    const path = page || '/';
    for (const locale of locales) {
      entries.push({
        url: getLocaleUrl(locale, path),
        lastModified: page === '' ? new Date(DEPLOY_DATE) : staticDate,
        changeFrequency: page === '' ? 'daily' : 'monthly',
        priority: page === '' ? 1.0 : 0.4,
        alternates: getAlternates(path),
      });
    }
  }

  // Category pages — all locales
  for (const cat of CATEGORIES) {
    const path = `/category/${cat}`;
    for (const locale of locales) {
      entries.push({
        url: getLocaleUrl(locale, path),
        lastModified: new Date(DEPLOY_DATE),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: getAlternates(path),
      });
    }
  }

  // Tool pages — all locales
  for (const tool of tools) {
    const path = `/tools/${tool.slug}`;
    for (const locale of locales) {
      entries.push({
        url: getLocaleUrl(locale, path),
        lastModified: new Date(DEPLOY_DATE),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: getAlternates(path),
      });
    }
  }

  // Guide pages — all locales
  const guidesPath = '/guides';
  for (const locale of locales) {
    entries.push({
      url: getLocaleUrl(locale, guidesPath),
      lastModified: new Date(DEPLOY_DATE),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: getAlternates(guidesPath),
    });
  }

  for (const guide of getAllGuides()) {
    const path = `/guides/${guide.slug}`;
    for (const locale of locales) {
      entries.push({
        url: getLocaleUrl(locale, path),
        lastModified: new Date(guide.lastUpdated),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: getAlternates(path),
      });
    }
  }

  return entries;
}
