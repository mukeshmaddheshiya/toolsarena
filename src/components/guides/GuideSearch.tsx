'use client';
import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { searchGuides } from '@/lib/guides-registry';
import { GuideCard } from './GuideCard';
import type { Guide } from '@/types/guides';

export function GuideSearch({ guides }: { guides: Guide[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return guides;
    return searchGuides(query);
  }, [query, guides]);

  return (
    <>
      {/* Search input */}
      <div className="relative w-full max-w-xl mx-auto mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={`Search ${guides.length} guides...`}
          className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100 placeholder-slate-500 shadow-sm"
          aria-label="Search guides"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Clear search">
            <X className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
          </button>
        )}
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-slate-100">
            {query.trim() ? 'Search Results' : 'All Guides'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {filtered.length} guide{filtered.length !== 1 ? 's' : ''}{query.trim() ? ` for "${query.trim()}"` : ' available — more coming soon'}
          </p>
        </div>
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
          <p className="font-semibold text-slate-500 dark:text-slate-400">No guides found for &ldquo;{query}&rdquo;</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Try a different keyword like &ldquo;PDF&rdquo;, &ldquo;image&rdquo;, or &ldquo;calculator&rdquo;</p>
        </div>
      )}
    </>
  );
}
