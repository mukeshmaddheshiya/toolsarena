import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/constants';
import { getAlternateLanguages } from '@/lib/seo';
import { CategoryPageContent } from '@/components/tools/CategoryPageContent';

export const metadata: Metadata = {
  title: 'Text Tools - Free Online Word Counter, Case Converter & More | ToolsArena',
  description: 'Free online text tools: count words & characters, convert case, generate lorem ipsum, create URL slugs, remove duplicates and more. Instant, no signup.',
  keywords: 'word counter, character counter, case converter, lorem ipsum generator, URL slug generator, text tools',
  alternates: {
    canonical: `${SITE_URL}/category/text-tools`,
    languages: getAlternateLanguages('/category/text-tools'),
  },
  openGraph: {
    title: 'Text Tools - Free Online Word Counter, Case Converter & More',
    description: 'Free online text tools: count words & characters, convert case, generate lorem ipsum, create URL slugs and more. Instant, no signup.',
    url: `${SITE_URL}/category/text-tools`,
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text Tools - Free Online Word Counter, Case Converter & More',
    description: 'Free online text tools: count words & characters, convert case, generate lorem ipsum and more.',
  },
  robots: { index: true, follow: true },
};

export default async function TextToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CategoryPageContent categoryKey="text-tools" locale={locale} />;
}
