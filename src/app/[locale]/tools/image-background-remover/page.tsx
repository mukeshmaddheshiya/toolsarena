import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ImageBackgroundRemoverTool } from './ImageBackgroundRemoverTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('image-background-remover')!);
}

export default function ImageBackgroundRemoverPage() {
  return (
    <ToolPageWrapper slug="image-background-remover">
      <ImageBackgroundRemoverTool />
    </ToolPageWrapper>
  );
}
