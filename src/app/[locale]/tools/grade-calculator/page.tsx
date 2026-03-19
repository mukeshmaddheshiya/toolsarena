import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { GradeCalculatorTool } from './GradeCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('grade-calculator')!);
}
export default function GradeCalculatorPage() {
  return <ToolPageWrapper slug="grade-calculator"><GradeCalculatorTool /></ToolPageWrapper>;
}
