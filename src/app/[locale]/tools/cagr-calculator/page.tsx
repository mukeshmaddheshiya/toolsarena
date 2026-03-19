import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CAGRCalculatorTool } from './CAGRCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('cagr-calculator')!);
}
export default function CAGRCalculatorPage() {
  return <ToolPageWrapper slug="cagr-calculator"><CAGRCalculatorTool /></ToolPageWrapper>;
}
