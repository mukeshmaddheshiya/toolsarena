import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { YouTubeEmbedGeneratorTool } from './YouTubeEmbedGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('youtube-embed-generator')!);
}
export default function YouTubeEmbedGeneratorPage() {
  return <ToolPageWrapper slug="youtube-embed-generator"><YouTubeEmbedGeneratorTool /></ToolPageWrapper>;
}
