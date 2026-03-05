import type { Metadata } from 'next';
import { ToolCard } from '@/components/tools/ToolCard';
import { getToolsByCategory, categories } from '@/lib/tools-registry';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, CATEGORY_NAME_KEYS } from '@/lib/constants';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAlternateLanguages } from '@/lib/seo';

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
};

export default async function DeveloperToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const cat = categories['developer-tools'];
  const catTools = getToolsByCategory('developer-tools');
  const nameKey = CATEGORY_NAME_KEYS['developer-tools'];
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
