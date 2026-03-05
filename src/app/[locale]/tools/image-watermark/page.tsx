import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ImageWatermarkTool } from './ImageWatermarkTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('image-watermark')!);
}

export default function ImageWatermarkPage() {
  return (
    <ToolPageWrapper slug="image-watermark">
      <ImageWatermarkTool />
    </ToolPageWrapper>
  );
}
