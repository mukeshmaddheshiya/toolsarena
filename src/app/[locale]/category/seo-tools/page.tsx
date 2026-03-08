import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/constants';
import { getAlternateLanguages } from '@/lib/seo';
import { CategoryPageContent } from '@/components/tools/CategoryPageContent';

export const metadata: Metadata = {
  title: 'SEO Tools - Free Meta Tag Checker, Sitemap Generator & More | ToolsArena',
  description: 'Free online SEO tools to optimize your website for search engines. Check meta tags, generate sitemaps, analyze keywords and improve your Google ranking.',
  keywords: 'SEO tools, meta tag checker, sitemap generator, keyword analyzer, free SEO tools, website optimization',
  alternates: {
    canonical: `${SITE_URL}/category/seo-tools`,
    languages: getAlternateLanguages('/category/seo-tools'),
  },
  openGraph: {
    title: 'SEO Tools - Free Meta Tag Checker, Sitemap Generator & More',
    description: 'Free online SEO tools to optimize your website for search engines. Check meta tags, generate sitemaps and improve ranking.',
    url: `${SITE_URL}/category/seo-tools`,
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Tools - Free Meta Tag Checker, Sitemap Generator & More',
    description: 'Free online SEO tools to optimize your website for search engines.',
  },
  robots: { index: true, follow: true },
};

export default async function SeoToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CategoryPageContent categoryKey="seo-tools" locale={locale} />;
}
