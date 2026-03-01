import type { Metadata } from 'next';
import { ToolCard } from '@/components/tools/ToolCard';
import { getToolsByCategory, categories } from '@/lib/tools-registry';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'IPL 2026 Cricket Tools - Squad Explorer, Schedule, Points Table | ToolsArena',
  description: 'Free IPL 2026 cricket tools: explore team squads, check match schedule, compare players, and track the points table. No signup required.',
  keywords: 'IPL 2026, IPL squad, IPL schedule, IPL points table, IPL player comparison, cricket tools, IPL teams',
  alternates: { canonical: `${SITE_URL}/category/cricket-tools` },
  openGraph: {
    title: 'IPL 2026 Cricket Tools - Squad Explorer, Schedule & More',
    description: 'Free IPL 2026 cricket tools: explore team squads, check match schedule, compare players, and track the points table.',
    url: `${SITE_URL}/category/cricket-tools`,
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    type: 'website',
  },
};

export default function CricketToolsPage() {
  const cat = categories['cricket-tools'];
  const catTools = getToolsByCategory('cricket-tools');
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🏏</span>
          <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-100">{cat.name}</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{cat.description}</p>
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-full text-sm text-orange-700 dark:text-orange-400 font-medium">
          🔥 IPL 2026 starts March 28 — Season is here!
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {catTools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
      </div>
    </div>
  );
}
