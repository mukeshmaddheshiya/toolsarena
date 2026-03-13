import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NepalFiscalYearConverterTool } from './NepalFiscalYearConverterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('nepal-fiscal-year-converter')!);
}
export default function NepalFiscalYearConverterPage() {
  return <ToolPageWrapper slug="nepal-fiscal-year-converter"><NepalFiscalYearConverterTool /></ToolPageWrapper>;
}
