import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { VideoToGifTool } from './VideoToGifTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('video-to-gif')!);
}
export default function VideoToGifPage() {
  return <ToolPageWrapper slug="video-to-gif"><VideoToGifTool /></ToolPageWrapper>;
}
