import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { Mp4ToMp3Tool } from './Mp4ToMp3Tool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('mp4-to-mp3')!);
}
export default function Mp4ToMp3Page() {
  return <ToolPageWrapper slug="mp4-to-mp3"><Mp4ToMp3Tool /></ToolPageWrapper>;
}
