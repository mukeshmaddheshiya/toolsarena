import type { Metadata } from 'next';
import { ToolCard } from '@/components/tools/ToolCard';
import { getToolsByCategory, categories } from '@/lib/tools-registry';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'PDF Tools - Free Online PDF Merger, Splitter & Compressor | ToolsArena',
  description: 'Free online PDF tools: merge, split, compress PDF files in your browser. No upload to server, completely private. Fast and easy PDF processing.',
  alternates: { canonical: `${SITE_URL}/category/pdf-tools` },
};

export default function PDFToolsPage() {
  const cat = categories['pdf-tools'];
  const catTools = getToolsByCategory('pdf-tools');
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-100">{cat.name}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{cat.description}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {catTools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
      </div>
    </div>
  );
}
