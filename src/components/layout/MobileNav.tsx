'use client';
import { X, Zap, BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { NAV_CATEGORIES } from '@/lib/constants';
import { useEffect } from 'react';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const t = useTranslations();

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-xl flex flex-col animate-slide-in">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
            <span className="w-9 h-9 bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/20">
              <Zap className="w-5 h-5 text-white drop-shadow-sm" fill="currentColor" strokeWidth={1} />
            </span>
            <span className="flex items-baseline gap-0.5 font-heading font-extrabold text-xl tracking-tight">
              <span className="text-slate-900 dark:text-white">Tools</span>
              <span className="text-orange-500 dark:text-orange-400">Arena</span>
            </span>
          </Link>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close menu">
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('common.categories')}</p>
          <div className="space-y-1">
            {NAV_CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                href={cat.href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-400 transition-colors font-medium"
              >
                {t(cat.nameKey)}
              </Link>
            ))}
            <Link
              href="/guides"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-400 transition-colors font-medium"
            >
              <BookOpen className="w-4 h-4" aria-hidden />
              Guides & Tutorials
            </Link>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <Link href="/about" onClick={onClose} className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">{t('common.about')}</Link>
            <Link href="/contact" onClick={onClose} className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">{t('common.contact')}</Link>
            <Link href="/privacy-policy" onClick={onClose} className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">{t('common.privacyPolicy')}</Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
