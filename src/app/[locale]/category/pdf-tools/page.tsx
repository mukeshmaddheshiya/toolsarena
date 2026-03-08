import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/constants';
import { getAlternateLanguages } from '@/lib/seo';
import { CategoryPageContent } from '@/components/tools/CategoryPageContent';

export const metadata: Metadata = {
  title: 'PDF Tools - Free Online PDF Merger, Splitter & Compressor | ToolsArena',
  description: 'Free online PDF tools: merge, split, compress PDF files in your browser. No upload to server, completely private. Fast and easy PDF processing.',
  keywords: 'PDF merger, PDF splitter, PDF compressor, merge PDF, split PDF, compress PDF, free PDF tools',
  alternates: {
    canonical: `${SITE_URL}/category/pdf-tools`,
    languages: getAlternateLanguages('/category/pdf-tools'),
  },
  openGraph: {
    title: 'PDF Tools - Free Online PDF Merger, Splitter & Compressor',
    description: 'Free online PDF tools: merge, split, compress PDF files in your browser. No upload to server, completely private.',
    url: `${SITE_URL}/category/pdf-tools`,
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Tools - Free Online PDF Merger, Splitter & Compressor',
    description: 'Free online PDF tools: merge, split, compress PDF files in your browser. No upload, completely private.',
  },
  robots: { index: true, follow: true },
};

export default async function PDFToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CategoryPageContent categoryKey="pdf-tools" locale={locale} />;
}
