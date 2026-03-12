import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NepalIncomeTaxCalculatorTool } from './NepalIncomeTaxCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('nepal-income-tax-calculator')!);
}

export default function NepalIncomeTaxCalculatorPage() {
  return (
    <ToolPageWrapper slug="nepal-income-tax-calculator">
      <NepalIncomeTaxCalculatorTool />
    </ToolPageWrapper>
  );
}
