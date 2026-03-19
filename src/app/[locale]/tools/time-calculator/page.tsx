import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TimeCalculatorTool } from './TimeCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('time-calculator')!);
}
export default function TimeCalculatorPage() {
  return <ToolPageWrapper slug="time-calculator"><TimeCalculatorTool /></ToolPageWrapper>;
}
