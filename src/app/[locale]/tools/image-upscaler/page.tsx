import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ImageUpscalerTool } from './ImageUpscalerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('image-upscaler')!);
}
export default function ImageUpscalerPage() {
  return <ToolPageWrapper slug="image-upscaler"><ImageUpscalerTool /></ToolPageWrapper>;
}
