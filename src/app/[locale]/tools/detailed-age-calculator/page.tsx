import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { DetailedAgeCalculatorTool } from './DetailedAgeCalculatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('detailed-age-calculator')!);
}

export default function DetailedAgeCalculatorPage() {
  return (
    <ToolPageWrapper slug="detailed-age-calculator">
      <DetailedAgeCalculatorTool />
    </ToolPageWrapper>
  );
}
