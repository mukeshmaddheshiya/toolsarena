import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { SIPCalculatorTool } from './SIPCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('sip-calculator')!);
}
export default function SIPCalculatorPage() {
  return <ToolPageWrapper slug="sip-calculator"><SIPCalculatorTool /></ToolPageWrapper>;
}
