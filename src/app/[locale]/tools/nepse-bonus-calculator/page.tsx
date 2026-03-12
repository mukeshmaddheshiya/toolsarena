import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NepseBonusCalculatorTool } from './NepseBonusCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('nepse-bonus-calculator')!);
}
export default function NepseBonusCalculatorPage() {
  return <ToolPageWrapper slug="nepse-bonus-calculator"><NepseBonusCalculatorTool /></ToolPageWrapper>;
}
