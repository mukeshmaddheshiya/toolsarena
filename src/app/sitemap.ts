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

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const lastUpdated = new Date();

  // Static pages
  const staticPages = ['', '/about', '/privacy-policy', '/terms', '/contact'];
  for (const page of staticPages) {
    entries.push({
      url: `${BASE_URL}${page || '/'}`,
      lastModified: lastUpdated,
      changeFrequency: page === '' ? 'daily' : 'monthly',
      priority: page === '' ? 1.0 : 0.4,
      alternates: getAlternates(page || '/'),
    });
  }

  // Category pages
  for (const cat of CATEGORIES) {
    const path = `/category/${cat}`;
    entries.push({
      url: `${BASE_URL}${path}`,
      lastModified: lastUpdated,
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: getAlternates(path),
    });
  }

  // Tool pages
  for (const tool of tools) {
    const path = `/tools/${tool.slug}`;
    entries.push({
      url: `${BASE_URL}${path}`,
      lastModified: lastUpdated,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: getAlternates(path),
    });
  }

  // Guide pages
  entries.push({
    url: `${BASE_URL}/guides`,
    lastModified: lastUpdated,
    changeFrequency: 'weekly',
    priority: 0.8,
    alternates: getAlternates('/guides'),
  });

  for (const guide of getAllGuides()) {
    const path = `/guides/${guide.slug}`;
    entries.push({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(guide.lastUpdated),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: getAlternates(path),
    });
  }

  return entries;
}
