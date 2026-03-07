import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { RentVsBuyCalculatorTool } from './RentVsBuyCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('rent-vs-buy-calculator')!);
}

export default function RentVsBuyCalculatorPage() {
  return (
    <ToolPageWrapper slug="rent-vs-buy-calculator">
      <RentVsBuyCalculatorTool />
    </ToolPageWrapper>
  );
}
