import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { LumpsumCalculatorTool } from './LumpsumCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('lumpsum-calculator')!);
}
export default function LumpsumCalculatorPage() {
  return <ToolPageWrapper slug="lumpsum-calculator"><LumpsumCalculatorTool /></ToolPageWrapper>;
}
