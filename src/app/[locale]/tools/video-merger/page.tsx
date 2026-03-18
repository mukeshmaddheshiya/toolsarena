import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { VideoMergerTool } from './VideoMergerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('video-merger')!);
}
export default function VideoMergerPage() {
  return <ToolPageWrapper slug="video-merger"><VideoMergerTool /></ToolPageWrapper>;
}
