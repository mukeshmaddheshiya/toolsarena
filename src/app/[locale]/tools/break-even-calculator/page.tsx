import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { BreakEvenCalculatorTool } from './BreakEvenCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('break-even-calculator')!);
}

export default function BreakEvenCalculatorPage() {
  return (
    <ToolPageWrapper slug="break-even-calculator">
      <BreakEvenCalculatorTool />
    </ToolPageWrapper>
  );
}
