'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Zap, Menu, Search, BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { MobileNav } from './MobileNav';
import { NAV_CATEGORIES } from '@/lib/constants';

const SearchBar = dynamic(
  () => import('@/components/common/SearchBar').then(m => ({ default: m.SearchBar })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[42px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center px-3 gap-2">
        <Search className="w-4 h-4 text-slate-300" />
        <span className="text-sm text-slate-500">Search tools...</span>
      </div>
    ),
  }
);

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations();

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 font-heading font-bold text-xl text-primary-800 dark:text-primary-400">
              <span className="w-8 h-8 bg-gradient-to-br from-blue-800 to-blue-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-400" fill="currentColor" />
              </span>
              <span className="hidden sm:block">ToolsArena</span>
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1 ml-2">
              {NAV_CATEGORIES.map(cat => (
                <Link
                  key={cat.slug}
                  href={cat.href}
                  className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
                >
                  {t(cat.nameKey)}
                </Link>
              ))}
              <Link
                href="/guides"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden />
                Guides
              </Link>
            </nav>

            {/* Search */}
            <div className="flex-1 hidden sm:block max-w-md ml-auto">
              <SearchBar />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-1 ml-auto sm:ml-2">
              <LanguageSwitcher />
              <ThemeToggle />
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="sm:hidden pb-3">
            <SearchBar placeholder={t('common.searchMobile')} />
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
