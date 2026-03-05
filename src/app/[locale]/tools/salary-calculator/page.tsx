import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { SalaryCalculatorTool } from './SalaryCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('salary-calculator')!);
}

export default function SalaryCalculatorPage() {
  return (
    <ToolPageWrapper slug="salary-calculator">
      <SalaryCalculatorTool />
    </ToolPageWrapper>
  );
}
