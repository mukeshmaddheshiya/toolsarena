import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NepalVatCalculatorTool } from './NepalVatCalculatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('nepal-vat-calculator')!);
}

export default function NepalVatCalculatorPage() {
  return (
    <ToolPageWrapper slug="nepal-vat-calculator">
      <NepalVatCalculatorTool />
    </ToolPageWrapper>
  );
}
