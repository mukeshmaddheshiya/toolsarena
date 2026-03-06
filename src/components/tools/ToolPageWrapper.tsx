import { getToolBySlug, getRelatedTools } from '@/lib/tools-registry';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdSidebar } from '@/components/ads/AdSidebar';
import { RelatedTools } from './RelatedTools';
import { ToolFAQ } from './ToolFAQ';
import { HowToUse } from './HowToUse';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_URL, SITE_NAME, CATEGORY_NAME_KEYS } from '@/lib/constants';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

interface ToolPageWrapperProps {
  slug: string;
  children: React.ReactNode;
}

export async function ToolPageWrapper({ slug, children }: ToolPageWrapperProps) {
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const relatedTools = getRelatedTools(slug);
  const t = await getTranslations();

  const categoryNameKey = CATEGORY_NAME_KEYS[tool.category];
  const categoryName = categoryNameKey ? t(categoryNameKey) : tool.category;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.metaDescription,
    url: `${SITE_URL}/tools/${tool.slug}`,
    applicationCategory: 'Utility',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: tool.secondaryKeywords.join(', '),
    keywords: [tool.targetKeyword, ...tool.secondaryKeywords].join(', '),
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    inLanguage: 'en',
    browserRequirements: 'Requires JavaScript. Works in all modern browsers.',
  };

  return (
    <>
      <JsonLd data={schema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { name: categoryName, href: `/category/${tool.category}` },
            { name: tool.name },
          ]}
        />

        {/* Page header */}
        <div className="mt-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-slate-100">
            {tool.name}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{tool.shortDescription}</p>
        </div>

        {/* Top ad */}
        <AdBanner slot="top-banner" className="mb-6 hidden md:flex" />

        {/* Main content */}
        <div className="flex gap-6 lg:gap-8">
          {/* Tool interface */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 overflow-hidden">
              {children}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden xl:block w-72 shrink-0">
            <div className="sticky top-24 space-y-6">
              <AdSidebar />
              {relatedTools.length > 0 && (
                <div>
                  <h3 className="text-sm font-heading font-semibold text-slate-900 dark:text-slate-100 mb-3">{t('toolPage.relatedTools')}</h3>
                  <div className="space-y-2">
                    {relatedTools.slice(0, 5).map(t => (
                      <a
                        key={t.slug}
                        href={`/tools/${t.slug}`}
                        className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group text-sm"
                      >
                        <span className="text-primary-700 dark:text-primary-400 group-hover:underline font-medium">{t.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* How to use */}
        <HowToUse steps={tool.howToSteps} toolName={tool.name} toolSlug={tool.slug} />

        {/* SEO content */}
        <section className="mt-10 prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-slate-100 mb-4 not-prose">
            {t('toolPage.aboutTool', { toolName: tool.name })}
          </h2>
          <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3 not-prose">
            {tool.longDescription.split('\n\n').map((para, i) => (
              <p key={i}>{para.trim()}</p>
            ))}
          </div>
        </section>

        {/* In-content ad */}
        <AdBanner slot="in-content" className="mt-8" />

        {/* FAQ */}
        <ToolFAQ faqs={tool.faqs} toolName={tool.name} />

        {/* Related tools */}
        <RelatedTools tools={relatedTools} />

        {/* Bottom ad */}
        <AdBanner slot="bottom-banner" className="mt-10" />
      </div>
    </>
  );
}
