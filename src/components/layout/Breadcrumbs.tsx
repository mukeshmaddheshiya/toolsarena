import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [{ name: 'Home', href: '/' }, ...items];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.href ? `https://toolsarena.in${item.href}` : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
        {allItems.map((item, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
            {item.href && i < allItems.length - 1 ? (
              <Link href={item.href} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1">
                {i === 0 && <Home className="w-3.5 h-3.5" />}
                <span>{i === 0 ? '' : item.name}</span>
              </Link>
            ) : (
              <span className="text-slate-900 dark:text-slate-100 font-medium">
                {i === 0 ? <Home className="w-3.5 h-3.5" /> : item.name}
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
