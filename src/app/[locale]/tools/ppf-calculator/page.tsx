import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PPFCalculatorTool } from './PPFCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('ppf-calculator')!);
}

export default function PPFCalculatorPage() {
  return (
    <ToolPageWrapper slug="ppf-calculator">
      <PPFCalculatorTool />
    </ToolPageWrapper>
  );
}
