import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAlternateLanguages } from '@/lib/seo';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    keywords: 'about ToolsArena, free online tools, privacy-first tools, no signup tools, browser-based tools',
    alternates: {
      canonical: `${SITE_URL}/about`,
      languages: getAlternateLanguages('/about'),
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: `${SITE_URL}/about`,
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'About ToolsArena' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metaTitle'),
      description: t('metaDescription'),
    },
    robots: { index: true, follow: true },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-100 mb-6">{t('title')}</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>{t('intro')}</p>
        <p>{t('browserProcessing')}</p>
        <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-slate-100 mt-8 mb-3">{t('missionTitle')}</h2>
        <p>{t('missionText')}</p>
        <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-slate-100 mt-8 mb-3">{t('whyTitle')}</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>{t('whyFree')}</strong> {t('whyFreeDesc')}</li>
          <li><strong>{t('whyPrivacy')}</strong> {t('whyPrivacyDesc')}</li>
          <li><strong>{t('whyNoSignup')}</strong> {t('whyNoSignupDesc')}</li>
          <li><strong>{t('whyFast')}</strong> {t('whyFastDesc')}</li>
          <li><strong>{t('whyIndia')}</strong> {t('whyIndiaDesc')}</li>
        </ul>
        <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-slate-100 mt-8 mb-3">{t('contactTitle')}</h2>
        <p>{t('contactText')} <a href="/contact" className="text-primary-700 dark:text-primary-400 hover:underline">{t('contactLink')}</a>.</p>
      </div>

      {/* Meet the Founder */}
      <div className="mt-14 border-t border-slate-200 dark:border-slate-700 pt-10">
        <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-slate-100 mb-6">{t('founderTitle')}</h2>
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Avatar */}
            <Image
              src="/mukesh-image.png"
              alt="Mukesh Maddheshiya - Founder of ToolsArena"
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover shrink-0 shadow-lg"
            />
            {/* Info */}
            <div className="flex-1">
              <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100">{t('founderName')}</h3>
              <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-3">{t('founderRole')}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {t('founderBio')}
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a href="https://www.linkedin.com/in/mukesh-maddheshiya-76a83b193" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 shadow-sm transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
                <a href="https://www.instagram.com/mukeshmaddy7/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 shadow-sm transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  Instagram
                </a>
                <a href="https://mukeshfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 shadow-sm transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                  Portfolio
                </a>
                <a href="mailto:Mukeshdr005@gmail.com" className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 shadow-sm transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
