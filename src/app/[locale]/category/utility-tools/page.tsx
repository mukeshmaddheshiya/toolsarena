import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/constants';
import { getAlternateLanguages } from '@/lib/seo';
import { CategoryPageContent } from '@/components/tools/CategoryPageContent';

export const metadata: Metadata = {
  title: 'Utility Tools - Free Password Generator, Speed Test & Timer | ToolsArena',
  description: 'Free online utility tools: password generator, internet speed test, countdown timer, password strength checker and more. Fast, private, no signup required.',
  keywords: 'password generator, internet speed test, countdown timer, password strength checker, online utilities, free tools',
  alternates: {
    canonical: `${SITE_URL}/category/utility-tools`,
    languages: getAlternateLanguages('/category/utility-tools'),
  },
  openGraph: {
    title: 'Utility Tools - Free Password Generator, Speed Test & Timer',
    description: 'Free online utility tools: password generator, internet speed test, countdown timer and more. Fast, private, no signup required.',
    url: `${SITE_URL}/category/utility-tools`,
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Utility Tools - Free Password Generator, Speed Test & Timer',
    description: 'Free online utility tools: password generator, internet speed test, countdown timer and more.',
  },
  robots: { index: true, follow: true },
};

export default async function UtilityToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CategoryPageContent categoryKey="utility-tools" locale={locale} />;
}
