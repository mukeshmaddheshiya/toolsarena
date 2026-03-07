import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PeriodCalculatorTool } from './PeriodCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('period-ovulation-calculator')!);
}

export default function PeriodCalculatorPage() {
  return (
    <ToolPageWrapper slug="period-ovulation-calculator">
      <PeriodCalculatorTool />
    </ToolPageWrapper>
  );
}
