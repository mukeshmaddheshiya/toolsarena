import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { IndianFoodCalorieCounterTool } from './IndianFoodCalorieCounterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('indian-food-calorie-counter')!);
}
export default function Page() {
  return <ToolPageWrapper slug="indian-food-calorie-counter"><IndianFoodCalorieCounterTool /></ToolPageWrapper>;
}
