import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NPSCalculatorTool } from './NPSCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('nps-calculator')!);
}
export default function NPSCalculatorPage() {
  return <ToolPageWrapper slug="nps-calculator"><NPSCalculatorTool /></ToolPageWrapper>;
}
