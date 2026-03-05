import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CompoundInterestCalculatorTool } from './CompoundInterestCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('compound-interest-calculator')!);
}
export default function CompoundInterestCalculatorPage() {
  return <ToolPageWrapper slug="compound-interest-calculator"><CompoundInterestCalculatorTool /></ToolPageWrapper>;
}
