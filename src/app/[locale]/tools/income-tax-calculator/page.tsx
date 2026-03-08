import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { IncomeTaxCalculatorTool } from './IncomeTaxCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('income-tax-calculator')!);
}

export default function Page() {
  return (
    <ToolPageWrapper slug="income-tax-calculator">
      <IncomeTaxCalculatorTool />
    </ToolPageWrapper>
  );
}
