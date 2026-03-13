import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { LoanAmortizationCalculatorTool } from './LoanAmortizationCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('loan-amortization-calculator')!);
}

export default function LoanAmortizationCalculatorPage() {
  return (
    <ToolPageWrapper slug="loan-amortization-calculator">
      <LoanAmortizationCalculatorTool />
    </ToolPageWrapper>
  );
}
