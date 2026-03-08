import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { Dream11PointsCalculatorTool } from './Dream11PointsCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('dream11-points-calculator')!);
}
export default function Page() {
  return <ToolPageWrapper slug="dream11-points-calculator"><Dream11PointsCalculatorTool /></ToolPageWrapper>;
}
