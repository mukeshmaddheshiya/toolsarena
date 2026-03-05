import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ImageCropperTool } from './ImageCropperTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('image-cropper')!);
}

export default function ImageCropperPage() {
  return (
    <ToolPageWrapper slug="image-cropper">
      <ImageCropperTool />
    </ToolPageWrapper>
  );
}
