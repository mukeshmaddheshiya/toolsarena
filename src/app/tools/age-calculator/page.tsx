import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { AgeCalculatorTool } from './AgeCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('age-calculator')!);
}
export default function AgeCalculatorPage() {
  return <ToolPageWrapper slug="age-calculator"><AgeCalculatorTool /></ToolPageWrapper>;
}
