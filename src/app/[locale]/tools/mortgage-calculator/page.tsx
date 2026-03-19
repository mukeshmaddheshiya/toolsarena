import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { MortgageCalculatorTool } from './MortgageCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('mortgage-calculator')!);
}
export default function MortgageCalculatorPage() {
  return <ToolPageWrapper slug="mortgage-calculator"><MortgageCalculatorTool /></ToolPageWrapper>;
}
