import type { Metadata } from 'next';
import { ToolCard } from '@/components/tools/ToolCard';
import { getToolsByCategory, categories } from '@/lib/tools-registry';

export const metadata: Metadata = {
  title: 'Calculators - Free Online EMI, SIP, GST, BMI & Age Calculator | ToolsArena',
  description: 'Free online calculators for EMI, SIP, GST, BMI, age, percentage, discount and more. Accurate Indian financial calculators with detailed breakdown.',
  alternates: { canonical: 'https://toolsarena.in/category/calculators' },
};

export default function CalculatorsPage() {
  const cat = categories['calculators'];
  const catTools = getToolsByCategory('calculators');
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
