import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { BMICalculatorTool } from './BMICalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('bmi-calculator')!);
}
export default function BMICalculatorPage() {
  return <ToolPageWrapper slug="bmi-calculator"><BMICalculatorTool /></ToolPageWrapper>;
}
