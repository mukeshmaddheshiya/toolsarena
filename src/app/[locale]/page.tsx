import { Zap, Shield, Sparkles, Clock } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { tools, categories, getPopularTools, TOOL_COUNT } from '@/lib/tools-registry';
import { ToolCard } from '@/components/tools/ToolCard';
import { SearchBar } from '@/components/common/SearchBar';
import { CATEGORY_NAME_KEYS } from '@/lib/constants';
import type { ToolCategory } from '@/types/tools';
import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/constants';
import { getAlternateLanguages } from '@/lib/seo';

export const metadata: Metadata = {
  title: `ToolsArena - ${TOOL_COUNT}+ Free Online Tools | Image, PDF, Text & Calculator Tools`,
  description: 'Free online tools for images, PDFs, text, calculators and developers. No signup, no downloads. Compress images, merge PDFs, count words, calculate EMI and more.',
  alternates: {
    canonical: SITE_URL,
    languages: getAlternateLanguages('/'),
  },
  keywords: 'free online tools, image compressor, PDF merger, word counter, EMI calculator, JSON formatter, QR code generator, unit converter, text tools, developer tools',
  openGraph: {
    title: `ToolsArena - ${TOOL_COUNT}+ Free Online Tools`,
    description: 'Free online tools for images, PDFs, text, calculators and developers. No signup required.',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: `ToolsArena - ${TOOL_COUNT}+ Free Online Tools` }],
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['hi_IN', 'ne_NP'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ToolsArena',
    title: `ToolsArena - ${TOOL_COUNT}+ Free Online Tools`,
    description: 'Free online tools for images, PDFs, text, calculators and developers. No signup required.',
    images: [{ url: DEFAULT_OG_IMAGE, alt: `ToolsArena - ${TOOL_COUNT}+ Free Online Tools` }],
  },
};

const STAT_KEYS = [
  { icon: Zap, labelKey: 'stats.tools' as const, descKey: 'stats.toolsDesc' as const },
  { icon: Shield, labelKey: 'stats.private' as const, descKey: 'stats.privateDesc' as const },
  { icon: Sparkles, labelKey: 'stats.noSignup' as const, descKey: 'stats.noSignupDesc' as const },
  { icon: Clock, labelKey: 'stats.free' as const, descKey: 'stats.freeDesc' as const },
];

const CATEGORY_ORDER: ToolCategory[] = ['text-tools', 'calculators', 'developer-tools', 'image-tools', 'pdf-tools', 'converters'];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const popularTools = getPopularTools(8);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 dark:from-slate-900 dark:via-primary-950 dark:to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(249,115,22,0.15),transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" />
            <span>{t('hero.badge', { count: TOOL_COUNT })}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-4">
            {t('hero.title')}
            <br />
            <span className="text-accent-400">{t('hero.titleAccent')}</span>
          </h1>
          <p className="text-lg text-primary-200 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            {t('hero.subtitle', { count: TOOL_COUNT })}
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar placeholder={t('common.searchPlaceholderLong', { count: TOOL_COUNT })} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200 dark:divide-slate-800">
            {STAT_KEYS.map(({ icon: Icon, labelKey, descKey }) => (
              <div key={labelKey} className="flex items-center gap-3 px-6 py-4">
                <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary-700 dark:text-primary-400" />
                </div>
                <div>
                  <div className="font-heading font-bold text-slate-900 dark:text-slate-100 text-sm">{t(labelKey, { count: TOOL_COUNT })}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{t(descKey)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Popular Tools */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-slate-100">&#11088; {t('home.popularTools')}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t('home.popularToolsDesc')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
            {popularTools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        </section>

        {/* Category sections */}
        {CATEGORY_ORDER.map(catKey => {
          const cat = categories[catKey];
          const catTools = tools.filter(tool => tool.category === catKey);
          if (catTools.length === 0) return null;
          const nameKey = CATEGORY_NAME_KEYS[catKey];
          return (
            <section key={catKey}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-slate-100">{nameKey ? t(nameKey) : cat.name}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{cat.description}</p>
                </div>
                <Link
                  href={`/category/${catKey}`}
                  className="text-sm font-medium text-primary-700 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors whitespace-nowrap"
                >
                  {t('common.viewAll')} &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {catTools.slice(0, 5).map(tool => <ToolCard key={tool.slug} tool={tool} />)}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
