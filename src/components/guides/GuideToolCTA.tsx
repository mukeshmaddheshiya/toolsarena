import { Zap, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Guide } from '@/types/guides';
import { cn } from '@/lib/utils';

interface GuideToolCTAProps {
  guide: Guide;
  /** 'inline' = wide card inside article; 'sidebar' = compact card in sidebar; 'footer' = full-width footer CTA */
  variant?: 'inline' | 'sidebar' | 'footer';
}

export function GuideToolCTA({ guide, variant = 'inline' }: GuideToolCTAProps) {
  if (variant === 'sidebar') {
    return (
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-amber-300" fill="currentColor" aria-hidden />
          </span>
          <span className="text-xs font-semibold text-primary-200 uppercase tracking-wider">Free Tool</span>
        </div>
        <h3 className="font-heading font-bold text-base leading-snug mb-2">
          {guide.toolCTA.heading}
        </h3>
        <p className="text-xs text-primary-200 leading-relaxed mb-4">
          {guide.toolCTA.description}
        </p>
        <Link
          href={`/tools/${guide.toolSlug}`}
          className="flex items-center justify-center gap-2 w-full bg-white text-primary-700 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-primary-50 transition-colors"
        >
          {guide.toolCTA.buttonText}
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="mt-12 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 rounded-2xl p-8 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(249,115,22,0.15),transparent_60%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium mb-4">
            <Zap className="w-3.5 h-3.5 text-amber-400" fill="currentColor" aria-hidden />
            Free — No Signup Required
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-3 leading-tight">
            {guide.toolCTA.heading}
          </h2>
          <p className="text-primary-200 mb-6 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            {guide.toolCTA.description}
          </p>
          <Link
            href={`/tools/${guide.toolSlug}`}
            className="inline-flex items-center gap-2 bg-white text-primary-800 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg text-sm"
          >
            {guide.toolCTA.buttonText}
            <ExternalLink className="w-4 h-4" aria-hidden />
          </Link>
        </div>
      </div>
    );
  }

  // inline (default) — wide card inside article
  return (
    <div className={cn(
      'my-8 flex flex-col sm:flex-row items-start sm:items-center gap-5',
      'bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-950/40 dark:to-slate-800',
      'border border-primary-200 dark:border-primary-800 rounded-2xl p-6'
    )}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <Zap className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="currentColor" aria-hidden />
          <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
            Free Tool
          </span>
        </div>
        <h3 className="font-heading font-bold text-slate-900 dark:text-slate-100 mb-1">
          {guide.toolCTA.heading}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {guide.toolCTA.description}
        </p>
      </div>
      <Link
        href={`/tools/${guide.toolSlug}`}
        className="shrink-0 inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors shadow-sm whitespace-nowrap"
      >
        {guide.toolCTA.buttonText}
        <ArrowRight className="w-4 h-4" aria-hidden />
      </Link>
    </div>
  );
}
