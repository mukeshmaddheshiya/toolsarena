import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { YouTubeHashtagGeneratorTool } from './YouTubeHashtagGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('youtube-hashtag-generator')!);
}
export default function YouTubeHashtagGeneratorPage() {
  return <ToolPageWrapper slug="youtube-hashtag-generator"><YouTubeHashtagGeneratorTool /></ToolPageWrapper>;
}
