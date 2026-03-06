import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { LoanComparisonCalculator } from './LoanComparisonCalculator';
export async function generateMetadata(): Promise<Metadata> { return generateToolMetadata(getToolBySlug('loan-comparison-calculator')!); }
export default function LoanComparisonCalculatorPage() { return <ToolPageWrapper slug="loan-comparison-calculator"><LoanComparisonCalculator /></ToolPageWrapper>; }
