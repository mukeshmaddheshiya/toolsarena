import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { StampDutyCalculatorTool } from './StampDutyCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('stamp-duty-calculator')!);
}

export default function StampDutyCalculatorPage() {
  return (
    <ToolPageWrapper slug="stamp-duty-calculator">
      <StampDutyCalculatorTool />
    </ToolPageWrapper>
  );
}
