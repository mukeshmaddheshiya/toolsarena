import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getGuideBySlug, getAllGuides } from '@/lib/guides-registry';
import { getAlternateLanguages } from '@/lib/seo';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import { GuidePageWrapper } from '@/components/guides/GuidePageWrapper';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

// Pre-generate all guide slugs for static rendering
export async function generateStaticParams() {
  const guides = getAllGuides();
  return guides.map(g => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getGuideBySlug(slug, locale);
  if (!guide) return {};

  const path = `/guides/${slug}`;
  const url  = `${SITE_URL}${path}`;

  return {
    title: `${guide.metaTitle} | ${SITE_NAME}`,
    description: guide.metaDescription,
    keywords: [guide.targetKeyword, ...guide.secondaryKeywords].join(', '),
    alternates: {
      canonical: url,
      languages: getAlternateLanguages(path),
    },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url,
      siteName: SITE_NAME,
      type: 'article',
      publishedTime: guide.lastUpdated,
      modifiedTime: guide.lastUpdated,
      authors: ['ToolsArena'],
      tags: guide.tags,
      images: [{ url: `${SITE_URL}${path}/opengraph-image`, width: 1200, height: 630, alt: guide.metaTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.metaTitle,
      description: guide.metaDescription,
      images: [`${SITE_URL}${path}/opengraph-image`],
    },
    robots: { index: true, follow: true },
  };
}

export default async function GuidePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const guide = getGuideBySlug(slug, locale);
  if (!guide) notFound();

  return <GuidePageWrapper slug={slug} locale={locale} />;
}
