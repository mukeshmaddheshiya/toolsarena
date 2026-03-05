import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TaxRegimeCalculatorTool } from './TaxRegimeCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('tax-regime-calculator')!);
}

export default function TaxRegimeCalculatorPage() {
  return (
    <ToolPageWrapper slug="tax-regime-calculator">
      <TaxRegimeCalculatorTool />
    </ToolPageWrapper>
  );
}
