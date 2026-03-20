import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ElectricityUnitCalculatorTool } from './ElectricityUnitCalculatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('electricity-unit-calculator')!);
}

export default function ElectricityUnitCalculatorPage() {
  return (
    <ToolPageWrapper slug="electricity-unit-calculator">
      <ElectricityUnitCalculatorTool />
    </ToolPageWrapper>
  );
}
