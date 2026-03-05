'use client';
import dynamic from 'next/dynamic';
import { Search } from 'lucide-react';

const SearchBar = dynamic(
  () => import('@/components/common/SearchBar').then(m => ({ default: m.SearchBar })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[42px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center px-3 gap-2">
        <Search className="w-4 h-4 text-slate-300" />
        <span className="text-sm text-slate-400">Search tools...</span>
      </div>
    ),
  }
);

export function LazySearchBar({ placeholder }: { placeholder?: string }) {
  return <SearchBar placeholder={placeholder} />;
}
