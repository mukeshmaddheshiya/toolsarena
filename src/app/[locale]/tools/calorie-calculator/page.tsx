import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CalorieCalculatorTool } from './CalorieCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('calorie-calculator')!);
}
export default function CalorieCalculatorPage() {
  return <ToolPageWrapper slug="calorie-calculator"><CalorieCalculatorTool /></ToolPageWrapper>;
}
