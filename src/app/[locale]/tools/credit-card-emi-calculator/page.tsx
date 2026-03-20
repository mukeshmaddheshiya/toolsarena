import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CreditCardEmiCalculatorTool } from './CreditCardEmiCalculatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('credit-card-emi-calculator')!);
}

export default function CreditCardEmiCalculatorPage() {
  return (
    <ToolPageWrapper slug="credit-card-emi-calculator">
      <CreditCardEmiCalculatorTool />
    </ToolPageWrapper>
  );
}
