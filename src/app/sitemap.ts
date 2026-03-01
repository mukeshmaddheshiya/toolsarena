import { MetadataRoute } from 'next';
import { tools } from '@/lib/tools-registry';
import type { ToolCategory } from '@/types/tools';

import { SITE_URL as BASE_URL } from '@/lib/constants';

const CATEGORIES: ToolCategory[] = ['image-tools', 'pdf-tools', 'text-tools', 'calculators', 'developer-tools', 'converters', 'utility-tools', 'seo-tools'];

export default function sitemap(): MetadataRoute.Sitemap {
  const toolUrls = tools.map(tool => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const categoryUrls = CATEGORIES.map(cat => ({
    url: `${BASE_URL}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const staticUrls = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.4 },
  ];

  return [...staticUrls, ...categoryUrls, ...toolUrls];
}
