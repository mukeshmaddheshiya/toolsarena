import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { GifMakerTool } from './GifMakerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('gif-maker')!);
}
export default function GifMakerPage() {
  return <ToolPageWrapper slug="gif-maker"><GifMakerTool /></ToolPageWrapper>;
}
