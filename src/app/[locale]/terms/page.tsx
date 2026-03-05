import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAlternateLanguages } from '@/lib/seo';
import { SITE_URL } from '@/lib/constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('terms');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `${SITE_URL}/terms`,
      languages: getAlternateLanguages('/terms'),
    },
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('terms');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-100 mb-6">{t('title')}</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">{t('lastUpdated')}</p>
      <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">{t('acceptance')}</h2>
          <p>{t('acceptanceText')}</p>
        </section>
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">{t('useOfServices')}</h2>
          <p>{t('useOfServicesText')}</p>
        </section>
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">{t('intellectualProperty')}</h2>
          <p>{t('intellectualPropertyText')}</p>
        </section>
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">{t('disclaimer')}</h2>
          <p>{t('disclaimerText')}</p>
        </section>
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">{t('limitation')}</h2>
          <p>{t('limitationText')}</p>
        </section>
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">{t('changes')}</h2>
          <p>{t('changesText')}</p>
        </section>
      </div>
    </div>
  );
}
