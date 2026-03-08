import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { GpaCalculatorTool } from './GpaCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('gpa-calculator')!);
}
export default function Page() {
  return <ToolPageWrapper slug="gpa-calculator"><GpaCalculatorTool /></ToolPageWrapper>;
}
