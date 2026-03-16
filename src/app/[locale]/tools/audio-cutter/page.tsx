import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { AudioCutterTool } from './AudioCutterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('audio-cutter')!);
}
export default function AudioCutterPage() {
  return <ToolPageWrapper slug="audio-cutter"><AudioCutterTool /></ToolPageWrapper>;
}
