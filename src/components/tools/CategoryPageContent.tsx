import { ToolCard } from '@/components/tools/ToolCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { getToolsByCategory, categories } from '@/lib/tools-registry';
import { SITE_URL, SITE_NAME, CATEGORY_NAME_KEYS } from '@/lib/constants';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ToolCategory } from '@/types/tools';

interface CategoryPageContentProps {
  categoryKey: ToolCategory;
  locale: string;
}

export async function CategoryPageContent({ categoryKey, locale }: CategoryPageContentProps) {
  setRequestLocale(locale);
  const t = await getTranslations();
  const cat = categories[categoryKey];
  const catTools = getToolsByCategory(categoryKey);
  const nameKey = CATEGORY_NAME_KEYS[categoryKey];
  const categoryName = nameKey ? t(nameKey) : cat.name;

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryName,
    description: cat.description,
    url: `${SITE_URL}/category/${categoryKey}`,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: catTools.length,
      itemListElement: catTools.map((tool, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: tool.name,
        url: `${SITE_URL}/tools/${tool.slug}`,
        description: tool.shortDescription,
      })),
    },
  };

  return (
    <>
      <JsonLd data={collectionSchema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-100">{categoryName}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{cat.description}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {catTools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
        </div>
      </div>
    </>
  );
}
