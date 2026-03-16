import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { VideoCompressorTool } from './VideoCompressorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('video-compressor')!);
}
export default function VideoCompressorPage() {
  return <ToolPageWrapper slug="video-compressor"><VideoCompressorTool /></ToolPageWrapper>;
}
