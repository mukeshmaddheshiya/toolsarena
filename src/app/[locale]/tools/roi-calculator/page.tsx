import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { RoiCalculatorTool } from './RoiCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('roi-calculator')!);
}

export default function RoiCalculatorPage() {
  return (
    <ToolPageWrapper slug="roi-calculator">
      <RoiCalculatorTool />
    </ToolPageWrapper>
  );
}
