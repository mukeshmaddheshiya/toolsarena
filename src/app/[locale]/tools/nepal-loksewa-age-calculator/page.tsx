import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NepalLoksewaAgeCalculatorTool } from './NepalLoksewaAgeCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('nepal-loksewa-age-calculator')!);
}
export default function NepalLoksewaAgeCalculatorPage() {
  return <ToolPageWrapper slug="nepal-loksewa-age-calculator"><NepalLoksewaAgeCalculatorTool /></ToolPageWrapper>;
}
