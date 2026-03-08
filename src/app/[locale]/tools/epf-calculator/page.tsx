import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { EpfCalculatorTool } from './EpfCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('epf-calculator')!);
}
export default function Page() {
  return <ToolPageWrapper slug="epf-calculator"><EpfCalculatorTool /></ToolPageWrapper>;
}
