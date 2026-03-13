import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { MarkupMarginCalculatorTool } from './MarkupMarginCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('markup-margin-calculator')!);
}

export default function MarkupMarginCalculatorPage() {
  return (
    <ToolPageWrapper slug="markup-margin-calculator">
      <MarkupMarginCalculatorTool />
    </ToolPageWrapper>
  );
}
