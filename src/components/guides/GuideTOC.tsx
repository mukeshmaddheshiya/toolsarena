'use client';

import { useState, useEffect } from 'react';
import { List, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TOCItem {
  id: string;
  title: string;
}

interface GuideTOCProps {
  items: TOCItem[];
}

export function GuideTOC({ items }: GuideTOCProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost visible section
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0% -60% 0%', threshold: 0 }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100; // sticky header height
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        className="lg:hidden w-full flex items-center justify-between px-5 py-4"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
          <List className="w-4 h-4 text-primary-600" aria-hidden />
          Table of Contents
        </span>
        <ChevronDown
          className={cn('w-4 h-4 text-slate-500 transition-transform duration-200', isOpen && 'rotate-180')}
          aria-hidden
        />
      </button>

      {/* Desktop header (always visible) */}
      <div className="hidden lg:flex items-center gap-2 px-5 pt-5 pb-3">
        <List className="w-4 h-4 text-primary-600 shrink-0" aria-hidden />
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Contents
        </p>
      </div>

      {/* TOC list */}
      <nav
        aria-label="Table of contents"
        className={cn('pb-4 px-3', isOpen ? 'block' : 'hidden lg:block')}
      >
        <ol className="space-y-0.5">
          {items.map((item, index) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleClick(item.id)}
                  className={cn(
                    'w-full text-left flex items-start gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-150',
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-400 font-semibold border-l-2 border-primary-500 rounded-l-none pl-[calc(0.75rem-2px)]'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  )}
                >
                  <span className={cn(
                    'shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5',
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  )}>
                    {index + 1}
                  </span>
                  <span className="leading-snug">{item.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
