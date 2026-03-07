import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { NocGeneratorTool } from './NocGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('noc-generator')!);
}

export default function Page() {
  return <ToolPageWrapper slug="noc-generator"><NocGeneratorTool /></ToolPageWrapper>;
}
