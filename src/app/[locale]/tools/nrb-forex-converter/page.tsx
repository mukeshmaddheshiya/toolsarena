import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NrbForexConverterTool } from './NrbForexConverterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('nrb-forex-converter')!);
}
export default function NrbForexConverterPage() {
  return <ToolPageWrapper slug="nrb-forex-converter"><NrbForexConverterTool /></ToolPageWrapper>;
}
