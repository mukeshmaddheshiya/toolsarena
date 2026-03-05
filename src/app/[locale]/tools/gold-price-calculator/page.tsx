import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { GoldPriceCalculatorTool } from './GoldPriceCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('gold-price-calculator')!);
}

export default function GoldPriceCalculatorPage() {
  return (
    <ToolPageWrapper slug="gold-price-calculator">
      <GoldPriceCalculatorTool />
    </ToolPageWrapper>
  );
}
