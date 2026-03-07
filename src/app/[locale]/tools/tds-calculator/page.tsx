import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TdsCalculatorTool } from './TdsCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('tds-calculator')!);
}

export default function Page() {
  return <ToolPageWrapper slug="tds-calculator"><TdsCalculatorTool /></ToolPageWrapper>;
}
