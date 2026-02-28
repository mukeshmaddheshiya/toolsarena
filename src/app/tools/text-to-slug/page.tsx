import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TextToSlugTool } from './TextToSlugTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('text-to-slug')!);
}
export default function TextToSlugPage() {
  return <ToolPageWrapper slug="text-to-slug"><TextToSlugTool /></ToolPageWrapper>;
}
