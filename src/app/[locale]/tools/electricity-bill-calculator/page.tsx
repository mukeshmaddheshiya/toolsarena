import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ElectricityBillCalculatorTool } from './ElectricityBillCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('electricity-bill-calculator')!);
}

export default function ElectricityBillCalculatorPage() {
  return (
    <ToolPageWrapper slug="electricity-bill-calculator">
      <ElectricityBillCalculatorTool />
    </ToolPageWrapper>
  );
}
