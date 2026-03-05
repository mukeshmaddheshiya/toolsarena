import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { GratuityCalculatorTool } from './GratuityCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('gratuity-calculator')!);
}

export default function GratuityCalculatorPage() {
  return (
    <ToolPageWrapper slug="gratuity-calculator">
      <GratuityCalculatorTool />
    </ToolPageWrapper>
  );
}
