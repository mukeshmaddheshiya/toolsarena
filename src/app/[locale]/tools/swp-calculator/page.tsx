import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { SwpCalculatorTool } from './SwpCalculatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('swp-calculator')!);
}

export default function SwpCalculatorPage() {
  return (
    <ToolPageWrapper slug="swp-calculator">
      <SwpCalculatorTool />
    </ToolPageWrapper>
  );
}
