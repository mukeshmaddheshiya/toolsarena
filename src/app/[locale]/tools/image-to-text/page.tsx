import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ImageToTextTool } from './ImageToTextTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('image-to-text')!);
}

export default function ImageToTextPage() {
  return (
    <ToolPageWrapper slug="image-to-text">
      <ImageToTextTool />
    </ToolPageWrapper>
  );
}
