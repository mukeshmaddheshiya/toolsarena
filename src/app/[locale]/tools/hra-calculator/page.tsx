import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { HRACalculatorTool } from './HraCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('hra-calculator')!);
}

export default function HRACalculatorPage() {
  return (
    <ToolPageWrapper slug="hra-calculator">
      <HRACalculatorTool />
    </ToolPageWrapper>
  );
}
