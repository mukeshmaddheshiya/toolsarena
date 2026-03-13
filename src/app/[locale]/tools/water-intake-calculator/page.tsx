import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { WaterIntakeCalculatorTool } from './WaterIntakeCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('water-intake-calculator')!);
}

export default function WaterIntakeCalculatorPage() {
  return (
    <ToolPageWrapper slug="water-intake-calculator">
      <WaterIntakeCalculatorTool />
    </ToolPageWrapper>
  );
}
