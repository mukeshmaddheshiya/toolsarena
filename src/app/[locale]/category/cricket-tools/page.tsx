import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/constants';
import { getAlternateLanguages } from '@/lib/seo';
import { CategoryPageContent } from '@/components/tools/CategoryPageContent';

export const metadata: Metadata = {
  title: 'IPL 2026 Cricket Tools - Squad Explorer, Schedule, Points Table | ToolsArena',
  description: 'Free IPL 2026 cricket tools: explore team squads, check match schedule, compare players, and track the points table. No signup required.',
  keywords: 'IPL 2026, IPL squad, IPL schedule, IPL points table, IPL player comparison, cricket tools, IPL teams',
  alternates: {
    canonical: `${SITE_URL}/category/cricket-tools`,
    languages: getAlternateLanguages('/category/cricket-tools'),
  },
  openGraph: {
    title: 'IPL 2026 Cricket Tools - Squad Explorer, Schedule & More',
    description: 'Free IPL 2026 cricket tools: explore team squads, check match schedule, compare players, and track the points table.',
    url: `${SITE_URL}/category/cricket-tools`,
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IPL 2026 Cricket Tools - Squad Explorer, Schedule & More',
    description: 'Free IPL 2026 cricket tools: explore team squads, check match schedule, compare players, and track standings.',
  },
  robots: { index: true, follow: true },
};

export default async function CricketToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CategoryPageContent categoryKey="cricket-tools" locale={locale} />;
}
