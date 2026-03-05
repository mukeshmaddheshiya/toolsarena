import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { PregnancyCalculatorTool } from './PregnancyCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('pregnancy-calculator')!);
}

export default function PregnancyCalculatorPage() {
  return (
    <ToolPageWrapper slug="pregnancy-calculator">
      <PregnancyCalculatorTool />
    </ToolPageWrapper>
  );
}
