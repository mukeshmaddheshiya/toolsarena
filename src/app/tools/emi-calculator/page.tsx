import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { EMICalculatorTool } from './EMICalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('emi-calculator')!);
}
export default function EMICalculatorPage() {
  return <ToolPageWrapper slug="emi-calculator"><EMICalculatorTool /></ToolPageWrapper>;
}
