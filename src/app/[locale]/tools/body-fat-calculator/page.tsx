import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { BodyFatCalculatorTool } from './BodyFatCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('body-fat-calculator')!);
}

export default function BodyFatCalculatorPage() {
  return (
    <ToolPageWrapper slug="body-fat-calculator">
      <BodyFatCalculatorTool />
    </ToolPageWrapper>
  );
}
