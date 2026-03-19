import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { SimpleInterestCalculatorTool } from './SimpleInterestCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('simple-interest-calculator')!);
}
export default function SimpleInterestCalculatorPage() {
  return <ToolPageWrapper slug="simple-interest-calculator"><SimpleInterestCalculatorTool /></ToolPageWrapper>;
}
