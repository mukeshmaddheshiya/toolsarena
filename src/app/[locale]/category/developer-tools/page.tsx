import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/constants';
import { getAlternateLanguages } from '@/lib/seo';
import { CategoryPageContent } from '@/components/tools/CategoryPageContent';

export const metadata: Metadata = {
  title: 'Developer Tools - Free JSON Formatter, Base64, QR Code & More | ToolsArena',
  description: 'Free online developer tools: JSON formatter, Base64 encoder/decoder, URL encoder, QR code generator, color picker, regex tester and more.',
  keywords: 'JSON formatter, Base64 encoder, URL encoder, QR code generator, color picker, regex tester, developer tools',
  alternates: {
    canonical: `${SITE_URL}/category/developer-tools`,
    languages: getAlternateLanguages('/category/developer-tools'),
  },
  openGraph: {
    title: 'Developer Tools - Free JSON Formatter, Base64, QR Code & More',
    description: 'Free online developer tools: JSON formatter, Base64 encoder/decoder, URL encoder, QR code generator, color picker and more.',
    url: `${SITE_URL}/category/developer-tools`,
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Developer Tools - Free JSON Formatter, Base64, QR Code & More',
    description: 'Free online developer tools: JSON formatter, Base64 encoder, QR code generator, color picker and more.',
  },
  robots: { index: true, follow: true },
};

export default async function DeveloperToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CategoryPageContent categoryKey="developer-tools" locale={locale} />;
}
