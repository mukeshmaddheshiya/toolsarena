import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { AspectRatioCalculatorTool } from './AspectRatioCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('aspect-ratio-calculator')!);
}

export default function AspectRatioCalculatorPage() {
  return (
    <ToolPageWrapper slug="aspect-ratio-calculator">
      <AspectRatioCalculatorTool />
    </ToolPageWrapper>
  );
}
