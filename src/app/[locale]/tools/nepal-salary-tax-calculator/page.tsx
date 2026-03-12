import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NepalSalaryTaxCalculatorTool } from './NepalSalaryTaxCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('nepal-salary-tax-calculator')!);
}
export default function NepalSalaryTaxCalculatorPage() {
  return <ToolPageWrapper slug="nepal-salary-tax-calculator"><NepalSalaryTaxCalculatorTool /></ToolPageWrapper>;
}
