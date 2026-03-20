import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { SalaryHikeCalculatorTool } from './SalaryHikeCalculatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('salary-hike-calculator')!);
}

export default function SalaryHikeCalculatorPage() {
  return (
    <ToolPageWrapper slug="salary-hike-calculator">
      <SalaryHikeCalculatorTool />
    </ToolPageWrapper>
  );
}
