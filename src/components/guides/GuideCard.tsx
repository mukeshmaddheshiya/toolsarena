import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Guide } from '@/types/guides';
import { cn } from '@/lib/utils';

const CATEGORY_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  'text-tools':      { bg: 'bg-blue-50 dark:bg-blue-950/50',   text: 'text-blue-700 dark:text-blue-400',   dot: 'bg-blue-500' },
  'calculators':     { bg: 'bg-green-50 dark:bg-green-950/50', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500' },
  'image-tools':     { bg: 'bg-purple-50 dark:bg-purple-950/50', text: 'text-purple-700 dark:text-purple-400', dot: 'bg-purple-500' },
  'developer-tools': { bg: 'bg-orange-50 dark:bg-orange-950/50', text: 'text-orange-700 dark:text-orange-400', dot: 'bg-orange-500' },
  'pdf-tools':       { bg: 'bg-red-50 dark:bg-red-950/50',     text: 'text-red-700 dark:text-red-400',     dot: 'bg-red-500' },
  'converters':      { bg: 'bg-amber-50 dark:bg-amber-950/50', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' },
  'seo-tools':       { bg: 'bg-teal-50 dark:bg-teal-950/50',   text: 'text-teal-700 dark:text-teal-400',   dot: 'bg-teal-500' },
};

const CATEGORY_LABELS: Record<string, string> = {
  'text-tools': 'Text Tools', 'calculators': 'Calculators', 'image-tools': 'Image Tools',
  'developer-tools': 'Developer Tools', 'pdf-tools': 'PDF Tools', 'converters': 'Converters',
  'seo-tools': 'SEO Tools',
};

interface GuideCardProps {
  guide: Guide;
  variant?: 'default' | 'compact';
}

export function GuideCard({ guide, variant = 'default' }: GuideCardProps) {
  const style = CATEGORY_STYLES[guide.category] ?? CATEGORY_STYLES['text-tools'];
  const categoryLabel = CATEGORY_LABELS[guide.category] ?? guide.category;

  if (variant === 'compact') {
    return (
      <Link
        href={`/guides/${guide.slug}`}
        className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
      >
        <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center shrink-0 mt-0.5">
          <BookOpen className="w-4 h-4 text-primary-600 dark:text-primary-400" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-snug">
            {guide.title.split(':')[0]}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{guide.readingTime}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all duration-200 overflow-hidden"
    >
      {/* Top accent bar */}
      <div className={cn('h-1', style.dot.replace('bg-', 'bg-gradient-to-r from-') + ' to-transparent opacity-60')} />

      <div className="p-6 flex flex-col flex-1">
        {/* Category badge + reading time */}
        <div className="flex items-center justify-between mb-4">
          <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', style.bg, style.text)}>
            <span className={cn('w-1.5 h-1.5 rounded-full', style.dot)} />
            {categoryLabel}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <Clock className="w-3 h-3" aria-hidden />
            {guide.readingTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors leading-snug mb-2 line-clamp-2">
          {guide.title.split(':')[0]}
        </h3>

        {/* Subtitle */}
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 flex-1 mb-4">
          {guide.subtitle}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {guide.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-md font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-1.5 text-sm font-semibold text-primary-700 dark:text-primary-400 group-hover:gap-2.5 transition-all duration-200 mt-auto">
          Read Guide
          <ArrowRight className="w-4 h-4" aria-hidden />
        </div>
      </div>
    </Link>
  );
}
