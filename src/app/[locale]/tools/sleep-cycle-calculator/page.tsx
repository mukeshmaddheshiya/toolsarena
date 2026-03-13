import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { SleepCycleCalculatorTool } from './SleepCycleCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('sleep-cycle-calculator')!);
}

export default function SleepCycleCalculatorPage() {
  return (
    <ToolPageWrapper slug="sleep-cycle-calculator">
      <SleepCycleCalculatorTool />
    </ToolPageWrapper>
  );
}
