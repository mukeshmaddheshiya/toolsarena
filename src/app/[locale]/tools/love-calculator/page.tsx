import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { LoveCalculatorTool } from './LoveCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('love-calculator')!);
}

export default function LoveCalculatorPage() {
  return (
    <ToolPageWrapper slug="love-calculator">
      <LoveCalculatorTool />
    </ToolPageWrapper>
  );
}
