'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Zap, Menu } from 'lucide-react';
import { SearchBar } from '@/components/common/SearchBar';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { MobileNav } from './MobileNav';
import { NAV_CATEGORIES } from '@/lib/constants';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 font-heading font-bold text-xl text-primary-800 dark:text-primary-400">
              <span className="w-8 h-8 bg-primary-800 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" fill="currentColor" />
              </span>
              <span className="hidden sm:block">ToolsArena</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 ml-2">
              {NAV_CATEGORIES.map(cat => (
                <Link
                  key={cat.slug}
                  href={cat.href}
                  className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>

            {/* Search */}
            <div className="flex-1 hidden sm:block max-w-md ml-auto">
              <SearchBar />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 ml-auto sm:ml-2">
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
            <SearchBar placeholder="Search tools..." />
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
