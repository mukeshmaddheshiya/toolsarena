import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { IdealWeightCalculatorTool } from './IdealWeightCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('ideal-weight-calculator')!);
}

export default function IdealWeightCalculatorPage() {
  return (
    <ToolPageWrapper slug="ideal-weight-calculator">
      <IdealWeightCalculatorTool />
    </ToolPageWrapper>
  );
}
