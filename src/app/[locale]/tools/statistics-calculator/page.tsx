import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { StatisticsCalculatorTool } from './StatisticsCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('statistics-calculator')!);
}

export default function StatisticsCalculatorPage() {
  return (
    <ToolPageWrapper slug="statistics-calculator">
      <StatisticsCalculatorTool />
    </ToolPageWrapper>
  );
}
