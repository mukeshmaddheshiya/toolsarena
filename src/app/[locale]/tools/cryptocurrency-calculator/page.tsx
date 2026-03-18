import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CryptocurrencyCalculatorTool } from './CryptocurrencyCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('cryptocurrency-calculator')!);
}

export default function CryptocurrencyCalculatorPage() {
  return (
    <ToolPageWrapper slug="cryptocurrency-calculator">
      <CryptocurrencyCalculatorTool />
    </ToolPageWrapper>
  );
}
