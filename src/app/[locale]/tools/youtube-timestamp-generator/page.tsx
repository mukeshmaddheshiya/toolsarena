import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { YouTubeTimestampGeneratorTool } from './YouTubeTimestampGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('youtube-timestamp-generator')!);
}
export default function YouTubeTimestampGeneratorPage() {
  return <ToolPageWrapper slug="youtube-timestamp-generator"><YouTubeTimestampGeneratorTool /></ToolPageWrapper>;
}
