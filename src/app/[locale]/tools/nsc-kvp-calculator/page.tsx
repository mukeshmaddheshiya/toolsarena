import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NscKvpCalculatorTool } from './NscKvpCalculatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('nsc-kvp-calculator')!);
}

export default function NscKvpCalculatorPage() {
  return (
    <ToolPageWrapper slug="nsc-kvp-calculator">
      <NscKvpCalculatorTool />
    </ToolPageWrapper>
  );
}
