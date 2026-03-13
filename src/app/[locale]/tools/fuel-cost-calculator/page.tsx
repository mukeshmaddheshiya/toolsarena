import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { FuelCostCalculatorTool } from './FuelCostCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('fuel-cost-calculator')!);
}

export default function FuelCostCalculatorPage() {
  return (
    <ToolPageWrapper slug="fuel-cost-calculator">
      <FuelCostCalculatorTool />
    </ToolPageWrapper>
  );
}
