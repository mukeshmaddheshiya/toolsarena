import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { JsonToCsvTool } from './JsonToCsvTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('json-to-csv')!);
}
export default function JsonToCsvPage() {
  return <ToolPageWrapper slug="json-to-csv"><JsonToCsvTool /></ToolPageWrapper>;
}
