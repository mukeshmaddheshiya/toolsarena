import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { FdMaturityCalculatorTool } from './FdMaturityCalculatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('fd-maturity-calculator')!);
}

export default function FdMaturityCalculatorPage() {
  return (
    <ToolPageWrapper slug="fd-maturity-calculator">
      <FdMaturityCalculatorTool />
    </ToolPageWrapper>
  );
}
