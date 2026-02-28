import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PercentageCalculatorTool } from './PercentageCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('percentage-calculator')!);
}
export default function PercentageCalculatorPage() {
  return <ToolPageWrapper slug="percentage-calculator"><PercentageCalculatorTool /></ToolPageWrapper>;
}
