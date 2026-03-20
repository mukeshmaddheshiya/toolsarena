import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { LoanVsLeaseCalculatorTool } from './LoanVsLeaseCalculatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('loan-vs-lease-calculator')!);
}

export default function LoanVsLeaseCalculatorPage() {
  return (
    <ToolPageWrapper slug="loan-vs-lease-calculator">
      <LoanVsLeaseCalculatorTool />
    </ToolPageWrapper>
  );
}
