import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { JsonToTypescriptTool } from './JsonToTypescriptTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('json-to-typescript')!);
}

export default function Page() {
  return <ToolPageWrapper slug="json-to-typescript"><JsonToTypescriptTool /></ToolPageWrapper>;
}
