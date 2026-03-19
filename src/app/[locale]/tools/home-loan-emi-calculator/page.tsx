import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { HomeLoanEMICalculatorTool } from './HomeLoanEMICalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('home-loan-emi-calculator')!);
}
export default function HomeLoanEMICalculatorPage() {
  return <ToolPageWrapper slug="home-loan-emi-calculator"><HomeLoanEMICalculatorTool /></ToolPageWrapper>;
}
