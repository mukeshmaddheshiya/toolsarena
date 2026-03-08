import * as LucideIcons from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import type { Tool } from '@/types/tools';

interface RelatedToolsProps {
  tools: Tool[];
  title?: string;
}

export function RelatedTools({ tools, title }: RelatedToolsProps) {
  const t = useTranslations('toolPage');
  if (tools.length === 0) return null;
  return (
    <section className="mt-10">
      <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-slate-100 mb-4">{title || t('relatedTools')}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {tools.map(tool => {
          const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>>)[tool.icon] || LucideIcons.Wrench;
          return (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-center group"
            >
              <span className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 transition-colors">
                <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" aria-hidden={true} />
              </span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors leading-tight">
                {tool.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
