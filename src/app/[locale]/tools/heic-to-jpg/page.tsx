import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { HeicToJpgTool } from './HeicToJpgTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('heic-to-jpg')!);
}
export default function HeicToJpgPage() {
  return <ToolPageWrapper slug="heic-to-jpg"><HeicToJpgTool /></ToolPageWrapper>;
}
