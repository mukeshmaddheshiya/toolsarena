import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { GSTCalculatorTool } from './GSTCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('gst-calculator')!);
}
export default function GSTCalculatorPage() {
  return <ToolPageWrapper slug="gst-calculator"><GSTCalculatorTool /></ToolPageWrapper>;
}
