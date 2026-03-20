import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CarLoanCalculatorTool } from './CarLoanCalculatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('car-loan-calculator')!);
}

export default function CarLoanCalculatorPage() {
  return (
    <ToolPageWrapper slug="car-loan-calculator">
      <CarLoanCalculatorTool />
    </ToolPageWrapper>
  );
}
