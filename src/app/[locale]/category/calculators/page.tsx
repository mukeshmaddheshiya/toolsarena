import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/constants';
import { getAlternateLanguages } from '@/lib/seo';
import { CategoryPageContent } from '@/components/tools/CategoryPageContent';

export const metadata: Metadata = {
  title: 'Calculators - Free Online EMI, SIP, GST, BMI & Age Calculator | ToolsArena',
  description: 'Free online calculators for EMI, SIP, GST, BMI, age, percentage, discount and more. Accurate Indian financial calculators with detailed breakdown.',
  keywords: 'EMI calculator, SIP calculator, GST calculator, BMI calculator, age calculator, percentage calculator, discount calculator',
  alternates: {
    canonical: `${SITE_URL}/category/calculators`,
    languages: getAlternateLanguages('/category/calculators'),
  },
  openGraph: {
    title: 'Calculators - Free Online EMI, SIP, GST, BMI & Age Calculator',
    description: 'Free online calculators for EMI, SIP, GST, BMI, age, percentage, discount and more. Accurate Indian financial calculators.',
    url: `${SITE_URL}/category/calculators`,
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculators - Free Online EMI, SIP, GST, BMI & Age Calculator',
    description: 'Free online calculators for EMI, SIP, GST, BMI, age, percentage, discount and more.',
  },
  robots: { index: true, follow: true },
};

export default async function CalculatorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CategoryPageContent categoryKey="calculators" locale={locale} />;
}
