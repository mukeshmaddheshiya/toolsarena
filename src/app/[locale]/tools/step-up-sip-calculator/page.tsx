import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { StepUpSipCalculatorTool } from './StepUpSipCalculatorTool';

export async function generateMetadata() {
  return generateToolMetadata(getToolBySlug('step-up-sip-calculator')!);
}

export default function StepUpSipCalculatorPage() {
  return (
    <ToolPageWrapper slug="step-up-sip-calculator">
      <StepUpSipCalculatorTool />
    </ToolPageWrapper>
  );
}
