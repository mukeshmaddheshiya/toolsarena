import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { LoanEligibilityCalculatorTool } from './LoanEligibilityCalculatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('loan-eligibility-calculator')!);
}

export default function LoanEligibilityCalculatorPage() {
  return (
    <ToolPageWrapper slug="loan-eligibility-calculator">
      <LoanEligibilityCalculatorTool />
    </ToolPageWrapper>
  );
}
