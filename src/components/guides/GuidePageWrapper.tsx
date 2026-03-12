import { notFound } from 'next/navigation';
import { Calendar, Clock, Tag, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getGuideBySlug, getRelatedGuides } from '@/lib/guides-registry';
import { SITE_URL } from '@/lib/constants';
import { JsonLd } from '@/components/seo/JsonLd';
import { GuideTOC } from './GuideTOC';
import { GuideCard } from './GuideCard';
import { GuideToolCTA } from './GuideToolCTA';

interface GuidePageWrapperProps {
  slug: string;
  locale?: string;
}

// ─── Category display helpers ──────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  'text-tools': 'Text Tools', 'calculators': 'Calculators', 'image-tools': 'Image Tools',
  'developer-tools': 'Developer Tools', 'pdf-tools': 'PDF Tools', 'converters': 'Converters',
  'seo-tools': 'SEO Tools',
};

const CATEGORY_HREF: Record<string, string> = {
  'text-tools': '/category/text-tools', 'calculators': '/category/calculators',
  'image-tools': '/category/image-tools', 'developer-tools': '/category/developer-tools',
  'pdf-tools': '/category/pdf-tools', 'converters': '/category/converters',
  'seo-tools': '/category/seo-tools',
};

// ─── Format date for display ──────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ─── Main component ───────────────────────────────────────────────
export function GuidePageWrapper({ slug, locale = 'en' }: GuidePageWrapperProps) {
  const guide = getGuideBySlug(slug, locale);
  if (!guide) notFound();

  const relatedGuides = getRelatedGuides(guide.relatedGuides, locale);

  // ── TOC items (sections + how-to + faq) ──────────────────────
  const tocItems = [
    ...guide.sections.map(s => ({ id: s.id, title: s.title })),
    { id: 'how-to-use', title: `How to Use the Tool` },
    { id: 'faq', title: 'Frequently Asked Questions' },
  ];

  // ── Structured data schemas ───────────────────────────────────
  const guideUrl = `${SITE_URL}/guides/${slug}`;
  const toolUrl  = `${SITE_URL}/tools/${guide.toolSlug}`;

  const ogImageUrl = `${SITE_URL}/guides/${slug}/opengraph-image`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': guideUrl,
    headline: guide.title,
    description: guide.metaDescription,
    datePublished: guide.lastUpdated,
    dateModified: guide.lastUpdated,
    inLanguage: 'en-US',
    image: { '@type': 'ImageObject', url: ogImageUrl, width: 1200, height: 630 },
    author: {
      '@type': 'Organization',
      name: 'ToolsArena',
      url: SITE_URL,
      sameAs: ['https://toolsarena.in'],
    },
    publisher: {
      '@type': 'Organization',
      name: 'ToolsArena',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon`, width: 32, height: 32 },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': guideUrl },
    keywords: [guide.targetKeyword, ...guide.secondaryKeywords].join(', '),
    articleSection: guide.category.replace(/-/g, ' '),
    wordCount: guide.sections.reduce((acc, s) => acc + s.content.replace(/<[^>]+>/g, '').split(/\s+/).length, 0),
    url: guideUrl,
  };

  const readingMinutes = guide.readingTime.match(/\d+/)?.[0] ?? '5';

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${guideUrl}#how-to`,
    name: `How to Use ${guide.title.split(':')[0]}`,
    description: guide.toolCTA.description,
    totalTime: `PT${readingMinutes}M`,
    tool: [{ '@type': 'HowToTool', name: 'ToolsArena', url: toolUrl }],
    step: guide.howToSteps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title,
      text: step.description,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${guideUrl}#faq`,
    mainEntity: guide.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides` },
      { '@type': 'ListItem', position: 3, name: guide.title, item: guideUrl },
    ],
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={howToSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.15),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-primary-300 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" aria-hidden />
            <Link href="/guides" className="hover:text-white transition-colors">Guides</Link>
            <ChevronRight className="w-3 h-3" aria-hidden />
            <span className="text-primary-200 line-clamp-1">{guide.title.split(':')[0]}</span>
          </nav>

          {/* Category badge */}
          <Link
            href={CATEGORY_HREF[guide.category] ?? '/'}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-primary-200 hover:bg-white/20 transition-colors mb-4"
          >
            {CATEGORY_LABELS[guide.category] ?? guide.category}
          </Link>

          {/* Title */}
          <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4 text-white">
            {guide.title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-primary-200 leading-relaxed mb-6 max-w-3xl">
            {guide.subtitle}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-primary-300">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" aria-hidden />
              {guide.readingTime}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" aria-hidden />
              Updated {formatDate(guide.lastUpdated)}
            </span>
            <span className="flex items-center gap-1.5">
              <Tag className="w-4 h-4" aria-hidden />
              {guide.tags.join(', ')}
            </span>
          </div>
        </div>
      </section>

      {/* ── Mobile TOC ─────────────────────────────────────────── */}
      <div className="lg:hidden max-w-4xl mx-auto px-4 sm:px-6 mt-6">
        <GuideTOC items={tocItems} />
      </div>

      {/* ── Main layout ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] lg:gap-12 items-start">

          {/* ── Article ─────────────────────────────────────────── */}
          <article className="min-w-0">

            {/* Intro */}
            <div
              className="guide-content text-base mb-2"
              dangerouslySetInnerHTML={{ __html: guide.intro }}
            />

            {/* Inline tool CTA (after intro) */}
            <GuideToolCTA guide={guide} variant="inline" />

            {/* Content sections */}
            {guide.sections.map(section => (
              <section
                key={section.id}
                id={section.id}
                className="mt-10 scroll-mt-24"
              >
                <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                  {section.title}
                </h2>
                <div
                  className="guide-content"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </section>
            ))}

            {/* ── How to Use section ──────────────────────────── */}
            <section id="how-to-use" className="mt-10 scroll-mt-24">
              <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                How to Use the Tool (Step by Step)
              </h2>
              <ol className="space-y-4 mt-6">
                {guide.howToSteps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{step.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* ── FAQ section ─────────────────────────────────── */}
            <section id="faq" className="mt-10 scroll-mt-24">
              <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-slate-100 mb-6 pb-2 border-b border-slate-200 dark:border-slate-700">
                Frequently Asked Questions
              </h2>
              <GuideFAQAccordion faqs={guide.faqs} />
            </section>

            {/* ── Footer CTA ────────────────────────────────────── */}
            <GuideToolCTA guide={guide} variant="footer" />

            {/* ── Related guides ────────────────────────────────── */}
            {relatedGuides.length > 0 && (
              <section className="mt-12">
                <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-slate-100 mb-5">
                  Related Guides
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedGuides.map(g => (
                    <GuideCard key={g.slug} guide={g} />
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* ── Sidebar (desktop only) ───────────────────────────── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* TOC */}
              <GuideTOC items={tocItems} />

              {/* Sidebar tool CTA */}
              <GuideToolCTA guide={guide} variant="sidebar" />

              {/* Related guides mini-list */}
              {relatedGuides.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                    Related Guides
                  </h3>
                  <div className="space-y-1">
                    {relatedGuides.map(g => (
                      <GuideCard key={g.slug} guide={g} variant="compact" />
                    ))}
                  </div>
                </div>
              )}

              {/* Back to guides link */}
              <Link
                href="/guides"
                className="flex items-center justify-center gap-2 w-full text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-400 py-2 transition-colors"
              >
                ← All Guides
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

// ─── Inline FAQ accordion (client-free with CSS :target trick) ────
function GuideFAQAccordion({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <details
          key={i}
          className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden"
        >
          <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug">
              {faq.question}
            </span>
            <span className="shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 group-open:bg-primary-50 dark:group-open:bg-primary-950/50 group-open:text-primary-600 dark:group-open:text-primary-400 transition-colors text-lg leading-none font-light">
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:block">−</span>
            </span>
          </summary>
          <div className="px-5 pb-5 pt-1">
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
