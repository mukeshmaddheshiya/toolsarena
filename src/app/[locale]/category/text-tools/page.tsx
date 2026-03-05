import type { Metadata } from 'next';
import { ToolCard } from '@/components/tools/ToolCard';
import { getToolsByCategory, categories } from '@/lib/tools-registry';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, CATEGORY_NAME_KEYS } from '@/lib/constants';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAlternateLanguages } from '@/lib/seo';

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
};

export default async function TextToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const cat = categories['text-tools'];
  const catTools = getToolsByCategory('text-tools');
  const nameKey = CATEGORY_NAME_KEYS['text-tools'];
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
