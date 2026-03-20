'use client';
import { useState, useMemo } from 'react';
import { Search, X, LayoutGrid } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { searchGuides } from '@/lib/guides-registry';
import { GuideCard } from './GuideCard';
import type { Guide } from '@/types/guides';

const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  'calculators': { label: 'Calculators', icon: '🧮' },
  'utility-tools': { label: 'Utility Tools', icon: '🔧' },
  'image-tools': { label: 'Image Tools', icon: '🖼️' },
  'developer-tools': { label: 'Developer Tools', icon: '💻' },
  'pdf-tools': { label: 'PDF Tools', icon: '📄' },
  'text-tools': { label: 'Text Tools', icon: '✍️' },
  'converters': { label: 'Converters', icon: '🔄' },
  'finance-tools': { label: 'Finance', icon: '💰' },
  'seo-tools': { label: 'SEO Tools', icon: '📊' },
  'seo-social-media': { label: 'Social Media', icon: '📱' },
  'design-tools': { label: 'Design', icon: '🎨' },
  'security-tools': { label: 'Security', icon: '🔒' },
  'cricket-tools': { label: 'Cricket', icon: '🏏' },
};

export function GuideSearch({ guides, locale = 'en' }: { guides: Guide[]; locale?: string }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const t = useTranslations('guides');

  // Build category list with counts from actual guides
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const g of guides) {
      counts[g.category] = (counts[g.category] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => ({
        key,
        label: CATEGORY_META[key]?.label || key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        icon: CATEGORY_META[key]?.icon || '📦',
        count,
      }));
  }, [guides]);

  const filtered = useMemo(() => {
    let results = query.trim() ? searchGuides(query, locale) : guides;
    if (activeCategory !== 'all') {
      results = results.filter(g => g.category === activeCategory);
    }
    return results;
  }, [query, guides, locale, activeCategory]);

  return (
    <>
      {/* Search input */}
      <div className="relative w-full max-w-xl mx-auto mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder', { count: guides.length })}
          className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100 placeholder-slate-500 shadow-sm"
          aria-label="Search guides"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Clear search">
            <X className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
          </button>
        )}
      </div>

      {/* Category filter tabs */}
      <div className="mb-8 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max pb-1">
          {/* All tab */}
          <button
            onClick={() => setActiveCategory('all')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            All
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeCategory === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
            }`}>
              {guides.length}
            </span>
          </button>

          {/* Category tabs */}
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === cat.key
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              {cat.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeCategory === cat.key
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-slate-100">
            {query.trim()
              ? t('searchResults')
              : activeCategory !== 'all'
                ? (CATEGORY_META[activeCategory]?.label || activeCategory)
                : t('allGuides')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {query.trim()
              ? t('guidesFound', { count: filtered.length })
              : t('guidesAvailable', { count: filtered.length })}
          </p>
        </div>
        {activeCategory !== 'all' && (
          <button
            onClick={() => setActiveCategory('all')}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            Show all →
          </button>
        )}
      </div>

      {/* Guide grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(guide => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="font-semibold text-slate-500 dark:text-slate-400">
            {query.trim() ? (
              <>{t('noGuidesFound')} &ldquo;{query}&rdquo;</>
            ) : (
              <>No guides in this category yet</>
            )}
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            {query.trim() ? t('tryDifferent') : 'Try selecting a different category'}
          </p>
        </div>
      )}
    </>
  );
}
