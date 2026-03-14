import { BookOpen, ArrowRight, Sparkles, TrendingUp, Search } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { getAllGuides, GUIDE_COUNT } from '@/lib/guides-registry';
import { GuideSearch } from '@/components/guides/GuideSearch';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import { getAlternateLanguages } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Free Online Guides & Tutorials | ${SITE_NAME}`,
    description: `In-depth guides for every ToolsArena tool. Learn how to count words, calculate BMI, compress images, generate QR codes, and more — with expert tips and real-world use cases.`,
    keywords: 'online tool guides, word counter guide, BMI calculator guide, image compression guide, QR code guide, free tutorials',
    alternates: {
      canonical: `${SITE_URL}/guides`,
      languages: getAlternateLanguages('/guides'),
    },
    openGraph: {
      title: `Free Online Guides & Tutorials | ${SITE_NAME}`,
      description: `In-depth guides for every ToolsArena tool. Learn how to count words, calculate BMI, compress images, generate QR codes, and more — with expert tips and real-world use cases.`,
      url: `${SITE_URL}/guides`,
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Free Online Guides & Tutorials | ${SITE_NAME}`,
      description: 'Expert guides for every free online tool on ToolsArena.',
    },
    robots: { index: true, follow: true },
  };
}

const BENEFITS = [
  { icon: BookOpen,    label: 'In-Depth Guides',   desc: 'Thorough, expert-written content' },
  { icon: TrendingUp,  label: 'Real Use Cases',     desc: 'Practical examples for every context' },
  { icon: Sparkles,    label: 'Pro Tips',           desc: 'Techniques used by professionals' },
  { icon: Search,      label: 'SEO-Optimised',      desc: 'Trusted by thousands of readers' },
];

export default async function GuidesIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getTranslations(); // initialise i18n for server components below

  const allGuides = getAllGuides();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides` },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Free Online Tool Guides & Tutorials',
    description: 'Expert guides for every free online tool on ToolsArena.',
    url: `${SITE_URL}/guides`,
    numberOfItems: allGuides.length,
    hasPart: allGuides.map(g => ({
      '@type': 'Article',
      headline: g.title,
      url: `${SITE_URL}/guides/${g.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={collectionSchema} />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 dark:from-slate-900 dark:via-primary-950 dark:to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(249,115,22,0.12),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6">
            <BookOpen className="w-3.5 h-3.5 text-accent-400" aria-hidden />
            <span>{GUIDE_COUNT} Free Guides</span>
          </div>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl leading-tight mb-4">
            Online Tool Guides
            <br />
            <span className="text-accent-400">&amp; Tutorials</span>
          </h1>
          <p className="text-lg text-primary-200 dark:text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            In-depth, expert-written guides for every tool on ToolsArena. Discover pro tips, real-world use cases, reference tables, and step-by-step tutorials.
          </p>

          {/* Benefit pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {BENEFITS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm text-primary-100"
              >
                <Icon className="w-3.5 h-3.5" aria-hidden />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits strip ───────────────────────────────────────── */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200 dark:divide-slate-800">
            {BENEFITS.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3 px-5 py-4">
                <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary-700 dark:text-primary-400" aria-hidden />
                </div>
                <div>
                  <div className="font-heading font-bold text-slate-900 dark:text-slate-100 text-sm">{label}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Guide search + grid ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GuideSearch guides={allGuides} />

        {/* Coming soon placeholder */}
        <div className="mt-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-10 text-center">
          <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" aria-hidden />
          <p className="font-semibold text-slate-500 dark:text-slate-400">More guides coming soon</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            We publish new guides every week. Check back for guides on PDF tools, converters, developer tools, and more.
          </p>
        </div>
      </section>

      {/* ── CTA to tools ─────────────────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-slate-100 mb-3">
            Ready to try the tools?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-lg mx-auto text-sm leading-relaxed">
            Every guide links to a free, instant tool. No signup, no downloads, no hidden fees.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            Browse All Tools
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
