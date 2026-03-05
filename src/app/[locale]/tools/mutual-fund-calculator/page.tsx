import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { MutualFundCalculatorTool } from './MutualFundCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('mutual-fund-calculator')!);
}

export default function MutualFundCalculatorPage() {
  return (
    <ToolPageWrapper slug="mutual-fund-calculator">
      <MutualFundCalculatorTool />
    </ToolPageWrapper>
  );
}
