import Link from 'next/link';
import { Zap, Shield, Sparkles, Clock } from 'lucide-react';
import { tools, categories, getPopularTools } from '@/lib/tools-registry';
import { ToolCard } from '@/components/tools/ToolCard';
import { SearchBar } from '@/components/common/SearchBar';
import type { ToolCategory } from '@/types/tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ToolsArena - 100+ Free Online Tools | Image, PDF, Text & Calculator Tools',
  description: 'Free online tools for images, PDFs, text, calculators and developers. No signup, no downloads. Compress images, merge PDFs, count words, calculate EMI and more.',
  alternates: { canonical: 'https://toolsarena.in' },
  openGraph: {
    title: 'ToolsArena - 100+ Free Online Tools',
    description: 'Free online tools for images, PDFs, text, calculators and developers. No signup required.',
    url: 'https://toolsarena.in',
    siteName: 'ToolsArena',
    type: 'website',
  },
};

const STATS = [
  { icon: Zap, label: '30+ Tools', desc: 'And growing' },
  { icon: Shield, label: '100% Private', desc: 'Files stay on device' },
  { icon: Sparkles, label: 'No Signup', desc: 'Use instantly' },
  { icon: Clock, label: 'Always Free', desc: 'No hidden fees' },
];

const CATEGORY_ORDER: ToolCategory[] = ['text-tools', 'calculators', 'developer-tools', 'image-tools', 'pdf-tools', 'converters'];

export default function HomePage() {
  const popularTools = getPopularTools(8);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 dark:from-slate-900 dark:via-primary-950 dark:to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(249,115,22,0.15),transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" />
            <span>30+ Free Tools &mdash; No Signup Required</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-4">
            Free Online Tools
            <br />
            <span className="text-accent-400">for Everyone</span>
          </h1>
          <p className="text-lg text-primary-200 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            Compress images, merge PDFs, calculate EMI, format JSON, generate QR codes and 25+ more tools. All free, all instant, no account needed.
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar placeholder="Search 30+ tools — try 'word counter' or 'QR code'..." />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200 dark:divide-slate-800">
            {STATS.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3 px-6 py-4">
                <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary-700 dark:text-primary-400" />
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Popular Tools */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-slate-100">&#11088; Popular Tools</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Most used tools by our visitors</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
            {popularTools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        </section>

        {/* Category sections */}
        {CATEGORY_ORDER.map(catKey => {
          const cat = categories[catKey];
          const catTools = tools.filter(t => t.category === catKey);
          if (catTools.length === 0) return null;
          return (
            <section key={catKey}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-slate-100">{cat.name}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{cat.description}</p>
                </div>
                <Link
                  href={`/category/${catKey}`}
                  className="text-sm font-medium text-primary-700 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors whitespace-nowrap"
                >
                  View All &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {catTools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
