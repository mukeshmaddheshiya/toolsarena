import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NepalVehicleLoanCalculatorTool } from './NepalVehicleLoanCalculatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('nepal-vehicle-loan-calculator')!);
}

export default function NepalVehicleLoanCalculatorPage() {
  return (
    <ToolPageWrapper slug="nepal-vehicle-loan-calculator">
      <NepalVehicleLoanCalculatorTool />
    </ToolPageWrapper>
  );
}
