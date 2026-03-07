import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TdeeMacroCalculatorTool } from './TdeeMacroCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('tdee-macro-calculator')!);
}

export default function TdeeMacroCalculatorPage() {
  return (
    <ToolPageWrapper slug="tdee-macro-calculator">
      <TdeeMacroCalculatorTool />
    </ToolPageWrapper>
  );
}
