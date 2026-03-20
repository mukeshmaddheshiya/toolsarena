import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NepalTelecomCalculatorTool } from './NepalTelecomCalculatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('nepal-telecom-calculator')!);
}

export default function NepalTelecomCalculatorPage() {
  return (
    <ToolPageWrapper slug="nepal-telecom-calculator">
      <NepalTelecomCalculatorTool />
    </ToolPageWrapper>
  );
}
