import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/constants';
import { getAlternateLanguages } from '@/lib/seo';
import { CategoryPageContent } from '@/components/tools/CategoryPageContent';

export const metadata: Metadata = {
  title: 'Image Tools - Free Online Image Compressor, Resizer & Converter | ToolsArena',
  description: 'Free online image tools: compress, resize, convert PNG to JPG, WebP to PNG, and more. No signup, no watermark. Fast browser-based image processing.',
  keywords: 'image compressor, image resizer, PNG to JPG, WebP converter, image converter, free image tools',
  alternates: {
    canonical: `${SITE_URL}/category/image-tools`,
    languages: getAlternateLanguages('/category/image-tools'),
  },
  openGraph: {
    title: 'Image Tools - Free Online Image Compressor, Resizer & Converter',
    description: 'Free online image tools: compress, resize, convert PNG to JPG, WebP to PNG, and more. No signup, no watermark.',
    url: `${SITE_URL}/category/image-tools`,
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Tools - Free Online Image Compressor, Resizer & Converter',
    description: 'Free online image tools: compress, resize, convert PNG to JPG, WebP to PNG, and more.',
  },
  robots: { index: true, follow: true },
};

export default async function ImageToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CategoryPageContent categoryKey="image-tools" locale={locale} />;
}
