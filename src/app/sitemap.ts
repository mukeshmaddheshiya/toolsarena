import { MetadataRoute } from 'next';
import { tools } from '@/lib/tools-registry';
import { getAllGuides } from '@/lib/guides-registry';
import type { ToolCategory } from '@/types/tools';
import { SITE_URL as BASE_URL } from '@/lib/constants';
import { locales, defaultLocale } from '@/i18n/config';

const CATEGORIES: ToolCategory[] = ['image-tools', 'pdf-tools', 'text-tools', 'calculators', 'developer-tools', 'converters', 'utility-tools', 'seo-tools', 'cricket-tools'];

const DEPLOY_DATE = '2026-03-21';

// ─── Helpers ────────────────────────────────────────────────────────────────

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

// ─── Sitemap Index ──────────────────────────────────────────────────────────
// Next.js auto-generates /sitemap.xml as index pointing to /sitemap/0.xml, /sitemap/1.xml, etc.

const TOOLS_PER_SITEMAP = 100;

export async function generateSitemaps() {
  const toolChunks = Math.ceil(tools.length / TOOLS_PER_SITEMAP);
  // id 0 = static + categories, id 1 = guides, id 2+ = tool chunks
  const ids: { id: number }[] = [
    { id: 0 }, // static pages + categories
    { id: 1 }, // guides
  ];
  for (let i = 0; i < toolChunks; i++) {
    ids.push({ id: i + 2 });
  }
  return ids;
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  if (id === 0) {
    // ── Static pages + categories ──
    const staticDate = new Date('2026-02-01');
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
  } else if (id === 1) {
    // ── Guides ──
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
  } else {
    // ── Tool chunks (id 2, 3, 4...) ──
    const chunkIndex = id - 2;
    const start = chunkIndex * TOOLS_PER_SITEMAP;
    const end = Math.min(start + TOOLS_PER_SITEMAP, tools.length);
    const chunk = tools.slice(start, end);

    for (const tool of chunk) {
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
  }

  return entries;
}
