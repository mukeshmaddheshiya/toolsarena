import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CurrencyConverterLiveTool } from './CurrencyConverterLiveTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('currency-converter-live')!);
}

export default function CurrencyConverterLivePage() {
  return (
    <ToolPageWrapper slug="currency-converter-live">
      <CurrencyConverterLiveTool />
    </ToolPageWrapper>
  );
}
