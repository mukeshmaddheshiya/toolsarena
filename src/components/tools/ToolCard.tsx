import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import type { Tool } from '@/types/tools';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

const categoryColors: Record<string, string> = {
  'image-tools': 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  'pdf-tools': 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  'text-tools': 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'calculators': 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  'developer-tools': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'converters': 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
};

export function ToolCard({ tool, className }: ToolCardProps) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[tool.icon] || LucideIcons.Wrench;
  const iconColor = categoryColors[tool.category] || 'bg-primary-50 text-primary-600';

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={cn(
        'group relative flex flex-col p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
        className
      )}
    >
      {/* Badges */}
      <div className="absolute top-3 right-3 flex gap-1">
        {tool.isPopular && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400">
            Popular
          </span>
        )}
        {tool.isNew && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            New
          </span>
        )}
      </div>

      {/* Icon */}
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', iconColor)}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <h3 className="font-heading font-semibold text-slate-900 dark:text-slate-100 text-sm group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors mb-1">
        {tool.name}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 flex-1">
        {tool.shortDescription}
      </p>

      {tool.estimatedTime && (
        <div className="mt-2 text-[10px] text-slate-400 dark:text-slate-500">
          ⚡ {tool.estimatedTime}
        </div>
      )}
    </Link>
  );
}
