'use client';
import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { searchTools, TOOL_COUNT } from '@/lib/tools-registry';
import type { Tool } from '@/types/tools';
import * as LucideIcons from 'lucide-react';

export function SearchBar({ placeholder }: { placeholder?: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tool[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const t = useTranslations('common');

  useEffect(() => {
    if (query.length > 1) {
      setResults(searchTools(query).slice(0, 6));
      setOpen(true);
    } else {
      setResults([]);
      setOpen(false);
    }
    setActiveIndex(-1);
  }, [query]);

  function handleSelect(tool: Tool) {
    router.push(`/tools/${tool.slug}`);
    setQuery('');
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && activeIndex >= 0) handleSelect(results[activeIndex]);
    if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); }
  }

  return (
    <div className="relative w-full max-w-lg">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          ref={inputRef}
          id="site-search"
          name="q"
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 1 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder || t('searchPlaceholder', { count: TOOL_COUNT })}
          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100 placeholder-slate-400"
          aria-label="Search tools"
          aria-autocomplete="list"
          aria-expanded={open}
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
          {results.map((tool, i) => {
            const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[tool.icon] || LucideIcons.Wrench;
            return (
              <button
                key={tool.slug}
                onMouseDown={() => handleSelect(tool)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${i === activeIndex ? 'bg-slate-50 dark:bg-slate-700' : ''}`}
              >
                <span className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </span>
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{tool.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{tool.shortDescription}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
      {open && query.length > 1 && results.length === 0 && (
        <div className="absolute top-full mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 px-4 py-3 text-sm text-slate-500">
          {t('noResults', { query })}
        </div>
      )}
    </div>
  );
}
