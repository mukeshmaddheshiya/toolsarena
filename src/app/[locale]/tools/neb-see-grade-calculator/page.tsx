import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NebSeeGradeCalculatorTool } from './NebSeeGradeCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('neb-see-grade-calculator')!);
}
export default function NebSeeGradeCalculatorPage() {
  return <ToolPageWrapper slug="neb-see-grade-calculator"><NebSeeGradeCalculatorTool /></ToolPageWrapper>;
}
