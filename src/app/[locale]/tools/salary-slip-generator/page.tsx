import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { SalarySlipGeneratorTool } from './SalarySlipGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('salary-slip-generator')!);
}
export default function SalarySlipGeneratorPage() {
  return <ToolPageWrapper slug="salary-slip-generator"><SalarySlipGeneratorTool /></ToolPageWrapper>;
}
