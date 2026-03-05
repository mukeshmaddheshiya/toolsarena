import { Home } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { getPopularTools } from '@/lib/tools-registry';

export default function NotFound() {
  const popularTools = getPopularTools(6);
  const t = useTranslations('notFound');

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h1 className="text-8xl font-heading font-bold text-primary-800 dark:text-primary-400 mb-4">404</h1>
      <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">{t('title')}</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8">{t('description')}</p>
      <div className="flex justify-center gap-4 mb-12">
        <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-800 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
          <Home className="w-4 h-4" /> {t('title') === 'Page Not Found' ? 'Go Home' : 'होम जाएं'}
        </Link>
      </div>
      <div>
        <h3 className="text-lg font-heading font-semibold text-slate-900 dark:text-slate-100 mb-4">{t('popularTools')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {popularTools.map(tool => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-left">
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{tool.name}</div>
              <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{tool.shortDescription}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
