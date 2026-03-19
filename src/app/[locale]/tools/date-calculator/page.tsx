import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { DateCalculatorTool } from './DateCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('date-calculator')!);
}
export default function DateCalculatorPage() {
  return <ToolPageWrapper slug="date-calculator"><DateCalculatorTool /></ToolPageWrapper>;
}
