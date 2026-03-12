import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NepalSalaryCalculatorTool } from './NepalSalaryCalculatorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('nepal-salary-calculator')!);
}

export default function NepalSalaryCalculatorPage() {
  return (
    <ToolPageWrapper slug="nepal-salary-calculator">
      <NepalSalaryCalculatorTool />
    </ToolPageWrapper>
  );
}
