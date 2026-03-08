import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/constants';
import { getAlternateLanguages } from '@/lib/seo';
import { CategoryPageContent } from '@/components/tools/CategoryPageContent';

export const metadata: Metadata = {
  title: 'Converters - Free Unit, Temperature, Timestamp & Number Converter | ToolsArena',
  description: 'Free online converters: unit converter, temperature, Unix timestamp, number to words. Supports metric, imperial, Indian number system.',
  keywords: 'unit converter, temperature converter, Unix timestamp converter, number to words, metric to imperial, free converters',
  alternates: {
    canonical: `${SITE_URL}/category/converters`,
    languages: getAlternateLanguages('/category/converters'),
  },
  openGraph: {
    title: 'Converters - Free Unit, Temperature, Timestamp & Number Converter',
    description: 'Free online converters: unit converter, temperature, Unix timestamp, number to words. Supports metric, imperial, Indian number system.',
    url: `${SITE_URL}/category/converters`,
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Converters - Free Unit, Temperature, Timestamp & Number Converter',
    description: 'Free online converters: unit, temperature, Unix timestamp, number to words. Metric, imperial & Indian formats.',
  },
  robots: { index: true, follow: true },
};

export default async function ConvertersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CategoryPageContent categoryKey="converters" locale={locale} />;
}
