import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { FdRdCalculatorTool } from './FdRdCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('fd-rd-calculator')!);
}
export default function FdRdCalculatorPage() {
  return <ToolPageWrapper slug="fd-rd-calculator"><FdRdCalculatorTool /></ToolPageWrapper>;
}
