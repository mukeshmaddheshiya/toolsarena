import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAlternateLanguages } from '@/lib/seo';
import { SITE_URL } from '@/lib/constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('privacy');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `${SITE_URL}/privacy-policy`,
      languages: getAlternateLanguages('/privacy-policy'),
    },
  };
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('privacy');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-100 mb-6">{t('title')}</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">{t('lastUpdated')}</p>
      <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">{t('dataTitle')}</h2>
          <p>{t('dataText')}</p>
        </section>
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">{t('analyticsTitle')}</h2>
          <p>{t('analyticsText')}</p>
        </section>
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">{t('advertisingTitle')}</h2>
          <p>{t('advertisingText')}</p>
        </section>
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">{t('cookiesTitle')}</h2>
          <p>{t('cookiesText')}</p>
        </section>
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">{t('thirdPartyTitle')}</h2>
          <p>{t('thirdPartyText')}</p>
        </section>
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">{t('contactTitle')}</h2>
          <p>{t('contactText')}</p>
        </section>
      </div>
    </div>
  );
}
