import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { LoremIpsumTool } from './LoremIpsumTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('lorem-ipsum-generator')!);
}
export default function LoremIpsumPage() {
  return <ToolPageWrapper slug="lorem-ipsum-generator"><LoremIpsumTool /></ToolPageWrapper>;
}
