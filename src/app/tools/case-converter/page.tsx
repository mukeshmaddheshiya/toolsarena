import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CaseConverterTool } from './CaseConverterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('case-converter')!);
}
export default function CaseConverterPage() {
  return <ToolPageWrapper slug="case-converter"><CaseConverterTool /></ToolPageWrapper>;
}
