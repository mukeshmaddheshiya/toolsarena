import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ScientificCalculatorTool } from './ScientificCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('scientific-calculator')!);
}
export default function ScientificCalculatorPage() {
  return <ToolPageWrapper slug="scientific-calculator"><ScientificCalculatorTool /></ToolPageWrapper>;
}
