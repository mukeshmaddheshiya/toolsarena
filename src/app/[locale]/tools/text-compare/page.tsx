import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TextCompareTool } from './TextCompareTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('text-compare')!);
}

export default function Page() {
  return <ToolPageWrapper slug="text-compare"><TextCompareTool /></ToolPageWrapper>;
}
