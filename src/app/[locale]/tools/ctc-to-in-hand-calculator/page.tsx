import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CTCToInHandCalculatorTool } from './CTCToInHandCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('ctc-to-in-hand-calculator')!);
}
export default function CTCToInHandCalculatorPage() {
  return <ToolPageWrapper slug="ctc-to-in-hand-calculator"><CTCToInHandCalculatorTool /></ToolPageWrapper>;
}
