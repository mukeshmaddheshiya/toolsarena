import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NumerologyCalculatorTool } from './NumerologyCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('numerology-calculator')!);
}

export default function NumerologyCalculatorPage() {
  return (
    <ToolPageWrapper slug="numerology-calculator">
      <NumerologyCalculatorTool />
    </ToolPageWrapper>
  );
}
