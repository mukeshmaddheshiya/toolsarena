import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NepalLandConverterTool } from './NepalLandConverterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('nepal-land-converter')!);
}
export default function NepalLandConverterPage() {
  return <ToolPageWrapper slug="nepal-land-converter"><NepalLandConverterTool /></ToolPageWrapper>;
}
