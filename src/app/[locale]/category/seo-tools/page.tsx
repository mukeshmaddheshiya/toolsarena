import type { Metadata } from 'next';
import { ToolCard } from '@/components/tools/ToolCard';
import { getToolsByCategory, categories } from '@/lib/tools-registry';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, CATEGORY_NAME_KEYS } from '@/lib/constants';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAlternateLanguages } from '@/lib/seo';

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
  setRequestLocale(locale);
  const t = await getTranslations();
  const cat = categories['seo-tools'];
  const catTools = getToolsByCategory('seo-tools');
  const nameKey = CATEGORY_NAME_KEYS['seo-tools'];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-100">{nameKey ? t(nameKey) : cat.name}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{cat.description}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {catTools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
      </div>
    </div>
  );
}
