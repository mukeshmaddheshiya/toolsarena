import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { DematChargesCalculatorTool } from './DematChargesCalculatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('demat-charges-calculator')!);
}

export default function DematChargesCalculatorPage() {
  return (
    <ToolPageWrapper slug="demat-charges-calculator">
      <DematChargesCalculatorTool />
    </ToolPageWrapper>
  );
}
